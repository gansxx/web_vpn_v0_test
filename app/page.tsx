"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-primary-foreground rounded-sm"></div>
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
              <Button size="lg" className="text-lg px-8">
                免费试用
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                了解更多
              </Button>
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">安全可靠</h3>
                <p className="text-muted-foreground">军用级加密技术，保护您的隐私和数据安全</p>
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
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">多平台支持</h3>
                <p className="text-muted-foreground">支持Windows、Mac、iOS、Android等多个平台</p>
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
                    <div className="w-8 h-8 bg-red-600 rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.71.002-22.95zM5.398 1.05V24c8.914-.494 16.52-.418 16.52-.418V1.05z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Netflix</div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-blue-900 rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0927 9.3214C2.8207 11.0806.9999 13.9222.9999 17.2623c0 .5511.4482.9993.9993.9993h19.0016c.5511 0 .9993-.4482.9993-.9993-.0001-3.3401-1.8209-6.1817-5.0929-7.9409z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Steam</div>
                  </Card>
                  <Card className="p-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1277c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Discord</div>
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
            {/* Free Plan */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">免费套餐</h3>
                  <div className="text-4xl font-bold text-primary mb-2">¥0</div>
                  <p className="text-muted-foreground">测试期间免费使用</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">使用量：无限制</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">使用时间：测试期间</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">基础节点访问</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">多平台支持</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  立即开始
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-accent/50">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-sm font-medium">
                即将推出
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">付费套餐</h3>
                  <div className="text-4xl font-bold text-accent mb-2">待推出</div>
                  <p className="text-muted-foreground">更多高级功能</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-accent-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">免费套餐所有功能</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-accent-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">高速专线节点</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-accent-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">优先技术支持</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-accent-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">高级功能解锁</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent" size="lg" disabled>
                  敬请期待
                </Button>
              </CardContent>
            </Card>
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
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0927 9.3214C2.8207 11.0806.9999 13.9222.9999 17.2623c0 .5511.4482.9993.9993.9993h19.0016c.5511 0 .9993-.4482.9993-.9993-.0001-3.3401-1.8209-6.1817-5.0929-7.9409z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Android</h3>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  下载
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Windows</h3>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  下载
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">macOS</h3>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  下载
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">iOS</h3>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  教程
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-primary rounded-sm"></div>
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
