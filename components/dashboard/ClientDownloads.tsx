'use client'

import { useEffect, useState } from "react"
import { API_BASE } from "@/lib/config"
import { useWindowsDownloadUrl } from "@/hooks/useWindowsDownloadUrl"
import { useAndroidDownloadUrl } from "@/hooks/useAndroidDownloadUrl"

interface DownloadResponse {
  download_url: string
  file_size?: number
  file_hash?: string
  expiration_time?: string
}

export function ClientDownloads() {
  // Windows 下载状态
  const [windowsDownloadUrl, setWindowsDownloadUrl] = useState<string | null>(null)
  const [windowsLoading, setWindowsLoading] = useState(true)
  const [windowsError, setWindowsError] = useState<string | null>(null)
  const [windowsFileSize, setWindowsFileSize] = useState<number | null>(null)

  // Android 下载状态
  const [androidDownloadUrl, setAndroidDownloadUrl] = useState<string | null>(null)
  const [androidLoading, setAndroidLoading] = useState(true)
  const [androidError, setAndroidError] = useState<string | null>(null)
  const [androidFileSize, setAndroidFileSize] = useState<number | null>(null)

  const {
    storeDownloadUrl: storeWindowsUrl,
    getCachedDownloadUrl: getWindowsCachedUrl
  } = useWindowsDownloadUrl()

  const {
    storeDownloadUrl: storeAndroidUrl,
    getCachedDownloadUrl: getAndroidCachedUrl
  } = useAndroidDownloadUrl()

  // Fetch Windows download URL
  useEffect(() => {
    const fetchWindowsDownloadUrl = async () => {
      try {
        setWindowsLoading(true)
        setWindowsError(null)

        // 1. 首先检查缓存
        const cached = getWindowsCachedUrl()
        if (cached && cached.download_url) {
          setWindowsDownloadUrl(cached.download_url)
          setWindowsFileSize(cached.file_size || null)
          setWindowsLoading(false)
          return
        }

        // 2. 无缓存则调用 API
        const response = await fetch(
          `${API_BASE}/r2/packages/v2rayN_windows.zip/1.0.0/download`,
          {
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error(`获取下载链接失败: ${response.status}`)
        }

        const data: DownloadResponse = await response.json()

        // 3. 存储到缓存
        storeWindowsUrl({
          download_url: data.download_url,
          file_size: data.file_size,
          file_hash: data.file_hash
        })

        setWindowsDownloadUrl(data.download_url)
        if (data.file_size) {
          setWindowsFileSize(data.file_size)
        }
      } catch (err) {
        setWindowsError(err instanceof Error ? err.message : "获取下载链接失败")
      } finally {
        setWindowsLoading(false)
      }
    }

    fetchWindowsDownloadUrl()
  }, [getWindowsCachedUrl, storeWindowsUrl])

  // Fetch Android download URL
  useEffect(() => {
    const fetchAndroidDownloadUrl = async () => {
      try {
        setAndroidLoading(true)
        setAndroidError(null)

        // 1. 首先检查缓存
        const cached = getAndroidCachedUrl()
        if (cached && cached.download_url) {
          setAndroidDownloadUrl(cached.download_url)
          setAndroidFileSize(cached.file_size || null)
          setAndroidLoading(false)
          return
        }

        // 2. 无缓存则调用 API
        const response = await fetch(
          `${API_BASE}/r2/packages/v2rayN_android.apk/1.0.0/download`,
          {
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error(`获取下载链接失败: ${response.status}`)
        }

        const data: DownloadResponse = await response.json()

        // 3. 存储到缓存
        storeAndroidUrl({
          download_url: data.download_url,
          file_size: data.file_size,
          file_hash: data.file_hash
        })

        setAndroidDownloadUrl(data.download_url)
        if (data.file_size) {
          setAndroidFileSize(data.file_size)
        }
      } catch (err) {
        setAndroidError(err instanceof Error ? err.message : "获取下载链接失败")
      } finally {
        setAndroidLoading(false)
      }
    }

    fetchAndroidDownloadUrl()
  }, [getAndroidCachedUrl, storeAndroidUrl])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">VPN客户端下载</h3>

      <div className="space-y-3">
        {/* Android 客户端 */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0927 9.3214C2.8207 11.0806.9999 13.9222.9999 17.2623c0 .5511.4482.9993.9993.9993h19.0016c.5511 0 .9993-.4482.9993-.9993-.0001-3.3401-1.8209-6.1817-5.0929-7.9409z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-gray-900">Android客户端</span>
              {androidFileSize && (
                <span className="text-xs text-gray-500">{formatFileSize(androidFileSize)}</span>
              )}
            </div>
          </div>
          {androidError ? (
            <span className="text-sm text-red-600">{androidError}</span>
          ) : (
            <button
              disabled={androidLoading || !androidDownloadUrl}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {androidLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  加载中...
                </>
              ) : androidDownloadUrl ? (
                <a href={androidDownloadUrl} target="_blank" rel="noopener noreferrer">
                  下载
                </a>
              ) : (
                "获取中..."
              )}
            </button>
          )}
        </div>

        {/* Windows 客户端 */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
            </svg>
            <div className="flex flex-col">
              <span className="text-gray-900">Windows电脑客户端</span>
              {windowsFileSize && (
                <span className="text-xs text-gray-500">{formatFileSize(windowsFileSize)}</span>
              )}
            </div>
          </div>
          {windowsError ? (
            <span className="text-sm text-red-600">{windowsError}</span>
          ) : (
            <button
              disabled={windowsLoading || !windowsDownloadUrl}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {windowsLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  加载中...
                </>
              ) : windowsDownloadUrl ? (
                <a href={windowsDownloadUrl} target="_blank" rel="noopener noreferrer">
                  下载
                </a>
              ) : (
                "获取中..."
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}