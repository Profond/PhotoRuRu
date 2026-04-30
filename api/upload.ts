import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload } from '@vercel/blob/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      request: req,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: req.body as any,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (_pathname, _clientPayload, _multipart) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        const { put, list } = await import('@vercel/blob');
        const metaKey = 'gallery-manifest.json';

        let filenames: string[] = [];
        try {
          const { blobs } = await list({ prefix: metaKey });
          if (blobs.length > 0) {
            const manifestRes = await fetch(blobs[0].url);
            if (manifestRes.ok) {
              const data = await manifestRes.json();
              filenames = data.filenames || [];
            }
          }
        } catch {}

        filenames.push(blob.url);
        await put(metaKey, JSON.stringify({ filenames }), {
          access: 'public',
          contentType: 'application/json',
        });
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
}

export const config = {
  api: { bodyParser: true, sizeLimit: '4mb' },
};
