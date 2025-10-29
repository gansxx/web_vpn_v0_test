import { Suspense } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoadingFallback />}>
      <DashboardLayout />
    </Suspense>
  )
}

function DashboardLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>
  )
}
