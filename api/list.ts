import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { blobs } = await list({ prefix: 'gallery/' });
    const urls = blobs.map(b => b.url);
    return res.status(200).json(urls);
  } catch (error) {
    return res.status(200).json([]);
  }
}
