import { useState, useCallback, useEffect } from "react"
import { API_BASE } from "@/lib/config"
import { TicketItem } from "@/lib/dashboard-utils"
import { handleApiError } from "@/lib/api-utils"

interface TicketDetailCache {
  [ticketId: string]: {
    data: TicketItem
    timestamp: number
  }
}

const CACHE_KEY = "ticket_detail_cache"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Session storage helper functions
const getCache = (): TicketDetailCache => {
  if (typeof window === "undefined") return {}
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : {}
  } catch {
    return {}
  }
}

const setCache = (cache: TicketDetailCache) => {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn("Failed to cache ticket detail:", error)
  }
}

const getCachedTicket = (ticketId: string): TicketItem | null => {
  const cache = getCache()
  const cached = cache[ticketId]

  if (!cached) return null

  // Check if cache is still valid
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    // Cache expired, remove it
    delete cache[ticketId]
    setCache(cache)
    return null
  }

  return cached.data
}

const cacheTicket = (ticketId: string, data: TicketItem) => {
  const cache = getCache()
  cache[ticketId] = {
    data,
    timestamp: Date.now()
  }
  setCache(cache)
}

// Export cache clearing functions for external use
export const clearAllTicketCache = () => {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.warn("Failed to clear ticket cache:", error)
  }
}

export const clearSingleTicketCache = (ticketId: string) => {
  if (typeof window === "undefined") return
  try {
    const cache = getCache()
    delete cache[ticketId]
    setCache(cache)
  } catch (error) {
    console.warn("Failed to clear single ticket cache:", error)
  }
}

export function useTicketDetail(ticketId: string | null) {
  const [ticket, setTicket] = useState<TicketItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTicketDetail = useCallback(async (id: string) => {
    // First, try to get from cache
    const cached = getCachedTicket(id)
    if (cached) {
      console.log(`Using cached ticket detail for: ${id}`)
      setTicket(cached)
      setLoading(false)
      setError(null)
      return
    }

    // If no cache, fetch from API
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/support/tickets/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        const errorMessage = await handleApiError(response)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Map backend data to TicketItem format
      const ticketData: TicketItem = {
        id: data.id || id,
        subject: data.subject || "",
        priority: data.priority || "",
        category: data.category || "",
        status: data.status || "",
        created_at: data.created_at || "",
        description: data.description || "",
        reply: data.reply || null,
        replied_at: data.replied_at || null
      }

      // Cache the result
      cacheTicket(id, ticketData)

      setTicket(ticketData)
      setError(null)

    } catch (err: any) {
      const errorMessage = err?.message || "获取工单详情失败"
      setError(errorMessage)
      console.error("Failed to fetch ticket detail:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch when ticketId changes
  useEffect(() => {
    if (ticketId) {
      fetchTicketDetail(ticketId)
    } else {
      setTicket(null)
      setError(null)
      setLoading(false)
    }
  }, [ticketId, fetchTicketDetail])

  const refetch = useCallback(() => {
    if (ticketId) {
      // Clear cache for this ticket to force fresh fetch
      const cache = getCache()
      delete cache[ticketId]
      setCache(cache)
      fetchTicketDetail(ticketId)
    }
  }, [ticketId, fetchTicketDetail])

  return {
    ticket,
    loading,
    error,
    refetch
  }
}
