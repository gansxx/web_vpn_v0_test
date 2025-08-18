"use client"

import { useState } from "react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    inviteCode: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const validatePasswords = () => {
    const newErrors = {}
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const sendVerificationCode = async () => {
    if (!formData.email) {
      setErrors({ email: "请先输入邮箱地址" })
      return
    }

    // Simulate API call
    setIsCodeSent(true)
    setCountdown(60)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Validate passwords in real-time
    if (name === "password" || name === "confirmPassword") {
      setTimeout(validatePasswords, 100)
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

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">注册新账户</h2>
            <button className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              已有账户登录
            </button>
          </div>

          <form className="space-y-6">
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
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
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
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                立即注册
              </button>

              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                返回登录
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
