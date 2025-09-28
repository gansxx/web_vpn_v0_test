interface FloatingButtonsProps {
  onOrderClick: () => void
  onTicketClick: () => void
}

export function FloatingButtons({ onOrderClick, onTicketClick }: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      <button
        onClick={onOrderClick}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 group"
        title="一键订阅"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="hidden sm:group-hover:block transition-all duration-200">一键订阅</span>
      </button>

      <button
        onClick={onTicketClick}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center space-x-2 group"
        title="提交工单"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="hidden sm:group-hover:block transition-all duration-200">提交工单</span>
      </button>
    </div>
  )
}