"""
Product controller.
This module contains the product controller functions.
"""
from app.models import db, Product, Category

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
    # Check if category exists
    if data.get('category_id'):
        category = Category.query.get(data.get('category_id'))
        if not category:
            return {'error': 'Category not found'}
    
    # Create new product
    product = Product(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        image_url=data.get('image_url'),
        category_id=data.get('category_id')
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
    
    # Check if category exists
    if data.get('category_id'):
        category = Category.query.get(data.get('category_id'))
        if not category:
            return {'error': 'Category not found'}
    
    # Update product fields
    if data.get('name'):
        product.name = data.get('name')
    if data.get('description') is not None:
        product.description = data.get('description')
    if data.get('price'):
        product.price = data.get('price')
    if data.get('image_url') is not None:
        product.image_url = data.get('image_url')
    if data.get('category_id'):
        product.category_id = data.get('category_id')
    
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
    categories = Category.query.all()
    return [category.to_dict() for category in categories]

def get_category_by_id(category_id):
    """Get a category by ID"""
    category = Category.query.get(category_id)
    
    if not category:
        return None
    
    return category.to_dict()

def create_category(data):
    """Create a new category"""
    # Create new category
    category = Category(
        name=data.get('name'),
        description=data.get('description')
    )
    
    # Save category to database
    db.session.add(category)
    db.session.commit()
    
    return {'message': 'Category created successfully', 'category': category.to_dict()}

def update_category(category_id, data):
    """Update a category"""
    category = Category.query.get(category_id)
    
    if not category:
        return {'error': 'Category not found'}
    
    # Update category fields
    if data.get('name'):
        category.name = data.get('name')
    if data.get('description') is not None:
        category.description = data.get('description')
    
    # Save changes to database
    db.session.commit()
    
    return {'message': 'Category updated successfully', 'category': category.to_dict()}

def delete_category(category_id):
    """Delete a category"""
    category = Category.query.get(category_id)
    
    if not category:
        return {'error': 'Category not found'}
    
    # Check if category has products
    if category.products:
        return {'error': 'Cannot delete category with products'}
    
    # Delete category from database
    db.session.delete(category)
    db.session.commit()
    
    return {'message': 'Category deleted successfully'}