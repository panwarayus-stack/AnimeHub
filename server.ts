import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const DOWNLOAD_DIR = '/app/applet/downloads';
const STATUS_FILE = path.join(DOWNLOAD_DIR, 'download_status.json');
const CATALOG_DB_PATH = path.join(__dirname, 'src', 'data', 'anime-db.json');

// Ensure download directories exist
fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

// Ensure anime-db.json exists, copy from template if not
if (!fs.existsSync(CATALOG_DB_PATH)) {
  const defaultCatalog = [
    {
      id: 'solo-leveling-s01',
      slug: 'solo-leveling-season-1',
      title: 'Solo Leveling (Season 1)',
      japaneseTitle: '俺だけレベルアップな件 (나 혼자만 레벨업)',
      synopsis: 'Known as the "Weakest Hunter of All Mankind", Sung Jinwoo is brutally slaughtered in a double dungeon. Miraculously surviving, he awakens to a mysterious game-like "System" quest window only visible to him, granting him the unique ability to level up.',
      bannerImage: '/src/assets/images/solo_leveling_banner_1790860864866.jpg',
      posterImage: '/src/assets/images/solo_leveling_poster_1790860845767.jpg',
      genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
      status: 'Completed',
      releaseYear: 2024,
      season: 'Season 1',
      rating: 'TV-MA',
      score: 9.4,
      studio: 'A-1 Pictures',
      audioInfo: 'Multi Audio (Japanese, English, Hindi)',
      subtitleInfo: 'English (ESub), Spanish, French',
      totalEpisodes: 12,
      featured: true,
      trending: true,
      recentlyAdded: true,
      episodes: Array.from({ length: 12 }, (_, i) => {
        const num = i + 1;
        const pad = String(num).padStart(2, '0');
        const filename = `[Toonworld4all] Solo Leveling S01E${pad} 1080p HEVC 10bit WEB-DL Multi Audio ESub.mp4`;
        return {
          id: `sl-s1-ep${pad}`,
          number: num,
          title: `Episode ${num}`,
          synopsis: `Sung Jinwoo fights to survive, level up and unlock the power of the Shadow Monarch in Season 1, Episode ${num}.`,
          duration: 1440,
          durationFormatted: '24m',
          thumbnail: '/src/assets/images/solo_leveling_banner_1790860864866.jpg',
          videoUrl: `/anime/Aura Leveling/Season-1/${filename}`,
          videoPath: `anime/Aura Leveling/Season-1/${filename}`,
          subtitles: [
            { id: `sub-sl1-${num}`, label: 'English (ESub)', language: 'en', url: '', default: true }
          ],
          audioTracks: [
            { id: `aud-sl1-${num}`, label: 'Multi Audio (JP / EN / HI)', language: 'multi', url: '', default: true }
          ]
        };
      })
    },
    {
      id: 'solo-leveling-s02',
      slug: 'solo-leveling-season-2',
      title: 'Solo Leveling Season 2: Arise from the Shadow',
      japaneseTitle: '俺だけレベルアップな件 (Season 2)',
      synopsis: 'Now commanding an army of loyal shadow soldiers extracted from the souls of fallen enemies, Sung Jinwoo prepares for high-rank Red Gate incursions and the perilous Jeju Island raid.',
      bannerImage: '/src/assets/images/solo_leveling_banner_1790860864866.jpg',
      posterImage: '/src/assets/images/solo_leveling_poster_1790860845767.jpg',
      genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
      status: 'Ongoing',
      releaseYear: 2025,
      season: 'Season 2',
      rating: 'TV-MA',
      score: 9.5,
      studio: 'A-1 Pictures',
      audioInfo: 'Multi Audio (Japanese, English, Hindi)',
      subtitleInfo: 'English (ESub), Spanish, French',
      totalEpisodes: 12,
      featured: true,
      trending: true,
      recentlyAdded: true,
      episodes: Array.from({ length: 12 }, (_, i) => {
        const num = i + 1;
        const pad = String(num).padStart(2, '0');
        const filename = `[Toonworld4all] Solo Leveling S02E${pad} 1080p x265 10bit WEB-DL Multi Audio ESub.mp4`;
        return {
          id: `sl-s2-ep${pad}`,
          number: num,
          title: `Episode ${num}`,
          synopsis: `The hunter ascends further as Monarchs gather. Season 2 Episode ${num}.`,
          duration: 1440,
          durationFormatted: '24m',
          thumbnail: '/src/assets/images/solo_leveling_banner_1790860864866.jpg',
          videoUrl: `/anime/Aura Leveling/Season-2/${filename}`,
          videoPath: `anime/Aura Leveling/Season-2/${filename}`,
          subtitles: [
            { id: `sub-sl2-${num}`, label: 'English (ESub)', language: 'en', url: '', default: true }
          ]
        };
      })
    }
  ];
  fs.mkdirSync(path.dirname(CATALOG_DB_PATH), { recursive: true });
  fs.writeFileSync(CATALOG_DB_PATH, JSON.stringify(defaultCatalog, null, 2), 'utf-8');
}

// Serve actual anime and asset files directly
app.use('/.anime', express.static(path.join(__dirname, 'public', '.anime'), { dotfiles: 'allow' }));
app.use('/anime', express.static(path.join(__dirname, 'public', 'anime'), { dotfiles: 'allow' }));
app.use('/thumbnails', express.static(path.join(__dirname, 'public', 'thumbnails')));
app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'allow' }));

// API: Get Download Status
app.get('/api/download-status', (req, res) => {
  if (fs.existsSync(STATUS_FILE)) {
    try {
      const data = fs.readFileSync(STATUS_FILE, 'utf-8');
      return res.json(JSON.parse(data));
    } catch {
      return res.json({ stage: 'idle', message: 'Ready' });
    }
  }
  return res.json({ stage: 'idle', message: 'Ready' });
});

// API: Trigger Google Drive Download
app.post('/api/download-drive', (req, res) => {
  const { fileId } = req.body;
  if (!fileId) {
    return res.status(400).json({ error: 'fileId is required' });
  }

  // Update script file_id if custom
  const scriptPath = path.join(__dirname, 'scripts', 'download_drive_zip.py');
  if (fs.existsSync(scriptPath)) {
    let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
    scriptContent = scriptContent.replace(/FILE_ID = "[a-zA-Z0-9_-]+"/, `FILE_ID = "${fileId}"`);
    fs.writeFileSync(scriptPath, scriptContent, 'utf-8');
  }

  // Spawn download process
  const child = spawn('python3', [scriptPath], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  return res.json({ success: true, message: 'Download started in background' });
});

// API: Get Catalog DB
app.get('/api/catalog', (req, res) => {
  if (fs.existsSync(CATALOG_DB_PATH)) {
    const data = fs.readFileSync(CATALOG_DB_PATH, 'utf-8');
    return res.json(JSON.parse(data));
  }
  return res.json([]);
});

// API: Update Catalog DB
app.post('/api/catalog', (req, res) => {
  const { catalog } = req.body;
  if (!catalog || !Array.isArray(catalog)) {
    return res.status(400).json({ error: 'catalog array is required' });
  }

  try {
    fs.writeFileSync(CATALOG_DB_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Catalog updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Configure Vite integration for rich SPA frontend delivery
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  
  app.use(vite.middlewares);
  
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
