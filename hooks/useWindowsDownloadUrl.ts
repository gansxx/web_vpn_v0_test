import { useCallback, useEffect, useState } from "react"

interface WindowsDownloadData {
  download_url: string
  file_size?: number
  file_hash?: string
  timestamp: number
  expiresAt: number
}

const SESSION_KEY = "windows_download_cache"
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds (presigned URL expiration)

export function useWindowsDownloadUrl() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [fileHash, setFileHash] = useState<string | null>(null)

  // Load from session storage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        const data: WindowsDownloadData = JSON.parse(stored)

        // Check if cache is still valid
        if (Date.now() < data.expiresAt && data.download_url) {
          setDownloadUrl(data.download_url)
          setFileSize(data.file_size || null)
          setFileHash(data.file_hash || null)
        } else {
          // Cache expired, clear it
          sessionStorage.removeItem(SESSION_KEY)
        }
      }
    } catch (error) {
      console.warn("Failed to load Windows download URL from session:", error)
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [])

  // Store download URL in session storage
  const storeDownloadUrl = useCallback((data: {
    download_url: string
    file_size?: number
    file_hash?: string
  }) => {
    if (typeof window === "undefined" || !data.download_url) {
      return
    }

    try {
      const cacheData: WindowsDownloadData = {
        download_url: data.download_url,
        file_size: data.file_size,
        file_hash: data.file_hash,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION
      }

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(cacheData))
      setDownloadUrl(cacheData.download_url)
      setFileSize(cacheData.file_size || null)
      setFileHash(cacheData.file_hash || null)
    } catch (error) {
      console.warn("Failed to store Windows download URL in session:", error)
    }
  }, [])

  // Get cached download URL
  const getCachedDownloadUrl = useCallback((): WindowsDownloadData | null => {
    if (typeof window === "undefined") return null

    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (!stored) return null

      const data: WindowsDownloadData = JSON.parse(stored)

      // Check if cache is still valid
      if (Date.now() < data.expiresAt && data.download_url) {
        return data
      }

      // Cache expired
      sessionStorage.removeItem(SESSION_KEY)
      return null
    } catch (error) {
      console.warn("Failed to get cached Windows download URL:", error)
      return null
    }
  }, [])

  // Clear cached data
  const clearCache = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY)
    }
    setDownloadUrl(null)
    setFileSize(null)
    setFileHash(null)
  }, [])

  // Check if we have a valid cached URL
  const hasCachedUrl = useCallback((): boolean => {
    return downloadUrl !== null && downloadUrl.trim() !== ""
  }, [downloadUrl])

  return {
    downloadUrl,
    fileSize,
    fileHash,
    storeDownloadUrl,
    getCachedDownloadUrl,
    clearCache,
    hasCachedUrl
  }
}
