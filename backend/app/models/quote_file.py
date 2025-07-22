"""
Quote file model.
This module contains the QuoteFile model for quote request attachments with Cloudinary integration.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
import uuid
import enum
from datetime import datetime
from app.utils.file_utils import delete_from_cloudinary, ALLOWED_MIME_TYPES
from flask import current_app

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
    
    @validates('mime_type')
    def validate_mime_type(self, key, mime_type):
        """Validate MIME type"""
        if mime_type and mime_type not in ALLOWED_MIME_TYPES:
            raise ValueError(f"File type {mime_type} is not allowed")
        return mime_type
    
    def to_dict(self):
        """Convert the quote file to a dictionary"""
        result = super().to_dict()
        result.update({
            'uploaded_by': self.uploaded_by.value,
            'file_size_mb': round(self.file_size / (1024 * 1024), 2) if self.file_size else None
        })
        return result
    
    def delete(self):
        """
        Override delete method to also remove file from Cloudinary.
        
        Returns:
            self: The deleted model instance
            
        Raises:
            DatabaseError: If any database error occurs
        """
        try:
            # Delete from Cloudinary
            if self.cloudinary_public_id:
                try:
                    delete_from_cloudinary(self.cloudinary_public_id)
                except Exception as e:
                    current_app.logger.error(f"Error deleting file from Cloudinary: {str(e)}")
            
            # Delete from database
            return super().delete()
        except Exception as e:
            current_app.logger.error(f"Error deleting quote file: {str(e)}")
            raise
    
    @classmethod
    def create_from_upload(cls, quote_request_id, file_data, uploaded_by):
        """
        Create a new quote file from upload data.
        
        Args:
            quote_request_id (UUID): The quote request ID
            file_data (dict): File data from process_file_upload
            uploaded_by (FileUploadedBy): Who uploaded the file
            
        Returns:
            QuoteFile: The created quote file
        """
        quote_file = cls(
            quote_request_id=quote_request_id,
            filename=file_data['filename'],
            cloudinary_url=file_data['cloudinary_url'],
            cloudinary_public_id=file_data['cloudinary_public_id'],
            file_size=file_data['file_size'],
            mime_type=file_data['mime_type'],
            uploaded_by=uploaded_by
        )
        return quote_file.save()
    
    def __repr__(self):
        return f'<QuoteFile {self.filename}>'