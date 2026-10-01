import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
  

    <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
            NOVA Store
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your style.
            <br />
            Your statement.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Discover modern pieces designed for everyday expression.
            Find your next favorite look at NOVA.
          </p>

          <div className="mt-8">
      <Link
  href="/shop"
  className="inline-block rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-500"
>
  Shop Collection
</Link>
          </div>
        </div>
      </section>
    </main>
  );
}