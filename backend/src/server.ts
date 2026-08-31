import app from './app';
import { PORT } from './config/env';

app.listen(PORT, () => {
  console.log(`🚀 E-Loker Backend Server active and running on http://localhost:${PORT}`);
  console.log(`📋 API Health Check available at http://localhost:${PORT}/api/health`);
});
