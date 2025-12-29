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

// ============================================================================
// GTM (Google Tag Manager) Tracking Functions
// ============================================================================

import { pushGTMEvent, getTimestamp } from "./gtm/utils"
import type {
  CTAClickEvent,
  PageExitEvent,
  FAQInteractionEvent,
  PricingPlanClickEvent,
} from "./gtm/events"

/**
 * 追踪CTA按钮点击事件
 *
 * @param ctaType - CTA类型: 'free_trial' 或 'learn_more'
 * @param ctaText - CTA按钮文本
 * @param ctaLocation - CTA位置: 'hero' 或 'header'
 * @param targetUrl - 目标URL
 */
export const trackCTAClick = (
  ctaType: "free_trial" | "learn_more",
  ctaText: string,
  ctaLocation: "hero" | "header",
  targetUrl: string
) => {
  // 构建GTM事件对象
  const gtmEvent: CTAClickEvent = {
    event: "cta_click",
    cta_type: ctaType,
    cta_text: ctaText,
    cta_location: ctaLocation,
    target_url: targetUrl,
    timestamp: getTimestamp(),
  }

  // 推送到GTM dataLayer
  pushGTMEvent(gtmEvent)

  // 同时发送到GA4 (向后兼容)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      cta_type: ctaType,
      cta_text: ctaText,
      cta_location: ctaLocation,
      target_url: targetUrl,
    })
  }
}

/**
 * 追踪页面退出事件
 *
 * @param exitType - 退出类型: 'bounce' 或 'navigation'
 * @param pageLoadTime - 页面加载时间戳 (Date.now())
 * @param maxScrollDepth - 达到的最大滚动深度百分比 (0-100)
 * @param sectionsViewed - 查看过的区域ID数组
 */
export const trackPageExit = (
  exitType: "bounce" | "navigation",
  pageLoadTime: number,
  maxScrollDepth: number,
  sectionsViewed: string[]
) => {
  const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000)

  // 构建GTM事件对象
  const gtmEvent: PageExitEvent = {
    event: "page_exit",
    exit_type: exitType,
    time_on_page: timeOnPage,
    scroll_depth_reached: Math.round(maxScrollDepth),
    sections_viewed: sectionsViewed,
    timestamp: getTimestamp(),
  }

  // 推送到GTM dataLayer
  pushGTMEvent(gtmEvent)

  // 同时发送到GA4 (向后兼容)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_exit", {
      exit_type: exitType,
      time_on_page: timeOnPage,
      scroll_depth_reached: Math.round(maxScrollDepth),
      sections_viewed: sectionsViewed.join(","),
    })
  }
}

/**
 * 追踪FAQ交互事件
 *
 * @param action - 操作类型: 'expand' 或 'collapse'
 * @param faqId - FAQ问题ID
 * @param faqQuestion - FAQ问题文本
 * @param faqPosition - FAQ问题位置 (1-indexed)
 * @param pageLoadTime - 页面加载时间戳 (Date.now())
 */
export const trackFAQInteraction = (
  action: "expand" | "collapse",
  faqId: string,
  faqQuestion: string,
  faqPosition: number,
  pageLoadTime: number
) => {
  const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000)

  // 构建GTM事件对象
  const gtmEvent: FAQInteractionEvent = {
    event: "faq_interaction",
    action,
    faq_id: faqId,
    faq_question: faqQuestion,
    faq_position: faqPosition,
    time_on_page: timeOnPage,
    timestamp: getTimestamp(),
  }

  // 推送到GTM dataLayer
  pushGTMEvent(gtmEvent)

  // 同时发送到GA4 (向后兼容)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "faq_interaction", {
      action,
      faq_id: faqId,
      faq_question: faqQuestion,
      faq_position: faqPosition,
      time_on_page: timeOnPage,
    })
  }
}

/**
 * 追踪定价方案点击事件
 *
 * @param planData - 定价方案数据对象
 */
export const trackPricingPlanClick = (planData: {
  plan_id: string
  plan_name: string
  plan_price: string
  plan_badge?: string
  has_promotion: boolean
  promotion_label?: string
  cta_text: string
}) => {
  // 构建GTM事件对象
  const gtmEvent: PricingPlanClickEvent = {
    event: "pricing_plan_click",
    plan_id: planData.plan_id,
    plan_name: planData.plan_name,
    plan_price: planData.plan_price,
    plan_badge: planData.plan_badge,
    has_promotion: planData.has_promotion,
    promotion_label: planData.promotion_label,
    cta_text: planData.cta_text,
    timestamp: getTimestamp(),
  }

  // 推送到GTM dataLayer
  pushGTMEvent(gtmEvent)

  // 同时发送到GA4 (向后兼容)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "pricing_plan_click", {
      plan_id: planData.plan_id,
      plan_name: planData.plan_name,
      plan_price: planData.plan_price,
      plan_badge: planData.plan_badge,
      has_promotion: planData.has_promotion,
      promotion_label: planData.promotion_label,
      cta_text: planData.cta_text,
    })
  }
}
