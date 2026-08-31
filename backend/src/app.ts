import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'E-Loker REST API',
    status: 'ACTIVE',
    message: '🚀 E-Loker Backend REST API Service is live and running!',
    endpoints: {
      healthCheck: '/api/health',
      jobs: '/api/jobs',
      auth: '/api/auth',
      applications: '/api/applications'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'E-Loker Job Application Management API Service running smoothly.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// Centralized Error Middleware
app.use(errorHandler);

export default app;
