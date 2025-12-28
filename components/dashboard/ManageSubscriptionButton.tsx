"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSubscriptionPortal } from "@/lib/subscription-api"
import { showToast } from "@/lib/markdown-utils"

interface ManageSubscriptionButtonProps {
  hasProducts: boolean
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
}

export function ManageSubscriptionButton({
  hasProducts,
  className = "",
  size = "sm",
  variant = "outline"
}: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    setIsLoading(true)

    try {
      const result = await getSubscriptionPortal()

      if (result.success && result.portal_url) {
        window.open(result.portal_url, '_blank', 'noopener,noreferrer')
        showToast("正在打开订阅管理门户...", "success")
      } else {
        throw new Error("未能获取管理门户链接")
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "获取管理门户失败"
      showToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  // 没有产品时禁用按钮
  if (!hasProducts) {
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        暂无订阅
      </Button>
    )
  }

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={`transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title="管理订阅"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          管理订阅
        </>
      )}
    </Button>
  )
}
