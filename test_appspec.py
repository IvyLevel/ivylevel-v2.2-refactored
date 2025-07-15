#!/usr/bin/env python3
import yaml
import json
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
    
    # Test 2: Check YAML syntax
    try:
        appspec = yaml.safe_load(content)
        print("✅ YAML syntax is valid")
    except yaml.YAMLError as e:
        print(f"❌ YAML syntax error: {e}")
        return False
    
    # Test 3: Check required fields
    if 'version' not in appspec:
        print("❌ Missing 'version' field")
        return False
    print(f"✅ Version: {appspec['version']}")
    
    if 'Resources' not in appspec:
        print("❌ Missing 'Resources' field")
        return False
    print("✅ Resources field present")
    
    # Test 4: Check Resources structure
    resources = appspec['Resources']
    if not isinstance(resources, list):
        print("❌ Resources must be a list")
        return False
    
    if len(resources) == 0:
        print("❌ Resources list is empty")
        return False
    
    # Test 5: Check TargetService
    target_service = None
    for resource in resources:
        if 'TargetService' in resource:
            target_service = resource['TargetService']
            break
    
    if not target_service:
        print("❌ No TargetService found in Resources")
        return False
    
    # Test 6: Check TargetService properties
    if 'Type' not in target_service:
        print("❌ Missing Type in TargetService")
        return False
    
    if target_service['Type'] != 'AWS::ECS::Service':
        print(f"❌ Invalid Type: {target_service['Type']}, expected AWS::ECS::Service")
        return False
    
    if 'Properties' not in target_service:
        print("❌ Missing Properties in TargetService")
        return False
    
    properties = target_service['Properties']
    
    # Test 7: Check TaskDefinition
    if 'TaskDefinition' not in properties:
        print("❌ Missing TaskDefinition in Properties")
        return False
    
    task_def = properties['TaskDefinition']
    print(f"✅ TaskDefinition: {task_def}")
    
    # Test 8: Check LoadBalancerInfo
    if 'LoadBalancerInfo' not in properties:
        print("❌ Missing LoadBalancerInfo in Properties")
        return False
    
    lb_info = properties['LoadBalancerInfo']
    
    if 'ContainerName' not in lb_info:
        print("❌ Missing ContainerName in LoadBalancerInfo")
        return False
    
    if 'ContainerPort' not in lb_info:
        print("❌ Missing ContainerPort in LoadBalancerInfo")
        return False
    
    print(f"✅ ContainerName: {lb_info['ContainerName']}")
    print(f"✅ ContainerPort: {lb_info['ContainerPort']}")
    
    # Test 9: Validate the final structure
    print("\n=== Final AppSpec Structure ===")
    print(yaml.dump(appspec, default_flow_style=False))
    
    # Test 10: Check for common issues
    if task_def == '<TASK_DEFINITION>':
        print("⚠️  Warning: TaskDefinition still contains placeholder")
    
    if lb_info['ContainerPort'] != 8000:
        print(f"⚠️  Warning: ContainerPort is {lb_info['ContainerPort']}, expected 8000")
    
    print("\n✅ All tests passed! AppSpec should be valid for CodeDeploy")
    return True

if __name__ == "__main__":
    success = test_appspec()
    sys.exit(0 if success else 1) 