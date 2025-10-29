/**
 * Stripe 工具函数
 */

import { loadStripe, Stripe } from "@stripe/stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "./config"

// Stripe 实例缓存
let stripePromise: Promise<Stripe | null> | null = null

/**
 * 获取 Stripe 实例（单例模式）
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error("Stripe Publishable Key 未配置")
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

/**
 * 格式化金额显示（分 → 元）
 * @param amount 金额（分）
 * @param currency 货币代码
 * @returns 格式化后的金额字符串
 */
export function formatAmount(amount: number, currency: string = "usd"): string {
  const majorUnits = amount / 100
  const currencySymbols: Record<string, string> = {
    usd: "$",
    cny: "¥",
    eur: "€",
    gbp: "£",
  }

  const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase()
  return `${symbol}${majorUnits.toFixed(2)}`
}

/**
 * 验证 Stripe 配置
 */
export function validateStripeConfig(): boolean {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.error("Stripe Publishable Key 未配置，请在 .env.local 中设置 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
    return false
  }

  if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
    console.error("Stripe Publishable Key 格式不正确，应以 pk_ 开头")
    return false
  }

  return true
}

/**
 * 获取支付状态的中文描述
 */
export function getPaymentStatusText(status?: string): string {
  const statusMap: Record<string, string> = {
    requires_payment_method: "等待支付",
    requires_confirmation: "等待确认",
    requires_action: "需要操作",
    processing: "处理中",
    succeeded: "支付成功",
    canceled: "已取消",
    payment_failed: "支付失败",
  }

  return statusMap[status || ""] || "未知状态"
}

/**
 * 获取支付状态的样式类名
 */
export function getPaymentStatusClassName(status?: string): string {
  const statusClassMap: Record<string, string> = {
    requires_payment_method: "text-gray-600",
    requires_confirmation: "text-blue-600",
    requires_action: "text-yellow-600",
    processing: "text-blue-600",
    succeeded: "text-green-600",
    canceled: "text-gray-600",
    payment_failed: "text-red-600",
  }

  return statusClassMap[status || ""] || "text-gray-600"
}
