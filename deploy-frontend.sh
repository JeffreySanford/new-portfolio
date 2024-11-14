#!/bin/bash

# Define the source and destination directories
SOURCE_DIR="dist/apps/frontend/browser"
DEST_DIR="/usr/share/nginx/html"

# Build the frontend application
echo "Building the frontend application..."
npx nx build frontend

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

echo "Build completed successfully."

# Remove existing files in the destination directory
echo "Removing existing files in the destination directory: $DEST_DIR"
sudo rm -rf $DEST_DIR/*

# Copy the built files to the Nginx web root directory
echo "Copying built files from $SOURCE_DIR to $DEST_DIR"
sudo cp -r $SOURCE_DIR/* $DEST_DIR/

# Print a success message
echo "Frontend application deployed successfully to $DEST_DIR"
