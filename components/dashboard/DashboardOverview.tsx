import { useProducts } from "@/hooks/useProducts"
import { WelcomeBanner } from "./WelcomeBanner"
import { PackageCard } from "./PackageCard"
import { ClientDownloads } from "./ClientDownloads"

interface DashboardOverviewProps {
  onOrderClick: () => void
}

export function DashboardOverview({ onOrderClick }: DashboardOverviewProps) {
  const { products, loading, error, reloadProducts } = useProducts()

  return (
    <>
      <WelcomeBanner onOrderClick={onOrderClick} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PackageCard
            products={products}
            loading={loading}
            error={error}
            onReload={reloadProducts}
          />
        </div>

        <ClientDownloads />
      </div>
    </>
  )
}