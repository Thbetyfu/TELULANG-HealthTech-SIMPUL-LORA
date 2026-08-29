import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import stockRoutes from './routes/stock.routes';
import clusterRoutes from './routes/cluster.routes';
import satusehatRoutes from './routes/satusehat.routes';
import disputeRoutes from './routes/dispute.routes';
import loraRoutes from './routes/lora.routes';
import redistributionRoutes from './routes/redistribution.routes';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './middleware/error-handler.middleware';
import { WebSocketService } from './services/websocket.service';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://simpul-lora.vercel.app',
  process.env.CORS_ORIGIN
].filter(Boolean) as string[];

// Initialize WebSocket Manager
const wsService = WebSocketService.getInstance();
wsService.initialize(httpServer);

// Global Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin) || process.env.CORS_ORIGIN === '*') {
        callback(null, true);
        return;
      }
      // Demo-friendly default: allow unknown origins in non-production
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
        return;
      }
      callback(null, ALLOWED_ORIGINS.includes(origin));
    },
    credentials: true
  })
);
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stocks', stockRoutes);
app.use('/api/v1/analytics', clusterRoutes);
app.use('/api/v1/integration/satusehat', satusehatRoutes);
app.use('/api/v1/disputes', disputeRoutes);
app.use('/api/v1/lora', loraRoutes);
app.use('/api/v1/redistributions', redistributionRoutes);

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'SIMPUL Backend Middleware', timestamp: new Date() });
});

// Root API Landing Page
app.get('/', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>SIMPUL Backend API Server</title>
      <style>
        body { background-color: #000000; color: #ffffff; font-family: monospace; padding: 40px; margin: 0; }
        .card { background-color: #0a0a0a; border: 1px solid #333333; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto; }
        h1 { color: #ffffff; font-size: 20px; margin-top: 0; border-bottom: 1px solid #222; padding-bottom: 12px; }
        p { color: #888888; font-size: 13px; line-height: 1.6; }
        .badge { background: #001f10; color: #00df89; border: 1px solid rgba(0,223,137,0.3); padding: 4px 8px; border-radius: 4px; font-size: 11px; }
        .endpoint-list { background: #000; border: 1px solid #222; padding: 16px; border-radius: 6px; margin: 16px 0; }
        a { color: #50e3c2; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        .visual-preview { margin-top: 24px; border: 1px solid #333; border-radius: 6px; overflow: hidden; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>SIMPUL API Server Middleware <span class="badge">ONLINE (PORT 5000)</span></h1>
        <p>National Healthcare Supply Chain & Spatial Analytics Backend Gateway (Satria Data SEC_SD2026020000224).</p>
        
        <h3>Available API Endpoints:</h3>
        <div class="endpoint-list">
          <div><strong>Health Check:</strong> <a href="/health" target="_blank">/health</a></div>
          <div style="margin-top: 8px;"><strong>Auth Login:</strong> POST /api/v1/auth/login</div>
          <div style="margin-top: 8px;"><strong>OLS Spatial Metrics:</strong> <a href="/api/v1/analytics/ols-metrics" target="_blank">/api/v1/analytics/ols-metrics</a></div>
          <div style="margin-top: 8px;"><strong>Provinces (34):</strong> <a href="/api/v1/analytics/provinces" target="_blank">/api/v1/analytics/provinces</a></div>
          <div style="margin-top: 8px;"><strong>K-Means Profiles (k=3):</strong> <a href="/api/v1/analytics/profiles" target="_blank">/api/v1/analytics/profiles</a></div>
          <div style="margin-top: 8px;"><strong>Public Facilities Map:</strong> <a href="/api/v1/stocks/facilities" target="_blank">/api/v1/stocks/facilities</a></div>
          <div style="margin-top: 8px;"><strong>Redistribution Engine:</strong> <a href="/api/v1/redistributions" target="_blank">/api/v1/redistributions</a></div>
          <div style="margin-top: 8px;"><strong>Server-Side OLS SVG Chart:</strong> <a href="/api/v1/analytics/visuals/ols-chart.svg" target="_blank">/api/v1/analytics/visuals/ols-chart.svg</a></div>
        </div>

        <h3>Server-Side Rendered OLS Visual Preview:</h3>
        <div class="visual-preview">
          <img src="/api/v1/analytics/visuals/ols-chart.svg" alt="OLS Chart" style="width: 100%; display: block;" />
        </div>
      </div>
    </body>
    </html>
  `);
});

// Global Error Handler
app.use(globalErrorHandler);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`[SIMPUL Server & WebSockets]: Running on http://localhost:${PORT}`);
  });
}

export default app;
