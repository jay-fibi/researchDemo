# ECS Managed Instances Terraform Script

This Terraform script creates an Amazon ECS cluster with ECS Managed Instances, which is currently in beta. ECS Managed Instances simplify the management of EC2 instances in your ECS cluster by handling instance lifecycle, patching, and scaling automatically.

## Features

- Creates an ECS cluster with Container Insights enabled
- Sets up an Auto Scaling Group with EC2 instances optimized for ECS
- Configures a Capacity Provider with managed scaling
- Includes IAM roles and policies for ECS instances
- Provides outputs for key resource identifiers

## Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform v1.0 or later
- AWS account with access to ECS, EC2, and IAM services
- VPC, subnets, and security groups already created (or modify the script to create them)

## Usage

1. Clone or download this repository.

2. Navigate to the `ecs-managed-instances-terraform` directory.

3. Update the `variables.tf` file or create a `terraform.tfvars` file to customize the deployment:
   ```hcl
   region              = "us-east-1"
   cluster_name        = "my-ecs-cluster"
   min_capacity        = 1
   max_capacity        = 10
   instance_type       = "t3.medium"
   subnet_ids          = ["subnet-12345678", "subnet-87654321"]
   security_group_ids  = ["sg-12345678"]
   key_name            = "my-key-pair"
   ```

4. Initialize Terraform:
   ```bash
   terraform init
   ```

5. Review the plan:
   ```bash
   terraform plan
   ```

6. Apply the configuration:
   ```bash
   terraform apply
   ```

7. After deployment, you can deploy ECS services using the created cluster and capacity provider.

## Variables

| Variable | Description | Type | Default |
|----------|-------------|------|---------|
| region | AWS region | string | us-east-1 |
| cluster_name | Name of the ECS cluster | string | ecs-managed-instances-cluster |
| capacity_provider_name | Name of the capacity provider | string | ecs-managed-capacity-provider |
| min_capacity | Minimum number of EC2 instances | number | 1 |
| max_capacity | Maximum number of EC2 instances | number | 10 |
| instance_type | EC2 instance type | string | t3.medium |
| key_name | SSH key pair name | string | null |
| security_group_ids | List of security group IDs | list(string) | [] |
| subnet_ids | List of subnet IDs | list(string) | [] |

## Outputs

- `cluster_name`: Name of the created ECS cluster
- `cluster_arn`: ARN of the ECS cluster
- `capacity_provider_name`: Name of the capacity provider
- `autoscaling_group_name`: Name of the Auto Scaling Group
- `launch_template_id`: ID of the Launch Template
- `iam_instance_profile_name`: Name of the IAM instance profile

## Architecture

The script creates the following AWS resources:

1. **ECS Cluster**: The main cluster for running containerized applications
2. **Launch Template**: Defines the configuration for EC2 instances
3. **Auto Scaling Group**: Manages the scaling of EC2 instances
4. **Capacity Provider**: Integrates the ASG with ECS for managed scaling
5. **IAM Role and Instance Profile**: Provides necessary permissions for ECS instances

## User Data Script

The `user-data.sh.tpl` file contains the initialization script that runs on each EC2 instance when it starts. It configures the instance to join the ECS cluster and enables necessary logging.

## Cleanup

To destroy the resources created by this script:

```bash
terraform destroy
```

**Note**: Ensure that all ECS services and tasks are stopped before destroying the cluster.

## Beta Feature Notice

ECS Managed Instances is currently in beta. Please refer to the [AWS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/managed-instances.html) for the latest information and limitations.

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License.
