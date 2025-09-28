import { useEffect, useState } from "react"
import { useTickets } from "@/hooks/useTickets"
import { TicketsTable } from "./TicketsTable"
import TicketForm from "@/components/ticket-form"

interface TicketsSectionProps {
  showTicketForm: boolean
  onShowTicketForm: (show: boolean) => void
}

export function TicketsSection({ showTicketForm, onShowTicketForm }: TicketsSectionProps) {
  const { tickets, loading, error, reloadTickets } = useTickets()

  useEffect(() => {
    if (!showTicketForm) {
      reloadTickets()
    }
  }, [showTicketForm, reloadTickets])

  if (showTicketForm) {
    return (
      <TicketForm
        onSuccess={() => {
          onShowTicketForm(false)
          reloadTickets()
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
      onReload={reloadTickets}
      onNewTicket={() => onShowTicketForm(true)}
    />
  )
}