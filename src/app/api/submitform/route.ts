import { NextResponse } from 'next/server';
import { checkOkayResponse } from '@/lib/proeflesFormLogic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Map your custom field names to Google's "entry.xxxx" IDs
    const googleFormData = new URLSearchParams();
    googleFormData.append('entry.2005620554', body.name);
    googleFormData.append('entry.1045781291', body.email);
    googleFormData.append('entry.839337160', body.optionalMessage || '');

    // 2. The Form Action URL
    if (!process.env.GOOGLE_FORMS_URL) {
      throw new Error(
        'GOOGLE_FORMS_URL is not defined in environment variables',
      );
    }
    const GOOGLE_FORM_URL = process.env.GOOGLE_FORMS_URL as string;

    // 3. Send the data to Google
    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: googleFormData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok && checkOkayResponse(await response.text())) {
      return NextResponse.json({
        message: 'Je proefles aanvraag is succesvol verzonden!',
      });
    } else {
      return NextResponse.json(
        {
          message:
            'Er is een fout opgetreden bij het verzenden van je aanvraag. Controleer je gegevens en probeer het later opnieuw.',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { message: 'Interne serverfout. Probeer het later opnieuw.' },
      { status: 500 },
    );
  }
}
