import { useEffect, useState } from "react"
import { useTickets } from "@/hooks/useTickets"
import { clearAllTicketCache } from "@/hooks/useTicketDetail"
import { TicketsTable } from "./TicketsTable"
import TicketForm from "@/components/ticket-form"

interface TicketsSectionProps {
  showTicketForm: boolean
  onShowTicketForm: (show: boolean) => void
}

export function TicketsSection({ showTicketForm, onShowTicketForm }: TicketsSectionProps) {
  const { tickets, loading, error, reloadTickets } = useTickets()

  const handleReloadTickets = () => {
    // Clear all ticket detail cache before reloading to ensure fresh data
    clearAllTicketCache()
    reloadTickets()
  }

  useEffect(() => {
    if (!showTicketForm) {
      handleReloadTickets()
    }
  }, [showTicketForm])

  if (showTicketForm) {
    return (
      <TicketForm
        onSuccess={() => {
          onShowTicketForm(false)
          handleReloadTickets()
        }}
        onCancel={() => onShowTicketForm(false)}
      />
    )
  }

  return (
    <TicketsTable
      tickets={tickets}
      loading={loading}
      error={error}
      onReload={handleReloadTickets}
      onNewTicket={() => onShowTicketForm(true)}
    />
  )
}