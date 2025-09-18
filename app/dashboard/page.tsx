"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// 清除指定名称的认证 cookie，用于执行登出
function clearCookie(name: string) {
  if (typeof document === "undefined") return
  // 统一删除前端可见 cookie（非 HttpOnly）
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  const mockOrders = [
    { id: "ORD001", date: "2024-01-15", amount: "¥99", status: "已完成", plan: "基础套餐" },
    { id: "ORD002", date: "2024-01-10", amount: "¥199", status: "处理中", plan: "高级套餐" },
    { id: "ORD003", date: "2024-01-05", amount: "¥299", status: "已完成", plan: "专业套餐" },
  ]

  const mockTickets = [
    { id: "TIC001", title: "连接问题", status: "已解决", date: "2024-01-14", priority: "高" },
    { id: "TIC002", title: "账户充值", status: "处理中", date: "2024-01-12", priority: "中" },
    { id: "TIC003", title: "功能咨询", status: "已关闭", date: "2024-01-08", priority: "低" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
            onClick={() => setActiveSection("dashboard")}
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
            onClick={() => setActiveSection("pricing")}
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
            onClick={() => setActiveSection("orders")}
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
            onClick={() => setActiveSection("tickets")}
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

          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>文档中心</span>
          </a>

          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <span>个人信息</span>
          </a>

          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span>邀请信息</span>
          </a>

          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>流量明细</span>
          </a>

          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>节点地图</span>
          </a>

          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>苹果账号</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Ctrl + K"
                  className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 登出按钮：清除 access_token 并跳转登录页 */}
              <button
                onClick={async () => {
                  try {
                    // 调用后端注销，清理 HttpOnly Cookie
                    await fetch("/api/logout", { method: "POST", credentials: "include" })
                  } catch {}
                  // 兜底清理前端非 HttpOnly Cookie，并重置记住我
                  clearCookie("access_token")
                  clearCookie("refresh_token")
                  document.cookie = `remember_me=false; path=/; samesite=lax; expires=${new Date("1970-01-01").toUTCString()}`
                  window.location.href = "/signin"
                }}
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

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {activeSection === "dashboard" && (
            <>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold">
                      欢迎使用帕克云，使用教程请参考文档中心，
                      <br />
                      若有疑问可提交工单或联系右下角客服～
                    </h1>
                    <div className="flex space-x-4">
                      <button className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                        优惠购买
                      </button>
                      <button className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                        Telegram群组
                      </button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Package Card */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <h2 className="text-2xl font-bold">开通套餐</h2>
                      </div>
                      <p className="text-gray-300 mb-6">您还没有激活的套餐</p>
                      <p className="text-gray-400 mb-8">立即开通套餐选择适合的服务</p>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        兑换礼品卡
                      </button>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white bg-opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
                  </div>
                </div>

                {/* Client Downloads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Windows电脑，下载对应客户端</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0927 9.3214C2.8207 11.0806.9999 13.9222.9999 17.2623c0 .5511.4482.9993.9993.9993h19.0016c.5511 0 .9993-.4482.9993-.9993-.0001-3.3401-1.8209-6.1817-5.0929-7.9409z" />
                          </svg>
                        </div>
                        <span className="text-gray-900">安卓客户端</span>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-900">iOS</span>
                        <span className="text-gray-500">苹果手机和平板客户端</span>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
                        </svg>
                        <span className="text-gray-900">Windows电脑客户端</span>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        下载
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.81.87.78 0 2.26-1.07 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        <span className="text-gray-900">Mac电脑客户端</span>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        下载
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "pricing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">选择套餐</h1>
                <p className="text-gray-600">选择最适合您的服务套餐</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">免费套餐</h3>
                      <div className="text-4xl font-bold text-blue-600 mb-2">¥0</div>
                      <p className="text-gray-600">测试期间免费使用</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900 font-medium">使用量：无限制</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900 font-medium">使用时间：测试期间</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900">基础节点访问</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900">多平台支持</span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      立即开始
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                    即将推出
                  </div>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">付费套餐</h3>
                      <div className="text-4xl font-bold text-orange-600 mb-2">待推出</div>
                      <p className="text-gray-600">更多高级功能</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900">免费套餐所有功能</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900">高速专线节点</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900">优先技术支持</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900">高级功能解锁</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" size="lg" disabled>
                      敬请期待
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">订单列表</h1>
                <Button className="bg-blue-600 hover:bg-blue-700">新建订单</Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            订单号
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            日期
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            套餐
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            金额
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状态
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.plan}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === "已完成"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "处理中"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button variant="outline" size="sm">
                                查看详情
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "tickets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">工单列表</h1>
                <Button className="bg-blue-600 hover:bg-blue-700">提交工单</Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            工单号
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            标题
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            优先级
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状态
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            创建日期
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockTickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {ticket.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  ticket.priority === "高"
                                    ? "bg-red-100 text-red-800"
                                    : ticket.priority === "中"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  ticket.status === "已解决"
                                    ? "bg-green-100 text-green-800"
                                    : ticket.status === "处理中"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button variant="outline" size="sm">
                                查看详情
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Floating Purchase Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setActiveSection("pricing")}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="hidden sm:block">购买套餐</span>
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
