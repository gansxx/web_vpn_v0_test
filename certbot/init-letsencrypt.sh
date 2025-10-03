#!/bin/bash

# Let's Encrypt Certificate Initialization Script
# This script initializes SSL certificates for your domain using Certbot

set -e

# Configuration
DOMAIN="${DOMAIN:-your-domain.com}"
EMAIL="${EMAIL:-admin@your-domain.com}"
STAGING="${STAGING:-0}"  # Set to 1 for testing with Let's Encrypt staging server

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if domain is configured
if [ "$DOMAIN" = "your-domain.com" ]; then
    echo -e "${RED}Error: Please set DOMAIN environment variable${NC}"
    echo "Usage: DOMAIN=example.com EMAIL=admin@example.com ./init-letsencrypt.sh"
    exit 1
fi

if [ "$EMAIL" = "admin@your-domain.com" ]; then
    echo -e "${YELLOW}Warning: Using default email. Please set EMAIL environment variable${NC}"
fi

echo -e "${GREEN}Initializing Let's Encrypt certificates for: ${DOMAIN}${NC}"

# Paths
NGINX_CONF="./nginx/conf.d/default.conf"
SSL_PARAMS="./nginx/ssl-params.conf"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"

# Create dummy certificate for nginx to start
echo -e "${YELLOW}Creating dummy certificate for nginx initialization...${NC}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '$CERT_PATH/privkey.pem' \
    -out '$CERT_PATH/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# Update nginx configuration with actual domain
echo -e "${YELLOW}Updating nginx configuration with domain: ${DOMAIN}${NC}"
sed -i "s/your-domain.com/$DOMAIN/g" "$NGINX_CONF"
sed -i "s/your-domain.com/$DOMAIN/g" "$SSL_PARAMS"

# Start nginx
echo -e "${GREEN}Starting nginx...${NC}"
docker-compose up -d nginx

# Wait for nginx to be ready
echo -e "${YELLOW}Waiting for nginx to be ready...${NC}"
sleep 5

# Delete dummy certificate
echo -e "${YELLOW}Removing dummy certificate...${NC}"
docker-compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$DOMAIN && \
  rm -rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

# Request Let's Encrypt certificate
echo -e "${GREEN}Requesting Let's Encrypt certificate for ${DOMAIN}...${NC}"

if [ $STAGING != "0" ]; then
    STAGING_ARG="--staging"
    echo -e "${YELLOW}Using Let's Encrypt staging server${NC}"
else
    STAGING_ARG=""
fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN" certbot

# Reload nginx to use the new certificate
echo -e "${GREEN}Reloading nginx with real certificate...${NC}"
docker-compose exec nginx nginx -s reload

echo -e "${GREEN}Certificate initialization complete!${NC}"
echo -e "${GREEN}Your site should now be accessible at: https://${DOMAIN}${NC}"
echo ""
echo -e "${YELLOW}Note: Certificate will auto-renew via certbot container${NC}"
