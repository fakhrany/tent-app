@echo off
REM Tent App - Quick Setup Script for Windows
REM This script helps you set up the app quickly

echo.
echo ========================================
echo    Tent App - Quick Setup
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo WARNING: .env file already exists!
    set /p OVERWRITE="Do you want to overwrite it? (y/N): "
    if /i not "%OVERWRITE%"=="y" (
        echo Keeping existing .env file
        set SKIP_ENV=true
    )
)

REM Create .env file if needed
if not "%SKIP_ENV%"=="true" (
    echo.
    echo Setting up environment variables...
    echo.
    
    REM Get OpenAI API Key
    set /p OPENAI_KEY="Enter your OpenAI API Key: "
    
    REM Get Perplexity API Key
    echo.
    set /p PERPLEXITY_KEY="Enter your Perplexity API Key (optional, press Enter to skip): "
    
    REM Get Database URL
    echo.
    set /p DATABASE_URL="Enter your Database URL: "
    
    REM Generate NextAuth Secret
    echo.
    echo Generating NextAuth secret...
    for /f "delims=" %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"') do set NEXTAUTH_SECRET=%%i
    
    REM Create .env file
    (
        echo # Database
        echo DATABASE_URL="%DATABASE_URL%"
        echo.
        echo # OpenAI
        echo OPENAI_API_KEY="%OPENAI_KEY%"
        echo.
        echo # Perplexity (optional^)
        echo PERPLEXITY_API_KEY="%PERPLEXITY_KEY%"
        echo.
        echo # NextAuth
        echo NEXTAUTH_SECRET="%NEXTAUTH_SECRET%"
        echo NEXTAUTH_URL="http://localhost:3000"
        echo.
        echo # App
        echo NODE_ENV="development"
        echo NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ) > .env
    
    echo.
    echo ✓ .env file created!
    echo.
)

REM Check if pnpm is installed
where pnpm >nul 2>&1
if errorlevel 1 (
    echo WARNING: pnpm is not installed
    echo Installing pnpm...
    call npm install -g pnpm
)

REM Install dependencies
echo.
echo Installing dependencies...
call pnpm install

REM Ask if user wants to setup database
echo.
set /p INIT_DB="Do you want to initialize the database now? (Y/n): "
if /i "%INIT_DB%"=="n" (
    echo.
    echo Skipped database initialization
    echo Run 'pnpm db:push' when ready to initialize
) else (
    echo.
    echo Initializing database...
    call pnpm db:push
    echo.
    echo ✓ Database initialized!
)

REM Success message
echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Start dev server:  pnpm dev
echo   2. Open browser:      http://localhost:3000
echo   3. Admin panel:       http://localhost:3000/admin/dashboard
echo.
echo Deployment options:
echo   - Railway:  See ONE_CLICK_DEPLOY.md
echo   - Vercel:   See ONE_CLICK_DEPLOY.md
echo   - Render:   See ONE_CLICK_DEPLOY.md
echo.
echo Happy coding! 🚀
echo.
pause
