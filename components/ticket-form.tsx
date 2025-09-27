"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_BASE } from "@/lib/config"

interface TicketFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function TicketForm({ onSuccess, onCancel }: TicketFormProps) {
  const [formData, setFormData] = useState({
    subject: "",
    priority: "中",
    category: "技术支持",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/support/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          subject: formData.subject,
          priority: formData.priority,
          category: formData.category,
          description: formData.description
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `提交失败: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        alert("工单提交成功！我们会尽快处理您的问题。")
        setFormData({
          subject: "",
          priority: "中",
          category: "技术支持",
          description: ""
        })
        onSuccess?.()
      } else {
        throw new Error(result.message || "提交失败")
      }
    } catch (err: any) {
      console.error("提交工单失败:", err)
      setError(err.message || "提交失败，请重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>提交工单</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">标题 *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="请简要描述您的问题"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">优先级</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="低">低</SelectItem>
                  <SelectItem value="中">中</SelectItem>
                  <SelectItem value="高">高</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="技术支持">技术支持</SelectItem>
                  <SelectItem value="账户问题">账户问题</SelectItem>
                  <SelectItem value="套餐相关">套餐相关</SelectItem>
                  <SelectItem value="连接问题">连接问题</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">问题描述 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="请详细描述您遇到的问题，包括出现问题的时间、使用的设备等信息"
              className="min-h-[120px]"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "提交中..." : "提交工单"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                取消
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}