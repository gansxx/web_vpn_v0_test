# 部署快速开始指南

本指南将帮助您快速部署 VPN Web 应用到新服务器（IP: 8.217.223.134）

## 📋 前置要求

- ✅ 服务器已升级（支持 Docker 部署）
- ✅ 服务器 IP: **8.217.223.134**
- ✅ 有 SSH 访问权限
- ✅ 有 GitHub 仓库管理员权限

## 🚀 快速部署流程

### 选项 A: 使用 GitHub Actions 自动部署（推荐）

#### 步骤 1: 配置 GitHub Secrets

访问仓库 **Settings → Secrets and variables → Actions**，添加以下 Secrets：

**必需配置**：
```yaml
SSH_HOST: 8.217.223.134           # 新服务器IP
SSH_PORT: 22                      # SSH端口
SSH_USERNAME: root                # SSH用户名
SSH_PRIVATE_KEY: [SSH私钥内容]    # 完整私钥

DOMAIN: your-domain.com           # 您的域名
EMAIL: admin@your-domain.com      # 管理员邮箱

NEXT_PUBLIC_API_BASE: https://selfgo.asia/api
```

**可选配置**（如使用 Registry 部署）：
```yaml
DOCKER_USERNAME: [Docker Hub用户名]
DOCKER_PASSWORD: [Docker Hub Token]
NEXT_PUBLIC_TURNSTILE_SITE_KEY: [Turnstile Key]
```

**详细配置指南**: [docs/GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)

#### 步骤 2: 准备服务器

在本地运行验证脚本：
```bash
# 验证服务器环境
./scripts/verify-server-setup.sh 8.217.223.134 root 22

# 如果验证通过，服务器已准备就绪
```

SSH 到服务器，创建项目目录：
```bash
ssh root@8.217.223.134

# 安装 Git（如果未安装）
apt update && apt install -y git

# 克隆项目
mkdir -p /root/self_code
cd /root/self_code
git clone https://github.com/YOUR_USERNAME/web_vpn_v0_test.git
cd web_vpn_v0_test

# 切换到 docker 分支
git checkout docker

# 配置环境变量
cp .env.docker .env.docker.local
nano .env.docker.local  # 编辑配置
```

#### 步骤 3: 触发自动部署

**方法 1**: 推送代码触发
```bash
# 在本地
git add .
git commit -m "feat: deploy to production"
git push origin docker  # 推送到 docker 分支

# 或推送到 main 分支（如果配置了）
git push origin main
```

**方法 2**: 手动触发
1. 访问 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择 **Deploy to Production (Registry)** 或 **Deploy to Production (SSH Direct)**
4. 点击 **Run workflow**
5. 选择分支并点击 **Run workflow**

#### 步骤 4: 监控部署

1. 在 **Actions** 页面查看工作流状态
2. 点击正在运行的工作流查看实时日志
3. 等待所有步骤完成（绿色对勾）

#### 步骤 5: 验证部署

```bash
# SSH 到服务器
ssh root@8.217.223.134

# 检查容器状态
cd /root/self_code/web_vpn_v0_test
docker-compose ps

# 查看应用日志
docker-compose logs -f nextjs

# 测试应用
curl http://localhost:3000
curl https://your-domain.com
```

---

### 选项 B: 手动部署

#### 步骤 1: 准备服务器

```bash
# SSH 到服务器
ssh root@8.217.223.134

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo apt update
sudo apt install -y docker-compose-plugin

# 验证安装
docker --version
docker compose version
```

#### 步骤 2: 部署项目

```bash
# 克隆项目
mkdir -p /root/self_code
cd /root/self_code
git clone https://github.com/YOUR_USERNAME/web_vpn_v0_test.git
cd web_vpn_v0_test
git checkout docker

# 配置环境
cp .env.docker .env.docker.local
nano .env.docker.local

# 必须修改的配置:
# DOMAIN=your-actual-domain.com
# EMAIL=admin@your-domain.com
# NEXT_PUBLIC_API_BASE=https://selfgo.asia/api
```

#### 步骤 3: 构建和启动

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps
docker-compose logs -f
```

#### 步骤 4: 配置 SSL 证书

```bash
# 初始化 SSL 证书（首次部署）
chmod +x certbot/init-letsencrypt.sh
DOMAIN=your-domain.com EMAIL=admin@your-domain.com ./certbot/init-letsencrypt.sh

# 或使用测试模式（推荐先测试）
DOMAIN=your-domain.com EMAIL=admin@your-domain.com STAGING=1 ./certbot/init-letsencrypt.sh
```

---

## 🔍 验证部署

### 检查服务状态

```bash
# 检查容器运行状态
docker-compose ps

# 应该看到 3 个容器运行：
# - vpn-nextjs (Next.js 应用)
# - vpn-nginx (Nginx 反向代理)
# - vpn-certbot (SSL 证书管理)
```

### 测试应用访问

```bash
# 测试本地访问
curl http://localhost:3000

# 测试域名访问（HTTP）
curl http://your-domain.com

# 测试 HTTPS（如果已配置 SSL）
curl https://your-domain.com

# 测试健康检查
curl http://localhost:3000/api/health
```

### 查看日志

```bash
# 查看所有日志
docker-compose logs

# 查看 Next.js 日志
docker-compose logs -f nextjs

# 查看 Nginx 日志
docker-compose logs -f nginx

# 查看最近 100 行日志
docker-compose logs --tail=100
```

---

## ⚙️ 常用管理命令

### 服务管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 重启特定服务
docker-compose restart nextjs

# 停止并删除容器
docker-compose down

# 停止并删除容器和卷
docker-compose down -v
```

### 更新部署

```bash
# 拉取最新代码
git pull origin docker

# 重新构建
docker-compose build --no-cache

# 重启服务（零停机）
docker-compose up -d --force-recreate --no-deps nextjs
```

### 查看资源使用

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h
docker system df

# 清理未使用资源
docker system prune -a
```

---

## 🐛 故障排查

### 问题 1: 容器无法启动

```bash
# 查看详细日志
docker-compose logs nextjs

# 检查配置
docker-compose config

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 问题 2: 端口冲突

```bash
# 检查端口占用
sudo lsof -i :80
sudo lsof -i :443

# 停止占用端口的服务
sudo systemctl stop nginx    # 如果有系统 Nginx
sudo systemctl stop apache2  # 如果有 Apache
```

### 问题 3: 内存不足

```bash
# 检查内存使用
free -h

# 检查 Docker 内存限制
docker stats

# 如果内存不足，考虑：
# 1. 减少并发数
# 2. 限制容器内存
# 3. 升级服务器配置
```

### 问题 4: SSL 证书问题

```bash
# 查看证书状态
docker-compose exec certbot certbot certificates

# 重新申请证书
docker-compose run --rm certbot certbot renew --force-renewal

# 检查域名 DNS
dig your-domain.com
nslookup your-domain.com

# 确认 DNS 指向正确IP
# A记录应该指向: 8.217.223.134
```

---

## 📚 更多资源

- **完整 Docker 部署文档**: [README.docker.md](../README.docker.md)
- **GitHub Secrets 配置**: [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
- **服务器验证脚本**: [scripts/verify-server-setup.sh](../scripts/verify-server-setup.sh)

---

## 📞 获取帮助

如果遇到问题：

1. **查看日志**: `docker-compose logs -f`
2. **运行验证脚本**: `./scripts/verify-server-setup.sh 8.217.223.134`
3. **查看完整文档**: [README.docker.md](../README.docker.md)
4. **提交 Issue**: 在 GitHub 仓库创建 Issue

---

## ✅ 部署检查清单

部署前确认：

- [ ] 服务器 IP 配置正确 (8.217.223.134)
- [ ] GitHub Secrets 已配置
- [ ] SSH 密钥可以访问服务器
- [ ] 域名 DNS 已指向服务器IP
- [ ] 服务器已安装 Docker 和 Docker Compose
- [ ] 项目已克隆到服务器
- [ ] 环境变量已正确配置

部署后验证：

- [ ] 容器正常运行 (`docker-compose ps`)
- [ ] HTTP 访问正常 (`curl http://localhost:3000`)
- [ ] HTTPS 访问正常 (`curl https://your-domain.com`)
- [ ] SSL 证书有效
- [ ] 日志无错误信息
- [ ] 健康检查通过

---

**最后更新**: 2025-10-03
**服务器 IP**: 8.217.223.134
