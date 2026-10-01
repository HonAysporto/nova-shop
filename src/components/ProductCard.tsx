"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/products";
import { useToast } from "@/components/ToastProvider";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

 const handleAddToCart = () => {
  addToCart(product);

  showToast(`${product.name} added to cart`, "success");
};

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            {product.category}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/shop/${product.id}`}>
          <h2 className="text-lg font-bold text-slate-900 transition group-hover:text-violet-600">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-lg font-bold text-slate-900">
            ₦{Number(product.price).toLocaleString()}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}