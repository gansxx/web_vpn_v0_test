import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TicketItem, getTicketPriorityBadgeClass, getTicketStatusBadgeClass } from "@/lib/dashboard-utils"

interface TicketsTableProps {
  tickets: TicketItem[]
  loading: boolean
  error: string | null
  onReload: () => void
  onNewTicket: () => void
}

export function TicketsTable({ tickets, loading, error, onReload, onNewTicket }: TicketsTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">工单列表</h1>
        <div className="flex gap-2">
          <Button onClick={onReload} disabled={loading} variant="outline">
            {loading ? "刷新中..." : "刷新"}
          </Button>
          <Button onClick={onNewTicket} className="bg-blue-600 hover:bg-blue-700">
            提交工单
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工单号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    优先级
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">正在加载工单...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
                  </tr>
                )}
                {!loading && !error && tickets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">暂无工单</td>
                  </tr>
                )}
                {!loading && !error && tickets.length > 0 && (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.subject || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.category || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTicketPriorityBadgeClass(ticket.priority || "")}`}
                        >
                          {ticket.priority || "中"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTicketStatusBadgeClass(ticket.status || "")}`}
                        >
                          {ticket.status || "待处理"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}