# FastAPI Project with PostgreSQL, SQLAlchemy, Alembic, Pydantic, and JWT Authentication

This FastAPI application integrates PostgreSQL using SQLAlchemy for ORM, Alembic for database migrations, Pydantic for data validation, and JWT for authentication.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Database Migrations](#database-migrations)
7. [Testing](#testing)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)
10. [License](#license)
11. [Contact](#contact)

## Project Overview

This FastAPI project provides a backend service with user, project, task, and comment management features. It includes JWT authentication and utilizes PostgreSQL for database management.

## Prerequisites

Ensure you have the following installed:

- Python 3.11 or later
- PostgreSQL
- `pip` for Python package management

## Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/abdulahadmansoori/task-management-system.git
   cd task-management-system

2. **Create and Activate a Virtual Environment:**

    python -m venv venv
    source venv/bin/activate  # On Unix or MacOS
    .\venv\Scripts\activate   # On Windows

3. **Install Dependencies:**

    pip install -r requirements.txt

4. **Set Up the PostgreSQL Database::**

    Ensure PostgreSQL is running and create a new database:

    psql -U postgres
    CREATE DATABASE TMA;

5. **Configure Database Connection:**

    Create a .env file in the root directory and add your database configuration:

    user_name = 'postgres'

    password = 'postgres'

    server = 'localhost'

    db_name = 'TMA'

    DATABASE_URL = f"postgresql://{user_name}:{password}@{server}/{db_name}"

    Replace user, password, localhost, and yourdatabase with your PostgreSQL credentials and database name.
    
6. **Define default users:**

    DEFAULT_USERS = [
    
        {"name": "Admin", "email": "admin@example.com", "password": "Admin$100", "role": "admin"},
        {"name": "User", "email": "user@example.com", "password": "User$100", "role": "user"}
    ]
    
## Running the Application

1. **Start the FastAPI Application:**
    uvicorn main:app --reload

    This starts the FastAPI server in development mode. The application will be accessible at http://127.0.0.1:8000.

2. **Access the API Documentation:**

    Swagger UI: http://127.0.0.1:8000/docs
    ReDoc: http://127.0.0.1:8000/redoc

## Database Migrations

1. **Initialize Alembic:**

    alembic init alembic

2. **Create a Migration Script:**

    alembic revision --autogenerate -m "Initial migration"

3. **Apply Migrations:**

    alembic upgrade head

## Testing

1. **Run Unit Tests:**

    Ensure your tests are defined and run them with pytest:

    pytest

## API Documentation

    Interactive API documentation is provided by FastAPI. You can access:

    Swagger UI: http://127.0.0.1:8000/docs
    ReDoc: http://127.0.0.1:8000/redoc

## Troubleshooting

    Connection Errors: Verify PostgreSQL is running and that the DATABASE_URL in your .env file is accurate.
    Dependency Issues: Ensure your virtual environment is active and all dependencies are installed using pip install -r requirements.txt.
    Migration Issues: Check your Alembic configuration and database setup.

## License
    
    This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For questions or support, please contact ahadmansoori110@gmail.com.
