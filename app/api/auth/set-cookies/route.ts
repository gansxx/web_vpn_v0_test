import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { access_token, refresh_token, expires_in } = body

    // Validate required fields
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: '缺少必要的认证信息' },
        { status: 400 }
      )
    }

    console.log('[Set Cookies API] Setting OAuth cookies')
    console.log('[Set Cookies API] Token length:', access_token.length)
    console.log('[Set Cookies API] Expires in:', expires_in)

    // Create response
    const response = NextResponse.json(
      { success: true, message: 'Cookies设置成功' },
      { status: 200 }
    )

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

    console.log('[Set Cookies API] All cookies set successfully')
    return response

  } catch (error: any) {
    console.error('[Set Cookies API] Error:', error)
    return NextResponse.json(
      { error: error?.message || '设置cookies失败' },
      { status: 500 }
    )
  }
}
