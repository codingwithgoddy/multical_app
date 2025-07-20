"""
Product and Category models.
This module contains the Product, Category, and related models for the product catalog.
"""
from app.models import db
from datetime import datetime

class Category(db.Model):
    """Category model for product categorization"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    slug = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Category {self.name}>'
    
    def to_dict(self):
        """Convert the category to a dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'slug': self.slug,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Product(db.Model):
    """Product model for the catalog"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category', backref=db.backref('products', lazy=True))
    sku = db.Column(db.String(50), unique=True)
    pricing_model = db.Column(db.String(20), nullable=False, default='fixed')  # fixed, per_unit, per_meter, per_sqm, custom
    base_price = db.Column(db.Float, nullable=False)
    min_order_quantity = db.Column(db.Float, default=1)
    unit_of_measure = db.Column(db.String(20), default='piece')  # piece, meter, sqm, etc.
    active = db.Column(db.Boolean, default=True)
    stock_quantity = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    def to_dict(self):
        """Convert the product to a dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category_id': self.category_id,
            'category': self.category.name if self.category else None,
            'sku': self.sku,
            'pricing_model': self.pricing_model,
            'base_price': self.base_price,
            'min_order_quantity': self.min_order_quantity,
            'unit_of_measure': self.unit_of_measure,
            'active': self.active,
            'stock_quantity': self.stock_quantity,
            'images': [image.to_dict() for image in self.images],
            'options': [option.to_dict() for option in self.options],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ProductImage(db.Model):
    """Product image model"""
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship('Product', backref=db.backref('images', lazy=True))
    image_url = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProductImage {self.id}>'
    
    def to_dict(self):
        """Convert the product image to a dictionary"""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
            'is_primary': self.is_primary,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat()
        }

class ProductOption(db.Model):
    """Product option model"""
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship('Product', backref=db.backref('options', lazy=True))
    name = db.Column(db.String(50), nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    required = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProductOption {self.name}>'
    
    def to_dict(self):
        """Convert the product option to a dictionary"""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'name': self.name,
            'display_name': self.display_name,
            'required': self.required,
            'values': [value.to_dict() for value in self.values],
            'created_at': self.created_at.isoformat()
        }

class ProductOptionValue(db.Model):
    """Product option value model"""
    id = db.Column(db.Integer, primary_key=True)
    option_id = db.Column(db.Integer, db.ForeignKey('product_option.id'))
    option = db.relationship('ProductOption', backref=db.backref('values', lazy=True))
    value = db.Column(db.String(100), nullable=False)
    price_adjustment = db.Column(db.Float, default=0.0)
    price_adjustment_type = db.Column(db.String(20), default='fixed')  # fixed, percentage
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProductOptionValue {self.value}>'
    
    def to_dict(self):
        """Convert the product option value to a dictionary"""
        return {
            'id': self.id,
            'option_id': self.option_id,
            'value': self.value,
            'price_adjustment': self.price_adjustment,
            'price_adjustment_type': self.price_adjustment_type,
            'created_at': self.created_at.isoformat()
        }