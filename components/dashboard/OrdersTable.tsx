import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OrderItem, fmtDate, formatAmount, getOrderStatusBadgeClass } from "@/lib/dashboard-utils"

interface OrdersTableProps {
  orders: OrderItem[]
  loading: boolean
  error: string | null
  onReload: () => void
}

export function OrdersTable({ orders, loading, error, onReload }: OrdersTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">订单列表</h1>
        <Button onClick={onReload} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "刷新中..." : "刷新"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    套餐
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">正在加载订单...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
                  </tr>
                )}
                {!loading && !error && orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">暂无订单</td>
                  </tr>
                )}
                {!loading && !error && orders.length > 0 && (
                  <>
                    {orders.map((order) => {
                      const amountDisplay = formatAmount(order.amount)
                      const st = order.status || "—"
                      const badgeClass = getOrderStatusBadgeClass(st)
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fmtDate(order.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.plan || "—"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{amountDisplay}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>{st}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button variant="outline" size="sm">查看详情</Button>
                          </td>
                        </tr>
                      )
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}