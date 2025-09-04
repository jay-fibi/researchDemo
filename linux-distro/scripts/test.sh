#!/bin/bash

# Cloud-Optimized Linux Distribution - Test Script
# This script verifies the distribution structure and basic functionality

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DISTRO_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Test directory structure
test_structure() {
    log "Testing directory structure..."

    local required_dirs=(
        "kernel"
        "initrd"
        "bootloader"
        "packages"
        "cloud-config"
        "scripts"
        "cloud-config/aws"
        "cloud-config/azure"
        "cloud-config/gcp"
    )

    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$DISTRO_DIR/$dir" ]; then
            error "Missing directory: $dir"
        fi
    done

    log "Directory structure is correct"
}

# Test configuration files
test_configs() {
    log "Testing configuration files..."

    local required_files=(
        "kernel/.config"
        "initrd/init"
        "bootloader/grub.cfg"
        "cloud-config/aws/cloud-init.yaml"
        "cloud-config/azure/cloud-init.yaml"
        "cloud-config/gcp/cloud-init.yaml"
        "scripts/build.sh"
        "scripts/build-kernel.sh"
        "README.md"
    )

    for file in "${required_files[@]}"; do
        if [ ! -f "$DISTRO_DIR/$file" ]; then
            error "Missing file: $file"
        fi
    done

    log "Configuration files are present"
}

# Test script permissions
test_permissions() {
    log "Testing script permissions..."

    local scripts=(
        "scripts/build.sh"
        "scripts/build-kernel.sh"
        "scripts/test.sh"
    )

    for script in "${scripts[@]}"; do
        if [ ! -x "$DISTRO_DIR/$script" ]; then
            warn "Script not executable: $script"
            chmod +x "$DISTRO_DIR/$script"
            log "Made $script executable"
        fi
    done

    log "Script permissions are correct"
}

# Test kernel configuration
test_kernel_config() {
    log "Testing kernel configuration..."

    local config_file="$DISTRO_DIR/kernel/.config"

    # Check for cloud provider optimizations
    if ! grep -q "CONFIG_XEN=y" "$config_file"; then
        warn "AWS/Xen optimizations not found in kernel config"
    fi

    if ! grep -q "CONFIG_HYPERV=y" "$config_file"; then
        warn "Azure/HyperV optimizations not found in kernel config"
    fi

    if ! grep -q "CONFIG_VIRTIO=y" "$config_file"; then
        warn "VirtIO optimizations not found in kernel config"
    fi

    log "Kernel configuration looks good"
}

# Test cloud configurations
test_cloud_configs() {
    log "Testing cloud configurations..."

    local aws_config="$DISTRO_DIR/cloud-config/aws/cloud-init.yaml"
    local azure_config="$DISTRO_DIR/cloud-config/azure/cloud-init.yaml"
    local gcp_config="$DISTRO_DIR/cloud-config/gcp/cloud-init.yaml"

    # Check for cloud-init format
    for config in "$aws_config" "$azure_config" "$gcp_config"; do
        if ! grep -q "#cloud-config" "$config"; then
            error "Invalid cloud-init format in $config"
        fi
    done

    log "Cloud configurations are valid"
}

# Main test function
main() {
    info "Cloud-Optimized Linux Distribution Test Suite"
    info "==========================================="

    test_structure
    test_configs
    test_permissions
    test_kernel_config
    test_cloud_configs

    log "All tests passed successfully!"
    info "The Linux distribution structure is ready for building."
    info "Run './scripts/build.sh' to build the distribution."
}

# Run main function
main "$@"
