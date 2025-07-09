const express = require('express');
const cors = require('cors');

const winston = require('winston');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;

// IMPORTANT: Replace with your actual TMDb API key
const TMDB_API_KEY = '7ff7c360f0c27335e0c308e54c7d16a8';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/server.log' })
  ]
});

app.use(cors());
app.use(express.json()); // Enable JSON body parsing

const TorrentSearchApi = require('torrent-search-api');

TorrentSearchApi.enableProvider('Yts');
TorrentSearchApi.enableProvider('1337x');
TorrentSearchApi.enableProvider('Nyaa');
TorrentSearchApi.enableProvider('TorrentGalaxy');
TorrentSearchApi.enableProvider('ThePirateBay');
TorrentSearchApi.enableProvider('FitGirlRepacks');
TorrentSearchApi.enableProvider('SkidrowReloaded');
TorrentSearchApi.enableProvider('Eztv');
TorrentSearchApi.enableProvider('LimeTorrents');
TorrentSearchApi.enableProvider('Igggames');
TorrentSearchApi.enableProvider('Tamilrockers');
TorrentSearchApi.enableProvider('Torlock');
TorrentSearchApi.enableProvider('Kinozal');
TorrentSearchApi.enableProvider('Rarbg');
TorrentSearchApi.enableProvider('Torrentz2');
TorrentSearchApi.enableProvider('TorrentsMe');
TorrentSearchApi.enableProvider('Pirateiro');
TorrentSearchApi.enableProvider('AWAFilm');
TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('DivxTotal');

// In-memory store for ongoing downloads
const ongoingDownloads = {};

// Helper to extract common video qualities
function extractQuality(text) {
  if (!text) return 'Download';
  text = text.toLowerCase();
  if (text.includes('2160p') || text.includes('4k')) return '4K';
  if (text.includes('1080p')) return '1080p';
  if (text.includes('720p')) return '720p';
  if (text.includes('480p')) return '480p';
  return 'Download';
}

// Web scraping fallback function
async function scrapeMagnetLinks(movieTitle) {
  logger.info(`Searching for torrents for ${movieTitle}`);
  try {
    const torrents = await TorrentSearchApi.search(movieTitle, 'Movies', 20);
    const sources = torrents.map(torrent => ({
      quality: extractQuality(torrent.title),
      magnet: torrent.magnet,
    }));
    logger.info(`Found ${sources.length} sources for ${movieTitle}.`);
    return sources;
  } catch (error) {
    logger.error(`Error searching for torrents for ${movieTitle}: ${error.message}`);
    return [];
  }
}

app.get('/api/recent-movies', async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${String(today.getDate()).padStart(2, '0')}`;

    logger.info(`Fetching recent movies from TMDb for current month: ${startDate} to ${endDate}`);
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        sort_by: 'primary_release_date.desc',
        'primary_release_date.gte': startDate,
        'primary_release_date.lte': endDate,
        page: 1
      }
    });
    logger.info(`TMDb API returned ${response.data.results.length} movies.`);
    res.json(response.data.results);
  } catch (error) {
    logger.error('Error fetching recent movies from TMDb:', error.message);
    res.status(500).json({ message: 'Error fetching recent movies', error: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        language: 'en-US',
        page: 1
      }
      
    });
    res.json(response.data.results);
  } catch (error) {
    logger.error('Error searching movies on TMDb:', error.message);
    res.status(500).json({ message: 'Error searching movies', error: error.message });
  }
});

app.get('/api/sources/:movieId', async (req, res) => {
  const movieId = req.params.movieId;
  let movieTitle = '';

  try {
    const movieDetailsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
      }
    });
    movieTitle = movieDetailsResponse.data.title;
  } catch (error) {
    logger.error(`Error fetching movie title for ID ${movieId}: ${error.message}`);
    return res.status(500).json({ message: 'Error fetching movie title' });
  }

  if (!movieTitle) {
    return res.status(404).json({ message: 'Movie title not found.' });
  }

  let sources = await scrapeMagnetLinks(movieTitle);

  res.json(sources);
});

// Simulated download endpoint
app.post('/api/download', (req, res) => {
  const { magnetLink, movieTitle, quality } = req.body;
  if (!magnetLink || !movieTitle || !quality) {
    return res.status(400).json({ message: 'Missing magnetLink, movieTitle, or quality' });
  }

  const downloadId = `${movieTitle}-${quality}`;
  const watchDir = path.join(__dirname, '..', 'watch');
  if (!fs.existsSync(watchDir)) {
    fs.mkdirSync(watchDir);
  }

  const fileName = `${movieTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.mp4`;
  const filePath = path.join(watchDir, fileName);

  // Initialize download status
  ongoingDownloads[downloadId] = {
    movieTitle,
    quality,
    progress: 0,
    status: 'downloading',
    filePath: `/watch/${fileName}`
  };
  logger.info(`Starting simulated download for ${movieTitle} (${quality}).`);

  // Simulate progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progress <= 100) {
      ongoingDownloads[downloadId].progress = progress;
      // Simulate writing to file
      fs.appendFile(filePath, 'simulated data ', (err) => {
        if (err) logger.error(`Error writing simulated data for ${movieTitle}: ${err.message}`);
      });
    } else {
      clearInterval(interval);
      ongoingDownloads[downloadId].status = 'completed';
      logger.info(`Simulated download complete for ${movieTitle} (${quality}). File: ${filePath}`);
      // Remove from ongoingDownloads after a short delay to allow frontend to fetch final status
      setTimeout(() => {
        delete ongoingDownloads[downloadId];
      }, 5000); 
    }
  }, 1000);

  res.json({ message: 'Download initiated', downloadId });
});

// Endpoint to list downloaded and ongoing movies
app.get('/api/downloaded-movies', (req, res) => {
  const watchDir = path.join(__dirname, '..', 'watch');
  const completedMovies = [];

  if (fs.existsSync(watchDir)) {
    const files = fs.readdirSync(watchDir);
    files.forEach(file => {
      if (file.endsWith('.mp4')) {
        completedMovies.push({
          name: file,
          path: `/watch/${file}`,
          status: 'completed',
          progress: 100
        });
      }
    });
  }

  const downloadingMovies = Object.values(ongoingDownloads);

  res.json({
    downloading: downloadingMovies,
    completed: completedMovies
  });
});

app.listen(port, () => {
  logger.info(`Backend server listening at http://localhost:${port}`);
});
