"""
Service models.
This module contains the Service and related models for printing services.
"""
from app.models import db
from datetime import datetime

class Service(db.Model):
    """Service model for printing services"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category', backref=db.backref('services', lazy=True))
    base_price = db.Column(db.Float, nullable=False)
    pricing_model = db.Column(db.String(20), nullable=False, default='fixed')  # fixed, hourly, custom
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Service {self.name}>'
    
    def to_dict(self):
        """Convert the service to a dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category_id': self.category_id,
            'category': self.category.name if self.category else None,
            'base_price': self.base_price,
            'pricing_model': self.pricing_model,
            'active': self.active,
            'options': [option.to_dict() for option in self.options],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ServiceOption(db.Model):
    """Service option model"""
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    service = db.relationship('Service', backref=db.backref('options', lazy=True))
    name = db.Column(db.String(50), nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    required = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ServiceOption {self.name}>'
    
    def to_dict(self):
        """Convert the service option to a dictionary"""
        return {
            'id': self.id,
            'service_id': self.service_id,
            'name': self.name,
            'display_name': self.display_name,
            'required': self.required,
            'values': [value.to_dict() for value in self.values],
            'created_at': self.created_at.isoformat()
        }

class ServiceOptionValue(db.Model):
    """Service option value model"""
    id = db.Column(db.Integer, primary_key=True)
    option_id = db.Column(db.Integer, db.ForeignKey('service_option.id'))
    option = db.relationship('ServiceOption', backref=db.backref('values', lazy=True))
    value = db.Column(db.String(100), nullable=False)
    price_adjustment = db.Column(db.Float, default=0.0)
    price_adjustment_type = db.Column(db.String(20), default='fixed')  # fixed, percentage
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ServiceOptionValue {self.value}>'
    
    def to_dict(self):
        """Convert the service option value to a dictionary"""
        return {
            'id': self.id,
            'option_id': self.option_id,
            'value': self.value,
            'price_adjustment': self.price_adjustment,
            'price_adjustment_type': self.price_adjustment_type,
            'created_at': self.created_at.isoformat()
        }