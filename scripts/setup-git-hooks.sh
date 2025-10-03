#!/bin/bash
# 设置Git Hooks以自动监控GitHub Actions

set -e

REPO_ROOT=$(git rev-parse --show-toplevel)
HOOKS_DIR="$REPO_ROOT/.git/hooks"

echo "🔧 设置 Git Hooks..."

# 创建 post-commit hook (可选 - 提交后提示)
cat > "$HOOKS_DIR/post-commit" <<'EOF'
#!/bin/bash
echo ""
echo "💡 提示: 推送后使用以下命令监控构建:"
echo "   ./scripts/monitor-github-actions.sh --once   # 检查一次"
echo "   ./scripts/monitor-github-actions.sh --watch  # 持续监控"
echo ""
EOF

chmod +x "$HOOKS_DIR/post-commit"

# 创建自定义的 post-push hook wrapper
# 注意: git 本身不支持 post-push hook，需要通过 alias 实现
cat > "$REPO_ROOT/scripts/git-push-and-watch.sh" <<'EOF'
#!/bin/bash
# Git push 并自动监控构建状态

set -e

# 执行 git push
echo "🚀 推送代码到远程仓库..."
git push "$@"

PUSH_EXIT=$?
if [ $PUSH_EXIT -ne 0 ]; then
    echo "❌ Push 失败"
    exit $PUSH_EXIT
fi

echo ""
echo "✅ 代码已推送成功"
echo ""
echo "⏳ 等待 GitHub Actions 开始..."
sleep 3

# 获取当前分支
BRANCH=$(git branch --show-current)

# 检查是否应该监控 (只监控 main 分支)
if [ "$BRANCH" = "main" ]; then
    echo "📊 开始监控 GitHub Actions 构建状态..."
    echo "   (按 Ctrl+C 可以随时停止监控)"
    echo ""

    # 运行监控脚本
    ./scripts/monitor-github-actions.sh --watch
else
    echo "💡 当前分支: $BRANCH (非 main 分支，不自动监控)"
    echo "   如需监控，运行: ./scripts/monitor-github-actions.sh --watch"
fi
EOF

chmod +x "$REPO_ROOT/scripts/git-push-and-watch.sh"

# 创建 git alias
echo ""
echo "📝 创建 Git Alias..."
git config --local alias.pushw '!bash scripts/git-push-and-watch.sh'
git config --local alias.check-build '!bash scripts/monitor-github-actions.sh --once'
git config --local alias.watch-build '!bash scripts/monitor-github-actions.sh --watch'

echo ""
echo "✅ Git Hooks 设置完成!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "新增的 Git 命令:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  git pushw              # Push 并自动监控构建 (推荐)"
echo "  git check-build        # 检查最新构建状态"
echo "  git watch-build        # 持续监控构建状态"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 用法示例:"
echo "   git add ."
echo "   git commit -m 'fix: update deployment'"
echo "   git pushw                # 自动推送并监控"
echo ""
echo "   # 或者分开执行:"
echo "   git push"
echo "   git check-build         # 手动检查一次"
echo ""
