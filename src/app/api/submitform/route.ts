import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  CONTACT_FORM_NAME,
  ContactFormSchema,
  type ContactFormData,
} from '@/app/contact/constants';
import {
  ProeflesFormSchema,
  PROEFLES_FORM_NAME,
  type ProeflesFormData,
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

    const rawData = Object.fromEntries(formData.entries());

    // Validate against the per-form schema and keep the parsed result: emails
    // are built from validatedData (not the raw formData) so injected/unknown
    // fields never reach the inbox and length limits are enforced.
    let validatedData: ContactFormData | ProeflesFormData;
    let recipientName: string;

    if (formName === CONTACT_FORM_NAME) {
      const result = ContactFormSchema.safeParse(rawData);
      if (!result.success) {
        throw new Error(JSON.stringify(result.error));
      }
      validatedData = result.data;
      recipientName = result.data.Naam;
    } else if (formName === PROEFLES_FORM_NAME) {
      const result = ProeflesFormSchema.safeParse(rawData);
      if (!result.success) {
        throw new Error(JSON.stringify(result.error));
      }
      validatedData = result.data;
      recipientName = result.data['Naam ouder/verzorger'];
    } else {
      return NextResponse.json(
        { message: 'Ongeldig formuliernaam' },
        { status: 400 },
      );
    }

    // Build the email body from the validated fields, dropping the honeypot.
    const submissionDetails = Object.entries(validatedData)
      .filter(([key]) => key !== 'website')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

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
        submissionDetails,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    const { error: confirmationError } = await resend.emails.send({
      // Allow soft failures for confirmation email
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: validatedData.Email,
      subject: `Bevestiging van je bericht via het ${formName}`,
      text:
        `Beste ${recipientName || 'gebruiker'},\n\n` +
        `Bedankt voor je bericht. We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op.\n\n` +
        `Met vriendelijke groet,\n` +
        `EGS Jeugd`,
    });

    if (confirmationError) {
      console.warn(
        `Failed to send confirmation email: ${confirmationError.message}`,
      );
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
