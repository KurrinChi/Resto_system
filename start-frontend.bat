@echo off
echo ========================================
echo Restaurant System - Frontend (Vite)
echo ========================================
echo.

echo Checking Node.js version...
node --version
npm --version
echo.

echo Checking .env file...
if exist .env (
    echo ✓ .env file found
    type .env
) else (
    if exist .env.example (
        echo ⚠ Creating .env from .env.example...
        copy .env.example .env
        echo ✓ .env file created. Please check the configuration.
    ) else (
        echo ✗ No .env or .env.example file found!
        echo Creating default .env file...
        echo VITE_API_URL=http://localhost:8000/api/admin > .env
        echo ✓ Default .env file created
    )
)
echo.

echo Installing dependencies...
call npm install
echo.

echo Starting Vite development server...
echo.
echo Frontend will run at: http://localhost:5173
echo.
echo Keep this window open to keep the server running!
echo Press CTRL+C to stop the server
echo.
echo ========================================
echo.

call npm run dev

pause
