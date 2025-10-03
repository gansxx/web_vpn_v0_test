# GitHub Secrets 配置指南

本文档说明如何为 GitHub Actions 自动部署配置必需的 Secrets。

## 📋 目录

- [前置要求](#前置要求)
- [配置步骤](#配置步骤)
- [必需的 Secrets](#必需的-secrets)
- [生成 SSH 密钥](#生成-ssh-密钥)
- [验证配置](#验证配置)
- [故障排查](#故障排查)

## 🔧 前置要求

- GitHub 仓库管理员权限
- 服务器 SSH 访问权限
- Docker Hub 账户（如使用 Registry 部署）

## 📝 配置步骤

### 步骤 1: 访问 GitHub Secrets 设置

1. 打开您的 GitHub 仓库
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮

### 步骤 2: 添加服务器访问凭证

#### SSH_HOST

**描述**: 服务器 IP 地址或域名
**当前值**: `8.217.223.134`
**如何获取**:
```bash
# 在服务器上运行
curl ifconfig.me
# 或
ip addr show
```

**添加方式**:
- Name: `SSH_HOST`
- Secret: `8.217.223.134`

#### SSH_PORT

**描述**: SSH 端口号
**默认值**: `22`
**如何获取**:
```bash
# 查看 SSH 配置
grep "^Port" /etc/ssh/sshd_config
# 如果未找到，则使用默认端口 22
```

**添加方式**:
- Name: `SSH_PORT`
- Secret: `22`

#### SSH_USERNAME

**描述**: SSH 登录用户名
**常用值**: `root` 或 `ubuntu`
**如何确认**:
```bash
# 当前登录用户
whoami
```

**添加方式**:
- Name: `SSH_USERNAME`
- Secret: `root`

#### SSH_PRIVATE_KEY

**描述**: SSH 私钥（完整内容）
**格式**:
```
-----BEGIN OPENSSH PRIVATE KEY-----
[私钥内容]
-----END OPENSSH PRIVATE KEY-----
```

**如何生成**: 参见 [生成 SSH 密钥](#生成-ssh-密钥) 章节

**添加方式**:
- Name: `SSH_PRIVATE_KEY`
- Secret: 完整的私钥内容（包括开始和结束标记）

### 步骤 3: 添加 Docker Hub 凭证（如使用 Registry 部署）

#### DOCKER_USERNAME

**描述**: Docker Hub 用户名
**如何获取**: 登录 [Docker Hub](https://hub.docker.com) 查看

**添加方式**:
- Name: `DOCKER_USERNAME`
- Secret: 您的 Docker Hub 用户名

#### DOCKER_PASSWORD

**描述**: Docker Hub 访问令牌
**如何生成**:
1. 登录 [Docker Hub](https://hub.docker.com)
2. 点击右上角头像 → **Account Settings**
3. 左侧菜单 → **Security**
4. **New Access Token**
5. 设置描述（如 "GitHub Actions"）和权限（Read & Write）
6. 复制生成的令牌

**添加方式**:
- Name: `DOCKER_PASSWORD`
- Secret: 生成的访问令牌（格式：`dckr_pat_xxxxxxxxxxxxx`）

**⚠️ 重要**: 使用 Access Token 而不是密码，更安全且可随时撤销

### 步骤 4: 添加应用环境变量

#### NEXT_PUBLIC_API_BASE

**描述**: 后端 API 地址
**示例**: `https://selfgo.asia/api`

**添加方式**:
- Name: `NEXT_PUBLIC_API_BASE`
- Secret: 您的 API 地址

#### NEXT_PUBLIC_TURNSTILE_SITE_KEY

**描述**: Cloudflare Turnstile Site Key（可选）
**如何获取**:
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择域名 → **Turnstile**
3. 创建或查看 Site Key

**添加方式**:
- Name: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Secret: 您的 Turnstile Site Key

#### DOMAIN

**描述**: 部署域名
**示例**: `vpn.example.com`

**添加方式**:
- Name: `DOMAIN`
- Secret: 您的域名

#### EMAIL

**描述**: 管理员邮箱（用于 SSL 证书）
**示例**: `admin@example.com`

**添加方式**:
- Name: `EMAIL`
- Secret: 您的邮箱

## 🔑 生成 SSH 密钥

### 方法 1: 在本地生成（推荐）

```bash
# 1. 生成专用密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key

# 不设置密码（按两次 Enter），因为 GitHub Actions 无法输入密码

# 2. 查看公钥
cat ~/.ssh/github_actions_key.pub

# 3. 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/github_actions_key.pub root@8.217.223.134

# 或手动添加:
# ssh root@8.217.223.134
# echo "公钥内容" >> ~/.ssh/authorized_keys
# chmod 600 ~/.ssh/authorized_keys

# 4. 测试密钥登录
ssh -i ~/.ssh/github_actions_key root@8.217.223.134

# 5. 复制私钥内容到 GitHub Secret
cat ~/.ssh/github_actions_key

# 完整复制输出内容（包括 BEGIN 和 END 行）
```

### 方法 2: 使用现有密钥

如果您已有服务器访问密钥：

```bash
# 查看私钥
cat ~/.ssh/id_rsa

# 完整复制内容到 GitHub Secret SSH_PRIVATE_KEY
```

### 密钥格式示例

正确的私钥格式：
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAx+5/dGhpc2lzYW5leGFtcGxla2V5ZmlsZXdpdGhtb3JlbGlu
[更多行...]
-----END OPENSSH PRIVATE KEY-----
```

**注意事项**:
- ✅ 必须包含开始和结束标记
- ✅ 保留所有换行符
- ✅ 不要添加额外的空格或字符
- ❌ 不要只复制部分内容

## ✅ 验证配置

### 检查清单

在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 页面，确认已添加：

**服务器访问** (必需):
- [ ] `SSH_HOST` - 8.217.223.134
- [ ] `SSH_PORT` - 22
- [ ] `SSH_USERNAME` - root
- [ ] `SSH_PRIVATE_KEY` - 私钥完整内容

**Docker Registry** (Registry 部署必需):
- [ ] `DOCKER_USERNAME` - Docker Hub 用户名
- [ ] `DOCKER_PASSWORD` - Docker Hub 访问令牌

**应用配置** (必需):
- [ ] `NEXT_PUBLIC_API_BASE` - API 地址
- [ ] `DOMAIN` - 域名
- [ ] `EMAIL` - 管理员邮箱

**可选配置**:
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - Turnstile Key

### 测试 SSH 连接

在本地测试 SSH 密钥是否正常工作：

```bash
# 使用生成的密钥测试连接
ssh -i ~/.ssh/github_actions_key root@8.217.223.134

# 如果成功登录，密钥配置正确
```

### 触发测试部署

配置完成后，触发一次测试部署：

```bash
# 方法 1: 推送代码到 main 分支（自动触发）
git add .
git commit -m "test: trigger deployment"
git push origin main

# 方法 2: 手动触发工作流
# 访问 GitHub → Actions → Deploy to Production (Registry) → Run workflow
```

查看部署日志：
1. 访问 **Actions** 标签
2. 点击最新的工作流运行
3. 查看每个步骤的日志输出
4. 确认所有步骤成功完成（绿色对勾）

## 🔍 故障排查

### 问题 1: SSH 连接失败

**错误信息**: `Permission denied (publickey)`

**解决方法**:
```bash
# 1. 检查服务器上的 authorized_keys
ssh root@8.217.223.134
cat ~/.ssh/authorized_keys
# 确认公钥已正确添加

# 2. 检查文件权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 3. 检查 SSH 配置
sudo nano /etc/ssh/sshd_config
# 确认:
# PubkeyAuthentication yes
# PasswordAuthentication no

# 重启 SSH 服务
sudo systemctl restart sshd

# 4. 重新测试
ssh -i ~/.ssh/github_actions_key root@8.217.223.134 -v
# -v 参数显示详细调试信息
```

### 问题 2: Docker Hub 认证失败

**错误信息**: `unauthorized: incorrect username or password`

**解决方法**:
```bash
# 1. 确认使用 Access Token 而不是密码
# 重新生成 Token: Docker Hub → Account Settings → Security → New Access Token

# 2. 测试 Token
docker login -u your-username -p dckr_pat_xxxxxxxxxxxxx

# 3. 确认 GitHub Secret 中的 DOCKER_PASSWORD 是 Token
```

### 问题 3: 部署脚本找不到

**错误信息**: `No such file or directory: /tmp/deploy-from-registry.sh`

**解决方法**:
```bash
# 确认部署脚本存在
ls -la scripts/deploy-from-registry.sh

# 如果不存在，从 docker 分支获取:
git checkout docker -- scripts/
```

### 问题 4: 健康检查失败

**错误信息**: `Health check failed after 5 attempts`

**解决方法**:
```bash
# SSH 到服务器
ssh root@8.217.223.134

# 检查容器状态
docker-compose ps

# 查看应用日志
docker-compose logs nextjs

# 手动测试健康检查
curl http://localhost:3000/api/health

# 如果 404，检查 Next.js 是否有 /api/health 路由
```

### 问题 5: Secret 值包含特殊字符

**问题**: Secret 中的值包含 `$`、`"`、`'` 等特殊字符导致解析错误

**解决方法**:
```bash
# GitHub Secrets 会自动处理特殊字符
# 直接粘贴原始值即可，不需要转义

# 例如密码包含特殊字符:
# 正确: P@ssw0rd$123
# 错误: P\@ssw0rd\$123 (不要转义)
```

## 📚 完整配置示例

### GitHub Secrets 配置表

| Secret Name | 示例值 | 说明 | 必需 |
|------------|--------|------|------|
| `SSH_HOST` | `8.217.223.134` | 服务器IP | ✅ |
| `SSH_PORT` | `22` | SSH端口 | ✅ |
| `SSH_USERNAME` | `root` | SSH用户名 | ✅ |
| `SSH_PRIVATE_KEY` | `-----BEGIN...` | SSH私钥 | ✅ |
| `DOCKER_USERNAME` | `johndoe` | Docker用户名 | Registry部署需要 |
| `DOCKER_PASSWORD` | `dckr_pat_xxx` | Docker Token | Registry部署需要 |
| `NEXT_PUBLIC_API_BASE` | `https://api.example.com` | API地址 | ✅ |
| `DOMAIN` | `vpn.example.com` | 域名 | ✅ |
| `EMAIL` | `admin@example.com` | 管理员邮箱 | ✅ |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4xxx...xxx` | Turnstile Key | ⭕ 可选 |

## 🔒 安全最佳实践

### 1. 定期更换密钥

```bash
# 每 3-6 个月更换一次 SSH 密钥和 Docker Token
# 生成新密钥后，撤销旧密钥
```

### 2. 最小权限原则

```bash
# Docker Token 只授予必需的权限
# 如只需推送镜像，选择 "Read & Write" 而非 "Admin"
```

### 3. 监控访问日志

```bash
# 定期检查服务器 SSH 登录日志
sudo tail -f /var/log/auth.log

# 检查异常登录尝试
```

### 4. 使用独立密钥

```bash
# 为 GitHub Actions 使用专用 SSH 密钥
# 不要使用个人主密钥
```

### 5. 限制 IP 访问（可选）

```bash
# 在服务器上配置防火墙，只允许 GitHub Actions IP 访问
# GitHub Actions IP 范围: https://api.github.com/meta

# 示例 UFW 配置:
# sudo ufw allow from 192.30.252.0/22 to any port 22
```

## 📞 获取帮助

如果配置过程中遇到问题：

1. **查看 GitHub Actions 日志**: 仓库 → Actions → 选择失败的工作流 → 查看详细日志
2. **查看服务器日志**: `docker-compose logs -f`
3. **参考故障排查章节**: 本文档的[故障排查](#故障排查)部分
4. **提交 Issue**: 在 GitHub 仓库创建 Issue 描述问题

## 📝 更新记录

- **2025-10-03**: 创建文档，新服务器 IP 8.217.223.134
- 添加完整的配置步骤和故障排查指南
