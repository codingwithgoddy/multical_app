"""
Test configuration module.
This module tests the application configuration.
"""
import os
from sqlalchemy.engine.url import make_url
from sqlalchemy.pool import QueuePool

def test_development_config(app):
    """Test development configuration."""
    app.config.from_object('app.config.DevelopmentConfig')
    assert app.config['DEBUG']
    assert app.config['DEVELOPMENT']
    assert not app.config['TESTING']
    assert app.config['SQLALCHEMY_DATABASE_URI'].endswith('multiprints_dev')
    
    # Test database connection pooling configuration
    engine = app.extensions['sqlalchemy'].db.engine
    assert engine.pool.__class__ == QueuePool
    assert engine.pool.size() <= engine.pool._pool.maxsize
    assert engine.pool._pool.maxsize == 10  # Default pool size
    assert engine.pool._max_overflow == 20  # Default max overflow

def test_testing_config(app):
    """Test testing configuration."""
    app.config.from_object('app.config.TestingConfig')
    assert app.config['DEBUG']
    assert app.config['TESTING']
    assert app.config['SQLALCHEMY_DATABASE_URI'].endswith('multiprints_test')
    
    # Verify SQLAlchemy track modifications is disabled for performance
    assert not app.config['SQLALCHEMY_TRACK_MODIFICATIONS']

def test_staging_config(app):
    """Test staging configuration."""
    # Set a mock staging database URL for testing
    os.environ['STAGING_DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/multiprints_staging'
    
    app.config.from_object('app.config.StagingConfig')
    assert not app.config['DEBUG']
    assert not app.config['TESTING']
    assert app.config['SQLALCHEMY_DATABASE_URI'].endswith('multiprints_staging')
    
    # Parse the database URL to verify it's PostgreSQL
    url = make_url(app.config['SQLALCHEMY_DATABASE_URI'])
    assert url.drivername == 'postgresql'
    
    # Clean up
    del os.environ['STAGING_DATABASE_URL']

def test_production_config(app):
    """Test production configuration."""
    # Set a mock production database URL for testing
    os.environ['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/multiprints_prod'
    
    app.config.from_object('app.config.ProductionConfig')
    assert not app.config['DEBUG']
    assert not app.config['TESTING']
    assert app.config['SQLALCHEMY_DATABASE_URI'].endswith('multiprints_prod')
    assert app.config['PREFERRED_URL_SCHEME'] == 'https'
    
    # Verify security settings
    assert app.config['SESSION_COOKIE_SECURE']
    assert app.config['REMEMBER_COOKIE_SECURE']
    assert app.config['SESSION_COOKIE_HTTPONLY']
    assert app.config['REMEMBER_COOKIE_HTTPONLY']
    
    # Clean up
    del os.environ['DATABASE_URL']

def test_database_connection_pooling(app):
    """Test database connection pooling configuration."""
    # Create a new app with development config
    app.config.from_object('app.config.DevelopmentConfig')
    
    # Get the SQLAlchemy engine
    engine = app.extensions['sqlalchemy'].db.engine
    
    # Test pool configuration
    assert engine.pool.__class__ == QueuePool
    assert engine.pool._pool.maxsize == 10  # Default pool size
    assert engine.pool._max_overflow == 20  # Default max overflow
    assert engine.pool._recycle == 1800  # 30 minutes
    assert engine.pool._pre_ping  # Connection health checks enabled