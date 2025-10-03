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
