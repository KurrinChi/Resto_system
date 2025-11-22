"""Export SQLite database to SQL file"""
import sqlite3
import os

# Connect to the database
db_path = 'db.sqlite3'
export_path = 'database_export.sql'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    
    with open(export_path, 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            f.write(f'{line}\n')
    
    conn.close()
    print(f'✓ Database successfully exported to {export_path}')
    print(f'✓ File size: {os.path.getsize(export_path) / 1024:.2f} KB')
    print(f'\nYour coworker can import this using:')
    print(f'  sqlite3 db.sqlite3 < database_export.sql')
else:
    print(f'Error: {db_path} not found')
