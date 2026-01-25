import { FormField } from '@/components/common/Form/types';
import { z } from 'zod';

export const PROEFLES_FORM_FIELDS: FormField[] = [
  {
    label: 'Naam ouder/verzorger',
    type: 'text',
    required: true,
  },
  {
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    label: 'Naam kind',
    type: 'text',
    required: true,
  },
  {
    label: 'Leeftijd',
    type: 'select',
    required: true,
    options: ['6-10 jaar', '11-14 jaar', '15+ jaar'],
  },
  {
    label: 'Niveau',
    type: 'select',
    required: true,
    options: [
      'Beginner (geen ervaring)',
      'Basiskennis (kan partijen spelen)',
      'Gevorderd (speelt regelmatig)',
      'Anders',
    ],
  },
  {
    label: 'Bericht',
    type: 'textarea',
    required: true,
  },
];

export const ProeflesFormSchema = z.object({
  'Naam ouder/verzorger': z.string().min(1, 'Naam is verplicht'),
  Email: z.email('Ongeldig e-mailadres'),
  'Naam kind': z.string().min(1, 'Naam van het kind is verplicht'),
  Leeftijd: z.enum(
    ['6-10 jaar', '11-14 jaar', '15+ jaar'],
    'Leeftijd is verplicht',
  ),
  Niveau: z.enum(
    [
      'Beginner (geen ervaring)',
      'Basiskennis (kan partijen spelen)',
      'Gevorderd (speelt regelmatig)',
      'Anders',
    ],
    'Niveau is verplicht',
  ),
  Bericht: z.string().min(1, 'Bericht is verplicht'),
  website: z.string().optional(), // honeypot field
});

export const PROEFLES_FORM_NAME = 'Proeflesformulier';
