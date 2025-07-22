"""
Admin User model.
This module contains the AdminUser model for authentication and authorization.
"""
import uuid
import enum
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db
from app.models.base import BaseModel

class AdminRole(enum.Enum):
    """Enum for admin roles"""
    OWNER = "owner"
    PAYMENT_ADMIN = "payment_admin"
    WORKER = "worker"

class AdminUser(BaseModel):
    """Admin User model for authentication and authorization"""
    __tablename__ = 'admin_users'
    
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(AdminRole), nullable=False, default=AdminRole.WORKER)
    is_active = db.Column(db.Boolean, default=True)
    created_by_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin_users.id'), nullable=True)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Self-referential relationship for tracking who created this admin
    creator = db.relationship('AdminUser', 
                             primaryjoin="AdminUser.created_by_id==AdminUser.id",
                             remote_side="AdminUser.id")
    
    # Relationship for assigned orders
    assigned_orders = db.relationship('Order', 
                                     foreign_keys='Order.assigned_to',
                                     lazy='dynamic')
    
    # Relationship for dashboard notes
    notes = db.relationship('DashboardNote', backref='author',
                           foreign_keys='DashboardNote.author_id',
                           lazy='dynamic')
    
    def __repr__(self):
        return f'<AdminUser {self.username}>'
    
    def set_password(self, password):
        """Set the password hash"""
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')
    
    def check_password(self, password):
        """Check if the password is correct"""
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update the last login timestamp"""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def is_owner(self):
        """Check if the user is an owner"""
        return self.role == AdminRole.OWNER
    
    def is_payment_admin(self):
        """Check if the user is a payment admin"""
        return self.role == AdminRole.PAYMENT_ADMIN or self.role == AdminRole.OWNER
    
    def to_dict(self):
        """Convert the admin user to a dictionary"""
        result = super().to_dict()
        # Remove sensitive information
        result.pop('password_hash', None)
        # Add role name
        result['role'] = self.role.value if self.role else None
        # Add creator info if available
        if self.creator:
            result['creator'] = {
                'id': str(self.creator.id),
                'username': self.creator.username
            }
        return result