import { useCallback, useState } from "react"
import { API_BASE } from "@/lib/config"
import { TicketItem, mapTicketData } from "@/lib/dashboard-utils"
import { handleApiError } from "@/lib/api-utils"

export function useTickets() {
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reloadTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`${API_BASE}/support/tickets`, { credentials: "include" })

      if (!r.ok) {
        const errorMessage = await handleApiError(r)
        throw new Error(errorMessage)
      }

      const data = await r.json()
      const list: any[] = Array.isArray(data) ? data : []
      const mapped = mapTicketData(list)
      setTickets(mapped)
    } catch (e: any) {
      setError(e?.message || "加载失败")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    tickets,
    loading,
    error,
    reloadTickets
  }
}