"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ClientDownloadCard } from "@/components/ClientDownloadCard"
import { AppStoreCard } from "@/components/AppStoreCard"
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
                  src="google_play.png"
                  alt="Google Play 立即下载"
                  className="h-[75px] w-auto"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/zh-cn?size=200x63&releaseDate=1712188800"
                  alt="App Store 立即下载"
                  className="h-[60px] w-auto"
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

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
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

            <ClientDownloadCard
              name="macOS"
              bgColor="bg-gray-700"
              icon={
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                  <path d="M32.92 42.7872H15.08C8.75998 42.7872 4.5 38.347 4.5 31.747V16.2471C4.5 9.74707 8.83998 5.20703 15.08 5.20703H32.92C39.24 5.20703 43.5 9.64707 43.5 16.2471V31.747C43.5 38.347 39.24 42.7872 32.92 42.7872ZM15.08 8.20703C10.48 8.20703 7.5 11.3671 7.5 16.2471V31.747C7.5 36.627 10.48 39.7872 15.08 39.7872H32.92C37.52 39.7872 40.5 36.627 40.5 31.747V16.2471C40.5 11.3671 37.52 8.20703 32.92 8.20703H15.08Z" fill="white"></path>
                  <path d="M27.3408 42.7904C26.6408 42.7904 26.0208 42.2908 25.8808 41.5908C25.3408 38.9308 24.9808 36.2704 24.7608 33.6704C24.5208 30.7104 24.5208 28.6704 24.5608 27.7504C23.7408 27.7304 22.9208 27.6508 22.0608 27.5308C19.6808 27.2308 19.2608 25.7306 19.1808 24.3106C19.0408 21.5506 21.0608 10.2506 21.8608 6.41059C22.0208 5.59059 22.8208 5.07045 23.6408 5.25045C24.4608 5.41045 24.9808 6.21071 24.8008 7.03071C23.8208 11.7907 22.0808 22.0508 22.1808 24.1508C22.1808 24.3108 22.2008 24.4308 22.2208 24.5108C22.2808 24.5108 22.3608 24.5308 22.4808 24.5508C23.4808 24.6908 24.3808 24.7504 25.2608 24.7504C26.0008 24.7504 26.5808 24.9706 27.0008 25.4106C27.6408 26.0906 27.6008 26.9308 27.5808 27.6108C27.5608 28.2108 27.5008 30.2706 27.7608 33.4106C27.9608 35.8906 28.3208 38.4306 28.8208 40.9706C28.9808 41.7906 28.4608 42.5704 27.6408 42.7304C27.5408 42.7304 27.4408 42.7504 27.3408 42.7504V42.7904Z" fill="white"></path>
                  <path d="M23.7004 35.7125C19.9004 35.7125 16.2604 34.3125 13.4404 31.7925C12.8204 31.2325 12.7804 30.2925 13.3204 29.6725C13.8804 29.0525 14.8204 29.0127 15.4404 29.5527C17.7204 31.5927 20.6404 32.7125 23.7004 32.7125C27.0204 32.7125 30.1604 31.4127 32.5204 29.0327C33.1004 28.4527 34.0604 28.4527 34.6404 29.0327C35.2204 29.6127 35.2204 30.5729 34.6404 31.1529C31.7204 34.0929 27.8204 35.7125 23.7004 35.7125Z" fill="white"></path>
                  <path d="M32.8606 20.334C32.0406 20.334 31.3606 19.654 31.3606 18.834V16.5742C31.3606 15.7542 32.0406 15.0742 32.8606 15.0742C33.6806 15.0742 34.3606 15.7542 34.3606 16.5742V18.834C34.3606 19.654 33.6806 20.334 32.8606 20.334ZM15.1406 20.334C14.3206 20.334 13.6406 19.654 13.6406 18.834V16.5742C13.6406 15.7542 14.3206 15.0742 15.1406 15.0742C15.9606 15.0742 16.6406 15.7542 16.6406 16.5742V18.834C16.6406 19.654 15.9606 20.334 15.1406 20.334Z" fill="white"></path>
                </svg>
              }
            />

            <ClientDownloadCard
              name="Linux"
              bgColor="bg-gray-600"
              icon={
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.21 14.125C22.0384 14.125 22.71 14.7966 22.71 15.625V19.1963C22.71 20.0248 22.0384 20.6964 21.21 20.6964C20.3816 20.6964 19.71 20.0248 19.71 19.1963V15.625C19.71 14.7966 20.3816 14.125 21.21 14.125Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M26.792 14.125C27.6204 14.125 28.292 14.7966 28.292 15.625V19.1963C28.292 20.0248 27.6204 20.6964 26.792 20.6964C25.9636 20.6964 25.292 20.0248 25.292 19.1963V15.625C25.292 14.7966 25.9636 14.125 26.792 14.125Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M27.2926 21.3585C28.0224 20.9665 28.9318 21.2405 29.3238 21.9703C31.664 26.3277 32.3218 31.3931 31.1724 36.2037C30.98 37.0095 30.1706 37.5065 29.3648 37.3141C28.5592 37.1215 28.062 36.3123 28.2546 35.5065C29.233 31.4113 28.673 27.0991 26.6808 23.3897C26.2888 22.6599 26.5626 21.7505 27.2926 21.3585Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.7092 21.3585C21.439 21.7505 21.713 22.6599 21.321 23.3897C19.3291 27.0989 18.7691 31.4107 19.7476 35.5057C19.9401 36.3113 19.443 37.1207 18.6372 37.3131C17.8315 37.5057 17.0222 37.0085 16.8297 36.2029C15.6803 31.3925 16.3381 26.3275 18.678 21.9703C19.07 21.2405 19.9794 20.9665 20.7092 21.3585Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M24.001 8.75781C20.2054 8.75781 17.1284 11.8348 17.1284 15.6304V16.1799C17.1283 20.3704 15.819 24.456 13.3834 27.866C13.3834 27.866 13.3835 27.8658 13.3834 27.866L13.117 28.239C13.1163 28.24 13.1156 28.241 13.1149 28.242C12.834 28.6412 12.6934 29.1222 12.7151 29.61C12.7518 30.4376 12.1107 31.1382 11.2831 31.175C10.4555 31.2118 9.75476 30.5706 9.71802 29.743C9.66682 28.5896 10.0003 27.452 10.6661 26.5088L10.6708 26.5022L10.942 26.1224C13.0143 23.2214 14.1283 19.7451 14.1284 16.1799V15.6304C14.1284 10.1779 18.5485 5.75781 24.001 5.75781C29.4534 5.75781 33.8734 10.1779 33.8734 15.6304V16.1799C33.8734 19.7451 34.9874 23.2212 37.0596 26.1224L37.3358 26.5088C38.0016 27.452 38.335 28.5896 38.2838 29.743C38.247 30.5706 37.5464 31.2118 36.7188 31.175C35.8912 31.1382 35.25 30.4376 35.2868 29.61C35.3084 29.1222 35.1678 28.6412 34.8868 28.242C34.8862 28.241 34.8856 28.24 34.8848 28.239L34.6184 27.866C32.1828 24.4562 30.8734 20.3704 30.8734 16.1799V15.6304C30.8734 11.8348 27.7966 8.75781 24.001 8.75781Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M27.9228 36.6535C27.9228 36.6533 27.923 36.6535 27.9228 36.6535L28.0142 36.7109C28.0138 36.7105 28.0148 36.7113 28.0142 36.7109C28.6718 37.1211 29.4286 37.3497 30.2032 37.3713C31.0314 37.3943 31.684 38.0845 31.661 38.9125C31.6378 39.7407 30.9478 40.3933 30.1198 40.3701C28.811 40.3337 27.5358 39.9489 26.4254 39.2555L26.422 39.2535L26.3268 39.1937C24.905 38.2999 23.0968 38.2997 21.675 39.1933L21.576 39.2555C20.4656 39.9489 19.1903 40.3337 17.8816 40.3701C17.0535 40.3933 16.3635 39.7407 16.3404 38.9125C16.3174 38.0845 16.97 37.3943 17.7981 37.3713C18.5728 37.3497 19.3279 37.1221 19.9855 36.7119L20.0786 36.6535C20.0784 36.6535 20.0786 36.6533 20.0786 36.6535C22.476 35.1467 25.5254 35.1467 27.9228 36.6535Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M22.5462 17.0617C23.4456 16.5419 24.5538 16.5419 25.4532 17.0617L28.6886 18.9314C30.423 19.9338 30.646 22.3496 29.1246 23.6526L25.8892 26.4234C24.8016 27.3548 23.1978 27.3548 22.1102 26.4234L18.8748 23.6526C17.3533 22.3496 17.5764 19.9338 19.3108 18.9314L22.5462 17.0617ZM23.9996 19.6866L20.9284 21.4616L23.9996 24.0918L27.071 21.4616L23.9996 19.6866Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M36.0831 27.2232C36.5421 27.3012 36.9371 27.5118 37.2453 27.8128C37.4507 28.0138 37.5953 28.2326 37.6983 28.431C37.9897 28.2606 38.3293 28.1108 38.6931 28.0172C39.3883 27.8382 40.4539 27.811 41.3219 28.637L41.3265 28.6412C42.6037 29.8668 42.2979 31.4938 42.0103 32.3564C41.9979 32.3936 41.9869 32.4278 41.9775 32.4594C41.9989 32.4702 42.0211 32.4816 42.0433 32.4934C42.2053 32.579 42.4383 32.7132 42.6667 32.9176C43.2063 33.4 43.5003 34.0708 43.5003 34.8872C43.5003 35.784 43.0783 36.6292 42.3587 37.1674L42.3267 37.1906L36.6897 41.1786C34.5447 42.7746 31.5527 42.556 29.6611 40.6644C27.7647 38.7674 27.5503 35.765 29.1603 33.6184L29.1673 33.6092L33.1753 28.3502C33.6477 27.7232 34.6941 26.9354 36.0831 27.2232ZM35.2329 30.5994L31.5573 35.4224C30.8467 36.374 30.9423 37.7026 31.7827 38.5434C32.6245 39.385 33.9561 39.4794 34.9073 38.7656L34.9413 38.7406L40.2797 34.9638C39.9633 34.796 39.3493 34.4284 39.0611 33.6362C38.7923 32.8976 38.9273 32.1178 39.1643 31.4072C39.2221 31.234 39.2503 31.0968 39.2607 30.9944C39.2505 30.9996 39.2403 31.005 39.2301 31.0108C39.1937 31.0312 39.1635 31.0508 39.1413 31.0666C39.1261 31.0774 39.1179 31.0842 39.1163 31.0856C38.8199 31.3612 38.5211 31.6048 38.2199 31.784C37.9419 31.9492 37.4883 32.165 36.9347 32.1248C36.2715 32.0766 35.8191 31.6966 35.5673 31.332C35.3813 31.0628 35.2849 30.779 35.2329 30.5994Z" fill="white"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.9171 27.2232C11.4582 27.3012 11.0632 27.5118 10.755 27.8128C10.5495 28.0138 10.4051 28.2326 10.302 28.431C10.0105 28.2606 9.67104 28.1108 9.3072 28.0172C8.61192 27.8382 7.54642 27.811 6.67832 28.637L6.67376 28.6412C5.39658 29.8668 5.7024 31.4938 5.99006 32.3564C6.00248 32.3936 6.0133 32.4278 6.02272 32.4594C6.00128 32.4702 5.97924 32.4816 5.95704 32.4934C5.79504 32.579 5.56196 32.7132 5.3335 32.9176C4.79392 33.4 4.5 34.0708 4.5 34.8872C4.5 35.784 4.92192 36.6292 5.64166 37.1674L5.67354 37.1906L11.3105 41.1786C13.4557 42.7746 16.4475 42.556 18.3392 40.6644C20.2356 38.7674 20.45 35.765 18.8399 33.6184L18.833 33.6092L14.825 28.3502C14.3526 27.7232 13.3061 26.9354 11.9171 27.2232ZM12.7673 30.5994L16.443 35.4224C17.1535 36.374 17.058 37.7026 16.2177 38.5434C15.3758 39.385 14.0441 39.4794 13.0931 38.7656L13.059 38.7406L7.72052 34.9638C8.03706 34.796 8.651 34.4284 8.93924 33.6362C9.20798 32.8976 9.07298 32.1178 8.83594 31.4072C8.77822 31.234 8.74998 31.0968 8.73964 30.9944C8.74974 30.9996 8.7599 31.005 8.7701 31.0108C8.8065 31.0312 8.83676 31.0508 8.85902 31.0666C8.87424 31.0774 8.88234 31.0842 8.88406 31.0856C9.18046 31.3612 9.47918 31.6048 9.78044 31.784C10.0584 31.9492 10.512 32.165 11.0656 32.1248C11.7288 32.0766 12.1811 31.6966 12.433 31.332C12.619 31.0628 12.7154 30.779 12.7673 30.5994Z" fill="white"></path>
                </svg>
              }
            />

            <AppStoreCard
              name="Google Play"
              bgColor="bg-white-500"
              href="https://play.google.com/store/apps/details?id=app.hiddify.com"
              icon={
                <svg width="40" height="40" viewBox="0 0 28.99 31.99" xmlns="http://www.w3.org/2000/svg">
                  <g data-name="Capa 2">
                    <g data-name="Capa 1"><path d="M13.54 15.28.12 29.34a3.66 3.66 0 0 0 5.33 2.16l15.1-8.6Z" style={{ fill: '#34a853' }}/>
                      <path d="m27.11 12.89-6.53-3.74-7.35 6.45 7.38 7.28 6.48-3.7a3.54 3.54 0 0 0 1.5-4.79 3.62 3.62 0 0 0-1.5-1.5z" style={{ fill:'#fbbc04'}}/>
                      <path d="M.12 2.66a3.57 3.57 0 0 0-.12.92v24.84a3.57 3.57 0 0 0 .12.92L14 15.64Z" style={{fill:'#4285f4'}}/>
                      <path d="m13.64 16 6.94-6.85L5.5.51A3.73 3.73 0 0 0 3.63 0 3.64 3.64 0 0 0 .12 2.65Z" style={{fill:"#34a853"}}/>
                    </g>
                  </g>
                </svg>
                  }
            />

            <AppStoreCard
              name="App Store"
              bgColor="bg-gray-800"
              href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
              icon={
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              }
            />
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
