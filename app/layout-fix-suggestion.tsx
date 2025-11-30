import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Z加速_超大流量,超实惠的VPN服务',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // 🔧 修复：确保至少有一个有效 ID 才加载脚本
  const hasValidId = googleAnalyticsId || googleAdsId
  const primaryId = googleAnalyticsId || googleAdsId

  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}

        {/* Google Analytics & Ads - gtag.js */}
        {hasValidId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
              onLoad={() => {
                console.log('✅ gtag.js 脚本加载成功')
              }}
              onError={(e) => {
                console.error('❌ gtag.js 脚本加载失败:', e)
                console.error('使用的 ID:', primaryId)
              }}
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                ${googleAnalyticsId ? `
                // Google Analytics 4
                gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                  debug_mode: ${process.env.NODE_ENV === 'development'},
                  send_page_view: true
                });
                console.log('📊 GA4 initialized:', '${googleAnalyticsId}');
                console.log('📊 Debug mode:', ${process.env.NODE_ENV === 'development'});

                // 🔍 验证数据层
                console.log('📊 DataLayer:', window.dataLayer);
                ` : ''}

                ${googleAdsId ? `
                // Google Ads
                gtag('config', '${googleAdsId}', {
                  'allow_ad_personalization_signals': true,
                  'cookie_flags': 'SameSite=None;Secure'
                });
                console.log('📊 Google Ads initialized:', '${googleAdsId}');
                ` : ''}

                // 🔍 全局错误捕获
                window.addEventListener('error', function(e) {
                  if (e.filename && e.filename.includes('googletagmanager')) {
                    console.error('❌ Google Tag Manager 错误:', e.message);
                  }
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
