"""
Production models.
This module contains the ProductionJob and ProductionStep models for tracking production.
"""
from app.models import db
from datetime import datetime

class ProductionJob(db.Model):
    """Production job model for tracking order production"""
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    order = db.relationship('Order', backref=db.backref('production_jobs', lazy=True))
    order_item_id = db.Column(db.Integer, db.ForeignKey('order_items.id'))
    order_item = db.relationship('OrderItem', backref=db.backref('production_job', lazy=True))
    status = db.Column(db.String(20), default='queued')  # queued, in_progress, completed, on_hold
    assigned_to = db.Column(db.Integer, db.ForeignKey('admin_users.id'), nullable=True)
    assigned_user = db.relationship('AdminUser', backref=db.backref('assigned_jobs', lazy=True))
    priority = db.Column(db.String(20), default='normal')  # low, normal, high, urgent
    start_date = db.Column(db.DateTime)
    completion_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProductionJob {self.id}>'
    
    def to_dict(self):
        """Convert the production job to a dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'order_item_id': self.order_item_id,
            'status': self.status,
            'assigned_to': self.assigned_to,
            'assigned_user': self.assigned_user.username if self.assigned_user else None,
            'priority': self.priority,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'completion_date': self.completion_date.isoformat() if self.completion_date else None,
            'notes': self.notes,
            'steps': [step.to_dict() for step in self.steps],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ProductionStep(db.Model):
    """Production step model for tracking job steps"""
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('production_job.id'))
    job = db.relationship('ProductionJob', backref=db.backref('steps', lazy=True))
    name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    assigned_to = db.Column(db.Integer, db.ForeignKey('admin_users.id'), nullable=True)
    assigned_user = db.relationship('AdminUser', backref=db.backref('assigned_steps', lazy=True))
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProductionStep {self.name}>'
    
    def to_dict(self):
        """Convert the production step to a dictionary"""
        return {
            'id': self.id,
            'job_id': self.job_id,
            'name': self.name,
            'status': self.status,
            'assigned_to': self.assigned_to,
            'assigned_user': self.assigned_user.username if self.assigned_user else None,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }