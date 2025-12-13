"use client"

import { useEffect, useState, FormEvent, ChangeEvent } from "react"
import { API_BASE, DEV_MODE_ENABLED } from "@/lib/config"
import Turnstile from "@/components/Turnstile"
// cookie获取逻辑
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${encodeURIComponent(name)}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift()!)
  return null
}


function setCookie(
  name: string,
  value: string,
  days?: number,
  opts: { sameSite?: 'Strict' | 'Lax' | 'None'; secure?: boolean } = {}
) {
  // 如果 document 对象不存在，则返回
  if (typeof document === 'undefined') return;
  // 创建数组，同时通过encodeURIComponent确保特殊字符被正确处理*
  const parts: string[] = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    'path=/',
  ];

  // 默认宽松：本地开发用 Lax，线上可覆盖为 None
  //lax只允许同源请求，none允许所有请求
  const sameSite = opts.sameSite || 'Lax';
  parts.push(`samesite=${sameSite}`);

  // 只有 SameSite=None 时强制 Secure（浏览器要求）
  const secure = opts.secure ?? (sameSite === 'None');
  if (secure) parts.push('secure');

  if (days && days > 0) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    parts.push(`expires=${d.toUTCString()}`);
  }

  document.cookie = parts.join('; ');
}

export default function SignInPage() {
  // 默认勾选记住我
  const [form, setForm] = useState({ email: "", password: "", remember: true })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tsToken, setTsToken] = useState<string>("")
  // 字段级错误：用于展示「请输入邮箱/密码」等前端校验
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 建议放在 form/submitting/error 这三行 useState 后面
  type Dbg = {
    apiBase: string
    token: string
    tokenLen: number
    url: string
    status: string
    err: string
    origin: string
    isHttps: boolean
    isCrossOrigin: boolean
    cookieEnabled: boolean
    hasAccessTokenCookie: boolean
    rememberMe: boolean
    resUrl?: string
    resType?: string
    resRedirected?: boolean
    resOk?: boolean
    resStatusText?: string
    resBodyPreview?: string
    startedAt?: number
    durationMs?: number
  }
  const [dbg, setDbg] = useState<Dbg>({
    apiBase: API_BASE,
    token: "",
    tokenLen: 0,
    url: "",
    status: "",
    err: "",
    origin: typeof window !== "undefined" ? window.location.origin : "",
    isHttps: typeof window !== "undefined" ? window.location.protocol === "https:" : false,
    isCrossOrigin: false,
    cookieEnabled: typeof navigator !== "undefined" ? navigator.cookieEnabled : false,
    hasAccessTokenCookie: typeof document !== "undefined" ? /(?:^|; )access_token=/.test(document.cookie) : false,
    rememberMe: false,
  })

  const clearCookie = (name: string) => {
    if (typeof document === "undefined") return
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`
  }

  //界面加载函数
  const recheck = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
  const rememberMe = getCookie("remember_me") === "true"
  // 注意：access_token 可能为 HttpOnly，JS 无法读取
  const token = getCookie("access_token")
    const cookieEnabled = typeof navigator !== "undefined" ? navigator.cookieEnabled : false
    const hasAccessTokenCookie = typeof document !== "undefined" ? /(?:^|; )access_token=/.test(document.cookie) : false
    let isCrossOrigin = false
    try {
      const resolved = new URL(API_BASE, origin)
      isCrossOrigin = resolved.origin !== origin
    } catch {}

    setDbg((p) => ({
      ...p,
      origin,
      isHttps: origin.startsWith("https://"),
      cookieEnabled,
      hasAccessTokenCookie,
      rememberMe,
      token: token || "",
      tokenLen: token ? token.length : 0,
      status: token ? "token-found" : "no-token",
      isCrossOrigin,
      err: "",
      url: "",
      resUrl: undefined,
      resType: undefined,
      resRedirected: undefined,
      resOk: undefined,
      resStatusText: undefined,
      resBodyPreview: undefined,
      startedAt: undefined,
      durationMs: undefined,
    }))

    // 基于 HttpOnly Cookie 的自动登录：只要 rememberMe=true 就尝试 /me
    if (!rememberMe) {
      console.log("[signin] recheck: skip auto-login | rememberMe?", rememberMe)
      return
    }

    // 优先使用 Cookie 鉴权，不依赖前端读取 token
    const url = `${API_BASE}/me`
    const startedAt = (typeof performance !== "undefined" ? performance.now() : Date.now()) as number
    setDbg((p) => ({ ...p, url, status: "requesting", startedAt }))
  const reqInit: RequestInit = { credentials: "include" }
    console.log("[signin] recheck -> fetch", { url, reqInit, origin, apiBase: API_BASE, isCrossOrigin })
    try {
      const r = await fetch(url, reqInit)
      const duration = ((typeof performance !== "undefined" ? performance.now() : Date.now()) as number) - startedAt
      const bodyText = await r.text().catch(() => "")
      let preview = bodyText ? bodyText.slice(0, 300) : ""
      // 尝试格式化 JSON，便于观察错误结构
      try {
        const j = bodyText ? JSON.parse(bodyText) : null
        if (j) preview = JSON.stringify(j, null, 2).slice(0, 500)
      } catch {}

      console.log("[signin] /me response", {
        status: r.status,
        statusText: r.statusText,
        ok: r.ok,
        type: r.type,
        redirected: r.redirected,
        url: r.url,
        durationMs: Math.round(duration),
        preview,
      })

      setDbg((p) => ({
        ...p,
        status: String(r.status),
        resUrl: r.url,
        resType: r.type,
        resRedirected: r.redirected,
        resOk: r.ok,
        resStatusText: r.statusText,
        resBodyPreview: preview,
        durationMs: Math.round(duration),
      }))

      if (r.ok) {
        // body 已经被读取为 text，不再二次解析
        window.location.href = "/dashboard"
      }
    } catch (e: any) {
      console.error("[signin] /me error:", e)
      setDbg((p) => ({
        ...p,
        err: (e && (e.message || String(e))) || "fetch error",
        status: "error",
      }))
    }
  }

  // Google OAuth 登录处理函数
  const handleGoogleSignIn = async () => {
    setSubmitting(true)
    setError(null)

    try {
      // 调用后端 API 获取 Google OAuth URL
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
      console.log('[Google OAuth] Calling backend API:', `${apiBase}/google/url`)

      const response = await fetch(`${apiBase}/google/url`, {
        method: 'GET',
        credentials: 'include', // 携带 cookies
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get OAuth URL')
      }

      const data = await response.json()
      const oauthUrl = data.url

      if (!oauthUrl) {
        throw new Error('No OAuth URL returned')
      }

      console.log('[Google OAuth] OAuth URL received:', oauthUrl)
      console.log('[Google OAuth] Redirecting to Google...')

      // 重定向到 Google OAuth
      window.location.href = oauthUrl

      // User will be redirected to Google
      // No need to handle response here

    } catch (err: any) {
      console.error('[OAuth] Exception caught:', err)
      setError(err?.message || 'Google登录失败')
      setSubmitting(false)
    }
  }

  //在组件加载时，自动调用 recheck 函数，尝试从 Cookie 中获取 access_token 并验证其有效性。
  useEffect(() => {
    recheck()

    // Check for OAuth error in URL (from callback redirect)
    const urlParams = new URLSearchParams(window.location.search)
    const oauthError = urlParams.get('error')
    if (oauthError) {
      setError(decodeURIComponent(oauthError))
      // Clean URL without reloading page
      window.history.replaceState({}, '', '/signin')
    }
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((p) => ({ ...p, [name]: value }))
    if (error) setError(null)
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }
  // 登录逻辑
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 基础的前端必填校验
    if (!form.email || !form.password) {
      setFieldErrors({
        email: !form.email ? "请输入邮箱" : undefined,
        password: !form.password ? "请输入密码" : undefined,
      })
      return
    }
    if (!tsToken) {
      setError("请先完成人机验证")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cf-turnstile-response": tsToken,
        },
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      // 将后端返回的错误信息透出到界面
      if (!r.ok) {
        let msg = "登录失败"
        try {
          const j = await r.json()
          msg = j?.error || j?.message || msg
        } catch {}
        throw new Error(msg)
      }
      const j = await r.json()
      const token: string | undefined = j?.access_token
      if (!token) throw new Error("未返回令牌")
      // 仅在勾选“记住密码”时写入持久化 cookie；否则不保存 cookie
      if (form.remember) {
        // 初次写入：SameSite=Lax（默认），适合同源请求
        setCookie("remember_me", "true", 30)
        setCookie("access_token", token, 30)

        // 写入后校验：若未成功，在 HTTPS 环境下回退为 SameSite=None; Secure
        try {
          const v1 = getCookie("access_token")
          const ok1 = !!v1 && v1 === token
          if (!ok1 && typeof window !== "undefined" && window.location.protocol === "https:") {
            console.warn("[signin] access_token cookie not found after first write, retry with SameSite=None; Secure")
            setCookie("access_token", token, 30, { sameSite: "None", secure: true })
            const v2 = getCookie("access_token")
            const ok2 = !!v2 && v2 === token
            if (!ok2) {
              console.error("[signin] access_token cookie still missing after retry. Check domain/path/third-party cookie policies.")
            } else {
              console.info("[signin] access_token cookie set successfully after retry (SameSite=None; Secure)")
            }
          } else if (!ok1) {
            console.warn("[signin] access_token cookie not set and page is not HTTPS; cannot apply Secure cookie. Consider enabling HTTPS.")
          } else {
            console.info("[signin] access_token cookie set successfully (first write)")
          }
        } catch (e) {
          console.error("[signin] cookie verification failed:", e)
        }

        // 更新调试面板的可见状态
        setDbg((p) => ({
          ...p,
          hasAccessTokenCookie: typeof document !== "undefined" ? /(?:^|; )access_token=/.test(document.cookie) : p.hasAccessTokenCookie,
          token,
          tokenLen: token.length,
        }))
      } else {
        setCookie("remember_me", "false", 1)
        setCookie("access_token", token, 1)
      }
      window.location.href = "/dashboard"
      
    } catch (err: any) {
      setError(err?.message || "登录失败")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full relative">
                <div className="absolute inset-1 bg-red-600 rounded-full"></div>
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-gray-900 text-2xl font-bold">Z加速</span>
          </div>

          
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">登录</h2>
            <a
              href="/register"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              注册新账户
            </a>
          </div>
          <script src="https://accounts.google.com/gsi/client" async defer></script>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                电子邮件地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={onChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
              />
              {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <Turnstile onVerify={setTsToken} onExpire={() => setTsToken("")} onError={() => setTsToken("")} />
              {!tsToken && (
                <p className="text-xs text-gray-500 mt-1">请通过人机验证后再提交</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={onChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                    fieldErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder=""
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={onChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  记住密码
                </label>
              </div>

              <div className="text-sm">
                <a href="/recall" className="text-gray-600 hover:text-blue-600">
                  忘记密码？
                </a>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={submitting || !tsToken}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {submitting ? "登录中..." : "登录"}
              </button>

              <a
                href="/register"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                注册新账户
              </a>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">或</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 disabled:opacity-60 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">使用 Google 账号登录</span>
              </button>
            </div>
          </form>
        </div>
        {DEV_MODE_ENABLED && (
          <div className="mt-6 p-3 text-xs rounded bg-gray-50 border">
            <div>Turnstile: {tsToken ? `${tsToken.slice(0, 8)}...` : "(未获取)"}</div>
            <div>API_BASE: {dbg.apiBase}</div>
            <div>tokenLen: {dbg.tokenLen} {dbg.tokenLen ? "✅" : "❌"}</div>
            <div>url: {dbg.url || "(未发起)"}</div>
            <div>status: {dbg.status}</div>
            {dbg.err && <div className="text-red-600 break-all">err: {dbg.err}</div>}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="px-2 py-1 rounded border"
                onClick={recheck}
              >
                重新检测
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded border"
                onClick={() => {
                  clearCookie("access_token")
                  setDbg((p) => ({ ...p, token: "", tokenLen: 0, url: "", status: "cleared", err: "" }))
                  console.log("[signin] access_token cleared")
                }}
              >
                清除 access_token
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
