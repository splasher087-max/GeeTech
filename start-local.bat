@echo off
cd /d "%~dp0"
echo.
echo GeeTech lokale Vorschau: http://localhost:8000/
echo Zum Beenden dieses Fenster schliessen oder Strg+C druecken.
echo.
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -m http.server 8000 --bind 127.0.0.1
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8000 --bind 127.0.0.1
  goto :end
)
echo Python 3 wurde nicht gefunden.
echo Installiere Python 3 oder fuehre den Server ueber VS Code Live Server aus.
pause
:end
