import type { Config } from "@netlify/functions";

/**
 * Meting API proxy — forwards to self-hosted NeteaseCloudMusicApi on Tencent SCF.
 * Returns APlayer-compatible audio list: [{ name, artist, url, cover, lrc }]
 */

const API_BASE = "https://1306193308-goczfijoz5.ap-guangzhou.tencentscf.com";

export default async (req: Request) => {
  const url = new URL(req.url);
  const server = url.searchParams.get("server") || "netease";
  const type = url.searchParams.get("type") || "playlist";
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  if (server !== "netease") {
    return Response.json({ error: `Unsupported server: ${server}` }, { status: 400 });
  }

  try {
    // 1. Fetch playlist tracks
    const playlistRes = await fetch(`${API_BASE}/playlist/detail?id=${id}`);
    const playlistData = await playlistRes.json();
    const tracks: any[] = playlistData.playlist?.tracks ?? [];

    if (!tracks.length) return Response.json([]);

    const trackIds = tracks.map((t: any) => t.id);

    // 2. Fetch song URLs in batches of 10
    const urlMap = new Map<number, string>();
    for (let i = 0; i < trackIds.length; i += 10) {
      const batch = trackIds.slice(i, i + 10);
      try {
        const res = await fetch(
          `${API_BASE}/song/url?id=${batch.join(",")}&br=128000`
        );
        const data: any = await res.json();
        for (const u of data.data ?? []) {
          if (u.url) {
            let songUrl: string = u.url;
            if (songUrl.startsWith("http://")) {
              songUrl = "https://" + songUrl.slice(7);
            }
            urlMap.set(u.id, songUrl);
          }
        }
      } catch { /* skip failed batch */ }
    }

    // 3. Fetch lyrics (sequentially to avoid overwhelming SCF)
    const lyricsArr: string[] = [];
    for (const tid of trackIds) {
      try {
        const res = await fetch(`${API_BASE}/lyric?id=${tid}`);
        const data: any = await res.json();
        lyricsArr.push(data.lrc?.lyric ?? "");
      } catch {
        lyricsArr.push("");
      }
    }

    // 4. Build result
    const result = tracks.map((track: any, i: number) => {
      let cover = track.al?.picUrl
        ? track.al.picUrl + "?param=300y300"
        : "";
      if (cover.startsWith("http://")) {
        cover = "https://" + cover.slice(7);
      }
      return {
        name: track.name || "Unknown",
        artist: (track.ar || []).map((a: any) => a.name).join(" / "),
        url: urlMap.get(track.id) || "",
        cover,
        lrc: lyricsArr[i] || "",
      };
    });

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
