# Docker 容器化部署文档

## 📋 目录

- [架构概览](#架构概览)
- [快速开始](#快速开始)
- [部署步骤](#部署步骤)
- [镜像传输方案](#镜像传输方案)
- [配置说明](#配置说明)
- [运维管理](#运维管理)
- [故障排查](#故障排查)

## 🏗️ 架构概览

本项目采用多容器 Docker 架构，包含以下组件:

```
┌─────────────────────────────────────────┐
│          Nginx (反向代理)               │
│  - SSL/TLS 终止                         │
│  - 静态资源缓存                          │
│  - 速率限制                              │
│  - 安全头部                              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Next.js 应用 (Standalone)         │
│  - React 19                             │
│  - TypeScript                           │
│  - 生产优化构建                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Certbot (SSL 证书管理)             │
│  - Let's Encrypt 自动申请               │
│  - 证书自动续期 (每12小时检查)          │
└─────────────────────────────────────────┘
```

### 容器说明

| 容器 | 镜像 | 端口 | 说明 |
|-----|------|------|------|
| vpn-nextjs | node:20-alpine | 3000 | Next.js 应用服务 |
| vpn-nginx | nginx:alpine | 80, 443 | 反向代理和 SSL 终止 |
| vpn-certbot | certbot/certbot | - | SSL 证书管理 |

### 数据卷

| 卷名 | 用途 |
|-----|------|
| vpn-certbot-certs | SSL 证书存储 |
| vpn-certbot-www | ACME challenge 文件 |
| vpn-nginx-logs | Nginx 日志 |

## 🚀 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 1.29+
- 域名并已配置 DNS A 记录指向服务器

### 1. 配置环境变量

```bash
# 复制环境配置模板
cp .env.docker .env.docker.local

# 编辑配置文件，设置你的域名和邮箱
nano .env.docker.local
```

必须修改的配置:
```bash
# 你的域名 (必填)
DOMAIN=your-actual-domain.com

# 管理员邮箱 (必填)
EMAIL=admin@your-actual-domain.com

# API 后端地址
NEXT_PUBLIC_API_BASE=https://selfgo.asia/api

# Turnstile Site Key (如果使用 Cloudflare Turnstile)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
```

### 2. 构建并启动服务

```bash
# 使用部署脚本
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

或者手动执行:
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 3. 初始化 SSL 证书

```bash
# 首次部署需要初始化 SSL 证书
chmod +x certbot/init-letsencrypt.sh
DOMAIN=your-domain.com EMAIL=admin@your-domain.com ./certbot/init-letsencrypt.sh
```

**注意**: 首次运行建议使用 Let's Encrypt 测试服务器:
```bash
DOMAIN=your-domain.com EMAIL=admin@your-domain.com STAGING=1 ./certbot/init-letsencrypt.sh
```

### 4. 验证部署

访问你的域名:
- HTTP: http://your-domain.com (会自动跳转到 HTTPS)
- HTTPS: https://your-domain.com

检查服务状态:
```bash
docker-compose ps
```

## 📝 部署步骤

### 完整部署流程

#### 步骤 1: 准备服务器

```bash
# 安装 Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 步骤 2: 克隆项目

```bash
git clone <your-repo-url>
cd web_vpn_v0_test
```

#### 步骤 3: 配置环境

```bash
# 复制并编辑环境配置
cp .env.docker .env.docker.local
nano .env.docker.local

# 必须修改:
# - DOMAIN: 你的域名
# - EMAIL: 管理员邮箱
# - NEXT_PUBLIC_API_BASE: API 后端地址
# - NEXT_PUBLIC_TURNSTILE_SITE_KEY: Turnstile 密钥 (可选)
```

#### 步骤 4: 部署应用

```bash
# 方式 1: 使用部署脚本 (推荐)
./scripts/deploy.sh

# 方式 2: 手动部署
docker-compose build --no-cache
docker-compose up -d
```

#### 步骤 5: 初始化 SSL

```bash
# 测试环境 (推荐先测试)
DOMAIN=your-domain.com EMAIL=admin@your-domain.com STAGING=1 ./certbot/init-letsencrypt.sh

# 生产环境 (测试成功后)
DOMAIN=your-domain.com EMAIL=admin@your-domain.com ./certbot/init-letsencrypt.sh
```

#### 步骤 6: 验证部署

```bash
# 检查容器状态
docker-compose ps

# 查看应用日志
docker-compose logs -f nextjs

# 查看 Nginx 日志
docker-compose logs -f nginx

# 测试 HTTPS
curl -I https://your-domain.com
```

## 🚢 镜像传输方案

### 方案对比

| 方案 | 适用场景 | 优点 | 缺点 |
|-----|---------|------|------|
| docker save/load | 单服务器、网络受限 | 简单直接、离线可用 | 传输慢、不支持增量 |
| 私有 Registry | 多服务器、团队协作 | 支持版本管理、增量传输 | 需要部署 Registry |
| 公共 Registry | 开源项目、公开部署 | 最方便、全球 CDN | 可能有安全考虑 |

### 方案 A: docker save/load (推荐)

适合: **单服务器部署、网络受限环境、快速测试**

#### 完整流程

```bash
# ========================================
# 本地操作
# ========================================

# Step 1: 构建并导出镜像
./scripts/build-and-export.sh

# 输出文件: ./docker-images/vpn-web-nextjs-latest.tar.gz
# 文件大小: 约 300-500MB (压缩后)

# Step 2: 上传到云端服务器
./scripts/upload-image.sh root@your-server-ip

# 或指定端口
./scripts/upload-image.sh root@your-server-ip 2222

# ========================================
# 云端服务器操作
# ========================================

# Step 3: 加载镜像
bash /tmp/load-image.sh /tmp/docker-images/vpn-web-nextjs-latest.tar.gz

# Step 4: 验证镜像
docker images

# Step 5: 更新 docker-compose.yml (如果需要)
# 将服务镜像改为: vpn-web-nextjs:latest

# Step 6: 启动容器
docker-compose up -d
```

#### 一键自动化脚本

```bash
# 本地构建 + 上传 + 远程加载 (一键完成)
./scripts/build-and-export.sh && \
./scripts/upload-image.sh root@your-server && \
./scripts/remote-load.sh root@your-server
```

#### 自定义配置

```bash
# 使用不同的压缩工具
COMPRESSION_TOOL=zstd ./scripts/build-and-export.sh    # zstd (更高压缩率)
COMPRESSION_TOOL=gzip ./scripts/build-and-export.sh     # gzip (默认)
COMPRESSION_TOOL=none ./scripts/build-and-export.sh     # 不压缩

# 指定镜像名称和标签
IMAGE_NAME=my-vpn IMAGE_TAG=v1.0 ./scripts/build-and-export.sh

# 自定义输出目录
OUTPUT_DIR=/tmp/images ./scripts/build-and-export.sh
```

### 方案 B: 私有 Docker Registry

适合: **多服务器部署、团队协作、CI/CD 集成**

#### 部署私有 Registry

```bash
# 在云端服务器上部署 Registry
docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  -v /data/registry:/var/lib/registry \
  registry:2

# 或使用 docker-compose (带认证)
cat > registry-compose.yml <<'EOF'
version: '3'
services:
  registry:
    image: registry:2
    ports:
      - "5000:5000"
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
    volumes:
      - ./registry-data:/var/lib/registry
      - ./auth:/auth
    restart: always
EOF

# 创建认证文件
mkdir auth
docker run --rm --entrypoint htpasswd httpd:2 -Bbn admin password123 > auth/htpasswd

# 启动 Registry
docker-compose -f registry-compose.yml up -d
```

#### 使用私有 Registry

```bash
# ========================================
# 本地操作
# ========================================

# Step 1: 构建镜像
docker build -t vpn-web-nextjs:latest .

# Step 2: 标记镜像
docker tag vpn-web-nextjs:latest your-registry.com:5000/vpn-web-nextjs:latest

# Step 3: 推送到私有仓库
docker login your-registry.com:5000
docker push your-registry.com:5000/vpn-web-nextjs:latest

# ========================================
# 云端服务器操作
# ========================================

# Step 4: 拉取镜像
docker login your-registry.com:5000
docker pull your-registry.com:5000/vpn-web-nextjs:latest

# Step 5: 更新 docker-compose.yml
# 将镜像改为: your-registry.com:5000/vpn-web-nextjs:latest

# Step 6: 启动容器
docker-compose up -d
```

#### 配置 docker-compose.yml 使用私有仓库

```yaml
services:
  nextjs:
    image: your-registry.com:5000/vpn-web-nextjs:latest
    # 移除 build 配置
    # build:
    #   context: .
    #   dockerfile: Dockerfile
```

### 方案 C: 公共 Docker Registry

适合: **开源项目、公开部署、需要全球访问**

#### Docker Hub

```bash
# ========================================
# 本地操作
# ========================================

# Step 1: 登录 Docker Hub
docker login

# Step 2: 构建并标记镜像
docker build -t your-username/vpn-web-nextjs:latest .

# Step 3: 推送镜像
docker push your-username/vpn-web-nextjs:latest

# ========================================
# 云端服务器操作
# ========================================

# Step 4: 拉取镜像
docker pull your-username/vpn-web-nextjs:latest

# Step 5: 启动容器
docker-compose up -d
```

#### 阿里云容器镜像服务

```bash
# Step 1: 登录阿里云 Registry
docker login --username=your-aliyun-account registry.cn-hangzhou.aliyuncs.com

# Step 2: 标记镜像
docker tag vpn-web-nextjs:latest \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/vpn-web-nextjs:latest

# Step 3: 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/vpn-web-nextjs:latest

# Step 4: 云端拉取
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/vpn-web-nextjs:latest
```

### 性能优化技巧

#### 1. 使用断点续传

```bash
# rsync 支持断点续传
rsync -avz --progress \
  -e "ssh -p 22" \
  ./docker-images/vpn-web-nextjs-latest.tar.gz \
  root@your-server:/tmp/
```

#### 2. 压缩优化

```bash
# zstd 提供更好的压缩率和速度
# 安装 zstd
apt-get install zstd  # Debian/Ubuntu
yum install zstd      # CentOS/RHEL

# 使用 zstd 压缩
docker save vpn-web-nextjs:latest | zstd -o vpn-web-nextjs.tar.zst

# 传输后解压并加载
zstd -d vpn-web-nextjs.tar.zst -c | docker load
```

#### 3. 并行传输

```bash
# 使用 pigz 多线程压缩
docker save vpn-web-nextjs:latest | pigz -9 > vpn-web-nextjs.tar.gz

# 使用 pv 显示进度
docker save vpn-web-nextjs:latest | pv | gzip > vpn-web-nextjs.tar.gz
```

#### 4. 网络优化

```bash
# 使用 scp 压缩传输
scp -C vpn-web-nextjs.tar.gz root@your-server:/tmp/

# 限制带宽 (避免占满带宽)
rsync --bwlimit=10000 -avz image.tar.gz root@server:/tmp/
```

### 镜像瘦身技巧

#### 1. 多阶段构建优化

已在 Dockerfile 中实现:
- 依赖安装层 (缓存优化)
- 构建层 (仅保留构建产物)
- 运行时层 (最小化镜像)

#### 2. 移除开发依赖

```bash
# package.json 中分离生产和开发依赖
# 构建时使用 npm ci --production
```

#### 3. 使用 .dockerignore

已配置忽略:
- node_modules
- .git
- 文档文件
- 测试文件

#### 4. 查看镜像层

```bash
# 分析镜像大小
docker history vpn-web-nextjs:latest

# 使用 dive 工具深度分析
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive:latest vpn-web-nextjs:latest
```

### 传输时间估算

| 镜像大小 | 10Mbps | 50Mbps | 100Mbps | 1Gbps |
|---------|--------|--------|---------|-------|
| 300MB   | 4 分钟  | 48 秒   | 24 秒    | 2.4 秒 |
| 500MB   | 6.7 分钟| 80 秒   | 40 秒    | 4 秒   |
| 1GB     | 13 分钟 | 2.7 分钟| 1.3 分钟 | 8 秒   |

**提示**: 实际传输时间还需考虑压缩、解压时间和网络延迟。

### 故障排查

#### 镜像损坏

```bash
# 验证 SHA256 校验和
sha256sum -c vpn-web-nextjs-latest.tar.gz.sha256

# 如果校验失败，重新下载
```

#### 空间不足

```bash
# 检查磁盘空间
df -h

# 清理 Docker 缓存
docker system prune -a

# 删除旧镜像
docker image prune -a
```

#### 加载失败

```bash
# 查看 Docker 日志
journalctl -u docker.service

# 尝试手动解压并加载
gunzip -c image.tar.gz | docker load -
```

## ⚙️ 配置说明

### 环境变量详解

#### 应用配置 (.env.docker)

```bash
# API 后端地址 (必填)
NEXT_PUBLIC_API_BASE=https://selfgo.asia/api

# Cloudflare Turnstile 配置 (可选)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key

# 开发模式 (生产环境应设为 false)
NEXT_PUBLIC_DEV_MODE_ENABLED=false
NEXT_PUBLIC_DISABLE_TURNSTILE=false
NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE=false

# 域名配置 (必填)
DOMAIN=your-domain.com
EMAIL=admin@your-domain.com

# Let's Encrypt 配置
STAGING=0  # 0=生产, 1=测试
```

### Nginx 配置

#### 修改速率限制

编辑 `nginx/conf.d/default.conf`:

```nginx
# API 速率限制
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# 一般请求限制
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=50r/s;
```

#### 修改域名

初始化脚本会自动替换域名，也可以手动修改:

```bash
# 替换所有配置文件中的域名
sed -i 's/your-domain.com/actual-domain.com/g' nginx/conf.d/default.conf
sed -i 's/your-domain.com/actual-domain.com/g' nginx/ssl-params.conf
```

### Docker Compose 配置

#### 调整资源限制

编辑 `docker-compose.yml`:

```yaml
services:
  nextjs:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

#### 修改端口映射

```yaml
services:
  nginx:
    ports:
      - "80:80"      # HTTP
      - "443:443"    # HTTPS
      # - "8080:80"  # 自定义端口映射
```

## 🔧 运维管理

### 日常管理命令

```bash
# 查看服务状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f nextjs
docker-compose logs -f nginx

# 重启服务
docker-compose restart

# 重启特定服务
docker-compose restart nextjs

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 停止并删除容器和卷
docker-compose down -v
```

### 更新部署

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建镜像
docker-compose build --no-cache

# 3. 重启服务 (零停机)
docker-compose up -d --force-recreate --no-deps nextjs

# 4. 验证更新
docker-compose logs -f nextjs
```

### 数据备份

```bash
# 使用备份脚本
./scripts/backup.sh

# 备份文件位置: ./backups/vpn-web-backup-TIMESTAMP.tar.gz
```

备份内容包括:
- SSL 证书
- Nginx 日志
- 配置文件

### 恢复备份

```bash
# 1. 解压备份
tar xzf vpn-web-backup-TIMESTAMP.tar.gz
cd vpn-web-backup-TIMESTAMP

# 2. 查看恢复说明
cat manifest.txt

# 3. 恢复证书
docker run --rm -v vpn-certbot-certs:/certs -v $PWD:/backup alpine \
  tar xzf /backup/certificates.tar.gz -C /certs

# 4. 恢复日志
docker run --rm -v vpn-nginx-logs:/logs -v $PWD:/backup alpine \
  tar xzf /backup/nginx-logs.tar.gz -C /logs

# 5. 重启服务
docker-compose restart
```

### 证书管理

```bash
# 手动续期证书
./certbot/renew-certs.sh

# 查看证书信息
docker-compose exec certbot certbot certificates

# 强制更新证书
docker-compose run --rm certbot certbot renew --force-renewal

# 自动续期 (已配置，每12小时检查)
# 查看 certbot 容器日志
docker-compose logs certbot
```

### 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看 Nginx 访问统计
docker-compose exec nginx tail -f /var/log/nginx/access.log

# 查看错误日志
docker-compose exec nginx tail -f /var/log/nginx/error.log

# 容器健康检查
docker-compose ps
```

## 🔍 故障排查

### 常见问题

#### 1. 容器无法启动

```bash
# 查看容器日志
docker-compose logs nextjs

# 检查配置语法
docker-compose config

# 检查端口占用
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

#### 2. SSL 证书问题

```bash
# 查看证书状态
docker-compose exec certbot certbot certificates

# 测试证书申请 (使用 staging)
STAGING=1 ./certbot/init-letsencrypt.sh

# 检查域名 DNS
dig your-domain.com
nslookup your-domain.com

# 查看 Nginx 配置
docker-compose exec nginx nginx -T
```

#### 3. Nginx 配置错误

```bash
# 测试配置语法
docker-compose exec nginx nginx -t

# 重新加载配置
docker-compose exec nginx nginx -s reload

# 查看错误日志
docker-compose exec nginx cat /var/log/nginx/error.log
```

#### 4. Next.js 应用错误

```bash
# 查看应用日志
docker-compose logs -f nextjs

# 进入容器调试
docker-compose exec nextjs sh

# 检查环境变量
docker-compose exec nextjs env | grep NEXT_PUBLIC

# 重新构建
docker-compose build --no-cache nextjs
docker-compose up -d --force-recreate nextjs
```

#### 5. 端口冲突

```bash
# 检查端口占用
sudo lsof -i :80
sudo lsof -i :443

# 停止占用端口的服务
sudo systemctl stop apache2  # 如果有 Apache
sudo systemctl stop nginx    # 如果有系统 Nginx

# 或修改 docker-compose.yml 端口映射
```

### 调试模式

```bash
# 启用开发模式 (仅用于调试)
# 编辑 .env.docker:
NEXT_PUBLIC_DEV_MODE_ENABLED=true
NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE=true

# 重新构建并启动
docker-compose up -d --build

# 调试完成后务必关闭
NEXT_PUBLIC_DEV_MODE_ENABLED=false
NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE=false
```

### 日志收集

```bash
# 收集所有日志用于分析
docker-compose logs > debug.log

# 收集特定时间段日志
docker-compose logs --since 30m > recent.log

# 收集错误日志
docker-compose logs 2>&1 | grep -i error > errors.log
```

### 性能问题排查

```bash
# 查看容器资源使用
docker stats vpn-nextjs vpn-nginx

# 分析 Nginx 访问日志
docker-compose exec nginx tail -1000 /var/log/nginx/access.log | \
  awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 查看慢请求
docker-compose exec nginx grep "request_time" /var/log/nginx/access.log
```

## 📚 进阶配置

### 启用 HTTP/2

已默认启用，配置在 `nginx/conf.d/default.conf`:
```nginx
listen 443 ssl http2;
```

### 配置 CDN

如果使用 Cloudflare 等 CDN:

1. 在 CDN 配置 SSL/TLS 为 "Full (strict)"
2. 设置 Nginx 获取真实 IP:

```nginx
# 在 nginx/conf.d/default.conf 添加
set_real_ip_from 173.245.48.0/20;  # Cloudflare IP 范围
real_ip_header CF-Connecting-IP;
```

### 配置缓存策略

编辑 `nginx/conf.d/default.conf`:

```nginx
# 增加静态文件缓存时间
location /_next/static {
    proxy_pass http://nextjs_backend;
    proxy_cache_valid 200 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 配置日志轮转

创建 `nginx/logrotate.conf`:

```
/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nginx nginx
    sharedscripts
}
```

## 🚀 GitHub Actions CI/CD 自动部署

### CI/CD 架构

```
GitHub Push → Actions 构建 → 推送 Registry → SSH 部署 → 健康检查
```

### 部署方案对比

| 方案 | 触发方式 | 适用场景 | 优点 | 缺点 |
|-----|---------|---------|------|------|
| **Registry 部署** | push to main | 生产环境 | 标准流程、支持回滚 | 需要 Registry |
| **SSH 直接部署** | 手动触发 | 无 Registry 环境 | 无需 Registry | 传输慢 |
| **构建测试** | PR/push | 开发测试 | 自动验证 | 仅测试不部署 |

### 配置步骤

#### 1. 配置 GitHub Secrets

在仓库 Settings → Secrets and variables → Actions 中添加:

**Registry 凭证** (方案 A 必需):
```
DOCKER_USERNAME    - Docker Hub 用户名
DOCKER_PASSWORD    - Docker Hub 密码或 Token
```

**服务器访问** (必需):
```
SSH_HOST          - 服务器 IP 或域名
SSH_PORT          - SSH 端口 (默认 22)
SSH_USERNAME      - SSH 用户名 (如 root)
SSH_PRIVATE_KEY   - SSH 私钥 (完整内容)
```

**应用环境变量** (必需):
```
NEXT_PUBLIC_API_BASE              - API 后端地址
NEXT_PUBLIC_TURNSTILE_SITE_KEY   - Cloudflare Turnstile Key
DOMAIN                            - 域名 (如 superjiasu.top)
EMAIL                             - 管理员邮箱
```

#### 2. 生成 SSH 密钥对

```bash
# 在本地生成密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server

# 复制私钥内容到 GitHub Secrets
cat ~/.ssh/github_actions_key
# 完整复制输出内容到 SSH_PRIVATE_KEY
```

#### 3. 选择部署方式

##### 方案 A: Registry 自动部署 (推荐)

**优势**:
- ✅ 自动化程度高
- ✅ 支持版本管理和回滚
- ✅ 适合多服务器部署
- ✅ 镜像可复用

**配置**:

1. 修改服务器 `.env.docker`:
```bash
# 使用 Docker Hub 示例
DOCKER_REGISTRY=docker.io
DOCKER_USERNAME=your-username
IMAGE_TAG=latest
```

2. 服务器上使用生产配置:
```bash
cd /root/self_code/web_vpn_v0_test

# 使用生产配置启动
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. 推送代码触发部署:
```bash
git add .
git commit -m "feat: update feature"
git push origin main  # 自动触发部署
```

**工作流程**:
1. GitHub Actions 检测到 main 分支推送
2. 构建 Docker 镜像 (使用 pnpm)
3. 推送镜像到 Docker Hub
4. SSH 到服务器
5. 执行 `deploy-from-registry.sh` 脚本
6. 拉取最新镜像并重启服务
7. 健康检查验证部署

##### 方案 B: SSH 直接部署

**优势**:
- ✅ 无需 Registry
- ✅ 完全控制

**使用**:
```bash
# 在 GitHub Actions 页面手动触发
Actions → Deploy to Production (SSH Direct) → Run workflow
```

选择压缩方式:
- `gzip` - 标准压缩 (推荐)
- `zstd` - 高压缩率
- `none` - 无压缩 (最快)

#### 4. Registry 选择建议

##### Docker Hub (推荐国际项目)

```bash
# 注册 Docker Hub: https://hub.docker.com
# 创建 Access Token: Account Settings → Security → New Access Token

# GitHub Secrets 配置:
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=dckr_pat_xxxxxxxxxxxxx
```

**免费额度**: 无限公开镜像、1 个私有仓库

##### 阿里云容器镜像 (推荐国内项目)

```bash
# 注册阿里云: https://cr.console.aliyun.com
# 创建命名空间和仓库

# 修改 .github/workflows/deploy-registry.yml:
env:
  REGISTRY: registry.cn-hangzhou.aliyuncs.com
  IMAGE_NAME: your-namespace/vpn-web-nextjs

# GitHub Secrets 配置:
DOCKER_USERNAME=your-aliyun-account
DOCKER_PASSWORD=your-aliyun-password
```

**优势**: 国内访问快、免费个人版

### 工作流说明

#### deploy-registry.yml
- **触发**: push to main, tags (v*), 手动
- **作业**:
  1. `build-and-push` - 构建并推送镜像
  2. `deploy` - 部署到服务器
  3. `notify` - 通知部署状态

#### deploy-ssh.yml
- **触发**: 手动
- **作业**: 构建 → 传输 → 加载 → 部署

#### build-test.yml
- **触发**: PR, push to develop
- **作业**:
  1. `test-build` - Docker 构建测试
  2. `lint` - 代码检查
  3. `summary` - 结果汇总

### 部署管理

#### 查看部署状态

```bash
# GitHub Actions 页面
https://github.com/your-username/your-repo/actions

# 服务器上查看容器
ssh user@server
docker-compose ps
docker-compose logs -f nextjs
```

#### 手动触发部署

```bash
# 在 GitHub Actions 页面
Actions → Deploy to Production (Registry) → Run workflow
```

#### 回滚到上一版本

```bash
# SSH 到服务器
ssh user@server
cd /root/self_code/web_vpn_v0_test

# 查看备份镜像
docker images | grep backup

# 回滚
docker tag vpn-web-nextjs:backup-20241003-120000 vpn-web-nextjs:latest
docker-compose restart nextjs
```

#### 查看部署历史

```bash
# GitHub Actions 历史记录
Actions → All workflows → 选择工作流

# 服务器上查看镜像历史
docker images vpn-web-nextjs
```

### 高级配置

#### 多环境部署

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches:
      - develop

env:
  IMAGE_NAME: vpn-web-nextjs:staging
```

#### 通知集成

在 `deploy-registry.yml` 的 `notify` 作业中添加:

```yaml
# Slack 通知
- name: Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}

# 企业微信通知
- name: WeChat Work notification
  run: |
    curl -X POST ${{ secrets.WECHAT_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{"msgtype":"text","text":{"content":"部署成功"}}'
```

#### 自动打标签

```bash
# 创建版本标签触发发布
git tag v1.0.0
git push origin v1.0.0

# 自动构建 vpn-web-nextjs:v1.0.0 和 vpn-web-nextjs:latest
```

### 故障排查

#### Actions 构建失败

```bash
# 查看 Actions 日志
GitHub → Actions → 失败的工作流 → 查看详细日志

# 常见问题:
1. pnpm 版本不兼容 → 检查 Dockerfile
2. 环境变量未配置 → 检查 GitHub Secrets
3. 权限不足 → 检查 SSH 密钥
```

#### 部署失败

```bash
# SSH 到服务器查看
ssh user@server
cd /root/self_code/web_vpn_v0_test

# 查看容器日志
docker-compose logs nextjs

# 查看部署脚本日志
cat /tmp/deploy-from-registry.log
```

#### 健康检查失败

```bash
# 服务器上手动测试
curl http://localhost:3000/api/health

# 如果失败,查看容器状态
docker-compose ps
docker-compose exec nextjs wget -O- http://localhost:3000/api/health
```

### 性能优化

#### 构建缓存

GitHub Actions 已配置:
```yaml
cache-from: type=registry,ref=$IMAGE:buildcache
cache-to: type=registry,ref=$IMAGE:buildcache,mode=max
```

**效果**: 二次构建提速 50-70%

#### 并行构建

```yaml
# 多平台构建 (可选)
platforms: linux/amd64,linux/arm64
```

## 🔒 安全加固

### 1. 配置防火墙

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 限制 Docker 远程访问

确保 Docker daemon 不暴露在公网:
```bash
# 检查 Docker 监听
sudo netstat -tulpn | grep dockerd
```

### 3. 定期更新

```bash
# 更新基础镜像
docker-compose pull
docker-compose up -d --force-recreate

# 更新系统
sudo apt update && sudo apt upgrade -y
```

### 4. 配置自动备份

添加到 crontab:
```bash
# 每天凌晨 3 点备份
0 3 * * * /path/to/web_vpn_v0_test/scripts/backup.sh
```

## 📞 支持

如遇问题，请:
1. 查看 [故障排查](#故障排查) 章节
2. 收集相关日志: `docker-compose logs > debug.log`
3. 检查 GitHub Issues 或提交新 Issue
4. 联系技术支持

## 📄 许可证

请参考项目根目录的 LICENSE 文件
