import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload } from '@vercel/blob/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await handleUpload({
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        const { put } = await import('@vercel/blob');
        const metaKey = 'gallery-manifest.json';

        let filenames: string[] = [];
        try {
          const existing = await fetch(`${process.env.BLOB_STORE_URL || ''}/${metaKey}`);
          if (existing.ok) {
            const data = await existing.json();
            filenames = data.filenames || [];
          }
        } catch {}

        filenames.push(blob.url);
        await put(metaKey, JSON.stringify({ filenames }), {
          access: 'public',
          contentType: 'application/json',
        });
      },
    });

    return res.status(200).json(body);
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
}

export const config = {
  api: { bodyParser: false },
};
