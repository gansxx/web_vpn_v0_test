import { useOrders } from "@/hooks/useOrders"
import { OrdersTable } from "./OrdersTable"

export function OrdersSection() {
  const { orders, loading, error, reloadOrders } = useOrders()

  return (
    <OrdersTable
      orders={orders}
      loading={loading}
      error={error}
      onReload={reloadOrders}
    />
  )
}