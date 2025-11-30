📊 Google Analytics 追踪方案

  1. 追踪目标

  需要追踪的用户行为：
  - 🎬 YouTube 博主链接点击（哪个博主最受欢迎）
  - 🤖 AI 工具链接点击（哪个 AI 工具最受关注）
  - 🌐 其他分类链接点击
  - 📈 用户在页面的停留时间
  - 🔄 从"发现世界"到"免费试用"的转化率

  2. 技术实现方案

  方案 A：Google Analytics 4 (GA4) - 推荐

  // 1. 安装 GA4
  npm install react-ga4

  // 2. 初始化配置（app/layout.tsx 或专用组件）
  import ReactGA from "react-ga4"

  useEffect(() => {
    ReactGA.initialize("G-XXXXXXXXXX") // 您的 GA4 Measurement ID
  }, [])

  // 3. 在博客页面添加事件追踪（app/blog/page.tsx）
  const trackLinkClick = (category: string, name: string, url: string) => {
    ReactGA.event({
      category: "external_link_click",
      action: "click",
      label: `${category} - ${name}`,
      value: 1,
    })

    // 或使用 GA4 新格式
    gtag("event", "link_click", {
      category: category,
      link_name: name,
      link_url: url,
      page_location: window.location.href,
    })
  }

  // 4. 修改链接添加点击追踪
  <a
    href={entry.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackLinkClick(category.name, entry.name, entry.url)}
    className="..."
  >

  方案 B：Google Tag Manager (GTM) - 更灵活

  // 1. 添加 GTM 脚本到 app/layout.tsx
  <Script id="gtm" strategy="afterInteractive">
    {`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXX');
    `}
  </Script>

  // 2. 添加 data 属性到链接
  <a
    href={entry.url}
    target="_blank"
    rel="noopener noreferrer"
    data-category={category.name}
    data-link-name={entry.name}
    data-link-url={entry.url}
    className="..."
  >

  // 3. 在 GTM 中配置：
  // - 触发器：点击 - 所有元素，条件：Click URL 包含特定域名
  // - 变量：提取 data-* 属性
  // - 标签：GA4 事件，事件名称：link_click

  3. 推荐的事件结构

  // 定义事件类型
  interface LinkClickEvent {
    event_name: "link_click"
    category: string          // "YouTube 博主推荐" | "AI 工具" | "开发者社区" 等
    link_name: string         // "MrBeast" | "ChatGPT" 等
    link_url: string          // 完整 URL
    page_section: string      // "discover_world"
    user_action: string       // "external_navigation"
  }

  // 使用示例
  gtag("event", "link_click", {
    category: "AI 工具",
    link_name: "ChatGPT",
    link_url: "https://chat.openai.com/",
    page_section: "discover_world",
    user_action: "external_navigation",
  })

  4. 关键转化漏斗追踪

  // 页面访问
  gtag("event", "page_view", {
    page_title: "发现世界",
    page_location: "/blog",
  })

  // 链接点击
  gtag("event", "link_click", { ... })

  // 转化目标：点击"免费试用"
  gtag("event", "conversion", {
    send_to: "AW-XXXXXXXXX/XXXXXX",
    value: 1.0,
    currency: "CNY",
  })

  5. 实施步骤

  第一步：添加 GA4 配置

  // app/layout.tsx
  import Script from "next/script"

  export default function RootLayout({ children }) {
    return (
      <html>
        <head>
          {/* Google Analytics */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </head>
        <body>{children}</body>
      </html>
    )
  }

  第二步：创建追踪工具函数

  // lib/analytics.ts
  export const trackEvent = (
    eventName: string,
    params: Record<string, any>
  ) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, params)
    }
  }

  export const trackLinkClick = (
    category: string,
    linkName: string,
    linkUrl: string
  ) => {
    trackEvent("link_click", {
      category,
      link_name: linkName,
      link_url: linkUrl,
      page_section: "discover_world",
    })
  }

  第三步：修改博客页面组件

  // app/blog/page.tsx
  import { trackLinkClick } from "@/lib/analytics"

  // 在链接的 onClick 中添加
  <a
    key={entry.id}
    href={entry.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackLinkClick(category.name, entry.name, entry.url)}
    className="block p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors group/entry"
  >

  6. GA4 报告配置

  创建自定义报告追踪：

  报告 1：最受欢迎的外部链接
  - 维度：link_name, category
  - 指标：事件计数
  - 排序：按事件计数降序

  报告 2：分类点击分布
  - 维度：category
  - 指标：事件计数, 唯一用户数
  - 可视化：饼图

  报告 3：转化漏斗
  - 步骤 1：访问"发现世界"页面
  - 步骤 2：点击任意外部链接
  - 步骤 3：返回并点击"免费试用"

  7. 隐私合规

  需要添加 Cookie 同意横幅：

  // components/CookieConsent.tsx
  "use client"

  import { useState, useEffect } from "react"
  import { Button } from "@/components/ui/button"

  export function CookieConsent() {
    const [show, setShow] = useState(false)

    useEffect(() => {
      const consent = localStorage.getItem("cookie_consent")
      if (!consent) setShow(true)
    }, [])

    const acceptCookies = () => {
      localStorage.setItem("cookie_consent", "accepted")
      setShow(false)
      // 初始化 GA4
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }

    if (!show) return null

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            我们使用 Cookie 来改善您的体验并分析网站使用情况。
          </p>
          <Button onClick={acceptCookies}>接受</Button>
        </div>
      </div>
    )
  }

  8. 关键指标 Dashboard

  建议在 GA4 中关注的指标：

  | 指标     | 含义            | 业务价值    |
  |--------|---------------|---------|
  | 最热门链接  | 点击次数最多的外部链接   | 了解用户兴趣点 |
  | 分类点击率  | 各分类的点击占比      | 优化内容分类  |
  | 页面停留时间 | 用户浏览时长        | 内容吸引力   |
  | 跳出率    | 直接离开的用户比例     | 页面质量    |
  | 转化率    | 从"发现世界"到注册的比例 | 核心业务指标  |

  9. TypeScript 类型定义

  // types/analytics.ts
  declare global {
    interface Window {
      gtag: (
        command: string,
        eventName: string,
        params?: Record<string, any>
      ) => void
      dataLayer: any[]
    }
  }

  export interface AnalyticsEvent {
    event_name: string
    category?: string
    link_name?: string
    link_url?: string
    page_section?: string
    value?: number
  }

  总结

  推荐方案：GA4 + 自定义事件追踪

  优点：
  - ✅ 轻量级，不需要额外依赖
  - ✅ Next.js 友好，支持 SSR
  - ✅ 免费且功能强大
  - ✅ 可以追踪完整的用户旅程

  实施复杂度：⭐⭐☆☆☆（中等偏低）

  预计时间：2-3 小时完成基础追踪，1 周完成完整仪表板