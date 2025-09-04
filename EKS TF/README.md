# EKS Cluster with Terraform

This Terraform configuration creates an Amazon EKS cluster with Kubernetes version 1.32, containing two node groups:

1. **Amazon Linux 2023 Node Group**: Uses `t3.xlarge` instances
2. **Ubuntu 22.04 ARM Node Group**: Uses `t4g.xlarge` instances (ARM architecture)

## Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform v1.0+
- kubectl (optional, for cluster management)

## Required AWS Permissions

Your AWS user/role needs the following permissions:
- EKS cluster creation and management
- EC2 instance and VPC management
- IAM role and policy management

## Deployment Steps

1. **Initialize Terraform**:
   ```bash
   terraform init
   ```

2. **Review the plan**:
   ```bash
   terraform plan
   ```

3. **Apply the configuration**:
   ```bash
   terraform apply
   ```

4. **Configure kubectl** (optional):
   ```bash
   export KUBECONFIG=./kubeconfig
   kubectl get nodes
   ```

## Cluster Configuration

- **Kubernetes Version**: 1.32
- **Region**: us-east-1
- **VPC**: Custom VPC with public and private subnets
- **Node Groups**:
  - Amazon Linux 2023: 1 node (t3.xlarge)
  - Ubuntu 22.04 ARM: 1 node (t4g.xlarge)

## Outputs

After deployment, the following outputs will be available:
- `cluster_name`: EKS cluster name
- `cluster_endpoint`: API server endpoint
- `cluster_arn`: Cluster ARN
- `vpc_id`: VPC ID
- `private_subnet_ids`: Private subnet IDs
- `public_subnet_ids`: Public subnet IDs

## Node Group Details

### Amazon Linux 2023 Node Group
- Instance Type: t3.xlarge
- AMI Type: AL2023_x86_64_STANDARD
- Scaling: 1-3 nodes

### Ubuntu 22.04 ARM Node Group
- Instance Type: t4g.xlarge
- AMI: Latest Ubuntu 22.04 ARM64
- Scaling: 1-3 nodes
- Custom launch template with bootstrap script

## Cleanup

To destroy the cluster and all resources:
```bash
terraform destroy
```

## Customization

You can modify the following in the Terraform files:
- Instance types in `eks_node_groups.tf`
- Node counts in the scaling_config blocks
- VPC CIDR ranges in `vpc.tf`
- AWS region in `provider.tf`

## Troubleshooting

1. **Node group creation fails**: Ensure your IAM user has the required permissions
2. **AMI not found**: The Ubuntu ARM AMI data source might need updating
3. **Network issues**: Check VPC and subnet configurations

## Security Considerations

- Nodes are placed in private subnets
- NAT gateways provide outbound internet access
- IAM roles follow least-privilege principle
- Consider adding security groups for additional network restrictions
