"""
Authentication controller.
This module contains functions for authentication and user management.
"""
from datetime import datetime
from app.models.admin_user import AdminUser, AdminRole
from app.models import db, ValidationError, NotFoundError, IntegrityConstraintViolation

def authenticate_admin(email=None, username=None, password=None):
    """
    Authenticate an admin user.
    
    Args:
        email: The admin's email
        username: The admin's username
        password: The admin's password
        
    Returns:
        A dictionary with the authenticated admin or an error message
    """
    if not password or (not email and not username):
        return {'error': 'Missing credentials'}
    
    # Find admin by email or username
    if email:
        admin = AdminUser.query.filter_by(email=email).first()
    else:
        admin = AdminUser.query.filter_by(username=username).first()
    
    # Check if admin exists and password is correct
    if not admin or not admin.check_password(password):
        return {'error': 'Invalid credentials'}
    
    # Check if admin is active
    if not admin.is_active:
        return {'error': 'Account is disabled'}
    
    # Update last login timestamp
    admin.last_login = datetime.utcnow()
    db.session.commit()
    
    return {'admin': admin.to_dict()}

def create_admin_user(data, created_by=None):
    """
    Create a new admin user.
    
    Args:
        data: A dictionary with admin data
        created_by: The admin who created this admin
        
    Returns:
        A dictionary with the created admin or an error message
    """
    try:
        # Validate required fields
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return {'error': 'Missing required fields'}
        
        # Validate role
        try:
            role = AdminRole(data.get('role', 'worker'))
        except ValueError:
            return {'error': f"Invalid role. Must be one of: {', '.join([r.value for r in AdminRole])}"}
        
        # Check if username or email already exists
        if AdminUser.query.filter_by(username=data.get('username')).first():
            return {'error': 'Username already exists'}
        
        if AdminUser.query.filter_by(email=data.get('email')).first():
            return {'error': 'Email already exists'}
        
        # Create new admin user
        new_admin = AdminUser(
            username=data.get('username'),
            email=data.get('email'),
            role=role
        )
        
        # Set created_by if provided
        if created_by:
            new_admin.created_by_id = created_by.id
        
        # Set password
        new_admin.set_password(data.get('password'))
        
        # Save to database
        new_admin.save()
        
        return {'admin': new_admin.to_dict()}
        
    except (ValidationError, IntegrityConstraintViolation) as e:
        return {'error': str(e)}

def get_admin_by_id(admin_id):
    """
    Get an admin by ID.
    
    Args:
        admin_id: The admin's ID
        
    Returns:
        The admin's dictionary or None if not found
    """
    admin = AdminUser.get_by_id(admin_id)
    return admin.to_dict() if admin else None

def update_admin_status(admin_id, is_active):
    """
    Update an admin's active status.
    
    Args:
        admin_id: The admin's ID
        is_active: The new active status
        
    Returns:
        A dictionary with the updated admin or an error message
    """
    try:
        admin = AdminUser.get_by_id_or_404(admin_id)
        admin.update(is_active=is_active)
        return {'admin': admin.to_dict()}
    except NotFoundError as e:
        return {'error': str(e)}

def delete_admin_user(admin_id):
    """
    Delete an admin user.
    
    Args:
        admin_id: The admin's ID
        
    Returns:
        A dictionary with a success message or an error message
    """
    try:
        admin = AdminUser.get_by_id_or_404(admin_id)
        admin.delete()
        return {'message': 'Admin user deleted successfully'}
    except NotFoundError as e:
        return {'error': str(e)}

def create_initial_owner(username, email, password):
    """
    Create the initial owner admin user if no admins exist.
    
    Args:
        username: The owner's username
        email: The owner's email
        password: The owner's password
        
    Returns:
        A dictionary with the created admin or an error message
    """
    # Check if any admins exist
    if AdminUser.query.count() > 0:
        return {'error': 'Admin users already exist'}
    
    # Create owner admin
    owner = AdminUser(
        username=username,
        email=email,
        role=AdminRole.OWNER
    )
    owner.set_password(password)
    
    try:
        owner.save()
        return {'admin': owner.to_dict()}
    except (ValidationError, IntegrityConstraintViolation) as e:
        return {'error': str(e)}

def is_admin(admin_id):
    """
    Check if a user is an admin.
    
    Args:
        admin_id: The admin's ID
        
    Returns:
        True if the user is an admin, False otherwise
    """
    admin = AdminUser.get_by_id(admin_id)
    return admin is not None and admin.is_active