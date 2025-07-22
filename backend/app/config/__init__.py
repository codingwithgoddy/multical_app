"""
Configuration module for the application.
This module contains the configuration classes for different environments.
"""
import os

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-never-use-in-production')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-never-use-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # Cloudinary configuration
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')
    
    # M-Pesa configuration
    MPESA_API_KEY = os.environ.get('MPESA_API_KEY')
    MPESA_API_SECRET = os.environ.get('MPESA_API_SECRET')
    MPESA_SHORTCODE = os.environ.get('MPESA_SHORTCODE')
    MPESA_PASSKEY = os.environ.get('MPESA_PASSKEY')
    
    # Application configuration
    APP_NAME = os.environ.get('APP_NAME', 'Multiprints Business System')
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@multiprints.com')
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    
    # Security configuration
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    DEVELOPMENT = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/multiprints_dev')
    SESSION_COOKIE_SECURE = False
    REMEMBER_COOKIE_SECURE = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/multiprints_test')
    SESSION_COOKIE_SECURE = False
    REMEMBER_COOKIE_SECURE = False
    
class StagingConfig(Config):
    """Staging configuration"""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('STAGING_DATABASE_URL')
    JWT_ACCESS_TOKEN_EXPIRES = 43200  # 12 hours
    
class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    
    # Production-specific security settings
    PREFERRED_URL_SCHEME = 'https'