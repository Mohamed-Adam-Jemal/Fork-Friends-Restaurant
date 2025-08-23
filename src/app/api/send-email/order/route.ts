import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, address, total, items } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsRows = items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Order Confirmation",
      html: `
      <div style="background-color: #ffffff; font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #B3905E;">
          <h1 style="color: #B3905E; margin: 0; font-size: 24px;">Order Confirmed!</h1>
        </header>

        <section style="padding: 20px 0;">
          <p style="color: black">Hi <strong>${name}</strong>,</p>
          <p>Thank you for your order! Here are the details:</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Address</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${address}</td>
            </tr>
          </table>

          <h3 style="margin-top: 20px; margin-bottom: 10px;">Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px; border: 1px solid #ddd; text-align:left;">Item</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <p style="text-align:right; font-weight:bold; margin-top: 10px;">Total: $${total.toFixed(2)}</p>
        </section>

        <footer style="text-align: center; padding: 25px 15px; border-top: 2px solid #B3905E; background-color: #f9f5f0; border-radius: 0 0 10px 10px; margin-top: 30px;">
          <p style="margin: 0; font-size: 16px; color: #333; font-weight: 500;">
            We look forward to delivering your order!
          </p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #777;">
            Thank you for choosing <strong>Fork & Friends</strong>!
          </p>
        </footer>
      </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Order email sent successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
