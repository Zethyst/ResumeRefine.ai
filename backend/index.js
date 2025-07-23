import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', resumeRoutes);

app.listen(PORT, () => {
  console.log(`[+] Server running on http://localhost:${PORT}`);
});
