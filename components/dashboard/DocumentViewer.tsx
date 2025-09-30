"use client"

import { useState, useEffect } from "react"
import { MarkdownRenderer } from "./MarkdownRenderer"
import { DocumentMeta } from "@/lib/documents"

interface DocumentViewerProps {
  document: DocumentMeta
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

export function DocumentViewer({ document, isOpen, onClose, isMobile = false }: DocumentViewerProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !document) return

    const loadDocument = async () => {
      try {
        setLoading(true)
        setError(null)

        // If document has no filename, show description or placeholder
        if (!document.filename) {
          setContent(`# ${document.title}\n\n${document.description}\n\n该文档包含以下子文档，请从左侧文档列表中选择具体的子文档查看详细内容。`)
          setLoading(false)
          return
        }

        const response = await fetch(`/doc/${document.filename}`)

        if (!response.ok) {
          throw new Error(`加载文档失败: ${response.status}`)
        }

        const text = await response.text()
        setContent(text)
      } catch (err: any) {
        setError(err.message || '加载文档失败')
        console.error('Failed to load document:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [document, isOpen])

  if (!isOpen) return null

  const ViewerContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{document.icon}</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{document.title}</h2>
            <p className="text-sm text-gray-500">{document.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {loading && (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <p className="text-center text-gray-500 mt-4">正在加载文档...</p>
          </div>
        )}

        {error && (
          <div className="p-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">文档加载失败</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                重新加载
              </button>
            </div>
          </div>
        )}

        {!loading && !error && content && (
          <div className="p-6">
            <MarkdownRenderer
              content={content}
              className="text-gray-700 leading-snug"
              compact={true}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>最后更新: {document.lastUpdated}</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>打印</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    // Mobile: Full screen modal
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white h-full">
          <ViewerContent />
        </div>
      </div>
    )
  }

  // Desktop: Side panel
  return (
    <>
      {/* Backdrop for mobile/tablet */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      ></div>

      {/* Side panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <ViewerContent />
      </div>
    </>
  )
}