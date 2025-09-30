export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

// Developer Mode Configuration
export const DEV_MODE_ENABLED = process.env.NEXT_PUBLIC_DEV_MODE_ENABLED === "true";

// Check if running in development environment
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

// Developer mode settings with localStorage fallback
export function getDevModeSetting(key: string, envDefault?: string): boolean {
  if (typeof window === "undefined") {
    // Server-side: use environment variables only
    return process.env[`NEXT_PUBLIC_${key}`] === "true" || envDefault === "true";
  }

  // Client-side: check localStorage first, then environment variables
  const localStorageKey = `dev_mode_${key.toLowerCase()}`;
  const localValue = localStorage.getItem(localStorageKey);

  if (localValue !== null) {
    return localValue === "true";
  }

  return process.env[`NEXT_PUBLIC_${key}`] === "true" || envDefault === "true";
}

export function setDevModeSetting(key: string, value: boolean): void {
  if (typeof window === "undefined") return;

  const localStorageKey = `dev_mode_${key.toLowerCase()}`;
  localStorage.setItem(localStorageKey, value.toString());
}

export function resetDevModeSettings(): void {
  if (typeof window === "undefined") return;

  const keys = [
    "dev_mode_disable_turnstile",
    "dev_mode_disable_auth_middleware"
  ];

  keys.forEach(key => localStorage.removeItem(key));
}
