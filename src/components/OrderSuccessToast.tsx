"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ToastProvider";

export default function OrderSuccessToast() {
  const { showToast } = useToast();

  useEffect(() => {
    const storedToast = sessionStorage.getItem("nova-toast");

    if (!storedToast) return;

    try {
      const toast = JSON.parse(storedToast);

      showToast(toast.message, toast.type);

      sessionStorage.removeItem("nova-toast");
    } catch {
      sessionStorage.removeItem("nova-toast");
    }
  }, [showToast]);

  return null;
}