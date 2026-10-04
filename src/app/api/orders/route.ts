
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
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
    // Server client for the normal web session
    const supabase = await createClient();

    // Database client.
    // For mobile requests, this will be replaced with a client
    // authenticated using the mobile user's access token.
    let db = supabase;

    let user = null;

    // ---------------------------------------------------------
    // 1. Check for mobile Authorization header
    // ---------------------------------------------------------

    const authHeader = request.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const accessToken = authHeader.replace("Bearer ", "");

      // Create a Supabase client that uses the mobile user's
      // access token for all database requests.
      const mobileSupabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      );

      // Verify the mobile access token
      const {
        data: { user: mobileUser },
        error: mobileUserError,
      } = await mobileSupabase.auth.getUser();

      if (!mobileUserError && mobileUser) {
        user = mobileUser;

        // Use the authenticated mobile client for all
        // subsequent database operations.
        db = mobileSupabase;
      }
    }

    // ---------------------------------------------------------
    // 2. If no mobile user, try normal web session
    // ---------------------------------------------------------

    if (!user) {
      const {
        data: { user: webUser },
        error: webUserError,
      } = await supabase.auth.getUser();

      if (!webUserError && webUser) {
        user = webUser;
        db = supabase;
      }
    }

    // ---------------------------------------------------------
    // 3. Reject unauthenticated users
    // ---------------------------------------------------------

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be signed in to place an order.",
        },
        { status: 401 }
      );
    }

    // ---------------------------------------------------------
    // 4. Read request body
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // 5. Validate customer information
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // 6. Validate cart
    // ---------------------------------------------------------

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 7. Get products from database
    // ---------------------------------------------------------

    const productIds = items.map((item) => item.productId);

    const {
      data: products,
      error: productsError,
    } = await db
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (productsError || !products) {
      console.error(
        "Product lookup error:",
        productsError
      );

      return NextResponse.json(
        {
          error:
            productsError?.message ||
            "Unable to verify products.",
          details: productsError,
        },
        { status: 500 }
      );
    }

    // Make sure every requested product still exists
    if (products.length !== items.length) {
      return NextResponse.json(
        {
          error:
            "One or more products are no longer available.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 8. Calculate total on the server
    // ---------------------------------------------------------

    let total = 0;

    const orderItems = items.map((item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        throw new Error("Product not found");
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
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

    // ---------------------------------------------------------
    // 9. Create order
    // ---------------------------------------------------------

    const {
      data: order,
      error: orderError,
    } = await db
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
      console.error(
        "Order creation error:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            orderError?.message ||
            "Unable to create your order.",
          details: orderError,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 10. Create order items
    // ---------------------------------------------------------

    const itemsWithOrderId = orderItems.map(
      (item) => ({
        ...item,
        order_id: order.id,
      })
    );

    const {
      error: itemsError,
    } = await db
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error(
        "Order items creation error:",
        itemsError
      );

      // Remove the order if order items could not be saved
      await db
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          error:
            itemsError.message ||
            "Unable to save order items.",
          details: itemsError,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 11. Send confirmation email
    // ---------------------------------------------------------

    try {
      await sendOrderConfirmationEmail({
        to: email,
        firstName,
        orderId: order.id,
        total: Number(order.total),
      });
    } catch (emailError) {
      // Email failure should NOT cancel a successfully
      // created order.
      console.error(
        "Confirmation email error:",
        emailError
      );
    }

    // ---------------------------------------------------------
    // 12. Return successful response
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        message: "Order placed successfully.",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Unexpected order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while placing your order.",
      },
      { status: 500 }
    );
  }
}

