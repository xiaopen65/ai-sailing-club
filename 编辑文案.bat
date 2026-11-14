@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo 没有找到 Node.js，请先安装 Node.js 再运行这个脚本。
  echo.
  pause
  exit /b 1
)
start "AI案例库编辑服务" cmd /k "node edit-server.mjs"
timeout /t 2 >nul
start "" "http://127.0.0.1:8125/?edit=1"
exit
