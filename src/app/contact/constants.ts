import { FormField } from '@/lib/common/form';

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
