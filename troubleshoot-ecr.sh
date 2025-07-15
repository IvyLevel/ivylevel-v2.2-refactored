#!/bin/bash

# Comprehensive ECR Troubleshooting Script
# This script helps identify and fix ECR-related issues

set -e

echo "=== ECR Troubleshooting Script ==="

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="211125397081"
REPOSITORY_NAME="ivylevel-backend-new"
REPOSITORY_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}"

echo "Repository URI: $REPOSITORY_URI"
echo ""

# Step 1: Check if AWS CLI is configured
echo "Step 1: Checking AWS CLI configuration..."
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"
echo ""

# Step 2: Check if ECR repository exists
echo "Step 2: Checking if ECR repository exists..."
if aws ecr describe-repositories --repository-names $REPOSITORY_NAME --region $AWS_REGION &> /dev/null; then
    echo "✅ ECR repository '$REPOSITORY_NAME' exists"
else
    echo "❌ ECR repository '$REPOSITORY_NAME' does not exist"
    echo "Creating repository..."
    aws ecr create-repository --repository-name $REPOSITORY_NAME --region $AWS_REGION
    echo "✅ ECR repository created"
fi
echo ""

# Step 3: Check ECR login
echo "Step 3: Testing ECR login..."
if aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI; then
    echo "✅ ECR login successful"
else
    echo "❌ ECR login failed"
    exit 1
fi
echo ""

# Step 4: Check if Docker is running
echo "Step 4: Checking Docker..."
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi
echo "✅ Docker is running"
echo ""

# Step 5: List existing images in ECR
echo "Step 5: Listing existing images in ECR..."
if aws ecr describe-images --repository-name $REPOSITORY_NAME --region $AWS_REGION --query 'imageDetails[*].{Tag:imageTags[0],PushedAt:imagePushedAt}' --output table 2>/dev/null; then
    echo "✅ Images found in ECR"
else
    echo "ℹ️  No images found in ECR (this is expected if the build failed)"
fi
echo ""

# Step 6: Test building and pushing
echo "Step 6: Testing build and push process..."
echo "Building Docker image..."
cd backend
docker build -t $REPOSITORY_URI:test .

echo "Pushing test image..."
docker push $REPOSITORY_URI:test

echo "✅ Test build and push successful!"
echo ""

# Step 7: Clean up test image
echo "Step 7: Cleaning up test image..."
docker rmi $REPOSITORY_URI:test
echo "✅ Cleanup complete"
echo ""

echo "=== Troubleshooting Complete ==="
echo "If all steps passed, the issue was likely:"
echo "1. Missing ECR repository"
echo "2. ECR login issues"
echo "3. Docker not running"
echo ""
echo "The CodeBuild should now work properly. Try running it again!" 