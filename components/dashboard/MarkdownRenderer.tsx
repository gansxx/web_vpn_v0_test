"use client"

import { useMemo } from "react"
import { processMarkdownContent } from "@/lib/markdown-utils"
import { SubscriptionLinkButton } from "./SubscriptionLinkButton"


interface MarkdownRendererProps {
  content: string
  className?: string
  compact?: boolean
}

export function MarkdownRenderer({ content, className = "", compact = false }: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    return processMarkdownContent(content)
  }, [content])


  // Simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    let html = text

    // Headers - different spacing and font sizes for compact mode
    const h3Class = compact
      ? "text-lg font-semibold text-gray-900 mt-3 mb-2"
      : "text-xl font-semibold text-gray-900 mt-6 mb-4"
    const h2Class = compact
      ? "text-xl font-bold text-gray-900 mt-4 mb-3"
      : "text-2xl font-bold text-gray-900 mt-8 mb-6"
    const h1Class = compact
      ? "text-2xl font-bold text-gray-900 mt-4 mb-3"
      : "text-3xl font-bold text-gray-900 mt-8 mb-6"

    html = html.replace(/^### (.*$)/gm, `<h3 class="${h3Class}">$1</h3>`)
    html = html.replace(/^## (.*$)/gm, `<h2 class="${h2Class}">$1</h2>`)
    html = html.replace(/^# (.*$)/gm, `<h1 class="${h1Class}">$1</h1>`)

    // Special handling for subscription button placeholder (MUST come before bold text processing!)
    const buttonSpacing = compact ? "my-4" : "my-6"
    html = html.replace(
      /\*\*\[🔑 获取我的订阅链接（自动复制）\]\*\*/g,
      `<div class="${buttonSpacing} text-center subscription-button-placeholder">[订阅按钮将在此处显示]</div>`
    )

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')

    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Images - handle both relative and absolute paths (MUST come before Links!)
    const imageSpacing = compact ? "my-2" : "my-4"
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      // If src doesn't start with http, https, or /, treat as relative to public
      let imageSrc = src
      if (!src.startsWith('http') && !src.startsWith('https') && !src.startsWith('/')) {
        imageSrc = `/${src}`
      }

      return `<img src="${imageSrc}" alt="${alt}" class="max-w-full h-auto rounded-lg shadow-md ${imageSpacing}" loading="lazy" />`
    })

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')

    // Code blocks
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm">$1</code>')

    // Blockquotes
    const blockquoteSpacing = compact ? "my-2" : "my-4"
    const blockquotePadding = compact ? "py-1" : "py-2"
    html = html.replace(/^> (.*$)/gm, `<blockquote class="border-l-4 border-blue-500 pl-4 ${blockquotePadding} ${blockquoteSpacing} bg-blue-50 text-gray-700 italic">$1</blockquote>`)

    // Lists
    const listItemSpacing = compact ? "my-0.5" : "my-1"
    html = html.replace(/^- (.*$)/gm, `<li class="ml-4 ${listItemSpacing}">• $1</li>`)
    html = html.replace(/^(\d+)\. (.*$)/gm, `<li class="ml-4 ${listItemSpacing}">$1. $2</li>`)

    // Horizontal rules
    const hrSpacing = compact ? "my-4" : "my-8"
    html = html.replace(/^---$/gm, `<hr class="border-t border-gray-300 ${hrSpacing}" />`)

    // Line breaks
    const paragraphSpacing = compact ? "mb-2" : "mb-4"
    html = html.replace(/\n\n/g, `</p><p class="${paragraphSpacing}">`)
    html = html.replace(/\n/g, '<br />')

    // Wrap in paragraphs
    html = `<p class="${paragraphSpacing}">` + html + '</p>'

    return html
  }

  const htmlContent = renderMarkdown(processedContent)
  const hasSubscriptionButton = htmlContent.includes('subscription-button-placeholder')

  // Apply compact styles if needed - smaller font size and tighter line height
  const proseSize = compact ? "prose-sm" : "prose-lg"
  const compactStyles = compact ? "leading-tight text-sm" : ""
  const buttonMargin = compact ? "my-4" : "my-6"

  return (
    <div className={`prose ${proseSize} max-w-none ${compactStyles} ${className}`}>
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="markdown-content"
      />

      {/* Render subscription button where placeholder exists */}
      {hasSubscriptionButton && (
        <div className={`${buttonMargin} text-center`}>
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