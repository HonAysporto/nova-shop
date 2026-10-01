import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-slate-950">
   

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-36">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
              The Collection
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Find something that feels like you.
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-400">
              Explore our latest collection of clothing, footwear, and
              accessories designed for everyday style.
            </p>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              All Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {products?.length ?? 0} products available
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            Back to Home
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="font-bold">Unable to load products</h2>

            <p className="mt-2 text-sm">
              Please try again later.
            </p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No products found
            </h2>

            <p className="mt-2 text-slate-500">
              There are currently no products available.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}