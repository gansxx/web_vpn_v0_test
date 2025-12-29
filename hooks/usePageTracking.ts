/**
 * usePageTracking Hook
 *
 * Manages page-level tracking lifecycle including:
 * - Scroll depth monitoring
 * - Page exit event tracking
 * - Visibility change handling
 */

import { useEffect, useRef } from 'react'
import {
  initScrollTracking,
  resetScrollTracking,
  getScrollTrackingState,
} from '@/lib/gtm/scroll-tracker'
import { trackPageExit } from '@/lib/analytics'

/**
 * Minimum time on page (seconds) to avoid tracking as bounce
 */
const MIN_TIME_FOR_ENGAGEMENT = 5

/**
 * Hook for page-level tracking
 *
 * @returns Object with pageLoadTime for use in other tracking functions
 */
export function usePageTracking() {
  const pageLoadTimeRef = useRef<number>(Date.now())
  const hasTrackedExitRef = useRef<boolean>(false)

  useEffect(() => {
    // Reset scroll tracking state on mount
    resetScrollTracking()

    // Initialize scroll depth tracking
    const cleanupScrollTracking = initScrollTracking()

    /**
     * Track page exit with current scroll state
     */
    const trackExit = (exitType: 'bounce' | 'navigation') => {
      // Prevent duplicate exit tracking
      if (hasTrackedExitRef.current) {
        return
      }
      hasTrackedExitRef.current = true

      const { maxScrollDepth, sectionsViewed } = getScrollTrackingState()
      const timeOnPage = Math.floor((Date.now() - pageLoadTimeRef.current) / 1000)

      // Determine if this is a bounce or navigation
      // Bounce = user left quickly with minimal engagement
      const actualExitType =
        timeOnPage < MIN_TIME_FOR_ENGAGEMENT && maxScrollDepth < 25
          ? 'bounce'
          : 'navigation'

      trackPageExit(
        actualExitType,
        pageLoadTimeRef.current,
        maxScrollDepth,
        sectionsViewed
      )

      if (process.env.NODE_ENV === 'development') {
        console.log('[Page Tracking] Exit tracked:', {
          exitType: actualExitType,
          timeOnPage,
          maxScrollDepth,
          sectionsViewed,
        })
      }
    }

    /**
     * Handle beforeunload event (page navigation/close)
     */
    const handleBeforeUnload = () => {
      trackExit('navigation')
    }

    /**
     * Handle visibility change (tab switch, minimize)
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = Math.floor(
          (Date.now() - pageLoadTimeRef.current) / 1000
        )

        // Only track as exit if user is actually leaving (not just switching tabs briefly)
        // We'll track on visibility change for better data, but mark as bounce if short visit
        if (timeOnPage > 0) {
          trackExit(timeOnPage < MIN_TIME_FOR_ENGAGEMENT ? 'bounce' : 'navigation')
        }
      }
    }

    /**
     * Handle pagehide event (more reliable than beforeunload on mobile)
     */
    const handlePageHide = () => {
      trackExit('navigation')
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    // Log initialization in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Page Tracking] Initialized at:', new Date(pageLoadTimeRef.current).toISOString())
    }

    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)

      // Cleanup scroll tracking
      cleanupScrollTracking()

      if (process.env.NODE_ENV === 'development') {
        console.log('[Page Tracking] Cleaned up')
      }
    }
  }, []) // Empty dependency array - only run on mount/unmount

  return {
    pageLoadTime: pageLoadTimeRef.current,
  }
}
