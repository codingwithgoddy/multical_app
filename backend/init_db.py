"""
Database initialization script.
This script initializes the database with migrations.
"""
import os
import sys
import logging
import argparse
from flask_migrate import init, migrate, upgrade, current
from sqlalchemy.exc import SQLAlchemyError, ProgrammingError, OperationalError
from app import create_app
from app.models import db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('logs/db_init.log')
    ]
)
logger = logging.getLogger('db_init')

def init_db(env='development', force=False):
    """
    Initialize the database with migrations.
    
    Args:
        env: The environment to use (development, testing, staging, production)
        force: Whether to force initialization even if migrations exist
    """
    logger.info(f"Initializing database for {env} environment...")
    
    # Create the application with the specified environment
    app = create_app(env)
    
    with app.app_context():
        # Check if database exists and is accessible
        try:
            with db.engine.connect() as connection:
                connection.execute("SELECT 1")
            logger.info("Database connection successful.")
        except (ProgrammingError, OperationalError) as e:
            logger.error(f"Error connecting to database: {e}")
            logger.error("Please make sure the database exists and is accessible.")
            logger.error("You may need to create the database first with:")
            logger.error("  createdb multiprints_dev")
            logger.error("  createdb multiprints_test")
            sys.exit(1)
        except SQLAlchemyError as e:
            logger.error(f"Database error: {e}")
            sys.exit(1)
        
        # Check if migrations directory exists
        migrations_dir_exists = os.path.exists('migrations')
        
        # Initialize migrations if they don't exist or force is True
        if not migrations_dir_exists or force:
            try:
                logger.info("Initializing migrations directory...")
                init()
                logger.info("Migrations directory initialized.")
            except Exception as e:
                if not force:
                    logger.error(f"Error initializing migrations: {e}")
                    sys.exit(1)
                else:
                    logger.warning(f"Error initializing migrations (ignored with force): {e}")
        else:
            logger.info("Migrations directory already exists.")
        
        # Create initial migration if needed
        try:
            # Check if we have any migrations
            has_migrations = False
            if os.path.exists('migrations/versions'):
                has_migrations = len(os.listdir('migrations/versions')) > 0
            
            if not has_migrations or force:
                logger.info("Creating initial migration...")
                migrate(message="Initial migration")
                logger.info("Initial migration created.")
            else:
                logger.info("Migrations already exist, skipping initial migration creation.")
        except Exception as e:
            logger.error(f"Error creating migration: {e}")
            if not force:
                sys.exit(1)
        
        # Apply migrations
        try:
            logger.info("Applying migrations...")
            upgrade()
            logger.info("Migrations applied successfully.")
        except Exception as e:
            logger.error(f"Error applying migrations: {e}")
            sys.exit(1)
        
        logger.info("Database initialization complete.")
        logger.info(f"Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")

if __name__ == '__main__':
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Initialize the database with migrations.')
    parser.add_argument('--env', choices=['development', 'testing', 'staging', 'production'],
                        default='development', help='Environment to use')
    parser.add_argument('--force', action='store_true', help='Force initialization even if migrations exist')
    args = parser.parse_args()
    
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    # Initialize the database
    init_db(args.env, args.force)