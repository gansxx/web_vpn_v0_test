'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[Auth Callback Page] Starting client-side callback handling...')
        console.log('[Auth Callback Page] Current URL:', window.location.href)
        console.log('[Auth Callback Page] Hash fragment:', window.location.hash)

        // Get session from Supabase (handles hash fragments automatically)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('[Auth Callback Page] Session error:', sessionError)
          throw sessionError
        }

        if (!session) {
          console.error('[Auth Callback Page] No session found')
          throw new Error('未能获取会话信息')
        }

        console.log('[Auth Callback Page] Session obtained successfully')
        console.log('[Auth Callback Page] User email:', session.user?.email)
        console.log('[Auth Callback Page] Token length:', session.access_token.length)

        // Set cookies via API route
        console.log('[Auth Callback Page] Calling set-cookies API...')
        const response = await fetch('/api/auth/set-cookies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_in: session.expires_in || 3600,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '设置cookies失败')
        }

        console.log('[Auth Callback Page] Cookies set successfully, redirecting to dashboard')

        // Redirect to dashboard
        router.push('/dashboard')

      } catch (err: any) {
        console.error('[Auth Callback Page] Error:', err)
        setError(err.message || 'OAuth登录失败')

        // Redirect to signin with error after a short delay
        setTimeout(() => {
          router.push(`/signin?error=${encodeURIComponent(err.message)}`)
        }, 2000)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="mt-4 text-center text-lg font-medium text-gray-900">登录失败</h3>
          <p className="mt-2 text-center text-sm text-gray-600">{error}</p>
          <p className="mt-4 text-center text-xs text-gray-500">即将返回登录页面...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <h3 className="mt-4 text-center text-lg font-medium text-gray-900">正在登录...</h3>
        <p className="mt-2 text-center text-sm text-gray-600">正在完成 Google 账号登录</p>
      </div>
    </div>
  )
}
