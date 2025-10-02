import { showToast } from "./markdown-utils"

/**
 * Handle API error responses with unified user feedback
 * @param response - Fetch Response object
 * @returns Error message string
 */
export async function handleApiError(response: Response): Promise<string> {
  const status = response.status

  switch (status) {
    case 401:
      // Unauthorized - session expired or not logged in
      showToast("登录已过期，请重新登录", "error")

      // Redirect to signin page after a short delay
      setTimeout(() => {
        // Preserve current path for redirect after login
        const currentPath = window.location.pathname
        if (currentPath !== "/signin") {
          window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`
        } else {
          window.location.href = "/signin"
        }
      }, 1500)

      return "登录已过期，请重新登录"

    case 403:
      // Forbidden - no permission
      showToast("无权访问此资源", "error")
      return "无权访问此资源"

    case 404:
      // Not found
      return "请求的资源不存在"

    case 500:
      // Internal server error
      showToast("服务器错误，请稍后重试", "error")
      return "服务器错误，请稍后重试"

    case 503:
      // Service unavailable
      showToast("服务暂时不可用，请稍后重试", "error")
      return "服务暂时不可用"

    default:
      // Generic error
      const errorMessage = `请求失败 (${status})`
      showToast(errorMessage, "error")
      return errorMessage
  }
}

/**
 * Check if response is OK, if not handle the error
 * @param response - Fetch Response object
 * @returns true if OK, false if error occurred
 */
export async function checkResponseOk(response: Response): Promise<boolean> {
  if (response.ok) {
    return true
  }

  await handleApiError(response)
  return false
}
