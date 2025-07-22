"""
Database recreation script.
This script drops and recreates the database using migrations.
WARNING: This will delete all data in the database.
"""
import os
import sys
import logging
import argparse
from flask_migrate import downgrade, upgrade
from sqlalchemy.exc import SQLAlchemyError, ProgrammingError, OperationalError
from app import create_app
from app.models import db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('logs/db_recreate.log')
    ]
)
logger = logging.getLogger('db_recreate')

def drop_recreate_db(env='development', skip_confirmation=False):
    """
    Drop and recreate the database using migrations.
    
    Args:
        env: The environment to use (development, testing, staging, production)
        skip_confirmation: Whether to skip the confirmation prompt
    """
    if env == 'production' and not skip_confirmation:
        logger.warning("WARNING: You are about to drop the PRODUCTION database!")
        logger.warning("This will delete ALL data in the database.")
        confirmation = input("Are you ABSOLUTELY sure you want to continue? Type 'yes' to confirm: ")
        
        if confirmation.lower() != 'yes':
            logger.info("Operation cancelled.")
            sys.exit(0)
    elif not skip_confirmation:
        logger.warning(f"WARNING: You are about to drop the {env.upper()} database!")
        logger.warning("This will delete ALL data in the database.")
        confirmation = input("Are you sure you want to continue? (y/n): ")
        
        if confirmation.lower() != 'y':
            logger.info("Operation cancelled.")
            sys.exit(0)
    
    # Create the application with the specified environment
    logger.info(f"Recreating database for {env} environment...")
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
            sys.exit(1)
        except SQLAlchemyError as e:
            logger.error(f"Database error: {e}")
            sys.exit(1)
        
        # Drop all tables using migrations
        try:
            logger.info("Downgrading database to base revision...")
            downgrade(revision='base')
            logger.info("Database downgraded to base revision.")
        except Exception as e:
            logger.error(f"Error downgrading database: {e}")
            logger.info("Attempting to drop all tables directly...")
            try:
                db.drop_all()
                logger.info("All tables dropped directly.")
            except Exception as e2:
                logger.error(f"Error dropping tables: {e2}")
                sys.exit(1)
        
        # Recreate all tables using migrations
        try:
            logger.info("Upgrading database to head revision...")
            upgrade(revision='head')
            logger.info("Database upgraded to head revision.")
        except Exception as e:
            logger.error(f"Error upgrading database: {e}")
            logger.info("Attempting to create all tables directly...")
            try:
                db.create_all()
                logger.info("All tables created directly.")
            except Exception as e2:
                logger.error(f"Error creating tables: {e2}")
                sys.exit(1)
        
        logger.info("Database recreation complete.")
        logger.info(f"Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")

if __name__ == '__main__':
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Drop and recreate the database using migrations.')
    parser.add_argument('--env', choices=['development', 'testing', 'staging', 'production'],
                        default='development', help='Environment to use')
    parser.add_argument('--yes', action='store_true', help='Skip confirmation prompt')
    args = parser.parse_args()
    
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    # Drop and recreate the database
    drop_recreate_db(args.env, args.yes)