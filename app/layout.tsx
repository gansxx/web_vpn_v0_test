import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

// 定义页面元数据
export const metadata: Metadata = {
  title: 'Z加速_超大流量,超实惠的VPN服务',
  // Next.js 会自动识别 app/icon.svg 作为 favicon
}

// 定义全局的布局属性，children 是页面内容且只读
//所有页面共享style属性，包括字体，字体变量，字体大小，字体颜色等
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // 🔧 修复：优先使用 GA4 ID 加载脚本，因为它更通用
  // Google Ads 转化追踪会通过 gtag('config') 单独配置
  const primaryId = googleAnalyticsId || googleAdsId
  const hasAnyId = googleAnalyticsId || googleAdsId

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
        {hasAnyId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                ${googleAnalyticsId ? `
                // Google Analytics 4 - 数据分析和事件追踪
                gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                  debug_mode: ${process.env.NODE_ENV === 'development'},
                  send_page_view: true
                });
                console.log('✅ GA4 initialized:', '${googleAnalyticsId}');
                console.log('📊 GA4 用途: 用户行为分析、事件追踪、流量统计');
                ` : ''}

                ${googleAdsId ? `
                // Google Ads - 转化追踪和广告效果
                gtag('config', '${googleAdsId}', {
                  'allow_ad_personalization_signals': true,
                  'cookie_flags': 'SameSite=None;Secure'
                });
                console.log('✅ Google Ads initialized:', '${googleAdsId}');
                console.log('💰 Google Ads 用途: 转化追踪、广告归因');
                ` : ''}

                ${googleAnalyticsId && googleAdsId ? `
                console.log('🔗 双标签模式: GA4 分析 + Google Ads 转化');
                ` : ''}
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
