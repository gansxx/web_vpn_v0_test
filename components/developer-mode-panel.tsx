"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DEV_MODE_ENABLED, IS_DEVELOPMENT, getDevModeSetting, setDevModeSetting, resetDevModeSettings } from "@/lib/config"

export default function DeveloperModePanel() {
  const [disableTurnstile, setDisableTurnstile] = useState(false)
  const [disableAuthMiddleware, setDisableAuthMiddleware] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show panel if dev mode is enabled or in development
    setIsVisible(DEV_MODE_ENABLED || IS_DEVELOPMENT)

    // Load current settings
    setDisableTurnstile(getDevModeSetting("DISABLE_TURNSTILE"))
    setDisableAuthMiddleware(getDevModeSetting("DISABLE_AUTH_MIDDLEWARE"))
  }, [])

  const handleTurnstileToggle = () => {
    const newValue = !disableTurnstile
    setDisableTurnstile(newValue)
    setDevModeSetting("DISABLE_TURNSTILE", newValue)

    // Refresh page to apply changes
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleAuthMiddlewareToggle = () => {
    const newValue = !disableAuthMiddleware
    setDisableAuthMiddleware(newValue)
    setDevModeSetting("DISABLE_AUTH_MIDDLEWARE", newValue)

    alert(`路由保护${newValue ? "已禁用" : "已启用"}。请注意：中间件设置需要重新启动开发服务器才能生效。`)
  }

  const handleResetAll = () => {
    if (window.confirm("确定要重置所有开发者模式设置吗？")) {
      resetDevModeSettings()
      setDisableTurnstile(false)
      setDisableAuthMiddleware(false)

      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>开发者模式控制面板</span>
          <span className="text-xs bg-orange-200 px-2 py-1 rounded-full">DEV</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-orange-700 bg-orange-100 p-3 rounded-md">
          ⚠️ 警告：此面板仅用于开发和测试，请不要在生产环境中启用这些选项。
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div>
                <h4 className="font-medium text-gray-900">禁用 Turnstile 验证</h4>
                <p className="text-sm text-gray-600">跳过表单的人机验证</p>
              </div>
              <Button
                onClick={handleTurnstileToggle}
                variant={disableTurnstile ? "destructive" : "outline"}
                size="sm"
              >
                {disableTurnstile ? "已禁用" : "启用"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div>
                <h4 className="font-medium text-gray-900">禁用路由保护</h4>
                <p className="text-sm text-gray-600">允许未登录访问 dashboard</p>
              </div>
              <Button
                onClick={handleAuthMiddlewareToggle}
                variant={disableAuthMiddleware ? "destructive" : "outline"}
                size="sm"
              >
                {disableAuthMiddleware ? "已禁用" : "启用"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-md border">
              <h4 className="font-medium text-gray-900 mb-2">当前状态</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Turnstile:</span>
                  <span className={disableTurnstile ? "text-red-600" : "text-green-600"}>
                    {disableTurnstile ? "禁用" : "启用"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>路由保护:</span>
                  <span className={disableAuthMiddleware ? "text-red-600" : "text-green-600"}>
                    {disableAuthMiddleware ? "禁用" : "启用"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>环境:</span>
                  <span className="text-blue-600">
                    {IS_DEVELOPMENT ? "开发" : "生产"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleResetAll}
              variant="outline"
              size="sm"
              className="w-full"
            >
              重置所有设置
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          提示：Turnstile 设置立即生效，路由保护设置需要重启开发服务器
        </div>
      </CardContent>
    </Card>
  )
}