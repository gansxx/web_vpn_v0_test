/**
 * Google Ads gtag.js Type Declarations
 *
 * Provides TypeScript types for Google Ads conversion tracking.
 *
 * @see https://developers.google.com/tag-platform/gtagjs/reference
 */

interface Window {
  /**
   * Global Site Tag (gtag.js) function for Google Ads tracking
   *
   * @param command - The gtag command ('config', 'event', 'set', etc.)
   * @param target - Target ID or event name
   * @param params - Additional parameters
   *
   * @example
   * // Send conversion event
   * window.gtag('event', 'conversion', {
   *   'send_to': 'AW-123456789/AbC-D_efG-h12_34-567',
   *   'value': 1.0,
   *   'currency': 'CNY',
   *   'transaction_id': 'unique-id-12345'
   * });
   */
  gtag: (...args: any[]) => void;

  /**
   * Data layer array for gtag.js
   * Stores all gtag commands before the library loads
   */
  dataLayer: any[];
}

/**
 * Google Ads Conversion Event Parameters
 */
interface GtagConversionParams {
  /** Target conversion action in format 'AW-XXXXXXXXXX/conversion-label' */
  send_to: string;
  /** Conversion value (use 0.0 for free plans) */
  value?: number;
  /** Currency code (e.g., 'CNY', 'USD') */
  currency?: string;
  /** Unique transaction ID to prevent duplicate tracking */
  transaction_id?: string;
  /** Custom event parameters */
  [key: string]: any;
}

/**
 * Google Ads Config Parameters
 */
interface GtagConfigParams {
  /** Custom page path */
  page_path?: string;
  /** Custom page title */
  page_title?: string;
  /** Custom campaign parameters */
  campaign_name?: string;
  campaign_source?: string;
  campaign_medium?: string;
  /** Custom event parameters */
  [key: string]: any;
}

/**
 * Type-safe gtag function declarations
 */
declare global {
  interface Window {
    gtag(command: 'config', targetId: string, config?: GtagConfigParams): void;
    gtag(command: 'event', eventName: 'conversion', params: GtagConversionParams): void;
    gtag(command: 'event', eventName: string, params?: { [key: string]: any }): void;
    gtag(command: 'set', params: { [key: string]: any }): void;
    gtag(command: 'js', date: Date): void;
  }
}

export {};
