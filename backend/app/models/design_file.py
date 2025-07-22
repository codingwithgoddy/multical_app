"""
Design file model.
This module contains the DesignFile model for order attachments.
"""
from app.models import db
from app.models.base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
import uuid
from datetime import datetime

class DesignFile(BaseModel):
    """
    Design file model for order attachments.
    
    Attributes:
        id (UUID): Primary key
        order_id (UUID): Foreign key to order
        filename (str): Original filename
        cloudinary_url (str): Cloudinary URL
        cloudinary_public_id (str): Cloudinary public ID
        file_size (int): File size in bytes
        mime_type (str): MIME type
        uploaded_at (datetime): When the file was uploaded
    """
    
    __tablename__ = 'design_files'
    
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey('orders.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    cloudinary_url = db.Column(db.String(500), nullable=False)
    cloudinary_public_id = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)
    mime_type = db.Column(db.String(100))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    order = db.relationship('Order', back_populates='design_files')
    
    @validates('file_size')
    def validate_file_size(self, key, size):
        """Validate file size (max 50MB)"""
        if size and size > 50 * 1024 * 1024:  # 50MB
            raise ValueError("File size cannot exceed 50MB")
        return size
    
    def to_dict(self):
        """Convert the design file to a dictionary"""
        result = super().to_dict()
        result.update({
            'file_size_mb': round(self.file_size / (1024 * 1024), 2) if self.file_size else None
        })
        return result
    
    def __repr__(self):
        return f'<DesignFile {self.filename}>'