#!/bin/bash
LOC=https://github.com/RKaneda9/personal-frontend.git

echo "Retrieving personal-frontend from ${LOC} into temp folder..."
git clone ${LOC} scripts/temp

echo "Moving built folders and files into public folder..."
cp -R -v ./scripts/temp/build/* ./public

echo "Removing temp folder..."
rm -rf scripts/temp

echo "Updating personal-backend..."
git pull origin master

echo "Restarting application..."
command -v forever restart app.js || npm start