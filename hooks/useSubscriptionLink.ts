import { useState, useCallback } from "react"
import { API_BASE } from "@/lib/config"
import { copyToClipboard, showToast } from "@/lib/markdown-utils"
import { useSessionSubscriptionUrl } from "./useSessionSubscriptionUrl"

export function useSubscriptionLink() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getCachedSubscriptionUrl, hasCachedUrl, lastProductName } = useSessionSubscriptionUrl()

  const getSubscriptionLink = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let subscriptionUrl: string | null = null

      // First, try to get from session storage
      if (hasCachedUrl()) {
        subscriptionUrl = getCachedSubscriptionUrl()
        console.log("Using cached subscription URL from session")

        if (subscriptionUrl) {
          const success = await copyToClipboard(subscriptionUrl)
          if (success) {
            const successMsg = lastProductName
              ? `${lastProductName} 订阅链接已复制到剪贴板`
              : "订阅链接已复制到剪贴板"
            showToast(successMsg, 'success')
            return
          } else {
            throw new Error('复制失败，请手动复制链接')
          }
        }
      }

      // If no cached URL or copy failed, try API
      console.log("No cached URL found or copy failed, fetching from API")
      const response = await fetch(`${API_BASE}/user/subscription-url`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('请先登录账户')
        } else if (response.status === 403) {
          throw new Error('请先购买套餐')
        } else if (response.status === 404) {
          throw new Error('未找到订阅信息，请确认已购买套餐')
        } else {
          throw new Error(`获取失败: ${response.status}`)
        }
      }

      const data = await response.json()
      subscriptionUrl = data.url || data.subscription_url

      if (!subscriptionUrl || subscriptionUrl.trim() === "") {
        throw new Error('暂无可用订阅，请先购买套餐或提交工单寻求帮助')
      }

      const success = await copyToClipboard(subscriptionUrl)
      if (success) {
        showToast('订阅链接已复制到剪贴板！', 'success')
      } else {
        showToast('复制失败，请手动复制链接', 'error')
        // Fallback: show the URL in an alert for manual copy
        alert(`订阅链接: ${subscriptionUrl}`)
      }

    } catch (e: any) {
      const errorMessage = e?.message || '获取订阅链接失败，请重试'
      setError(errorMessage)

      // Enhanced error messages based on error type
      if (errorMessage.includes('401') || errorMessage.includes('请先登录')) {
        showToast('请先登录您的账户', 'error')
      } else if (errorMessage.includes('403') || errorMessage.includes('404') || errorMessage.includes('请先购买')) {
        showToast('未找到订阅信息，请确认已购买套餐或提交工单', 'error')
      } else if (errorMessage.includes('暂无可用订阅')) {
        showToast(errorMessage, 'error')
      } else {
        showToast(errorMessage, 'error')
      }

      console.error('获取订阅链接失败:', e)
    } finally {
      setLoading(false)
    }
  }, [getCachedSubscriptionUrl, hasCachedUrl, lastProductName])

  return {
    getSubscriptionLink,
    loading,
    error,
    hasCachedUrl: hasCachedUrl(),
    lastProductName
  }
}