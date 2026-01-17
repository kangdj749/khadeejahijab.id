export const dynamic = "force-dynamic";

import OrderDetail from "@/components/admin/OrderDetail";

type PageProps = {
  params: {
    orderid: string;
  };
};

export default function AdminOrderDetailPage({ params }: PageProps) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <OrderDetail orderId={params.orderid} />
    </div>
  );
}
