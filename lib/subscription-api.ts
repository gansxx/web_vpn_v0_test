/**
 * 月度订阅 API 客户端
 *
 * 错误处理说明：
 * - purchaseSubscription: 已更新为新的统一响应格式（检查 success 字段）
 * - 其他函数: 使用旧的 handleApiError 方式（待迁移）
 *
 * 新的错误响应格式示例：
 * {
 *   success: false,
 *   message: "您已有活跃订阅（状态: 试用中），有效期至 2025-01-10",
 *   order_id: null,
 *   checkout_url: null,
 *   plan_name: "月度订阅"
 * }
 */

import { API_BASE } from "./config"
import { handleApiError } from "./api-utils"
import type {
  SubscriptionPurchaseRequest,
  SubscriptionPurchaseResponse,
  SubscriptionStatusResponse,
  SubscriptionCancelRequest,
  SubscriptionCancelResponse,
  SubscriptionReactivateResponse,
  SubscriptionPortalResponse,
} from "@/types/subscription"

/**
 * 订阅错误类型
 */
export class SubscriptionError extends Error {
  constructor(
    message: string,
    public readonly details?: {
      hasActiveSubscription?: boolean
      subscriptionStatus?: string
      validUntil?: string
      planName?: string
    }
  ) {
    super(message)
    this.name = "SubscriptionError"
  }
}

/**
 * 从错误消息中提取详细信息
 */
export function parseSubscriptionError(message: string): {
  type: 'already_subscribed' | 'config_error' | 'order_failed' | 'checkout_failed' | 'unknown'
  userMessage: string
  actionHint?: string
} {
  if (message.includes("已有活跃订阅")) {
    return {
      type: 'already_subscribed',
      userMessage: message,
      actionHint: "您可以在订阅管理中查看当前订阅详情"
    }
  }

  if (message.includes("配置错误") || message.includes("联系管理员")) {
    return {
      type: 'config_error',
      userMessage: message,
      actionHint: "请联系客服支持获取帮助"
    }
  }

  if (message.includes("创建订单失败")) {
    return {
      type: 'order_failed',
      userMessage: message,
      actionHint: "请稍后重试"
    }
  }

  if (message.includes("创建订阅失败") || message.includes("Checkout")) {
    return {
      type: 'checkout_failed',
      userMessage: message,
      actionHint: "请稍后重试或联系客服"
    }
  }

  return {
    type: 'unknown',
    userMessage: message,
    actionHint: "如果问题持续存在，请联系客服"
  }
}

/**
 * 购买月度订阅（创建 Stripe Checkout Session）
 */
export async function purchaseSubscription(
  data: SubscriptionPurchaseRequest = {}
): Promise<SubscriptionPurchaseResponse> {
  try {
    const response = await fetch(`${API_BASE}/subscription/monthly_subscription/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        phone: data.phone || "",
      }),
    })

    // 总是先解析 JSON 响应（后端返回统一的 SubscriptionPurchaseResponse 格式）
    const result: SubscriptionPurchaseResponse = await response.json()

    // 检查 success 字段而不是 HTTP 状态码
    if (!result.success) {
      // result.message 已经是用户友好的中文错误提示
      throw new Error(result.message)
    }

    return result
  } catch (error) {
    console.error("购买月度订阅失败:", error)
    throw error
  }
}

/**
 * 获取用户订阅状态
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  try {
    const response = await fetch(`${API_BASE}/subscription/monthly_subscription/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorMessage = await handleApiError(response)
      throw new Error(errorMessage)
    }

    const result: SubscriptionStatusResponse = await response.json()
    return result
  } catch (error) {
    console.error("获取订阅状态失败:", error)
    throw error
  }
}

/**
 * 取消订阅
 */
export async function cancelSubscription(
  data: SubscriptionCancelRequest = { at_period_end: true }
): Promise<SubscriptionCancelResponse> {
  try {
    const response = await fetch(`${API_BASE}/subscription/monthly_subscription/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await handleApiError(response)
      throw new Error(errorMessage)
    }

    const result: SubscriptionCancelResponse = await response.json()
    return result
  } catch (error) {
    console.error("取消订阅失败:", error)
    throw error
  }
}

/**
 * 重新激活订阅（仅在订阅标记为取消但尚未到期时可用）
 */
export async function reactivateSubscription(): Promise<SubscriptionReactivateResponse> {
  try {
    const response = await fetch(`${API_BASE}/subscription/monthly_subscription/reactivate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorMessage = await handleApiError(response)
      throw new Error(errorMessage)
    }

    const result: SubscriptionReactivateResponse = await response.json()
    return result
  } catch (error) {
    console.error("重新激活订阅失败:", error)
    throw error
  }
}

/**
 * 获取 Stripe 客户门户 URL
 */
export async function getSubscriptionPortal(): Promise<SubscriptionPortalResponse> {
  try {
    const response = await fetch(`${API_BASE}/subscription/monthly_subscription/portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorMessage = await handleApiError(response)
      throw new Error(errorMessage)
    }

    const result: SubscriptionPortalResponse = await response.json()
    return result
  } catch (error) {
    console.error("获取客户门户失败:", error)
    throw error
  }
}

/**
 * 检查用户是否有活跃订阅
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const status = await getSubscriptionStatus()
    return (
      status.has_subscription &&
      (status.subscription_status === "active" ||
        status.subscription_status === "trialing")
    )
  } catch (error) {
    console.error("检查订阅状态失败:", error)
    return false
  }
}
