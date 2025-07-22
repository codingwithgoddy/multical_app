"""
Test file for file handling models and utilities.
"""
import os
import pytest
import uuid
from io import BytesIO
from unittest.mock import patch, MagicMock
from werkzeug.datastructures import FileStorage
from app.models.design_file import DesignFile
from app.models.quote_file import QuoteFile, FileUploadedBy
from app.utils.file_utils import (
    allowed_file, validate_file_mime_type, validate_file_size,
    sanitize_filename, process_file_upload, FileValidationError
)

class TestFileUtils:
    """Test file utility functions."""
    
    def test_allowed_file(self):
        """Test allowed_file function."""
        assert allowed_file('test.jpg') is True
        assert allowed_file('test.pdf') is True
        assert allowed_file('test.exe') is False
        assert allowed_file('test') is False
    
    def test_sanitize_filename(self):
        """Test sanitize_filename function."""
        assert sanitize_filename('test.jpg') == 'test.jpg'
        assert sanitize_filename('../../../etc/passwd') != '../../../etc/passwd'
        assert sanitize_filename('') != ''  # Should generate a random name
        assert sanitize_filename('test<script>alert(1)</script>.jpg') == 'testscriptalert1script.jpg'
    
    def test_validate_file_size(self):
        """Test validate_file_size function."""
        # Create a mock file with 1KB size
        mock_file = FileStorage(
            stream=BytesIO(b'x' * 1024),
            filename='test.jpg',
            content_type='image/jpeg'
        )
        
        # Test valid file size
        size = validate_file_size(mock_file)
        assert size == 1024
        
        # Test file too large
        with patch('app.utils.file_utils.MAX_FILE_SIZE', 500):
            with pytest.raises(FileValidationError):
                validate_file_size(mock_file)
    
    @patch('magic.Magic')
    def test_validate_file_mime_type(self, mock_magic):
        """Test validate_file_mime_type function."""
        # Mock the magic library
        magic_instance = MagicMock()
        mock_magic.return_value = magic_instance
        
        # Test valid MIME type
        magic_instance.from_file.return_value = 'image/jpeg'
        mock_file = FileStorage(
            stream=BytesIO(b'test'),
            filename='test.jpg',
            content_type='image/jpeg'
        )
        
        mime_type = validate_file_mime_type(mock_file)
        assert mime_type == 'image/jpeg'
        
        # Test invalid MIME type
        magic_instance.from_file.return_value = 'application/x-executable'
        with pytest.raises(FileValidationError):
            validate_file_mime_type(mock_file)
    
    @patch('app.utils.file_utils.upload_to_cloudinary')
    @patch('app.utils.file_utils.validate_file_mime_type')
    @patch('app.utils.file_utils.validate_file_size')
    def test_process_file_upload(self, mock_validate_size, mock_validate_mime, mock_upload):
        """Test process_file_upload function."""
        # Mock the validation and upload functions
        mock_validate_size.return_value = 1024
        mock_validate_mime.return_value = 'image/jpeg'
        mock_upload.return_value = {
            'secure_url': 'https://res.cloudinary.com/demo/image/upload/test.jpg',
            'public_id': 'uploads/test'
        }
        
        # Create a mock file
        mock_file = FileStorage(
            stream=BytesIO(b'test'),
            filename='test.jpg',
            content_type='image/jpeg'
        )
        
        # Test process_file_upload
        result = process_file_upload(mock_file, folder='designs')
        
        assert result['filename'] == 'test.jpg'
        assert result['cloudinary_url'] == 'https://res.cloudinary.com/demo/image/upload/test.jpg'
        assert result['cloudinary_public_id'] == 'uploads/test'
        assert result['file_size'] == 1024
        assert result['mime_type'] == 'image/jpeg'
        
        # Verify the mocks were called correctly
        mock_validate_size.assert_called_once()
        mock_validate_mime.assert_called_once()
        mock_upload.assert_called_once_with(mock_file, folder='designs')


class TestDesignFile:
    """Test DesignFile model."""
    
    @pytest.fixture
    def order_id(self):
        """Create a mock order ID."""
        return uuid.uuid4()
    
    @patch('app.models.design_file.delete_from_cloudinary')
    def test_delete_with_cloudinary(self, mock_delete, order_id):
        """Test delete method with Cloudinary integration."""
        # Create a design file
        design_file = DesignFile(
            order_id=order_id,
            filename='test.jpg',
            cloudinary_url='https://res.cloudinary.com/demo/image/upload/test.jpg',
            cloudinary_public_id='uploads/test',
            file_size=1024,
            mime_type='image/jpeg'
        )
        
        # Mock the database operations
        with patch.object(DesignFile, 'save'), \
             patch.object(DesignFile, '__init__', return_value=None), \
             patch('app.models.base.db.session'):
            
            # Call delete method
            design_file.delete()
            
            # Verify Cloudinary delete was called
            mock_delete.assert_called_once_with('uploads/test')
    
    def test_create_from_upload(self, order_id):
        """Test create_from_upload method."""
        # Mock file data
        file_data = {
            'filename': 'test.jpg',
            'cloudinary_url': 'https://res.cloudinary.com/demo/image/upload/test.jpg',
            'cloudinary_public_id': 'uploads/test',
            'file_size': 1024,
            'mime_type': 'image/jpeg'
        }
        
        # Mock the save method
        with patch.object(DesignFile, 'save', return_value=MagicMock()):
            # Create from upload
            design_file = DesignFile.create_from_upload(order_id, file_data)
            
            # Verify attributes
            assert design_file.order_id == order_id
            assert design_file.filename == 'test.jpg'
            assert design_file.cloudinary_url == 'https://res.cloudinary.com/demo/image/upload/test.jpg'
            assert design_file.cloudinary_public_id == 'uploads/test'
            assert design_file.file_size == 1024
            assert design_file.mime_type == 'image/jpeg'


class TestQuoteFile:
    """Test QuoteFile model."""
    
    @pytest.fixture
    def quote_request_id(self):
        """Create a mock quote request ID."""
        return uuid.uuid4()
    
    @patch('app.models.quote_file.delete_from_cloudinary')
    def test_delete_with_cloudinary(self, mock_delete, quote_request_id):
        """Test delete method with Cloudinary integration."""
        # Create a quote file
        quote_file = QuoteFile(
            quote_request_id=quote_request_id,
            filename='test.jpg',
            cloudinary_url='https://res.cloudinary.com/demo/image/upload/test.jpg',
            cloudinary_public_id='uploads/test',
            file_size=1024,
            mime_type='image/jpeg',
            uploaded_by=FileUploadedBy.CUSTOMER
        )
        
        # Mock the database operations
        with patch.object(QuoteFile, 'save'), \
             patch.object(QuoteFile, '__init__', return_value=None), \
             patch('app.models.base.db.session'):
            
            # Call delete method
            quote_file.delete()
            
            # Verify Cloudinary delete was called
            mock_delete.assert_called_once_with('uploads/test')
    
    def test_create_from_upload(self, quote_request_id):
        """Test create_from_upload method."""
        # Mock file data
        file_data = {
            'filename': 'test.jpg',
            'cloudinary_url': 'https://res.cloudinary.com/demo/image/upload/test.jpg',
            'cloudinary_public_id': 'uploads/test',
            'file_size': 1024,
            'mime_type': 'image/jpeg'
        }
        
        # Mock the save method
        with patch.object(QuoteFile, 'save', return_value=MagicMock()):
            # Create from upload
            quote_file = QuoteFile.create_from_upload(
                quote_request_id, 
                file_data, 
                FileUploadedBy.CUSTOMER
            )
            
            # Verify attributes
            assert quote_file.quote_request_id == quote_request_id
            assert quote_file.filename == 'test.jpg'
            assert quote_file.cloudinary_url == 'https://res.cloudinary.com/demo/image/upload/test.jpg'
            assert quote_file.cloudinary_public_id == 'uploads/test'
            assert quote_file.file_size == 1024
            assert quote_file.mime_type == 'image/jpeg'
            assert quote_file.uploaded_by == FileUploadedBy.CUSTOMER