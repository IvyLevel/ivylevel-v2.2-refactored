#!/bin/bash

echo "🔧 Setting up security group for IvyLevel backend..."

# Try to create the security group (it might already exist)
echo "Creating security group..."
SECURITY_GROUP_OUTPUT=$(aws ec2 create-security-group \
  --group-name ivylevel-backend-prod-sg \
  --description "Production security group for IvyLevel backend" \
  --vpc-id vpc-066ae4146b99fe5b9 \
  --output json 2>&1)

# Check if it was created or already exists
if echo "$SECURITY_GROUP_OUTPUT" | grep -q "InvalidGroup.Duplicate"; then
    echo "✅ Security group already exists, getting its ID..."
    SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
      --filters "Name=group-name,Values=ivylevel-backend-prod-sg" "Name=vpc-id,Values=vpc-066ae4146b99fe5b9" \
      --query 'SecurityGroups[0].GroupId' \
      --output text)
else
    echo "✅ Security group created successfully"
    SECURITY_GROUP_ID=$(echo "$SECURITY_GROUP_OUTPUT" | grep -o 'sg-[a-z0-9]*')
fi

echo "Security Group ID: $SECURITY_GROUP_ID"

# Add inbound rule for port 8000
echo "Adding inbound rule for port 8000..."
aws ec2 authorize-security-group-ingress \
  --group-id "$SECURITY_GROUP_ID" \
  --protocol tcp \
  --port 8000 \
  --cidr 0.0.0.0/0

# Add outbound rule (allow all outbound traffic)
echo "Adding outbound rule..."
aws ec2 authorize-security-group-egress \
  --group-id "$SECURITY_GROUP_ID" \
  --protocol -1 \
  --port -1 \
  --cidr 0.0.0.0/0

echo "✅ Security group setup complete!"
echo "Security Group ID: $SECURITY_GROUP_ID"
echo ""
echo "📝 Next steps:"
echo "1. Update appspec.yml with this security group ID: $SECURITY_GROUP_ID"
echo "2. Commit and push the changes"
echo "3. Trigger a new deployment" 