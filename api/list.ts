import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { blobs } = await list({ prefix: 'gallery-manifest.json' });
    if (blobs.length === 0) return res.status(200).json([]);

    const manifestRes = await fetch(blobs[0].url);
    if (!manifestRes.ok) return res.status(200).json([]);

    const { filenames } = await manifestRes.json();
    return res.status(200).json(filenames || []);
  } catch {
    return res.status(200).json([]);
  }
}
