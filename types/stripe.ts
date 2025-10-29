/**
 * Stripe 支付相关类型定义
 */

// 创建支付意图请求
export interface CreatePaymentIntentRequest {
  product_name: string
  trade_num: number
  amount: number // 单位：分
  currency: string
  email: string
  phone?: string
}

// 创建支付意图响应
export interface CreatePaymentIntentResponse {
  success: boolean
  order_id?: string
  payment_intent_id?: string
  client_secret?: string
  customer_id?: string
  amount?: number
  currency?: string
  status?: string
  error?: string
}

// 支付状态响应
export interface PaymentStatusResponse {
  success: boolean
  order_id?: string
  payment_provider?: string
  stripe_payment_intent_id?: string
  stripe_payment_status?: string
  order_status?: string
  amount?: number
  product_name?: string
  created_at?: string
  error?: string
}

// Stripe 支付状态枚举
export type StripePaymentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "canceled"
  | "payment_failed"

// 支付表单数据
export interface PaymentFormData {
  email: string
  phone: string
  product_name: string
  amount: number
}
