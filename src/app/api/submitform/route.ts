import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_FORM_NAME, ContactFormSchema } from '@/app/contact/constants';
import {
  ProeflesFormSchema,
  PROEFLES_FORM_NAME,
} from '@/app/proefles/constants';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json(
        { message: 'Ongeldig content-type' },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const formName = formData.get('formName')?.toString() || '';

    if (formData.get('website')) {
      return NextResponse.json({ message: 'OK' }, { status: 200 }); // Honeypot field filled
    }

    if (formName === CONTACT_FORM_NAME) {
      const validatedData = ContactFormSchema.safeParse(
        Object.fromEntries(formData.entries()),
      );
      if (!validatedData.success) {
        throw new Error(JSON.stringify(validatedData.error));
      }
    } else if (formName === PROEFLES_FORM_NAME) {
      const validatedData = ProeflesFormSchema.safeParse(
        Object.fromEntries(formData.entries()),
      );
      if (!validatedData.success) {
        throw new Error(JSON.stringify(validatedData.error));
      }
    } else {
      return NextResponse.json(
        { message: 'Ongeldig formuliernaam' },
        { status: 400 },
      );
    }

    formData.delete('website');

    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is not configured.');
    }

    if (
      !process.env.RECEIVER_EMAIL_ADDRESSES ||
      !process.env.SENDER_EMAIL_ADDRESS
    ) {
      throw new Error(
        'Receiver email addresses or sender email address is not configured.',
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const receiverEmails = process.env.RECEIVER_EMAIL_ADDRESSES.split(',').map(
      (email) => email.trim(),
    );

    const { error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: receiverEmails,
      subject: `Nieuw bericht via het ${formName}`,
      text:
        `Er is een nieuw bericht verzonden voor het ${formName}:\n\n` +
        Array.from(formData.entries())
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n'),
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return NextResponse.json(
      { message: 'Formulier succesvol verzonden!' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { message: 'Interne serverfout. Probeer het later opnieuw.' },
      { status: 500 },
    );
  }
}
