import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PLANS } from "@/lib/plans"
import { API_BASE } from "@/lib/config"

interface PricingSectionProps {
  onPurchaseSuccess: () => void
}

export function PricingSection({ onPurchaseSuccess }: PricingSectionProps) {
  const [purchasingFreePlan, setPurchasingFreePlan] = useState(false)

  const purchasePlan = useCallback(async (plan: any) => {
    setPurchasingFreePlan(true)
    try {
      const purchaseResponse = await fetch(`${API_BASE}/user/free-plan/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: "",
          plan_id: plan.id,
          plan_name: plan.name,
          duration_days: plan.id === "free" ? 30 : 365
        }),
        credentials: "include"
      })

      if (!purchaseResponse.ok) {
        const errorData = await purchaseResponse.json()
        throw new Error(errorData.detail || `购买失败: ${purchaseResponse.status}`)
      }

      const purchaseData = await purchaseResponse.json()

      if (purchaseData.success) {
        alert(`${purchaseData.plan_name}获取成功！`)
        onPurchaseSuccess()
      } else {
        alert(purchaseData.message || "购买失败")
      }
    } catch (e: any) {
      console.error("购买套餐失败:", e)
      alert(e?.message || "购买失败，请重试")
    } finally {
      setPurchasingFreePlan(false)
    }
  }, [onPurchaseSuccess])

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
    </div>
  )
}