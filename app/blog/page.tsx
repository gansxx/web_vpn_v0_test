"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BLOG_CATEGORIES } from "@/lib/blog-data"
import { ExternalLink } from "lucide-react"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <a href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full relative">
                <div className="absolute inset-0.5 bg-red-600 rounded-full"></div>
                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-foreground">Z加速</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-muted-foreground hover:text-primary transition-colors">
              功能
            </a>
            <a href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
              服务
            </a>
            <a href="/#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              定价
            </a>
            <a href="/#download" className="text-muted-foreground hover:text-primary transition-colors">
              下载
            </a>
            <a href="/blog" className="text-primary font-medium transition-colors">
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

      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none"></div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
              发现世界
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              精选的优质网站和博客资源，助您探索更广阔的互联网世界
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {BLOG_CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.entries.map((entry) => (
                      <a
                        key={entry.id}
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors group/entry"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground mb-1 group-hover/entry:text-primary transition-colors">
                              {entry.name}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {entry.description}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/entry:text-primary group-hover/entry:translate-x-1 transition-all shrink-0 mt-1" />
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-full relative">
                    <div className="absolute inset-0.5 bg-red-600 rounded-full"></div>
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-xl font-bold">Z加速</span>
              </div>
              <p className="text-primary-foreground/80">专业的网络加速服务提供商</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    VPN服务
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    游戏加速
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    企业方案
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    帮助中心
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    联系我们
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    服务状态
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">公司</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    关于我们
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    隐私政策
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    服务条款
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 Z加速. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
