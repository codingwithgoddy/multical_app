"""
Quote file model.
This module contains the QuoteFile model for quote request attachments.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
import uuid
import enum
from datetime import datetime

class FileUploadedBy(enum.Enum):
    """File uploaded by enumeration"""
    CUSTOMER = "customer"
    ADMIN = "admin"

class QuoteFile(BaseModel):
    """
    Quote file model for quote request attachments.
    
    Attributes:
        id (UUID): Primary key
        quote_request_id (UUID): Foreign key to quote request
        filename (str): Original filename
        cloudinary_url (str): Cloudinary URL
        cloudinary_public_id (str): Cloudinary public ID
        file_size (int): File size in bytes
        mime_type (str): MIME type
        uploaded_by (FileUploadedBy): Who uploaded the file
        uploaded_at (datetime): When the file was uploaded
    """
    
    __tablename__ = 'quote_files'
    
    quote_request_id = db.Column(UUID(as_uuid=True), db.ForeignKey('quote_requests.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    cloudinary_url = db.Column(db.String(500), nullable=False)
    cloudinary_public_id = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)
    mime_type = db.Column(db.String(100))
    uploaded_by = db.Column(db.Enum(FileUploadedBy), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    quote_request = db.relationship('QuoteRequest', back_populates='quote_files')
    
    @validates('file_size')
    def validate_file_size(self, key, size):
        """Validate file size (max 50MB)"""
        if size and size > 50 * 1024 * 1024:  # 50MB
            raise ValueError("File size cannot exceed 50MB")
        return size
    
    def to_dict(self):
        """Convert the quote file to a dictionary"""
        result = super().to_dict()
        result.update({
            'uploaded_by': self.uploaded_by.value,
            'file_size_mb': round(self.file_size / (1024 * 1024), 2) if self.file_size else None
        })
        return result
    
    def __repr__(self):
        return f'<QuoteFile {self.filename}>'