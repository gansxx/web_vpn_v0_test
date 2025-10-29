/**
 * 无限流量套餐 API 客户端
 */

import { API_BASE } from "./config"
import { handleApiError } from "./api-utils"
import type {
  UnlimitedPlanPurchaseRequest,
  UnlimitedPlanPurchaseResponse,
  OrderProductStatusResponse,
  UnlimitedPlanStatusResponse,
} from "@/types/unlimited-plan"

/**
 * 购买无限流量套餐
 */
export async function purchaseUnlimitedPlan(
  data: UnlimitedPlanPurchaseRequest
): Promise<UnlimitedPlanPurchaseResponse> {
  try {
    const response = await fetch(`${API_BASE}/user/unlimited-plan/purchase`, {
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

    const result: UnlimitedPlanPurchaseResponse = await response.json()
    return result
  } catch (error) {
    console.error("购买无限流量套餐失败:", error)
    throw error
  }
}

/**
 * 检查用户是否拥有无限流量套餐
 */
export async function checkUnlimitedPlanStatus(): Promise<UnlimitedPlanStatusResponse> {
  try {
    const response = await fetch(`${API_BASE}/user/unlimited-plan`, {
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

    const result: UnlimitedPlanStatusResponse = await response.json()
    return result
  } catch (error) {
    console.error("检查无限流量套餐状态失败:", error)
    throw error
  }
}

/**
 * 查询订单产品生成状态（用于轮询）
 */
export async function getOrderProductStatus(
  orderId: string
): Promise<OrderProductStatusResponse> {
  try {
    const response = await fetch(`${API_BASE}/user/order-status/${orderId}`, {
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

    const result: OrderProductStatusResponse = await response.json()
    return result
  } catch (error) {
    console.error("查询订单产品状态失败:", error)
    throw error
  }
}

/**
 * 简化版：仅检查是否拥有无限流量套餐（返回布尔值）
 */
export async function hasUnlimitedPlan(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/user/unlimited-plan/simple`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      return false
    }

    const result = await response.json()
    return result.has_unlimited_plan === true
  } catch (error) {
    console.error("检查无限流量套餐失败:", error)
    return false
  }
}

/**
 * 根据 Stripe Checkout Session ID 查询订单
 * 用于从 Stripe Checkout 返回后获取 order_id
 */
export async function getOrderBySessionId(
  sessionId: string
): Promise<{ order_id: string; order_status: string; product_status: string }> {
  try {
    const response = await fetch(`${API_BASE}/user/order-by-session/${sessionId}`, {
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

    const result = await response.json()
    return result
  } catch (error) {
    console.error("根据 Session ID 查询订单失败:", error)
    throw error
  }
}
