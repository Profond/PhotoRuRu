import type { VercelRequest, VercelResponse } from '@vercel/node';
import { del, list, put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  try {
    await del(url);

    const metaKey = 'gallery-manifest.json';
    const { blobs } = await list({ prefix: metaKey });

    let filenames: string[] = [];
    if (blobs.length > 0) {
      const manifestRes = await fetch(blobs[0].url);
      if (manifestRes.ok) {
        const data = await manifestRes.json();
        filenames = (data.filenames || []).filter((f: string) => f !== url);
      }
    }

    await put(metaKey, JSON.stringify({ filenames }), {
      access: 'public',
      contentType: 'application/json',
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
}
