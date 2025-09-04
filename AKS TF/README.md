# AKS Terraform Configuration

This Terraform configuration creates an Azure Kubernetes Service (AKS) cluster with the following specifications:

- **Kubernetes Version**: 1.32.6
- **Node OS**: Azure Linux
- **Auto-scaling**: Enabled (1-3 nodes)
- **VM Size**: Standard_DS2_v2

## Prerequisites

1. Azure CLI installed and authenticated
2. Terraform installed (version 1.0 or later)
3. Azure subscription with appropriate permissions

## Usage

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

4. **Get kubeconfig** (after deployment):
   ```bash
   terraform output kube_config > ~/.kube/config
   ```

## Variables

You can customize the deployment by modifying the variables in `variables.tf` or by passing them during `terraform apply`:

- `resource_group_name`: Name of the Azure resource group (default: "aks-resource-group")
- `location`: Azure region (default: "East US")
- `cluster_name`: Name of the AKS cluster (default: "aks-cluster")
- `dns_prefix`: DNS prefix for the cluster (default: "aks")
- `node_count`: Initial number of nodes (default: 1)
- `vm_size`: VM size for nodes (default: "Standard_DS2_v2")
- `min_node_count`: Minimum nodes for auto-scaling (default: 1)
- `max_node_count`: Maximum nodes for auto-scaling (default: 3)

## Outputs

The configuration provides the following outputs:

- `resource_group_name`: Resource group name
- `cluster_name`: AKS cluster name
- `cluster_id`: AKS cluster ID
- `kube_config`: Complete kubeconfig for cluster access
- `client_certificate`: Client certificate
- `client_key`: Client key
- `cluster_ca_certificate`: Cluster CA certificate
- `host`: Kubernetes API server host

## Cleanup

To destroy the resources:

```bash
terraform destroy
```

## Notes

- The cluster uses Azure Linux as the node OS for improved security and performance
- System-assigned managed identity is used for authentication
- Auto-scaling is enabled by default
- The configuration includes basic tags for organization
