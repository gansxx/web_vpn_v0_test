// Simple Google Analytics tracking utilities

// 声明全局 gtag 函数类型
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventNameOrConfig: string,
      params?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

/**
 * 追踪外部链接点击事件
 */
export const trackLinkClick = (
  category: string,
  linkName: string,
  linkUrl: string
) => {
  // 检查是否在浏览器环境且 gtag 已加载
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "link_click", {
      event_category: category,
      event_label: linkName,
      link_url: linkUrl,
      page_section: "discover_world",
    })

    // 在控制台输出，方便调试
    console.log("📊 Analytics Event:", {
      event: "link_click",
      category,
      linkName,
      linkUrl,
    })
  } else {
    // 开发环境提示
    console.log("📊 [Dev Mode] Link click tracked:", {
      category,
      linkName,
      linkUrl,
    })
  }
}

/**
 * 追踪页面浏览
 */
export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_title: pageTitle,
    })

    console.log("📊 Analytics Page View:", { pagePath, pageTitle })
  }
}

/**
 * 通用事件追踪
 */
export const trackEvent = (
  eventName: string,
  params: Record<string, any> = {}
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params)
    console.log("📊 Analytics Event:", eventName, params)
  } else {
    console.log("📊 [Dev Mode] Event tracked:", eventName, params)
  }
}
