// app/api/send-email/route.ts (pour App Router Next.js 13+)
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, from, name } = await request.json();

    // Configuration du transporteur email
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // ou 'outlook' pour Outlook
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Nouveau message de contact</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${message}</pre>
          </div>
          <p style="margin-top: 20px; color: #666;">
            <strong>Email de réponse:</strong> ${from}
          </p>
        </div>
      `,
      replyTo: from
    });

    return NextResponse.json({ message: 'Email envoyé avec succès!' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}