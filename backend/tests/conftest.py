"""
Test configuration module.
This module contains fixtures for testing.
"""
import os
import pytest
import logging
from sqlalchemy.exc import SQLAlchemyError
from app import create_app
from app.models import db as _db, BaseModel

# Configure logging for tests
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('tests')

@pytest.fixture(scope='session')
def app():
    """Create and configure a Flask app for testing."""
    # Set the testing environment variable
    os.environ['FLASK_ENV'] = 'testing'
    
    # Create the app with the testing configuration
    app = create_app('testing')
    
    # Create a test client
    with app.app_context():
        yield app

@pytest.fixture(scope='session')
def db(app):
    """Create and configure a database for testing."""
    # Create the database and tables
    with app.app_context():
        try:
            # Check if database is accessible
            with _db.engine.connect() as connection:
                connection.execute("SELECT 1")
            logger.info("Test database connection successful")
            
            # Create all tables
            _db.create_all()
            logger.info("Test database tables created")
            
            yield _db
            
            # Clean up after the tests
            _db.session.remove()
            _db.drop_all()
            logger.info("Test database tables dropped")
        except SQLAlchemyError as e:
            logger.error(f"Test database error: {str(e)}")
            pytest.fail(f"Could not connect to test database: {str(e)}")

@pytest.fixture(scope='function')
def session(db):
    """Create a new database session for a test."""
    # Connect to the database and begin a transaction
    connection = db.engine.connect()
    transaction = connection.begin()
    
    # Create a session bound to the connection
    session = db.create_scoped_session(options={"bind": connection, "binds": {}})
    db.session = session
    
    yield session
    
    # Clean up after the test
    transaction.rollback()
    connection.close()
    session.remove()

@pytest.fixture(scope='function')
def client(app):
    """Create a test client for the app."""
    return app.test_client()

@pytest.fixture(scope='function')
def test_models(session):
    """Create test models for database testing."""
    # This fixture can be used to create test data for database tests
    class TestModel(BaseModel):
        __tablename__ = 'test_models'
        name = _db.Column(_db.String(50), nullable=False)
        description = _db.Column(_db.Text)
    
    # Create the test model table
    _db.create_all()
    
    # Create some test data
    test_model1 = TestModel(name='Test 1', description='Test description 1')
    test_model2 = TestModel(name='Test 2', description='Test description 2')
    
    session.add(test_model1)
    session.add(test_model2)
    session.commit()
    
    yield {
        'TestModel': TestModel,
        'test_model1': test_model1,
        'test_model2': test_model2
    }
    
    # Clean up
    _db.session.query(TestModel).delete()
    _db.session.commit()

@pytest.fixture(scope='function')
def auth_headers():
    """Create authentication headers for API tests."""
    # This fixture can be used to create authentication headers for API tests
    return {
        'Authorization': 'Bearer test_token',
        'Content-Type': 'application/json'
    }