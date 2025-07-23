import os
import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Must set DATABASE_URL *before* importing modules (e.g. app.py) that read it!
TEST_DB_URL = "sqlite:///:memory:"
os.environ["DATABASE_URL"] = TEST_DB_URL

# pylint: disable=C0413 # Import deliberately placed after setting env var
from generated.models import Base
from app import create_app
from persistence import database

engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)

TestingSessionLocal = sessionmaker(bind=engine)
database.engine = engine
database.SessionLocal = TestingSessionLocal


@event.listens_for(engine, "connect")
def enable_sqlite_fk_constraints(dbapi_connection, _):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


@pytest.fixture(scope="function")
def test_app():
    Base.metadata.create_all(bind=engine)
    flask_app = create_app()
    flask_app.config["TESTING"] = True
    yield flask_app
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(test_app):
    return test_app.test_client()


@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()
