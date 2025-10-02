import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TicketItem, getTicketPriorityBadgeClass, getTicketStatusBadgeClass } from "@/lib/dashboard-utils"
import { useTicketDetail } from "@/hooks/useTicketDetail"

interface TicketDetailDialogProps {
  ticketId: string | null
  open: boolean
  onClose: () => void
}

export function TicketDetailDialog({ ticketId, open, onClose }: TicketDetailDialogProps) {
  const { ticket, loading, error, refetch } = useTicketDetail(ticketId)

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>工单详情</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading || !ticketId}
              className="ml-4"
            >
              {loading ? "刷新中..." : "刷新"}
            </Button>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>加载中...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && ticket && (
          <div className="space-y-6">
          {/* 工单号 */}
          <div>
            <label className="text-sm font-medium text-gray-500">工单号</label>
            <p className="mt-1 text-base text-gray-900">{ticket.id}</p>
          </div>

          {/* 标题 */}
          <div>
            <label className="text-sm font-medium text-gray-500">标题</label>
            <p className="mt-1 text-base text-gray-900">{ticket.subject || "-"}</p>
          </div>

          {/* 分类、优先级、状态 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">分类</label>
              <p className="mt-1 text-base text-gray-900">{ticket.category || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">优先级</label>
              <div className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTicketPriorityBadgeClass(ticket.priority || "")}`}
                >
                  {ticket.priority || "中"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">状态</label>
              <div className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTicketStatusBadgeClass(ticket.status || "")}`}
                >
                  {ticket.status || "待处理"}
                </span>
              </div>
            </div>
          </div>

          {/* 创建时间 */}
          <div>
            <label className="text-sm font-medium text-gray-500">创建时间</label>
            <p className="mt-1 text-base text-gray-900">
              {ticket.created_at ? new Date(ticket.created_at).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              }) : "-"}
            </p>
          </div>

          {/* 问题描述 */}
          <div>
            <label className="text-sm font-medium text-gray-500">问题描述</label>
            <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {ticket.description || "无描述"}
              </p>
            </div>
          </div>

          {/* 管理员回复 */}
          <div>
            <label className="text-sm font-medium text-gray-500">管理员回复</label>
            {ticket.reply ? (
              <div className="mt-2 space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {ticket.reply}
                  </p>
                </div>
                {ticket.replied_at && (
                  <p className="text-xs text-gray-500">
                    回复时间: {new Date(ticket.replied_at).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⏳ 暂无回复，我们会尽快处理您的问题。如有紧急情况，请通过邮件或客服系统联系我们。
                </p>
              </div>
            )}
          </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
