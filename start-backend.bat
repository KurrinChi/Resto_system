@echo off
echo ========================================
echo Restaurant System - Backend Server
echo ========================================
echo.

cd Backend

echo Checking Python environment...
python --version
echo.

echo Installing dependencies...
pip install -r requirements.txt
echo.

echo Starting Django server...
echo.
echo Server will run at: http://localhost:8000
echo Admin API available at: http://localhost:8000/api/admin
echo.
echo Keep this window open to keep the server running!
echo Press CTRL+C to stop the server
echo.
echo ========================================
echo.

python manage.py runserver

pause
