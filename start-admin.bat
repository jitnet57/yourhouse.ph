@echo off
REM K-IREA Admin Dashboard Launcher
REM Starts the Next.js dev server on http://localhost:3001

cd /d "%~dp0apps\admin"

echo ================================================
echo   K-IREA Admin Dashboard
echo   Starting dev server at http://localhost:3001
echo ================================================
echo.

REM Open browser after 8 seconds (gives server time to boot)
start "" cmd /c "timeout /t 8 >nul && start http://localhost:3001/dashboard"

REM Start the Next.js dev server (stays in foreground)
call npm run dev

pause
