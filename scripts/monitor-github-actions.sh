#!/bin/bash
# GitHub Actions 构建监控工具
# 用法: ./scripts/monitor-github-actions.sh [--once|--watch]

set -e

REPO="gansxx/web_vpn_v0_test"
MODE="${1:---watch}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

check_latest_run() {
    local WORKFLOW="$1"
    local LATEST=$(gh run list --workflow="$WORKFLOW" --limit 1 --json databaseId,status,conclusion,displayTitle,createdAt,updatedAt)

    if [ -z "$LATEST" ] || [ "$LATEST" = "[]" ]; then
        echo -e "${YELLOW}⚠ 没有找到 $WORKFLOW 的运行记录${NC}"
        return 1
    fi

    local RUN_ID=$(echo "$LATEST" | jq -r '.[0].databaseId')
    local STATUS=$(echo "$LATEST" | jq -r '.[0].status')
    local CONCLUSION=$(echo "$LATEST" | jq -r '.[0].conclusion')
    local TITLE=$(echo "$LATEST" | jq -r '.[0].displayTitle')
    local CREATED=$(echo "$LATEST" | jq -r '.[0].createdAt')

    echo "$RUN_ID|$STATUS|$CONCLUSION|$TITLE|$CREATED"
}

show_failure_details() {
    local RUN_ID="$1"
    local TITLE="$2"

    print_header "❌ 构建失败详情"

    echo -e "${RED}Workflow:${NC} $TITLE"
    echo -e "${RED}Run ID:${NC} $RUN_ID"
    echo -e "${RED}URL:${NC} https://github.com/$REPO/actions/runs/$RUN_ID"
    echo ""

    echo -e "${YELLOW}正在获取失败日志...${NC}\n"

    # 获取失败的日志
    if gh run view "$RUN_ID" --log-failed 2>/dev/null; then
        echo ""
    else
        echo -e "${RED}无法获取日志，请访问上面的URL查看${NC}"
    fi

    print_header "失败的作业 (Jobs)"
    gh run view "$RUN_ID" --json jobs --jq '.jobs[] | select(.conclusion == "failure") | "Job: \(.name)\nStatus: \(.conclusion)\n"'
}

show_success_details() {
    local RUN_ID="$1"
    local TITLE="$2"

    echo -e "${GREEN}✅ 构建成功!${NC}"
    echo -e "${GREEN}Workflow:${NC} $TITLE"
    echo -e "${GREEN}Run ID:${NC} $RUN_ID"
    echo -e "${GREEN}URL:${NC} https://github.com/$REPO/actions/runs/$RUN_ID"
}

monitor_once() {
    print_header "📊 检查 GitHub Actions 构建状态"

    local WORKFLOWS=("deploy-registry.yml" "deploy-ssh.yml" "build-test.yml")
    local HAS_FAILURE=0

    for WORKFLOW in "${WORKFLOWS[@]}"; do
        echo -e "${BLUE}检查 $WORKFLOW...${NC}"

        local RESULT=$(check_latest_run "$WORKFLOW")

        if [ $? -eq 0 ]; then
            IFS='|' read -r RUN_ID STATUS CONCLUSION TITLE CREATED <<< "$RESULT"

            if [ "$STATUS" = "completed" ]; then
                if [ "$CONCLUSION" = "failure" ]; then
                    show_failure_details "$RUN_ID" "$TITLE"
                    HAS_FAILURE=1
                elif [ "$CONCLUSION" = "success" ]; then
                    show_success_details "$RUN_ID" "$TITLE"
                fi
            else
                echo -e "${YELLOW}⏳ 运行中... (Run ID: $RUN_ID)${NC}"
                echo -e "${YELLOW}使用 'gh run watch $RUN_ID' 实时监控${NC}"
            fi
        fi

        echo ""
    done

    return $HAS_FAILURE
}

monitor_watch() {
    print_header "🔍 开始监控 GitHub Actions (按 Ctrl+C 停止)"

    declare -A LAST_RUN_IDS
    local CHECK_INTERVAL=10

    while true; do
        local WORKFLOWS=("deploy-registry.yml" "deploy-ssh.yml" "build-test.yml")

        for WORKFLOW in "${WORKFLOWS[@]}"; do
            local RESULT=$(check_latest_run "$WORKFLOW" 2>/dev/null)

            if [ $? -eq 0 ]; then
                IFS='|' read -r RUN_ID STATUS CONCLUSION TITLE CREATED <<< "$RESULT"

                # 检查是否是新的运行
                if [ "${LAST_RUN_IDS[$WORKFLOW]}" != "$RUN_ID" ]; then
                    LAST_RUN_IDS[$WORKFLOW]="$RUN_ID"

                    if [ "$STATUS" = "completed" ]; then
                        echo -e "\n$(date '+%Y-%m-%d %H:%M:%S') - $WORKFLOW"

                        if [ "$CONCLUSION" = "failure" ]; then
                            show_failure_details "$RUN_ID" "$TITLE"

                            # 桌面通知 (如果可用)
                            if command -v notify-send &> /dev/null; then
                                notify-send -u critical "GitHub Actions 失败" "$WORKFLOW\nRun ID: $RUN_ID"
                            fi
                        elif [ "$CONCLUSION" = "success" ]; then
                            show_success_details "$RUN_ID" "$TITLE"

                            if command -v notify-send &> /dev/null; then
                                notify-send "GitHub Actions 成功" "$WORKFLOW\nRun ID: $RUN_ID"
                            fi
                        fi
                    elif [ "$STATUS" = "in_progress" ]; then
                        echo -e "\n$(date '+%Y-%m-%d %H:%M:%S') - ${YELLOW}🚀 新的运行开始: $WORKFLOW (Run ID: $RUN_ID)${NC}"
                    fi
                fi
            fi
        done

        sleep $CHECK_INTERVAL
    done
}

# Main
case "$MODE" in
    --once|-o)
        monitor_once
        exit $?
        ;;
    --watch|-w)
        monitor_watch
        ;;
    --help|-h)
        echo "用法: $0 [选项]"
        echo ""
        echo "选项:"
        echo "  --once, -o     检查一次最新状态 (默认)"
        echo "  --watch, -w    持续监控 (每10秒检查一次)"
        echo "  --help, -h     显示帮助信息"
        echo ""
        echo "示例:"
        echo "  $0 --once      # 检查最新构建状态"
        echo "  $0 --watch     # 持续监控，失败时显示详情"
        exit 0
        ;;
    *)
        echo -e "${RED}未知选项: $MODE${NC}"
        echo "使用 --help 查看帮助"
        exit 1
        ;;
esac
