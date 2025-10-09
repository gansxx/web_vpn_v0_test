import packageJson from '../package.json'

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://selfgo.asia/api";

// Application Version (automatically synced from package.json)
export const APP_VERSION = packageJson.version;

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

/**
 * 获取环境变量调试信息
 * 适用于本地开发和 Vercel 等部署平台
 * 自动过滤敏感信息（如 TURNSTILE_SITE_KEY）
 */
export function getEnvDebugInfo() {
  const envVars = {
    // API Configuration
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,

    // Turnstile Configuration
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,

    // Developer Mode Configuration
    NEXT_PUBLIC_DEV_MODE_ENABLED: process.env.NEXT_PUBLIC_DEV_MODE_ENABLED,
    NEXT_PUBLIC_DISABLE_TURNSTILE: process.env.NEXT_PUBLIC_DISABLE_TURNSTILE,
    NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE: process.env.NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE,

    // Node Environment
    NODE_ENV: process.env.NODE_ENV,
  }

  // 敏感关键词列表
  const sensitiveKeys = ['TURNSTILE_SITE_KEY', 'SITE_KEY', 'SECRET', 'KEY', 'TOKEN', 'PASSWORD']
  const filtered: Record<string, string> = {}

  Object.entries(envVars).forEach(([key, value]) => {
    const isSensitive = sensitiveKeys.some(sk => key.toUpperCase().includes(sk))
    filtered[key] = isSensitive ? '[FILTERED - SENSITIVE]' : (value || '[NOT SET]')
  })

  return filtered
}
