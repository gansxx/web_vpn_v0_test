"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ClientDownloadCard } from "@/components/ClientDownloadCard"
import { PLANS } from "@/lib/plans"

export default function HomePage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  // Debug: 在控制台输出应用版本和环境变量（支持 Vercel 等部署平台）
  useEffect(() => {
    if (typeof window === "undefined") return

    const { APP_VERSION, getEnvDebugInfo } = require("@/lib/config")
    const envInfo = getEnvDebugInfo()

    console.group("🚀 Application Debug Info")
    console.log(`📦 App Version: ${APP_VERSION}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Origin: ${window.location.origin}`)
    console.groupEnd()

    console.group("🔧 Environment Variables (Runtime)")
    console.table(envInfo)
    console.log("📝 Variables from runtime environment:", envInfo)
    console.log("ℹ️ Note: Works in Vercel, local dev, and all deployment platforms")
    console.groupEnd()
  }, [])

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
            <button
              onClick={() => scrollToSection("features")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              功能
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              服务
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              定价
            </button>
            <button
              onClick={() => scrollToSection("download")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              下载
            </button>
            <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              控制台
            </a>
            <Button asChild>
              <a href="/signin">登录</a>
            </Button>
          </nav>
        </div>
      </header>

      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none"></div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
              解锁全球
              <span className="text-primary">互联网</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              专业的网络加速服务，让您随时随地高速访问全球内容。支持多平台，稳定可靠。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="/signin">免费试用</a>
              </Button>
              <Button onClick={() => scrollToSection("features")} variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                了解更多
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <a
                href="https://play.google.com/store/apps/details?id=app.hiddify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/zh-cn_badge_web_generic.png"
                  alt="Google Play 立即下载"
                  className="h-14"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/zh-cn?size=250x83&amp;releaseDate=1712188800"
                  alt="App Store 立即下载"
                  className="h-14"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent via-muted/30 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">为什么选择我们</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              专业的技术团队，为您提供最优质的网络加速体验
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">极速连接</h3>
                <p className="text-muted-foreground">全球优质节点，智能路由选择，为您提供最快的连接速度</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">超大流量</h3>
                <p className="text-muted-foreground">海量带宽资源，不限速不限流，畅享高清视频和大文件下载</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">超高性价比</h3>
                <p className="text-muted-foreground">合理定价，物超所值，让每个用户都能享受优质的网络服务</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/3 to-transparent"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">适用于各种场景</h2>
              <p className="text-lg text-muted-foreground mb-8">
                无论是观看海外视频、游戏加速、跨境电商还是学习研究，我们都能为您提供稳定快速的网络连接。
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex items-center justify-center"></div>
                  <span className="text-foreground">海外视频流媒体</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex items-center justify-center"></div>
                  <span className="text-foreground">游戏加速优化</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex items-center justify-center"></div>
                  <span className="text-foreground">跨境电商业务</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex items-center justify-center"></div>
                  <span className="text-foreground">学术研究资料</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 animate-float">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-red-500 rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">YouTube</div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-black rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">X (Twitter)</div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Steam</div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-green-600 rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">ChatGPT</div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">选择适合您的套餐</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">灵活的定价方案，满足不同用户的需求</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PLANS.map((plan) => {
              const s = plan.styles?.home
              const border = s?.cardBorder ?? "border-muted"
              const overlayFrom = s?.overlay ?? "from-muted/10"
              const priceClass = s?.priceText ?? "text-foreground"
              const dotBg = s?.featureDotBg ?? "bg-muted"
              const dotIcon = s?.featureDotIcon ?? "text-foreground"
              const btnVariant = s?.buttonVariant ?? "default"
              const btnClass = s?.buttonClass ?? ""
              return (
                <Card key={plan.id} className={`relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 ${border}`}>
                  {plan.badgeText ? (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-sm font-medium">
                      {plan.badgeText}
                    </div>
                  ) : null}
                  <div className={`absolute inset-0 bg-gradient-to-br ${overlayFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                      <div className={`text-4xl font-bold mb-2 ${priceClass}`}>{plan.priceDisplay}</div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="space-y-4 mb-8">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className={`w-5 h-5 ${dotBg} rounded-full flex items-center justify-center`}>
                            <svg className={`w-3 h-3 ${dotIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant={btnVariant as any}
                      className={`w-full ${btnClass}`}
                      size="lg"
                      disabled={plan.ctaDisabled}
                      asChild
                    >
                      <a href="/signin">{plan.ctaText}</a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="download" className="py-20 px-6 bg-gradient-to-b from-transparent via-muted/20 to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">立即开始使用</h2>
            <p className="text-lg text-muted-foreground">选择适合您设备的客户端，开始您的高速网络体验</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <ClientDownloadCard
              name="Android"
              bgColor="bg-green-600"
              icon={
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0927 9.3214C2.8207 11.0806.9999 13.9222.9999 17.2623c0 .5511.4482.9993.9993.9993h19.0016c.5511 0 .9993-.4482.9993-.9993-.0001-3.3401-1.8209-6.1817-5.0929-7.9409z" />
                </svg>
              }
            />

            <ClientDownloadCard
              name="Windows"
              bgColor="bg-blue-500"
              icon={
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
                </svg>
              }
            />

            {/* 如需添加其他客户端，使用相同的 ClientDownloadCard 组件即可，自动包含登录跳转逻辑 */}
            {/* 示例：
            <ClientDownloadCard
              name="macOS"
              bgColor="bg-gray-800"
              icon={<svg>...</svg>}
            />
            <ClientDownloadCard
              name="iOS"
              bgColor="bg-gray-800"
              buttonText="教程"
              icon={<svg>...</svg>}
            />
            */}
          </div>
        </div>
      </section>

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
