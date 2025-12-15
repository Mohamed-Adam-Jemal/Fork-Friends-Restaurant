// app/api/upload-image/team-members/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ secure: true });

// Sanitize filename: remove accents and replace invalid chars
function sanitizeFileName(name: string) {
  return name
    .normalize('NFD')                  // split accented letters
    .replace(/[\u0300-\u036f]/g, '')  // remove accents
    .replace(/[^a-zA-Z0-9.-]/g, '_'); // replace invalid chars with _
}

export async function POST(req: Request) {
  try {
    // Check HTTP-only cookie for authentication
    const authToken = (await cookies()).get('admin_token')?.value;
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get file from FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename
    const sanitizedFileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: sanitizedFileName, folder: 'Fork-and-Friends/team-members' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as { secure_url: string });
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ signedUrl: result.secure_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
  }
}
