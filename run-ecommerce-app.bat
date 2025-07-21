@echo off
REM Start the Vite dev server and open the app in the default browser
cd cursor-ecommerce-wizard
start cmd /k "npm run dev"
REM Wait a few seconds for the server to start, then open in browser
ping 127.0.0.1 -n 5 > nul
start http://localhost:5173/ 