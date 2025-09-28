"use client"

import { useState } from "react"
import { DEV_MODE_ENABLED, IS_DEVELOPMENT } from "@/lib/config"
import DeveloperModePanel from "@/components/developer-mode-panel"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardOverview } from "./DashboardOverview"
import { PricingSection } from "./PricingSection"
import { OrdersSection } from "./OrdersSection"
import { TicketsSection } from "./TicketsSection"
import { DocCenterSection } from "./DocCenterSection"
import { FloatingButtons } from "./FloatingButtons"

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showTicketForm, setShowTicketForm] = useState(false)

  const handlePurchaseSuccess = () => {
    // This will trigger re-fetching of products and orders
    // via the hooks in the components
  }

  const handleFloatingOrderClick = () => {
    setActiveSection("pricing")
  }

  const handleFloatingTicketClick = () => {
    setActiveSection("tickets")
    setShowTicketForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 lg:ml-0">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="p-6 space-y-6">
          {(DEV_MODE_ENABLED || IS_DEVELOPMENT) && (
            <DeveloperModePanel />
          )}

          {activeSection === "dashboard" && (
            <DashboardOverview onOrderClick={() => setActiveSection("pricing")} />
          )}

          {activeSection === "pricing" && (
            <PricingSection onPurchaseSuccess={handlePurchaseSuccess} />
          )}

          {activeSection === "orders" && (
            <OrdersSection />
          )}

          {activeSection === "tickets" && (
            <TicketsSection
              showTicketForm={showTicketForm}
              onShowTicketForm={setShowTicketForm}
            />
          )}

          {activeSection === "docs" && (
            <DocCenterSection />
          )}
        </main>

        <FloatingButtons
          onOrderClick={handleFloatingOrderClick}
          onTicketClick={handleFloatingTicketClick}
        />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}