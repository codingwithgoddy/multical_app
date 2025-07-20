"""
Main routes.
This module contains the main routes for the application.
"""
from flask import Blueprint, jsonify, current_app

main_bp = Blueprint('main', __name__)

@main_bp.route('/api/v1/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend service is running'
    })

@main_bp.route('/api/v1/')
def index():
    """API root endpoint"""
    return jsonify({
        'message': f'Welcome to {current_app.config["APP_NAME"]} API',
        'version': '0.1.0',
        'endpoints': {
            'health': '/api/v1/health',
            'auth': '/api/v1/auth',
            'products': '/api/v1/products',
            'orders': '/api/v1/orders'
        }
    })