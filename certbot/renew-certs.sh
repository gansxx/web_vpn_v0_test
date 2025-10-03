#!/bin/bash

# Let's Encrypt Certificate Renewal Script
# This script manually triggers certificate renewal

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting certificate renewal process...${NC}"

# Renew certificates
docker-compose run --rm certbot renew

# Reload nginx to use renewed certificates
echo -e "${YELLOW}Reloading nginx...${NC}"
docker-compose exec nginx nginx -s reload

echo -e "${GREEN}Certificate renewal complete!${NC}"
echo ""
echo -e "${YELLOW}Note: Certificates are automatically renewed by the certbot container every 12 hours${NC}"
