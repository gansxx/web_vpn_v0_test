"use client"

export default function HomePage() {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToDownload = () => {
    document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Floating particles and shapes */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-pink-300 rounded-full opacity-80"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-blue-300 rounded-full opacity-40"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-white rounded-full opacity-70"></div>
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-50"></div>

        {/* Large gradient orbs */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-10 blur-3xl"></div>

        {/* Shooting stars/lines */}
        <div className="absolute top-32 right-1/4 w-20 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60 transform rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 transform -rotate-45"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full relative">
              <div className="absolute inset-1 bg-red-600 rounded-full"></div>
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-white text-xl font-medium">帕克云</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white hover:text-purple-200 transition-colors">
            首页
          </a>
          <button onClick={scrollToServices} className="text-white hover:text-purple-200 transition-colors">
            服务
          </button>
          <button onClick={scrollToFeatures} className="text-white hover:text-purple-200 transition-colors">
            特性
          </button>
          <button onClick={scrollToDownload} className="text-white hover:text-purple-200 transition-colors">
            下载
          </button>
          <a href="#" className="text-white hover:text-purple-200 transition-colors">
            价格
          </a>
          <a href="/dashboard" className="text-white hover:text-purple-200 transition-colors">
            Dashboard
          </a>
          <a
            href="/signin"
            className="bg-white text-purple-900 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors font-medium"
          >
            登录
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                帕克云加速器
                <br />
                带你飞翔世界的每个
                <br />
                角落
              </h1>

              <p className="text-purple-200 text-lg leading-relaxed max-w-2xl">
                智能分流系统，国内网站直连，增强用户体验；Apple服务加速；外服游戏加速（IEPL专线）；国外常用网站加速
                (Google/ChatGPT/Youtube/Twitter/Instagram/Github等)；在传输过程中使用最强的加密方式，保护用户数据和隐私；与诸多平台上的优秀应用程序兼容；
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-purple-900 px-8 py-4 rounded-full hover:bg-purple-50 transition-colors font-medium text-lg flex items-center justify-center space-x-2">
                <span>免费注册</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-purple-900 transition-colors font-medium text-lg flex items-center justify-center space-x-2">
                <span>立即下载</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Content - ChatGPT Interface */}
          <div className="relative">
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500 border-opacity-30">
              {/* ChatGPT Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 0 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                  </svg>
                </div>
                <span className="text-white text-xl font-semibold">ChatGPT</span>
              </div>

              {/* Chat message */}
              <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-200 text-sm">
                    ChatGPT for UX Design: How to Use and Benefit from this Tool
                  </span>
                  <svg
                    className="w-4 h-4 text-purple-300 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Feature sections */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                      />
                    </svg>
                  </div>
                  <span className="text-purple-200 text-sm">Examples</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded"></div>
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded"></div>
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded w-3/4"></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-purple-200 text-sm">Capabilities</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded"></div>
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded"></div>
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded w-4/5"></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-8 h-8 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <span className="text-purple-200 text-sm">Limitations</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded"></div>
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded"></div>
                    <div className="h-2 bg-purple-700 bg-opacity-50 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="relative z-10 bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold tracking-wider uppercase">
                CROSS DEVICES & PLATFORMS
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                在你心爱的电子设备中使用，无论是手机还是电脑，随时随处可用。
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                我们的服务适用于 macOS、iOS、Android、Windows 和
                Linux，借助第三方客户端，可在手机、电脑、路由器、游戏机、电视盒子中使用。
              </p>

              <a
                href="/signin"
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
              >
                <span>立即使用</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Right Content - Device Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
                {/* Multiple device screens mockup */}
                <div className="relative z-10 space-y-4">
                  {/* Main KODI interface */}
                  <div className="bg-blue-900 rounded-xl p-4 transform rotate-3 shadow-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-white text-lg font-bold mb-4">KODI</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-700 rounded-lg p-3 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="bg-blue-700 rounded-lg p-3 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Floating hand illustration */}
                  <div className="absolute top-4 right-4 transform -rotate-12">
                    <div className="w-16 h-20 bg-orange-300 rounded-full relative">
                      <div className="absolute top-2 left-2 w-3 h-8 bg-orange-400 rounded-full"></div>
                      <div className="absolute top-1 left-6 w-3 h-10 bg-orange-400 rounded-full"></div>
                      <div className="absolute top-2 left-10 w-3 h-8 bg-orange-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Video player interface */}
                  <div className="bg-green-600 rounded-lg p-3 transform -rotate-2 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Social media cards */}
                  <div className="absolute bottom-4 right-8 space-y-2">
                    <div className="bg-white rounded-lg p-2 shadow-lg flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-lg flex items-center space-x-2">
                      <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
                      <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Popcorn icon */}
                  <div className="absolute top-8 left-4">
                    <div className="w-12 h-16 bg-red-500 rounded-t-full relative">
                      <div className="absolute top-0 left-2 w-2 h-2 bg-yellow-300 rounded-full"></div>
                      <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-300 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-b-lg"></div>
                      <div className="absolute bottom-2 left-1 right-1 h-2 bg-red-400 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-8 w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div className="absolute bottom-8 left-4 w-6 h-6 bg-blue-500 rounded-full"></div>
                  <div className="absolute top-12 right-12 w-3 h-3 bg-pink-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="download" className="relative z-10 bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          {/* Download Header */}
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold mb-8">
              客户端下载
            </div>
          </div>

          {/* Download Cards Grid */}
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Android Card */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0927 9.3214C2.8207 11.0806.9999 13.9222.9999 17.2623c0 .5511.4482.9993.9993.9993h19.0016c.5511 0 .9993-.4482.9993-.9993-.0001-3.3401-1.8209-6.1817-5.0929-7.9409z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">安卓 & 鸿蒙系统</h3>
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                立即下载
              </button>
            </div>

            {/* Windows Card */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Windows系统</h3>
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                立即下载
              </button>
            </div>

            {/* MacOS Card */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.01 2.019c.72 0 1.439.028 2.159.028v.001c-.72.001-1.439.029-2.159.029s-1.439-.028-2.159-.029v-.001c.72 0 1.439-.028 2.159-.028zm7.99 7.99v.001c0 .72-.028 1.439-.028 2.159s.028 1.439.028 2.159v.001c0-.72.028-1.439.028-2.159s-.028-1.439-.028-2.159zm-7.99-7.99v-.001c0-.72.028-1.439.028-2.159s-.028-1.439-.028-2.159v-.001c0 .72-.028 1.439.028 2.159s.028 1.439.028 2.159z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">MacOS</h3>
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                立即下载
              </button>
            </div>

            {/* iPhone & iPad Card */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">iPhone & iPad</h3>
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                查看教程
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative z-10 bg-white py-20">
        <div className="container mx-auto px-6">
          {/* Services Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              海外追剧、游戏加速、跨境电商、学习人工智能
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              专为您有海外需求而设计的服务，随时随地，全平台高速访问，可靠的基础设施，提供便捷的诸多功能
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* High Speed Stable */}
            <div className="text-center group animate-float">
              <div className="relative bg-gray-100 rounded-3xl p-8 text-gray-900 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl overflow-hidden group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-800 group-hover:text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform scale-110 group-hover:scale-100"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gray-200 group-hover:bg-white group-hover:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700">
                    <svg
                      className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-700">高速稳定</h3>
                  <p className="leading-relaxed opacity-70 group-hover:opacity-90 transition-opacity duration-700">
                    体验宛若身在海外的访问速度，适用于您的固网与移动网络。
                  </p>
                </div>
              </div>
            </div>

            {/* Cross Platform Compatibility */}
            <div className="text-center group animate-float-delayed">
              <div className="relative bg-gray-100 rounded-3xl p-8 text-gray-900 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl overflow-hidden group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-800 group-hover:text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform scale-110 group-hover:scale-100"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gray-200 group-hover:bg-white group-hover:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700">
                    <svg
                      className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-700">跨平台兼容</h3>
                  <p className="leading-relaxed opacity-70 group-hover:opacity-90 transition-opacity duration-700">
                    我们的服务适用于 macOS、iOS、Android、Windows。
                  </p>
                </div>
              </div>
            </div>

            {/* Global Connectivity */}
            <div className="text-center group animate-float-slow">
              <div className="relative bg-gray-100 rounded-3xl p-8 text-gray-900 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl overflow-hidden group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-800 group-hover:text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform scale-110 group-hover:scale-100"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gray-200 group-hover:bg-white group-hover:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700">
                    <svg
                      className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M5 12a2 2 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-700">全球互联</h3>
                  <p className="text-gray-600 leading-relaxed">占位符,更加快速，专线连接，更加稳定。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for floating animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 3.5s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          
          .animate-float-slow {
            animation: float-slow 4s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}</style>
      </section>
    </div>
  )
}
