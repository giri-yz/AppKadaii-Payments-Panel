#!/bin/bash

# A script to build and deploy the static Next.js PWA to Google Cloud Storage.

# --- Configuration ---
# IMPORTANT: Before running, replace this with your Google Cloud Storage bucket name.
# Your bucket name must be globally unique.
# Example: BUCKET_NAME="my-awesome-app-pwa"
BUCKET_NAME="YOUR_BUCKET_NAME_HERE"

# --- Script ---

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting Deployment to Google Cloud Storage ---"

# Check if the bucket name has been set.
if [ "$BUCKET_NAME" == "YOUR_BUCKET_NAME_HERE" ]; then
  echo "Error: Please edit this script and replace 'YOUR_BUCKET_NAME_HERE' with your actual GCS bucket name."
  exit 1
fi

# 1. Build the application
echo "Step 1: Building the static application..."
npm run build
echo "Build complete. Static files are in the 'out' directory."

# 2. Deploy to Google Cloud Storage
# The 'rsync' command is efficient, as it only uploads new or changed files.
# The '-d' flag deletes files in the destination that are not present in the source.
# The '-r' flag makes the sync recursive.
echo ""
echo "Step 2: Syncing 'out' directory with GCS bucket: gs://$BUCKET_NAME"
gcloud storage rsync -d -r out/ gs://$BUCKET_NAME
echo "Sync complete."

# 3. Set public permissions
# This makes all files in the bucket publicly readable, which is necessary for a public website.
echo ""
echo "Step 3: Setting public read access on all files..."
gcloud storage objects update --bucket=$BUCKET_NAME --all --add-iam-policy-binding='allUsers:objectViewer'
echo "Permissions set."

echo ""
echo "--- Deployment Successful! ---"
echo "Your application is now available at: https://storage.googleapis.com/$BUCKET_NAME/index.html"
