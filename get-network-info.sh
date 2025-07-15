#!/bin/bash

echo "🔍 Finding your VPC, Subnet, and Security Group information..."
echo ""

# Get VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text 2>/dev/null)
if [ "$VPC_ID" = "None" ] || [ -z "$VPC_ID" ]; then
    echo "❌ Could not find default VPC. Please run:"
    echo "   aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,Tags[?Key==\`Name\`].Value|[0]]' --output table"
    echo ""
    echo "Then update the AppSpec file with your VPC subnets and security groups."
    exit 1
fi

echo "✅ Found VPC: $VPC_ID"

# Get subnets
echo ""
echo "📋 Available Subnets:"
aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].[SubnetId,AvailabilityZone,CidrBlock,Tags[?Key==`Name`].Value|[0]]' --output table

# Get security groups
echo ""
echo "🔒 Available Security Groups:"
aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" --query 'SecurityGroups[*].[GroupId,GroupName,Description]' --output table

echo ""
echo "📝 Update your appspec.yml with the actual values:"
echo "   Replace subnet-12345678, subnet-87654321 with your actual subnet IDs"
echo "   Replace sg-12345678 with your actual security group ID"
echo ""
echo "💡 Look for subnets that are:"
echo "   - In different availability zones (for high availability)"
echo "   - Have 'Auto-assign public IPv4 address' enabled (if using ENABLED)"
echo ""
echo "💡 Look for security groups that:"
echo "   - Allow inbound traffic on port 8000 (for your app)"
echo "   - Allow outbound traffic (usually 0.0.0.0/0)" 