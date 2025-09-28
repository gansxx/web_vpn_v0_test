// Dashboard utility functions and shared types

export type ProductItem = {
  product_name: string
  subscription_url?: string
  email?: string
  phone?: string
  buy_time?: string
  end_time?: string
}

export type OrderItem = {
  id: string
  date?: string
  amount?: string | number
  status?: string
  plan?: string
  raw?: any
}

export type TicketItem = {
  id: string
  subject?: string
  priority?: string
  category?: string
  status?: string
  created_at?: string
}

// Date formatting utility
export const fmtDate = (v?: string) => {
  try {
    const t = v ? Date.parse(v) : NaN
    return Number.isFinite(t) ? new Date(t).toLocaleString() : (v || "")
  } catch {
    return v || ""
  }
}

// Parse timestamp utility
export const parseTs = (v?: string) => {
  const t = v ? Date.parse(v) : NaN
  return Number.isFinite(t) ? t : -Infinity
}

// Sort products by buy_time (newest first)
export const sortProductsByDate = (products: ProductItem[]) => {
  return [...products].sort((a, b) => parseTs(b.buy_time) - parseTs(a.buy_time))
}

// Sort orders by date (newest first)
export const sortOrdersByDate = (orders: OrderItem[]) => {
  return [...orders].sort((a, b) => parseTs(b.date) - parseTs(a.date))
}

// Clear cookie utility for logout
export function clearCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`
}

// Map backend order fields to consistent display format
export const mapOrderData = (orderList: any[]): OrderItem[] => {
  return orderList.map((o: any, idx: number) => {
    const id = o.order_id || o.id || o.transaction_id || `ORD-${idx + 1}`
    const date = o.created_at || o.buy_time || o.date || o.paid_at || o.updated_at || ""
    const plan = o.plan || o.plan_name || o.product_name || o.title || "—"
    const rawAmount = o.amount ?? o.price ?? o.total ?? o.amount_cny ?? o.amount_usd
    const status = o.status || o.state || o.pay_status || "—"
    return {
      id: String(id),
      date: date ? String(date) : "",
      plan: String(plan),
      amount: rawAmount,
      status: String(status),
      raw: o
    }
  })
}

// Map backend ticket fields to consistent display format
export const mapTicketData = (ticketList: any[]): TicketItem[] => {
  return ticketList.map((t: any) => ({
    id: t.id || t.ticket_id || "",
    subject: t.subject || t.title || "",
    priority: t.priority || "",
    category: t.category || "",
    status: t.status || "",
    created_at: t.created_at || t.date || ""
  }))
}

// Get status badge class for orders
export const getOrderStatusBadgeClass = (status: string) => {
  const st = status || "—"
  if (st.includes("完成") || st.toLowerCase().includes("paid")) {
    return "bg-green-100 text-green-800"
  }
  if (st.includes("处理中") || st.toLowerCase().includes("pending")) {
    return "bg-yellow-100 text-yellow-800"
  }
  return "bg-gray-100 text-gray-800"
}

// Get priority badge class for tickets
export const getTicketPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case "高":
      return "bg-red-100 text-red-800"
    case "中":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-green-100 text-green-800"
  }
}

// Get status badge class for tickets
export const getTicketStatusBadgeClass = (status: string) => {
  switch (status) {
    case "已解决":
      return "bg-green-100 text-green-800"
    case "处理中":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Format amount display
export const formatAmount = (amount?: string | number) => {
  return typeof amount === "number" ? `¥${amount}` : (amount || "—")
}