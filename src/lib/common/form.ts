export type FieldType = 'text' | 'email' | 'textarea' | 'select';

export type FormField = {
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // for select type
};
