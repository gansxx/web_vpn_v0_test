import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  // const raw = await request.text();
  const { searchParams, origin } = requestUrl
  const code = searchParams.get('code')
  // 2. 想怎么看就怎么看
  // console.log('----- raw request -----');
  // console.log(raw);          // 原始 HTTP 报文体（若无 body 就是空串）
  // console.log('----- headers -----');
  // console.log(Object.fromEntries(request.headers.entries()));
  
  // Default to /dashboard if no next parameter
  let next = searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/')) next = '/dashboard'
  console.log(Object.fromEntries(searchParams));
  // { code: 'abc', next: '/dash' }

  // 2. 转字符串
  // console.log(searchParams.toString());
  // // code=abc&next=%2Fdash

  // // 3. 逐条遍历
  // for (const [k, v] of searchParams) {
  //   console.log(k, v);
  // }
  // Detailed logging
  console.log('='.repeat(80))
  console.log('[OAuth Callback] FULL URL:', request.url)
  console.log('[OAuth Callback] Origin:', origin)
  console.log('[OAuth Callback] Pathname:', requestUrl.pathname)
  console.log('[OAuth Callback] Search params:', Object.fromEntries(searchParams.entries()))
  console.log('[OAuth Callback] Code parameter:', code ? `${code.substring(0, 20)}...` : '❌ MISSING')
  console.log('[OAuth Callback] Next parameter:', next)
  console.log('='.repeat(80))

  if (!code) {
    console.error('[OAuth Callback] No code parameter!')
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent('缺少授权码')}`)
  }

  try {
    // Step 1: Exchange code for Supabase session
    console.log('[OAuth Callback] Exchanging code for session...')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) throw error
    if (!data.session) throw new Error('未返回会话信息')

    const { session } = data
    const { access_token, refresh_token, expires_in } = session

    console.log('[OAuth Callback] Session obtained! User:', data.user?.email)
    console.log('[OAuth Callback] Token length:', access_token.length, 'Expires in:', expires_in)

    // Step 2: Set cookies (SAME as backend /login does)
    // This matches auth.py:189 logic
    const response = NextResponse.redirect(
      `${origin}${next}`,
      { status: 302 }
    )

    console.log('[OAuth Callback] Setting cookies and redirecting to:', `${origin}${next}`)

    // Set access_token cookie (HttpOnly for security)
    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires_in || 3600,
      path: '/',
    })

    // Set refresh_token cookie
    response.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // Set remember_me cookie (for auto-login)
    response.cookies.set('remember_me', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response

  } catch (error: any) {
    console.error('OAuth callback error:', error)
    const errorMessage = error?.message || 'OAuth登录失败'
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(errorMessage)}`
    )
  }
}