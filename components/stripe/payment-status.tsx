"use client"

/**
 * 支付状态显示组件
 */

import { useEffect, useState } from "react"
import { getPaymentStatus } from "@/lib/stripe-api"
import { getPaymentStatusText, getPaymentStatusClassName } from "@/lib/stripe-utils"
import type { PaymentStatusResponse } from "@/types/stripe"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentStatusProps {
  orderId: string
  autoRefresh?: boolean
  refreshInterval?: number
  onStatusChange?: (status: PaymentStatusResponse) => void
}

export function PaymentStatus({
  orderId,
  autoRefresh = true,
  refreshInterval = 2000,
  onStatusChange,
}: PaymentStatusProps) {
  const [status, setStatus] = useState<PaymentStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const fetchStatus = async () => {
    try {
      const result = await getPaymentStatus(orderId)
      setStatus(result)
      onStatusChange?.(result)

      if (!result.success) {
        setError(result.error || "查询失败")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "查询失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchStatus()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [orderId, autoRefresh, refreshInterval])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">查询支付状态...</span>
      </div>
    )
  }

  if (error || !status?.success) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-600" />
        <p className="mt-2 text-red-600">{error || "查询失败"}</p>
        <Button onClick={fetchStatus} variant="outline" className="mt-4">
          重试
        </Button>
      </div>
    )
  }

  const renderStatusIcon = () => {
    switch (status.stripe_payment_status) {
      case "succeeded":
        return <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
      case "processing":
        return <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
      case "payment_failed":
      case "canceled":
        return <XCircle className="mx-auto h-16 w-16 text-red-600" />
      default:
        return <Clock className="mx-auto h-16 w-16 text-yellow-600" />
    }
  }

  return (
    <div className="rounded-lg border bg-white p-8">
      <div className="text-center">
        {renderStatusIcon()}

        <h3 className="mt-4 text-2xl font-semibold">
          {getPaymentStatusText(status.stripe_payment_status)}
        </h3>

        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">订单号:</span> {status.order_id}
          </p>
          <p>
            <span className="font-medium">产品:</span> {status.product_name}
          </p>
          <p>
            <span className="font-medium">金额:</span> {(status.amount || 0) / 100} USD
          </p>
          <p>
            <span className="font-medium">订单状态:</span>
            <span className={getPaymentStatusClassName(status.stripe_payment_status)}>
              {" "}
              {status.order_status}
            </span>
          </p>
        </div>

        {status.stripe_payment_status === "succeeded" && (
          <Button className="mt-6" onClick={() => (window.location.href = "/dashboard")}>
            返回 Dashboard
          </Button>
        )}

        {(status.stripe_payment_status === "payment_failed" ||
          status.stripe_payment_status === "canceled") && (
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => window.location.reload()}
          >
            重新支付
          </Button>
        )}
      </div>
    </div>
  )
}
