/**
 * 月度订阅相关类型定义
 */

// 订阅购买请求
export interface SubscriptionPurchaseRequest {
  plan_id?: string // 默认 "monthly_subscription"
}

// 订阅购买响应
export interface SubscriptionPurchaseResponse {
  success: boolean
  message: string
  checkout_url?: string
  checkout_session_id?: string
}

// 订阅状态响应
export interface SubscriptionStatusResponse {
  has_subscription: boolean
  subscription_status?: "trialing" | "active" | "past_due" | "canceled" | null
  current_period_end?: string
  cancel_at_period_end: boolean
  trial_end?: string
  is_trial: boolean
  stripe_subscription_id?: string
  stripe_customer_id?: string
}

// 取消订阅请求
export interface SubscriptionCancelRequest {
  at_period_end?: boolean // 默认 true，在周期结束时取消
}

// 取消订阅响应
export interface SubscriptionCancelResponse {
  success: boolean
  message: string
  cancel_at_period_end: boolean
  current_period_end: string
}

// 重新激活订阅响应
export interface SubscriptionReactivateResponse {
  success: boolean
  message: string
}

// 客户门户响应
export interface SubscriptionPortalResponse {
  success: boolean
  portal_url?: string
}

// 订阅信息（公开端点）
export interface SubscriptionInfo {
  plan_name: string
  price: number
  currency: string
  trial_days: number
  billing_period: string
  features: string[]
}
