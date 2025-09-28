import { useSubscriptionLink } from "@/hooks/useSubscriptionLink"
import { Button } from "@/components/ui/button"

interface SubscriptionLinkButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg"
}

export function SubscriptionLinkButton({
  className = "",
  variant = "default",
  size = "default"
}: SubscriptionLinkButtonProps) {
  const { getSubscriptionLink, loading, error, hasCachedUrl, lastProductName } = useSubscriptionLink()

  const handleClick = () => {
    if (loading) return
    getSubscriptionLink()
  }

  const getButtonText = () => {
    if (loading) {
      return hasCachedUrl ? "正在复制..." : "正在获取..."
    }

    if (hasCachedUrl && lastProductName) {
      return `🔑 获取 ${lastProductName} 订阅链接`
    }

    return "🔑 获取我的订阅链接（自动复制）"
  }

  const getButtonVariant = () => {
    if (error) {
      return "outline"
    }
    return variant
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={getButtonVariant()}
        size={size}
        className={`w-full ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-200`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {hasCachedUrl ? "正在复制..." : "正在获取..."}
          </>
        ) : (
          <>
            {getButtonText()}
          </>
        )}
      </Button>

      {/* Help text and error recovery */}
      {error && (
        <div className="text-sm space-y-2">
          <div className="text-red-600 bg-red-50 p-2 rounded border border-red-200">
            <div className="font-medium">获取失败</div>
            <div className="text-red-700 mt-1">{error}</div>
          </div>

          <div className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
            <div className="font-medium text-gray-800 mb-1">解决方案：</div>
            <ul className="text-xs space-y-1">
              <li>• 确认您已登录账户</li>
              <li>• 检查是否已购买有效套餐</li>
              <li>• 尝试刷新页面重新获取</li>
              <li>• 如仍有问题，请提交工单寻求帮助</li>
            </ul>
          </div>
        </div>
      )}

      {/* Success indicator */}
      {!error && hasCachedUrl && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            订阅链接已准备就绪，点击即可复制
          </div>
        </div>
      )}
    </div>
  )
}