@echo off
chcp 65001 >nul
title Compilar Etiquetas Tienda Pro
cd /d "%~dp0"
echo ===============================================
echo   ETIQUETAS TIENDA PRO - GENERAR .EXE
echo ===============================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado.
  echo Instala Node.js LTS y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
echo [1/2] Instalando dependencias...
call npm install
if errorlevel 1 goto error
echo.
echo [2/2] Generando instalador .EXE para Windows x64...
call npm run build:win
if errorlevel 1 goto error
echo.
echo LISTO. El instalador esta dentro de la carpeta dist.
explorer "%~dp0dist"
pause
exit /b 0
:error
echo.
echo Ocurrio un error durante la compilacion.
pause
exit /b 1
