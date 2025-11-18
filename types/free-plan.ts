//免费套餐购买struct
export interface FreepurchaseRequest {
  phone?: string
  plan_id?: string
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

// 免费套餐状态检查响应
export interface FreePlanStatusResponse {
  has_free_plan: boolean
  free_plans: Array<{
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

export type ProductStatus = "pending" | "processing" | "completed" | "failed"