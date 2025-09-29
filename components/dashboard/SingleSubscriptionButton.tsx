import { useState } from "react"
import { Button } from "@/components/ui/button"
import { copyToClipboard, showToast } from "@/lib/markdown-utils"

interface SingleSubscriptionButtonProps {
  subscriptionUrl?: string
  productName?: string
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
}

export function SingleSubscriptionButton({
  subscriptionUrl,
  productName = "套餐",
  className = "",
  size = "sm",
  variant = "outline"
}: SingleSubscriptionButtonProps) {
  const [copying, setCopying] = useState(false)

  const handleCopy = async () => {
    if (!subscriptionUrl || copying) return

    setCopying(true)
    try {
      const success = await copyToClipboard(subscriptionUrl)
      if (success) {
        showToast(`${productName} 订阅链接已复制到剪贴板`, 'success')
      } else {
        showToast('复制失败，请手动复制链接', 'error')
        // Fallback: show the URL in an alert for manual copy
        alert(`订阅链接: ${subscriptionUrl}`)
      }
    } catch (error) {
      showToast('复制失败，请重试', 'error')
      console.error('复制订阅链接失败:', error)
    } finally {
      setCopying(false)
    }
  }

  // No subscription URL available
  if (!subscriptionUrl || subscriptionUrl.trim() === "") {
    return (
      <Button
        disabled
        size={size}
        variant="ghost"
        className={`text-gray-400 cursor-not-allowed ${className}`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        暂无链接
      </Button>
    )
  }

  return (
    <Button
      onClick={handleCopy}
      disabled={copying}
      size={size}
      variant={variant}
      className={`transition-all duration-200 ${copying ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={`复制 ${productName} 订阅链接`}
    >
      {copying ? (
        <>
          <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          复制中...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          复制链接
        </>
      )}
    </Button>
  )
}