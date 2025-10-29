"use client"

/**
 * 订单产品状态轮询组件
 * 用于高级套餐购买后追踪产品生成进度
 */

import { useEffect, useState, useCallback } from "react"
import { getOrderProductStatus } from "@/lib/advanced-plan-api"
import type { OrderProductStatusResponse, ProductStatus } from "@/types/advanced-plan"
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderStatusPollingProps {
  orderId: string
  onCompleted?: () => void
  onFailed?: () => void
  maxPolls?: number // 最大轮询次数，默认15次
  pollInterval?: number // 轮询间隔（毫秒），默认2000ms
}

export function OrderStatusPolling({
  orderId,
  onCompleted,
  onFailed,
  maxPolls = 15,
  pollInterval = 2000,
}: OrderStatusPollingProps) {
  const [status, setStatus] = useState<OrderProductStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [pollCount, setPollCount] = useState(0)
  const [timeoutReached, setTimeoutReached] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      const result = await getOrderProductStatus(orderId)
      setStatus(result)
      setError("")

      // 检查是否完成或失败
      if (result.is_completed) {
        onCompleted?.()
      } else if (result.is_failed) {
        onFailed?.()
      }

      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "查询订单状态失败"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [orderId, onCompleted, onFailed])

  useEffect(() => {
    // 立即执行第一次查询
    fetchStatus()

    // 设置轮询定时器
    const intervalId = setInterval(async () => {
      setPollCount((prev) => prev + 1)

      // 检查是否超过最大轮询次数
      if (pollCount >= maxPolls - 1) {
        setTimeoutReached(true)
        clearInterval(intervalId)
        return
      }

      try {
        const result = await fetchStatus()

        // 如果后端返回不需要继续轮询，则停止
        if (!result.should_continue_polling) {
          clearInterval(intervalId)
        }
      } catch (err) {
        // 出错时也停止轮询
        clearInterval(intervalId)
      }
    }, pollInterval)

    // 清理函数
    return () => {
      clearInterval(intervalId)
    }
  }, [orderId, fetchStatus, maxPolls, pollCount, pollInterval])

  const getStatusIcon = (productStatus: ProductStatus) => {
    switch (productStatus) {
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-600" />
      case "processing":
        return <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      case "completed":
        return <CheckCircle2 className="h-16 w-16 text-green-600" />
      case "failed":
        return <XCircle className="h-16 w-16 text-red-600" />
      default:
        return <AlertCircle className="h-16 w-16 text-gray-600" />
    }
  }

  const getStatusColor = (productStatus: ProductStatus) => {
    switch (productStatus) {
      case "pending":
        return "text-yellow-600"
      case "processing":
        return "text-blue-600"
      case "completed":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading && !status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">正在查询订单状态...</span>
        </CardContent>
      </Card>
    )
  }

  if (error && !status) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <p className="mt-4 text-red-600">{error}</p>
            <Button onClick={fetchStatus} variant="outline" className="mt-4">
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>订单状态追踪</CardTitle>
        <CardDescription>订单编号: {orderId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 状态图标和消息 */}
          <div className="text-center">
            {status && getStatusIcon(status.product_status)}
            <h3 className={`mt-4 text-2xl font-semibold ${status && getStatusColor(status.product_status)}`}>
              {status?.message || "查询中..."}
            </h3>
          </div>

          {/* 轮询进度提示 */}
          {status?.should_continue_polling && !timeoutReached && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-sm text-blue-800">
                  正在自动刷新状态... ({pollCount}/{maxPolls})
                </p>
              </div>
              <p className="mt-2 text-xs text-center text-blue-600">
                您已经购买成功，预计3-10秒内生成产品链接，请稍等
              </p>
            </div>
          )}

          {/* 超时提示 */}
          {timeoutReached && status?.should_continue_polling && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <div className="text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-amber-600" />
                <p className="mt-2 text-sm text-amber-800 font-medium">
                  轮询已超时（30秒）
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  产品生成可能需要更长时间，请稍后手动刷新查看
                </p>
                <Button onClick={fetchStatus} variant="outline" className="mt-4" size="sm">
                  手动刷新状态
                </Button>
              </div>
            </div>
          )}

          {/* 完成状态 */}
          {status?.is_completed && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                <p className="mt-2 text-sm text-green-800 font-medium">
                  产品生成完成！
                </p>
                <p className="mt-1 text-xs text-green-700">
                  请返回Dashboard查看您的订阅链接，在文档中心中查看使用教程
                </p>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="mt-4 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  返回 Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* 失败状态 */}
          {status?.is_failed && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="text-center">
                <XCircle className="mx-auto h-8 w-8 text-red-600" />
                <p className="mt-2 text-sm text-red-800 font-medium">
                  产品生成失败
                </p>
                <p className="mt-1 text-xs text-red-700">
                  请联系客服处理，订单编号：{orderId}
                </p>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  variant="outline"
                  className="mt-4"
                  size="sm"
                >
                  返回 Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* 调试信息（仅开发环境） */}
          {process.env.NODE_ENV === "development" && status && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs">
              <p className="font-medium text-gray-700">调试信息:</p>
              <pre className="mt-2 text-gray-600">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
