"""
Authentication routes.
This module contains the authentication routes for the application.
"""
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, 
    get_jwt_identity, get_jwt, verify_jwt_in_request
)
from app.models.admin_user import AdminUser, AdminRole
from app.utils.auth import admin_required, owner_required
from app.models import db, ValidationError, NotFoundError, IntegrityConstraintViolation

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login an admin user"""
    data = request.get_json()
    
    # Validate input
    if not data or not (data.get('email') or data.get('username')) or not data.get('password'):
        return jsonify({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Missing email/username or password',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 400
    
    # Find user by email or username
    if data.get('email'):
        admin = AdminUser.query.filter_by(email=data.get('email')).first()
    else:
        admin = AdminUser.query.filter_by(username=data.get('username')).first()
    
    # Check if user exists and password is correct
    if not admin or not admin.check_password(data.get('password')):
        return jsonify({
            'error': {
                'code': 'AUTHENTICATION_ERROR',
                'message': 'Invalid credentials',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 401
    
    # Check if user is active
    if not admin.is_active:
        return jsonify({
            'error': {
                'code': 'ACCOUNT_DISABLED',
                'message': 'Account is disabled',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 403
    
    # Update last login timestamp
    admin.update_last_login()
    
    # Create access and refresh tokens
    access_token = create_access_token(identity=str(admin.id))
    refresh_token = create_refresh_token(identity=str(admin.id))
    
    current_app.logger.info(f"Login successful for admin: {admin.username}")
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'admin': admin.to_dict()
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    admin_id = get_jwt_identity()
    admin = AdminUser.get_by_id(admin_id)
    
    if not admin or not admin.is_active:
        return jsonify({
            'error': {
                'code': 'UNAUTHORIZED',
                'message': 'Invalid refresh token',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 401
    
    # Create new access token
    access_token = create_access_token(identity=str(admin.id))
    
    return jsonify({
        'access_token': access_token
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout an admin user"""
    # JWT tokens are stateless, so we can't invalidate them server-side
    # The client should discard the tokens
    return jsonify({
        'message': 'Successfully logged out'
    }), 200

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify JWT token"""
    admin_id = get_jwt_identity()
    admin = AdminUser.get_by_id(admin_id)
    
    if not admin or not admin.is_active:
        return jsonify({
            'error': {
                'code': 'UNAUTHORIZED',
                'message': 'Invalid token',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 401
    
    return jsonify({
        'valid': True,
        'admin': admin.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@admin_required
def me(admin):
    """Get current admin user"""
    return jsonify({
        'admin': admin.to_dict()
    }), 200

@auth_bp.route('/admin', methods=['GET'])
@owner_required
def list_admins(admin):
    """List all admin users (owner only)"""
    admins = AdminUser.query.all()
    return jsonify({
        'admins': [admin.to_dict() for admin in admins]
    }), 200

@auth_bp.route('/admin/create', methods=['POST'])
@owner_required
def create_admin(admin):
    """Create a new admin user (owner only)"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('username') or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Missing required fields',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 400
    
    try:
        # Validate role
        try:
            role = AdminRole(data.get('role'))
        except ValueError:
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': f"Invalid role. Must be one of: {', '.join([r.value for r in AdminRole])}",
                    'timestamp': datetime.utcnow().isoformat()
                }
            }), 400
        
        # Create new admin user
        new_admin = AdminUser(
            username=data.get('username'),
            email=data.get('email'),
            role=role,
            created_by_id=admin.id
        )
        new_admin.set_password(data.get('password'))
        
        # Save to database
        new_admin.save()
        
        return jsonify({
            'message': 'Admin user created successfully',
            'admin': new_admin.to_dict()
        }), 201
        
    except IntegrityConstraintViolation as e:
        return jsonify({
            'error': {
                'code': 'INTEGRITY_ERROR',
                'message': 'Username or email already exists',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 409
    except ValidationError as e:
        return jsonify({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Invalid input data',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 400

@auth_bp.route('/admin/<uuid:admin_id>/status', methods=['PUT'])
@owner_required
def update_admin_status(admin, admin_id):
    """Update admin user status (owner only)"""
    data = request.get_json()
    
    # Validate input
    if not data or 'is_active' not in data:
        return jsonify({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Missing is_active field',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 400
    
    try:
        # Get admin user
        target_admin = AdminUser.get_by_id_or_404(admin_id)
        
        # Prevent self-deactivation
        if target_admin.id == admin.id:
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Cannot change your own status',
                    'timestamp': datetime.utcnow().isoformat()
                }
            }), 400
        
        # Update status
        target_admin.update(is_active=data.get('is_active'))
        
        return jsonify({
            'message': 'Admin status updated successfully',
            'admin': target_admin.to_dict()
        }), 200
        
    except NotFoundError as e:
        return jsonify({
            'error': {
                'code': 'NOT_FOUND',
                'message': 'Admin user not found',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 404

@auth_bp.route('/admin/<uuid:admin_id>', methods=['DELETE'])
@owner_required
def delete_admin(admin, admin_id):
    """Delete admin user (owner only)"""
    try:
        # Get admin user
        target_admin = AdminUser.get_by_id_or_404(admin_id)
        
        # Prevent self-deletion
        if target_admin.id == admin.id:
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Cannot delete your own account',
                    'timestamp': datetime.utcnow().isoformat()
                }
            }), 400
        
        # Delete admin
        target_admin.delete()
        
        return jsonify({
            'message': 'Admin user deleted successfully'
        }), 200
        
    except NotFoundError as e:
        return jsonify({
            'error': {
                'code': 'NOT_FOUND',
                'message': 'Admin user not found',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 404