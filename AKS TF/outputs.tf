output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.aks.name
}

output "cluster_name" {
  description = "The name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.name
}

output "cluster_id" {
  description = "The ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.id
}

output "kube_config" {
  description = "The kubeconfig for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}

output "client_certificate" {
  description = "The client certificate for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.client_certificate
  sensitive   = true
}

output "client_key" {
  description = "The client key for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.client_key
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "The cluster CA certificate for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.cluster_ca_certificate
  sensitive   = true
}

output "host" {
  description = "The host for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.host
  sensitive   = true
}
