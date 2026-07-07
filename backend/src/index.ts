import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import importRoute from './routes/importRoute';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://leadflow.mayankcodes.dev',
    /\.mayankcodes\.dev$/,
    /\.vercel\.app$/,
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'leadflow-backend' });
});

// Routes
app.use('/api/import', importRoute);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ LeadFlow backend running on http://localhost:${PORT}`);
  console.log(`   Gemini API key: ${process.env.GEMINI_API_KEY ? '✓ loaded' : '✗ missing!'}`);
});
