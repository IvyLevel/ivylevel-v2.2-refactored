#!/bin/bash

# Debug script to test the buildspec commands locally
# This helps identify what might be failing in CodeBuild

echo "=== Debugging BuildSpec Commands ==="

# Simulate CodeBuild environment variables
export AWS_DEFAULT_REGION="us-east-1"
export AWS_ACCOUNT_ID="211125397081"
export CODEBUILD_RESOLVED_SOURCE_VERSION="dd24f4831b2ff34def3a6511a548a14ff13becc5"
export CODEBUILD_BUILD_ID="ivylevel-backend-build:4ba2713d-6441-4bd9-b974-6d34a562af6d"

# Test the variable assignments from buildspec
echo "Testing variable assignments..."
REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/ivylevel-backend-new
COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
IMAGE_TAG=${COMMIT_HASH:=latest}
BUILD_ID=$(echo $CODEBUILD_BUILD_ID | cut -d ':' -f 2)

echo "Repository URI: $REPOSITORY_URI"
echo "Commit Hash: $COMMIT_HASH"
echo "Image Tag: $IMAGE_TAG"
echo "Build ID: $BUILD_ID"

# Test ECR login (without actually logging in)
echo ""
echo "Testing ECR login command..."
echo "Command would be: aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI"

# Test Docker build command
echo ""
echo "Testing Docker build command..."
echo "Command would be: docker build -t $REPOSITORY_URI:$IMAGE_TAG ."
echo "Command would be: docker tag $REPOSITORY_URI:$IMAGE_TAG $REPOSITORY_URI:latest"

# Test Docker push command
echo ""
echo "Testing Docker push command..."
echo "Command would be: docker push $REPOSITORY_URI:$IMAGE_TAG"
echo "Command would be: docker push $REPOSITORY_URI:latest"

# Test image definitions file creation
echo ""
echo "Testing image definitions file creation..."
echo "Command would be: printf '{\"ImageURI\":\"%s\"}' $REPOSITORY_URI:latest > imageDefinitions.json"
echo "Expected content: {\"ImageURI\":\"$REPOSITORY_URI:latest\"}"

echo ""
echo "=== Debug Complete ===" 