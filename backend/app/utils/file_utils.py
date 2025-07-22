"""
File utility module.
This module contains utilities for file handling, validation, and Cloudinary integration.
"""
import os
import re
import uuid
import magic
import cloudinary
import cloudinary.uploader
from flask import current_app
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

# Allowed file extensions and MIME types
ALLOWED_EXTENSIONS = {
    # Images
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
    # Documents
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    # Design files
    'ai', 'psd', 'eps', 'indd', 'cdr',
    # Vector files
    'svg', 'eps',
    # Archive files
    'zip', 'rar', '7z',
}

ALLOWED_MIME_TYPES = {
    # Images
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml',
    # Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    # Design files
    'application/illustrator',
    'application/photoshop',
    'application/postscript',
    'application/x-indesign',
    'application/cdr',
    # Archive files
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
}

# Maximum file size (50MB)
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

class FileValidationError(Exception):
    """Exception raised for file validation errors."""
    pass

def allowed_file(filename):
    """
    Check if a file has an allowed extension.
    
    Args:
        filename (str): The filename to check
        
    Returns:
        bool: True if the file has an allowed extension, False otherwise
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_mime_type(file_storage):
    """
    Validate file MIME type using python-magic.
    
    Args:
        file_storage (FileStorage): The file to validate
        
    Returns:
        str: The detected MIME type if valid
        
    Raises:
        FileValidationError: If the file has an invalid MIME type
    """
    # Save file to a temporary location
    temp_path = f"/tmp/{uuid.uuid4()}"
    file_storage.save(temp_path)
    
    try:
        # Detect MIME type
        mime = magic.Magic(mime=True)
        mime_type = mime.from_file(temp_path)
        
        # Check if MIME type is allowed
        if mime_type not in ALLOWED_MIME_TYPES:
            raise FileValidationError(f"File type {mime_type} is not allowed")
        
        return mime_type
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

def validate_file_size(file_storage):
    """
    Validate file size.
    
    Args:
        file_storage (FileStorage): The file to validate
        
    Raises:
        FileValidationError: If the file is too large
    """
    # Check file size
    file_storage.seek(0, os.SEEK_END)
    file_size = file_storage.tell()
    file_storage.seek(0)  # Reset file pointer
    
    if file_size > MAX_FILE_SIZE:
        raise FileValidationError(f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / (1024 * 1024)}MB")
    
    return file_size

def sanitize_filename(filename):
    """
    Sanitize a filename to prevent path traversal and other security issues.
    
    Args:
        filename (str): The filename to sanitize
        
    Returns:
        str: The sanitized filename
    """
    # Use werkzeug's secure_filename to sanitize
    secure_name = secure_filename(filename)
    
    # Additional sanitization
    # Remove any potentially dangerous characters
    secure_name = re.sub(r'[^\w\.\-]', '_', secure_name)
    
    # Ensure filename is not empty
    if not secure_name:
        secure_name = f"file_{uuid.uuid4().hex[:8]}"
    
    return secure_name

def upload_to_cloudinary(file_storage, folder="uploads", resource_type="auto"):
    """
    Upload a file to Cloudinary.
    
    Args:
        file_storage (FileStorage): The file to upload
        folder (str): The folder to upload to
        resource_type (str): The resource type (auto, image, raw, video)
        
    Returns:
        dict: The Cloudinary upload response
        
    Raises:
        Exception: If the upload fails
    """
    try:
        # Save file to a temporary location
        temp_path = f"/tmp/{uuid.uuid4()}"
        file_storage.save(temp_path)
        
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            temp_path,
            folder=folder,
            resource_type=resource_type,
            use_filename=True,
            unique_filename=True
        )
        
        return upload_result
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

def delete_from_cloudinary(public_id):
    """
    Delete a file from Cloudinary.
    
    Args:
        public_id (str): The public ID of the file to delete
        
    Returns:
        dict: The Cloudinary delete response
        
    Raises:
        Exception: If the deletion fails
    """
    try:
        # Delete from Cloudinary
        delete_result = cloudinary.uploader.destroy(public_id)
        return delete_result
    except Exception as e:
        current_app.logger.error(f"Error deleting file from Cloudinary: {str(e)}")
        raise

def process_file_upload(file_storage, folder="uploads"):
    """
    Process a file upload, including validation and Cloudinary upload.
    
    Args:
        file_storage (FileStorage): The file to process
        folder (str): The Cloudinary folder to upload to
        
    Returns:
        dict: A dictionary with file metadata
        
    Raises:
        FileValidationError: If file validation fails
        Exception: If the upload fails
    """
    # Get and sanitize filename
    original_filename = file_storage.filename
    sanitized_filename = sanitize_filename(original_filename)
    
    # Validate file extension
    if not allowed_file(sanitized_filename):
        raise FileValidationError(f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}")
    
    # Validate file size
    file_size = validate_file_size(file_storage)
    
    # Validate MIME type
    mime_type = validate_file_mime_type(file_storage)
    
    # Reset file pointer after validation
    file_storage.seek(0)
    
    # Upload to Cloudinary
    upload_result = upload_to_cloudinary(file_storage, folder=folder)
    
    # Return file metadata
    return {
        'filename': sanitized_filename,
        'cloudinary_url': upload_result['secure_url'],
        'cloudinary_public_id': upload_result['public_id'],
        'file_size': file_size,
        'mime_type': mime_type
    }