/**
 * 查询订单产品生成状态（用于轮询）
 */

import { API_BASE } from "./config"
import { handleApiError } from "./api-utils"
import type {
  FreepurchaseRequest,
  OrderProductStatusResponse,
  FreePlanStatusResponse,
} from "@/types/free-plan"

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