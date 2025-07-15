# IvyLevel v2.2 Refactored - Comprehensive Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Backend Infrastructure](#backend-infrastructure)
4. [Frontend Architecture](#frontend-architecture)
5. [AWS Infrastructure](#aws-infrastructure)
6. [Deployment Pipeline](#deployment-pipeline)
7. [Database Architecture](#database-architecture)
8. [API Documentation](#api-documentation)
9. [Security Configuration](#security-configuration)
10. [Development Setup](#development-setup)
11. [Production Deployment](#production-deployment)
12. [Monitoring & Logging](#monitoring--logging)
13. [Future Roadmap](#future-roadmap)

---

## 🎯 Project Overview

### **Project Name**: IvyLevel v2.2 Refactored
### **Description**: Modern, scalable coach training platform with microservices architecture
### **Technology Stack**: FastAPI, React, AWS ECS, PostgreSQL, Pinecone
### **Architecture**: Monorepo with microservices, blue-green deployments

### **Key Features**
- **Multi-persona platform** (Coach, Student, Parent, Manager)
- **AI-powered coaching** with Pinecone vector database
- **Real-time analytics** and progress tracking
- **Scalable microservices** architecture
- **Automated CI/CD** with blue-green deployments

---

## 🏗️ Architecture Overview

### **High-Level Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Services   │
│   (React SPA)   │◄──►│   (FastAPI)     │◄──►│   (Pinecone)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/CloudFront│    │   ECS Fargate   │    │   Vector DB     │
│   (Static Assets)│   │   (Containers)  │    │   (Embeddings)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Route 53      │    │   Application   │    │   RDS PostgreSQL│
│   (DNS)         │    │   Load Balancer │    │   (User Data)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Microservices Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    Monorepo Structure                       │
├─────────────────────────────────────────────────────────────┤
│ packages/                                                   │
│ ├── core/          # Shared utilities, auth, routing        │
│ ├── coach/         # Coach-specific features (CUJs 6-9)     │
│ ├── student/       # Student dashboard and tools            │
│ ├── parent/        # Parent monitoring and communication    │
│ └── manager/       # Manager oversight and analytics        │
├─────────────────────────────────────────────────────────────┤
│ backend/           # FastAPI backend service                │
│ ├── main.py        # API endpoints and business logic       │
│ ├── requirements.txt # Python dependencies                  │
│ └── Dockerfile     # Container configuration                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend Infrastructure

### **FastAPI Backend Service**

#### **Location**: `backend/main.py`
#### **Key Components**:

```python
# Core Dependencies
- FastAPI 0.104.1          # Web framework
- Uvicorn 0.24.0           # ASGI server
- Pinecone 7.3.0           # Vector database
- PostgreSQL (psycopg2)    # Relational database
- Pydantic 2.5.0           # Data validation
```

#### **API Endpoints**:
```python
POST /provision          # Coach provisioning (CUJ 6)
GET  /health             # Health check endpoint
GET  /                   # Root endpoint
GET  /db/test            # Database connectivity test
```

#### **Key Features**:
- **Multi-agent workflow** with LangGraph integration
- **Real-time vector search** with Pinecone
- **PostgreSQL integration** for user data
- **Health monitoring** and logging
- **Environment-based configuration**

### **Database Integration**
```python
# RDS PostgreSQL Configuration
DB_CONFIG = {
    'dbname': 'ivylevel',
    'user': 'ivylevel_admin',
    'password': 'YOUR_DATABASE_PASSWORD',
    'host': 'ivylevel-database-1.cbeyu4q002ay.us-east-1.rds.amazonaws.com',
    'port': 5432
}
```

### **AI Integration**
```python
# Pinecone Vector Database
PINECONE_API_KEY = "pcsk_5NXuE6_bfXMwA1Lj5djvEPPKqgN17FbicWVGEekcAxKiiouNPvjJrgnvDUSrtzXY9foE8"
PINECONE_INDEX_NAME = "ivylevel-db"
```

---

## 🎨 Frontend Architecture

### **React Monorepo Structure**

#### **Core Package** (`packages/core/`)
```javascript
// Key Components
- App.js              # Main application router
- services/           # Shared services
  ├── authService.js  # Authentication logic
  ├── apiService.js   # API communication
  ├── dbService.js    # Database operations
  └── emailService.js # Email notifications
- store.js            # Redux state management
- utils/hooks.js      # Custom React hooks
```

#### **Coach Package** (`packages/coach/`)
```javascript
// Coach-specific components (CUJs 6-9)
- AdminProvisioning.js    # Coach onboarding
- AnalyticsDashboard.js   # Performance metrics
- CoachWelcome.js         # Welcome experience
- ModernKnowledgeBase.js  # Learning resources
- pages/
  ├── onboarding.js       # Onboarding flow
  ├── oversight.js        # Management tools
  └── skill-building.js   # Training modules
```

#### **Student Package** (`packages/student/`)
```javascript
// Student dashboard and tools
- StudentDashboard.js     # Main student interface
- pages/
  └── gameplan.js         # Learning gameplan
```

#### **Parent Package** (`packages/parent/`)
```javascript
// Parent monitoring tools
- ParentTools.js          # Parent-specific features
- pages/
  └── dashboard.js        # Parent dashboard
```

#### **Manager Package** (`packages/manager/`)
```javascript
// Manager oversight features
- ManagerOversight.js     # Management tools
```

---

## ☁️ AWS Infrastructure

### **ECS Cluster Configuration**
```yaml
Cluster Name: ivylevel-cluster-new-1
Region: us-east-1
Service Type: Fargate
```

### **ECS Services**
```yaml
Main Service: ivylevel-backend-task-service
CodeDeploy Service: ivylevel-backend-task-service-cd
Task Definition: ivylevel-backend-task
```

### **Network Configuration**
```yaml
VPC: vpc-066ae4146b99fe5b9
Subnets:
  - subnet-0130342b871650ea1 (us-east-1a)
  - subnet-0862ea4a6c25d31d3 (us-east-1e)
Security Group: sg-0b04365d08e122782 (ivylevel-backend-prod-sg)
```

### **Load Balancer**
```yaml
Type: Application Load Balancer
Target Group: Port 8000
Health Check: /health endpoint
```

### **Container Configuration**
```dockerfile
# backend/Dockerfile
FROM public.ecr.aws/docker/library/python:3.11-slim
WORKDIR /app
EXPOSE 8000
HEALTHCHECK: curl -f http://localhost:8000/health
```

### **ECR Repository**
```yaml
Repository: ivylevel-backend-new
Region: us-east-1
Account: 211125397081
```

---

## 🚀 Deployment Pipeline

### **CI/CD Architecture**
```
GitHub Repository
       │
       ▼
┌─────────────────┐
│   CodePipeline  │
└─────────────────┘
       │
       ▼
┌─────────────────┐    ┌─────────────────┐
│   CodeBuild     │───►│   CodeDeploy    │
│   (Build)       │    │   (Deploy)      │
└─────────────────┘    └─────────────────┘
       │                       │
       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   ECR           │    │   ECS           │
│   (Images)      │    │   (Services)    │
└─────────────────┘    └─────────────────┘
```

### **BuildSpec Configuration**
```yaml
# buildspec.yml
version: 0.2
phases:
  install:
    - yum install -y jq
    - aws ecr get-login-password
  pre_build:
    - docker build -t $REPOSITORY_URI:latest
  build:
    - docker push $REPOSITORY_URI:latest
    - aws ecs register-task-definition
    - sed "s|<TASK_DEFINITION_ARN>|$TASK_DEF_ARN|g" appspec.yml
artifacts:
  - imageDefinitions.json
  - appspec.yml
  - taskdef.json
```

### **AppSpec Configuration**
```yaml
# appspec.yml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: <TASK_DEFINITION_ARN>
        LoadBalancerInfo:
          ContainerName: "app"
          ContainerPort: 8000
        PlatformVersion: LATEST
        NetworkConfiguration:
          AwsvpcConfiguration:
            Subnets: ["subnet-0130342b871650ea1", "subnet-0862ea4a6c25d31d3"]
            SecurityGroups: ["sg-0b04365d08e122782"]
            AssignPublicIp: ENABLED
```

### **Task Definition**
```json
{
  "family": "ivylevel-backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::211125397081:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "211125397081.dkr.ecr.us-east-1.amazonaws.com/ivylevel-backend-new:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "hostPort": 8000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ivylevel-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 🗄️ Database Architecture

### **PostgreSQL Schema**
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    role TEXT NOT NULL,
    profile JSONB
);

-- Coach profiles with assessment data
INSERT INTO users (id, role, profile) VALUES (
    'user_123',
    'coach',
    '{"chettyScore": 8.5, "path": "custom_10_days"}'
);
```

### **Vector Database (Pinecone)**
```python
# Index Configuration
Index Name: ivylevel-db
Dimensions: 1536 (OpenAI embeddings)
Metric: cosine
```

---

## 🔌 API Documentation

### **Core Endpoints**

#### **Health Check**
```http
GET /health
Response: {
  "status": "healthy",
  "message": "IvyLevel Backend is running",
  "environment": "production",
  "timestamp": "2025-07-15T06:10:00Z"
}
```

#### **Coach Provisioning (CUJ 6)**
```http
POST /provision
Content-Type: application/json

Request Body:
{
  "profile": {
    "gpa": 3.8,
    "background": "education",
    "experience": 5
  }
}

Response:
{
  "chettyScore": 8.5,
  "path": "custom_10_days"
}
```

#### **Database Test**
```http
GET /db/test
Response: {
  "status": "connected",
  "database": "postgresql",
  "user_count": 42
}
```

---

## 🔒 Security Configuration

### **IAM Roles and Policies**

#### **CodeBuild Service Role**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:PutImage",
        "ecs:RegisterTaskDefinition",
        "ecs:DescribeTaskDefinition",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

#### **ECS Task Execution Role**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### **Security Groups**
```yaml
Security Group: sg-0b04365d08e122782
Name: ivylevel-backend-prod-sg
VPC: vpc-066ae4146b99fe5b9

Inbound Rules:
  - Port: 8000
    Protocol: TCP
    Source: 0.0.0.0/0

Outbound Rules:
  - Port: All
    Protocol: All
    Destination: 0.0.0.0/0
```

---

## 🛠️ Development Setup

### **Prerequisites**
```bash
# Required software
- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Python 3.11+
- Docker
- AWS CLI
```

### **Local Development**
```bash
# Clone repository
git clone https://github.com/IvyLevel/ivylevel-v2.2-refactored.git
cd ivylevel-v2.2-refactored

# Install dependencies
yarn install

# Start backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Start frontend
yarn dev
```

### **Environment Variables**
```bash
# Backend (.env)
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=ivylevel-db
DB_NAME=ivylevel
DB_USER=ivylevel_admin
DB_PASSWORD=your_password
DB_HOST=your_rds_endpoint
DB_PORT=5432
ENVIRONMENT=development

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## 🚀 Production Deployment

### **Deployment Process**
1. **Code Push** → Triggers CodePipeline
2. **Build Phase** → CodeBuild creates Docker image
3. **Deploy Phase** → CodeDeploy performs blue-green deployment
4. **Health Check** → New containers must pass health checks
5. **Traffic Shift** → Traffic moves to new containers
6. **Cleanup** → Old containers terminated

### **Monitoring Commands**
```bash
# Check deployment status
aws deploy get-deployment --deployment-id d-XXXXXXXX

# Check ECS service status
aws ecs describe-services --cluster ivylevel-cluster-new-1 --services ivylevel-backend-task-service

# Check container logs
aws logs describe-log-streams --log-group-name /ecs/ivylevel-backend
```

---

## 📊 Monitoring & Logging

### **CloudWatch Logs**
```yaml
Log Group: /ecs/ivylevel-backend
Region: us-east-1
Retention: 30 days
```

### **Health Monitoring**
```python
# Health check endpoint
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "message": "IvyLevel Backend is running",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "timestamp": "2025-07-15T06:10:00Z"
    }
```

### **Application Metrics**
- **Response time** monitoring
- **Error rate** tracking
- **Container health** status
- **Database connectivity** checks

---

## 🗺️ Future Roadmap

### **Phase 1: Core Platform (Current)**
- ✅ **Backend API** with FastAPI
- ✅ **ECS deployment** with blue-green
- ✅ **Database integration** (PostgreSQL + Pinecone)
- ✅ **Basic frontend** structure

### **Phase 2: Enhanced Features**
- 🔄 **Real-time notifications** with WebSockets
- 🔄 **Advanced analytics** dashboard
- 🔄 **Video streaming** integration
- 🔄 **Mobile app** development

### **Phase 3: AI Enhancement**
- 🔄 **Advanced ML models** for coaching
- 🔄 **Personalized learning paths**
- 🔄 **Predictive analytics**
- 🔄 **Natural language processing**

### **Phase 4: Enterprise Features**
- 🔄 **Multi-tenant architecture**
- 🔄 **Advanced security** features
- 🔄 **Compliance** and audit trails
- 🔄 **Enterprise SSO** integration

---

## 📞 Support & Contact

### **Technical Support**
- **Repository**: https://github.com/IvyLevel/ivylevel-v2.2-refactored
- **Documentation**: This README
- **Issues**: GitHub Issues

### **Infrastructure**
- **AWS Region**: us-east-1
- **ECS Cluster**: ivylevel-cluster-new-1
- **ECR Repository**: ivylevel-backend-new
- **RDS Database**: ivylevel-database-1

---

## 📝 License

This project is proprietary software developed for IvyLevel. All rights reserved.

---

*Last Updated: July 15, 2025*
*Version: 2.2 Refactored*
