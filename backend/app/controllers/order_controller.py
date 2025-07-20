"""
Order controller.
This module contains the order controller functions.
"""
from app.models import db, Order, OrderItem, Product, User

def get_all_orders():
    """Get all orders"""
    orders = Order.query.all()
    return [order.to_dict() for order in orders]

def get_user_orders(user_id):
    """Get orders for a specific user"""
    orders = Order.query.filter_by(user_id=user_id).all()
    return [order.to_dict() for order in orders]

def get_order_by_id(order_id):
    """Get an order by ID"""
    order = Order.query.get(order_id)
    
    if not order:
        return None
    
    return order.to_dict()

def create_order(user_id, data):
    """Create a new order"""
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return {'error': 'User not found'}
    
    # Validate items
    items = data.get('items', [])
    if not items:
        return {'error': 'No items in order'}
    
    # Calculate total amount and validate products
    total_amount = 0
    order_items = []
    
    for item_data in items:
        product_id = item_data.get('product_id')
        quantity = item_data.get('quantity', 1)
        
        if not product_id or not isinstance(product_id, int) or quantity <= 0:
            return {'error': 'Invalid item data'}
        
        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return {'error': f'Product with ID {product_id} not found'}
        
        # Calculate item subtotal
        subtotal = product.price * quantity
        total_amount += subtotal
        
        # Create order item
        order_items.append({
            'product_id': product_id,
            'quantity': quantity,
            'price': product.price
        })
    
    # Create new order
    order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status='pending',
        payment_status='unpaid'
    )
    
    # Save order to database
    db.session.add(order)
    db.session.flush()  # Flush to get order ID
    
    # Create order items
    for item_data in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    return {'message': 'Order created successfully', 'order': order.to_dict()}

def update_order_status(order_id, status):
    """Update order status"""
    # Validate status
    valid_statuses = ['pending', 'processing', 'completed', 'cancelled']
    if status not in valid_statuses:
        return {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}
    
    # Find order
    order = Order.query.get(order_id)
    if not order:
        return {'error': 'Order not found'}
    
    # Update status
    order.status = status
    db.session.commit()
    
    return {'message': 'Order status updated successfully', 'order': order.to_dict()}