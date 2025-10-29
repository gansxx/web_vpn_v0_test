/**
 * Stripe 支付 API 客户端
 */

import { API_BASE } from "./config"
import { handleApiError } from "./api-utils"
import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  PaymentStatusResponse,
} from "@/types/stripe"

/**
 * 创建 Stripe 支付意图
 */
export async function createPaymentIntent(
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> {
  try {
    const response = await fetch(`${API_BASE}/stripe/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await handleApiError(response)
      return {
        success: false,
        error: errorMessage,
      }
    }

    const result: CreatePaymentIntentResponse = await response.json()
    return result
  } catch (error) {
    console.error("创建支付意图失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "网络错误",
    }
  }
}

/**
 * 查询订单支付状态
 */
export async function getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
  try {
    const response = await fetch(`${API_BASE}/stripe/payment-status/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorMessage = await handleApiError(response)
      return {
        success: false,
        error: errorMessage,
      }
    }

    const result: PaymentStatusResponse = await response.json()
    return result
  } catch (error) {
    console.error("查询支付状态失败:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "网络错误",
    }
  }
}
