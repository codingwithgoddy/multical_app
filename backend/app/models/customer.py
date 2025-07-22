"""
Customer model.
This module contains the Customer model for the Multiprints business system.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
from decimal import Decimal
import uuid
import re
from datetime import datetime

class Customer(BaseModel):
    """
    Customer model for storing customer information and tracking debt.
    
    Attributes:
        id (UUID): Primary key
        name (str): Customer name
        email (str): Customer email address
        phone (str): Customer phone number
        address (str): Customer physical address
        total_debt (Decimal): Total outstanding debt
        created_at (datetime): When the customer was created
        updated_at (datetime): When the customer was last updated
    """
    
    __tablename__ = 'customers'
    
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text)
    total_debt = db.Column(db.Numeric(10, 2), default=Decimal('0.00'))
    
    # Relationships
    orders = db.relationship('Order', back_populates='customer', lazy='dynamic')
    payments = db.relationship('Payment', back_populates='customer', lazy='dynamic')
    
    @validates('email')
    def validate_email(self, key, email):
        """Validate email format"""
        if email:
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, email):
                raise ValueError("Invalid email format")
        return email
    
    @validates('phone')
    def validate_phone(self, key, phone):
        """Validate phone number format"""
        if not phone:
            raise ValueError("Phone number is required")
        
        # Remove any non-digit characters for validation
        digits_only = ''.join(filter(str.isdigit, phone))
        
        # Check if it's a valid phone number (at least 9 digits)
        if len(digits_only) < 9:
            raise ValueError("Phone number must have at least 9 digits")
        
        return phone
    
    def update_debt(self):
        """
        Update the total debt based on orders and payments.
        
        Returns:
            Decimal: The updated total debt
        """
        # Calculate total order amount
        total_orders = sum((order.total_amount or Decimal('0.00')) for order in self.orders)
        
        # Calculate total payments
        total_payments = sum((payment.amount or Decimal('0.00')) for payment in self.payments if payment.status == 'completed')
        
        # Update total debt
        self.total_debt = total_orders - total_payments
        
        return self.total_debt
    
    def to_dict(self):
        """
        Convert the customer to a dictionary.
        
        Returns:
            dict: Dictionary representation of the customer
        """
        result = super().to_dict()
        result.update({
            'orders_count': self.orders.count(),
            'recent_orders': [order.to_dict() for order in self.orders.order_by(db.desc('created_at')).limit(5)]
        })
        return result
    
    def __repr__(self):
        return f'<Customer {self.name}>'