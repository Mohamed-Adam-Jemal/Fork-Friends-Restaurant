import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 10 years in seconds = 10 * 365 * 24 * 60 * 60
    const tenYearsInSeconds = 10 * 365 * 24 * 60 * 60;

    // Create signed URL
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from('menu-images')
        .createSignedUrl(fileName, tenYearsInSeconds);

    if (signedUrlError) {
      return NextResponse.json({ error: signedUrlError.message }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: signedUrlData.signedUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
