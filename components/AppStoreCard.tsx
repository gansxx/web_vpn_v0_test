import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AppStoreCardProps {
  name: string
  icon: React.ReactNode
  bgColor: string
  href: string
}

export function AppStoreCard({
  name,
  icon,
  bgColor,
  href,
  
}: AppStoreCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6 text-center">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <h3 className="font-semibold text-foreground mb-2">{name}</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              asChild
            >
            <a href="/signin">下载</a>
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}
