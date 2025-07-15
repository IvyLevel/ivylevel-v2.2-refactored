#!/bin/bash

# Script to manually build and push the Docker image to ECR
# This can help debug issues with the CodeBuild process

set -e  # Exit on any error

echo "=== Building and Pushing Docker Image to ECR ==="

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="211125397081"
REPOSITORY_NAME="ivylevel-backend-new"
REPOSITORY_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}"
IMAGE_TAG="latest"

echo "Repository URI: $REPOSITORY_URI"
echo "Image Tag: $IMAGE_TAG"

# Step 1: Login to ECR
echo "Step 1: Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI

# Step 2: Build the Docker image
echo "Step 2: Building Docker image..."
cd backend
docker build -t $REPOSITORY_URI:$IMAGE_TAG .

# Step 3: Push the image
echo "Step 3: Pushing image to ECR..."
docker push $REPOSITORY_URI:$IMAGE_TAG

echo "=== Success! Image pushed to ECR ==="
echo "Image URI: $REPOSITORY_URI:$IMAGE_TAG" 