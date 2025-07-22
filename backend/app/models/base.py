"""
Base model module.
This module contains the base model class for all models.
"""
import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, DataError
from app.models import db

class DatabaseError(Exception):
    """Base exception for database errors."""
    pass

class NotFoundError(DatabaseError):
    """Exception raised when a record is not found."""
    pass

class ValidationError(DatabaseError):
    """Exception raised when validation fails."""
    pass

class IntegrityConstraintViolation(DatabaseError):
    """Exception raised when an integrity constraint is violated."""
    pass

class BaseModel(db.Model):
    """Base model class for all models."""
    
    __abstract__ = True
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def save(self):
        """
        Save the model to the database.
        
        Returns:
            self: The saved model instance
            
        Raises:
            ValidationError: If validation fails
            IntegrityConstraintViolation: If an integrity constraint is violated
            DatabaseError: If any other database error occurs
        """
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except IntegrityError as e:
            db.session.rollback()
            raise IntegrityConstraintViolation(f"Integrity constraint violated: {str(e)}")
        except DataError as e:
            db.session.rollback()
            raise ValidationError(f"Data validation failed: {str(e)}")
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabaseError(f"Database error: {str(e)}")
    
    def update(self, **kwargs):
        """
        Update the model with the given attributes.
        
        Args:
            **kwargs: Attributes to update
            
        Returns:
            self: The updated model instance
            
        Raises:
            ValidationError: If validation fails
            IntegrityConstraintViolation: If an integrity constraint is violated
            DatabaseError: If any other database error occurs
        """
        try:
            for key, value in kwargs.items():
                if hasattr(self, key):
                    setattr(self, key, value)
            return self.save()
        except (ValidationError, IntegrityConstraintViolation, DatabaseError) as e:
            raise e
    
    def delete(self):
        """
        Delete the model from the database.
        
        Returns:
            self: The deleted model instance
            
        Raises:
            DatabaseError: If any database error occurs
        """
        try:
            db.session.delete(self)
            db.session.commit()
            return self
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabaseError(f"Error deleting record: {str(e)}")
    
    @classmethod
    def get_by_id(cls, id):
        """
        Get a model by ID.
        
        Args:
            id: The ID of the model to get
            
        Returns:
            The model instance or None if not found
        """
        return cls.query.get(id)
    
    @classmethod
    def get_by_id_or_404(cls, id):
        """
        Get a model by ID or raise a NotFoundError.
        
        Args:
            id: The ID of the model to get
            
        Returns:
            The model instance
            
        Raises:
            NotFoundError: If the model is not found
        """
        instance = cls.get_by_id(id)
        if instance is None:
            raise NotFoundError(f"{cls.__name__} with ID {id} not found")
        return instance
    
    @classmethod
    def get_all(cls):
        """
        Get all models.
        
        Returns:
            A list of all model instances
        """
        return cls.query.all()
    
    @classmethod
    def get_paginated(cls, page=1, per_page=20, **filters):
        """
        Get paginated models with optional filters.
        
        Args:
            page: The page number (1-indexed)
            per_page: The number of items per page
            **filters: Filters to apply
            
        Returns:
            A pagination object
        """
        query = cls.query
        for attr, value in filters.items():
            if hasattr(cls, attr):
                query = query.filter(getattr(cls, attr) == value)
        return query.paginate(page=page, per_page=per_page)
    
    @classmethod
    def create(cls, **kwargs):
        """
        Create a new model instance.
        
        Args:
            **kwargs: Attributes for the new instance
            
        Returns:
            The new model instance
            
        Raises:
            ValidationError: If validation fails
            IntegrityConstraintViolation: If an integrity constraint is violated
            DatabaseError: If any other database error occurs
        """
        try:
            instance = cls(**kwargs)
            return instance.save()
        except (ValidationError, IntegrityConstraintViolation, DatabaseError) as e:
            raise e
    
    def to_dict(self):
        """
        Convert the model to a dictionary.
        
        Returns:
            A dictionary representation of the model
        """
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, uuid.UUID):
                value = str(value)
            elif isinstance(value, datetime):
                value = value.isoformat()
            result[column.name] = value
        return result