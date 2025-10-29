"use client"

/**
 * Stripe 支付测试页面
 * 独立测试页面，无需集成到现有产品流程
 */

import { useState } from "react"
import { createPaymentIntent } from "@/lib/stripe-api"
import { StripeProvider } from "@/components/stripe/stripe-provider"
import { PaymentForm } from "@/components/stripe/payment-form"
import { PaymentStatus } from "@/components/stripe/payment-status"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

type TestStep = "config" | "payment" | "status"

export default function StripeTestPage() {
  const [step, setStep] = useState<TestStep>("config")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 支付配置
  const [productName, setProductName] = useState("测试产品 - VPN 订阅")
  const [amount, setAmount] = useState(50) // 0.50 USD
  const [email, setEmail] = useState("test@example.com")
  const [phone, setPhone] = useState("+1234567890")

  // 支付意图信息
  const [clientSecret, setClientSecret] = useState("")
  const [orderId, setOrderId] = useState("")

  const handleCreatePayment = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await createPaymentIntent({
        product_name: productName,
        trade_num: 1,
        amount: amount,
        currency: "usd",
        email: email,
        phone: phone,
      })

      if (result.success && result.client_secret && result.order_id) {
        setClientSecret(result.client_secret)
        setOrderId(result.order_id)
        setStep("payment")
      } else {
        setError(result.error || "创建支付失败")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建支付失败")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log("支付成功:", paymentIntentId)
    setStep("status")
  }

  const handlePaymentError = (errorMessage: string) => {
    console.error("支付失败:", errorMessage)
    setError(errorMessage)
  }

  const resetTest = () => {
    setStep("config")
    setClientSecret("")
    setOrderId("")
    setError("")
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Stripe 支付测试</h1>
        <p className="mt-2 text-gray-600">独立测试环境 - 验证支付流程</p>
      </div>

      <Tabs value={step} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config" disabled={step !== "config"}>
            1. 配置
          </TabsTrigger>
          <TabsTrigger value="payment" disabled={step !== "payment"}>
            2. 支付
          </TabsTrigger>
          <TabsTrigger value="status" disabled={step !== "status"}>
            3. 状态
          </TabsTrigger>
        </TabsList>

        {/* 步骤 1: 配置支付信息 */}
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>配置支付信息</CardTitle>
              <CardDescription>填写测试数据并创建支付意图</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productName">产品名称</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="输入产品名称"
                />
              </div>

              <div>
                <Label htmlFor="amount">金额 (美分)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="50"
                />
                <p className="mt-1 text-sm text-gray-500">
                  当前金额: ${(amount / 100).toFixed(2)} USD
                </p>
              </div>

              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
              )}

              <Button
                onClick={handleCreatePayment}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  "创建支付意图"
                )}
              </Button>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold">💡 测试提示:</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>金额单位为美分（50 = $0.50）</li>
                  <li>使用真实的邮箱格式</li>
                  <li>点击按钮后将创建实际的 Stripe Payment Intent</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 步骤 2: 支付表单 */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>完成支付</CardTitle>
              <CardDescription>使用测试卡号进行支付</CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <StripeProvider clientSecret={clientSecret}>
                  <PaymentForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
                </StripeProvider>
              ) : (
                <div className="text-center text-gray-500">未找到支付意图</div>
              )}

              <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm">
                <p className="font-semibold">🧪 测试卡号:</p>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">成功:</span> 4242 4242 4242 4242
                    </div>
                    <div>
                      <span className="font-medium">拒绝:</span> 4000 0000 0000 0002
                    </div>
                    <div>
                      <span className="font-medium">余额不足:</span> 4000 0000 0000 9995
                    </div>
                    <div>
                      <span className="font-medium">3D Secure:</span> 4000 0027 6000 3184
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">
                    有效期: 任意未来日期 (如 12/30) | CVC: 任意3位数字 (如 123)
                  </p>
                </div>
              </div>

              <Button variant="outline" onClick={resetTest} className="mt-4 w-full">
                取消并重新配置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 步骤 3: 支付状态 */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>支付状态</CardTitle>
              <CardDescription>实时查询订单状态</CardDescription>
            </CardHeader>
            <CardContent>
              {orderId ? (
                <PaymentStatus orderId={orderId} autoRefresh={true} refreshInterval={2000} />
              ) : (
                <div className="text-center text-gray-500">未找到订单信息</div>
              )}

              <div className="mt-6 space-y-2">
                <Button variant="outline" onClick={resetTest} className="w-full">
                  重新测试
                </Button>

                {orderId && (
                  <div className="rounded-lg bg-gray-50 p-3 text-xs">
                    <p>
                      <span className="font-medium">订单ID:</span> {orderId}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 环境信息 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">环境信息</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">API Base:</span> {process.env.NEXT_PUBLIC_API_BASE}
            </div>
            <div>
              <span className="font-medium">Stripe Key:</span>{" "}
              {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20)}...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
