#!/bin/bash

# VPN Web Application - Server Setup Verification Script
# This script verifies that the server is properly configured for Docker deployment

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server configuration
SERVER_IP="${1:-8.217.223.134}"
SSH_USER="${2:-root}"
SSH_PORT="${3:-22}"

echo -e "${BLUE}=== VPN Web Application - Server Setup Verification ===${NC}"
echo -e "${YELLOW}Server: $SSH_USER@$SERVER_IP:$SSH_PORT${NC}\n"

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Function to print check result
check_result() {
    local status=$1
    local message=$2
    local detail=$3

    case $status in
        "pass")
            echo -e "${GREEN}✓${NC} $message"
            [ -n "$detail" ] && echo -e "  ${detail}"
            ((CHECKS_PASSED++))
            ;;
        "fail")
            echo -e "${RED}✗${NC} $message"
            [ -n "$detail" ] && echo -e "  ${RED}$detail${NC}"
            ((CHECKS_FAILED++))
            ;;
        "warn")
            echo -e "${YELLOW}⚠${NC} $message"
            [ -n "$detail" ] && echo -e "  ${YELLOW}$detail${NC}"
            ((CHECKS_WARNING++))
            ;;
    esac
}

# Function to run remote command
remote_exec() {
    ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SERVER_IP" "$@" 2>/dev/null
}

echo -e "${BLUE}[1/8] Checking SSH Connectivity${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SERVER_IP" "echo 'Connected'" &>/dev/null; then
    check_result "pass" "SSH connection successful"
else
    check_result "fail" "SSH connection failed" "Check if server is accessible and SSH credentials are correct"
    echo -e "\n${RED}Cannot proceed without SSH access. Exiting.${NC}"
    exit 1
fi

echo ""

echo -e "${BLUE}[2/8] Checking System Requirements${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check OS
OS_INFO=$(remote_exec "cat /etc/os-release | grep PRETTY_NAME" | cut -d'"' -f2)
if [ -n "$OS_INFO" ]; then
    check_result "pass" "Operating System: $OS_INFO"
else
    check_result "warn" "Cannot detect OS information"
fi

# Check CPU cores
CPU_CORES=$(remote_exec "nproc")
if [ -n "$CPU_CORES" ]; then
    if [ "$CPU_CORES" -ge 2 ]; then
        check_result "pass" "CPU Cores: $CPU_CORES (Recommended: ≥2)"
    else
        check_result "warn" "CPU Cores: $CPU_CORES (Recommended: ≥2)"
    fi
fi

# Check total memory
TOTAL_MEM=$(remote_exec "free -g | grep Mem | awk '{print \$2}'")
if [ -n "$TOTAL_MEM" ]; then
    if [ "$TOTAL_MEM" -ge 2 ]; then
        check_result "pass" "Total Memory: ${TOTAL_MEM}GB (Recommended: ≥2GB for Docker)"
    elif [ "$TOTAL_MEM" -ge 1 ]; then
        check_result "warn" "Total Memory: ${TOTAL_MEM}GB (Minimum OK, 2GB+ recommended)"
    else
        check_result "fail" "Total Memory: ${TOTAL_MEM}GB (Too low for Docker deployment)"
    fi
fi

# Check available disk space
DISK_AVAIL=$(remote_exec "df -BG / | tail -1 | awk '{print \$4}' | sed 's/G//'")
if [ -n "$DISK_AVAIL" ]; then
    if [ "$DISK_AVAIL" -ge 10 ]; then
        check_result "pass" "Available Disk Space: ${DISK_AVAIL}GB (Recommended: ≥10GB)"
    elif [ "$DISK_AVAIL" -ge 5 ]; then
        check_result "warn" "Available Disk Space: ${DISK_AVAIL}GB (Limited, 10GB+ recommended)"
    else
        check_result "fail" "Available Disk Space: ${DISK_AVAIL}GB (Insufficient for Docker images)"
    fi
fi

echo ""

echo -e "${BLUE}[3/8] Checking Docker Installation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Docker
if remote_exec "command -v docker" &>/dev/null; then
    DOCKER_VERSION=$(remote_exec "docker --version" | cut -d' ' -f3 | tr -d ',')
    check_result "pass" "Docker installed: $DOCKER_VERSION"

    # Check Docker service
    if remote_exec "systemctl is-active docker" &>/dev/null; then
        check_result "pass" "Docker service is running"
    else
        check_result "fail" "Docker service is not running" "Run: sudo systemctl start docker"
    fi
else
    check_result "fail" "Docker is not installed" "Install with: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
fi

# Check Docker Compose
if remote_exec "command -v docker-compose" &>/dev/null; then
    COMPOSE_VERSION=$(remote_exec "docker-compose --version" | awk '{print $4}' | tr -d ',')
    check_result "pass" "Docker Compose installed: $COMPOSE_VERSION"
elif remote_exec "docker compose version" &>/dev/null; then
    COMPOSE_VERSION=$(remote_exec "docker compose version" | awk '{print $4}')
    check_result "pass" "Docker Compose (plugin) installed: $COMPOSE_VERSION"
else
    check_result "fail" "Docker Compose is not installed" "Install with: sudo apt install docker-compose-plugin"
fi

echo ""

echo -e "${BLUE}[4/8] Checking Network Connectivity${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check internet connectivity
if remote_exec "ping -c 1 8.8.8.8" &>/dev/null; then
    check_result "pass" "Internet connectivity available"
else
    check_result "fail" "No internet connectivity" "Check network configuration"
fi

# Check DNS resolution
if remote_exec "nslookup hub.docker.com" &>/dev/null; then
    check_result "pass" "DNS resolution working"
else
    check_result "warn" "DNS resolution issues" "May affect docker pull operations"
fi

# Check Docker Hub connectivity
if remote_exec "curl -s -o /dev/null -w '%{http_code}' https://hub.docker.com" | grep -q "200\|301"; then
    check_result "pass" "Docker Hub accessible"
else
    check_result "warn" "Docker Hub connectivity issues" "May affect image pull"
fi

echo ""

echo -e "${BLUE}[5/8] Checking Port Availability${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check port 80
if remote_exec "sudo lsof -i :80" &>/dev/null; then
    PORT_80_PROC=$(remote_exec "sudo lsof -i :80 | tail -n +2 | awk '{print \$1}' | head -1")
    check_result "warn" "Port 80 is in use by: $PORT_80_PROC" "May need to stop existing service"
else
    check_result "pass" "Port 80 is available"
fi

# Check port 443
if remote_exec "sudo lsof -i :443" &>/dev/null; then
    PORT_443_PROC=$(remote_exec "sudo lsof -i :443 | tail -n +2 | awk '{print \$1}' | head -1")
    check_result "warn" "Port 443 is in use by: $PORT_443_PROC" "May need to stop existing service"
else
    check_result "pass" "Port 443 is available"
fi

# Check port 3000
if remote_exec "lsof -i :3000" &>/dev/null; then
    check_result "warn" "Port 3000 is in use" "Docker will handle port mapping"
else
    check_result "pass" "Port 3000 is available"
fi

echo ""

echo -e "${BLUE}[6/8] Checking Firewall Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check UFW status
if remote_exec "command -v ufw" &>/dev/null; then
    UFW_STATUS=$(remote_exec "sudo ufw status" | head -1)
    if echo "$UFW_STATUS" | grep -q "inactive"; then
        check_result "warn" "UFW firewall is inactive" "Consider enabling: sudo ufw enable"
    else
        check_result "pass" "UFW firewall is active"

        # Check if HTTP/HTTPS ports are allowed
        if remote_exec "sudo ufw status | grep -E '80|443'" &>/dev/null; then
            check_result "pass" "HTTP/HTTPS ports are allowed in firewall"
        else
            check_result "warn" "HTTP/HTTPS ports not explicitly allowed" "May need: sudo ufw allow 80,443/tcp"
        fi
    fi
else
    check_result "warn" "UFW not installed" "Firewall configuration not checked"
fi

echo ""

echo -e "${BLUE}[7/8] Checking Project Directory${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PROJECT_DIR="/root/self_code/web_vpn_v0_test"

# Check if project directory exists
if remote_exec "[ -d $PROJECT_DIR ]"; then
    check_result "pass" "Project directory exists: $PROJECT_DIR"

    # Check if docker-compose.yml exists
    if remote_exec "[ -f $PROJECT_DIR/docker-compose.yml ]"; then
        check_result "pass" "docker-compose.yml found"
    else
        check_result "fail" "docker-compose.yml not found" "Clone the repository first"
    fi

    # Check if Dockerfile exists
    if remote_exec "[ -f $PROJECT_DIR/Dockerfile ]"; then
        check_result "pass" "Dockerfile found"
    else
        check_result "fail" "Dockerfile not found"
    fi

    # Check if .env.docker exists
    if remote_exec "[ -f $PROJECT_DIR/.env.docker ]"; then
        check_result "pass" ".env.docker found"
    else
        check_result "warn" ".env.docker not found" "Copy from .env.docker.example"
    fi
else
    check_result "fail" "Project directory not found: $PROJECT_DIR" "Clone the repository to this location"
fi

echo ""

echo -e "${BLUE}[8/8] Checking Docker Images and Containers${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check existing containers
CONTAINER_COUNT=$(remote_exec "docker ps -a | grep vpn- | wc -l" || echo "0")
if [ "$CONTAINER_COUNT" -gt 0 ]; then
    check_result "pass" "Found $CONTAINER_COUNT existing VPN containers"

    # Check if containers are running
    RUNNING_COUNT=$(remote_exec "docker ps | grep vpn- | wc -l" || echo "0")
    if [ "$RUNNING_COUNT" -gt 0 ]; then
        check_result "pass" "$RUNNING_COUNT containers are running"
    else
        check_result "warn" "Containers exist but not running" "Start with: docker-compose up -d"
    fi
else
    check_result "pass" "No existing containers (clean state)"
fi

# Check Docker volumes
VOLUME_COUNT=$(remote_exec "docker volume ls | grep vpn- | wc -l" || echo "0")
if [ "$VOLUME_COUNT" -gt 0 ]; then
    check_result "pass" "Found $VOLUME_COUNT Docker volumes"
else
    check_result "pass" "No existing volumes (clean state)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Verification Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -e "${GREEN}Passed:  $CHECKS_PASSED${NC}"
echo -e "${YELLOW}Warnings: $CHECKS_WARNING${NC}"
echo -e "${RED}Failed:   $CHECKS_FAILED${NC}"

echo ""

if [ "$CHECKS_FAILED" -eq 0 ]; then
    if [ "$CHECKS_WARNING" -eq 0 ]; then
        echo -e "${GREEN}✓ Server is ready for Docker deployment!${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Update GitHub Secrets with SSH_HOST=$SERVER_IP"
        echo "2. Configure .env.docker with your domain and settings"
        echo "3. Deploy using GitHub Actions or manual deployment"
        exit 0
    else
        echo -e "${YELLOW}⚠ Server is mostly ready with some warnings${NC}"
        echo ""
        echo -e "${YELLOW}Review warnings above and address if necessary${NC}"
        echo -e "${YELLOW}Deployment may still work but with limitations${NC}"
        exit 0
    fi
else
    echo -e "${RED}✗ Server has critical issues that must be fixed${NC}"
    echo ""
    echo -e "${RED}Fix the failed checks above before deploying${NC}"
    exit 1
fi
