"""
Quote models.
This module contains the QuoteRequest, Quote, and related models for the quote system.
"""
from app.models import db
from datetime import datetime

class QuoteRequest(db.Model):
    """Quote request model"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('quote_requests', lazy=True))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    service = db.relationship('Service', backref=db.backref('quote_requests', lazy=True))
    status = db.Column(db.String(20), default='pending')  # pending, processing, quoted, accepted, rejected
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    desired_completion_date = db.Column(db.Date)
    budget = db.Column(db.Float)
    contact_preference = db.Column(db.String(20), default='email')  # email, phone, whatsapp
    admin_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<QuoteRequest {self.id}>'
    
    def to_dict(self):
        """Convert the quote request to a dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'service_id': self.service_id,
            'service': self.service.name if self.service else None,
            'status': self.status,
            'title': self.title,
            'description': self.description,
            'requirements': self.requirements,
            'desired_completion_date': self.desired_completion_date.isoformat() if self.desired_completion_date else None,
            'budget': self.budget,
            'contact_preference': self.contact_preference,
            'files': [file.to_dict() for file in self.files],
            'quotes': [quote.to_dict() for quote in self.quotes],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class QuoteFile(db.Model):
    """Quote file model"""
    id = db.Column(db.Integer, primary_key=True)
    quote_request_id = db.Column(db.Integer, db.ForeignKey('quote_request.id'))
    quote_request = db.relationship('QuoteRequest', backref=db.backref('files', lazy=True))
    file_url = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(100), nullable=False)
    file_type = db.Column(db.String(50))
    file_size = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<QuoteFile {self.file_name}>'
    
    def to_dict(self):
        """Convert the quote file to a dictionary"""
        return {
            'id': self.id,
            'quote_request_id': self.quote_request_id,
            'file_url': self.file_url,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'created_at': self.created_at.isoformat()
        }

class Quote(db.Model):
    """Quote model"""
    id = db.Column(db.Integer, primary_key=True)
    quote_request_id = db.Column(db.Integer, db.ForeignKey('quote_request.id'))
    quote_request = db.relationship('QuoteRequest', backref=db.backref('quotes', lazy=True))
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    admin = db.relationship('User', backref=db.backref('quotes_created', lazy=True))
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    valid_until = db.Column(db.Date)
    terms_and_conditions = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected, expired
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Quote {self.id}>'
    
    def to_dict(self):
        """Convert the quote to a dictionary"""
        return {
            'id': self.id,
            'quote_request_id': self.quote_request_id,
            'admin_id': self.admin_id,
            'price': self.price,
            'description': self.description,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
            'terms_and_conditions': self.terms_and_conditions,
            'status': self.status,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class QuoteItem(db.Model):
    """Quote item model"""
    id = db.Column(db.Integer, primary_key=True)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'))
    quote = db.relationship('Quote', backref=db.backref('items', lazy=True))
    description = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<QuoteItem {self.id}>'
    
    def to_dict(self):
        """Convert the quote item to a dictionary"""
        return {
            'id': self.id,
            'quote_id': self.quote_id,
            'description': self.description,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'created_at': self.created_at.isoformat()
        }