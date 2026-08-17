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
import { globalErrorHandler } from './middleware/error-handler.middleware';
import { WebSocketService } from './services/websocket.service';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize WebSocket Manager
const wsService = WebSocketService.getInstance();
wsService.initialize(httpServer);

// Global Middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173', 'https://simpul.kemkes.go.id'] }));
app.use(express.json());

// API Routes
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

// Global Error Handler
app.use(globalErrorHandler);

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`[SIMPUL Server & WebSockets]: Running on http://localhost:${PORT}`);
  });
}

export default app;
