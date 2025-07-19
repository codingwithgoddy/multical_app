# Multiprints Backend

This is the backend API for the Multiprints Business Management System.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file to add your configuration.

5. Set up the database:
   ```bash
   # Create the database
   createdb multiprints_dev
   
   # Run migrations (once they are created)
   # flask db upgrade
   ```

6. Run the application:
   ```bash
   flask run
   ```

## API Endpoints

- `GET /api/v1/health`: Health check endpoint
- `GET /api/v1/`: API root endpoint

## Development

- To add new models, create them in the `models` directory
- To add new routes, create them in the `routes` directory
- To run tests: `pytest`