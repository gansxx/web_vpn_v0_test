export type Plan = {
  id: string
  name: string
  priceDisplay: string
  description: string
  features: string[]
  badgeText?: string
  ctaText: string
  ctaDisabled?: boolean
  styles?: {
    home?: {
      cardBorder?: string
      overlay?: string
      priceText?: string
      badgeClass?: string
      featureDotBg?: string
      featureDotIcon?: string
      buttonVariant?: "default" | "outline"
      buttonClass?: string
    }
    dashboard?: {
      cardBorder?: string
      cardBg?: string
      priceText?: string
      badgeClass?: string
      featureDotBg?: string
      featureDotIcon?: string
      buttonVariant?: "default" | "outline"
      buttonClass?: string
    }
  }
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "免费套餐",
    priceDisplay: "¥0",
    description: "测试期间免费使用",
    features: [
      "使用量：无限制",
      "使用时间：1个月",
      "基础节点访问",
      "多平台支持",
    ],
    ctaText: "立即开始",
    styles: {
      home: {
        cardBorder: "border-primary/20",
        overlay: "from-primary/5",
        priceText: "text-primary",
        featureDotBg: "bg-primary",
        featureDotIcon: "text-primary-foreground",
        buttonVariant: "default",
      },
      dashboard: {
        cardBorder: "border-blue-200",
        cardBg: "bg-gradient-to-br from-blue-50 to-white",
        priceText: "text-blue-600",
        featureDotBg: "bg-blue-600",
        featureDotIcon: "text-white",
        buttonVariant: "default",
        buttonClass: "bg-blue-600 hover:bg-blue-700",
      },
    },
  },
  {
    id: "premium",
    name: "付费套餐",
    priceDisplay: "待推出",
    description: "更多高级功能",
    features: [
      "免费套餐所有功能",
      "高速专线节点",
      "优先技术支持",
      "高级功能解锁",
    ],
    badgeText: "即将推出",
    ctaText: "敬请期待",
    ctaDisabled: true,
    styles: {
      home: {
        cardBorder: "border-accent/50",
        overlay: "from-accent/5",
        priceText: "text-accent",
        featureDotBg: "bg-accent",
        featureDotIcon: "text-accent-foreground",
        buttonVariant: "outline",
        buttonClass: "bg-transparent",
      },
      dashboard: {
        cardBorder: "border-orange-200",
        cardBg: "bg-gradient-to-br from-orange-50 to-white",
        priceText: "text-orange-600",
        featureDotBg: "bg-orange-500",
        featureDotIcon: "text-white",
        badgeClass: "bg-orange-500 text-white rounded-bl-lg",
        buttonVariant: "outline",
        buttonClass: "bg-transparent",
      },
    },
  },
  { 
    id: "enterprise", 
    name: "企业套餐", 
    priceDisplay: "定制报价", 
    description: "满足企业需求", 
    features: [
      "定制化解决方案", 
      "专属客户经理", 
      "优先技术支持", 
      "高级安全功能"
    ], 
    badgeText: "即将推出", 
    ctaText: "敬请期待", 
    ctaDisabled: true,
    styles: {
      home: {
        cardBorder: "border-primary/30",
        overlay: "from-primary/10",
        priceText: "text-primary",
        featureDotBg: "bg-primary",
        featureDotIcon: "text-primary-foreground",
        buttonVariant: "outline",
        buttonClass: "bg-transparent",
      },
      dashboard: {
        cardBorder: "border-violet-200",
        cardBg: "bg-gradient-to-br from-violet-50 to-white",
        priceText: "text-violet-600",
        featureDotBg: "bg-violet-600",
        featureDotIcon: "text-white",
        badgeClass: "bg-violet-500 text-white rounded-bl-lg",
        buttonVariant: "outline",
        buttonClass: "bg-transparent",
      },
    },
  },
]
