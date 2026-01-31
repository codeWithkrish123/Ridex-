@echo off
echo Starting push process...

REM Check and remove nested git repo in RideX
if exist "RideX\.git" (
    echo Found nested .git in RideX. Removing it to unify the repository...
    rmdir /s /q "RideX\.git"
    if exist "RideX\.git" (
        echo Failed to remove RideX\.git. Please close any programs using it and try again.
        pause
        exit /b 1
    ) else (
        echo Recursively removed RideX\.git
    )
)

REM Check config
git remote -v

echo Adding all files to git (this may take a moment)...
git add .

echo Committing changes...
git commit -m "Sync all folders (RideX and backend)"

echo Pushing to origin main...
git push -u origin main

echo.
echo Process completed.
pause
