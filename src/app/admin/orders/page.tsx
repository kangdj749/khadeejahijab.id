export const dynamic = "force-dynamic";

import OrderTable from "@/components/admin/OrderTable";

export default function AdminOrdersPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Admin · Orders
      </h1>

      <OrderTable />
    </div>
  );
}
