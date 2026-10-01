import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/mailgun";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface OrderRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItemInput[];
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "You must be signed in to place an order.",
        },
        { status: 401 }
      );
    }

    const body: OrderRequest = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      items,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city
    ) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    const productIds = items.map((item) => item.productId);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

  if (productsError || !products) {
  console.error("Product lookup error:", productsError);

  return NextResponse.json(
    {
      error: productsError?.message || "Unable to verify products.",
    },
    { status: 500 }
  );
}

    if (products.length !== items.length) {
      return NextResponse.json(
        {
          error: "One or more products are no longer available.",
        },
        { status: 400 }
      );
    }

    let total = 0;

    const orderItems = items.map((item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        throw new Error("Product not found");
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const price = Number(product.price);

      total += price * quantity;

      return {
        product_id: product.id,
        quantity,
        price,
      };
    });

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        total,
      })
      .select("id, total, status, created_at")
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);

      return NextResponse.json(
        {
          error: "Unable to create your order.",
        },
        { status: 500 }
      );
    }

    const itemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);

      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          error: "Unable to save order items.",
        },
        { status: 500 }
      );
    }

   try {
  await sendOrderConfirmationEmail({
    to: email,
    firstName,
    orderId: order.id,
    total: Number(order.total),
  });
} catch (emailError) {
  console.error("Confirmation email error:", emailError);
}

return NextResponse.json(
  {
    message: "Order placed successfully.",
    order,
  },
  { status: 201 }
);
  } catch (error) {
    console.error("Unexpected order error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while placing your order.",
      },
      { status: 500 }
    );
  }
}