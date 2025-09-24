"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          "error-callback"?: () => void
          "expired-callback"?: () => void
          "timeout-callback"?: () => void
          theme?: "auto" | "light" | "dark"
          size?: "normal" | "compact"
        }
      ) => string | undefined
      reset?: (id?: string) => void
      remove?: (id?: string) => void
    }
  }
}

type Props = {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: "auto" | "light" | "dark"
  size?: "normal" | "compact"
  className?: string
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

export default function Turnstile({ onVerify, onExpire, onError, theme = "auto", size = "normal", className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [widgetId, setWidgetId] = useState<string | undefined>(undefined)

  // Load script once
  useEffect(() => {
    if (typeof window === "undefined") return
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
  }, [])

  // Render widget when ready
  useEffect(() => {
    const el = containerRef.current
    if (!ready || !el || !window.turnstile) return

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
  }, [ready, onVerify, onExpire, onError, theme, size])

  return <div ref={containerRef} className={className} />
}
