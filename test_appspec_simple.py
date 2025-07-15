#!/usr/bin/env python3
import re
import sys

def test_appspec():
    """Test the appspec.yml file for CodeDeploy compatibility"""
    
    print("=== Testing AppSpec File ===")
    
    # Test 1: Check if file exists and is readable
    try:
        with open('appspec.yml', 'r') as f:
            content = f.read()
        print("✅ File exists and is readable")
    except FileNotFoundError:
        print("❌ appspec.yml file not found")
        return False
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return False
    
    print("\n=== Current AppSpec Content ===")
    print(content)
    
    # Test 2: Check for required fields using regex
    required_fields = [
        r'version:\s*0\.0',
        r'Resources:',
        r'TargetService:',
        r'Type:\s*AWS::ECS::Service',
        r'Properties:',
        r'TaskDefinition:',
        r'LoadBalancerInfo:',
        r'ContainerName:\s*"app"',
        r'ContainerPort:\s*8000'
    ]
    
    missing_fields = []
    for field in required_fields:
        if not re.search(field, content):
            missing_fields.append(field)
    
    if missing_fields:
        print(f"\n❌ Missing required fields: {missing_fields}")
        return False
    
    print("\n✅ All required fields present")
    
    # Test 3: Check for placeholder values
    if '<TASK_DEFINITION>' in content:
        print("⚠️  Warning: TaskDefinition still contains placeholder")
        print("This will cause CodeDeploy to fail!")
        return False
    
    print("✅ No placeholder values found")
    
    # Test 4: Check indentation and structure
    lines = content.split('\n')
    indent_issues = []
    
    for i, line in enumerate(lines, 1):
        if line.strip() and not line.startswith(' ') and line not in ['version: 0.0', '', 'Resources:']:
            # Check if this should be indented
            if any(keyword in line for keyword in ['TargetService:', 'Properties:', 'LoadBalancerInfo:']):
                indent_issues.append(f"Line {i}: {line.strip()}")
    
    if indent_issues:
        print(f"\n❌ Indentation issues found: {indent_issues}")
        return False
    
    print("✅ Indentation looks correct")
    
    print("\n✅ All tests passed! AppSpec should be valid for CodeDeploy")
    return True

if __name__ == "__main__":
    success = test_appspec()
    sys.exit(0 if success else 1) 