import { useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, Loader2 } from "lucide-react"
import { PLANS } from "@/lib/plans"
import { API_BASE } from "@/lib/config"
import { purchaseAdvancedPlan } from "@/lib/advanced-plan-api"
import { purchaseUnlimitedPlan } from "@/lib/unlimited-plan-api"

interface PricingSectionProps {
  onPurchaseSuccess: () => void
}

export function PricingSection({ onPurchaseSuccess }: PricingSectionProps) {
  const router = useRouter()
  const [purchasingFreePlan, setPurchasingFreePlan] = useState(false)
  const [showWaitingDialog, setShowWaitingDialog] = useState(false)
  const [countdownSeconds, setCountdownSeconds] = useState(50)
  const [purchasedPlanName, setPurchasedPlanName] = useState("")
  const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null)

  // 支付方式选择相关状态
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")

  const handleCloseWaitingDialog = useCallback(() => {
    // 清理轮询定时器
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId)
      setPollingIntervalId(null)
    }
    setShowWaitingDialog(false)
    setCountdownSeconds(50)
    onPurchaseSuccess()
  }, [onPurchaseSuccess, pollingIntervalId])

  // 轮询机制：定期检查产品列表，查找新生成的订阅链接
  const startPolling = useCallback(() => {
    let pollCount = 0
    const maxPolls = 10 // 最多轮询 10 次（50 秒）

    const intervalId = setInterval(async () => {
      pollCount++

      try {
        const response = await fetch(`${API_BASE}/user/products`, {
          credentials: "include"
        })

        if (!response.ok) {
          console.error("轮询产品列表失败:", response.status)
          return
        }

        const products = await response.json()
        const productsArray = Array.isArray(products) ? products : []

        // 查找最新的产品（根据购买时间排序）
        if (productsArray.length > 0) {
          const latestProduct = productsArray.sort((a: any, b: any) => {
            const dateA = a.buy_time ? new Date(a.buy_time).getTime() : 0
            const dateB = b.buy_time ? new Date(b.buy_time).getTime() : 0
            return dateB - dateA
          })[0]

          // 检查最新产品是否有订阅链接
          if (latestProduct?.subscription_url) {
            console.log("✅ 检测到订阅链接已生成，自动关闭等待提示")
            clearInterval(intervalId)
            setPollingIntervalId(null)
            handleCloseWaitingDialog()
            return
          }
        }

        // 达到最大轮询次数，停止轮询
        if (pollCount >= maxPolls) {
          console.warn("⚠️ 轮询超时，停止轮询")
          clearInterval(intervalId)
          setPollingIntervalId(null)
        }
      } catch (error) {
        console.error("轮询过程中发生错误:", error)
      }
    }, 5000) // 每 5 秒轮询一次

    setPollingIntervalId(intervalId)
  }, [handleCloseWaitingDialog])

  // 处理高级套餐支付
  const handlePremiumPurchase = useCallback(async () => {
    setPurchasing(true)
    try {
      const result = await purchaseAdvancedPlan({
        plan_name: "Z加速-高级套餐",
        plan_id:"advanced",
        payment_method: "stripe",
        phone: ""
      })

      if (result.success && result.payment_data?.checkout_url) {
        // 跳转到 Stripe Checkout 页面
        window.location.href = result.payment_data.checkout_url
      } else {
        alert(result.message || "创建支付会话失败")
        setPurchasing(false)
        setShowPaymentDialog(false)
      }
    } catch (error: any) {
      console.error("购买高级套餐失败:", error)
      alert(error?.message || "购买失败，请重试")
      setPurchasing(false)
      setShowPaymentDialog(false)
    }
  }, [])

  // 处理无限流量套餐支付
  const handleEnterprisePurchase = useCallback(async () => {
    setPurchasing(true)
    try {
      const result = await purchaseUnlimitedPlan({
        plan_name: "Z加速-无限流量套餐",
        plan_id: "enterprise",
        payment_method: "stripe",
        phone: ""
      })

      if (result.success && result.payment_data?.checkout_url) {
        // 跳转到 Stripe Checkout 页面
        window.location.href = result.payment_data.checkout_url
      } else {
        alert(result.message || "创建支付会话失败")
        setPurchasing(false)
        setShowPaymentDialog(false)
      }
    } catch (error: any) {
      console.error("购买无限流量套餐失败:", error)
      alert(error?.message || "购买失败，请重试")
      setPurchasing(false)
      setShowPaymentDialog(false)
    }
  }, [])

  // 统一支付处理函数（根据套餐类型调用对应的购买函数）
  const handlePayment = useCallback(async () => {
    if (selectedPlanId === "premium") {
      await handlePremiumPurchase()
    } else if (selectedPlanId === "enterprise") {
      await handleEnterprisePurchase()
    }
  }, [selectedPlanId, handlePremiumPurchase, handleEnterprisePurchase])

  // 倒计时和自动关闭效果
  useEffect(() => {
    if (showWaitingDialog && countdownSeconds > 0) {
      const timer = setTimeout(() => {
        setCountdownSeconds(countdownSeconds - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showWaitingDialog && countdownSeconds === 0) {
      handleCloseWaitingDialog()
    }
  }, [showWaitingDialog, countdownSeconds, handleCloseWaitingDialog])

  // 组件卸载时清理轮询定时器，防止内存泄漏
  useEffect(() => {
    return () => {
      if (pollingIntervalId) {
        console.log("🧹 组件卸载，清理轮询定时器")
        clearInterval(pollingIntervalId)
      }
    }
  }, [pollingIntervalId])

  const purchasePlan = useCallback(async (plan: any) => {
    // 高级套餐（premium）：显示支付方式选择弹窗
    if (plan.id === "premium") {
      setSelectedPlanId(plan.id)
      setShowPaymentDialog(true)
      return
    }

    // 无限流量套餐（enterprise）：显示支付方式选择弹窗
    if (plan.id === "enterprise") {
      setSelectedPlanId(plan.id)
      setShowPaymentDialog(true)
      return
    }

    // 免费套餐：保持原有逻辑
    setPurchasingFreePlan(true)
    try {
      const purchaseResponse = await fetch(`${API_BASE}/user/free-plan/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phone: "",
          plan_id: plan.id,
          plan_name: plan.name,
          duration_days: plan.id === "free" ? 30 : 365
        })
      })

      if (!purchaseResponse.ok) {
        const errorData = await purchaseResponse.json()
        throw new Error(errorData.detail || `购买失败: ${purchaseResponse.status}`)
      }

      const purchaseData = await purchaseResponse.json()

      if (purchaseData.success) {
        // 智能响应处理：检测后端是否已返回订阅链接
        if (purchaseData.subscription_url) {
          // ✅ 后端已返回订阅链接，立即刷新产品列表
          console.log("✅ 后端已返回订阅链接，立即刷新")

          // 🎯 Google Ads 转化追踪
          if (typeof window !== 'undefined' && window.gtag) {
            const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
            const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL

            if (googleAdsId && conversionLabel) {
              // 生成唯一的交易ID，避免重复计数
              const transactionId = `free-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

              // 🔍 可选：提取 gclid 用于调试 (gtag.js 会自动处理，这里仅用于日志)
              const urlParams = new URLSearchParams(window.location.search)
              const gclid = urlParams.get('gclid')

              window.gtag('event', 'conversion', {
                'send_to': `${googleAdsId}/${conversionLabel}`,
                'value': 0.0,
                'currency': 'CNY',
                'transaction_id': transactionId
              })

              console.log("📊 Google Ads 转化事件已触发:", {
                transactionId,
                gclid: gclid || 'direct_traffic',
                timestamp: new Date().toISOString()
              })
            }
          }

          onPurchaseSuccess()
          alert(`${purchaseData.plan_name || plan.name}获取成功！订阅链接已生成`)
        } else {
          // ⏱️ 后端未返回订阅链接（异常情况），显示等待 Dialog 并启动轮询
          console.log("⏱️ 后端未返回订阅链接，启动轮询机制")
          setPurchasedPlanName(purchaseData.plan_name || plan.name)
          setShowWaitingDialog(true)
          setCountdownSeconds(50)
          startPolling()
        }
      } else {
        alert(purchaseData.message || "购买失败")
      }
    } catch (e: any) {
      console.error("购买套餐失败:", e)
      alert(e?.message || "购买失败，请重试")
    } finally {
      setPurchasingFreePlan(false)
    }
  }, [onPurchaseSuccess, router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">选择套餐</h1>
        <p className="text-gray-600">选择最适合您的服务套餐</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.map((plan) => {
          const s = plan.styles?.dashboard
          const border = s?.cardBorder ?? "border-gray-200"
          const bg = s?.cardBg ?? "bg-white"
          const priceClass = s?.priceText ?? "text-gray-900"
          const dotBg = s?.featureDotBg ?? "bg-gray-600"
          const dotIcon = s?.featureDotIcon ?? "text-white"
          const btnVariant = s?.buttonVariant ?? "default"
          const btnClass = s?.buttonClass ?? ""
          const badgeClass = s?.badgeClass ?? "bg-gray-500 text-white rounded-bl-lg"
          return (
            <Card key={plan.id} className={`relative overflow-hidden border-2 ${border} ${bg}`}>
              {plan.badgeText ? (
                <div className={`absolute top-0 right-0 px-3 py-1 text-sm font-medium ${badgeClass}`}>
                  {plan.badgeText}
                </div>
              ) : null}
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className={`text-4xl font-bold mb-2 ${priceClass}`}>{plan.priceDisplay}</div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <div className="space-y-4 mb-8">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 ${dotBg} rounded-full flex items-center justify-center`}>
                        <svg className={`w-3 h-3 ${dotIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-900">{f}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={btnVariant as any}
                  className={`w-full ${btnClass}`}
                  size="lg"
                  disabled={plan.ctaDisabled || purchasingFreePlan}
                  onClick={() => purchasePlan(plan)}
                >
                  {purchasingFreePlan ? "处理中..." : plan.ctaText}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 支付方式选择 Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>选择支付方式</DialogTitle>
            <DialogDescription>
              请选择您的支付方式完成购买
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button
              onClick={handlePayment}
              disabled={purchasing}
              className="w-full h-auto py-4 px-6 flex items-center justify-between hover:bg-blue-600 transition-colors"
              variant="default"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Stripe 支付</div>
                  <div className="text-xs text-blue-100 opacity-90">
                    支持银行卡(国内/国外均支持) / Google Pay / Apple Pay
                  </div>
                </div>
              </div>
              {purchasing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 等待订阅链接生成的提示 Dialog */}
      <Dialog open={showWaitingDialog} onOpenChange={setShowWaitingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              购买成功！
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {purchasedPlanName}
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-700 mb-2">
                  订阅链接正在生成中，请稍候...
                </p>
                <p className="text-sm text-amber-600 font-medium mb-2">
                  ⏱️ 预计需要 5-30 秒
                </p>
                <p className="text-sm text-red-600 font-bold">
                  ⚠️ 请不要关闭此页面
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-800">
                  倒计时：<span className="font-bold text-lg">{countdownSeconds}</span> 秒
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  生成完成后将自动刷新套餐列表
                </p>
              </div>
              <Button
                onClick={handleCloseWaitingDialog}
                className="w-full"
                variant="outline"
              >
                我知道了，手动刷新
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}