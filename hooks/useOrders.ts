import { useCallback, useEffect, useState } from "react"
import { API_BASE } from "@/lib/config"
import { OrderItem, mapOrderData, sortOrdersByDate } from "@/lib/dashboard-utils"

export function useOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reloadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`${API_BASE}/user/orders`, { credentials: "include" })
      if (!r.ok) throw new Error(`加载失败: ${r.status}`)
      const data = await r.json()
      const list: any[] = Array.isArray(data) ? data : []
      const mapped = mapOrderData(list)
      setOrders(mapped)
    } catch (e: any) {
      setError(e?.message || "加载失败")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reloadOrders()
  }, [reloadOrders])

  const sortedOrders = sortOrdersByDate(orders)

  return {
    orders: sortedOrders,
    loading,
    error,
    reloadOrders
  }
}