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
    const GOOGLE_FORM_URL =
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSf_ncE9_px-CPOuRNFVppNpPrTxZHT2SYs6xl6Dln6p89BwlQ/formResponse';

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
        { message: 'Er is iets mis gegaan' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
