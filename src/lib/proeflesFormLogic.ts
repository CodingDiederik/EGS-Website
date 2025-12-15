export type ProeflesFormData = {
  name: string;
  email: string;
  optionalMessage: string;
};

export type FieldErrors = { [key: string]: string };

// Validate form data
export function validateProeflesForm(data: ProeflesFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) {
    errors['person-name'] = 'Naam is verplicht.';
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors['email'] = 'Voer een geldig emailadres in.';
  }
  return errors;
}

// Submit form data to API
export async function submitProeflesForm(
  data: ProeflesFormData,
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Submitting form data:', data);
    const response = await fetch('/api/submitform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return {
        success: true,
        message: 'Je proefles aanvraag is succesvol verzonden!',
      };
    } else {
      const result = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          result.message ||
          'Er is een fout opgetreden bij het verzenden van je aanvraag. Probeer het later opnieuw.',
      };
    }
  } catch {
    return {
      success: false,
      message:
        'Er is een interne serverfout opgetreden. Probeer het later opnieuw.',
    };
  }
}
