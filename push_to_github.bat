@echo off
set "PATH=C:\Users\ceilo\Documents\tools\git\cmd;%PATH%"
echo =======================================================
echo Mengunggah (Push) DORE POS ke GitHub (sclzz/dore-coffee-pos)...
echo =======================================================
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================
    echo BERHASIL DI-PUSH KE GITHUB!
    echo Cek di: https://github.com/sclzz/dore-coffee-pos
    echo =======================================================
) else (
    echo.
    echo Ada kendala login akun GitHub. Silakan gunakan Personal Access Token jika diminta.
)
pause
