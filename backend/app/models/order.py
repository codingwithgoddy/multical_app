"""
Order and OrderItem models.
This module contains the Order, OrderItem, and related models for customer orders.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
from decimal import Decimal
import uuid
import enum
import string
import random
from datetime import datetime

class OrderStatus(enum.Enum):
    """Order status enumeration"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class FulfillmentType(enum.Enum):
    """Fulfillment type enumeration"""
    PICKUP = "pickup"
    DELIVERY = "delivery"

class Order(BaseModel):
    """
    Order model for customer orders.
    
    Attributes:
        id (UUID): Primary key
        reference (str): Unique order reference
        customer_id (UUID): Foreign key to customer
        assigned_to (UUID): Foreign key to admin user (worker assigned)
        status (OrderStatus): Order status
        subtotal (Decimal): Product costs
        delivery_fee (Decimal): Delivery fee
        total_amount (Decimal): Subtotal + Delivery Fee
        paid_amount (Decimal): Amount paid so far
        fulfillment_type (FulfillmentType): Pickup or delivery
        delivery_location_id (UUID): Foreign key to delivery location
        delivery_address (str): Custom delivery address
        notes (str): Order notes
        estimated_completion (datetime): Estimated completion time
        created_at (datetime): When the order was created
        updated_at (datetime): When the order was last updated
    """
    
    __tablename__ = 'orders'
    
    reference = db.Column(db.String(20), unique=True, nullable=False)
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id'), nullable=False)
    assigned_to = db.Column(UUID(as_uuid=True), db.ForeignKey('admin_users.id'))
    status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False, default=Decimal('0.00'))
    delivery_fee = db.Column(db.Numeric(10, 2), default=Decimal('0.00'))
    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=Decimal('0.00'))
    paid_amount = db.Column(db.Numeric(10, 2), default=Decimal('0.00'))
    fulfillment_type = db.Column(db.Enum(FulfillmentType), nullable=False, default=FulfillmentType.PICKUP)
    delivery_location_id = db.Column(UUID(as_uuid=True), db.ForeignKey('delivery_locations.id'))
    delivery_address = db.Column(db.Text)
    notes = db.Column(db.Text)
    estimated_completion = db.Column(db.DateTime)
    
    # Relationships
    customer = db.relationship('Customer', back_populates='orders')
    assigned_worker = db.relationship('AdminUser', foreign_keys=[assigned_to], overlaps="assigned_orders")
    delivery_location = db.relationship('DeliveryLocation', foreign_keys=[delivery_location_id], overlaps="orders")
    order_items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    design_files = db.relationship('DesignFile', back_populates='order', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='order')
    
    def __init__(self, **kwargs):
        """Initialize order with auto-generated reference"""
        if 'reference' not in kwargs:
            kwargs['reference'] = self.generate_reference()
        super().__init__(**kwargs)
    
    @staticmethod
    def generate_reference():
        """Generate a unique order reference"""
        # Generate a random 8-character alphanumeric string
        chars = string.ascii_uppercase + string.digits
        reference = ''.join(random.choice(chars) for _ in range(8))
        
        # Ensure uniqueness
        while Order.query.filter_by(reference=reference).first():
            reference = ''.join(random.choice(chars) for _ in range(8))
        
        return reference
    
    def calculate_totals(self):
        """Calculate and update order totals"""
        self.subtotal = sum(item.quantity * item.unit_price for item in self.order_items)
        self.total_amount = self.subtotal + (self.delivery_fee or Decimal('0.00'))
        return self.total_amount
    
    def is_fully_paid(self):
        """Check if the order is fully paid"""
        return self.paid_amount >= self.total_amount
    
    def remaining_balance(self):
        """Calculate remaining balance"""
        return self.total_amount - self.paid_amount
    
    def to_dict(self):
        """Convert the order to a dictionary"""
        result = super().to_dict()
        result.update({
            'status': self.status.value,
            'fulfillment_type': self.fulfillment_type.value,
            'customer_name': self.customer.name if self.customer else None,
            'assigned_worker_name': self.assigned_worker.username if self.assigned_worker else None,
            'delivery_location_name': self.delivery_location.name if self.delivery_location else None,
            'order_items': [item.to_dict() for item in self.order_items],
            'design_files': [file.to_dict() for file in self.design_files],
            'is_fully_paid': self.is_fully_paid(),
            'remaining_balance': float(self.remaining_balance())
        })
        return result
    
    def __repr__(self):
        return f'<Order {self.reference}>'

class OrderItem(BaseModel):
    """
    Order item model for items in an order.
    
    Attributes:
        id (UUID): Primary key
        order_id (UUID): Foreign key to order
        product_id (UUID): Foreign key to product
        quantity (int): Item quantity
        unit_price (Decimal): Price per unit at time of order
        customization_notes (str): Customization notes
    """
    
    __tablename__ = 'order_items'
    
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    customization_notes = db.Column(db.Text)
    
    # Relationships
    order = db.relationship('Order', back_populates='order_items')
    product = db.relationship('Product', back_populates='order_items')
    
    @validates('quantity')
    def validate_quantity(self, key, quantity):
        """Validate quantity"""
        if quantity <= 0:
            raise ValueError("Quantity must be greater than 0")
        return quantity
    
    @validates('unit_price')
    def validate_unit_price(self, key, price):
        """Validate unit price"""
        if price < 0:
            raise ValueError("Unit price cannot be negative")
        return price
    
    def subtotal(self):
        """Calculate item subtotal"""
        return self.quantity * self.unit_price
    
    def to_dict(self):
        """Convert the order item to a dictionary"""
        result = super().to_dict()
        result.update({
            'product_name': self.product.name if self.product else None,
            'subtotal': float(self.subtotal())
        })
        return result
    
    def __repr__(self):
        return f'<OrderItem {self.id}>'