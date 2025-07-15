#!/bin/bash

# IvyLevel Backend Deployment Script
# This script builds and deploys the backend to ECS

set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="ivylevel-backend"
ECS_CLUSTER="ivylevel-cluster"
ECS_SERVICE="ivylevel-backend-service"
TASK_DEFINITION="ivylevel-backend-task"

echo "🚀 Starting IvyLevel Backend Deployment..."

# Step 1: Build Docker image
echo "📦 Building Docker image..."
cd backend
docker build -t $ECR_REPOSITORY .

# Step 2: Get ECR login token
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Step 3: Tag and push image
echo "🏷️  Tagging and pushing image..."
ECR_URI=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY
docker tag $ECR_REPOSITORY:latest $ECR_URI:latest
docker push $ECR_URI:latest

# Step 4: Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION

echo "✅ Deployment completed!"
echo "🌐 Service URL: http://ivyLevelMain-1813035217.us-east-1.elb.amazonaws.com"
echo "📊 Monitor deployment: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$ECS_CLUSTER/services/$ECS_SERVICE" 