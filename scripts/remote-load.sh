#!/bin/bash

# 一键远程加载脚本
# 上传加载脚本到服务器并执行加载操作

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
IMAGE_NAME="${IMAGE_NAME:-vpn-web-nextjs}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
REMOTE_DIR="${REMOTE_DIR:-/tmp/docker-images}"

# Check arguments
if [ $# -lt 1 ]; then
    echo -e "${RED}错误: 缺少服务器地址${NC}"
    echo "用法: $0 <user@server> [port]"
    echo "示例: $0 root@192.168.1.100"
    echo "示例: $0 root@192.168.1.100 2222"
    exit 1
fi

SERVER="$1"
PORT="${2:-22}"

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_header "一键远程加载 Docker 镜像"

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Step 1: Upload load script
print_header "Step 1: 上传加载脚本"

echo -e "${YELLOW}上传 load-image.sh 到服务器...${NC}"
scp -P "$PORT" "$SCRIPT_DIR/load-image.sh" "$SERVER:/tmp/"
ssh -p "$PORT" "$SERVER" "chmod +x /tmp/load-image.sh"
echo -e "${GREEN}✓ 加载脚本已上传${NC}"

# Step 2: Find image file on server
print_header "Step 2: 查找镜像文件"

echo -e "${YELLOW}在服务器上查找镜像文件...${NC}"

# Try different extensions
IMAGE_FILES=(
    "${IMAGE_NAME}-${IMAGE_TAG}.tar.gz"
    "${IMAGE_NAME}-${IMAGE_TAG}.tar.zst"
    "${IMAGE_NAME}-${IMAGE_TAG}.tar"
)

REMOTE_IMAGE_FILE=""
for file in "${IMAGE_FILES[@]}"; do
    if ssh -p "$PORT" "$SERVER" "[ -f $REMOTE_DIR/$file ]"; then
        REMOTE_IMAGE_FILE="$REMOTE_DIR/$file"
        break
    fi
done

if [ -z "$REMOTE_IMAGE_FILE" ]; then
    echo -e "${RED}错误: 在服务器上未找到镜像文件${NC}"
    echo "请先运行上传脚本: ./scripts/upload-image.sh $SERVER $PORT"
    exit 1
fi

echo -e "${GREEN}✓ 找到镜像: $REMOTE_IMAGE_FILE${NC}"

# Step 3: Load image on server
print_header "Step 3: 在服务器上加载镜像"

echo -e "${YELLOW}执行远程加载命令...${NC}"
ssh -p "$PORT" "$SERVER" "bash /tmp/load-image.sh $REMOTE_IMAGE_FILE"

# Step 4: Verify
print_header "Step 4: 验证镜像"

echo -e "${YELLOW}验证镜像是否成功加载...${NC}"
ssh -p "$PORT" "$SERVER" "docker images | grep -E 'REPOSITORY|vpn-web|nextjs'" || true

# Summary
print_header "远程加载完成"

echo -e "${GREEN}镜像已成功加载到云端服务器！${NC}"
echo ""
echo -e "${YELLOW}下一步操作:${NC}"
echo -e "  1. SSH 登录服务器:"
echo -e "     ${BLUE}ssh -p $PORT $SERVER${NC}"
echo ""
echo -e "  2. 启动容器:"
echo -e "     ${BLUE}cd /path/to/project && docker-compose up -d${NC}"
echo ""
echo -e "  3. 或远程执行启动命令:"
echo -e "     ${BLUE}ssh -p $PORT $SERVER 'cd /path/to/project && docker-compose up -d'${NC}"
