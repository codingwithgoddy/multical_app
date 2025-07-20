"""
Product routes.
This module contains the product routes for the application.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.product_controller import (
    get_all_products, get_product_by_id, create_product, update_product, delete_product,
    get_all_categories, get_category_by_id, create_category, update_category, delete_category
)
from app.controllers.auth_controller import is_admin

products_bp = Blueprint('products', __name__)

# Product routes
@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all products"""
    category_id = request.args.get('category_id', type=int)
    products = get_all_products(category_id)
    return jsonify({'products': products}), 200

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a product by ID"""
    product = get_product_by_id(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify({'product': product}), 200

@products_bp.route('/', methods=['POST'])
@jwt_required()
def add_product():
    """Add a new product"""
    # Check if user is admin
    if not is_admin(get_jwt_identity()):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('name') or not data.get('price'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create product
    result = create_product(data)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 400
    
    return jsonify(result), 201

@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product_route(product_id):
    """Update a product"""
    # Check if user is admin
    if not is_admin(get_jwt_identity()):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update product
    result = update_product(product_id, data)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 404 if result.get('error') == 'Product not found' else 400
    
    return jsonify(result), 200

@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product_route(product_id):
    """Delete a product"""
    # Check if user is admin
    if not is_admin(get_jwt_identity()):
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Delete product
    result = delete_product(product_id)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 404
    
    return jsonify(result), 200

# Category routes
@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    categories = get_all_categories()
    return jsonify({'categories': categories}), 200

@products_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get a category by ID"""
    category = get_category_by_id(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    return jsonify({'category': category}), 200

@products_bp.route('/categories', methods=['POST'])
@jwt_required()
def add_category():
    """Add a new category"""
    # Check if user is admin
    if not is_admin(get_jwt_identity()):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create category
    result = create_category(data)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 400
    
    return jsonify(result), 201

@products_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category_route(category_id):
    """Update a category"""
    # Check if user is admin
    if not is_admin(get_jwt_identity()):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update category
    result = update_category(category_id, data)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 404 if result.get('error') == 'Category not found' else 400
    
    return jsonify(result), 200

@products_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category_route(category_id):
    """Delete a category"""
    # Check if user is admin
    if not is_admin(get_jwt_identity()):
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Delete category
    result = delete_category(category_id)
    
    if result.get('error'):
        return jsonify({'error': result['error']}), 404
    
    return jsonify(result), 200