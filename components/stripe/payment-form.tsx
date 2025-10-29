"use client"

/**
 * Stripe 支付表单组件
 */

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PaymentFormProps {
  onSuccess?: (orderId: string) => void
  onError?: (error: string) => void
  returnUrl?: string
}

export function PaymentForm({ onSuccess, onError, returnUrl }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage("")

    try {
      // 确认支付
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment/result`,
        },
        redirect: "if_required", // 只在需要时重定向
      })

      if (error) {
        // 支付失败
        const message = error.message || "支付失败"
        setErrorMessage(message)
        onError?.(message)
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // 支付成功
        onSuccess?.(paymentIntent.id)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "支付处理失败"
      setErrorMessage(message)
      onError?.(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            处理中...
          </>
        ) : (
          "确认支付"
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>测试卡号: 4242 4242 4242 4242</p>
        <p>有效期: 任意未来日期 | CVC: 任意3位数字</p>
      </div>
    </form>
  )
}
