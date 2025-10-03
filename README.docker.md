# Docker 容器化部署文档

## 📋 目录

- [架构概览](#架构概览)
- [快速开始](#快速开始)
- [部署步骤](#部署步骤)
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
