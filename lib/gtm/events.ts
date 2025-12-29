/**
 * GTM (Google Tag Manager) Event Type Definitions
 *
 * This file contains TypeScript type definitions for all GTM events
 * tracked across the application.
 */

/**
 * Base interface for all GTM events
 */
interface BaseGTMEvent {
  event: string
  timestamp: string
}

/**
 * Scroll Depth Event
 * Triggered when user scrolls to specific percentage milestones (25%, 50%, 75%, 100%)
 */
export interface ScrollDepthEvent extends BaseGTMEvent {
  event: 'page_scroll_depth'
  scroll_percentage: 25 | 50 | 75 | 100
  page_section: 'hero' | 'features' | 'services' | 'pricing' | 'download' | 'faq'
  timestamp: string
}

/**
 * CTA Click Event
 * Triggered when user clicks on Call-to-Action buttons
 */
export interface CTAClickEvent extends BaseGTMEvent {
  event: 'cta_click'
  cta_type: 'free_trial' | 'learn_more'
  cta_text: string
  cta_location: 'hero' | 'header'
  target_url: string
  timestamp: string
}

/**
 * Page Exit Event
 * Triggered when user leaves the page (navigation or tab close)
 */
export interface PageExitEvent extends BaseGTMEvent {
  event: 'page_exit'
  exit_type: 'bounce' | 'navigation'
  time_on_page: number // seconds
  scroll_depth_reached: number // max percentage reached (0-100)
  sections_viewed: string[] // array of section IDs
  timestamp: string
}

/**
 * FAQ Interaction Event
 * Triggered when user expands or collapses an FAQ question
 */
export interface FAQInteractionEvent extends BaseGTMEvent {
  event: 'faq_interaction'
  action: 'expand' | 'collapse'
  faq_id: string
  faq_question: string
  faq_position: number // 1-indexed position in FAQ list
  time_on_page: number // seconds since page load
  timestamp: string
}

/**
 * Pricing Plan Click Event
 * Triggered when user clicks on a pricing plan CTA button
 */
export interface PricingPlanClickEvent extends BaseGTMEvent {
  event: 'pricing_plan_click'
  plan_id: string
  plan_name: string
  plan_price: string
  plan_badge?: string
  has_promotion: boolean
  promotion_label?: string
  cta_text: string
  timestamp: string
}

/**
 * Union type of all GTM events
 */
export type GTMEvent =
  | ScrollDepthEvent
  | CTAClickEvent
  | PageExitEvent
  | FAQInteractionEvent
  | PricingPlanClickEvent

/**
 * Type guard to check if an object is a valid GTM event
 */
export function isGTMEvent(obj: unknown): obj is GTMEvent {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const event = obj as Record<string, unknown>

  if (typeof event.event !== 'string' || typeof event.timestamp !== 'string') {
    return false
  }

  const validEvents = [
    'page_scroll_depth',
    'cta_click',
    'page_exit',
    'faq_interaction',
    'pricing_plan_click'
  ]

  return validEvents.includes(event.event)
}

/**
 * Helper type for creating partial GTM events (useful for testing)
 */
export type PartialGTMEvent<T extends GTMEvent> = Omit<T, 'timestamp'> & {
  timestamp?: string
}
