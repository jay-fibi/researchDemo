#!/bin/bash
# User data script for ECS instances

# Configure ECS cluster
echo ECS_CLUSTER=${cluster_name} >> /etc/ecs/ecs.config

# Enable CloudWatch logs (optional)
echo ECS_AVAILABLE_LOGGING_DRIVERS=["json-file","awslogs"] >> /etc/ecs/ecs.config

# Start ECS agent
systemctl enable ecs
systemctl start ecs
