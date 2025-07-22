"""
Initialize admin user script.
This script creates an initial admin user with owner role if no admin users exist.
"""
import os
import sys
from flask import Flask
from app import create_app
from app.models import db
from app.models.admin_user import AdminUser, AdminRole
from app.controllers.auth_controller import create_initial_owner
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_admin():
    """Initialize admin user"""
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        # Check if any admin users exist
        if AdminUser.query.count() > 0:
            print("Admin users already exist. Skipping initialization.")
            return
        
        # Get admin credentials from environment variables or use defaults
        username = os.environ.get('ADMIN_USERNAME', 'admin')
        email = os.environ.get('ADMIN_EMAIL', 'admin@multiprints.com')
        password = os.environ.get('ADMIN_PASSWORD')
        
        # Check if password is provided
        if not password:
            print("Error: ADMIN_PASSWORD environment variable is required.")
            sys.exit(1)
        
        # Create initial owner admin
        result = create_initial_owner(username, email, password)
        
        if result.get('error'):
            print(f"Error creating admin user: {result['error']}")
            sys.exit(1)
        
        print(f"Admin user '{username}' created successfully with role 'owner'.")

if __name__ == '__main__':
    init_admin()