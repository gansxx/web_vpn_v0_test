import { useCallback, useEffect, useState } from "react"
import { ProductItem } from "@/lib/dashboard-utils"

interface SessionSubscriptionData {
  url: string | null
  timestamp: number
  productName: string
  expiresAt: number
}

const SESSION_KEY = "subscription_url_cache"
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export function useSessionSubscriptionUrl() {
  const [sessionUrl, setSessionUrl] = useState<string | null>(null)
  const [lastProductName, setLastProductName] = useState<string | null>(null)

  // Load from session storage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        const data: SessionSubscriptionData = JSON.parse(stored)

        // Check if cache is still valid
        if (Date.now() < data.expiresAt && data.url) {
          setSessionUrl(data.url)
          setLastProductName(data.productName)
        } else {
          // Cache expired, clear it
          sessionStorage.removeItem(SESSION_KEY)
        }
      }
    } catch (error) {
      console.warn("Failed to load subscription URL from session:", error)
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [])

  // Store subscription URL in session storage
  const storeSubscriptionUrl = useCallback((products: ProductItem[]) => {
    if (typeof window === "undefined" || !Array.isArray(products) || products.length === 0) {
      return
    }

    try {
      // Find the latest product with a subscription URL
      const sortedProducts = [...products].sort((a, b) => {
        const timeA = a.buy_time ? new Date(a.buy_time).getTime() : 0
        const timeB = b.buy_time ? new Date(b.buy_time).getTime() : 0
        return timeB - timeA
      })

      const latestProductWithUrl = sortedProducts.find(product =>
        product.subscription_url && product.subscription_url.trim() !== ""
      )

      if (latestProductWithUrl?.subscription_url) {
        const data: SessionSubscriptionData = {
          url: latestProductWithUrl.subscription_url,
          timestamp: Date.now(),
          productName: latestProductWithUrl.product_name || "未知套餐",
          expiresAt: Date.now() + CACHE_DURATION
        }

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
        setSessionUrl(data.url)
        setLastProductName(data.productName)
      }
    } catch (error) {
      console.warn("Failed to store subscription URL in session:", error)
    }
  }, [])

  // Get cached subscription URL
  const getCachedSubscriptionUrl = useCallback((): string | null => {
    return sessionUrl
  }, [sessionUrl])

  // Clear cached data
  const clearCache = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY)
    }
    setSessionUrl(null)
    setLastProductName(null)
  }, [])

  // Check if we have a valid cached URL
  const hasCachedUrl = useCallback((): boolean => {
    return sessionUrl !== null && sessionUrl.trim() !== ""
  }, [sessionUrl])

  return {
    sessionUrl,
    lastProductName,
    storeSubscriptionUrl,
    getCachedSubscriptionUrl,
    clearCache,
    hasCachedUrl
  }
}