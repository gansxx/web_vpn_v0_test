#!/bin/bash

# 本地构建并导出 Docker 镜像
# 用于在本地构建镜像后传输到云端服务器
# 注意: Dockerfile 使用 pnpm 作为包管理器

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
OUTPUT_DIR="${OUTPUT_DIR:-./docker-images}"
COMPRESS="${COMPRESS:-true}"
COMPRESSION_TOOL="${COMPRESSION_TOOL:-gzip}"  # gzip, zstd, or none

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_header "Docker 镜像构建与导出"

# Load environment variables
if [ -f "$PROJECT_DIR/.env.docker" ]; then
    source "$PROJECT_DIR/.env.docker"
    echo -e "${GREEN}✓ 加载环境变量${NC}"
fi

cd "$PROJECT_DIR"

# Step 1: Build the image
print_header "Step 1: 构建 Docker 镜像"

echo -e "${YELLOW}构建镜像: $IMAGE_NAME:$IMAGE_TAG${NC}"

docker build \
  --build-arg NEXT_PUBLIC_API_BASE="${NEXT_PUBLIC_API_BASE:-https://selfgo.asia/api}" \
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY="${NEXT_PUBLIC_TURNSTILE_SITE_KEY}" \
  --build-arg NEXT_PUBLIC_DEV_MODE_ENABLED="${NEXT_PUBLIC_DEV_MODE_ENABLED:-false}" \
  --build-arg NEXT_PUBLIC_DISABLE_TURNSTILE="${NEXT_PUBLIC_DISABLE_TURNSTILE:-false}" \
  --build-arg NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE="${NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE:-false}" \
  -t "$IMAGE_NAME:$IMAGE_TAG" \
  -f Dockerfile \
  .

echo -e "${GREEN}✓ 镜像构建完成${NC}"

# Show image info
docker images "$IMAGE_NAME:$IMAGE_TAG"

# Step 2: Export the image
print_header "Step 2: 导出镜像"

mkdir -p "$OUTPUT_DIR"

EXPORT_FILE="$OUTPUT_DIR/${IMAGE_NAME}-${IMAGE_TAG}.tar"

echo -e "${YELLOW}导出镜像到: $EXPORT_FILE${NC}"
docker save -o "$EXPORT_FILE" "$IMAGE_NAME:$IMAGE_TAG"

ORIGINAL_SIZE=$(du -h "$EXPORT_FILE" | cut -f1)
echo -e "${GREEN}✓ 镜像导出完成 (大小: $ORIGINAL_SIZE)${NC}"

# Step 3: Compress if enabled
if [ "$COMPRESS" = "true" ]; then
    print_header "Step 3: 压缩镜像"

    case "$COMPRESSION_TOOL" in
        gzip)
            echo -e "${YELLOW}使用 gzip 压缩...${NC}"
            gzip -f "$EXPORT_FILE"
            FINAL_FILE="${EXPORT_FILE}.gz"
            ;;
        zstd)
            if command -v zstd &> /dev/null; then
                echo -e "${YELLOW}使用 zstd 压缩 (高压缩率)...${NC}"
                zstd -f --rm "$EXPORT_FILE"
                FINAL_FILE="${EXPORT_FILE}.zst"
            else
                echo -e "${YELLOW}zstd 未安装，使用 gzip...${NC}"
                gzip -f "$EXPORT_FILE"
                FINAL_FILE="${EXPORT_FILE}.gz"
            fi
            ;;
        none)
            echo -e "${YELLOW}跳过压缩${NC}"
            FINAL_FILE="$EXPORT_FILE"
            ;;
        *)
            echo -e "${YELLOW}未知压缩工具，使用 gzip...${NC}"
            gzip -f "$EXPORT_FILE"
            FINAL_FILE="${EXPORT_FILE}.gz"
            ;;
    esac

    if [ "$FINAL_FILE" != "$EXPORT_FILE" ]; then
        COMPRESSED_SIZE=$(du -h "$FINAL_FILE" | cut -f1)
        echo -e "${GREEN}✓ 压缩完成 (大小: $COMPRESSED_SIZE)${NC}"
    fi
else
    FINAL_FILE="$EXPORT_FILE"
fi

# Step 4: Generate checksum
print_header "Step 4: 生成校验和"

sha256sum "$FINAL_FILE" > "${FINAL_FILE}.sha256"
echo -e "${GREEN}✓ SHA256 校验和已生成${NC}"
cat "${FINAL_FILE}.sha256"

# Step 5: Summary
print_header "导出完成"

echo -e "${GREEN}镜像已成功构建并导出！${NC}"
echo ""
echo -e "${YELLOW}导出文件信息:${NC}"
echo -e "  镜像名称: ${BLUE}$IMAGE_NAME:$IMAGE_TAG${NC}"
echo -e "  文件位置: ${BLUE}$FINAL_FILE${NC}"
echo -e "  文件大小: ${BLUE}$(du -h "$FINAL_FILE" | cut -f1)${NC}"
echo -e "  校验文件: ${BLUE}${FINAL_FILE}.sha256${NC}"
echo ""
echo -e "${YELLOW}下一步操作:${NC}"
echo -e "  1. 上传到云端服务器:"
echo -e "     ${BLUE}./scripts/upload-image.sh <server-ip>${NC}"
echo ""
echo -e "  2. 或手动传输:"
echo -e "     ${BLUE}scp $FINAL_FILE user@server:/tmp/${NC}"
echo -e "     ${BLUE}scp ${FINAL_FILE}.sha256 user@server:/tmp/${NC}"
echo ""
echo -e "  3. 在云端加载镜像:"
echo -e "     ${BLUE}ssh user@server './load-image.sh /tmp/$(basename $FINAL_FILE)'${NC}"
