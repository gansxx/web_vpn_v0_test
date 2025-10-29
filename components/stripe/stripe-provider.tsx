"use client"

/**
 * Stripe Elements Provider 组件
 * 包装 Stripe Elements 以便在子组件中使用
 */

import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe-utils"
import { ReactNode } from "react"

interface StripeProviderProps {
  children: ReactNode
  clientSecret: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const stripePromise = getStripe()

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#0070f3",
        colorBackground: "#ffffff",
        colorText: "#000000",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
