# GKE Cluster with GCOS Node Type

This Terraform configuration creates a Google Kubernetes Engine (GKE) cluster with nodes using Google Container-Optimized OS (GCOS).

## Prerequisites

- Google Cloud Platform (GCP) account
- Terraform installed
- GCP project with billing enabled
- `gcloud` CLI configured with your GCP account

## Usage

1. Initialize Terraform:
   ```
   terraform init
   ```

2. Create a `terraform.tfvars` file with your variables:
   ```
   project_id = "your-gcp-project-id"
   region     = "us-central1"
   ```

3. Plan the deployment:
   ```
   terraform plan
   ```

4. Apply the configuration:
   ```
   terraform apply
   ```

## Configuration

- **Cluster Name**: Configurable via `cluster_name` variable (default: "my-gke-cluster")
- **Region**: Configurable via `region` variable (default: "us-central1")
- **Node Count**: Configurable via `node_count` variable (default: 3)
- **Machine Type**: Configurable via `machine_type` variable (default: "e2-medium")
- **Node OS**: Google Container-Optimized OS (GCOS) specified as `image_type = "COS"`

## Outputs

- `cluster_name`: The name of the created GKE cluster
- `cluster_endpoint`: The endpoint URL of the cluster
- `cluster_ca_certificate`: The CA certificate for cluster authentication (sensitive)
