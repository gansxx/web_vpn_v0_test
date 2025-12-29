/**
 * GTM Scroll Depth Tracking System
 *
 * This module provides scroll depth monitoring with throttling and section awareness.
 * It tracks scroll milestones (25%, 50%, 75%, 100%) and identifies which page sections
 * users are viewing.
 */

import type { ScrollDepthEvent } from './events'
import { pushGTMEvent, getTimestamp, getCurrentSection, getScrollPercentage, throttle } from './utils'

/**
 * Scroll tracking state
 */
interface ScrollTrackingState {
  maxScrollDepth: number
  sectionsViewed: Set<string>
  milestonesReached: Set<number>
  isInitialized: boolean
  cleanupFunction: (() => void) | null
}

/**
 * Global scroll tracking state
 */
const scrollState: ScrollTrackingState = {
  maxScrollDepth: 0,
  sectionsViewed: new Set<string>(),
  milestonesReached: new Set<number>(),
  isInitialized: false,
  cleanupFunction: null,
}

/**
 * Scroll milestones to track (percentages)
 */
const SCROLL_MILESTONES = [25, 50, 75, 100]

/**
 * Throttle delay for scroll events (milliseconds)
 */
const SCROLL_THROTTLE_DELAY = 300

/**
 * Handle scroll event and track depth/sections
 */
function handleScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  // Get current scroll percentage
  const scrollPercentage = getScrollPercentage()

  // Update max scroll depth
  if (scrollPercentage > scrollState.maxScrollDepth) {
    scrollState.maxScrollDepth = scrollPercentage
  }

  // Get current visible section
  const currentSection = getCurrentSection()
  if (currentSection) {
    scrollState.sectionsViewed.add(currentSection)
  }

  // Check for milestone achievement
  for (const milestone of SCROLL_MILESTONES) {
    if (
      scrollPercentage >= milestone &&
      !scrollState.milestonesReached.has(milestone)
    ) {
      // Mark milestone as reached
      scrollState.milestonesReached.add(milestone)

      // Push scroll depth event to GTM
      const event: ScrollDepthEvent = {
        event: 'page_scroll_depth',
        scroll_percentage: milestone as 25 | 50 | 75 | 100,
        page_section: (currentSection as any) || 'hero',
        timestamp: getTimestamp(),
      }

      pushGTMEvent(event)

      // Log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Scroll Tracker] Milestone reached: ${milestone}% at section ${currentSection || 'unknown'}`
        )
      }
    }
  }
}

/**
 * Initialize scroll depth tracking
 *
 * Sets up event listeners with throttling and returns a cleanup function
 * to remove listeners when the component unmounts.
 *
 * @returns Cleanup function to remove event listeners
 */
export function initScrollTracking(): () => void {
  if (typeof window === 'undefined') {
    // Server-side rendering - return no-op cleanup
    return () => {}
  }

  if (scrollState.isInitialized) {
    // Already initialized - return existing cleanup function
    console.warn('[Scroll Tracker] Already initialized')
    return scrollState.cleanupFunction || (() => {})
  }

  // Create throttled scroll handler
  const throttledScrollHandler = throttle(handleScroll, SCROLL_THROTTLE_DELAY)

  // Add scroll event listener with passive option for better performance
  window.addEventListener('scroll', throttledScrollHandler, { passive: true })

  // Mark as initialized
  scrollState.isInitialized = true

  // Log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('[Scroll Tracker] Initialized with throttle delay:', SCROLL_THROTTLE_DELAY, 'ms')
  }

  // Create cleanup function
  const cleanup = () => {
    window.removeEventListener('scroll', throttledScrollHandler)
    scrollState.isInitialized = false
    scrollState.cleanupFunction = null

    if (process.env.NODE_ENV === 'development') {
      console.log('[Scroll Tracker] Cleaned up')
    }
  }

  // Store cleanup function for potential reuse
  scrollState.cleanupFunction = cleanup

  // Trigger initial scroll check (in case page is already scrolled)
  handleScroll()

  return cleanup
}

/**
 * Get current scroll tracking state
 *
 * @returns Object with max scroll depth and sections viewed
 */
export function getScrollTrackingState(): {
  maxScrollDepth: number
  sectionsViewed: string[]
} {
  return {
    maxScrollDepth: scrollState.maxScrollDepth,
    sectionsViewed: Array.from(scrollState.sectionsViewed),
  }
}

/**
 * Reset scroll tracking state
 *
 * Useful when navigating to a new page or resetting tracking
 */
export function resetScrollTracking(): void {
  scrollState.maxScrollDepth = 0
  scrollState.sectionsViewed.clear()
  scrollState.milestonesReached.clear()

  if (process.env.NODE_ENV === 'development') {
    console.log('[Scroll Tracker] State reset')
  }
}

/**
 * Check if scroll tracking is initialized
 *
 * @returns true if tracking is active
 */
export function isScrollTrackingInitialized(): boolean {
  return scrollState.isInitialized
}
