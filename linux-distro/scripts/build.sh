#!/bin/bash

# Cloud-Optimized Linux Distribution - Main Build Script
# This script builds the complete Linux distribution

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DISTRO_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="/tmp/linux-distro-build"
ISO_DIR="$BUILD_DIR/iso"
KERNEL_VERSION="6.1.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    exit 1
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check dependencies
check_dependencies() {
    log "Checking build dependencies..."

    local deps=("wget" "tar" "gzip" "cpio" "find" "xorriso" "grub-mkrescue")
    local missing_deps=()

    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done

    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        error "Please install them using your package manager"
        exit 1
    fi

    log "All dependencies satisfied"
}

# Build kernel
build_kernel() {
    log "Building optimized kernel..."
    bash "$SCRIPT_DIR/build-kernel.sh"
}

# Create initramfs
create_initrd() {
    log "Creating initramfs..."

    local initrd_dir="$BUILD_DIR/initrd"
    mkdir -p "$initrd_dir"

    # Create basic directory structure
    mkdir -p "$initrd_dir"/{bin,sbin,etc,proc,sys,dev,lib,lib64,usr/bin,usr/sbin}

    # Copy init script
    cp "$DISTRO_DIR/initrd/init" "$initrd_dir/init"
    chmod +x "$initrd_dir/init"

    # Copy busybox (assuming it's available)
    if command -v busybox &> /dev/null; then
        cp "$(which busybox)" "$initrd_dir/bin/"
        ln -s ../bin/busybox "$initrd_dir/bin/sh"
    else
        warn "busybox not found, initrd will be minimal"
    fi

    # Create initramfs
    cd "$initrd_dir"
    find . | cpio -H newc -o | gzip > "$ISO_DIR/boot/initrd.img"

    log "Initramfs created: $ISO_DIR/boot/initrd.img"
}

# Setup bootloader
setup_bootloader() {
    log "Setting up bootloader..."

    mkdir -p "$ISO_DIR/boot/grub"

    # Copy GRUB configuration
    cp "$DISTRO_DIR/bootloader/grub.cfg" "$ISO_DIR/boot/grub/grub.cfg"

    # Update kernel version in GRUB config
    sed -i "s/KERNEL_VERSION/${KERNEL_VERSION}/g" "$ISO_DIR/boot/grub/grub.cfg"
}

# Create root filesystem
create_rootfs() {
    log "Creating root filesystem..."

    local rootfs_dir="$BUILD_DIR/rootfs"
    mkdir -p "$rootfs_dir"

    # Create basic directory structure
    mkdir -p "$rootfs_dir"/{bin,sbin,etc,proc,sys,dev,lib,lib64,usr,home,var,tmp,opt,root}
    mkdir -p "$rootfs_dir"/usr/{bin,sbin,lib,local}
    mkdir -p "$rootfs_dir"/var/{log,run,spool,cache,lib}
    mkdir -p "$rootfs_dir"/etc/{init.d,rc.d}

    # Copy cloud configurations
    cp -r "$DISTRO_DIR/cloud-config" "$rootfs_dir/etc/"

    # Create basic configuration files
    cat > "$rootfs_dir/etc/fstab" << EOF
# Cloud-Optimized Linux Distribution fstab
/dev/sda1 / ext4 defaults 0 1
proc /proc proc defaults 0 0
sysfs /sys sysfs defaults 0 0
devpts /dev/pts devpts gid=5,mode=620 0 0
tmpfs /dev/shm tmpfs defaults 0 0
EOF

    cat > "$rootfs_dir/etc/hostname" << EOF
cloud-optimized-linux
EOF

    cat > "$rootfs_dir/etc/hosts" << EOF
127.0.0.1 localhost
127.0.1.1 cloud-optimized-linux

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
EOF

    # Create basic init script
    cat > "$rootfs_dir/sbin/init" << 'EOF'
#!/bin/sh

# Cloud-Optimized Linux Distribution Init
PATH=/bin:/sbin:/usr/bin:/usr/sbin

# Mount essential filesystems
mount -t proc proc /proc
mount -t sysfs sysfs /sys
mount -t devtmpfs devtmpfs /dev

# Set up basic environment
hostname $(cat /etc/hostname)
export HOME=/root
export PATH

# Start services
echo "Cloud-Optimized Linux Distribution started"

# Launch shell
exec /bin/sh
EOF

    chmod +x "$rootfs_dir/sbin/init"

    # Create rootfs tarball
    cd "$rootfs_dir"
    tar -czf "$ISO_DIR/rootfs.tar.gz" .

    log "Root filesystem created: $ISO_DIR/rootfs.tar.gz"
}

# Create ISO
create_iso() {
    log "Creating bootable ISO..."

    # Copy kernel (assuming it was built)
    if [ -f "/tmp/kernel-build/linux-kernel-${KERNEL_VERSION}-cloud.tar.gz" ]; then
        tar -xzf "/tmp/kernel-build/linux-kernel-${KERNEL_VERSION}-cloud.tar.gz" -C "$ISO_DIR"
    else
        warn "Kernel package not found, creating minimal ISO"
        # Create minimal kernel for testing
        echo "Minimal kernel placeholder" > "$ISO_DIR/boot/vmlinuz-${KERNEL_VERSION}-cloud"
    fi

    # Create ISO
    grub-mkrescue -o "cloud-linux-distro-${KERNEL_VERSION}.iso" "$ISO_DIR"

    log "ISO created: cloud-linux-distro-${KERNEL_VERSION}.iso"
}

# Main build function
main() {
    info "Cloud-Optimized Linux Distribution Build System"
    info "=============================================="

    # Clean build directory
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    mkdir -p "$ISO_DIR"

    check_dependencies
    build_kernel
    create_initrd
    setup_bootloader
    create_rootfs
    create_iso

    log "Build completed successfully!"
    info "Output files:"
    info "  - ISO: cloud-linux-distro-${KERNEL_VERSION}.iso"
    info "  - RootFS: $ISO_DIR/rootfs.tar.gz"
    info "  - Kernel: /tmp/kernel-build/linux-kernel-${KERNEL_VERSION}-cloud.tar.gz"
}

# Run main function
main "$@"
