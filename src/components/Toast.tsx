"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  const icons = {
    success: "✓",
    error: "!",
    info: "i",
  };

  return (
    <div className="fixed right-5 top-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm animate-in slide-in-from-right-5 fade-in duration-300">
      <div
        className={`flex items-start gap-3 rounded-2xl border px-4 py-4 shadow-xl ${styles[type]}`}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black shadow-sm">
          {icons[type]}
        </div>

        <p className="flex-1 pt-1 text-sm font-semibold leading-5">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="text-lg opacity-50 transition hover:opacity-100"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}