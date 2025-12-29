/**
 * GTM (Google Tag Manager) Utility Functions
 *
 * This file contains helper functions for interacting with the GTM dataLayer
 * and managing tracking events.
 */

import type { GTMEvent } from './events'

/**
 * Global dataLayer interface extension
 */
declare global {
  interface Window {
    dataLayer?: any[]
  }
}

/**
 * Safely push an event to the GTM dataLayer
 *
 * @param event - GTM event object to push
 */
export function pushGTMEvent(event: GTMEvent): void {
  try {
    // Ensure dataLayer exists
    if (typeof window === 'undefined') {
      // Server-side rendering - do nothing
      return
    }

    if (!window.dataLayer) {
      // Initialize dataLayer if it doesn't exist
      window.dataLayer = []
      console.warn('[GTM] dataLayer not found, initializing new dataLayer')
    }

    // Push event to dataLayer
    window.dataLayer.push(event)

    // Log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[GTM] Event pushed:', event)
    }
  } catch (error) {
    // Graceful error handling
    console.error('[GTM] Failed to push event:', error)
  }
}

/**
 * Get current ISO 8601 timestamp
 *
 * @returns ISO 8601 formatted timestamp string
 */
export function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Calculate time spent on page in seconds
 *
 * @param startTime - Page load timestamp (from Date.now())
 * @returns Number of seconds since page load
 */
export function getTimeOnPage(startTime: number): number {
  const currentTime = Date.now()
  const timeOnPage = Math.floor((currentTime - startTime) / 1000)
  return timeOnPage
}

/**
 * Format section ID for consistent tracking
 * Removes '#' prefix and converts to lowercase
 *
 * @param id - Section ID (with or without '#' prefix)
 * @returns Normalized section ID
 */
export function formatSectionId(id: string): string {
  return id.replace('#', '').toLowerCase()
}

/**
 * Check if an element is in the viewport
 *
 * @param element - HTML element to check
 * @returns true if element is visible in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  // Check if element is at least partially visible
  const verticalInView = rect.top <= windowHeight && rect.bottom >= 0
  const horizontalInView = rect.left <= windowWidth && rect.right >= 0

  return verticalInView && horizontalInView
}

/**
 * Get the current visible section ID based on scroll position
 *
 * @returns Section ID of the currently visible section, or null if none found
 */
export function getCurrentSection(): string | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const sections = [
    'hero',
    'features',
    'services',
    'pricing',
    'download',
    'faq'
  ]

  // Find the first section that is in viewport
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId)
    if (element && isInViewport(element)) {
      return sectionId
    }
  }

  return null
}

/**
 * Get scroll percentage of the page
 *
 * @returns Scroll percentage (0-100)
 */
export function getScrollPercentage(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0
  }

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight
  const winHeight = window.innerHeight

  const scrollableHeight = docHeight - winHeight

  if (scrollableHeight <= 0) {
    return 100
  }

  const scrollPercentage = (scrollTop / scrollableHeight) * 100

  return Math.min(Math.max(scrollPercentage, 0), 100)
}

/**
 * Throttle function execution
 * Limits how often a function can be called
 *
 * @param func - Function to throttle
 * @param delay - Minimum delay between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return function (...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}
