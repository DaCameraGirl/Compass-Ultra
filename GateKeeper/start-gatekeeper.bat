@echo off
title GateKeeper 🤖
cd /d "C:\Users\enter\OneDrive\Desktop\GateKeeper"

:: Check if server is already running
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% == 0 (
    start "" "http://localhost:3000"
    exit
)

:: Start server in background
start "" /min cmd /c "node --env-file=.env server.js"

:: Wait a moment then open browser
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
