/* ========================================
 * TURNSTILE DISABLED - START
 * 已禁用整个 Cloudflare Turnstile 组件
 * 禁用原因：调试需要，跳过人机验证
 * 禁用日期：2025-10-09
 * 影响范围：登录、注册、密码重置页面
 * ======================================== */

"use client"

import { useEffect } from "react"
// import { useRef, useState } from "react"
// import { getDevModeSetting, DEV_MODE_ENABLED } from "@/lib/config"

// declare global {
//   interface Window {
//     turnstile?: {
//       render: (
//         el: HTMLElement,
//         options: {
//           sitekey: string
//           callback?: (token: string) => void
//           "error-callback"?: () => void
//           "expired-callback"?: () => void
//           "timeout-callback"?: () => void
//           theme?: "auto" | "light" | "dark"
//           size?: "normal" | "compact"
//         }
//       ) => string | undefined
//       reset?: (id?: string) => void
//       remove?: (id?: string) => void
//     }
//   }
// }

type Props = {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: "auto" | "light" | "dark"
  size?: "normal" | "compact"
  className?: string
}

// const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

export default function Turnstile({ onVerify, className }: Props) {
  // 自动提供 mock token，跳过验证
  useEffect(() => {
    const mockToken = "turnstile-disabled-mock-token-" + Date.now()
    setTimeout(() => onVerify(mockToken), 100)
  }, [onVerify])

  // 返回禁用提示
  return (
    <div className={`${className} p-4 bg-yellow-100 border border-yellow-300 rounded-md`}>
      <div className="flex items-center space-x-2 text-yellow-800">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">⚠️ Turnstile 验证已禁用（调试模式）</span>
      </div>
    </div>
  )
}

/* TURNSTILE DISABLED - END */

/* 原始完整代码已注释，如需恢复请取消下方注释：

export default function Turnstile({ onVerify, onExpire, onError, theme = "auto", size = "normal", className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [widgetId, setWidgetId] = useState<string | undefined>(undefined)
  const [isDisabled, setIsDisabled] = useState(false)

  // Check if Turnstile is disabled in developer mode
  useEffect(() => {
    const disabled = getDevModeSetting("DISABLE_TURNSTILE")
    setIsDisabled(disabled)

    if (disabled) {
      // Simulate successful verification with a mock token
      const mockToken = "dev-mode-mock-token-" + Date.now()
      setTimeout(() => onVerify(mockToken), 100)
    }
  }, [])

  // Load script once (skip if disabled)
  useEffect(() => {
    if (typeof window === "undefined" || isDisabled) return
    const exists = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (exists) {
      setReady(true)
      return
    }
    const s = document.createElement("script")
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => setReady(true)
    document.head.appendChild(s)
  }, [isDisabled])

  // Render widget when ready (skip if disabled)
  useEffect(() => {
    const el = containerRef.current
    if (!ready || !el || !window.turnstile || isDisabled) return

    const id = window.turnstile.render(el, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
      callback: (token: string) => onVerify(token),
      "error-callback": () => onError?.(),
      "expired-callback": () => onExpire?.(),
      "timeout-callback": () => onExpire?.(),
      theme,
      size,
    })
    setWidgetId(id)

    return () => {
      try {
        window.turnstile?.remove?.(id)
      } catch {}
    }
  }, [ready, onVerify, onExpire, onError, theme, size, isDisabled])

  if (isDisabled) {
    // Only show warning banner in development mode
    if (DEV_MODE_ENABLED) {
      return (
        <div className={`${className} p-4 bg-orange-100 border border-orange-300 rounded-md`}>
          <div className="flex items-center space-x-2 text-orange-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">开发者模式：Turnstile验证已禁用</span>
          </div>
        </div>
      )
    }
    // In production with Turnstile disabled, render nothing (silent pass)
    return null
  }

  return <div ref={containerRef} className={className} />
}
*/
