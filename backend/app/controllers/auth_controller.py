"""
Authentication controller.
This module contains the authentication controller functions.
"""
from app.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(data):
    """Register a new user"""
    # Check if username already exists
    if User.query.filter_by(username=data.get('username')).first():
        return {'error': 'Username already exists'}
    
    # Check if email already exists
    if User.query.filter_by(email=data.get('email')).first():
        return {'error': 'Email already exists'}
    
    # Create new user
    user = User(
        username=data.get('username'),
        email=data.get('email'),
        is_admin=data.get('is_admin', False)
    )
    user.set_password(data.get('password'))
    
    # Save user to database
    db.session.add(user)
    db.session.commit()
    
    return {'message': 'User registered successfully', 'user': user.to_dict()}

def authenticate_user(email, password):
    """Authenticate a user"""
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(password):
        return {'error': 'Invalid email or password'}
    
    return {'message': 'Login successful', 'user': user.to_dict()}

def get_user_by_id(user_id):
    """Get a user by ID"""
    user = User.query.get(user_id)
    
    if not user:
        return None
    
    return user.to_dict()

def is_admin(user_id):
    """Check if a user is an admin"""
    user = User.query.get(user_id)
    
    if not user:
        return False
    
    return user.is_admin