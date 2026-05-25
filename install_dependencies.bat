@echo off
title Orbit v3 Backend Dependency Installer
echo =======================================================
echo  ORBIT V3 - INSTALLING ALL BACKEND DEPENDENCIES
echo =======================================================
echo.

echo Cleaning and downloading dependencies for Unified Backend...
cd backend
go mod tidy
cd ..

echo.
echo =======================================================
echo  INSTALLATION COMPLETE! ALL DEPENDENCIES DOWNLOADED!
echo  You can now run "run_backend.bat" to start the server.
echo =======================================================
echo.
pause
