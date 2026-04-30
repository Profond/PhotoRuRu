export type Lang = 'zh' | 'ja' | 'en'

export interface Translations {
  // Navbar
  navAbout: string
  navWorks: string
  navSeasons: string
  navExhibition: string

  // Seasons
  springName: string
  summerName: string
  autumnName: string
  winterName: string

  // Hero
  heroTitle: string
  heroSubtitle: string
  heroSubJp: string

  // About
  aboutTitleJp: string
  aboutTitleEn: string
  aboutText1: string
  aboutText1En: string
  aboutText2: string
  aboutText2En: string
  aboutLocation: string

  // Gallery
  galleryTitle: string
  galleryTitleEn: string
  springBreeze: string
  summerHeat: string
  autumnFarewell: string
  winterSilence: string

  // Seasons section
  seasonsTitle: string
  seasonsTitleEn: string

  // Spring
  springTitle: string
  springTitleEn: string
  springPoemJp: string[]
  springPoemEn: string[]

  // Summer
  summerTitle: string
  summerTitleEn: string
  summerPoemJp: string[]
  summerPoemEn: string[]

  // Autumn
  autumnTitle: string
  autumnTitleEn: string
  autumnPoemJp: string[]
  autumnPoemEn: string[]

  // Winter
  winterTitle: string
  winterTitleEn: string
  winterPoemJp: string[]
  winterPoemEn: string[]

  // Footer
  footerTagline: string
  footerTaglineEn: string
  footerCopyright: string
}

export const translations: Record<Lang, Translations> = {
  ja: {
    navAbout: '概要',
    navWorks: '作品集',
    navSeasons: '四季の物語',
    navExhibition: '写真展のお知らせ',

    springName: '春',
    summerName: '夏',
    autumnName: '秋',
    winterName: '冬',

    heroTitle: '空の記憶',
    heroSubtitle: 'Memories of the Sky',
    heroSubJp: '四季を巡る旅、空と共に。',

    aboutTitleJp: '写真家について',
    aboutTitleEn: 'About the Photographer',
    aboutText1: '空を撮ることは、時間の美しさを捉えること。朝焼けの優しさ、夕暮れの切なさ、夜空の静寂——すべての瞬間に物語がある。',
    aboutText1En: 'Photographing the sky is capturing the beauty of time. The gentleness of dawn, the melancholy of dusk, the silence of the night sky — every moment holds a story.',
    aboutText2: '十五年間、日本の四季を追い続けている。春の桜、夏の入道雲、秋の夕焼け、冬の雪景色——季節が移ろうたびに、空は新しい表情を見せる。',
    aboutText2En: 'For fifteen years, I have been chasing the four seasons of Japan. Cherry blossoms in spring, towering cumulus clouds in summer, sunsets in autumn, snowy landscapes in winter — the sky reveals new expressions with each passing season.',
    aboutLocation: 'FuJian, 2026',

    galleryTitle: '作品集',
    galleryTitleEn: 'Selected Works',
    springBreeze: '春風',
    summerHeat: '夏の陽気',
    autumnFarewell: '秋の別れ',
    winterSilence: '冬の静寂',

    seasonsTitle: '四季の物語',
    seasonsTitleEn: 'Tales of the Four Seasons',

    springTitle: '春の目覚め',
    springTitleEn: 'Spring Awakening',
    springPoemJp: [
      '桜吹雪舞い散る空の下で、',
      '新しい命が芽吹く音を聞いた。',
      '風に乗せて運ばれる花びらは、',
      'どこまでも優しく、どこまでも儚い。',
    ],
    springPoemEn: [
      'Beneath the sky where cherry blossoms scatter,',
      'I heard the sound of new life sprouting.',
      'Petals carried on the wind are',
      'Gentle everywhere, ephemeral everywhere.',
    ],

    summerTitle: '夏の記憶',
    summerTitleEn: 'Summer Memories',
    summerPoemJp: [
      '入道雲が空を覆い、',
      '蝉の声が胸の奥を震わせる。',
      '遠い夏の日差しの中で、',
      '一瞬の夢を見ていた。',
    ],
    summerPoemEn: [
      'Towering cumulus clouds cover the sky,',
      'The sound of cicadas trembles deep in my heart.',
      'Under the distant summer sunlight,',
      'I was dreaming a fleeting dream.',
    ],

    autumnTitle: '秋の別れ',
    autumnTitleEn: 'Autumn Farewell',
    autumnPoemJp: [
      '夕焼けに染まる空は、',
      '別れの色をしている。',
      '紅葉の葉が風に舞い、',
      '静かに季節が過ぎていく。',
    ],
    autumnPoemEn: [
      'The sky dyed in sunset hues',
      'Wears the color of farewell.',
      'Autumn leaves dance in the wind,',
      'As the season quietly passes.',
    ],

    winterTitle: '冬の静寂',
    winterTitleEn: 'Winter Silence',
    winterPoemJp: [
      '雪が降り積もる夜、',
      '世界は白い静けさに包まれる。',
      '星のない空を見上げて、',
      '小さな願いを込めた。',
    ],
    winterPoemEn: [
      'On a night of falling snow,',
      'The world is wrapped in white silence.',
      'Looking up at the starless sky,',
      'I whispered a small wish.',
    ],

    footerTagline: '空の美しさを追い求め続ける旅路',
    footerTaglineEn: 'A never-ending journey to capture the beauty of the sky.',
    footerCopyright: 'All rights reserved.',
  },

  zh: {
    navAbout: '关于',
    navWorks: '作品集',
    navSeasons: '四季物语',
    navExhibition: '写真展公告',

    springName: '春',
    summerName: '夏',
    autumnName: '秋',
    winterName: '冬',

    heroTitle: '天空记忆',
    heroSubtitle: 'Memories of the Sky',
    heroSubJp: '四季轮回之旅，与天空同行。',

    aboutTitleJp: '关于摄影师',
    aboutTitleEn: 'About the Photographer',
    aboutText1: '拍摄天空，就是捕捉时间之美。黎明的温柔、黄昏的惆怅、夜空的寂静——每一个瞬间都有属于它的故事。',
    aboutText1En: 'Photographing the sky is capturing the beauty of time. The gentleness of dawn, the melancholy of dusk, the silence of the night sky — every moment holds a story.',
    aboutText2: '十五年来，我一直追逐着日本的四季。春日的樱花、夏日的积雨云、秋天的晚霞、冬日的雪景——随着季节更替，天空展现出全新的面貌。',
    aboutText2En: 'For fifteen years, I have been chasing the four seasons of Japan. Cherry blossoms in spring, towering cumulus clouds in summer, sunsets in autumn, snowy landscapes in winter — the sky reveals new expressions with each passing season.',
    aboutLocation: '福建, 2026',

    galleryTitle: '作品集',
    galleryTitleEn: 'Selected Works',
    springBreeze: '春风',
    summerHeat: '夏日',
    autumnFarewell: '秋别',
    winterSilence: '冬寂',

    seasonsTitle: '四季物语',
    seasonsTitleEn: 'Tales of the Four Seasons',

    springTitle: '春之觉醒',
    springTitleEn: 'Spring Awakening',
    springPoemJp: [
      '樱花飞舞散落的天空之下，',
      '我听到了新生命萌芽的声音。',
      '乘风飘散的花瓣，',
      '无比温柔，又无比短暂。',
    ],
    springPoemEn: [
      'Beneath the sky where cherry blossoms scatter,',
      'I heard the sound of new life sprouting.',
      'Petals carried on the wind are',
      'Gentle everywhere, ephemeral everywhere.',
    ],

    summerTitle: '夏日记忆',
    summerTitleEn: 'Summer Memories',
    summerPoemJp: [
      '积雨云遮蔽了天空，',
      '蝉鸣声在胸腔深处震颤。',
      '在遥远的夏日阳光下，',
      '我做了一场短暂的梦。',
    ],
    summerPoemEn: [
      'Towering cumulus clouds cover the sky,',
      'The sound of cicadas trembles deep in my heart.',
      'Under the distant summer sunlight,',
      'I was dreaming a fleeting dream.',
    ],

    autumnTitle: '秋之离别',
    autumnTitleEn: 'Autumn Farewell',
    autumnPoemJp: [
      '被晚霞染红的天空，',
      '带着离别的色彩。',
      '红叶在风中飞舞，',
      '季节静静地流逝。',
    ],
    autumnPoemEn: [
      'The sky dyed in sunset hues',
      'Wears the color of farewell.',
      'Autumn leaves dance in the wind,',
      'As the season quietly passes.',
    ],

    winterTitle: '冬之寂静',
    winterTitleEn: 'Winter Silence',
    winterPoemJp: [
      '大雪纷飞的夜晚，',
      '世界被白色的寂静所包裹。',
      '仰望没有星星的天空，',
      '许下了一个小小的心愿。',
    ],
    winterPoemEn: [
      'On a night of falling snow,',
      'The world is wrapped in white silence.',
      'Looking up at the starless sky,',
      'I whispered a small wish.',
    ],

    footerTagline: '不断追寻天空之美的旅途',
    footerTaglineEn: 'A never-ending journey to capture the beauty of the sky.',
    footerCopyright: '版权所有。',
  },

  en: {
    navAbout: 'About',
    navWorks: 'Works',
    navSeasons: 'Seasons',
    navExhibition: 'Exhibition',

    springName: 'Spring',
    summerName: 'Summer',
    autumnName: 'Autumn',
    winterName: 'Winter',

    heroTitle: 'Memories of the Sky',
    heroSubtitle: 'Memories of the Sky',
    heroSubJp: 'A journey through the seasons, one sky at a time.',

    aboutTitleJp: 'About the Photographer',
    aboutTitleEn: 'About the Photographer',
    aboutText1: 'Photographing the sky is capturing the beauty of time. The gentleness of dawn, the melancholy of dusk, the silence of the night sky — every moment holds a story.',
    aboutText1En: '',
    aboutText2: 'For fifteen years, I have been chasing the four seasons of Japan. Cherry blossoms in spring, towering cumulus clouds in summer, sunsets in autumn, snowy landscapes in winter — the sky reveals new expressions with each passing season.',
    aboutText2En: '',
    aboutLocation: 'FuJian, 2026',

    galleryTitle: 'Selected Works',
    galleryTitleEn: '',
    springBreeze: 'Spring Breeze',
    summerHeat: 'Summer Heat',
    autumnFarewell: 'Autumn Farewell',
    winterSilence: 'Winter Silence',

    seasonsTitle: 'Tales of the Four Seasons',
    seasonsTitleEn: '',

    springTitle: 'Spring Awakening',
    springTitleEn: '',
    springPoemJp: [
      'Beneath the sky where cherry blossoms scatter,',
      'I heard the sound of new life sprouting.',
      'Petals carried on the wind are',
      'Gentle everywhere, ephemeral everywhere.',
    ],
    springPoemEn: [],

    summerTitle: 'Summer Memories',
    summerTitleEn: '',
    summerPoemJp: [
      'Towering cumulus clouds cover the sky,',
      'The sound of cicadas trembles deep in my heart.',
      'Under the distant summer sunlight,',
      'I was dreaming a fleeting dream.',
    ],
    summerPoemEn: [],

    autumnTitle: 'Autumn Farewell',
    autumnTitleEn: '',
    autumnPoemJp: [
      'The sky dyed in sunset hues',
      'Wears the color of farewell.',
      'Autumn leaves dance in the wind,',
      'As the season quietly passes.',
    ],
    autumnPoemEn: [],

    winterTitle: 'Winter Silence',
    winterTitleEn: '',
    winterPoemJp: [
      'On a night of falling snow,',
      'The world is wrapped in white silence.',
      'Looking up at the starless sky,',
      'I whispered a small wish.',
    ],
    winterPoemEn: [],

    footerTagline: 'A never-ending journey to capture the beauty of the sky.',
    footerTaglineEn: '',
    footerCopyright: 'All rights reserved.',
  },
}

export const LANG_LABELS: Record<Lang, string> = {
  zh: '中',
  ja: '日',
  en: 'EN',
}
