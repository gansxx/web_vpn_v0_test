export type Plan = {
  id: string
  name: string
  priceDisplay: string
  originalPrice?: string
  promotionLabel?: string
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
  // {
  //   id: "free",
  //   name: "免费套餐",
  //   priceDisplay: "¥0",
  //   description: "适用于基本网页访问",
  //   features: [
  //     "使用量：100MB/月",
  //     "使用时间：无限制",
  //     "基础节点访问",
  //     "多平台支持",
  //   ],
  //   ctaText: "立即开始",
  //   styles: {
  //     home: {
  //       cardBorder: "border-primary/20",
  //       overlay: "from-primary/5",
  //       priceText: "text-primary",
  //       featureDotBg: "bg-primary",
  //       featureDotIcon: "text-primary-foreground",
  //       buttonVariant: "default",
  //     },
  //     dashboard: {
  //       cardBorder: "border-blue-200",
  //       cardBg: "bg-gradient-to-br from-blue-50 to-white",
  //       priceText: "text-blue-600",
  //       featureDotBg: "bg-blue-600",
  //       featureDotIcon: "text-white",
  //       buttonVariant: "default",
  //       buttonClass: "bg-blue-600 hover:bg-blue-700",
  //     },
  //   },
  // },
  {
    id: "gift",
    name: "初级套餐",
    priceDisplay: "¥0",
    originalPrice: "¥99",
    promotionLabel: "限时特价",
    description: "2025.12.31日恢复原价",
    features: [
      "使用量:不限",
      "使用时间:3个月",
      "基础节点访问",
      "多平台支持",
    ],
    badgeText: "限时礼品",
    ctaText: "立即领取",
    ctaDisabled: false,
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
    // styles: {
    //   home: {
    //     cardBorder: "border-green-300",
    //     overlay: "from-green-500/10",
    //     priceText: "text-green-600",
    //     featureDotBg: "bg-green-500",
    //     featureDotIcon: "text-white",
    //     badgeClass: "bg-green-500 text-white",
    //     buttonVariant: "default",
    //     buttonClass: "bg-green-600 hover:bg-green-700",
    //   },
    //   dashboard: {
    //     cardBorder: "border-green-300",
    //     cardBg: "bg-gradient-to-br from-green-50 to-white",
    //     priceText: "text-green-600",
    //     featureDotBg: "bg-green-500",
    //     featureDotIcon: "text-white",
    //     badgeClass: "bg-green-500 text-white rounded-bl-lg",
    //     buttonVariant: "default",
    //     buttonClass: "bg-green-600 hover:bg-green-700",
    //   },
    // },
  },
  {
    id: "premium",
    name: "高级套餐",
    priceDisplay: "¥99/年",
    description: "稳定访问海外流媒体",
    features: [
      "使用量:1500MB/年",
      "使用时间：1年",
      "高速专线节点",
      "优先技术支持",
      
    ],
    badgeText: "入门首选",
    ctaText: "立即开始",
    ctaDisabled: false,
    styles: {
      home: {
        cardBorder: "border-accent/50",
        overlay: "from-accent/5",
        priceText: "text-accent",
        featureDotBg: "bg-accent",
        featureDotIcon: "text-accent-foreground",
        buttonVariant: "default",
        buttonClass: "bg-orange-600 hover:bg-orange-700",
      },
      dashboard: {
        cardBorder: "border-orange-200",
        cardBg: "bg-gradient-to-br from-orange-50 to-white",
        priceText: "text-orange-600",
        featureDotBg: "bg-orange-500",
        featureDotIcon: "text-white",
        badgeClass: "bg-orange-500 text-white rounded-bl-lg",
        buttonVariant: "default",
        buttonClass: "bg-orange-600 hover:bg-orange-700",
      },
    },
  },
  {
    id: "enterprise",
    name: "无限流量套餐",
    priceDisplay: "¥299/年",
    description: "提供最舒适的境外网络访问服务",
    features: [
      "使用量:无限",
      "使用时间:1年",
      "高级套餐所有功能",
      "高级安全功能"
    ],
    badgeText: "热门推荐",
    ctaText: "立即开始",
    ctaDisabled: false,
    styles: {
      home: {
        cardBorder: "border-purple-400",
        overlay: "from-purple-500/20",
        priceText: "text-purple-600",
        featureDotBg: "bg-gradient-to-r from-purple-500 to-pink-500",
        featureDotIcon: "text-white",
        badgeClass: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        buttonVariant: "default",
        buttonClass: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      },
      dashboard: {
        cardBorder: "border-purple-400",
        cardBg: "bg-gradient-to-br from-purple-100 via-pink-50 to-white",
        priceText: "text-purple-600",
        featureDotBg: "bg-gradient-to-r from-purple-500 to-pink-500",
        featureDotIcon: "text-white",
        badgeClass: "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-bl-lg",
        buttonVariant: "default",
        buttonClass: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      },
    },
  },
  
]
