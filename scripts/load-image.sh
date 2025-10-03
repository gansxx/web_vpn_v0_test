#!/bin/bash

# 在云端服务器上加载 Docker 镜像
# 此脚本应在云端服务器上执行

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Check arguments
if [ $# -lt 1 ]; then
    echo -e "${RED}错误: 缺少镜像文件路径${NC}"
    echo "用法: $0 <image-file>"
    echo "示例: $0 /tmp/docker-images/vpn-web-nextjs-latest.tar.gz"
    exit 1
fi

IMAGE_FILE="$1"

if [ ! -f "$IMAGE_FILE" ]; then
    echo -e "${RED}错误: 文件不存在: $IMAGE_FILE${NC}"
    exit 1
fi

print_header "加载 Docker 镜像"

echo -e "${YELLOW}镜像文件: $IMAGE_FILE${NC}"
echo -e "${YELLOW}文件大小: $(du -h "$IMAGE_FILE" | cut -f1)${NC}"

# Verify checksum if available
CHECKSUM_FILE="${IMAGE_FILE}.sha256"
if [ -f "$CHECKSUM_FILE" ]; then
    print_header "验证文件完整性"

    echo -e "${YELLOW}验证 SHA256 校验和...${NC}"
    COMPUTED_HASH=$(sha256sum "$IMAGE_FILE" | cut -d' ' -f1)
    EXPECTED_HASH=$(cat "$CHECKSUM_FILE" | cut -d' ' -f1)

    if [ "$COMPUTED_HASH" = "$EXPECTED_HASH" ]; then
        echo -e "${GREEN}✓ 校验和验证通过${NC}"
    else
        echo -e "${RED}✗ 校验和不匹配${NC}"
        echo -e "  期望: ${BLUE}$EXPECTED_HASH${NC}"
        echo -e "  实际: ${BLUE}$COMPUTED_HASH${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ 警告: 未找到校验文件，跳过验证${NC}"
fi

# Detect compression and decompress if needed
print_header "处理镜像文件"

TEMP_FILE=""

case "$IMAGE_FILE" in
    *.tar.gz)
        echo -e "${YELLOW}检测到 gzip 压缩，解压中...${NC}"
        TEMP_FILE="${IMAGE_FILE%.gz}"
        gunzip -c "$IMAGE_FILE" > "$TEMP_FILE"
        LOAD_FILE="$TEMP_FILE"
        ;;
    *.tar.zst)
        echo -e "${YELLOW}检测到 zstd 压缩，解压中...${NC}"
        if ! command -v zstd &> /dev/null; then
            echo -e "${RED}错误: zstd 未安装${NC}"
            echo "请安装: apt-get install zstd 或 yum install zstd"
            exit 1
        fi
        TEMP_FILE="${IMAGE_FILE%.zst}"
        zstd -d -c "$IMAGE_FILE" > "$TEMP_FILE"
        LOAD_FILE="$TEMP_FILE"
        ;;
    *.tar)
        echo -e "${YELLOW}未压缩的 tar 文件${NC}"
        LOAD_FILE="$IMAGE_FILE"
        ;;
    *)
        echo -e "${RED}错误: 不支持的文件格式${NC}"
        exit 1
        ;;
esac

# Load the image
print_header "加载镜像到 Docker"

echo -e "${YELLOW}加载镜像: $LOAD_FILE${NC}"
docker load -i "$LOAD_FILE"

echo -e "${GREEN}✓ 镜像加载完成${NC}"

# Clean up temporary file
if [ -n "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
    echo -e "${YELLOW}清理临时文件...${NC}"
    rm -f "$TEMP_FILE"
    echo -e "${GREEN}✓ 清理完成${NC}"
fi

# Show loaded images
print_header "加载的镜像"

docker images | head -n 1
docker images | grep vpn-web || docker images | grep nextjs || echo -e "${YELLOW}未找到 vpn-web 相关镜像${NC}"

# Summary
print_header "加载完成"

echo -e "${GREEN}Docker 镜像已成功加载！${NC}"
echo ""
echo -e "${YELLOW}下一步操作:${NC}"
echo -e "  1. 查看镜像:"
echo -e "     ${BLUE}docker images${NC}"
echo ""
echo -e "  2. 更新 docker-compose.yml 中的镜像名称 (如果需要)"
echo ""
echo -e "  3. 启动容器:"
echo -e "     ${BLUE}docker-compose up -d${NC}"
echo ""
echo -e "  4. 查看容器状态:"
echo -e "     ${BLUE}docker-compose ps${NC}"
echo ""
echo -e "${YELLOW}提示:${NC}"
echo -e "  - 如果要清理原镜像文件，请手动删除: ${BLUE}rm $IMAGE_FILE${NC}"
echo -e "  - 如果要清理校验文件，请手动删除: ${BLUE}rm $CHECKSUM_FILE${NC}"
