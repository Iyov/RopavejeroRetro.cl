@echo off
REM ========== GENERADOR DE VARIABLES DE ENTORNO (WINDOWS) ==========
REM Este script genera env.js desde las variables de entorno

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

set ENV_FILE=.env.%ENVIRONMENT%

echo 🔧 Generando env.js desde %ENV_FILE%...

REM Verificar que el archivo .env existe
if not exist "%ENV_FILE%" (
    echo ⚠️  Archivo %ENV_FILE% no encontrado
    echo 📝 Creando env.js con valores por defecto...
    
    echo // ========== VARIABLES DE ENTORNO - DEFAULT ========== > env.js
    echo // Archivo .env no encontrado, usando valores por defecto >> env.js
    echo. >> env.js
    echo window.ENV = { >> env.js
    echo     INSTAGRAM_ACCESS_TOKEN: '', >> env.js
    echo     INSTAGRAM_USER_ID: '', >> env.js
    echo     DEBUG_MODE: 'false' >> env.js
    echo }; >> env.js
    echo. >> env.js
    echo // Generado el: %date% %time% >> env.js
    
    echo ✅ env.js creado con valores por defecto
    goto end
)

REM Leer variables del archivo .env (simplificado para Windows)
set INSTAGRAM_ACCESS_TOKEN=
set INSTAGRAM_USER_ID=
set DEBUG_MODE=false

for /f "tokens=1,2 delims==" %%a in ('type "%ENV_FILE%" ^| findstr "^INSTAGRAM_ACCESS_TOKEN="') do set INSTAGRAM_ACCESS_TOKEN=%%b
for /f "tokens=1,2 delims==" %%a in ('type "%ENV_FILE%" ^| findstr "^INSTAGRAM_USER_ID="') do set INSTAGRAM_USER_ID=%%b
for /f "tokens=1,2 delims==" %%a in ('type "%ENV_FILE%" ^| findstr "^DEBUG_MODE="') do set DEBUG_MODE=%%b

REM Generar env.js
echo // ========== VARIABLES DE ENTORNO - %ENVIRONMENT% ========== > env.js
echo // Generado automáticamente desde %ENV_FILE% >> env.js
echo // NO edites este archivo manualmente >> env.js
echo. >> env.js
echo window.ENV = { >> env.js
echo     INSTAGRAM_ACCESS_TOKEN: '%INSTAGRAM_ACCESS_TOKEN%', >> env.js
echo     INSTAGRAM_USER_ID: '%INSTAGRAM_USER_ID%', >> env.js
echo     DEBUG_MODE: '%DEBUG_MODE%' >> env.js
echo }; >> env.js
echo. >> env.js
echo // Generado el: %date% %time% >> env.js

echo ✅ env.js generado exitosamente
echo 📊 Variables cargadas:
if "%INSTAGRAM_ACCESS_TOKEN%"=="" (
    echo    - INSTAGRAM_ACCESS_TOKEN: NOT SET
) else (
    echo    - INSTAGRAM_ACCESS_TOKEN: SET
)
if "%INSTAGRAM_USER_ID%"=="" (
    echo    - INSTAGRAM_USER_ID: NOT SET
) else (
    echo    - INSTAGRAM_USER_ID: SET
)
echo    - DEBUG_MODE: %DEBUG_MODE%

REM Verificar que env.js está en .gitignore
findstr /c:"env.js" .gitignore >nul
if %errorlevel%==0 (
    echo 🔒 env.js está protegido por .gitignore
) else (
    echo ⚠️  ADVERTENCIA: env.js no está en .gitignore
)

:end