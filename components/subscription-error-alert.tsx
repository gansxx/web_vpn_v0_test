/**
 * 订阅错误提示组件
 *
 * 根据不同的错误类型显示不同的提示和操作建议
 */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, Info, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { parseSubscriptionError } from "@/lib/subscription-api"

interface SubscriptionErrorAlertProps {
  error: Error
  onRetry?: () => void
}

export function SubscriptionErrorAlert({ error, onRetry }: SubscriptionErrorAlertProps) {
  const errorInfo = parseSubscriptionError(error.message)

  // 根据错误类型选择图标和样式
  const getErrorStyle = () => {
    switch (errorInfo.type) {
      case 'already_subscribed':
        return {
          icon: <Info className="h-4 w-4" />,
          variant: "default" as const,
          title: "已是订阅用户"
        }
      case 'config_error':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          variant: "destructive" as const,
          title: "系统配置错误"
        }
      case 'order_failed':
      case 'checkout_failed':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: "destructive" as const,
          title: "购买失败"
        }
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: "destructive" as const,
          title: "发生错误"
        }
    }
  }

  const style = getErrorStyle()

  // 根据错误类型显示不同的操作按钮
  const renderAction = () => {
    switch (errorInfo.type) {
      case 'already_subscribed':
        return (
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="mt-2">
              查看我的订阅
            </Button>
          </Link>
        )

      case 'config_error':
        return (
          <Link href="/support">
            <Button variant="outline" size="sm" className="mt-2">
              联系客服
            </Button>
          </Link>
        )

      case 'order_failed':
      case 'checkout_failed':
        return onRetry ? (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        ) : null

      default:
        return null
    }
  }

  return (
    <Alert variant={style.variant}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1">
          <AlertTitle>{style.title}</AlertTitle>
          <AlertDescription className="mt-2">
            {errorInfo.userMessage}
          </AlertDescription>
          {errorInfo.actionHint && (
            <p className="text-sm text-muted-foreground mt-1">
              {errorInfo.actionHint}
            </p>
          )}
          {renderAction()}
        </div>
      </div>
    </Alert>
  )
}

/**
 * 使用示例：
 *
 * ```tsx
 * import { SubscriptionErrorAlert } from "@/components/subscription-error-alert"
 * import { purchaseSubscription } from "@/lib/subscription-api"
 *
 * function SubscriptionPage() {
 *   const [error, setError] = useState<Error | null>(null)
 *   const [loading, setLoading] = useState(false)
 *
 *   const handlePurchase = async () => {
 *     setLoading(true)
 *     setError(null)
 *
 *     try {
 *       const result = await purchaseSubscription({ phone: "" })
 *       if (result.checkout_url) {
 *         window.location.href = result.checkout_url
 *       }
 *     } catch (err) {
 *       setError(err instanceof Error ? err : new Error("Unknown error"))
 *     } finally {
 *       setLoading(false)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       {error && (
 *         <SubscriptionErrorAlert
 *           error={error}
 *           onRetry={handlePurchase}
 *         />
 *       )}
 *
 *       <button onClick={handlePurchase} disabled={loading}>
 *         {loading ? "处理中..." : "购买订阅"}
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
