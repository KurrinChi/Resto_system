import sqlite3
import shutil
import os
from datetime import datetime

SQL_FILE = os.path.join(os.path.dirname(__file__), 'database_export.sql')
DB_FILE = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

def backup_db(db_path: str) -> str:
    if not os.path.exists(db_path):
        return ''
    ts = datetime.now().strftime('%Y%m%d%H%M%S')
    backup_path = f"{db_path}.bak.{ts}"
    shutil.copyfile(db_path, backup_path)
    return backup_path


def import_sql(sql_file: str, db_path: str):
    if not os.path.exists(sql_file):
        print(f"SQL file not found: {sql_file}")
        return 1

    # Backup existing DB if present
    if os.path.exists(db_path):
        print(f"Backing up existing DB: {db_path}")
        backup_path = backup_db(db_path)
        print(f"Backup created: {backup_path}")

    # Remove existing DB to ensure clean import
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print(f"Removed existing DB to recreate: {db_path}")
        except Exception as e:
            print(f"Failed to remove existing DB: {e}")
            return 2

    # Read SQL
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql = f.read()

    # Execute SQL
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.executescript(sql)
        conn.commit()
        conn.close()
        print(f"Successfully imported SQL into {db_path}")
        return 0
    except Exception as e:
        print(f"Error executing SQL: {e}")
        return 3


if __name__ == '__main__':
    exit(import_sql(SQL_FILE, DB_FILE))
