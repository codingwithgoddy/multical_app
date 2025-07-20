"""
Order routes.
This module contains the order routes for the application.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.order_controller import (
    get_all_orders, get_order_by_id, create_order, update_order_status,
    get_user_orders
)
from app.controllers.auth_controller import is_admin

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """Get all orders (admin) or user orders (customer)"""
    user_id = get_jwt_identity()
    
    # Check if user is admin
    if is_admin(user_id):
        # Admin can see all orders
        orders = get_all_orders()
    else:
        # Customer can only see their own orders
        orders = get_user_orders(user_id)
    
    return jsonify({'orders': orders}), 200

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get an order by ID"""
    user_id = get_jwt_identity()
    order = get_order_by_id(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Check if user is admin or the order belongs to the user
    if not is_admin(user_id) and order.get('user_id') != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({'order': order}), 200

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def add_order():
    """Add a new order"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('items') or not isinstance(data.get('items'), list) or len(data.get('items')) == 0:
        return jsonify({'error': 'Missing or invalid items'}), 400
    
    # Create order
    result = create_order(user_id, data)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 400
    
    return jsonify(result), 201

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_status(order_id):
    """Update order status (admin only)"""
    user_id = get_jwt_identity()
    
    # Check if user is admin
    if not is_admin(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('status'):
        return jsonify({'error': 'Missing status'}), 400
    
    # Update order status
    result = update_order_status(order_id, data.get('status'))
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 404 if result.get('error') == 'Order not found' else 400
    
    return jsonify(result), 200