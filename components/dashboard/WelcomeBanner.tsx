import { useProducts } from "@/hooks/useProducts"
import { useSubscriptionLink } from "@/hooks/useSubscriptionLink"

interface WelcomeBannerProps {
  onOrderClick: () => void
}

export function WelcomeBanner({ onOrderClick }: WelcomeBannerProps) {
  const { products, loading: productsLoading } = useProducts()
  const { getSubscriptionLink, loading: subscriptionLoading, hasCachedUrl } = useSubscriptionLink()

  // Check if user has any active subscriptions
  const hasActiveSubscription = products.length > 0 || hasCachedUrl
  const isLoading = productsLoading || subscriptionLoading

  const handleSmartSubscription = async () => {
    if (isLoading) return

    // If user has subscriptions, get/copy the subscription link
    if (hasActiveSubscription) {
      await getSubscriptionLink()
    } else {
      // If no subscriptions, redirect to purchase page
      onOrderClick()
    }
  }
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 text-gray-800 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            欢迎使用Z加速，使用教程请参考文档中心，
            <br />
            若有疑问可提交工单～
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSmartSubscription}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>检查中...</span>
                </>
              ) : hasActiveSubscription ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>获取订阅链接</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>购买套餐</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="w-32 h-32 bg-gray-200 bg-opacity-30 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gray-200 bg-opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
    </div>
  )
}