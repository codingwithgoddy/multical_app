"""
Initialize admin user script.
This script creates an initial admin user with owner role.
"""
import os
import sys
import logging
import argparse
from app import create_app
from app.models.admin_user import AdminUser, AdminRole
from app.models import db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('init_admin')

def init_admin(username, email, password, env='development'):
    """
    Initialize admin user.
    
    Args:
        username: Admin username
        email: Admin email
        password: Admin password
        env: Environment to use
    """
    logger.info(f"Initializing admin user for {env} environment...")
    
    # Create the application with the specified environment
    app = create_app(env)
    
    with app.app_context():
        # Check if any admin users exist
        if AdminUser.query.count() > 0:
            logger.info("Admin users already exist. Skipping initialization.")
            return
        
        # Create owner admin
        owner = AdminUser(
            username=username,
            email=email,
            role=AdminRole.OWNER,
            is_active=True
        )
        owner.set_password(password)
        
        # Save to database
        db.session.add(owner)
        db.session.commit()
        
        logger.info(f"Admin user '{username}' created successfully with role 'owner'.")

if __name__ == '__main__':
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Initialize admin user.')
    parser.add_argument('--username', default='admin', help='Admin username')
    parser.add_argument('--email', default='admin@example.com', help='Admin email')
    parser.add_argument('--password', default='password123', help='Admin password')
    parser.add_argument('--env', choices=['development', 'testing', 'staging', 'production'],
                        default='development', help='Environment to use')
    args = parser.parse_args()
    
    # Initialize admin user
    init_admin(args.username, args.email, args.password, args.env)