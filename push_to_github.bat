@echo off
echo ==========================================
echo   PUSHING CHAINCAST-IDS TO GITHUB
echo ==========================================
echo.

git init
git add .
git commit -m "Final Hackathon Commit"
git branch -M main

echo.
echo Removing old remote if exists...
git remote remove origin 2>nul

echo.
echo Adding remote: https://github.com/ojhaddeepak/Unstoppable-ChainCast-IDS.git
git remote add origin https://github.com/ojhaddeepak/Unstoppable-ChainCast-IDS.git

echo.
echo PUSHING... (You may be asked to sign in)
git push -u origin main

echo.
echo ==========================================
echo   DONE! CHECK GITHUB NOW.
echo ==========================================
pause
