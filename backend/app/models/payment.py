"""
Payment model.
This module contains the Payment model for order payments.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
from decimal import Decimal
import uuid
import enum
from datetime import datetime

class PaymentMethod(enum.Enum):
    """Payment method enumeration"""
    MPESA_STK_PUSH = "mpesa_stk_push"
    MPESA_PAYBILL = "mpesa_paybill"
    CASH = "cash"

class PaymentStatus(enum.Enum):
    """Payment status enumeration"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    AWAITING_CONFIRMATION = "awaiting_confirmation"

class Payment(BaseModel):
    """
    Payment model for order payments.
    
    Attributes:
        id (UUID): Primary key
        order_id (UUID): Foreign key to order
        customer_id (UUID): Foreign key to customer
        amount (Decimal): Payment amount
        payment_method (PaymentMethod): Payment method
        mpesa_transaction_id (str): Mpesa transaction ID
        paybill_reference (str): Customer's reference when paying via paybill
        paybill_confirmation_code (str): SMS confirmation code
        customer_phone (str): Customer phone for paybill verification
        status (PaymentStatus): Payment status
        recorded_by (UUID): Admin who recorded payment
        notes (str): Payment notes
        recorded_at (datetime): When payment was recorded
        confirmed_at (datetime): When payment was confirmed
    """
    
    __tablename__ = 'payments'
    
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey('orders.id'), nullable=False)
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.Enum(PaymentMethod), nullable=False)
    mpesa_transaction_id = db.Column(db.String(50))
    paybill_reference = db.Column(db.String(50))
    paybill_confirmation_code = db.Column(db.String(20))
    customer_phone = db.Column(db.String(20))
    status = db.Column(db.Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    recorded_by = db.Column(UUID(as_uuid=True), db.ForeignKey('admin_users.id'))
    notes = db.Column(db.Text)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    
    # Relationships
    order = db.relationship('Order', back_populates='payments')
    customer = db.relationship('Customer', back_populates='payments')
    recorded_by_admin = db.relationship('AdminUser', foreign_keys=[recorded_by])
    
    @validates('amount')
    def validate_amount(self, key, amount):
        """Validate payment amount"""
        if amount <= 0:
            raise ValueError("Payment amount must be greater than 0")
        return amount
    
    def confirm_payment(self):
        """Confirm the payment"""
        self.status = PaymentStatus.COMPLETED
        self.confirmed_at = datetime.utcnow()
        
        # Update order paid amount
        if self.order:
            self.order.paid_amount += self.amount
        
        # Update customer debt
        if self.customer:
            self.customer.update_debt()
    
    def to_dict(self):
        """Convert the payment to a dictionary"""
        result = super().to_dict()
        result.update({
            'payment_method': self.payment_method.value,
            'status': self.status.value,
            'recorded_by_name': self.recorded_by_admin.username if self.recorded_by_admin else None,
            'customer_name': self.customer.name if self.customer else None,
            'order_reference': self.order.reference if self.order else None
        })
        return result
    
    def __repr__(self):
        return f'<Payment {self.id} - {self.amount}>'