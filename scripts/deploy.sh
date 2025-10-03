#!/bin/bash

# VPN Web Application Deployment Script
# This script deploys the containerized application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment variables from .env.docker
if [ -f "$PROJECT_DIR/.env.docker" ]; then
    source "$PROJECT_DIR/.env.docker"
    echo -e "${GREEN}✓ Loaded environment from .env.docker${NC}"
else
    echo -e "${RED}✗ Error: .env.docker not found${NC}"
    echo "Please create .env.docker based on .env.docker template"
    exit 1
fi

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗ Docker is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker installed${NC}"

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}✗ Docker Compose is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker Compose installed${NC}"

    # Check domain configuration
    if [ "$DOMAIN" = "your-domain.com" ]; then
        echo -e "${YELLOW}⚠ Warning: Using default domain configuration${NC}"
        echo -e "${YELLOW}  Please update DOMAIN in .env.docker${NC}"
    else
        echo -e "${GREEN}✓ Domain configured: $DOMAIN${NC}"
    fi
}

# Function to build containers
build_containers() {
    print_header "Building Containers"

    cd "$PROJECT_DIR"
    docker-compose build --no-cache
    echo -e "${GREEN}✓ Containers built successfully${NC}"
}

# Function to start services
start_services() {
    print_header "Starting Services"

    cd "$PROJECT_DIR"
    docker-compose up -d
    echo -e "${GREEN}✓ Services started${NC}"

    # Show running containers
    echo ""
    echo -e "${YELLOW}Running containers:${NC}"
    docker-compose ps
}

# Function to check service health
check_health() {
    print_header "Health Check"

    echo -e "${YELLOW}Waiting for services to be ready...${NC}"
    sleep 10

    # Check Next.js
    if docker-compose exec -T nextjs wget -q --spider http://localhost:3000/; then
        echo -e "${GREEN}✓ Next.js application is healthy${NC}"
    else
        echo -e "${RED}✗ Next.js application health check failed${NC}"
    fi

    # Check Nginx
    if docker-compose exec -T nginx nginx -t &> /dev/null; then
        echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
    else
        echo -e "${RED}✗ Nginx configuration has errors${NC}"
        docker-compose exec nginx nginx -t
    fi
}

# Function to display deployment info
display_info() {
    print_header "Deployment Information"

    echo -e "${GREEN}Deployment completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Application URLs:${NC}"
    echo -e "  HTTP:  http://$DOMAIN"
    echo -e "  HTTPS: https://$DOMAIN"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  1. Initialize SSL certificate (first time only):"
    echo -e "     ${BLUE}DOMAIN=$DOMAIN EMAIL=$EMAIL ./certbot/init-letsencrypt.sh${NC}"
    echo ""
    echo -e "  2. View logs:"
    echo -e "     ${BLUE}docker-compose logs -f${NC}"
    echo ""
    echo -e "  3. Stop services:"
    echo -e "     ${BLUE}docker-compose down${NC}"
    echo ""
    echo -e "  4. Restart services:"
    echo -e "     ${BLUE}docker-compose restart${NC}"
    echo ""
    echo -e "${YELLOW}Useful Commands:${NC}"
    echo -e "  View Next.js logs:     ${BLUE}docker-compose logs -f nextjs${NC}"
    echo -e "  View Nginx logs:       ${BLUE}docker-compose logs -f nginx${NC}"
    echo -e "  Restart Next.js:       ${BLUE}docker-compose restart nextjs${NC}"
    echo -e "  Execute shell in app:  ${BLUE}docker-compose exec nextjs sh${NC}"
    echo -e "  Backup data:           ${BLUE}./scripts/backup.sh${NC}"
}

# Main deployment flow
main() {
    echo -e "${GREEN}Starting VPN Web Application Deployment${NC}"
    echo -e "${YELLOW}Project: $PROJECT_DIR${NC}"
    echo ""

    check_prerequisites
    build_containers
    start_services
    check_health
    display_info
}

# Run main function
main
