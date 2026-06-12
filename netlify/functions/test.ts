import type { Config } from "@netlify/functions";

const SCF = "https://1306193308-goczfijoz5.ap-guangzhou.tencentscf.com";

export default async (req: Request) => {
  const u = new URL(req.url);
  const id = u.searchParams.get("id") || "2625981151,2078042511";

  try {
    const url = `${SCF}/song/url?id=${id}&br=128000`;
    const res = await fetch(url);
    const text = await res.text();
    return new Response(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return Response.json({ error: String(err) });
  }
};

export const config: Config = {
  path: "/api/test",
  method: ["GET"],
};
