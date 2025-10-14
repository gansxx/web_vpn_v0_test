import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ClientDownloadCardProps {
  name: string
  icon: React.ReactNode
  bgColor: string
  buttonText?: string
  buttonVariant?: "default" | "outline"
}

export function ClientDownloadCard({
  name,
  icon,
  bgColor,
  buttonText = "下载",
  buttonVariant = "outline"
}: ClientDownloadCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{name}</h3>
        <Button
          variant={buttonVariant}
          size="sm"
          className="w-full bg-transparent"
          asChild
        >
          <a href="/signin">{buttonText}</a>
        </Button>
      </CardContent>
    </Card>
  )
}
