@echo off

REM Obtener la fecha en formato AAAA-MM-DD
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i

REM Crear carpeta de respaldo
mkdir "resguardos_tpi\%FECHA%"

REM Ejecutar backup
mongodump ^
 --uri="mongodb+srv://Profesor:UTN2026@clusterstreamingtpi.bikjfrm.mongodb.net/streaming_tpi" ^
 --out="resguardos_tpi\%FECHA%"

echo.
echo =============================
echo Backup finalizado correctamente
echo Carpeta:
echo resguardos_tpi\%FECHA%
echo =============================

pause