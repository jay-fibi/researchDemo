#!/bin/bash

# Cloud-Optimized Linux Distribution - Kernel Build Script
# This script builds the optimized kernel for cloud environments

set -e

# Configuration
KERNEL_VERSION="6.1.0"
KERNEL_URL="https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-${KERNEL_VERSION}.tar.xz"
BUILD_DIR="/tmp/kernel-build"
INSTALL_DIR="/tmp/kernel-install"
CONFIG_FILE="$(dirname "$0")/../kernel/.config"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
   exit 1
fi

# Create build directories
log "Creating build directories..."
mkdir -p "$BUILD_DIR"
mkdir -p "$INSTALL_DIR"

# Download kernel source if not exists
if [ ! -f "$BUILD_DIR/linux-${KERNEL_VERSION}.tar.xz" ]; then
    log "Downloading Linux kernel ${KERNEL_VERSION}..."
    wget -O "$BUILD_DIR/linux-${KERNEL_VERSION}.tar.xz" "$KERNEL_URL"
fi

# Extract kernel source
if [ ! -d "$BUILD_DIR/linux-${KERNEL_VERSION}" ]; then
    log "Extracting kernel source..."
    tar -xf "$BUILD_DIR/linux-${KERNEL_VERSION}.tar.xz" -C "$BUILD_DIR"
fi

cd "$BUILD_DIR/linux-${KERNEL_VERSION}"

# Copy our optimized config
log "Copying optimized kernel configuration..."
cp "$CONFIG_FILE" .config

# Configure kernel
log "Configuring kernel..."
make olddefconfig

# Build kernel
log "Building kernel (this may take a while)..."
make -j$(nproc) bzImage modules

# Install kernel
log "Installing kernel..."
make INSTALL_MOD_PATH="$INSTALL_DIR" modules_install
make INSTALL_PATH="$INSTALL_DIR" install

# Create kernel package structure
log "Creating kernel package..."
KERNEL_PKG_DIR="$BUILD_DIR/kernel-pkg"
mkdir -p "$KERNEL_PKG_DIR"/{boot,lib/modules}

# Copy kernel image
cp arch/x86/boot/bzImage "$KERNEL_PKG_DIR/boot/vmlinuz-${KERNEL_VERSION}-cloud"
cp System.map "$KERNEL_PKG_DIR/boot/System.map-${KERNEL_VERSION}-cloud"
cp .config "$KERNEL_PKG_DIR/boot/config-${KERNEL_VERSION}-cloud"

# Copy modules
cp -r "$INSTALL_DIR/lib/modules/${KERNEL_VERSION}-cloud" "$KERNEL_PKG_DIR/lib/modules/"

# Create tarball
log "Creating kernel tarball..."
cd "$BUILD_DIR"
tar -czf "linux-kernel-${KERNEL_VERSION}-cloud.tar.gz" kernel-pkg/

log "Kernel build completed successfully!"
log "Kernel package: $BUILD_DIR/linux-kernel-${KERNEL_VERSION}-cloud.tar.gz"
log "Install with: tar -xzf linux-kernel-${KERNEL_VERSION}-cloud.tar.gz -C /"
