# Data source to get the latest Ubuntu 22.04 ARM AMI
data "aws_ami" "ubuntu_22_04_arm" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-arm64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Amazon Linux 2023 Node Group
resource "aws_eks_node_group" "amazon_linux_node_group" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  node_group_name = "amazon-linux-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = 1
    max_size     = 3
    min_size     = 1
  }

  instance_types = ["t3.xlarge"]

  # Use Amazon Linux 2023 AMI
  ami_type = "AL2023_x86_64_STANDARD"

  tags = {
    Name = "amazon-linux-node-group"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ec2_container_registry_readonly
  ]
}

# Ubuntu 22.04 ARM Node Group
resource "aws_eks_node_group" "ubuntu_arm_node_group" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  node_group_name = "ubuntu-arm-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = 1
    max_size     = 3
    min_size     = 1
  }

  instance_types = ["t4g.xlarge"]

  # Use custom Ubuntu 22.04 ARM AMI
  ami_type = "CUSTOM"
  launch_template {
    id      = aws_launch_template.ubuntu_arm_lt.id
    version = aws_launch_template.ubuntu_arm_lt.latest_version
  }

  tags = {
    Name = "ubuntu-arm-node-group"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ec2_container_registry_readonly
  ]
}

# Launch template for Ubuntu ARM node group
resource "aws_launch_template" "ubuntu_arm_lt" {
  name_prefix   = "ubuntu-arm-eks-"
  image_id      = data.aws_ami.ubuntu_22_04_arm.id
  instance_type = "t4g.xlarge"

  block_device_mappings {
    device_name = "/dev/xvda"

    ebs {
      volume_size = 20
      volume_type = "gp3"
    }
  }

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "ubuntu-arm-eks-node"
    }
  }

  tag_specifications {
    resource_type = "volume"

    tags = {
      Name = "ubuntu-arm-eks-node"
    }
  }

  user_data = base64encode(<<-EOF
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==BOUNDARY=="

--==BOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"

#!/bin/bash
set -ex

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Bootstrap the node
/etc/eks/bootstrap.sh ${aws_eks_cluster.eks_cluster.name} --b64-cluster-ca ${aws_eks_cluster.eks_cluster.certificate_authority[0].data} --apiserver-endpoint ${aws_eks_cluster.eks_cluster.endpoint}

--==BOUNDARY==--
EOF
  )
}
