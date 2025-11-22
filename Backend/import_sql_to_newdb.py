import sqlite3
import os
from datetime import datetime

SQL_FILE = os.path.join(os.path.dirname(__file__), 'database_export.sql')
NEW_DB_FILE = os.path.join(os.path.dirname(__file__), 'db_imported.sqlite3')

if not os.path.exists(SQL_FILE):
    print('SQL file not found:', SQL_FILE)
    raise SystemExit(1)

# If new DB exists, backup it
if os.path.exists(NEW_DB_FILE):
    ts = datetime.now().strftime('%Y%m%d%H%M%S')
    bak = NEW_DB_FILE + f'.bak.{ts}'
    os.replace(NEW_DB_FILE, bak)
    print('Backed up existing', NEW_DB_FILE, 'to', bak)

with open(SQL_FILE, 'r', encoding='utf-8') as f:
    sql = f.read()

try:
    conn = sqlite3.connect(NEW_DB_FILE)
    cur = conn.cursor()
    cur.executescript(sql)
    conn.commit()
    conn.close()
    print('Successfully imported SQL into', NEW_DB_FILE)
    print('You can inspect it or replace your active db.sqlite3 after stopping the server.')
except Exception as e:
    print('Error importing SQL:', e)
    raise
