"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);

        setFormData((current) => ({
          ...current,
          email: user.email ?? "",
          firstName:
            user.user_metadata?.first_name ??
            user.user_metadata?.full_name?.split(" ")[0] ??
            "",
          lastName:
            user.user_metadata?.last_name ??
            user.user_metadata?.full_name
              ?.split(" ")
              .slice(1)
              .join(" ") ??
            "",
        }));
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage("Please sign in before placing an order.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to place your order."
        );
      }

      clearCart();

      sessionStorage.setItem(
  "nova-toast",
  JSON.stringify({
    message: "Order placed successfully!",
    type: "success",
  })
);

window.location.href = "/orders";
    } catch (error) {
      console.error("Order error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="bg-slate-950">
      

          <section className="mx-auto max-w-7xl px-6 pb-20 pt-40">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />
          </section>
        </div>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="bg-slate-950">
          <Navbar />

          <section className="mx-auto max-w-7xl px-6 pb-20 pt-40">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
              Checkout
            </p>

            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Your cart is empty.
            </h1>

            <p className="mt-5 text-slate-400">
              Add some products before proceeding to checkout.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Continue Shopping
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-slate-950">
        <Navbar />

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-36">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
            Checkout
          </p>

          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Complete your order.
          </h1>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-slate-950">
              Delivery Information
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Delivery Address
                </label>

                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full rounded-xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    ₦
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString("en-NG")}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-slate-200" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">
                Total
              </span>

              <span className="text-2xl font-black text-slate-950">
                ₦{subtotal.toLocaleString("en-NG")}
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}