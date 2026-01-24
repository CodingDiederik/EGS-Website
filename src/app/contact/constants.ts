import { FormField } from '@/lib/common/form';
import { z } from 'zod';

export const CONTACT_FORM_FIELDS: FormField[] = [
  {
    label: 'Naam',
    type: 'text',
    required: true,
  },
  {
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    label: 'Bericht',
    type: 'textarea',
    required: true,
  },
];

export const ContactFormSchema = z.object({
  Naam: z.string().min(1, 'Naam is verplicht'),
  Email: z.email('Ongeldig e-mailadres'),
  Bericht: z.string().min(1, 'Bericht is verplicht'),
  website: z.string().optional(), // honeypot field
});

export const CONTACT_FORM_NAME = 'Contactformulier';
