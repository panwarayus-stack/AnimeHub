import { Anime } from '../types/anime';
import { createSampleSubtitleDataUrl } from '../services/video';

// Local generated cinematic assets
import cyberpunkBanner from '../assets/images/hero_cyberpunk_anime_1790840916276.jpg';
import fantasyBanner from '../assets/images/fantasy_sword_anime_1790840930951.jpg';
import mechaBanner from '../assets/images/mecha_scifi_anime_1790840942914.jpg';
import sliceOfLifeBanner from '../assets/images/slice_of_life_anime_1790840955534.jpg';

export const ANIME_CATALOG: Anime[] = [
  {
    id: 'cyber-genesis-tokyo-2088',
    slug: 'cyber-genesis-tokyo-2088',
    title: 'Cyber Genesis: Tokyo 2088',
    japaneseTitle: '電脳創世記 東京2088',
    synopsis: 'In a rain-drenched Neo-Tokyo fractured between augmented megacorporations and rogue net-runners, an elite cyber-detective uncovers an encrypted neural network containing memories that should not exist. When high-tech syndicates mobilize to wipe her consciousness, she must align with underground hackers to ignite the spark of cybernetic rebellion.',
    bannerImage: cyberpunkBanner,
    posterImage: cyberpunkBanner,
    genres: ['Cyberpunk', 'Sci-Fi', 'Action', 'Thriller'],
    status: 'Ongoing',
    releaseYear: 2025,
    season: 'Winter 2025',
    rating: 'TV-MA',
    score: 9.2,
    studio: 'Trigger Dynamics',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English (Full), Spanish, French, German',
    totalEpisodes: 12,
    featured: true,
    trending: true,
    recentlyAdded: true,
    episodes: [
      {
        id: 'cg-ep-01',
        number: 1,
        title: 'Awakening in the Rain',
        synopsis: 'Detective Ren wakes in an abandoned server farm in Sector 7 with corrupted memory registers and a bounty on her head.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: cyberpunkBanner,
        videoUrl: '/anime/cyber-genesis/ep-01.mp4',
        subtitles: [
          { id: 'sub-en-1', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Cyber Genesis - Ep 1'), default: true },
          { id: 'sub-es-1', label: 'Spanish', language: 'es', url: createSampleSubtitleDataUrl('Spanish', 'Cyber Genesis - Ep 1') },
          { id: 'sub-jp-1', label: 'Japanese Romaji', language: 'ja', url: createSampleSubtitleDataUrl('Japanese Romaji', 'Cyber Genesis - Ep 1') }
        ],
        audioTracks: [
          { id: 'aud-jp-1', label: 'Japanese (Original)', language: 'ja', url: '', default: true },
          { id: 'aud-en-1', label: 'English Dub', language: 'en', url: '' }
        ]
      },
      {
        id: 'cg-ep-02',
        number: 2,
        title: 'Neon Ghosts',
        synopsis: 'A clandestine meeting in the neon alleyways of Akihabara reveals the true origins of Project Genesis.',
        duration: 1380,
        durationFormatted: '23m',
        thumbnail: cyberpunkBanner,
        videoUrl: '/anime/cyber-genesis/ep-02.mp4',
        subtitles: [
          { id: 'sub-en-2', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Cyber Genesis - Ep 2'), default: true },
          { id: 'sub-es-2', label: 'Spanish', language: 'es', url: createSampleSubtitleDataUrl('Spanish', 'Cyber Genesis - Ep 2') }
        ],
        audioTracks: [
          { id: 'aud-jp-2', label: 'Japanese (Original)', language: 'ja', url: '', default: true },
          { id: 'aud-en-2', label: 'English Dub', language: 'en', url: '' }
        ]
      },
      {
        id: 'cg-ep-03',
        number: 3,
        title: 'The Firewall Breach',
        synopsis: 'Corporate drones corner Ren inside the orbital transit tube as the syndicate AI initiates a total sector lockdown.',
        duration: 1500,
        durationFormatted: '25m',
        thumbnail: cyberpunkBanner,
        videoUrl: '/anime/cyber-genesis/ep-03.mp4',
        subtitles: [
          { id: 'sub-en-3', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Cyber Genesis - Ep 3'), default: true }
        ]
      },
      {
        id: 'cg-ep-04',
        number: 4,
        title: 'Signal in the Void',
        synopsis: 'Ren and her rogue crew decipher the final coordinates broadcast by the lost satellite array.',
        duration: 1420,
        durationFormatted: '24m',
        thumbnail: cyberpunkBanner,
        videoUrl: '/anime/cyber-genesis/ep-04.mp4',
        subtitles: [
          { id: 'sub-en-4', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Cyber Genesis - Ep 4'), default: true }
        ]
      }
    ]
  },
  {
    id: 'moonlit-blade-chronicles',
    slug: 'moonlit-blade-chronicles',
    title: 'Moonlit Blade: Chronicles of the Twin Moons',
    japaneseTitle: '双月の刃',
    synopsis: 'Centuries after the celestial fracturing that created two moons in the sky, wandering swordsman Jin guards an ancient runic blade capable of cleaving void-beasts. Drawn to the misty Whispering Forest, he encounters a deposed princess who carries the lost crest of the Lunar Empire.',
    bannerImage: fantasyBanner,
    posterImage: fantasyBanner,
    genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
    status: 'Completed',
    releaseYear: 2024,
    season: 'Autumn 2024',
    rating: 'PG-13',
    score: 8.9,
    studio: 'Ufotable Arts',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English, French, Portuguese',
    totalEpisodes: 24,
    featured: true,
    trending: true,
    recentlyAdded: false,
    episodes: [
      {
        id: 'mb-ep-01',
        number: 1,
        title: 'The Solitary Ronin',
        synopsis: 'Jin enters the Whispering Forest under the silver glow of the twin moons, where crystalline spirits whisper of imminent peril.',
        duration: 1410,
        durationFormatted: '24m',
        thumbnail: fantasyBanner,
        videoUrl: '/anime/moonlit-blade/ep-01.mp4',
        subtitles: [
          { id: 'mb-sub-1', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Moonlit Blade - Ep 1'), default: true }
        ]
      },
      {
        id: 'mb-ep-02',
        number: 2,
        title: 'Blade of the Ancestors',
        synopsis: 'A raid by the Crimson Fang clan forces Jin to draw the runic blade, revealing its luminous power.',
        duration: 1390,
        durationFormatted: '23m',
        thumbnail: fantasyBanner,
        videoUrl: '/anime/moonlit-blade/ep-02.mp4',
        subtitles: [
          { id: 'mb-sub-2', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Moonlit Blade - Ep 2'), default: true }
        ]
      },
      {
        id: 'mb-ep-03',
        number: 3,
        title: 'The Eclipse Covenant',
        synopsis: 'The twin moons align, granting demonic warlords the power to walk upon mortal realm soil.',
        duration: 1450,
        durationFormatted: '24m',
        thumbnail: fantasyBanner,
        videoUrl: '/anime/moonlit-blade/ep-03.mp4',
        subtitles: [
          { id: 'mb-sub-3', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Moonlit Blade - Ep 3'), default: true }
        ]
      }
    ]
  },
  {
    id: 'orbital-vanguard-stellar-horizon',
    slug: 'orbital-vanguard-stellar-horizon',
    title: 'Orbital Vanguard: Stellar Horizon',
    japaneseTitle: '軌道前衛 ステラ・ホライゾン',
    synopsis: 'Stationed on the defensive ring of Jupiter, Captain Keith leads Squadron Aegis, piloting massive celestial mecha engineered to repel an enigmatic non-carbon threat known as the Silicoids. As humanity prepares for planetary evacuation, Keith discovers the aliens are attempting communication, not conquest.',
    bannerImage: mechaBanner,
    posterImage: mechaBanner,
    genres: ['Mecha', 'Sci-Fi', 'Military', 'Space'],
    status: 'Ongoing',
    releaseYear: 2025,
    season: 'Spring 2025',
    rating: 'PG-13',
    score: 8.7,
    studio: 'Sunrise Orbital',
    audioInfo: 'Japanese with English Subtitles',
    subtitleInfo: 'English, Italian, German, Japanese',
    totalEpisodes: 13,
    featured: true,
    trending: false,
    recentlyAdded: true,
    episodes: [
      {
        id: 'ov-ep-01',
        number: 1,
        title: 'Scramble at Jovian Gate',
        synopsis: 'A sudden gravitational anomaly near Ganymede triggers an emergency launch of Vanguard Unit 01.',
        duration: 1470,
        durationFormatted: '25m',
        thumbnail: mechaBanner,
        videoUrl: '/anime/orbital-vanguard/ep-01.mp4',
        subtitles: [
          { id: 'ov-sub-1', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Orbital Vanguard - Ep 1'), default: true }
        ]
      },
      {
        id: 'ov-ep-02',
        number: 2,
        title: 'Resonance Frequency',
        synopsis: 'During close-range dogfight combat, Keith catches an auditory sequence transmitted straight into his neural link.',
        duration: 1420,
        durationFormatted: '24m',
        thumbnail: mechaBanner,
        videoUrl: '/anime/orbital-vanguard/ep-02.mp4',
        subtitles: [
          { id: 'ov-sub-2', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Orbital Vanguard - Ep 2'), default: true }
        ]
      }
    ]
  },
  {
    id: 'tides-of-kamakura',
    slug: 'tides-of-kamakura',
    title: 'Tides of Kamakura',
    japaneseTitle: '鎌倉の潮騒',
    synopsis: 'A heartfelt, nostalgic story set along the sunlit Enoshima coast. Aspiring acoustic composer Haruto returns to his grandmother’s coastal seaside cafe after feeling burnt out in Tokyo. There, he reconnects with Aoi, a quiet watercolor artist restoring century-old stained glass at the local maritime chapel.',
    bannerImage: sliceOfLifeBanner,
    posterImage: sliceOfLifeBanner,
    genres: ['Slice of Life', 'Romance', 'Drama'],
    status: 'Completed',
    releaseYear: 2024,
    season: 'Summer 2024',
    rating: 'G',
    score: 9.0,
    studio: 'Kyoto Animation Studio',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English, Spanish, Traditional Chinese',
    totalEpisodes: 12,
    featured: false,
    trending: true,
    recentlyAdded: true,
    episodes: [
      {
        id: 'tk-ep-01',
        number: 1,
        title: 'Summer Seaside Breeze',
        synopsis: 'The rhythmic sound of the Enoden train and the salty breeze welcome Haruto back to the quiet coast.',
        duration: 1350,
        durationFormatted: '23m',
        thumbnail: sliceOfLifeBanner,
        videoUrl: '/anime/tides-of-kamakura/ep-01.mp4',
        subtitles: [
          { id: 'tk-sub-1', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Tides of Kamakura - Ep 1'), default: true }
        ]
      },
      {
        id: 'tk-ep-02',
        number: 2,
        title: 'Stained Glass and Sea Salt',
        synopsis: 'Haruto visits the coastal chapel and hears an unexpected melody played upon an upright harmonium.',
        duration: 1380,
        durationFormatted: '23m',
        thumbnail: sliceOfLifeBanner,
        videoUrl: '/anime/tides-of-kamakura/ep-02.mp4',
        subtitles: [
          { id: 'tk-sub-2', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Tides of Kamakura - Ep 2'), default: true }
        ]
      }
    ]
  },
  {
    id: 'shadow-sovereign-veil',
    slug: 'shadow-sovereign-veil',
    title: 'Shadow Sovereign: Veil of Oblivion',
    japaneseTitle: '影の覇王',
    synopsis: 'In a Gothic metropolis where noble families command shadow beasts, the exiled third heir discovers an ethereal artifact allowing him to merge with shadows unseen. He constructs a clandestine network to overturn the corrupt council from the darkness.',
    bannerImage: fantasyBanner,
    posterImage: fantasyBanner,
    genres: ['Dark Fantasy', 'Action', 'Mystery', 'Supernatural'],
    status: 'Ongoing',
    releaseYear: 2025,
    season: 'Winter 2025',
    rating: 'TV-14',
    score: 8.8,
    studio: 'Mappa Works',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English, Spanish, Italian',
    totalEpisodes: 24,
    featured: false,
    trending: true,
    recentlyAdded: false,
    episodes: [
      {
        id: 'ss-ep-01',
        number: 1,
        title: 'Shadows Cast by High Towers',
        synopsis: 'From the rainy rooftops of Belhaven, William watches the council execution that marks the start of his vendetta.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: fantasyBanner,
        videoUrl: '/anime/shadow-sovereign/ep-01.mp4',
        subtitles: [
          { id: 'ss-sub-1', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Shadow Sovereign - Ep 1'), default: true }
        ]
      }
    ]
  },
  {
    id: 'chrono-paradox-divergent-lines',
    slug: 'chrono-paradox-divergent-lines',
    title: 'Chrono Paradox: Divergent Lines',
    japaneseTitle: '時空のパラドックス',
    synopsis: 'A university physics researcher constructs an experimental quantum scanner, only to receive a distress phone call from his own voice six hours in the future warning him that the prototype will cause the erasure of everyone on campus.',
    bannerImage: cyberpunkBanner,
    posterImage: cyberpunkBanner,
    genres: ['Sci-Fi', 'Psychological', 'Mystery', 'Thriller'],
    status: 'Completed',
    releaseYear: 2024,
    season: 'Spring 2024',
    rating: 'PG-13',
    score: 9.1,
    studio: 'White Fox Prime',
    audioInfo: 'Japanese with English Subtitles',
    subtitleInfo: 'English, French, Japanese',
    totalEpisodes: 24,
    featured: false,
    trending: false,
    recentlyAdded: true,
    episodes: [
      {
        id: 'cp-ep-01',
        number: 1,
        title: 'The Six-Hour Warning',
        synopsis: 'The phone on the workbench rings with an impossible caller ID: his own mobile number.',
        duration: 1410,
        durationFormatted: '24m',
        thumbnail: cyberpunkBanner,
        videoUrl: '/anime/chrono-paradox/ep-01.mp4',
        subtitles: [
          { id: 'cp-sub-1', label: 'English', language: 'en', url: createSampleSubtitleDataUrl('English', 'Chrono Paradox - Ep 1'), default: true }
        ]
      }
    ]
  }
];

export const ALL_GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Cyberpunk',
  'Fantasy',
  'Adventure',
  'Slice of Life',
  'Romance',
  'Mecha',
  'Mystery',
  'Thriller',
  'Supernatural'
];

export function getActiveCatalog(): Anime[] {
  if (typeof window === 'undefined') return ANIME_CATALOG;
  try {
    const saved = localStorage.getItem('animehub_custom_anime_v1');
    if (saved) {
      const custom: Anime[] = JSON.parse(saved);
      if (custom.length > 0) {
        const customIds = new Set(custom.map(c => c.id));
        const filteredDefault = ANIME_CATALOG.filter(a => !customIds.has(a.id));
        return [...custom, ...filteredDefault];
      }
    }
  } catch {
    // Ignore error
  }
  return ANIME_CATALOG;
}

export function getAnimeById(id: string): Anime | undefined {
  const catalog = getActiveCatalog();
  return catalog.find(a => a.id === id || a.slug === id);
}

export function getFeaturedAnime(): Anime[] {
  return getActiveCatalog().filter(a => a.featured);
}

export function getTrendingAnime(): Anime[] {
  return getActiveCatalog().filter(a => a.trending);
}

export function getRecentlyAddedAnime(): Anime[] {
  return getActiveCatalog().filter(a => a.recentlyAdded);
}

export function getAnimeByGenre(genre: string): Anime[] {
  const catalog = getActiveCatalog();
  if (genre === 'All') return catalog;
  return catalog.filter(a => a.genres.includes(genre));
}
