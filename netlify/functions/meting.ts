import type { Config } from "@netlify/functions";

/**
 * Meting API proxy — forwards to self-hosted NeteaseCloudMusicApi on Tencent SCF.
 * Returns APlayer-compatible audio list: [{ name, artist, url, cover, lrc }]
 */

const API_BASE = "https://1306193308-goczfijoz5.ap-guangzhou.tencentscf.com";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export default async (req: Request) => {
  const url = new URL(req.url);
  const server = url.searchParams.get("server") || "netease";
  const type = url.searchParams.get("type") || "playlist";
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id parameter" }, { status: 400 });
  }

  if (server !== "netease") {
    return Response.json({ error: `Unsupported server: ${server}` }, { status: 400 });
  }

  try {
    let tracks: any[] = [];

    if (type === "playlist") {
      const data = await fetchJson<any>(`${API_BASE}/playlist/detail?id=${id}`);
      tracks = data.playlist?.tracks ?? [];
    } else if (type === "song") {
      const data = await fetchJson<any>(`${API_BASE}/song/detail?ids=${id}`);
      tracks = data.songs ?? [];
    } else {
      return Response.json({ error: `Unsupported type: ${type}` }, { status: 400 });
    }

    if (!tracks.length) return Response.json([]);

    const trackIds = tracks.map((t: any) => String(t.id));

    const [urlData, ...lyricsArr] = await Promise.all([
      fetchJson<any>(`${API_BASE}/song/url?id=${trackIds.join(",")}&br=128000`),
      ...trackIds.map((tid: string) =>
        fetchJson<any>(`${API_BASE}/lyric?id=${tid}`).then(
          (d: any) => d.lrc?.lyric ?? ""
        )
      ),
    ]);

    const urlMap = new Map(
      (urlData.data ?? []).map((u: any) => [u.id, u.url])
    );

    const result = tracks.map((track: any, i: number) => ({
      name: track.name || "Unknown",
      artist: (track.ar || []).map((a: any) => a.name).join(" / "),
      url: urlMap.get(track.id) || "",
      cover: track.al?.picUrl ? track.al.picUrl + "?param=300y300" : "",
      lrc: lyricsArr[i] || "",
    }));

    return Response.json(result);
  } catch (err) {
    console.error("Meting proxy error:", err);
    return Response.json({ error: "Failed to fetch music data" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/meting",
  method: ["GET"],
};
