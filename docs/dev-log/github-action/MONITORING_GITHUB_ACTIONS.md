# GitHub Actions 自动监控指南

本项目提供了完整的GitHub Actions本地监控工具，可以在代码推送后自动检测构建状态并显示失败详情。

## 快速开始

### 1. 一次性设置

```bash
# 设置git hooks和别名
./scripts/setup-git-hooks.sh
```

**这会创建以下git命令：**
- `git pushw` - Push并自动监控构建
- `git check-build` - 检查最新构建状态
- `git watch-build` - 持续监控构建

### 2. 日常使用

**推荐方式（自动监控）：**
```bash
git add .
git commit -m "feat: add new feature"
git pushw  # 自动推送并监控，失败时显示详细错误
```

**手动方式：**
```bash
git push

# 检查一次
git check-build

# 或持续监控
git watch-build
```

## 监控工具详解

### monitor-github-actions.sh

主要的GitHub Actions监控脚本。

**用法：**
```bash
# 检查一次最新状态
./scripts/monitor-github-actions.sh --once

# 持续监控（每10秒检查一次）
./scripts/monitor-github-actions.sh --watch

# 显示帮助
./scripts/monitor-github-actions.sh --help
```

**功能特性：**
- ✅ 监控所有workflow（deploy-registry, deploy-ssh, build-test）
- ✅ 自动检测新的构建运行
- ✅ 构建失败时自动显示完整错误日志
- ✅ 彩色输出（绿色=成功，红色=失败，黄色=运行中）
- ✅ 直接链接到GitHub Actions页面
- ✅ 桌面通知（Linux系统需要notify-send）
- ✅ 显示失败的具体Job

**输出示例：**

<details>
<summary>成功构建</summary>

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 检查 GitHub Actions 构建状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

检查 deploy-registry.yml...
✅ 构建成功!
Workflow: fix: Add monitoring tools
Run ID: 18224820564
URL: https://github.com/gansxx/web_vpn_v0_test/actions/runs/18224820564
```
</details>

<details>
<summary>失败构建（自动显示详细日志）</summary>

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 构建失败详情
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workflow: fix: Make PROJECT_DIR configurable
Run ID: 18224820564
URL: https://github.com/gansxx/web_vpn_v0_test/actions/runs/18224820564

正在获取失败日志...

Deploy to Server	Deploy on server	/tmp/deploy-from-registry.sh: line 147: docker-compose: command not found
Deploy to Server	Deploy on server	##[error]Process completed with exit code 127.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
失败的作业 (Jobs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job: Deploy to Server
Status: failure
```
</details>

<details>
<summary>运行中构建</summary>

```
检查 deploy-registry.yml...
⏳ 运行中... (Run ID: 18224820564)
使用 'gh run watch 18224820564' 实时监控
```
</details>

### git-push-and-watch.sh

Git push包装器，推送后自动监控构建。

**特性：**
- ✅ 仅在main分支自动监控
- ✅ 推送失败时不启动监控
- ✅ 可随时Ctrl+C中断监控
- ✅ 等待3秒让GitHub Actions启动

**通过git alias使用：**
```bash
git pushw
```

**或直接调用：**
```bash
./scripts/git-push-and-watch.sh
```

### setup-git-hooks.sh

一次性设置脚本，创建git hooks和aliases。

**创建的git aliases：**
```bash
git config --local alias.pushw '!bash scripts/git-push-and-watch.sh'
git config --local alias.check-build '!bash scripts/monitor-github-actions.sh --once'
git config --local alias.watch-build '!bash scripts/monitor-github-actions.sh --watch'
```

**创建的git hooks：**
- `post-commit` - 提交后提示可用的监控命令

## 工作流程集成

### 典型开发流程

```bash
# 1. 开发功能
vim app/page.tsx

# 2. 提交更改
git add .
git commit -m "feat: add user dashboard"

# 3. 推送并自动监控
git pushw

# 输出:
# 🚀 推送代码到远程仓库...
# ✅ 代码已推送成功
#
# ⏳ 等待 GitHub Actions 开始...
# 📊 开始监控 GitHub Actions 构建状态...
#    (按 Ctrl+C 可以随时停止监控)
#
# [自动显示构建状态和错误]
```

### CI/CD Pipeline监控

监控脚本会追踪以下workflows：

1. **Build and Test** (`build-test.yml`)
   - 代码质量检查
   - 单元测试
   - 构建验证

2. **Deploy to Production (Registry)** (`deploy-registry.yml`)
   - Docker镜像构建和推送
   - 自动部署到生产服务器
   - 健康检查

3. **Deploy to Production (SSH Direct)** (`deploy-ssh.yml`)
   - 直接SSH传输部署
   - 手动触发工作流

## 桌面通知设置

### Linux (Ubuntu/Debian)

```bash
# 安装notify-send
sudo apt-get install libnotify-bin

# 测试通知
notify-send "测试" "GitHub Actions监控已启用"
```

监控脚本会自动检测并使用桌面通知。

### macOS

macOS不支持notify-send，但可以使用osascript：

**修改monitor-github-actions.sh：**
```bash
# 将这行：
if command -v notify-send &> /dev/null; then
  notify-send -u critical "GitHub Actions 失败" "$WORKFLOW"
fi

# 改为：
if [[ "$OSTYPE" == "darwin"* ]]; then
  osascript -e "display notification \"$WORKFLOW\" with title \"GitHub Actions 失败\""
elif command -v notify-send &> /dev/null; then
  notify-send -u critical "GitHub Actions 失败" "$WORKFLOW"
fi
```

### Windows (WSL)

在WSL中可以使用Windows通知：

```bash
# 安装wsl-notify-send
wget https://github.com/stuartleeks/wsl-notify-send/releases/download/v0.1/wsl-notify-send.exe
sudo mv wsl-notify-send.exe /usr/local/bin/
```

## 故障排除

### 问题1: gh命令未找到

**错误：**
```
bash: gh: command not found
```

**解决：**
```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 登录GitHub
gh auth login
```

### 问题2: 权限不足

**错误：**
```
Permission denied: ./scripts/monitor-github-actions.sh
```

**解决：**
```bash
chmod +x scripts/*.sh
```

### 问题3: jq未安装

**错误：**
```
bash: jq: command not found
```

**解决：**
```bash
sudo apt-get install jq
```

### 问题4: git alias不工作

**错误：**
```
git: 'pushw' is not a git command
```

**解决：**
```bash
# 重新运行设置脚本
./scripts/setup-git-hooks.sh

# 验证alias
git config --local --list | grep alias
```

## 高级用法

### 仅监控特定workflow

编辑 `monitor-github-actions.sh`，修改 `WORKFLOWS` 数组：

```bash
# 仅监控部署workflow
local WORKFLOWS=("deploy-registry.yml")

# 或仅监控构建
local WORKFLOWS=("build-test.yml")
```

### 调整检查间隔

在 `monitor_watch()` 函数中修改：

```bash
# 默认10秒
local CHECK_INTERVAL=10

# 改为5秒（更快响应）
local CHECK_INTERVAL=5

# 改为30秒（降低API调用频率）
local CHECK_INTERVAL=30
```

### 集成到CI/CD通知系统

监控脚本可以被其他系统调用：

```bash
# 在自动化脚本中使用
./scripts/monitor-github-actions.sh --once
if [ $? -ne 0 ]; then
    # 发送邮件、Slack通知等
    send_alert "Build failed"
fi
```

### 与其他工具集成

**结合VSCode任务：**

`.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Check GitHub Actions",
      "type": "shell",
      "command": "./scripts/monitor-github-actions.sh --once",
      "problemMatcher": []
    },
    {
      "label": "Watch GitHub Actions",
      "type": "shell",
      "command": "./scripts/monitor-github-actions.sh --watch",
      "isBackground": true
    }
  ]
}
```

**结合tmux/screen会话：**

```bash
# 在后台会话中持续监控
tmux new-session -d -s gh-monitor './scripts/monitor-github-actions.sh --watch'

# 查看监控
tmux attach -t gh-monitor
```

## 安全注意事项

1. ✅ 脚本不会暴露任何GitHub Secrets
2. ✅ 所有敏感信息在日志中被`***`掩码
3. ✅ 使用GitHub CLI的认证token
4. ✅ 仅读取公开的workflow运行信息

## 性能考虑

- **API限制**: GitHub CLI使用您的认证token，有API速率限制
- **轮询频率**: 默认10秒间隔平衡了响应性和API使用
- **并发监控**: 可以同时运行多个监控实例
- **资源占用**: 监控脚本CPU和内存占用极小（主要是gh CLI调用）

## 反馈和改进

如果您有改进建议或发现bug：

1. 查看脚本输出的详细错误信息
2. 检查 `gh` 命令是否正常工作：`gh run list`
3. 提供错误日志和环境信息

## 相关文档

- [GitHub Actions部署配置](./GITHUB_ACTIONS_DEPLOYMENT.md)
- [GitHub CLI文档](https://cli.github.com/manual/)
- [Git Hooks指南](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
