import type { Metadata } from 'next'
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
      <body>{children}</body>
    </html>
  )
}
