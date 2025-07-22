"""
File service module.
This module contains services for file handling operations.
"""
from flask import current_app
from werkzeug.datastructures import FileStorage
from app.utils.file_utils import process_file_upload, delete_from_cloudinary, FileValidationError
from app.models.design_file import DesignFile
from app.models.quote_file import QuoteFile, FileUploadedBy
import uuid

class FileService:
    """Service for file operations."""
    
    @staticmethod
    def upload_design_file(order_id, file_storage):
        """
        Upload a design file for an order.
        
        Args:
            order_id (UUID): The order ID
            file_storage (FileStorage): The file to upload
            
        Returns:
            DesignFile: The created design file
            
        Raises:
            FileValidationError: If file validation fails
            Exception: If the upload fails
        """
        try:
            # Process the file upload
            file_data = process_file_upload(file_storage, folder='designs')
            
            # Create the design file
            design_file = DesignFile.create_from_upload(order_id, file_data)
            
            return design_file
        except FileValidationError as e:
            current_app.logger.error(f"File validation error: {str(e)}")
            raise
        except Exception as e:
            current_app.logger.error(f"Error uploading design file: {str(e)}")
            raise
    
    @staticmethod
    def upload_quote_file(quote_request_id, file_storage, uploaded_by):
        """
        Upload a quote file for a quote request.
        
        Args:
            quote_request_id (UUID): The quote request ID
            file_storage (FileStorage): The file to upload
            uploaded_by (FileUploadedBy): Who uploaded the file
            
        Returns:
            QuoteFile: The created quote file
            
        Raises:
            FileValidationError: If file validation fails
            Exception: If the upload fails
        """
        try:
            # Process the file upload
            file_data = process_file_upload(file_storage, folder='quotes')
            
            # Create the quote file
            quote_file = QuoteFile.create_from_upload(quote_request_id, file_data, uploaded_by)
            
            return quote_file
        except FileValidationError as e:
            current_app.logger.error(f"File validation error: {str(e)}")
            raise
        except Exception as e:
            current_app.logger.error(f"Error uploading quote file: {str(e)}")
            raise
    
    @staticmethod
    def delete_design_file(file_id):
        """
        Delete a design file.
        
        Args:
            file_id (UUID): The file ID
            
        Returns:
            bool: True if successful
            
        Raises:
            Exception: If the deletion fails
        """
        try:
            # Get the file
            design_file = DesignFile.get_by_id_or_404(file_id)
            
            # Delete the file
            design_file.delete()
            
            return True
        except Exception as e:
            current_app.logger.error(f"Error deleting design file: {str(e)}")
            raise
    
    @staticmethod
    def delete_quote_file(file_id):
        """
        Delete a quote file.
        
        Args:
            file_id (UUID): The file ID
            
        Returns:
            bool: True if successful
            
        Raises:
            Exception: If the deletion fails
        """
        try:
            # Get the file
            quote_file = QuoteFile.get_by_id_or_404(file_id)
            
            # Delete the file
            quote_file.delete()
            
            return True
        except Exception as e:
            current_app.logger.error(f"Error deleting quote file: {str(e)}")
            raise
    
    @staticmethod
    def get_design_files_for_order(order_id):
        """
        Get all design files for an order.
        
        Args:
            order_id (UUID): The order ID
            
        Returns:
            list: List of design files
        """
        return DesignFile.query.filter_by(order_id=order_id).all()
    
    @staticmethod
    def get_quote_files_for_request(quote_request_id):
        """
        Get all quote files for a quote request.
        
        Args:
            quote_request_id (UUID): The quote request ID
            
        Returns:
            list: List of quote files
        """
        return QuoteFile.query.filter_by(quote_request_id=quote_request_id).all()
    
    @staticmethod
    def check_file_access(file_id, file_type, user_id=None, role=None):
        """
        Check if a user has access to a file.
        
        Args:
            file_id (UUID): The file ID
            file_type (str): The file type ('design' or 'quote')
            user_id (UUID, optional): The user ID
            role (str, optional): The user role
            
        Returns:
            bool: True if the user has access, False otherwise
        """
        try:
            if file_type == 'design':
                file = DesignFile.get_by_id(file_id)
                if not file:
                    return False
                
                # Admin users always have access
                if role in ['owner', 'payment_admin']:
                    return True
                
                # Workers only have access to orders assigned to them
                if role == 'worker':
                    order = file.order
                    return order and order.assigned_to == user_id
                
                return False
            
            elif file_type == 'quote':
                file = QuoteFile.get_by_id(file_id)
                if not file:
                    return False
                
                # Admin users always have access
                if role in ['owner', 'payment_admin', 'worker']:
                    return True
                
                return False
            
            return False
        except Exception as e:
            current_app.logger.error(f"Error checking file access: {str(e)}")
            return False