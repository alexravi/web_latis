import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Derive API origin for CSP
let apiOrigin = '';
try {
  if (process.env.VITE_API_BASE_URL) {
    apiOrigin = new URL(process.env.VITE_API_BASE_URL).origin;
  }
} catch (e) {
  console.warn('Invalid VITE_API_BASE_URL for CSP:', process.env.VITE_API_BASE_URL);
}

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Needed for Vite in dev
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", apiOrigin],
        fontSrc: ["'self'", 'data:'],
      },
    },
    crossOriginEmbedderPolicy: false, // May need to adjust based on your needs
  })
);

// Compression middleware (gzip/brotli)
app.use(compression());

// Rate limiting (basic)
let requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // requests per window
const CLEANUP_INTERVAL = 60 * 60 * 1000; // Clean up expired entries every hour

// Cleanup function to remove expired entries
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(ip);
    }
  }
}

// Periodic cleanup to prevent memory leaks
setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL);

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  const record = requestCounts.get(ip);

  // If the window has expired, remove the entry and create a new one
  if (now > record.resetTime) {
    requestCounts.delete(ip);
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  record.count++;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y', // Cache static assets for 1 year
  etag: true,
  lastModified: true,
}));

// Handle React routing, return all requests to React app
app.get('*', async (req, res) => {
  try {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    let html = await readFile(indexPath, 'utf-8');
    const envParams = { VITE_API_BASE_URL: process.env.VITE_API_BASE_URL };
    const script = `<script>window.__ENV__ = ${JSON.stringify(envParams)};</script>`;
    html = html.replace('</head>', `${script}</head>`);
    res.send(html);
  } catch (err) {
    console.error('Error reading index.html', err);
    res.status(500).send('Internal Server Error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
