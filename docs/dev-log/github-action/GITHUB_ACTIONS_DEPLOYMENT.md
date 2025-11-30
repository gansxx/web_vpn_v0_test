# GitHub Actions 部署配置指南

本文档说明如何配置GitHub Actions进行自动化部署。

## 必需的GitHub Secrets

在仓库的 **Settings → Secrets and variables → Actions** 中配置以下secrets：

### Docker Registry认证
| Secret名称 | 说明 | 示例 |
|-----------|------|------|
| `DOCKER_USERNAME` | Docker Hub用户名 | `myusername` |
| `DOCKER_PASSWORD` | Docker Hub访问令牌 | `dckr_pat_xxxxx` |

**注意**: 建议使用Docker Hub的Personal Access Token而非密码。
创建方法: Docker Hub → Account Settings → Security → New Access Token

### SSH服务器访问
| Secret名称 | 说明 | 示例 |
|-----------|------|------|
| `SSH_HOST` | 服务器IP地址或域名 | `8.217.223.134` |
| `SSH_USERNAME` | SSH登录用户名 | `root` |
| `SSH_PORT` | SSH端口（可选） | `22` (默认) |
| `SSH_PRIVATE_KEY` | SSH私钥完整内容 | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |

**SSH私钥配置步骤：**
```bash
# 1. 在本地生成SSH密钥对（如果没有）
ssh-keygen -t ed25519 -C "github-actions-deploy"

# 2. 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# 3. 复制私钥内容到GitHub Secrets
cat ~/.ssh/id_ed25519  # 复制全部内容包括头尾
```

### 应用配置
| Secret名称 | 说明 | 示例 | 必需 |
|-----------|------|------|------|
| `NEXT_PUBLIC_API_BASE` | API基础URL | `https://selfgo.asia/api` | ✅ |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile站点密钥 | `0x4AAAA...` | ✅ |
| `PROJECT_DIR` | 服务器上项目目录路径 | `/opt/vpn-web` | ❌ (可选) |
| `DOMAIN` | 应用域名 (用于健康检查) | `superjiasu.top` | ✅ |

**PROJECT_DIR说明：**
- 如果不设置，默认使用 `/opt/vpn-web`
- 部署脚本会自动创建此目录（如果不存在）
- 脚本会自动生成基础的 `docker-compose.yml`（如果不存在）
- **重要**: 确保SSH用户对此目录有读写权限

## 部署方式选择

### 方式1: Registry部署 (推荐用于生产环境)
**Workflow**: `.github/workflows/deploy-registry.yml`

**触发条件：**
- 推送到 `main` 分支自动触发
- 推送 tag（如 `v1.0.0`）自动触发
- 手动触发

**流程：**
1. 构建Docker镜像
2. 推送到Docker Registry
3. SSH到服务器
4. 从Registry拉取镜像
5. 自动部署并健康检查

**优点：**
- ✅ 镜像版本化管理
- ✅ 支持多服务器部署
- ✅ 传输效率高（仅传输层差异）
- ✅ 便于回滚

### 方式2: SSH直传部署 (适合测试环境)
**Workflow**: `.github/workflows/deploy-ssh.yml`

**触发条件：**
- 仅支持手动触发

**流程：**
1. 构建Docker镜像
2. 导出为tar文件并压缩
3. 通过SSH直接传输到服务器
4. 在服务器上加载镜像
5. 重启服务

**优点：**
- ✅ 无需Docker Registry
- ✅ 适合内网或离线环境
- ✅ 支持多种压缩格式（gzip/zstd/none）

## Secrets清理机制

GitHub Actions会自动清理所有SSH相关secrets的前导/尾随空格，防止以下错误：
```
hostname contains invalid characters
scp: Connection closed
```

**调试信息：**
部署日志会显示：
```
========== Secrets Validation ==========
SSH_HOST length: 14
SSH_HOST (first 3 chars): 8.2***
SSH_USERNAME length: 4
SSH_USERNAME (first char): r***
SSH_PORT: 22
✓ Secrets validated and cleaned
```

## 项目目录自动配置

部署脚本会自动处理项目目录配置：

1. **目录不存在** → 自动创建
2. **docker-compose.yml不存在** → 自动创建基础配置
3. **首次部署** → 自动初始化环境

**自动生成的docker-compose.yml：**
```yaml
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
```

**如需自定义配置：**
1. 在服务器上创建项目目录：`mkdir -p /opt/vpn-web`
2. 创建自定义的 `docker-compose.yml`
3. 添加 `.env.docker.local` 配置环境变量
4. 首次部署前确保Docker网络存在：`docker network create vpn-network`

## 健康检查

部署后会自动执行健康检查：
- 检查端点: `https://$DOMAIN/api/health`
- 重试次数: 5次
- 重试间隔: 5秒
- 失败处理: 自动回滚到备份版本

## 常见问题

### 1. SSH连接失败
**错误**: `Permission denied (publickey)`

**解决**:
```bash
# 确认SSH密钥已添加到服务器
cat ~/.ssh/id_ed25519.pub | ssh user@server "cat >> ~/.ssh/authorized_keys"

# 测试SSH连接
ssh -i ~/.ssh/id_ed25519 user@server
```

### 2. Docker登录失败
**错误**: `Username and password required`

**解决**:
- 确认 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD` secrets已配置
- 使用Personal Access Token而非密码
- 检查token权限包含 `Read & Write`

### 3. 项目目录权限问题
**错误**: `Permission denied` when creating PROJECT_DIR

**解决**:
```bash
# 方案1: 使用root用户SSH登录（不推荐）

# 方案2: 预先创建目录并授权
sudo mkdir -p /opt/vpn-web
sudo chown $USER:$USER /opt/vpn-web

# 方案3: 在GitHub Secrets中设置用户有权限的目录
# PROJECT_DIR = /home/username/vpn-web
```

### 4. 健康检查失败
**错误**: `Health check failed after 5 attempts`

**可能原因**:
- 应用启动时间过长（需要调整等待时间）
- 端口映射错误
- 环境变量配置错误
- `/api/health` 端点不存在

**调试**:
```bash
# SSH到服务器检查
ssh user@server

# 查看容器日志
cd /opt/vpn-web  # 或你的PROJECT_DIR
docker-compose logs -f nextjs

# 测试健康检查端点
docker-compose exec nextjs wget -O- http://localhost:3000/api/health
```

## 环境变量传递

GitHub Actions → Docker Build Args → Container Runtime:

```
GitHub Secrets
  ↓
.github/workflows/*.yml (build-args)
  ↓
Dockerfile (ARG NEXT_PUBLIC_*)
  ↓
.env.production (ENV)
  ↓
Next.js Runtime (process.env.NEXT_PUBLIC_*)
```

**验证环境变量：**
```bash
# 进入容器检查
docker exec vpn-web-nextjs env | grep NEXT_PUBLIC

# 查看构建时参数
docker inspect vpn-web-nextjs | jq '.[0].Config.Env'
```

## 手动部署

如需手动触发部署：

1. 进入仓库 **Actions** 页面
2. 选择对应的workflow：
   - `Deploy to Production (Registry)` - Registry部署
   - `Deploy to Production (SSH Direct)` - SSH直传部署
3. 点击 **Run workflow**
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow** 确认

## 监控和日志

**查看部署日志：**
- GitHub仓库 → Actions → 选择workflow run → 查看详细步骤

**服务器端日志：**
```bash
# 应用日志
docker-compose logs -f nextjs

# 系统日志
journalctl -u docker -f
```

## 安全建议

1. ✅ 使用SSH密钥认证，禁用密码登录
2. ✅ 定期轮换Docker Hub Access Token
3. ✅ 使用最小权限原则（避免使用root用户）
4. ✅ 在生产环境设置：
   - `NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE=false`
   - `NEXT_PUBLIC_DISABLE_TURNSTILE=false`
   - `NEXT_PUBLIC_DEV_MODE_ENABLED=false`
5. ✅ 定期备份和更新服务器
6. ✅ 配置防火墙仅开放必要端口
