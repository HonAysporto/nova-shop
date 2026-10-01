"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastProvider";

export default function CartPage() {
    const { showToast } = useToast();
  const {
    items,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();


  const remove = (item: any) => {
removeFromCart(item.id);
showToast(`${item.name} removed from cart`, "info");
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="bg-slate-950">
        

          <div className="mx-auto max-w-7xl px-6 pb-10 pt-32">
            <h1 className="text-4xl font-black text-white">
              Your Cart
            </h1>
          </div>
        </div>

        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
            <span className="text-2xl font-bold text-slate-500">
              0
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Your cart is empty
          </h2>

          <p className="mt-3 max-w-md text-slate-500">
            You haven't added anything to your cart yet. Explore our
            collection and find something you like.
          </p>

          <Link
            href="/shop"
            className="mt-8 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-600"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-slate-950">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 pb-10 pt-32">
          <h1 className="text-4xl font-black text-white">
            Your Cart
          </h1>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full rounded-xl object-cover sm:w-28"
                />

                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                      {item.category}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      {item.name}
                    </h2>

                    <p className="mt-1 font-semibold text-slate-900">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-4 py-2.5 text-slate-600 transition hover:bg-slate-100"
                      >
                        −
                      </button>

                      <span className="min-w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="px-4 py-2.5 text-slate-600 transition hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(item)}
                      className="text-sm font-semibold text-red-500 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="font-semibold text-slate-900">
                  Free
                </span>
              </div>
            </div>

            <div className="my-6 h-px bg-slate-200" />

            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Total</span>

              <span className="text-xl font-black text-slate-900">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block rounded-xl bg-slate-950 px-6 py-4 text-center font-semibold text-white transition hover:bg-violet-600"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="mt-3 block text-center text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}