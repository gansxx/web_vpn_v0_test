"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { API_BASE } from "@/lib/config"

export default function recallpage(){
    const [formData, setFormData] = useState({
        email: "",
        code: "",
        new_password:"",
        confirmnewcode:"",  // 修复拼写错误
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  // 提交阶段的统一错误提示（例如接口错误）
  const [submitError, setSubmitError] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  // 新密码一致性校验：两次密码不一致时给提示
  const validatePasswords = () => {
    const newErrors: { [key: string]: string } = {}
    if (formData.new_password && formData.confirmnewcode && formData.new_password !== formData.confirmnewcode) {
      console.error("两次输入密码不同")
      newErrors.confirmnewcode = "两次输入的密码不一致"  // 修复字段名
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
    const sendVerificationCode = async () => {
      console.log("开始提交表单")
    if (!formData.email) {
      setErrors({ email: "请先输入邮箱地址" })
      return
    }
    const res = await fetch(`${API_BASE}/recall`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
      credentials: "include",
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "发送失败" }))
      setErrors({ email: data.error || "发送失败" })
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
  }
  
  // 提交表单
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("表单提交触发", formData) // 添加调试日志

    if (!formData.email || !formData.code || !formData.new_password) {
      setErrors({
        email: !formData.email ? "请输入邮箱" : "",
        code: !formData.code ? "请输入验证码" : "",
        new_password:!formData.new_password ? "请输入新密码":"",
      })
      return
    }

    if (!validatePasswords()) return

    try {
      // 清空旧的提交错误提示
      setSubmitError("")
      console.log("发送重置密码请求到:", `${API_BASE}/recall/reset`)
      const res = await fetch(`${API_BASE}/recall/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          code: formData.code,
          new_password: formData.new_password 
        }),
        credentials: "include",
      })

      console.log("响应状态:", res.status)
      const data = await res.json()
      console.log("响应数据:", data)

      if (!res.ok) {
        const msg = data.error || data.detail || "验证失败"
        setErrors({ verificationCode: msg })
        setSubmitError(msg)
        return
      }
      
      // 成功时清除错误
      setErrors({})
      // 重定向到登录页面
      window.location.href = "/signin"
    } catch (error) {
      console.error("请求失败:", error)
      setErrors({ verificationCode: "网络错误，请重试" })
      setSubmitError("网络错误，请重试")
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
            <span className="text-gray-900 text-2xl font-bold">帕克云</span>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            永久导航页 <span className="text-blue-600">[帕克加速.com]</span> 保存防丢
          </p>
        </div>

        {/* recall Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">重置密码</h2>
          </div>

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
                  name="code"
                  type="text"
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入验证码"
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={countdown > 0}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    countdown > 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {countdown > 0 ? `${countdown}s` : "发送验证码"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newcode" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  id="newcode"
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.new_password}
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
              <label htmlFor="comfirmnewcode" className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <div className="relative">
                <input
                  id="confirmnewcode"
                  name="confirmnewcode"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmnewcode}
                  onChange={handleInputChange}
                  onBlur={validatePasswords} // 绑定 onBlur 事件
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                    errors.confirmnewcode ? "border-red-500" : "border-gray-300"
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
              {errors.confirmnewcode && <p className="mt-1 text-sm text-red-600">{errors.confirmnewcode}</p>}
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
              {submitError && <div className="text-sm text-red-600">{submitError}</div>}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={() => console.log("重置密码按钮被点击")}
              >
                重置密码
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
