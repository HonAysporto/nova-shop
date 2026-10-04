"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type { Product } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const supabase = createClient();

  // ----------------------------------------
  // Get logged-in user
  // ----------------------------------------
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ----------------------------------------
  // Load cart from Supabase
  // ----------------------------------------
  const refreshCart = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setIsLoaded(true);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        product_id,
        products (
          id,
          name,
          description,
          price,
          image,
          category
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading cart:", error);
      return;
    }

    const cartItems: CartItem[] = (data ?? [])
      .filter((item) => item.products)
      .map((item) => {
        const product = item.products as unknown as Product;

        return {
          ...product,
          quantity: item.quantity,
        };
      });

    setItems(cartItems);
    setIsLoaded(true);
  }, [userId]);

  // ----------------------------------------
  // Load cart whenever user changes
  // ----------------------------------------
  useEffect(() => {
    if (userId !== null) {
      refreshCart();
    } else {
      setItems([]);
      setIsLoaded(true);
    }
  }, [userId, refreshCart]);

  // ----------------------------------------
  // Realtime cart synchronization
  // ----------------------------------------
  useEffect(() => {
    if (!userId) {
      return;
    }

    const channel = supabase
      .channel(`web-cart-${userId}-${Date.now()}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log(
            "Web cart realtime event:",
            payload.eventType
          );

          refreshCart();
        }
      )
      .subscribe((status) => {
        console.log("Web cart realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refreshCart]);

  // ----------------------------------------
  // Add to cart
  // ----------------------------------------
  const addToCart = async (product: Product, quantity = 1) => {
    if (!userId) {
      alert("Please sign in before adding items to your cart.");
      return;
    }

    const existingItem = items.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: newQuantity,
        })
        .eq("user_id", userId)
        .eq("product_id", product.id);

      if (error) {
        console.error("Error updating cart:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: userId,
          product_id: product.id,
          quantity,
        });

      if (error) {
        console.error("Error adding to cart:", error);
        return;
      }
    }

    await refreshCart();
  };

  // ----------------------------------------
  // Increase quantity
  // ----------------------------------------
  const increaseQuantity = async (productId: string) => {
    if (!userId) return;

    const item = items.find(
      (item) => item.id === productId
    );

    if (!item) return;

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: item.quantity + 1,
      })
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error increasing quantity:", error);
      return;
    }

    await refreshCart();
  };

  // ----------------------------------------
  // Decrease quantity
  // ----------------------------------------
  const decreaseQuantity = async (productId: string) => {
    if (!userId) return;

    const item = items.find(
      (item) => item.id === productId
    );

    if (!item) return;

    if (item.quantity === 1) {
      await removeFromCart(productId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: item.quantity - 1,
      })
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error decreasing quantity:", error);
      return;
    }

    await refreshCart();
  };

  // ----------------------------------------
  // Remove item
  // ----------------------------------------
  const removeFromCart = async (productId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing item:", error);
      return;
    }

    await refreshCart();
  };

  // ----------------------------------------
  // Clear cart
  // ----------------------------------------
  const clearCart = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error clearing cart:", error);
      return;
    }

    setItems([]);
  };

  const cartCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}