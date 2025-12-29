"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackFAQInteraction } from "@/lib/analytics"

export interface FaqItem {
  id: string
  question: string
  answer: React.ReactNode
}

export interface FAQProps {
  items: FaqItem[]
  title?: string
  description?: string
  pageLoadTime?: number
}

export function FAQ({ items, title = "常见问题", description, pageLoadTime }: FAQProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleFaq = (id: string) => {
    const isCurrentlyExpanded = expandedId === id
    setExpandedId(isCurrentlyExpanded ? null : id)

    // Track FAQ interaction
    const item = items.find((i) => i.id === id)
    if (item) {
      const action = isCurrentlyExpanded ? 'collapse' : 'expand'
      const position = items.findIndex((i) => i.id === id) + 1

      trackFAQInteraction(
        action,
        id,
        item.question,
        position,
        pageLoadTime || Date.now()
      )
    }
  }

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#4A148C] mb-3">{title}</h2>
          {description && <p className="text-lg text-muted-foreground">{description}</p>}
        </div>

        <div className="space-y-0">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id
            const isFirst = index === 0

            return (
              <div key={item.id} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left py-6 flex items-center justify-between gap-6 group focus:outline-none cursor-pointer"
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <h3 className="text-lg md:text-xl font-medium text-[#4A148C] pr-4 group-hover:text-[#6A1B9A] transition-colors">
                    {item.question}
                  </h3>

                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <div className="w-12 h-12 rounded-full bg-[#4A148C] flex items-center justify-center transition-all duration-300">
                        <Minus className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300",
                          isFirst || "group-hover:bg-[#4A148C]",
                          isFirst && "bg-[#4A148C]"
                        )}
                      >
                        <Plus
                          className={cn(
                            "w-6 h-6 transition-colors",
                            isFirst ? "text-white" : "text-[#4A148C] group-hover:text-white"
                          )}
                          strokeWidth={2.5}
                        />
                      </div>
                    )}
                  </div>
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[2000px] opacity-100 pb-6" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="text-gray-700 leading-relaxed space-y-3 pr-16">
                    {item.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
