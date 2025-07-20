"""
User model.
This module contains the User model and related models for authentication and authorization.
"""
from app.models import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """User model for authentication and authorization"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    phone_number = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        """Set the password hash"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the password is correct"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert the user to a dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'phone_number': self.phone_number,
            'addresses': [address.to_dict() for address in self.addresses],
            'payment_methods': [payment_method.to_dict() for payment_method in self.payment_methods],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Address(db.Model):
    """Address model for user addresses"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('addresses', lazy=True))
    street = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100))
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Address {self.id}>'
    
    def to_dict(self):
        """Convert the address to a dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'street': self.street,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat()
        }

class PaymentMethod(db.Model):
    """Payment method model for user payment methods"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('payment_methods', lazy=True))
    method_type = db.Column(db.String(50), nullable=False)  # mpesa, card, etc.
    provider = db.Column(db.String(100))
    account_number = db.Column(db.String(255))  # Masked account number
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<PaymentMethod {self.method_type}>'
    
    def to_dict(self):
        """Convert the payment method to a dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'method_type': self.method_type,
            'provider': self.provider,
            'account_number': self.account_number,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat()
        }