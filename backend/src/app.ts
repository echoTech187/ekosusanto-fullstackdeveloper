import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

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
