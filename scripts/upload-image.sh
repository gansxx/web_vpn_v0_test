#!/bin/bash

# 上传 Docker 镜像到云端服务器
# 支持断点续传和进度显示

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
LOCAL_DIR="${LOCAL_DIR:-./docker-images}"
REMOTE_DIR="${REMOTE_DIR:-/tmp/docker-images}"
USE_RSYNC="${USE_RSYNC:-true}"

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

print_header "上传 Docker 镜像到云端"

# Find the image file
IMAGE_FILES=(
    "$LOCAL_DIR/${IMAGE_NAME}-${IMAGE_TAG}.tar.gz"
    "$LOCAL_DIR/${IMAGE_NAME}-${IMAGE_TAG}.tar.zst"
    "$LOCAL_DIR/${IMAGE_NAME}-${IMAGE_TAG}.tar"
)

IMAGE_FILE=""
for file in "${IMAGE_FILES[@]}"; do
    if [ -f "$file" ]; then
        IMAGE_FILE="$file"
        break
    fi
done

if [ -z "$IMAGE_FILE" ]; then
    echo -e "${RED}错误: 未找到镜像文件${NC}"
    echo "请先运行: ./scripts/build-and-export.sh"
    exit 1
fi

CHECKSUM_FILE="${IMAGE_FILE}.sha256"

if [ ! -f "$CHECKSUM_FILE" ]; then
    echo -e "${YELLOW}警告: 未找到校验和文件，正在生成...${NC}"
    sha256sum "$IMAGE_FILE" > "$CHECKSUM_FILE"
fi

echo -e "${GREEN}找到镜像文件:${NC}"
echo -e "  文件: ${BLUE}$IMAGE_FILE${NC}"
echo -e "  大小: ${BLUE}$(du -h "$IMAGE_FILE" | cut -f1)${NC}"
echo -e "  校验: ${BLUE}$CHECKSUM_FILE${NC}"
echo ""

# Create remote directory
print_header "准备远程目录"

echo -e "${YELLOW}在服务器上创建目录: $REMOTE_DIR${NC}"
ssh -p "$PORT" "$SERVER" "mkdir -p $REMOTE_DIR"
echo -e "${GREEN}✓ 远程目录就绪${NC}"

# Check and install rsync on remote server if needed
if [ "$USE_RSYNC" = "true" ] && command -v rsync &> /dev/null; then
    print_header "检查远程 rsync"

    # Check if rsync is installed on remote server
    if ! ssh -p "$PORT" "$SERVER" "command -v rsync &> /dev/null"; then
        echo -e "${YELLOW}远程服务器未安装 rsync，尝试自动安装...${NC}"

        # Detect remote OS and install rsync
        INSTALL_CMD=$(ssh -p "$PORT" "$SERVER" '
            if command -v apt-get &> /dev/null; then
                echo "apt-get update && apt-get install -y rsync"
            elif command -v yum &> /dev/null; then
                echo "yum install -y rsync"
            elif command -v dnf &> /dev/null; then
                echo "dnf install -y rsync"
            elif command -v apk &> /dev/null; then
                echo "apk add --no-cache rsync"
            elif command -v pacman &> /dev/null; then
                echo "pacman -S --noconfirm rsync"
            else
                echo "UNSUPPORTED"
            fi
        ')

        if [ "$INSTALL_CMD" = "UNSUPPORTED" ]; then
            echo -e "${YELLOW}⚠ 无法自动安装 rsync (不支持的系统)，将使用 scp 上传${NC}"
            USE_RSYNC="false"
        else
            echo -e "${BLUE}检测到包管理器，执行安装命令...${NC}"
            if ssh -p "$PORT" "$SERVER" "sudo $INSTALL_CMD"; then
                echo -e "${GREEN}✓ rsync 安装成功${NC}"
            else
                echo -e "${YELLOW}⚠ rsync 安装失败，将使用 scp 上传${NC}"
                USE_RSYNC="false"
            fi
        fi
    else
        echo -e "${GREEN}✓ 远程服务器已安装 rsync${NC}"
    fi
fi

# Upload files
print_header "上传文件"

if [ "$USE_RSYNC" = "true" ] && command -v rsync &> /dev/null; then
    echo -e "${YELLOW}使用 rsync 上传 (支持断点续传)...${NC}"

    # Upload image file
    echo -e "${BLUE}上传镜像文件...${NC}"
    rsync -avz --progress \
        -e "ssh -p $PORT" \
        "$IMAGE_FILE" \
        "$SERVER:$REMOTE_DIR/"

    # Upload checksum file
    echo -e "${BLUE}上传校验文件...${NC}"
    rsync -avz \
        -e "ssh -p $PORT" \
        "$CHECKSUM_FILE" \
        "$SERVER:$REMOTE_DIR/"
else
    echo -e "${YELLOW}使用 scp 上传...${NC}"

    # Upload image file
    echo -e "${BLUE}上传镜像文件...${NC}"
    scp -P "$PORT" "$IMAGE_FILE" "$SERVER:$REMOTE_DIR/"

    # Upload checksum file
    echo -e "${BLUE}上传校验文件...${NC}"
    scp -P "$PORT" "$CHECKSUM_FILE" "$SERVER:$REMOTE_DIR/"
fi

echo -e "${GREEN}✓ 文件上传完成${NC}"

# Verify checksum on remote server
print_header "验证文件完整性"

REMOTE_IMAGE_FILE="$REMOTE_DIR/$(basename "$IMAGE_FILE")"
REMOTE_CHECKSUM_FILE="$REMOTE_DIR/$(basename "$CHECKSUM_FILE")"

echo -e "${YELLOW}在服务器上验证 SHA256...${NC}"
VERIFY_RESULT=$(ssh -p "$PORT" "$SERVER" "cd $REMOTE_DIR && sha256sum $(basename "$IMAGE_FILE") | cut -d' ' -f1")
LOCAL_CHECKSUM=$(cat "$CHECKSUM_FILE" | cut -d' ' -f1)

if [ "$VERIFY_RESULT" = "$LOCAL_CHECKSUM" ]; then
    echo -e "${GREEN}✓ 文件完整性验证通过${NC}"
else
    echo -e "${RED}✗ 校验和不匹配${NC}"
    echo -e "  本地: ${BLUE}$LOCAL_CHECKSUM${NC}"
    echo -e "  远程: ${BLUE}$VERIFY_RESULT${NC}"
    exit 1
fi

# Summary
print_header "上传完成"

echo -e "${GREEN}镜像已成功上传到云端服务器！${NC}"
echo ""
echo -e "${YELLOW}服务器信息:${NC}"
echo -e "  地址: ${BLUE}$SERVER${NC}"
echo -e "  端口: ${BLUE}$PORT${NC}"
echo -e "  目录: ${BLUE}$REMOTE_DIR${NC}"
echo ""
echo -e "${YELLOW}远程文件:${NC}"
echo -e "  镜像: ${BLUE}$REMOTE_IMAGE_FILE${NC}"
echo -e "  校验: ${BLUE}$REMOTE_CHECKSUM_FILE${NC}"
echo ""
echo -e "${YELLOW}下一步操作:${NC}"
echo -e "  1. 复制加载脚本到服务器:"
echo -e "     ${BLUE}scp -P $PORT scripts/load-image.sh $SERVER:/tmp/${NC}"
echo ""
echo -e "  2. 在服务器上加载镜像:"
echo -e "     ${BLUE}ssh -p $PORT $SERVER 'bash /tmp/load-image.sh $REMOTE_IMAGE_FILE'${NC}"
echo ""
echo -e "  3. 或使用一键加载命令:"
echo -e "     ${BLUE}./scripts/remote-load.sh $SERVER $PORT${NC}"
