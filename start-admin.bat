@echo off
cd /d "%~dp0"
start "personal-site-server" /min cmd /c "node server.cjs 4175"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4175/admin.html"
exit
