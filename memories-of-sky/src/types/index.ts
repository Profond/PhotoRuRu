export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonConfig {
  id: Season;
  kanji: string;
  name: string;
  color: string;
  glassBg: string;
  video: string;
}

export interface TimeFilter {
  brightness: number;
  sepia: number;
  saturate: number;
  hueRotate: number;
}

export const SEASONS: SeasonConfig[] = [
  { id: 'spring', kanji: '春', name: 'Spring', color: '#FAD0C4', glassBg: 'rgba(250, 208, 196, 0.12)', video: '/videos/spring-sky.mp4' },
  { id: 'summer', kanji: '夏', name: 'Summer', color: '#FFD700', glassBg: 'rgba(46, 92, 138, 0.15)', video: '/videos/summer-sky.mp4' },
  { id: 'autumn', kanji: '秋', name: 'Autumn', color: '#D35400', glassBg: 'rgba(211, 84, 0, 0.12)', video: '/videos/autumn-sky.mp4' },
  { id: 'winter', kanji: '冬', name: 'Winter', color: '#BDC3C7', glassBg: 'rgba(189, 195, 199, 0.12)', video: '/videos/winter-sky.mp4' },
];

export const SLIDER_MIN = 4;
export const SLIDER_MAX = 24;
export const SLIDER_RANGE = SLIDER_MAX - SLIDER_MIN;

export function sliderToTime(value: number): string {
  const totalMinutes = Math.round(value * SLIDER_RANGE * 60 + SLIDER_MIN * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getTimeFilter(sliderValue: number): TimeFilter {
  if (sliderValue <= 0.15) {
    const t = sliderValue / 0.15;
    return { brightness: 0.7 + t * 0.3, sepia: 0.3 - t * 0.3, saturate: 1, hueRotate: -30 + t * 15 };
  } else if (sliderValue <= 0.35) {
    const t = (sliderValue - 0.15) / 0.2;
    return { brightness: 1 + t * 0.1, sepia: 0, saturate: 1 + t * 0.06, hueRotate: -15 + t * 15 };
  } else if (sliderValue <= 0.55) {
    const t = (sliderValue - 0.35) / 0.2;
    return { brightness: 1.1 - t * 0.06, sepia: 0, saturate: 1.06, hueRotate: 0 };
  } else if (sliderValue <= 0.75) {
    const t = (sliderValue - 0.55) / 0.2;
    return { brightness: 0.9 - t * 0.3, sepia: t * 0.3, saturate: 1.06 - t * 0.06, hueRotate: -15 - t * 10 };
  } else {
    const t = (sliderValue - 0.75) / 0.25;
    return { brightness: 0.4 - t * 0.07, sepia: 0, saturate: 0.8, hueRotate: 0 };
  }
}

// ========== Language System ==========
export type Lang = 'zh' | 'ja' | 'en';

export const LANG_LABELS: Record<Lang, string> = { zh: '中', ja: '日', en: 'EN' };

export interface TranslationData {
  logoSub: string;
  heroTitleMain: string;
  heroSubtitle: string;
  scroll: string;
  aboutTitle: string;
  aboutP1: string;
  polaroidLabel: string;
  cameraInfo: string;
  galleryTitle: string;
  springPhoto: string;
  summerPhoto: string;
  autumnPhoto: string;
  winterPhoto: string;
  seasonsTitle: string;
  springStoryTitle: string;
  summerStoryTitle: string;
  autumnStoryTitle: string;
  winterStoryTitle: string;
  sp1: string; sp2: string; sp3: string; sp4: string;
  sup1: string; sup2: string; sup3: string; sup4: string;
  ap1: string; ap2: string; ap3: string; ap4: string;
  wp1: string; wp2: string; wp3: string; wp4: string;
  footerQuote: string;
  copyright: string;
  addPhoto: string;
  deletePhotoConfirm: string;
  cancel: string;
  delete: string;
  // Season names localized
  springName: string;
  summerName: string;
  autumnName: string;
  winterName: string;
}

export const TRANSLATIONS: Record<Lang, TranslationData> = {
  zh: {
    logoSub: '天空记忆',
    heroTitleMain: '天空的记忆',
    heroSubtitle: '一场穿越四季的旅程，一次与天空的相遇。',
    scroll: '向下滚动',
    aboutTitle: '关于摄影师',
    aboutP1: '每次仰望天空，内心都会轻轻震颤。随着四季流转而变化的天空色彩，定格那一个个瞬间是我的热情所在。以厦门为据点，不分国内外，持续追寻天空之美。',
    polaroidLabel: '福建，2026',
    cameraInfo: ' iPhone 15 Pro Max 、Osmo Pocket 4',
    galleryTitle: '作品集',
    springPhoto: '春风', summerPhoto: '夏之阳', autumnPhoto: '秋之别', winterPhoto: '冬之寂',
    seasonsTitle: '四季物语',
    springStoryTitle: '春之访', summerStoryTitle: '夏之忆', autumnStoryTitle: '秋之暮', winterStoryTitle: '冬之空',
    sp1: '樱花飘雪的天空下，', sp2: '听见了新生命萌芽的声音。', sp3: '春风轻抚脸颊，', sp4: '记忆之门悄然开启。',
    sup1: '积云遮蔽天空，', sup2: '蝉鸣声震颤内心深处。', sup3: '那个夏日的记忆，', sup4: '如海市蜃楼般摇曳。',
    ap1: '染透夕阳的天空，', ap2: '带着离别的色彩。', ap3: '落叶纷飞的声音，', ap4: '温柔地包裹寂寞。',
    wp1: '雪花纷飞的夜晚，', wp2: '世界被白色寂静包裹。', wp3: '只有一个心愿，', wp4: '悄悄寄托给星辰。',
    footerQuote: '「天空始终在那里，守护着我们」',
    copyright: '2024 天空记忆. 保留所有权利.',
    addPhoto: '添加照片',
    deletePhotoConfirm: '确定删除这张照片吗？',
    cancel: '取消',
    delete: '删除',
    springName: '春', summerName: '夏', autumnName: '秋', winterName: '冬',
  },

  ja: {
    logoSub: 'Memories of Sky',
    heroTitleMain: 'そらのきおく',
    heroSubtitle: 'しきをめぐるたび、そらともに。',
    scroll: 'SCROLL',
    aboutTitle: 'しゃしんかについて',
    aboutP1: 'そらをみあげるたびに、こころがしずかにゆれる。しきのうつろいとともにかわるそらのいろ、そのいっしゅんいっしゅんをきりとることがわたしのじょうねつです。アモイをきょてんに、こくないがいをとわずそらのうつくしさをおいつづけています。',
    polaroidLabel: '福建，2026',
    cameraInfo: 'iPhone 15 Pro Max、Osmo Pocket 4',
    galleryTitle: 'さくひんしゅう',
    springPhoto: 'はるかぜ', summerPhoto: 'なつのようき', autumnPhoto: 'あきのわかれ', winterPhoto: 'ふゆのせいじゃく',
    seasonsTitle: 'しきのものがたり',
    springStoryTitle: 'はるのおとずれ', summerStoryTitle: 'なつのきおく', autumnStoryTitle: 'あきのゆうぐれ', winterStoryTitle: 'ふゆのよぞら',
    sp1: 'さくらふぶきまいちるそらのしたで、', sp2: 'あたらしいいのちがめぶくおとをきいた。', sp3: 'はるかぜがほおをなで、', sp4: 'きおくのとびらがしずかにひらく。',
    sup1: 'おおきなくもがそらをおおい、', sup2: 'せみのこえがむねのおくをふるわせる。', sup3: 'あのなつのひのきおくが、', sup4: 'かげろうのようにゆらめく。',
    ap1: 'ゆうやけにそまるそらは、', ap2: 'わかれのいろをしている。', ap3: 'おちばがまいちるおとが、', ap4: 'さびしさをやさしくつつむ。',
    wp1: 'ゆきがふりつもるよる、', wp2: 'せかいはしろいしずけさにつつまれる。', wp3: 'ねがいごとをひとつだけ、', wp4: 'ほしにそっとたくして。',
    footerQuote: '「そらはいつもそこにあって、わたしたちをみまもっている」',
    copyright: '2024 そらのきおく. All rights reserved.',
    addPhoto: '写真を追加',
    deletePhotoConfirm: 'この写真を削除しますか？',
    cancel: 'キャンセル',
    delete: '削除',
    springName: 'はる', summerName: 'なつ', autumnName: 'あき', winterName: 'ふゆ',
  },

  en: {
    logoSub: 'Memories of Sky',
    heroTitleMain: 'Memories of the Sky',
    heroSubtitle: 'A journey through the seasons, one sky at a time.',
    scroll: 'SCROLL',
    aboutTitle: 'About the Photographer',
    aboutP1: 'Every time I look up at the sky, my heart trembles softly. The colors of the sky changing with the passing seasons — capturing each fleeting moment is my passion. Based in Xiamen, I continue to pursue the beauty of skies across the world.',
    polaroidLabel: 'Fujian, 2026',
    cameraInfo: 'iPhone 15 Pro Max、Osmo Pocket 4',
    galleryTitle: 'Selected Works',
    springPhoto: 'Spring Breeze', summerPhoto: 'Summer Heat', autumnPhoto: 'Autumn Farewell', winterPhoto: 'Winter Silence',
    seasonsTitle: 'Tales of the Four Seasons',
    springStoryTitle: 'The Coming of Spring', summerStoryTitle: 'Summer Memories', autumnStoryTitle: 'Autumn Twilight', winterStoryTitle: 'Winter Night Sky',
    sp1: 'Beneath the sky where cherry blossoms dance,', sp2: 'I heard the sound of new life budding.', sp3: 'The spring breeze caresses my cheek,', sp4: 'And the door of memory gently opens.',
    sup1: 'Thunderclouds blanket the sky,', sup2: "The cicada's song trembles deep in my heart.", sup3: 'Memories of that summer day', sup4: 'Shimmer like heat haze.',
    ap1: 'The sky dyed by sunset', ap2: 'Wears the color of farewell.', ap3: 'The sound of falling leaves dancing', ap4: 'Gently wraps the loneliness.',
    wp1: 'On a night when snow falls and piles,', wp2: 'The world is wrapped in white silence.', wp3: 'Just one wish,', wp4: 'Gently entrusted to the stars.',
    footerQuote: '"The sky is always there, watching over us."',
    copyright: '2024 Memories of Sky. All rights reserved.',
    addPhoto: 'Add Photo',
    deletePhotoConfirm: 'Delete this photo?',
    cancel: 'Cancel',
    delete: 'Delete',
    springName: 'Spring', summerName: 'Summer', autumnName: 'Autumn', winterName: 'Winter',
  },
};
