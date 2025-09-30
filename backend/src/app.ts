import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import ideasRouter from './routes/ideas';

const app = express();

// ВАЖНО: если приложение будет за reverse-proxy (nginx), включаем trust proxy,
// чтобы express корректно разбирал req.ip из X-Forwarded-For
app.set('trust proxy', true);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// API маршруты
app.use('/api/ideas', ideasRouter);

// Ошибки — централизованная обработка
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
});

export default app;
