import { useProducts } from "@/hooks/useProducts"
import { useSubscriptionLink } from "@/hooks/useSubscriptionLink"
import { copyToClipboard, showToast } from "@/lib/markdown-utils"

interface FloatingButtonsProps {
  onOrderClick: () => void
  onTicketClick: () => void
}

export function FloatingButtons({ onOrderClick, onTicketClick }: FloatingButtonsProps) {
  const { products, loading: productsLoading } = useProducts()
  const { getSubscriptionLink, loading: linkLoading } = useSubscriptionLink()

  // Intelligent subscription handler
  const handleSmartSubscription = async () => {
    if (productsLoading || linkLoading) return

    // Check if user has any products
    if (!products || products.length === 0) {
      // No products, redirect to purchase
      showToast('您还没有购买任何套餐，正在跳转到购买页面...', 'success')
      onOrderClick()
      return
    }

    // Find products with subscription URLs
    const productsWithUrls = products.filter(p => p.subscription_url && p.subscription_url.trim() !== "")

    if (productsWithUrls.length === 0) {
      // Has products but no subscription URLs
      showToast('套餐信息正在同步中，请稍后刷新重试或联系客服', 'error')
      return
    }

    // Find the latest product with subscription URL (sorted by buy_time)
    const sortedProducts = [...productsWithUrls].sort((a, b) => {
      const timeA = a.buy_time ? new Date(a.buy_time).getTime() : 0
      const timeB = b.buy_time ? new Date(b.buy_time).getTime() : 0
      return timeB - timeA
    })

    const latestProduct = sortedProducts[0]

    try {
      const success = await copyToClipboard(latestProduct.subscription_url!)
      if (success) {
        showToast(`${latestProduct.product_name || '最新套餐'} 订阅链接已复制到剪贴板`, 'success')
      } else {
        showToast('复制失败，请手动复制链接', 'error')
        alert(`订阅链接: ${latestProduct.subscription_url}`)
      }
    } catch (error) {
      console.error('复制失败:', error)
      showToast('复制失败，请重试', 'error')
    }
  }

  const isLoading = productsLoading || linkLoading

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      <button
        onClick={handleSmartSubscription}
        disabled={isLoading}
        className={`bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 group ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="智能一键订阅"
      >
{isLoading ? (
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        )}
        <span className="hidden sm:group-hover:block transition-all duration-200">
          {isLoading ? '检查中...' : '智能订阅'}
        </span>
      </button>

      <button
        onClick={onTicketClick}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center space-x-2 group"
        title="提交工单"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="hidden sm:group-hover:block transition-all duration-200">提交工单</span>
      </button>
    </div>
  )
}