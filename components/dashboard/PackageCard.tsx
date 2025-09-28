import { Button } from "@/components/ui/button"
import { ProductItem, fmtDate } from "@/lib/dashboard-utils"

interface PackageCardProps {
  products: ProductItem[]
  loading: boolean
  error: string | null
  onReload: () => void
}

export function PackageCard({ products, loading, error, onReload }: PackageCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
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
            className="bg-white text-gray-900 hover:bg-gray-100 border border-transparent"
          >
            {loading ? "刷新中..." : "刷新"}
          </Button>
        </div>

        {loading && (
          <p className="text-gray-300">正在加载...</p>
        )}

        {!loading && error && (
          <p className="text-red-300">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <>
            <p className="text-gray-300 mb-6">您还没有激活的套餐</p>
            <p className="text-gray-400 mb-8">立即开通套餐选择适合的服务</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              兑换礼品卡
            </button>
          </>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="bg-white/5 rounded-lg overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-white/10 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">套餐名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">购买时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">到期时间</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, idx) => (
                    <tr key={idx} className="border-t border-white/10">
                      <td className="px-4 py-3 text-sm">{p.product_name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {p.buy_time ? new Date(p.buy_time).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {p.end_time ? new Date(p.end_time).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white bg-opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
    </div>
  )
}