"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/CartProvider";

interface User {
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { cartCount } = useCart();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error) {
      console.error("Sign out error:", error);
      return;
    }

    setUser(null);
    setIsMenuOpen(false);
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Account";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-white"
        >
          NOVA<span className="text-violet-400">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white transition hover:text-violet-400"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Shop
          </Link>

          <Link
            href="/orders"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Orders
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/cart"
            className="relative rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cart

            {cartCount > 0 && (
              <span className="ml-2 rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-400">
                  Signed in as
                </p>

                <p className="max-w-32 truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-5 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Home
            </Link>

            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Shop
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Orders
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <span>Cart</span>

              {cartCount > 0 && (
                <span className="rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div className="mt-2 h-11 animate-pulse rounded-xl bg-white/10" />
            ) : user ? (
              <>
                <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Signed in as
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}