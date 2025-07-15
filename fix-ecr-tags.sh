#!/bin/bash

# Script to fix ECR tags if the build didn't push them properly
# Run this if you're getting "latest: not found" errors

echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 211125397081.dkr.ecr.us-east-1.amazonaws.com

REPOSITORY_URI=211125397081.dkr.ecr.us-east-1.amazonaws.com/ivylevel-backend-new

# Get the latest commit hash from the build
COMMIT_HASH="dd24f48"  # Replace with actual commit hash from your build

echo "Tagging and pushing latest tag..."
docker pull $REPOSITORY_URI:$COMMIT_HASH
docker tag $REPOSITORY_URI:$COMMIT_HASH $REPOSITORY_URI:latest
docker push $REPOSITORY_URI:latest

echo "Done! Latest tag should now be available." 