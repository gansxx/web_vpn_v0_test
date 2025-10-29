"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardOverview } from "./DashboardOverview"
import { PricingSection } from "./PricingSection"
import { OrdersSection } from "./OrdersSection"
import { TicketsSection } from "./TicketsSection"
import { DocCenterSection } from "./DocCenterSection"
import { FloatingButtons } from "./FloatingButtons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getOrderBySessionId, getOrderProductStatus } from "@/lib/advanced-plan-api"

export default function DashboardLayout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showTicketForm, setShowTicketForm] = useState(false)

  // Stripe Checkout 回调处理状态
  const [showPollingDialog, setShowPollingDialog] = useState(false)
  const [pollingMessage, setPollingMessage] = useState("")
  const [pollingOrderId, setPollingOrderId] = useState<string | null>(null)
  const [productStatus, setProductStatus] = useState<string>("pending")

  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateToSection = (event: CustomEvent<string>) => {
      const section = event.detail
      setActiveSection(section)

      // If navigating to tickets section, show the ticket form
      if (section === 'tickets') {
        setShowTicketForm(true)
      }
    }

    window.addEventListener('navigate-to-section', handleNavigateToSection as EventListener)

    return () => {
      window.removeEventListener('navigate-to-section', handleNavigateToSection as EventListener)
    }
  }, [])

  // 处理 Stripe Checkout 回调
  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (!sessionId) return

    // 清除 URL 参数，避免刷新页面时重复处理
    const newUrl = window.location.pathname
    window.history.replaceState({}, "", newUrl)

    // 查询订单并开始轮询
    ;(async () => {
      try {
        setPollingMessage("正在获取订单信息...")
        setShowPollingDialog(true)

        const orderData = await getOrderBySessionId(sessionId)
        setPollingOrderId(orderData.order_id)
        setPollingMessage("支付成功！正在生成订阅链接...")
        setProductStatus(orderData.product_status)

        // 如果订单已完成，直接刷新产品列表
        if (orderData.product_status === "completed") {
          setPollingMessage("订阅链接已生成！")
          setTimeout(() => {
            setShowPollingDialog(false)
            handlePurchaseSuccess()
          }, 1500)
        }
      } catch (error: any) {
        console.error("获取订单信息失败:", error)
        setPollingMessage("获取订单信息失败，请刷新页面重试")
      }
    })()
  }, [searchParams])

  // 轮询订单产品生成状态
  useEffect(() => {
    if (!pollingOrderId || !showPollingDialog) return

    const pollInterval = setInterval(async () => {
      try {
        const statusData = await getOrderProductStatus(pollingOrderId)
        setProductStatus(statusData.product_status)

        if (statusData.is_completed) {
          setPollingMessage("订阅链接已生成！")
          clearInterval(pollInterval)
          setTimeout(() => {
            setShowPollingDialog(false)
            setPollingOrderId(null)
            handlePurchaseSuccess()
          }, 1500)
        } else if (statusData.is_failed) {
          setPollingMessage("订阅链接生成失败，请联系客服")
          clearInterval(pollInterval)
        } else {
          setPollingMessage(statusData.message || "正在生成订阅链接...")
        }
      } catch (error) {
        console.error("轮询订单状态失败:", error)
      }
    }, 2000) // 每 2 秒轮询一次

    return () => clearInterval(pollInterval)
  }, [pollingOrderId, showPollingDialog])

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

      {/* Stripe Checkout 回调后的订单状态轮询 Dialog */}
      <Dialog open={showPollingDialog} onOpenChange={setShowPollingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              支付成功！正在生成订阅链接！
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {productStatus !== "completed" && productStatus !== "failed" && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  )}
                  {productStatus === "completed" && (
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {productStatus === "failed" && (
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {pollingMessage}
                </p>
                {productStatus !== "completed" && productStatus !== "failed" && (
                  <>
                    <p className="text-sm text-amber-600 font-medium mb-2">
                      ⏱️ 预计需要 5-30 秒
                    </p>
                    <p className="text-sm text-red-600 font-bold">
                      ⚠️ 请不要关闭此页面
                    </p>
                  </>
                )}
              </div>
              {(productStatus === "completed" || productStatus === "failed") && (
                <Button
                  onClick={() => {
                    setShowPollingDialog(false)
                    setPollingOrderId(null)
                    handlePurchaseSuccess()
                  }}
                  className="w-full"
                >
                  确定
                </Button>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}