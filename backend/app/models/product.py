"""
Product model.
This module contains the Product model for the Multiprints business system.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
from decimal import Decimal
import uuid
import enum
from datetime import datetime

class ProductType(enum.Enum):
    """Product type enumeration"""
    PRODUCT = "product"
    SERVICE = "service"

class Product(BaseModel):
    """
    Product model for the catalog.
    
    This model represents both physical products and services in the system.
    The type field distinguishes between products (buyable) and services (need quotes).
    
    Attributes:
        id (UUID): Primary key
        name (str): Product name
        description (str): Product description
        type (ProductType): Product or service
        base_price (Decimal): Fixed price for products, starting price for services
        category (str): Product category
        image_url (str): Main product image URL (Cloudinary)
        is_active (bool): Whether the product is active
        created_at (datetime): When the product was created
        updated_at (datetime): When the product was last updated
    """
    
    __tablename__ = 'products'
    
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.Enum(ProductType), nullable=False, default=ProductType.PRODUCT)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(50))
    image_url = db.Column(db.String(255))  # Cloudinary URL
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    order_items = db.relationship('OrderItem', back_populates='product')  # Only for products
    quote_requests = db.relationship('QuoteRequest', back_populates='service')  # Only for services
    
    @validates('base_price')
    def validate_base_price(self, key, price):
        """Validate base price"""
        if price < 0:
            raise ValueError("Base price cannot be negative")
        return price
    
    def has_associated_orders(self):
        """Check if the product has associated orders"""
        return len(self.order_items) > 0
    
    def to_dict(self):
        """Convert the product to a dictionary"""
        result = super().to_dict()
        result.update({
            'type': self.type.value,
            'order_count': len(self.order_items) if self.type == ProductType.PRODUCT else 0,
            'quote_requests_count': len(self.quote_requests) if self.type == ProductType.SERVICE else 0
        })
        return result
    
    def __repr__(self):
        return f'<Product {self.name}>'