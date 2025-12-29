"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { Components } from 'react-markdown'

export default function SelfHostVpnPage() {
  const [content, setContent] = useState<string>("")

  useEffect(() => {
    // Fetch markdown file from public directory
    fetch('/self-host-vpn.md')
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(err => console.error('Failed to load markdown:', err))
  }, [])

  // Map heading text to IDs for anchor links
  const headingIdMap: Record<string, string> = {
    "1. 购买海外VPS": "note1",
    "2. 部署远程服务器": "note2",
    "3. 一键部署网络测试代理": "note3",
    "4. 自动VPN生命周期管理": "note4",
  }

  // Custom components for ReactMarkdown with full styling
  const components: Components = {
    h1: ({ children }) => {
      const text = children?.toString() || ''
      const id = headingIdMap[text]
      return (
        <h1 id={id} className="text-4xl font-bold mb-8 mt-12 first:mt-0 text-foreground">
          {children}
        </h1>
      )
    },
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-6 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 text-muted-foreground leading-7">
        {children}
      </p>
    ),
    pre: ({ children }) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6 border border-border">
        {children}
      </pre>
    ),
    code: ({ inline, children, ...props }: any) => {
      return inline ? (
        <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground border border-border" {...props}>
          {children}
        </code>
      ) : (
        <code className="font-mono text-sm text-foreground block" {...props}>
          {children}
        </code>
      )
    },
    ul: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-muted-foreground leading-7">
        {children}
      </li>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-primary no-underline hover:underline transition-colors">
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="rounded-lg shadow-lg my-6 max-w-full h-auto" />
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">
        {children}
      </strong>
    ),
    hr: () => (
      <hr className="my-8 border-border" />
    ),
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full relative">
                <div className="absolute inset-0.5 bg-red-600 rounded-full"></div>
                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-foreground">Z加速</span>
          </div>
          

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
              主页
            </a>
            
            <a href="/blog/self-host-vpn" className="text-muted-foreground hover:text-primary transition-colors">
              自托管
            </a>
            <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
              发现世界
            </a>
            <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              控制台
            </a>
            <Button asChild>
              <a href="/signin">登录</a>
            </Button>
          </nav>
        </div>
        
      </header>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <article className="max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </section>

      
    </div>
  )
}
