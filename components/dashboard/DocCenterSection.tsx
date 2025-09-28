"use client"

import { useState, useEffect } from "react"
import { DocumentList, DocumentMeta } from "./DocumentList"
import { DocumentViewer } from "./DocumentViewer"

export function DocCenterSection() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentMeta | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Document metadata
  const documents: DocumentMeta[] = [
    {
      id: "subscription",
      title: "VPN客户端使用教程",
      description: "详细的客户端下载、安装和配置指南，包含订阅链接获取和导入步骤",
      category: "客户端配置",
      filename: "subscription.md",
      icon: "🔧",
      lastUpdated: "2024-01-15"
    },
    {
      id: "troubleshooting",
      title: "常见问题排除",
      description: "解决连接失败、速度慢、无法访问等常见技术问题的方法",
      category: "故障排除",
      filename: "troubleshooting.md",
      icon: "🔧",
      lastUpdated: "2024-01-10"
    },
    {
      id: "platform-guides",
      title: "多平台客户端指南",
      description: "Windows、Mac、iOS、Android等不同平台的专属配置教程",
      category: "多平台指南",
      filename: "platform-guides.md",
      icon: "📱",
      lastUpdated: "2024-01-08"
    },
    {
      id: "faq",
      title: "常见问题解答",
      description: "用户最关心的问题和详细解答，涵盖订购、使用、技术支持等方面",
      category: "常见问题",
      filename: "faq.md",
      icon: "❓",
      lastUpdated: "2024-01-12"
    }
  ]

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDocumentSelect = (doc: DocumentMeta) => {
    setSelectedDocument(doc)
    setIsViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setIsViewerOpen(false)
    // Delay clearing selection to allow close animation
    setTimeout(() => setSelectedDocument(null), 300)
  }

  return (
    <div className="relative">
      {/* Main content area */}
      <div className={`transition-all duration-300 ${isViewerOpen && !isMobile ? 'pr-0 lg:pr-2' : ''}`}>
        <div className="space-y-6">
          <DocumentList
            documents={documents}
            onDocumentSelect={handleDocumentSelect}
            selectedDocument={selectedDocument}
          />

          {/* Additional help resources */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">其他帮助资源</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">技术支持</h4>
                <p className="text-gray-600 text-sm mb-3">遇到问题？我们的技术团队随时为您服务</p>
                <button
                  onClick={() => {
                    // Navigate to tickets section
                    const event = new CustomEvent('navigate-to-section', { detail: 'tickets' });
                    window.dispatchEvent(event);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                >
                  <span>提交工单</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">用户社区</h4>
                <p className="text-gray-600 text-sm mb-3">加入我们的Telegram群组，与其他用户交流</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                  <span>加入群组</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document viewer */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}