import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      date,
      time,
      guests,
      seating,
      occasion,
      specialRequests,
      tableNumber,
    } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create transporter (using SMTP, replace with your credentials)    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Your Reservation Details",
  html: `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <header style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #B3905E;">
      <h1 style="color: #B3905E; margin: 0; font-size: 24px;">Reservation Confirmed!</h1>
    </header>

    <section style="padding: 20px 0;">
      <p style="color: black">Hi <strong>${firstName} ${lastName}</strong>,</p>
      <p>Your table has been reserved successfully! Here are the details:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Table Number</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${tableNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${time}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Guests</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${guests}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Seating</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${seating}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Occasion</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${occasion || "None"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Special Requests</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${specialRequests || "None"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Contact</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${email} | ${phone}</td>
        </tr>
      </table>
    </section>

    <footer style="text-align: center; padding: 25px 15px; border-top: 2px solid #B3905E; background-color: #f9f5f0; border-radius: 0 0 10px 10px; margin-top: 30px;">
  <p style="margin: 0; font-size: 16px; color: #333; font-weight: 500;">
    We look forward to welcoming you at <strong>Fork & Friends</strong>!
  </p>
  <p style="margin: 5px 0 10px 0; font-size: 14px; color: #555;">
    For modifications or cancellations, please contact us:
  </p>
  <p style="margin: 2px 0; font-size: 14px; color: #B3905E;">
    📞 Phone: (123) 456-7890 | ✉️ Email: reservations@example.com
  </p>
  <p style="margin: 10px 0 0 0; font-size: 12px; color: #777;">
    Thank you for choosing us. Enjoy your dining experience!
  </p>
</footer>
  </div>
  `,
};

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Reservation email sent successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}
