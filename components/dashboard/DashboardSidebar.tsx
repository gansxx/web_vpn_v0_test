interface DashboardSidebarProps {
  sidebarOpen: boolean
  activeSection: string
  onSectionChange: (section: string) => void
}

export function DashboardSidebar({ sidebarOpen, activeSection, onSectionChange }: DashboardSidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-full relative">
              <div className="absolute inset-0.5 bg-red-600 rounded-full"></div>
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-gray-900 text-lg font-medium">Z加速</span>
        </div>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        <button
          onClick={() => onSectionChange("dashboard")}
          className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg ${activeSection === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>主页</span>
        </button>

        <button
          onClick={() => onSectionChange("pricing")}
          className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg ${activeSection === "pricing" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <span>套餐购买</span>
        </button>

        <button
          onClick={() => onSectionChange("orders")}
          className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg ${activeSection === "orders" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>订单列表</span>
        </button>

        <button
          onClick={() => onSectionChange("tickets")}
          className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg ${activeSection === "tickets" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 002-2H8a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span>工单列表</span>
        </button>

        <button
          onClick={() => onSectionChange("docs")}
          className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg ${activeSection === "docs" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>文档中心</span>
        </button>
      </nav>
    </div>
  )
}