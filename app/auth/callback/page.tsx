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
        console.log('[Auth Callback Page] Hash:', window.location.hash)
        console.log('[Auth Callback Page] Search:', window.location.search)

        // Check for error in query params
        const params = new URLSearchParams(window.location.search)
        const errorParam = params.get('error')
        const errorDescription = params.get('error_description')

        if (errorParam) {
          console.error('[Auth Callback Page] Error in URL:', errorParam, errorDescription)
          throw new Error(errorDescription || errorParam)
        }

        // Get session from Supabase (handles both hash and query params)
        console.log('[Auth Callback Page] Getting session from Supabase...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('[Auth Callback Page] Session error:', sessionError)
          throw sessionError
        }

        if (!session) {
          console.error('[Auth Callback Page] No session found')
          throw new Error('未能获取会话信息')
        }

        console.log('[Auth Callback Page] Session obtained! User:', session.user.email)
        console.log('[Auth Callback Page] Access token length:', session.access_token.length)

        // Set cookies via API route
        console.log('[Auth Callback Page] Setting cookies via API...')
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
          throw new Error('设置cookies失败')
        }

        console.log('[Auth Callback Page] Cookies set successfully!')
        console.log('[Auth Callback Page] Redirecting to dashboard...')

        // Redirect to dashboard
        router.push('/dashboard')

      } catch (err: any) {
        console.error('[Auth Callback Page] Error:', err)
        setError(err.message || 'OAuth登录失败')
        setTimeout(() => {
          router.push(`/signin?error=${encodeURIComponent(err.message || 'OAuth登录失败')}`)
        }, 2000)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">登录失败</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">正在返回登录页面...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在完成登录...</p>
        </div>
      </div>
    </div>
  )
}
