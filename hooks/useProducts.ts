import { useCallback, useEffect, useState } from "react"
import { API_BASE } from "@/lib/config"
import { ProductItem, sortProductsByDate } from "@/lib/dashboard-utils"
import { useSessionSubscriptionUrl } from "./useSessionSubscriptionUrl"

export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { storeSubscriptionUrl } = useSessionSubscriptionUrl()

  const reloadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`${API_BASE}/user/products`, { credentials: "include" })
      if (!r.ok) {
        throw new Error(`加载失败: ${r.status}`)
      }
      const data = await r.json()
      const productsData = Array.isArray(data) ? data : []
      setProducts(productsData)

      // Store subscription URL in session storage when products are loaded
      storeSubscriptionUrl(productsData)

    } catch (e: any) {
      setError(e?.message || "加载失败")
    } finally {
      setLoading(false)
    }
  }, [storeSubscriptionUrl])

  useEffect(() => {
    reloadProducts()
  }, [reloadProducts])

  const sortedProducts = sortProductsByDate(products)

  return {
    products: sortedProducts,
    loading,
    error,
    reloadProducts
  }
}