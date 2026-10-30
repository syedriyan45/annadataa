import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import rentalsRoutes from './routes/rentals.js';
import aiDoctorRoutes from './routes/aiDoctor.js';
import bhoomiRoutes from './routes/bhoomi.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/ai-doctor', aiDoctorRoutes);
app.use('/api/bhoomi', bhoomiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ANNADAATA Smart Farming Backend API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ANNADATA BACKEND] Server running on http://localhost:${PORT}`);
});

export default app;
