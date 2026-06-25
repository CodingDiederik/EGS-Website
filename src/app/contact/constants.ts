import { FormField } from '@/components/common/Form/types';
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
  Naam: z.string().min(1, 'Naam is verplicht').max(100, 'Naam is te lang'),
  Email: z.email('Ongeldig e-mailadres').max(254, 'E-mailadres is te lang'),
  Bericht: z
    .string()
    .min(1, 'Bericht is verplicht')
    .max(2000, 'Bericht is te lang'),
  website: z.string().optional(), // honeypot field
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const CONTACT_FORM_NAME = 'Contactformulier';
