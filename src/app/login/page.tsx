"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
            NOVA Store
          </p>

          <h1 className="mt-4 text-3xl font-black text-white">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to continue shopping and manage your orders.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          <span className="text-lg">G</span>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          By continuing, you agree to use NOVA's services.
        </p>
      </div>
    </main>
  );
}