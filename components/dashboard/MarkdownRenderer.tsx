"use client"

import { useMemo } from "react"
import { processMarkdownContent } from "@/lib/markdown-utils"
import { SubscriptionLinkButton } from "./SubscriptionLinkButton"


interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    return processMarkdownContent(content)
  }, [content])


  // Simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    let html = text

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-4">$1</h3>')
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h2>')
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')

    // Special handling for subscription button placeholder (MUST come before bold text processing!)
    html = html.replace(
      /\*\*\[🔑 获取我的订阅链接（自动复制）\]\*\*/g,
      '<div class="my-6 text-center subscription-button-placeholder">[订阅按钮将在此处显示]</div>'
    )

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')

    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Images - handle both relative and absolute paths (MUST come before Links!)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      // If src doesn't start with http, https, or /, treat as relative to public
      let imageSrc = src
      if (!src.startsWith('http') && !src.startsWith('https') && !src.startsWith('/')) {
        imageSrc = `/${src}`
      }

      return `<img src="${imageSrc}" alt="${alt}" class="max-w-full h-auto rounded-lg shadow-md my-4" loading="lazy" />`
    })

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')

    // Code blocks
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm">$1</code>')

    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">$1</blockquote>')

    // Lists
    html = html.replace(/^- (.*$)/gm, '<li class="ml-4 my-1">• $1</li>')
    html = html.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 my-1">$1. $2</li>')

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="border-t border-gray-300 my-8" />')

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-4">')
    html = html.replace(/\n/g, '<br />')

    // Wrap in paragraphs
    html = '<p class="mb-4">' + html + '</p>'

    return html
  }

  const htmlContent = renderMarkdown(processedContent)
  const hasSubscriptionButton = htmlContent.includes('subscription-button-placeholder')

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="markdown-content"
      />

      {/* Render subscription button where placeholder exists */}
      {hasSubscriptionButton && (
        <div className="my-6 text-center">
          <SubscriptionLinkButton
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3"
          />
        </div>
      )}
    </div>
  )
}