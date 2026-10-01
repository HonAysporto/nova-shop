"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const getProduct = async () => {
      const { id } = await params;

      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        notFound();
      }

      setProduct(data);
      setLoading(false);
    };

    getProduct();
  }, [params]);

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

const handleAddToCart = () => {
  if (!product) return;

  addToCart(product, quantity);

  showToast(
    `${product.name} × ${quantity} added to cart`,
    "success"
  );
};
 

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="bg-slate-950">
        

          <div className="mx-auto max-w-7xl px-6 pb-16 pt-40">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-slate-200" />

            <div className="space-y-5 py-8">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-24 w-full animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-slate-950">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 pb-8 pt-32">
          <Link
            href="/shop"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600">
              {product.category}
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-6 text-3xl font-bold text-slate-950">
              ₦{Number(product.price).toLocaleString("en-NG")}
            </p>

            <div className="mt-8 h-px bg-slate-200" />

            <p className="mt-8 max-w-xl text-base leading-8 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                  className="px-5 py-3 text-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <span className="min-w-12 text-center font-semibold text-slate-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="px-5 py-3 text-lg text-slate-600 transition hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:bg-violet-600 sm:w-auto sm:min-w-64"
            >
              Added to Cart
            </button>

          </div>
        </div>
      </section>
    </main>
  );
}