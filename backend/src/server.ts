import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRouter from './routes/contact';
import projectsRouter from './routes/projects';
import visitorsRouter from './routes/visitors';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/visitors', visitorsRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});
