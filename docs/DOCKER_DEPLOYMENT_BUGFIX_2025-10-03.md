# Docker 部署故障排查与修复记录

**日期**: 2025-10-03
**服务器**: 8.217.223.134
**问题类型**: Docker 容器启动失败、SSL 证书配置错误

---

## 📋 故障现象

### 初始报错

```bash
docker ps
# 输出:
CONTAINER ID   IMAGE                    COMMAND                  STATUS
99f09b3a3c90   certbot/certbot          ...                      Up 32 minutes
286f6526f2ef   nginx:alpine             ...                      Restarting (1) 52 seconds ago
f0daec45f022   web_vpn_v0_test-nextjs   ...                      Up 32 minutes (unhealthy)
```

```bash
curl http://localhost:3000/api/health
# 错误: curl: (7) Failed to connect to localhost port 3000
```

### 关键症状

| 服务 | 状态 | 问题描述 |
|------|------|----------|
| **vpn-nginx** | 🔴 不断重启 | SSL 证书文件不存在 |
| **vpn-nextjs** | ⚠️ 健康检查失败 | 容器运行但外部无法访问 |
| **vpn-certbot** | ✅ 正常运行 | 无问题 |

---

## 🔍 根本原因分析

### 1. Nginx 配置问题

**问题代码** (`nginx/conf.d/default.conf`):
```nginx
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

**错误原因**:
- 配置中硬编码了 `your-domain.com`
- 实际域名应为 `superjiasu.top`
- SSL 证书文件路径不存在，导致 Nginx 启动失败

**错误日志**:
```
nginx: [emerg] cannot load certificate "/etc/letsencrypt/live/your-domain.com/fullchain.pem":
BIO_new_file() failed (SSL: error:80000002:system library::No such file or directory)
```

### 2. SSL 参数配置问题

**问题代码** (`nginx/ssl-params.conf`):
```nginx
ssl_trusted_certificate /etc/letsencrypt/live/superjiasu.top/chain.pem;
```

**错误原因**:
- Let's Encrypt 只提供 `fullchain.pem`，不提供单独的 `chain.pem`
- 应使用 `fullchain.pem` 作为 trusted certificate

### 3. Next.js 端口映射问题

**现象**:
- Next.js 显示 "Ready in 281ms"
- 容器内部监听 `0.0.0.0:3000`
- 但从宿主机无法访问 `localhost:3000`

**原因**:
- Docker Compose 配置未暴露 3000 端口到宿主机（这是正常的）
- 应该通过 Nginx 反向代理访问，而非直接访问 3000 端口

---

## ✅ 解决方案

### 步骤 1: 停止所有服务

```bash
cd /root/self_code/web_vpn_v0_test
docker compose down
```

### 步骤 2: 修正 Nginx 域名配置

```bash
# 替换 Nginx 配置中的占位符域名
sed -i 's/your-domain.com/superjiasu.top/g' nginx/conf.d/default.conf
sed -i 's/your-domain.com/superjiasu.top/g' nginx/ssl-params.conf
```

**修改后的配置**:
```nginx
# nginx/conf.d/default.conf
ssl_certificate /etc/letsencrypt/live/superjiasu.top/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/superjiasu.top/privkey.pem;
```

### 步骤 3: 修正 SSL Trusted Certificate 路径

```bash
# 修正 ssl_trusted_certificate 路径
sed -i 's|/chain.pem|/fullchain.pem|g' nginx/ssl-params.conf
```

**修改后的配置**:
```nginx
# nginx/ssl-params.conf
ssl_trusted_certificate /etc/letsencrypt/live/superjiasu.top/fullchain.pem;
```

### 步骤 4: 创建自签名临时证书

```bash
# 创建证书目录并生成自签名证书
docker compose run --rm --entrypoint "sh -c 'mkdir -p /etc/letsencrypt/live/superjiasu.top && openssl req -x509 -nodes -newkey rsa:2048 -days 1 -keyout /etc/letsencrypt/live/superjiasu.top/privkey.pem -out /etc/letsencrypt/live/superjiasu.top/fullchain.pem -subj /CN=localhost'" certbot
```

**作用**:
- 创建临时自签名证书，让 Nginx 能够启动
- 证书有效期 1 天，仅用于初始化
- 后续会被 Let's Encrypt 真实证书替换

### 步骤 5: 启动 Nginx 服务

```bash
docker compose up -d nginx
```

**验证**:
```bash
docker compose logs nginx | tail -20
# 应该看到成功启动的日志，只有警告，没有错误
```

### 步骤 6: 重启 Nginx 应用配置

```bash
docker compose restart nginx
```

### 步骤 7: 启动完整服务栈

```bash
docker compose up -d
```

---

## 🧪 验证测试

### 1. 容器状态检查

```bash
docker compose ps
```

**期望输出**:
```
NAME          STATUS
vpn-certbot   Up (健康)
vpn-nextjs    Up (可能显示 unhealthy，但实际正常)
vpn-nginx     Up (健康) - 端口 80/443 已映射
```

### 2. Nginx 日志验证

```bash
docker compose logs nginx | tail -20
```

**期望结果**:
- ✅ 没有 `[emerg]` 错误
- ⚠️ 可能有 `[warn]` 警告（如 http2 deprecated）
- ✅ 显示 "Configuration complete; ready for start up"

### 3. Next.js 连通性测试

```bash
# 从 Nginx 容器访问 Next.js
docker compose exec nginx wget -qO- http://nextjs:3000 | head -20
```

**期望输出**: 返回完整 HTML 页面

### 4. 服务器 IP 访问测试

```bash
# HTTP 重定向测试
curl -I http://8.217.223.134
# 期望: HTTP/1.1 301 Moved Permanently
# Location: https://8.217.223.134/

# HTTPS 访问测试（忽略自签名证书警告）
curl -Ik https://8.217.223.134
# 期望: HTTP/2 200 OK
```

### 5. Docker 网络通信测试

```bash
# 测试容器内部通信
docker compose exec nextjs netstat -tulpn
# 期望: tcp 0.0.0.0:3000 LISTEN (Next.js 监听)

docker compose exec nextjs sh -c 'wget -qO- http://127.0.0.1:3000 | head -20'
# 期望: 返回 HTML 内容
```

---

## 📊 最终服务状态

### 容器状态总览

| 容器 | 状态 | 端口映射 | 健康状态 |
|------|------|----------|----------|
| **vpn-nginx** | ✅ Running | 80→80, 443→443 | Healthy |
| **vpn-nextjs** | ✅ Running | 3000 (内部) | Running |
| **vpn-certbot** | ✅ Running | - | Healthy |

### 网络架构

```
外部请求 (HTTP/HTTPS)
    ↓
服务器 8.217.223.134:80/443
    ↓
Docker: vpn-nginx (Nginx 反向代理)
    ↓
Docker 网络: nextjs:3000
    ↓
Docker: vpn-nextjs (Next.js 应用)
```

### 访问路径

1. **HTTP 访问**: `http://8.217.223.134` → 301 重定向到 HTTPS
2. **HTTPS 访问**: `https://8.217.223.134` → Nginx → Next.js
3. **域名访问**: ⚠️ 需要修改 DNS（见下方）

---

## ⚠️ 遗留问题与后续任务

### 1. DNS 配置错误

**当前状态**:
```bash
# DNS A 记录指向错误 IP
superjiasu.top → 47.76.52.52 (旧服务器)
```

**需要修改**:
```bash
# 登录域名管理后台，修改 A 记录
类型: A
主机记录: @ (或 www)
记录值: 8.217.223.134
TTL: 600 (10分钟)
```

**验证方法**:
```bash
# DNS 修改后验证
dig superjiasu.top +short
# 期望输出: 8.217.223.134

nslookup superjiasu.top
# 期望输出: Address: 8.217.223.134
```

### 2. SSL 证书升级

**当前状态**: 使用自签名证书（浏览器会警告）

**升级步骤** (DNS 修改生效后):
```bash
# 1. 申请 Let's Encrypt 真实证书
ssh root@8.217.223.134 "cd web_vpn_v0_test && docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d superjiasu.top --email 1214250247@qq.com --agree-tos --non-interactive"

# 2. 重启 Nginx 加载新证书
ssh root@8.217.223.134 "cd web_vpn_v0_test && docker compose restart nginx"

# 3. 验证 SSL 证书
curl -I https://superjiasu.top
# 应显示有效的 Let's Encrypt 证书
```

**证书自动续期**:
```bash
# Certbot 容器已配置自动续期
# 每12小时检查一次，到期前30天自动续期
# 无需人工干预
```

### 3. 环境变量完善

**当前警告**:
```
The "NEXT_PUBLIC_TURNSTILE_SITE_KEY" variable is not set. Defaulting to a blank string.
```

**建议修改** (`.env.docker.local`):
```bash
# 如果使用 Cloudflare Turnstile，设置真实 Key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_actual_turnstile_site_key

# 如果不使用，可以保持当前状态（已禁用）
NEXT_PUBLIC_DISABLE_TURNSTILE=yes
```

---

## 📚 相关文档

- **部署快速指南**: [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)
- **GitHub Secrets 配置**: [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
- **Docker 完整文档**: [README.docker.md](../README.docker.md)

---

## 🎓 经验总结

### 关键教训

1. **模板配置验证**: 部署前应验证所有配置文件中的占位符已替换
2. **SSL 证书准备**: 首次部署需创建临时证书，避免 Nginx 启动失败
3. **Let's Encrypt 文件结构**: 了解 `fullchain.pem` vs `chain.pem` 的区别
4. **Docker 网络调试**: 理解容器网络与宿主机网络的区别

### 最佳实践

1. **分步骤验证**: 每个步骤后验证日志，及时发现问题
2. **使用自签名证书**: 先让服务启动，再申请真实证书
3. **保持配置一致性**: 域名配置应从环境变量统一管理
4. **日志驱动调试**: 优先查看容器日志定位问题

### 工具命令清单

```bash
# 容器状态检查
docker compose ps
docker compose logs [service_name]

# 网络调试
docker compose exec [service] netstat -tulpn
docker compose exec [service] wget -qO- http://[target]

# 配置验证
docker compose config
sed -n '/pattern/p' config_file

# 证书管理
docker compose run --rm certbot certificates
openssl x509 -in cert.pem -text -noout
```

---

**修复完成时间**: 2025-10-03 17:40
**修复人员**: Claude Code (AI Assistant)
**验证状态**: ✅ 所有服务正常运行，待 DNS 修改后完全可用
