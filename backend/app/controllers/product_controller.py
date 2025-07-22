"""
Product controller.
This module contains the product controller functions.
"""
from app.models import db, Product

def get_all_products(category_id=None):
    """Get all products, optionally filtered by category"""
    if category_id:
        products = Product.query.filter_by(category_id=category_id).all()
    else:
        products = Product.query.all()
    
    return [product.to_dict() for product in products]

def get_product_by_id(product_id):
    """Get a product by ID"""
    product = Product.query.get(product_id)
    
    if not product:
        return None
    
    return product.to_dict()

def create_product(data):
    """Create a new product"""
    # Create new product
    product = Product(
        name=data.get('name'),
        description=data.get('description'),
        base_price=data.get('price') or data.get('base_price'),
        image_url=data.get('image_url'),
        category=data.get('category'),
        type=data.get('type', 'product')
    )
    
    # Save product to database
    db.session.add(product)
    db.session.commit()
    
    return {'message': 'Product created successfully', 'product': product.to_dict()}

def update_product(product_id, data):
    """Update a product"""
    product = Product.query.get(product_id)
    
    if not product:
        return {'error': 'Product not found'}
    
    # Update product fields
    if data.get('name'):
        product.name = data.get('name')
    if data.get('description') is not None:
        product.description = data.get('description')
    if data.get('price'):
        product.base_price = data.get('price')
    elif data.get('base_price'):
        product.base_price = data.get('base_price')
    if data.get('image_url') is not None:
        product.image_url = data.get('image_url')
    if data.get('category') is not None:
        product.category = data.get('category')
    if data.get('type') is not None:
        product.type = data.get('type')
    if 'is_active' in data:
        product.is_active = data.get('is_active')
    
    # Save changes to database
    db.session.commit()
    
    return {'message': 'Product updated successfully', 'product': product.to_dict()}

def delete_product(product_id):
    """Delete a product"""
    product = Product.query.get(product_id)
    
    if not product:
        return {'error': 'Product not found'}
    
    # Delete product from database
    db.session.delete(product)
    db.session.commit()
    
    return {'message': 'Product deleted successfully'}

def get_all_categories():
    """Get all categories"""
    # Get distinct categories from products
    categories = db.session.query(Product.category).distinct().all()
    return [{'name': category[0]} for category in categories if category[0]]

def get_category_by_id(category_name):
    """Get products by category name"""
    products = Product.query.filter_by(category=category_name).all()
    
    if not products:
        return None
    
    return {
        'name': category_name,
        'products': [product.to_dict() for product in products]
    }

def create_category(data):
    """Create a new category (not used, categories are stored as strings in products)"""
    return {'error': 'Categories are stored as strings in products, not as separate entities'}

def update_category(old_category, new_category):
    """Update category name for all products in that category"""
    products = Product.query.filter_by(category=old_category).all()
    
    if not products:
        return {'error': 'Category not found'}
    
    # Update category for all products
    for product in products:
        product.category = new_category
    
    # Save changes to database
    db.session.commit()
    
    return {'message': 'Category updated successfully', 'affected_products': len(products)}

def delete_category(category_name):
    """Remove category from all products (set to null)"""
    products = Product.query.filter_by(category=category_name).all()
    
    if not products:
        return {'error': 'Category not found'}
    
    # Remove category from all products
    for product in products:
        product.category = None
    
    # Save changes to database
    db.session.commit()
    
    return {'message': 'Category removed from all products', 'affected_products': len(products)}