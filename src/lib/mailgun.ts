import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

export async function sendOrderConfirmationEmail({
  to,
  firstName,
  orderId,
  total,
}: {
  to: string;
  firstName: string;
  orderId: string;
  total: number;
}) {
  return mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: process.env.MAILGUN_FROM!,
    to: [to],
    subject: "Your NOVA Store Order Confirmation",
    text: `
Hi ${firstName},

Thank you for shopping with NOVA Store.

Your order has been successfully placed.

Order ID: ${orderId}
Total: ₦${total.toLocaleString("en-NG")}

We'll keep you updated as your order is processed.

Thank you for choosing NOVA Store.
    `,
  });
}