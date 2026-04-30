export const musicConfig = {
  /** Set to false to disable music player entirely */
  enable: true,
  /** Meting API endpoint (public or self-hosted) */
  metingApi: 'https://api.injahow.cn/meting/',
  /** Music server: 'netease' for NetEase Cloud Music, 'tencent' for QQ Music */
  server: 'netease' as 'netease' | 'tencent',
  /** Resource type: 'playlist', 'song', 'album', 'artist', 'search' */
  type: 'playlist' as 'playlist' | 'song' | 'album' | 'artist',
  /** Playlist / song / album ID */
  id: '7983425849',
  /** Auto-play on load (may be blocked by browser) */
  autoplay: true,
  /** Default volume 0-1 */
  volume: 0.3,
}
