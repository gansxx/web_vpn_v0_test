interface WelcomeBannerProps {
  onOrderClick: () => void
}

export function WelcomeBanner({ onOrderClick }: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            欢迎使用Z加速，使用教程请参考文档中心，
            <br />
            若有疑问可提交工单或联系右下角客服～
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={onOrderClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              一键订阅
            </button>
            <button className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
              Telegram群组
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
    </div>
  )
}