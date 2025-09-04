resource "local_file" "kubeconfig" {
  content = templatefile("${path.module}/kubeconfig.tpl", {
    cluster_name               = aws_eks_cluster.eks_cluster.name
    cluster_endpoint           = aws_eks_cluster.eks_cluster.endpoint
    cluster_ca_certificate     = aws_eks_cluster.eks_cluster.certificate_authority[0].data
    aws_region                 = "us-east-1"
  })
  filename = "${path.module}/kubeconfig"
}

resource "local_file" "kubeconfig_template" {
  content = <<EOF
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${cluster_ca_certificate}
    server: ${cluster_endpoint}
  name: ${cluster_name}
contexts:
- context:
    cluster: ${cluster_name}
    user: ${cluster_name}
  name: ${cluster_name}
current-context: ${cluster_name}
kind: Config
preferences: {}
users:
- name: ${cluster_name}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - "eks"
        - "get-token"
        - "--region"
        - "${aws_region}"
        - "--cluster-name"
        - "${cluster_name}"
EOF
  filename = "${path.module}/kubeconfig.tpl"
}
