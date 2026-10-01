import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight"
            >
              NOVA<span className="text-violet-400">.</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Modern fashion for everyday expression. Discover clothing,
              footwear, and accessories designed to fit your style.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Shop
              </Link>

              <Link
                href="/orders"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Orders
              </Link>

              <Link
                href="/cart"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Cart
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/login"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/checkout"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} NOVA Store. All rights reserved.
          </p>

          <p className="text-sm text-slate-500">
            Built for the HNG Internship.
          </p>
        </div>
      </div>
    </footer>
  );
}