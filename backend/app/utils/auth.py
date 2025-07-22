"""
Authentication utilities.
This module contains utilities for authentication and authorization.
"""
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.admin_user import AdminUser, AdminRole

def admin_required(fn):
    """
    Decorator to require an authenticated admin user.
    This decorator verifies the JWT token and checks if the user exists and is active.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Verify JWT token
        verify_jwt_in_request()
        
        # Get user ID from token
        admin_id = get_jwt_identity()
        
        # Get user from database
        admin = AdminUser.get_by_id(admin_id)
        
        # Check if user exists and is active
        if not admin or not admin.is_active:
            return jsonify({
                'error': {
                    'code': 'UNAUTHORIZED',
                    'message': 'Authentication required'
                }
            }), 401
        
        # Add admin to kwargs
        kwargs['admin'] = admin
        
        return fn(*args, **kwargs)
    return wrapper

def role_required(roles):
    """
    Decorator to require specific admin roles.
    This decorator verifies the JWT token and checks if the user has the required role.
    
    Args:
        roles: A list of required roles (AdminRole enum values)
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Verify JWT token
            verify_jwt_in_request()
            
            # Get user ID from token
            admin_id = get_jwt_identity()
            
            # Get user from database
            admin = AdminUser.get_by_id(admin_id)
            
            # Check if user exists and is active
            if not admin or not admin.is_active:
                return jsonify({
                    'error': {
                        'code': 'UNAUTHORIZED',
                        'message': 'Authentication required'
                    }
                }), 401
            
            # Check if user has required role
            if admin.role not in roles:
                return jsonify({
                    'error': {
                        'code': 'FORBIDDEN',
                        'message': 'Insufficient permissions'
                    }
                }), 403
            
            # Add admin to kwargs
            kwargs['admin'] = admin
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def owner_required(fn):
    """
    Decorator to require owner role.
    This is a shorthand for role_required([AdminRole.OWNER]).
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return role_required([AdminRole.OWNER])(fn)(*args, **kwargs)
    return wrapper

def payment_admin_required(fn):
    """
    Decorator to require payment admin or owner role.
    This is a shorthand for role_required([AdminRole.PAYMENT_ADMIN, AdminRole.OWNER]).
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return role_required([AdminRole.PAYMENT_ADMIN, AdminRole.OWNER])(fn)(*args, **kwargs)
    return wrapper