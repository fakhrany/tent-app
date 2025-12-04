@echo off
REM Tent - Quick Install Script for Windows

echo.
echo ===================================================
echo     Tent - AI Real Estate Search Setup
echo ===================================================
echo.

REM Check if in correct directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the tent-app directory
    pause
    exit /b 1
)

echo [OK] Found package.json
echo.

REM Step 1: Check Node.js
echo Step 1: Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 20+ from https://nodejs.org
    pause
    exit /b 1
)
node -v
echo [OK] Node.js detected
echo.

REM Step 2: Check pnpm
echo Step 2: Checking pnpm...
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] pnpm not found. Installing...
    npm install -g pnpm
)
pnpm -v
echo [OK] pnpm ready
echo.

REM Step 3: Install dependencies
echo Step 3: Installing dependencies...
echo This may take a few minutes...
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 4: Setup environment
echo Step 4: Setting up environment...
if not exist ".env.local" (
    copy .env.example .env.local
    echo [OK] Created .env.local from template
    echo.
    echo ===================================================
    echo   IMPORTANT: Configure .env.local
    echo ===================================================
    echo.
    echo Required settings:
    echo 1. DATABASE_URL - PostgreSQL connection string
    echo 2. NEXTAUTH_SECRET - Generate random string
    echo 3. ANTHROPIC_API_KEY or OPENAI_API_KEY
    echo.
    echo Open .env.local in your editor and add these values.
    echo.
    pause
) else (
    echo [OK] .env.local already exists
)
echo.

REM Step 5: Database setup
echo Step 5: Database setup...
echo.
echo Make sure you have:
echo   - PostgreSQL 16+ installed and running
echo   - pgvector extension enabled
echo   - Database created
echo.
set /p dbready="Is your database ready? (y/n) "
if /i not "%dbready%"=="y" (
    echo.
    echo Please set up PostgreSQL first.
    echo.
    echo Windows:
    echo   - Download from: https://www.postgresql.org/download/windows/
    echo   - Or use Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16
    echo.
    echo Cloud options:
    echo   - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
    echo   - Neon: https://neon.tech
    echo   - Supabase: https://supabase.com
    echo.
    pause
    exit /b 1
)

REM Step 6: Initialize database
echo.
echo Step 6: Initializing database...
echo.
echo Pushing schema...
call pnpm db:push
if %errorlevel% neq 0 (
    echo ERROR: Failed to push schema. Check your DATABASE_URL
    pause
    exit /b 1
)
echo [OK] Schema created
echo.
echo Seeding with sample data...
call pnpm db:seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)
echo [OK] Database seeded
echo.

REM Success!
echo.
echo ===================================================
echo    Setup Complete! ^_^
echo ===================================================
echo.
echo Your Tent application is ready!
echo.
echo To start the development server:
echo   pnpm dev
echo.
echo Then open: http://localhost:3000
echo.
echo Try these search queries:
echo   - 3-bedroom apartments in New Cairo under 5M
echo   - Luxury villas in 6th of October
echo   - Penthouses in New Capital
echo.
echo Happy coding!
echo.
pause
