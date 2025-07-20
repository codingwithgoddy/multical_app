"""
Order and OrderItem models.
This module contains the Order, OrderItem, and related models for customer orders.
"""
from app.models import db
from datetime import datetime

class Order(db.Model):
    """Order model for customer orders"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'), nullable=True)
    quote = db.relationship('Quote', backref=db.backref('orders', lazy=True))
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, processing, completed, cancelled
    payment_status = db.Column(db.String(20), default='unpaid')  # unpaid, paid, refunded
    address_id = db.Column(db.Integer, db.ForeignKey('address.id'), nullable=True)
    address = db.relationship('Address', backref=db.backref('orders', lazy=True))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Order {self.id}>'
    
    def to_dict(self):
        """Convert the order to a dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quote_id': self.quote_id,
            'total_amount': self.total_amount,
            'status': self.status,
            'payment_status': self.payment_status,
            'address_id': self.address_id,
            'notes': self.notes,
            'items': [item.to_dict() for item in self.items],
            'status_history': [status.to_dict() for status in self.status_history],
            'payments': [payment.to_dict() for payment in self.payments],
            'deliveries': [delivery.to_dict() for delivery in self.deliveries],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class OrderItem(db.Model):
    """Order item model for items in an order"""
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    order = db.relationship('Order', backref=db.backref('items', lazy=True))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    product = db.relationship('Product', backref=db.backref('order_items', lazy=True))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    service = db.relationship('Service', backref=db.backref('order_items', lazy=True))
    quantity = db.Column(db.Float, nullable=False)
    unit_of_measure = db.Column(db.String(20))  # piece, meter, sqm, etc.
    price = db.Column(db.Float, nullable=False)  # Price at the time of order
    options_json = db.Column(db.Text)  # JSON string of selected options
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<OrderItem {self.id}>'
    
    def to_dict(self):
        """Convert the order item to a dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'service_id': self.service_id,
            'service_name': self.service.name if self.service else None,
            'quantity': self.quantity,
            'unit_of_measure': self.unit_of_measure,
            'price': self.price,
            'options_json': self.options_json,
            'subtotal': self.quantity * self.price,
            'files': [file.to_dict() for file in self.files],
            'created_at': self.created_at.isoformat()
        }

class OrderFile(db.Model):
    """Order file model for files attached to order items"""
    id = db.Column(db.Integer, primary_key=True)
    order_item_id = db.Column(db.Integer, db.ForeignKey('order_item.id'))
    order_item = db.relationship('OrderItem', backref=db.backref('files', lazy=True))
    file_url = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(100), nullable=False)
    file_type = db.Column(db.String(50))
    file_size = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<OrderFile {self.file_name}>'
    
    def to_dict(self):
        """Convert the order file to a dictionary"""
        return {
            'id': self.id,
            'order_item_id': self.order_item_id,
            'file_url': self.file_url,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'created_at': self.created_at.isoformat()
        }

class OrderStatus(db.Model):
    """Order status model for tracking order status history"""
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    order = db.relationship('Order', backref=db.backref('status_history', lazy=True))
    status = db.Column(db.String(20), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<OrderStatus {self.status}>'
    
    def to_dict(self):
        """Convert the order status to a dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class Payment(db.Model):
    """Payment model for order payments"""
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    order = db.relationship('Order', backref=db.backref('payments', lazy=True))
    payment_method = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(255))
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    provider_response = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Payment {self.id}>'
    
    def to_dict(self):
        """Convert the payment to a dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'amount': self.amount,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class Delivery(db.Model):
    """Delivery model for order deliveries"""
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    order = db.relationship('Order', backref=db.backref('deliveries', lazy=True))
    tracking_number = db.Column(db.String(100))
    carrier = db.Column(db.String(100))
    status = db.Column(db.String(20), default='pending')
    estimated_delivery = db.Column(db.DateTime)
    actual_delivery = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Delivery {self.id}>'
    
    def to_dict(self):
        """Convert the delivery to a dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'tracking_number': self.tracking_number,
            'carrier': self.carrier,
            'status': self.status,
            'estimated_delivery': self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            'actual_delivery': self.actual_delivery.isoformat() if self.actual_delivery else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }