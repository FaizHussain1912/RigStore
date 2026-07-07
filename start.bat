@echo off
echo ========================================================
echo Starting RigStore Platform
echo ========================================================

echo [1/3] Setting up environment...
cd /d "%~dp0"

echo [2/3] Starting Backend API (Port 6767)...
start "RigStore Backend" cmd /c "cd apps\backend && npm run dev"

echo [3/3] Starting Frontend UI (Port 3000)...
start "RigStore Frontend" cmd /c "cd apps\frontend && npm run dev"

echo Waiting 5 seconds for servers to initialize...
timeout /t 5 /nobreak > nul

echo Opening browser...
start http://localhost:3000/builder

echo ========================================================
echo RIGSTORE IS RUNNING
echo Backend: http://localhost:6767
echo Frontend: http://localhost:3000
echo ========================================================
echo Keep this window open. Close it to stop everything.
pause
