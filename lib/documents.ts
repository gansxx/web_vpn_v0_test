export interface DocumentMeta {
  id: string
  title: string
  description: string
  category: string
  filename?: string  // 主文档的文件名，对于有子文档的可选
  icon: string
  lastUpdated: string
  subDocuments?: DocumentMeta[]  // 子文档数组
}

export const documents: DocumentMeta[] = [
  {
    id: "tutorial",
    title: "使用教程",
    description: "详细的客户端下载、安装和配置指南",
    category: "使用教程",
    icon: "📚",
    lastUpdated: "2024-01-15",
    subDocuments: [
      {
        id: "tutorial-windows",
        title: "Windows客户端使用教程",
        description: "详细的客户端下载、安装和配置指南，包含订阅链接获取和导入步骤",
        category: "使用教程",
        filename: "subscription.md",
        icon: "🪟",
        lastUpdated: "2024-01-15"
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "常见问题排除",
    description: "解决连接失败、速度慢、无法访问等常见技术问题的方法",
    category: "故障排除",
    icon: "🔧",
    lastUpdated: "2024-01-10",
    subDocuments: [
      {
        id: "troubleshooting-connection",
        title: "连接问题",
        description: "解决无法连接、连接超时等网络连接问题",
        category: "故障排除",
        filename: "troubleshooting-connection.md",
        icon: "🔌",
        lastUpdated: "2024-01-10"
      },
      {
        id: "troubleshooting-speed",
        title: "速度优化",
        description: "解决网络慢、延迟高等性能问题",
        category: "故障排除",
        filename: "troubleshooting-speed.md",
        icon: "⚡",
        lastUpdated: "2024-01-10"
      },
      {
        id: "troubleshooting-access",
        title: "访问问题",
        description: "解决特定网站无法访问、DNS等问题",
        category: "故障排除",
        filename: "troubleshooting-access.md",
        icon: "🚫",
        lastUpdated: "2024-01-10"
      }
    ]
  },
  {
    id: "faq",
    title: "常见问题解答",
    description: "用户最关心的问题和详细解答，涵盖订购、使用、技术支持等方面",
    category: "常见问题",
    filename: "faq.md",
    icon: "❓",
    lastUpdated: "2024-01-12"
  }
]