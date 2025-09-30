import { clearCookie } from "@/lib/dashboard-utils"

interface DashboardHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function DashboardHeader({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps) {
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" })
    } catch {}
    clearCookie("access_token")
    clearCookie("refresh_token")
    document.cookie = `remember_me=false; path=/; samesite=lax; expires=${new Date("1970-01-01").toUTCString()}`
    window.location.href = "/signin"
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 border"
          >
            退出登录
          </button>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}