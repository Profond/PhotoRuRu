import type { Config } from "@netlify/functions";

// @ts-ignore - no type declarations
import NeteaseCloudMusicApi from "NeteaseCloudMusicApi";

/**
 * Self-hosted Meting API proxy using NeteaseCloudMusicApi.
 * Returns APlayer-compatible audio list: [{ name, artist, url, cover, lrc }]
 */

export default async (req: Request) => {
  const url = new URL(req.url);
  const server = url.searchParams.get("server") || "netease";
  const type = url.searchParams.get("type") || "playlist";
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id parameter" }, { status: 400 });
  }

  if (server !== "netease") {
    return Response.json(
      { error: `Unsupported server: ${server}` },
      { status: 400 }
    );
  }

  try {
    let tracks: any[] = [];

    if (type === "playlist") {
      const data = await NeteaseCloudMusicApi.playlist_detail({ id });
      tracks = data.body?.playlist?.tracks ?? [];
    } else if (type === "song") {
      const data = await NeteaseCloudMusicApi.song_detail({ ids: id });
      tracks = data.body?.songs ?? [];
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
    const [urlData, ...lyricsArr] = await Promise.all([
      NeteaseCloudMusicApi.song_url({ id: trackIds.join(","), br: 128000 }),
      ...trackIds.map((tid: string) =>
        NeteaseCloudMusicApi.lyric({ id: tid }).then(
          (d: any) => d.body?.lrc?.lyric ?? ""
        )
      ),
    ]);

    const urlMap = new Map(
      (urlData.body?.data ?? []).map((u: any) => [u.id, u.url])
    );

    const result = tracks.map((track: any, i: number) => ({
      name: track.name || "Unknown",
      artist: (track.ar || [])
        .map((a: any) => a.name)
        .join(" / "),
      url: urlMap.get(track.id) || "",
      cover: track.al?.picUrl
        ? track.al.picUrl + "?param=300y300"
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
