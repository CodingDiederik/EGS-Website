export type ProeflesFormData = {
  name: string;
  email: string;
  optionalMessage: string;
};

export type FieldErrors = { [key: string]: string };

// Validate form data
export function validateProeflesForm(data: ProeflesFormData): FieldErrors {
  const errors: FieldErrors = {};
  const emailRegex: RegExp =
    /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}|\[(?:IPv6:[A-F0-9]{0,4}(?::[A-F0-9]{0,4}){2,7}|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\])$/;
  if (!data.name.trim()) {
    errors['person-name'] = 'Naam is verplicht.';
  }
  if (!data.email.trim() || !emailRegex.test(data.email)) {
    errors['email'] = 'Voer een geldig emailadres in.';
  }
  return errors;
}

// Submit form data to API
export async function submitProeflesForm(
  data: ProeflesFormData,
): Promise<{ success: boolean; message: string }> {
  try {
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

export function checkOkayResponse(body: string) {
  if (!body) return false;

  return !body.includes('data-validation-failed="true"');
}
