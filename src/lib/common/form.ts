'use server';

import { CONTACT_FORM_NAME, ContactFormSchema } from '@/app/contact/constants';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export type FieldType = 'text' | 'email' | 'textarea' | 'select';

export type FormField = {
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // for select type
};

export async function submitFormData(
  formData: FormData,
  formName: string,
): Promise<void> {
  if (formData.get('website')) {
    return; // Honeypot field filled, mark as spam
  }

  if (formName === CONTACT_FORM_NAME) {
    const validatedData = ContactFormSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!validatedData.success) {
      throw new Error(JSON.stringify(validatedData.error));
    }
  } else {
    throw new Error('Onbekend formulier.');
  }
  formData.delete('website');

  resend.emails.send({
    from: 'egsjeugd@resend.dev',
    to: 'djjmwebster@gmail.com',
    subject: `Nieuw bericht via het ${formName}`,
    text:
      `Er is een nieuw bericht verzonden voor het ${formName}:\n\n` +
      Array.from(formData.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n'),
  });
}
