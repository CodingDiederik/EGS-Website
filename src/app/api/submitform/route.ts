import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_FORM_NAME, ContactFormSchema } from '@/app/contact/constants';
import {
  ProeflesFormSchema,
  PROEFLES_FORM_NAME,
} from '@/app/proefles/constants';

const resend = new Resend(process.env.RESEND_API_KEY!);

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
      return; // Honeypot field filled
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
      throw new Error('Onbekend formulier.');
    }

    formData.delete('website');

    if (!process.env.RECEIVER_EMAIL_ADDRESS) {
      throw new Error('Receiver email address is not configured.');
    }

    resend.emails.send({
      from: 'egsjeugd@resend.dev',
      to: process.env.RECEIVER_EMAIL_ADDRESS!,
      subject: `Nieuw bericht via het ${formName}`,
      text:
        `Er is een nieuw bericht verzonden voor het ${formName}:\n\n` +
        Array.from(formData.entries())
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n'),
    });

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
