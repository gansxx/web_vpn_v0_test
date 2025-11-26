// Blog data types and demo content for blog directory page

export type BlogEntry = {
  id: string
  name: string
  url: string
  description: string
}

export type BlogCategory = {
  id: string
  name: string
  description: string
  icon: string
  entries: BlogEntry[]
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  
  {
    id: "youtube_recommendation",
    name: "YouTube 博主推荐",
    description: "值得订阅的优质 YouTube 频道",
    icon: "🎬",
    entries: [
      {
        id: "fireship",
        name: "Fireship",
        url: "https://www.youtube.com/@Fireship",
        description: "用100秒讲清技术要点，科技圈最有趣的编程频道",
      },
      {
        id: "mrbeast",
        name: "MrBeast",
        url: "https://www.youtube.com/@MrBeast",
        description: "全球订阅量最高的个人频道，超大规模挑战、游戏和慈善项目",
      },
      {
        id: "raydalio",
        name: "Ray Dalio",
        url: "https://www.youtube.com/@principlesbyraydalio",
        description: "桥水基金创始人分享投资理念和经济分析，了解全球金融市场必看",
      },
      {
        id: "ted",
        name: "TED",
        url: "https://www.youtube.com/@TED",
        description: "全球顶尖思想者的演讲分享，涵盖科技、教育、商业等各个领域",
      },
    ],
  },
  {
    id: "ai-tools",
    name: "AI 工具",
    description: "前沿人工智能平台和服务",
    icon: "🤖",
    entries: [
      {
        id: "chatgpt",
        name: "ChatGPT",
        url: "https://chat.openai.com/",
        description: "OpenAI 推出的强大对话式 AI，支持写作、编程、翻译等多种任务",
      },
      {
        id: "claude",
        name: "Claude",
        url: "https://claude.ai/",
        description: "Anthropic 开发的 AI 助手，擅长深度分析和长文本处理",
      },
      {
        id: "gemini",
        name: "Gemini",
        url: "https://gemini.google.com/",
        description: "Google 最新一代 AI 模型，支持多模态理解和生成",
      },
      {
        id: "huggingface",
        name: "Hugging Face",
        url: "https://huggingface.co/",
        description: "全球最大的 AI 模型和数据集社区平台，开源 AI 的中心",
      },
    ],
  },
  
  {
    id: "dev-tools",
    name: "开发者社区",
    description: "程序员必备的技术资源平台",
    icon: "💻",
    entries: [
      {
        id: "github",
        name: "GitHub",
        url: "https://github.com/",
        description: "全球最大的代码托管平台和开发者社区",
      },
      {
        id: "stackoverflow",
        name: "Stack Overflow",
        url: "https://stackoverflow.com/",
        description: "全球最大的程序员问答社区，技术问题必查之地",
      },
      {
        id: "hackernews",
        name: "Hacker News",
        url: "https://news.ycombinator.com/",
        description: "硅谷创业圈最受欢迎的技术新闻聚合平台",
      },
    ],
  },
  {
    id: "tools",
    name: "实用工具",
    description: "提升效率的在线工具和服务",
    icon: "🛠️",
    entries: [
      {
        id: "translation",
        name: "沉浸式翻译",
        url: "https://immersivetranslate.com/zh-Hans/docs/",
        description: "双语对照翻译 YouTube、X、Reddit 等网站内容",
      }
    ],
  },
  {
    id: "community",
    name: "国际社区",
    description: "探索全球兴趣社区和论坛",
    icon: "🌍",
    entries: [
      {
        id: "reddit",
        name: "Reddit",
        url: "https://www.reddit.com/",
        description: "国际版贴吧，汇聚全球各类兴趣话题讨论",
      }
    ],
  },
  {
    id: "recommendation",
    name: "精选网站推荐",
    description: "精心挑选的优质境外网站合集",
    icon: "🌐",
    entries: [
      {
        id: "zhihu_recommendation",
        name: "境外网站推荐（知乎）",
        url: "https://www.zhihu.com/tardis/zm/art/697834840",
        description: "2024年最新境外优质网站推荐清单",
      },
      {
        id: "immersivetranslate_sites",
        name: "高质量网站推荐",
        url: "https://immersivetranslate.com/zh-Hans/docs/sites/",
        description: "来自沉浸式翻译团队的精选境外网站列表"
      }
    ],
  },
]
