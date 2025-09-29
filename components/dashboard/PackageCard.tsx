import { Button } from "@/components/ui/button"
import { ProductItem, fmtDate } from "@/lib/dashboard-utils"
import { SingleSubscriptionButton } from "./SingleSubscriptionButton"

interface PackageCardProps {
  products: ProductItem[]
  loading: boolean
  error: string | null
  onReload: () => void
}

export function PackageCard({ products, loading, error, onReload }: PackageCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-gray-900 relative overflow-hidden border border-gray-200">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h2 className="text-2xl font-bold">我的套餐</h2>
          </div>
          <Button
            onClick={onReload}
            disabled={loading}
            className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-300"
          >
            {loading ? "刷新中..." : "刷新"}
          </Button>
        </div>

        {loading && (
          <p className="text-gray-600">正在加载...</p>
        )}

        {!loading && error && (
          <p className="text-red-600">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <>
            <p className="text-gray-600 mb-6">您还没有激活的套餐</p>
            <p className="text-gray-500 mb-8">立即开通套餐选择适合的服务</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              兑换礼品卡
            </button>
          </>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="bg-white/80 rounded-lg overflow-hidden border border-gray-200">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-200/80 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">套餐名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">购买时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">到期时间</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">一键订阅</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{p.product_name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.buy_time ? new Date(p.buy_time).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.end_time ? new Date(p.end_time).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <SingleSubscriptionButton
                          subscriptionUrl={p.subscription_url}
                          productName={p.product_name}
                          size="sm"
                          variant="outline"
                          className="text-gray-900 border-gray-300 hover:bg-gray-50"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-gray-900 bg-opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
    </div>
  )
}