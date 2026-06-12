import type { Config } from "@netlify/functions";

/**
 * Self-hosted Meting API proxy for NetEase Cloud Music.
 * Replaces the third-party `api.injahow.cn/meting/` which may be unreliable.
 *
 * Query params: server, type, id
 * Returns APlayer-compatible audio list: [{ name, artist, url, cover, lrc }]
 */

const API_BASE = "https://music.163.com";
const HEADERS = {
  "Referer": "https://music.163.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

/** Get playlist tracks */
async function getPlaylist(id: string) {
  const data = await fetchJson<{ result: { tracks: any[] } }>(
    `${API_BASE}/api/playlist/detail?id=${id}`
  );
  return data.result?.tracks ?? [];
}

/** Get song details by IDs */
async function getSongs(ids: string[]) {
  const data = await fetchJson<{ songs: any[] }>(
    `${API_BASE}/api/song/detail?ids=[${ids.join(",")}]`
  );
  return data.songs ?? [];
}

/** Get song URLs (br=320000 for 320kbps) */
async function getSongUrls(ids: string[], br = 320000) {
  const data = await fetchJson<{ data: Array<{ id: number; url: string }> }>(
    `${API_BASE}/api/song/enhance/player/url?ids=[${ids.join(",")}]&br=${br}`
  );
  return data.data ?? [];
}

/** Get lyrics */
async function getLyric(id: string) {
  const data = await fetchJson<{
    lrc?: { lyric: string };
    tlyric?: { lyric: string };
  }>(`${API_BASE}/api/song/lyric?id=${id}&lv=1`);
  return data.lrc?.lyric ?? "";
}

export default async (req: Request) => {
  const url = new URL(req.url);
  const server = url.searchParams.get("server") || "netease";
  const type = url.searchParams.get("type") || "playlist";
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id parameter" }, { status: 400 });
  }

  // Only support netease for now
  if (server !== "netease") {
    return Response.json(
      { error: `Unsupported server: ${server}` },
      { status: 400 }
    );
  }

  try {
    let tracks: any[] = [];

    if (type === "playlist") {
      tracks = await getPlaylist(id);
    } else if (type === "song") {
      tracks = await getSongs([id]);
    } else {
      return Response.json(
        { error: `Unsupported type: ${type}` },
        { status: 400 }
      );
    }

    if (!tracks.length) {
      return Response.json([]);
    }

    const trackIds = tracks.map((t: any) => String(t.id));

    // Fetch song URLs and lyrics in parallel
    const [urlResults, ...lyricsArr] = await Promise.all([
      getSongUrls(trackIds),
      ...trackIds.map((tid) => getLyric(tid)),
    ]);

    const urlMap = new Map(urlResults.map((u) => [u.id, u.url]));

    const result = tracks.map((track: any, i: number) => ({
      name: track.name || "Unknown",
      artist: (track.artists || track.ar || [])
        .map((a: any) => a.name)
        .join(" / "),
      url: urlMap.get(track.id) || "",
      cover:
        track.album?.picUrl || track.al?.picUrl
          ? (track.album?.picUrl || track.al?.picUrl) + "?param=300y300"
          : "",
      lrc: lyricsArr[i] || "",
    }));

    return Response.json(result);
  } catch (err) {
    console.error("Meting proxy error:", err);
    return Response.json(
      { error: "Failed to fetch music data" },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: "/api/meting",
  method: ["GET"],
};
