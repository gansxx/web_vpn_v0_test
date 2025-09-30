"use client"

import { useState } from "react"
import { DocumentMeta } from "@/lib/documents"

interface DocumentListProps {
  documents: DocumentMeta[]
  onDocumentSelect: (doc: DocumentMeta) => void
  selectedDocument?: DocumentMeta | null
}

export function DocumentList({ documents, onDocumentSelect, selectedDocument }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set())

  // Group documents by category
  const groupedDocs = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = []
    }
    acc[doc.category].push(doc)
    return acc
  }, {} as Record<string, DocumentMeta[]>)

  // Toggle expansion state
  const toggleExpansion = (docId: string) => {
    const newExpanded = new Set(expandedDocs)
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId)
    } else {
      newExpanded.add(docId)
    }
    setExpandedDocs(newExpanded)
  }

  // Filter documents based on search term (including subDocuments)
  const filteredGroupedDocs = Object.entries(groupedDocs).reduce((acc, [category, docs]) => {
    const filteredDocs = docs.filter(doc => {
      // Check main document
      const mainMatch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       doc.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Check sub documents
      const subMatch = doc.subDocuments?.some(subDoc =>
        subDoc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subDoc.description.toLowerCase().includes(searchTerm.toLowerCase())
      )

      return mainMatch || subMatch
    })
    if (filteredDocs.length > 0) {
      acc[category] = filteredDocs
    }
    return acc
  }, {} as Record<string, DocumentMeta[]>)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "客户端配置": return "⚙️"
      case "故障排除": return "🔧"
      case "常见问题": return "❓"
      case "多平台指南": return "📱"
      default: return "📄"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "客户端配置": return "bg-blue-50 border-blue-200 text-blue-800"
      case "故障排除": return "bg-red-50 border-red-200 text-red-800"
      case "常见问题": return "bg-green-50 border-green-200 text-green-800"
      case "多平台指南": return "bg-purple-50 border-purple-200 text-purple-800"
      default: return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">文档中心</h1>
        <div className="text-sm text-gray-500">
          {documents.length} 个文档
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="搜索文档..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Document Categories */}
      {Object.entries(filteredGroupedDocs).map(([category, docs]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCategoryIcon(category)}</span>
            <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
            <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(category)}`}>
              {docs.length} 个文档
            </span>
          </div>

          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc.id} className="space-y-2">
                {/* Main Document */}
                <div
                  onClick={() => {
                    // If document has subDocuments, toggle expansion
                    if (doc.subDocuments && doc.subDocuments.length > 0) {
                      toggleExpansion(doc.id)
                    } else if (doc.filename) {
                      // If no subDocuments but has filename, open directly
                      onDocumentSelect(doc)
                    }
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedDocument?.id === doc.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  } ${doc.subDocuments && doc.subDocuments.length > 0 ? 'hover:bg-gray-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{doc.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate flex items-center">
                          {doc.title}
                          {doc.subDocuments && doc.subDocuments.length > 0 && (
                            <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                              点击展开
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {doc.subDocuments && doc.subDocuments.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExpansion(doc.id)
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title={expandedDocs.has(doc.id) ? "折叠子文档" : "展开子文档"}
                            >
                              <svg
                                className={`w-4 h-4 transition-transform ${expandedDocs.has(doc.id) ? 'rotate-90' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                          {doc.filename && (
                            <button
                              onClick={() => onDocumentSelect(doc)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="查看文档"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {doc.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                        <span>最后更新: {doc.lastUpdated}</span>
                        {doc.subDocuments && doc.subDocuments.length > 0 && (
                          <span className="bg-gray-100 px-2 py-1 rounded-full">
                            {doc.subDocuments.length} 个子文档
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Documents */}
                {doc.subDocuments && expandedDocs.has(doc.id) && (
                  <div className="ml-6 space-y-2">
                    {doc.subDocuments.map((subDoc) => (
                      <div
                        key={subDoc.id}
                        onClick={() => onDocumentSelect(subDoc)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                          selectedDocument?.id === subDoc.id
                            ? "border-blue-400 bg-blue-50 shadow-sm"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-lg">{subDoc.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-medium text-gray-800 truncate">
                              {subDoc.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {subDoc.description}
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                              <span>更新: {subDoc.lastUpdated}</span>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {Object.keys(filteredGroupedDocs).length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">未找到文档</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "请尝试不同的搜索关键词" : "暂无可用的文档"}
          </p>
        </div>
      )}
    </div>
  )
}