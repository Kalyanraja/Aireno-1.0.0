#!/bin/bash

echo "Cleaning project..."

# Clean watchman
watchman watch-del-all

# Clean node modules
rm -rf node_modules
rm package-lock.json

# Clean React Native
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# Clean iOS
cd ios
rm -rf Pods
rm -rf build
rm Podfile.lock
pod cache clean --all
cd ..

# Install dependencies
echo "Installing dependencies..."
npm install

# Install pods
echo "Installing pods..."
cd ios && pod install && cd ..

# Start the project
echo "Starting Metro..."
npm start -- --reset-cache