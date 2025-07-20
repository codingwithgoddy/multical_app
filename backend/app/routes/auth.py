"""
Authentication routes.
This module contains the authentication routes for the application.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.controllers.auth_controller import register_user, authenticate_user, get_user_by_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Register user
    result = register_user(data)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 400
    
    return jsonify(result), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Authenticate user
    result = authenticate_user(data.get('email'), data.get('password'))
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 401
    
    # Create access token
    access_token = create_access_token(identity=result['user']['id'])
    
    return jsonify({
        'access_token': access_token,
        'user': result['user']
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get current user"""
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user}), 200