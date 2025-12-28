# 订阅功能前端使用指南

## 更新说明

**日期**: 2025-12-26
**改进内容**: 优化订阅购买的错误提示，提供更友好的用户体验

## 核心改进

### 1. 统一的错误响应格式

后端现在返回统一的响应格式，无论成功还是失败：

```typescript
interface SubscriptionPurchaseResponse {
  success: boolean
  message: string
  order_id?: string | null
  checkout_url?: string | null
  checkout_session_id?: string | null
  amount?: number
  currency?: string
  plan_name?: string
}
```

### 2. 改进的 API 客户端

`lib/subscription-api.ts` 已更新：

```typescript
// ✅ 新版本 - 总是检查 success 字段
const result = await purchaseSubscription({ phone: "" })
// result.success 为 false 时会抛出包含详细错误信息的异常
```

### 3. 智能错误解析

提供 `parseSubscriptionError()` 函数来解析错误类型和建议操作：

```typescript
import { parseSubscriptionError } from "@/lib/subscription-api"

const errorInfo = parseSubscriptionError(error.message)
// {
//   type: 'already_subscribed',
//   userMessage: "您已有活跃订阅（状态: 试用中），有效期至 2025-01-10",
//   actionHint: "您可以在订阅管理中查看当前订阅详情"
// }
```

### 4. 专用错误提示组件

`components/subscription-error-alert.tsx` 根据错误类型自动显示合适的提示和操作：

```tsx
<SubscriptionErrorAlert
  error={error}
  onRetry={handlePurchase}
/>
```

## 完整使用示例

### 基础示例

```tsx
"use client"

import { useState } from "react"
import { purchaseSubscription } from "@/lib/subscription-api"
import { SubscriptionErrorAlert } from "@/components/subscription-error-alert"
import { Button } from "@/components/ui/button"

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await purchaseSubscription({
        phone: "" // 可选
      })

      // 成功：跳转到 Stripe Checkout
      if (result.checkout_url) {
        window.location.href = result.checkout_url
      }
    } catch (err) {
      // 错误：显示详细提示
      setError(err instanceof Error ? err : new Error("未知错误"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">购买订阅</h1>

      {error && (
        <SubscriptionErrorAlert
          error={error}
          onRetry={handlePurchase}
        />
      )}

      <div className="mt-6">
        <Button
          onClick={handlePurchase}
          disabled={loading}
          size="lg"
        >
          {loading ? "处理中..." : "立即购买"}
        </Button>
      </div>
    </div>
  )
}
```

### 高级示例：带加载状态和成功提示

```tsx
"use client"

import { useState } from "react"
import { purchaseSubscription } from "@/lib/subscription-api"
import { SubscriptionErrorAlert } from "@/components/subscription-error-alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function SubscriptionPageAdvanced() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await purchaseSubscription({
        phone: ""
      })

      if (result.checkout_url) {
        setSuccess(true)

        // 显示成功提示后跳转
        setTimeout(() => {
          window.location.href = result.checkout_url!
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("未知错误"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>月度订阅</CardTitle>
          <CardDescription>
            享受 7 天免费试用，随时可取消
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 错误提示 */}
          {error && (
            <div className="mb-4">
              <SubscriptionErrorAlert
                error={error}
                onRetry={handlePurchase}
              />
            </div>
          )}

          {/* 成功提示 */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">
                  订单创建成功！
                </p>
                <p className="text-green-700 text-sm">
                  正在跳转到支付页面...
                </p>
              </div>
            </div>
          )}

          {/* 购买按钮 */}
          <Button
            onClick={handlePurchase}
            disabled={loading || success}
            size="lg"
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "处理中..." : success ? "跳转中..." : "开始 7 天免费试用"}
          </Button>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            试用期结束后每月 $9.99，随时可取消
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 自定义错误处理示例

```tsx
"use client"

import { useState } from "react"
import { purchaseSubscription, parseSubscriptionError } from "@/lib/subscription-api"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function CustomErrorHandling() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorInfo, setErrorInfo] = useState<ReturnType<typeof parseSubscriptionError> | null>(null)

  const handlePurchase = async () => {
    setLoading(true)
    setErrorInfo(null)

    try {
      const result = await purchaseSubscription({ phone: "" })

      if (result.checkout_url) {
        window.location.href = result.checkout_url
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("未知错误")
      const info = parseSubscriptionError(error.message)
      setErrorInfo(info)

      // 根据错误类型执行不同的逻辑
      if (info.type === 'already_subscribed') {
        // 已有订阅：3秒后自动跳转到订阅管理
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {errorInfo && (
        <Alert variant={errorInfo.type === 'already_subscribed' ? 'default' : 'destructive'}>
          <AlertDescription>
            <p>{errorInfo.userMessage}</p>
            {errorInfo.actionHint && (
              <p className="text-sm mt-1">{errorInfo.actionHint}</p>
            )}
            {errorInfo.type === 'already_subscribed' && (
              <p className="text-sm mt-2 text-muted-foreground">
                3秒后自动跳转到订阅管理...
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={handlePurchase} disabled={loading}>
        {loading ? "处理中..." : "购买订阅"}
      </Button>
    </div>
  )
}
```

## 错误类型说明

### 1. 已有活跃订阅 (already_subscribed)

**错误消息示例**：
```
"您已有活跃订阅（状态: 试用中），有效期至 2025-01-10"
```

**推荐处理**：
- 显示信息类提示（蓝色）
- 提供"查看我的订阅"按钮
- 可考虑自动跳转到订阅管理页面

### 2. 配置错误 (config_error)

**错误消息示例**：
```
"订阅套餐配置错误，请联系管理员"
```

**推荐处理**：
- 显示警告类提示（黄色）
- 提供"联系客服"按钮
- 记录错误到监控系统

### 3. 订单创建失败 (order_failed)

**错误消息示例**：
```
"创建订单失败，请稍后重试"
```

**推荐处理**：
- 显示错误类提示（红色）
- 提供"重试"按钮
- 临时性错误，用户可重试

### 4. Checkout 创建失败 (checkout_failed)

**错误消息示例**：
```
"创建订阅失败: Stripe API 错误信息"
```

**推荐处理**：
- 显示错误类提示（红色）
- 提供"重试"按钮
- 如果持续失败，建议联系客服

### 5. 未知错误 (unknown)

**推荐处理**：
- 显示通用错误提示
- 提供"重试"或"返回"按钮
- 记录详细错误信息

## 最佳实践

### 1. 错误日志记录

```typescript
try {
  const result = await purchaseSubscription({ phone: "" })
  // ...
} catch (err) {
  // 记录错误到监控服务
  console.error("[Subscription Purchase Error]", {
    error: err instanceof Error ? {
      message: err.message,
      stack: err.stack
    } : err,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  })

  // 可选：发送到 Sentry 等服务
  // Sentry.captureException(err)

  setError(err instanceof Error ? err : new Error("未知错误"))
}
```

### 2. 加载状态管理

```typescript
const [loading, setLoading] = useState(false)

const handlePurchase = async () => {
  if (loading) return // 防止重复点击

  setLoading(true)
  try {
    // ...
  } finally {
    setLoading(false) // 确保无论成功失败都重置状态
  }
}
```

### 3. 错误恢复

```typescript
const MAX_RETRIES = 3
const [retryCount, setRetryCount] = useState(0)

const handlePurchase = async () => {
  try {
    const result = await purchaseSubscription({ phone: "" })
    setRetryCount(0) // 成功后重置重试次数
    // ...
  } catch (err) {
    setError(err instanceof Error ? err : new Error("未知错误"))

    // 自动重试逻辑（仅对临时性错误）
    const errorInfo = parseSubscriptionError(
      err instanceof Error ? err.message : "未知错误"
    )

    if (
      (errorInfo.type === 'order_failed' || errorInfo.type === 'checkout_failed') &&
      retryCount < MAX_RETRIES
    ) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        handlePurchase() // 自动重试
      }, 2000 * (retryCount + 1)) // 指数退避
    }
  }
}
```

### 4. 用户体验优化

```typescript
const handlePurchase = async () => {
  setLoading(true)
  setError(null)

  try {
    const result = await purchaseSubscription({ phone: "" })

    if (result.checkout_url) {
      // 显示加载提示
      toast.success("正在跳转到支付页面...")

      // 给用户一点时间看到成功提示
      await new Promise(resolve => setTimeout(resolve, 500))

      // 跳转
      window.location.href = result.checkout_url
    }
  } catch (err) {
    // 使用 toast 显示错误
    const errorInfo = parseSubscriptionError(
      err instanceof Error ? err.message : "未知错误"
    )

    toast.error(errorInfo.userMessage, {
      description: errorInfo.actionHint,
      action: errorInfo.type === 'already_subscribed' ? {
        label: "查看订阅",
        onClick: () => router.push('/dashboard')
      } : undefined
    })

    setError(err instanceof Error ? err : new Error("未知错误"))
  } finally {
    setLoading(false)
  }
}
```

## 测试

### 测试各种错误场景

1. **已有订阅**：使用已订阅用户账号测试
2. **未登录**：清除 cookies 后测试
3. **网络错误**：断网后测试
4. **正常流程**：使用新用户账号测试完整流程

### 测试清单

- [ ] 错误消息正确显示
- [ ] 错误类型正确识别
- [ ] 操作按钮正确显示
- [ ] 加载状态正确管理
- [ ] 重试功能正常工作
- [ ] 跳转链接正确
- [ ] 移动端显示正常
- [ ] 无障碍功能正常

## 迁移检查清单

- [x] 更新 `lib/subscription-api.ts` 的 `purchaseSubscription` 函数
- [x] 添加 `parseSubscriptionError` 辅助函数
- [x] 创建 `SubscriptionErrorAlert` 组件
- [ ] 更新使用订阅功能的页面组件
- [ ] 测试所有错误场景
- [ ] 更新相关文档

## 相关文件

- `lib/subscription-api.ts` - API 客户端（已更新）
- `components/subscription-error-alert.tsx` - 错误提示组件（新增）
- `types/subscription.ts` - TypeScript 类型定义
- 后端文档: `/root/self_code/web_vpn/web_backend/docs/SUBSCRIPTION_ERROR_HANDLING.md`

## 总结

✅ **改进效果**：
- 用户看到清晰的中文错误提示
- 根据错误类型提供相应的操作建议
- 更好的加载状态和用户反馈
- 统一的错误处理逻辑

🎯 **下一步**：
1. 更新现有页面使用新的错误处理方式
2. 测试所有错误场景
3. 收集用户反馈并持续优化
