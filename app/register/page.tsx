"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { API_BASE } from "@/lib/config"
/* TURNSTILE DISABLED - 已注释 Turnstile 导入 */
// import Turnstile from "@/components/Turnstile"

export default function RegisterPage() {
  // 使用 useState 钩子定义了一个名为 formData 的状态变量，用于存储用户输入的表单数据。
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    inviteCode: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  // 提交阶段的统一错误提示（例如接口错误）
  const [submitError, setSubmitError] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [sendingCode, setSendingCode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  /* TURNSTILE DISABLED - 已注释 Turnstile token 状态 */
  // const [tsToken, setTsToken] = useState<string>("")

  // 确认密码校验：不一致时给出用户可见的错误
  const validatePasswords = () => {
    const newErrors: { [key: string]: string } = {}
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 发送邮箱验证码：前端校验+失败信息提示
  const sendVerificationCode = async () => {
    if (!formData.email) {
      setErrors({ email: "请先输入邮箱地址" })
      return
    }
    /* TURNSTILE DISABLED - 已注释 Turnstile 验证检查 */
    // if (!tsToken) {
    //   setErrors({ email: "请先完成人机验证" })
    //   return
    // }
    setSubmitError("")
    setSendingCode(true)
    try {
      /* TURNSTILE DISABLED - 移除 cf-turnstile-response header */
      const res = await fetch(`${API_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
        credentials: "include",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "发送失败" }))
        const msg = data.error || data.detail || "发送失败"
        setErrors({ email: msg })
        setSubmitError(msg)
        return
      }

      setIsCodeSent(true)// 显示「验证码已发送」提示
      setCountdown(60)// 倒计时 60 秒

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (e: any) {
      const msg = e?.message || "网络错误，请重试"
      setErrors({ email: msg })
      setSubmitError(msg)
    } finally {
      setSendingCode(false)
    }
  }
// 提交表单
  // 注册提交：前端必填校验 + 接口错误提示
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.email || !formData.verificationCode) {
      setErrors({
        email: !formData.email ? "请输入邮箱" : "",
        verificationCode: !formData.verificationCode ? "请输入验证码" : "",
      })
      return
    }

    if (!validatePasswords()) return

    /* TURNSTILE DISABLED - 已注释 Turnstile 验证检查 */
    // if (!tsToken) {
    //   setSubmitError("请先完成人机验证")
    //   return
    // }
    setSubmitError("")
    setSubmitting(true)
    try {
      /* TURNSTILE DISABLED - 移除 cf-turnstile-response header */
      const res = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: formData.verificationCode }),
        credentials: "include",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "验证失败" }))
        const msg = data.error || data.detail || "验证失败"
        setErrors({ verificationCode: msg })
        setSubmitError(msg)
        return
      }
      const data = await res.json().catch(() => ({ ok: true }))
      if (data && data.error) {
        setErrors({ verificationCode: data.error })
        setSubmitError(data.error)
        return
      }
      // 重定向到 dashboard 页面
      window.location.href = "/dashboard"
    } catch (e: any) {
      const msg = e?.message || "网络错误，请重试"
      setErrors({ verificationCode: msg })
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }
  // 处理输入变化
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
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

          <p className="text-gray-600 text-sm mb-2">
            永久导航页 <span className="text-blue-600">[帕克加速.com]</span> 保存防丢
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">注册新账户</h2>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            {/* TURNSTILE DISABLED - 已注释 Turnstile Widget */}
            {/* <div>
              <Turnstile onVerify={setTsToken} onExpire={() => setTsToken("")} onError={() => setTsToken("")} />
              {!tsToken && <p className="text-xs text-gray-500 mt-1">请通过人机验证后再操作</p>}
            </div> */}
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
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="请输入邮箱地址"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱验证码
              </label>
              <div className="flex space-x-3">
                <input
                  id="verification-code"
                  name="verificationCode"
                  type="text"
                  required
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入验证码"
                />
                {/* TURNSTILE DISABLED - 移除 !tsToken 禁用条件 */}
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={countdown > 0 || sendingCode}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    countdown > 0 || sendingCode
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {countdown > 0 ? `${countdown}s` : (sendingCode ? "发送中..." : "发送验证码")}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
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
            </div>
{/* type="password" 根据 showConfirmPassword 的值动态设置输入框的类型。如果 showConfirmPassword 为 true，则显示为明文（text），否则显示为密码（password）。。 */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={validatePasswords} // 绑定 onBlur 事件
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  // 点击按钮时，切换 showConfirmPassword 的值，从而切换输入框的类型
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
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
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label htmlFor="invite-code" className="block text-sm font-medium text-gray-700 mb-2">
                邀请码 <span className="text-gray-400">(可选)</span>
              </label>
              <input
                id="invite-code"
                name="inviteCode"
                type="text"
                value={formData.inviteCode}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入邀请码"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree-terms" className="text-gray-700">
                  我已阅读并同意
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    《用户协议》
                  </a>
                  和
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    《隐私政策》
                  </a>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              {submitError && (
                <div className="text-sm text-red-600">{submitError}</div>
              )}
              {/* TURNSTILE DISABLED - 移除 !tsToken 禁用条件 */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {submitting ? "提交中..." : "立即注册"}
              </button>

              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <a href="/signin">返回登录</a>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
