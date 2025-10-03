#!/bin/bash

# 从 Registry 拉取镜像并部署到服务器
# 此脚本在云端服务器上执行，由 GitHub Actions 调用

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check arguments
if [ $# -lt 1 ]; then
    echo -e "${RED}错误: 缺少镜像名称${NC}"
    echo "用法: $0 <image:tag> [registry_username] [registry_password] [project_dir]"
    echo "示例: $0 docker.io/username/vpn-web-nextjs:latest username password /opt/app"
    exit 1
fi

IMAGE="$1"
REGISTRY_USER="${2:-}"
REGISTRY_PASS="${3:-}"
PROJECT_DIR="${4:-}"

# Configuration - use provided dir or fall back to current directory
if [ -z "$PROJECT_DIR" ]; then
    PROJECT_DIR=$(pwd)
    echo -e "${YELLOW}⚠ PROJECT_DIR未指定，使用当前目录: $PROJECT_DIR${NC}"
fi

BACKUP_TAG="backup-$(date +%Y%m%d-%H%M%S)"

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_header "从 Registry 部署应用"

echo -e "${YELLOW}镜像: $IMAGE${NC}"
echo -e "${YELLOW}项目目录: $PROJECT_DIR${NC}"

# Login to registry if credentials provided
if [ -n "$REGISTRY_USER" ] && [ -n "$REGISTRY_PASS" ]; then
    print_header "登录 Registry"

    REGISTRY_HOST=$(echo "$IMAGE" | cut -d'/' -f1)
    echo -e "${YELLOW}Registry: $REGISTRY_HOST${NC}"

    echo "$REGISTRY_PASS" | docker login "$REGISTRY_HOST" -u "$REGISTRY_USER" --password-stdin
    echo -e "${GREEN}✓ 登录成功${NC}"
fi

# Backup current image
print_header "备份当前镜像"

if docker images | grep -q "vpn-web-nextjs"; then
    CURRENT_IMAGE=$(docker images vpn-web-nextjs --format "{{.Repository}}:{{.Tag}}" | head -1)
    if [ -n "$CURRENT_IMAGE" ] && [ "$CURRENT_IMAGE" != "<none>:<none>" ]; then
        echo -e "${YELLOW}备份当前镜像: $CURRENT_IMAGE → $BACKUP_TAG${NC}"
        docker tag "$CURRENT_IMAGE" "vpn-web-nextjs:$BACKUP_TAG"
        echo -e "${GREEN}✓ 备份完成${NC}"
    else
        echo -e "${YELLOW}⚠ 未找到当前镜像，跳过备份${NC}"
    fi
else
    echo -e "${YELLOW}⚠ 首次部署，无需备份${NC}"
fi

# Pull new image
print_header "拉取最新镜像"

echo -e "${YELLOW}拉取镜像: $IMAGE${NC}"
if docker pull "$IMAGE"; then
    echo -e "${GREEN}✓ 镜像拉取成功${NC}"
else
    echo -e "${RED}✗ 镜像拉取失败${NC}"
    exit 1
fi

# Tag as latest for local use
REGISTRY_NAME=$(echo "$IMAGE" | sed 's|docker.io/||' | sed 's|:[^:]*$||')
docker tag "$IMAGE" "vpn-web-nextjs:latest"

# Check and setup project directory
print_header "检查项目目录"

if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠ 项目目录不存在，创建目录: $PROJECT_DIR${NC}"
    mkdir -p "$PROJECT_DIR"
fi

cd "$PROJECT_DIR" || {
    echo -e "${RED}✗ 无法进入项目目录: $PROJECT_DIR${NC}"
    exit 1
}

echo -e "${GREEN}✓ 工作目录: $PROJECT_DIR${NC}"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${YELLOW}⚠ docker-compose.yml 不存在，创建基础配置...${NC}"

    cat > docker-compose.yml <<'COMPOSE_EOF'
services:
  nextjs:
    image: vpn-web-nextjs:latest
    container_name: vpn-web-nextjs
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    networks:
      - vpn-network

networks:
  vpn-network:
    external: true
    name: vpn-network
COMPOSE_EOF

    echo -e "${GREEN}✓ 已创建默认 docker-compose.yml${NC}"
fi

# Stop and remove old container
print_header "停止旧容器"

if docker compose ps | grep -q "vpn-nextjs"; then
    echo -e "${YELLOW}停止旧容器...${NC}"
    docker compose stop nextjs
    docker compose rm -f nextjs
    echo -e "${GREEN}✓ 旧容器已停止${NC}"
else
    echo -e "${YELLOW}⚠ 未找到运行中的容器${NC}"
fi

# Start new container
print_header "启动新容器"

echo -e "${YELLOW}启动容器...${NC}"
docker compose up -d nextjs

# Wait for container to start
echo -e "${YELLOW}等待容器启动...${NC}"
sleep 5

# Health check
print_header "健康检查"

MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker-compose exec -T nextjs wget -q --spider http://localhost:3000/api/health 2>/dev/null; then
        echo -e "${GREEN}✓ 健康检查通过${NC}"
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo -e "${YELLOW}健康检查失败，重试 $RETRY_COUNT/$MAX_RETRIES...${NC}"
        sleep 3
    else
        echo -e "${RED}✗ 健康检查失败，回滚到备份镜像${NC}"

        # Rollback
        if docker images | grep -q "$BACKUP_TAG"; then
            echo -e "${YELLOW}执行回滚...${NC}"
            docker-compose stop nextjs
            docker tag "vpn-web-nextjs:$BACKUP_TAG" "vpn-web-nextjs:latest"
            docker-compose up -d nextjs
            echo -e "${RED}✗ 部署失败，已回滚到备份版本${NC}"
            exit 1
        else
            echo -e "${RED}✗ 无法回滚，请手动修复${NC}"
            exit 1
        fi
    fi
done

# Check container logs
print_header "容器状态"

echo -e "${YELLOW}容器日志 (最后 20 行):${NC}"
docker-compose logs --tail=20 nextjs

docker-compose ps

# Cleanup old images
print_header "清理旧镜像"

echo -e "${YELLOW}清理未使用的镜像...${NC}"
docker image prune -f
echo -e "${GREEN}✓ 清理完成${NC}"

# Summary
print_header "部署完成"

echo -e "${GREEN}✓ 应用已成功部署！${NC}"
echo ""
echo -e "${YELLOW}部署信息:${NC}"
echo -e "  新镜像: ${BLUE}$IMAGE${NC}"
echo -e "  备份镜像: ${BLUE}vpn-web-nextjs:$BACKUP_TAG${NC}"
echo ""
echo -e "${YELLOW}管理命令:${NC}"
echo -e "  查看日志: ${BLUE}docker-compose logs -f nextjs${NC}"
echo -e "  重启服务: ${BLUE}docker-compose restart nextjs${NC}"
echo -e "  回滚版本: ${BLUE}docker tag vpn-web-nextjs:$BACKUP_TAG vpn-web-nextjs:latest && docker-compose restart nextjs${NC}"
