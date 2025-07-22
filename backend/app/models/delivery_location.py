"""
Delivery location model.
This module contains the DeliveryLocation model for delivery locations.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
from decimal import Decimal
import uuid
from datetime import datetime

class DeliveryLocation(BaseModel):
    """
    Delivery location model for delivery locations.
    
    Attributes:
        id (UUID): Primary key
        name (str): Location name
        description (str): Location description
        delivery_fee (Decimal): Delivery fee for this location
        estimated_time (str): Estimated delivery time (e.g., "2-3 hours")
        is_active (bool): Whether the location is active
        created_at (datetime): When the location was created
        updated_at (datetime): When the location was last updated
    """
    
    __tablename__ = 'delivery_locations'
    
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    delivery_fee = db.Column(db.Numeric(10, 2), nullable=False)
    estimated_time = db.Column(db.String(50))  # e.g., "2-3 hours"
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    orders = db.relationship('Order', foreign_keys='Order.delivery_location_id')
    
    @validates('delivery_fee')
    def validate_delivery_fee(self, key, fee):
        """Validate delivery fee"""
        if fee < 0:
            raise ValueError("Delivery fee cannot be negative")
        return fee
    
    def to_dict(self):
        """Convert the delivery location to a dictionary"""
        result = super().to_dict()
        result.update({
            'orders_count': len(self.orders) if self.orders else 0
        })
        return result
    
    def __repr__(self):
        return f'<DeliveryLocation {self.name}>'