import type { Config } from "@netlify/functions";

const SCF = "https://1306193308-goczfijoz5.ap-guangzhou.tencentscf.com";

async function getJson(url: string) {
  const r = await fetch(url);
  return r.json();
}

export default async (req: Request) => {
  const u = new URL(req.url);
  const type = u.searchParams.get("type") || "playlist";
  const id = u.searchParams.get("id");
  if (!id) return Response.json([], { status: 400 });

  try {
    // Step 1: get tracks
    let tracks: any[] = [];
    if (type === "playlist") {
      const d: any = await getJson(`${SCF}/playlist/detail?id=${id}`);
      tracks = d.playlist?.tracks ?? [];
    } else if (type === "song") {
      const d: any = await getJson(`${SCF}/song/detail?ids=${id}`);
      tracks = d.songs ?? [];
    }
    if (!tracks.length) return Response.json([]);

    // Step 2: get song URLs (batch 10)
    const ids = tracks.map((t: any) => t.id);
    const urlMap = new Map<number, string>();

    for (let i = 0; i < ids.length; i += 10) {
      const batch = ids.slice(i, i + 10);
      const d: any = await getJson(`${SCF}/song/url?id=${batch.join(",")}&br=128000`);
      for (const item of d.data ?? []) {
        if (item.url) {
          let songUrl: string = item.url;
          if (songUrl.startsWith("http://")) songUrl = "https://" + songUrl.slice(7);
          urlMap.set(item.id, songUrl);
        }
      }
    }

    // Step 3: get lyrics (batch 5 to avoid timeout)
    const lrcMap = new Map<number, string>();
    for (let i = 0; i < ids.length; i += 5) {
      const batch = ids.slice(i, i + 5);
      const results = await Promise.all(
        batch.map((tid: number) =>
          getJson(`${SCF}/lyric?id=${tid}`)
            .then((d: any) => ({ id: tid, lrc: d.lrc?.lyric ?? "" }))
            .catch(() => ({ id: tid, lrc: "" }))
        )
      );
      for (const r of results) {
        lrcMap.set(r.id, r.lrc);
      }
    }

    // Step 4: build result
    const result = tracks.map((track: any) => {
      let cover = track.al?.picUrl ? track.al.picUrl + "?param=300y300" : "";
      if (cover.startsWith("http://")) cover = "https://" + cover.slice(7);
      return {
        name: track.name || "Unknown",
        artist: (track.ar || []).map((a: any) => a.name).join(" / "),
        url: urlMap.get(track.id) || "",
        cover,
        lrc: lrcMap.get(track.id) || "",
      };
    });

    return Response.json(result);
  } catch (err) {
    console.error("Meting error:", err);
    return Response.json([], { status: 500 });
  }
};

export const config: Config = {
  path: "/api/meting",
  method: ["GET"],
};
