"""
Dashboard Note model.
This module contains the DashboardNote model for admin collaboration.
"""
from sqlalchemy.dialects.postgresql import UUID
from app.models import db
from app.models.base import BaseModel

class DashboardNote(BaseModel):
    """Dashboard Note model for admin collaboration"""
    __tablename__ = 'dashboard_notes'
    
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(UUID(as_uuid=True), db.ForeignKey('admin_users.id'), nullable=False)
    is_pinned = db.Column(db.Boolean, default=False)
    is_private = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<DashboardNote {self.title}>'
    
    def to_dict(self):
        """Convert the dashboard note to a dictionary"""
        result = super().to_dict()
        # Add author info if available
        if self.author:
            result['author'] = {
                'id': str(self.author.id),
                'username': self.author.username
            }
        return result