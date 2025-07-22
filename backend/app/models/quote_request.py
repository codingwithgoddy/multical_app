"""
Quote request model.
This module contains the QuoteRequest model for service quotes.
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

class ContactMethod(enum.Enum):
    """Contact method enumeration"""
    WHATSAPP = "whatsapp"
    PHONE = "phone"
    EMAIL = "email"
    WEBSITE_UPLOAD = "website_upload"

class QuoteStatus(enum.Enum):
    """Quote status enumeration"""
    PENDING = "pending"
    QUOTED = "quoted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"

class QuoteRequest(BaseModel):
    """
    Quote request model for service quotes.
    
    Attributes:
        id (UUID): Primary key
        reference (str): Unique quote reference
        service_id (UUID): Foreign key to service (product with type=service)
        customer_name (str): Customer name
        customer_phone (str): Customer phone
        customer_email (str): Customer email
        description (str): Service requirements description
        contact_method (ContactMethod): Preferred contact method
        status (QuoteStatus): Quote status
        quoted_amount (Decimal): Quoted amount
        quoted_by (UUID): Admin who provided quote
        admin_notes (str): Admin notes
        created_at (datetime): When the quote was created
        updated_at (datetime): When the quote was last updated
    """
    
    __tablename__ = 'quote_requests'
    
    reference = db.Column(db.String(20), unique=True, nullable=False)
    service_id = db.Column(UUID(as_uuid=True), db.ForeignKey('products.id'), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    customer_email = db.Column(db.String(120))
    description = db.Column(db.Text, nullable=False)
    contact_method = db.Column(db.Enum(ContactMethod), nullable=False)
    status = db.Column(db.Enum(QuoteStatus), nullable=False, default=QuoteStatus.PENDING)
    quoted_amount = db.Column(db.Numeric(10, 2))
    quoted_by = db.Column(UUID(as_uuid=True), db.ForeignKey('admin_users.id'))
    admin_notes = db.Column(db.Text)
    
    # Relationships
    service = db.relationship('Product', back_populates='quote_requests')
    quoted_by_admin = db.relationship('AdminUser', foreign_keys=[quoted_by])
    quote_files = db.relationship('QuoteFile', back_populates='quote_request', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        """Initialize quote request with auto-generated reference"""
        if 'reference' not in kwargs:
            kwargs['reference'] = self.generate_reference()
        super().__init__(**kwargs)
    
    @staticmethod
    def generate_reference():
        """Generate a unique quote reference"""
        # Generate a random 8-character alphanumeric string with Q prefix
        chars = string.ascii_uppercase + string.digits
        reference = 'Q' + ''.join(random.choice(chars) for _ in range(7))
        
        # Ensure uniqueness
        while QuoteRequest.query.filter_by(reference=reference).first():
            reference = 'Q' + ''.join(random.choice(chars) for _ in range(7))
        
        return reference
    
    def to_dict(self):
        """Convert the quote request to a dictionary"""
        result = super().to_dict()
        result.update({
            'contact_method': self.contact_method.value,
            'status': self.status.value,
            'service_name': self.service.name if self.service else None,
            'quoted_by_name': self.quoted_by_admin.username if self.quoted_by_admin else None,
            'quote_files': [file.to_dict() for file in self.quote_files]
        })
        return result
    
    def __repr__(self):
        return f'<QuoteRequest {self.reference}>'