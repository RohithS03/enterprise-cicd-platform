import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cicd_platform.db")
SQL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "database")

_db_conn = None

def get_db_connection():
    global _db_conn
    if _db_conn is None:
        _db_conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        _db_conn.row_factory = sqlite3.Row
        _db_conn.execute("PRAGMA foreign_keys = ON;")
    return _db_conn

def initialize_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    schema_file = os.path.join(SQL_DIR, "01_schema.sql")
    seed_file = os.path.join(SQL_DIR, "02_seed_data.sql")

    if os.path.exists(schema_file):
        with open(schema_file, 'r', encoding='utf-8') as f:
            cursor.executescript(f.read())

    if os.path.exists(seed_file):
        try:
            with open(seed_file, 'r', encoding='utf-8') as f:
                cursor.executescript(f.read())
        except Exception:
            pass # Seed already present

    conn.commit()

def query_db(query, args=(), one=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, args)
    r = cursor.fetchall()
    conn.commit()
    return (r[0] if r else None) if one else r

def execute_db(query, args=()):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, args)
    conn.commit()
    return cursor.lastrowid
