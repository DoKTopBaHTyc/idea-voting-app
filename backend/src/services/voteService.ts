import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

export async function castVote(ideaId: number, ip: string) {
  // Транзакция: блокируем строку ip в таблице IpLock, считаем кол-во голосов, проверяем лимит,
  // вставляем голос (уникальность контролируется уникальным индексом), инкрементируем счётчик ideas.votes
  return prisma.$transaction(async (tx) => {
    // Проверим существование идеи
    const idea = await tx.idea.findUnique({ where: { id: ideaId }});
    if (!idea) {
      const err: any = new Error('Idea not found');
      err.status = 404;
      throw err;
    }

    // upsert (вставим ip в таблицу IpLock, если ещё нет)
    await tx.$executeRaw`INSERT INTO "IpLock" ("ip") VALUES (${ip}) ON CONFLICT ("ip") DO NOTHING`;

    // Захватываем строку блокировки для этого ip (FOR UPDATE)
    await tx.$queryRaw`SELECT "ip" FROM "IpLock" WHERE "ip" = ${ip} FOR UPDATE`;

    // Считаем сколько разных идей этот IP уже проголосовал
    const countResult: any = await tx.$queryRaw`SELECT COUNT(*)::int AS count FROM "Vote" WHERE "ip" = ${ip}`;
    const currentCount = Number(countResult?.[0]?.count ?? 0);

    if (currentCount >= 10) {
      const err: any = new Error('Vote limit exceeded for this IP');
      err.status = 409;
      throw err;
    }

    try {
      // Попытка создать голос. Если уже голосовали за эту идею — сработает уникальный индекс
      await tx.vote.create({ data: { ideaId, ip } });
    } catch (e: any) {
      // Prisma unique constraint error code P2002
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        const err: any = new Error('Already voted for this idea');
        err.status = 409;
        throw err;
      }
      throw e;
    }

    // Обновляем кэшированный счётчик голосов
    await tx.idea.update({
      where: { id: ideaId },
      data: { votes: { increment: 1 } }
    });

    return { success: true };
  });
}
