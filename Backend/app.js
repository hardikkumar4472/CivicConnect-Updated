import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import sectorHeadRoutes from './routes/sectorHead.js';
import citizenRoutes from './routes/citizenRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from '../Backend/routes/adminRoutes.js';
import cors from 'cors';


dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use('/api/auth', authRoutes);
app.use('/api/sector-head', sectorHeadRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/issues', adminRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
