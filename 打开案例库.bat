@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo 没有找到 Node.js，先用文件方式打开。
  echo 提示：直接打开 file:// 页面时，Chrome 不提供跨页面滑动过渡。
  echo.
  start "" "%~dp0index.html"
  exit
)
echo 正在启动 AI 案例库...
start "AI案例库本地服务" /min cmd /c "node edit-server.mjs"
timeout /t 2 >nul
start "" "http://127.0.0.1:8125/"
exit