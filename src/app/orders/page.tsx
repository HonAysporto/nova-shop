import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import OrderSuccessToast from "@/components/OrderSuccessToast";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
  }>;
}) {
  const supabase = await createClient();
  const { success } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

 if (!user) {
  redirect("/login");
}

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-slate-950">
     
        <OrderSuccessToast />

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-36">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
              Order History
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Your Orders
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-400">
              Keep track of your purchases and order status.
            </p>
          </div>
        </section>
      </div>

      

      <section className="mx-auto max-w-5xl px-6 py-12">
        {success === "true" && (
  <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
    <h2 className="font-bold text-green-800">
      Order placed successfully
    </h2>

    <p className="mt-1 text-sm text-green-700">
      Your order has been received. A confirmation email has been sent
      to your email address.
    </p>
  </div>
)}
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-800">
              Unable to load your orders
            </h2>

            <p className="mt-2 text-sm text-red-600">
              Please try again later.
            </p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-2xl">□</span>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              You haven't placed any orders yet. Explore our collection and
              find something you love.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-block rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-600"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order: Order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-900">
                      {order.id}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString(
                        "en-NG",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-8 sm:justify-end">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Status
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-black text-slate-950">
                        ₦{Number(order.total).toLocaleString("en-NG")}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}