output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.eks_cluster.name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.eks_cluster.endpoint
}

output "cluster_arn" {
  description = "EKS cluster ARN"
  value       = aws_eks_cluster.eks_cluster.arn
}

output "cluster_certificate_authority_data" {
  description = "EKS cluster certificate authority data"
  value       = aws_eks_cluster.eks_cluster.certificate_authority[0].data
}

output "cluster_oidc_issuer_url" {
  description = "EKS cluster OIDC issuer URL"
  value       = aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer
}

output "amazon_linux_node_group_arn" {
  description = "Amazon Linux node group ARN"
  value       = aws_eks_node_group.amazon_linux_node_group.arn
}

output "ubuntu_arm_node_group_arn" {
  description = "Ubuntu ARM node group ARN"
  value       = aws_eks_node_group.ubuntu_arm_node_group.arn
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.eks_vpc.id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}
