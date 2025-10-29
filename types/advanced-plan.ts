/**
 * 高级套餐相关类型定义
 */

// 高级套餐购买请求
export interface AdvancedPlanPurchaseRequest {
  phone?: string
  plan_name: string
  payment_method: string // "stripe" 或 "h5zhifu"
  pay_type?: string // h5zhifu专用：alipay 或 wechat
}

// 高级套餐购买响应
export interface AdvancedPlanPurchaseResponse {
  success: boolean
  message: string
  order_id?: string
  provider: string // 支付提供商：stripe 或 h5zhifu
  payment_data?: {
    // Stripe Checkout 支付数据
    checkout_session_id?: string
    checkout_url?: string
    // Stripe Elements 支付数据（已废弃，保留向后兼容）
    payment_intent_id?: string
    client_secret?: string
    customer_id?: string
    // h5zhifu 支付数据
    payment_url?: string
    out_trade_no?: string
  }
  amount: number
  currency: string
  plan_name: string
}

// 订单产品状态响应
export interface OrderProductStatusResponse {
  order_id: string
  product_status: "pending" | "processing" | "completed" | "failed"
  message: string
  is_completed: boolean
  is_failed: boolean
  should_continue_polling: boolean
}

// 高级套餐状态检查响应
export interface AdvancedPlanStatusResponse {
  has_advanced_plan: boolean
  advanced_plans: Array<{
    id: string
    product_name: string
    subscription_url: string
    buy_time: string
    duration_days: number
    email: string
  }>
  all_products: Array<{
    id: string
    product_name: string
    subscription_url: string
    buy_time: string
    duration_days: number
    email: string
  }>
}

// 支付方式枚举
export type PaymentMethod = "stripe" | "h5zhifu"

// 产品状态枚举
export type ProductStatus = "pending" | "processing" | "completed" | "failed"
