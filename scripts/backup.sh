#!/bin/bash

# Backup Script for VPN Web Application
# This script backs up certificates, logs, and configuration

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="vpn-web-backup-$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Create backup directory
create_backup_dir() {
    print_header "Creating Backup Directory"

    mkdir -p "$BACKUP_PATH"
    echo -e "${GREEN}✓ Created: $BACKUP_PATH${NC}"
}

# Backup SSL certificates
backup_certificates() {
    print_header "Backing Up SSL Certificates"

    if docker volume ls | grep -q vpn-certbot-certs; then
        docker run --rm -v vpn-certbot-certs:/certs -v "$PWD/$BACKUP_PATH":/backup alpine \
            tar czf /backup/certificates.tar.gz -C /certs .
        echo -e "${GREEN}✓ Certificates backed up${NC}"
    else
        echo -e "${YELLOW}⚠ No certificates volume found${NC}"
    fi
}

# Backup Nginx logs
backup_logs() {
    print_header "Backing Up Nginx Logs"

    if docker volume ls | grep -q vpn-nginx-logs; then
        docker run --rm -v vpn-nginx-logs:/logs -v "$PWD/$BACKUP_PATH":/backup alpine \
            tar czf /backup/nginx-logs.tar.gz -C /logs .
        echo -e "${GREEN}✓ Nginx logs backed up${NC}"
    else
        echo -e "${YELLOW}⚠ No Nginx logs volume found${NC}"
    fi
}

# Backup configuration files
backup_config() {
    print_header "Backing Up Configuration Files"

    cd "$PROJECT_DIR"
    tar czf "$BACKUP_PATH/config.tar.gz" \
        nginx/ \
        .env.docker \
        .env.production \
        docker-compose.yml \
        Dockerfile
    echo -e "${GREEN}✓ Configuration files backed up${NC}"
}

# Create backup manifest
create_manifest() {
    print_header "Creating Backup Manifest"

    cat > "$BACKUP_PATH/manifest.txt" << EOF
VPN Web Application Backup
==========================
Date: $(date)
Hostname: $(hostname)
Docker Version: $(docker --version)
Docker Compose Version: $(docker-compose --version)

Contents:
- certificates.tar.gz   (SSL certificates)
- nginx-logs.tar.gz    (Nginx access/error logs)
- config.tar.gz        (Docker and Nginx configuration)

Restore Instructions:
1. Extract config.tar.gz to project directory
2. Import certificates: docker run --rm -v vpn-certbot-certs:/certs -v \$PWD:/backup alpine tar xzf /backup/certificates.tar.gz -C /certs
3. Import logs: docker run --rm -v vpn-nginx-logs:/logs -v \$PWD:/backup alpine tar xzf /backup/nginx-logs.tar.gz -C /logs
4. Restart services: docker-compose restart
EOF

    echo -e "${GREEN}✓ Manifest created${NC}"
}

# Compress backup
compress_backup() {
    print_header "Compressing Backup"

    cd "$BACKUP_DIR"
    tar czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"
    rm -rf "$BACKUP_NAME"

    BACKUP_SIZE=$(du -h "$BACKUP_NAME.tar.gz" | cut -f1)
    echo -e "${GREEN}✓ Backup compressed: $BACKUP_NAME.tar.gz ($BACKUP_SIZE)${NC}"
}

# Cleanup old backups
cleanup_old_backups() {
    print_header "Cleaning Up Old Backups"

    # Keep only last 7 backups
    cd "$BACKUP_DIR"
    ls -t vpn-web-backup-*.tar.gz | tail -n +8 | xargs -r rm

    BACKUP_COUNT=$(ls -1 vpn-web-backup-*.tar.gz 2>/dev/null | wc -l)
    echo -e "${GREEN}✓ Kept $BACKUP_COUNT recent backups${NC}"
}

# Display summary
display_summary() {
    print_header "Backup Summary"

    echo -e "${GREEN}Backup completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Backup Location:${NC}"
    echo -e "  $BACKUP_DIR/$BACKUP_NAME.tar.gz"
    echo ""
    echo -e "${YELLOW}Backup Contents:${NC}"
    cd "$BACKUP_DIR"
    tar tzf "$BACKUP_NAME.tar.gz" | head -20
    echo ""
    echo -e "${YELLOW}To restore this backup:${NC}"
    echo -e "  1. Extract: tar xzf $BACKUP_NAME.tar.gz"
    echo -e "  2. Read: cat $BACKUP_NAME/manifest.txt"
}

# Main backup flow
main() {
    echo -e "${GREEN}Starting VPN Web Application Backup${NC}"
    echo ""

    create_backup_dir
    backup_certificates
    backup_logs
    backup_config
    create_manifest
    compress_backup
    cleanup_old_backups
    display_summary
}

# Run main function
main
