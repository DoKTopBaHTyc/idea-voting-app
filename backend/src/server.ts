import app from './app';
import prisma from './db/prisma';

const port = Number(process.env.PORT || 4000);

async function start() {
  // optional: проверяем соединение с БД при старте
  try {
    await prisma.$connect();
    console.log('Connected to DB');
  } catch (e) {
    console.error('DB connection failed', e);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log('Server listening on port', port);
  });
}

start();
