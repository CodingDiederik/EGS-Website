export type ProeflesFormData = {
  name: string;
  studentName: string;
  age: number;
  level: StudentLevels;
  email: string;
  message: string;
};

export type FieldErrors = { [key: string]: string };

export type StudentLevels =
  | 'Beginner (geen ervaring)'
  | 'Basiskennis (loop stukken)'
  | 'Ervaren (speelt partijen)'
  | 'Anders (specificeer in bericht)'
  | '';

/**
 * Validates the proefles form data.
 * @param data the form data to validate
 * @returns an object containing field errors, if any
 */
export function validateProeflesForm(data: ProeflesFormData): FieldErrors {
  const errors: FieldErrors = {};
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors['person-name'] = 'Naam ouder/verzorger is verplicht.';
  }

  if (!data.email.trim() || !emailRegex.test(data.email)) {
    errors['email'] = 'Voer een geldig emailadres in.';
  }

  if (!data.studentName.trim() || data.studentName.trim().length < 2) {
    errors['student-name'] = 'Naam kind is verplicht.';
  }

  if (isNaN(data.age) || data.age <= 0) {
    errors['student-age'] = 'Voer een geldige leeftijd in.';
  }

  if (data.age > 20) {
    errors['student-age'] =
      'De proeflessen zijn bedoeld voor kinderen tot en met 20 jaar.';
  }

  if (!data.level) {
    errors['student-level'] = 'Selecteer alstublieft het niveau van uw kind.';
  }

  return errors;
}

/**
 * Submits the proefles form data to the backend API.
 * @param data the form data to submit
 * @returns a promise that resolves to an object indicating success or failure and a message.
 */
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

/**
 * Checks if the response body from Google Forms indicates a successful submission.
 * @param body the response body as a string
 * @returns true if the submission was successful, false otherwise
 */
export function checkOkayResponse(body: string) {
  if (!body) return false;

  return !body.includes('data-validation-failed="true"');
}
