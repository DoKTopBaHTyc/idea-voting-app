import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import { getClientIp } from '../utils/ip';
import { castVote } from '../services/voteService';

export async function listIdeas(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = getClientIp(req);
    // Получаем идеи, отсортированные по голосам
    const ideas = await prisma.idea.findMany({ orderBy: { votes: 'desc' } });

    // Получаем все голоса этого IP, чтобы пометить, за какие идеи уже голосовали
    const votes = await prisma.vote.findMany({ where: { ip } });
    const votedSet = new Set(votes.map(v => v.ideaId));

    // Формируем ответ: idea + флаг voted
    const payload = ideas.map(i => ({
      id: i.id,
      title: i.title,
      description: i.description,
      votes: i.votes,
      createdAt: i.createdAt,
      voted: votedSet.has(i.id)
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function voteIdea(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = getClientIp(req);
    const ideaId = Number(req.params.id);
    if (Number.isNaN(ideaId)) {
      return res.status(400).json({ error: 'Invalid idea id' });
    }
    await castVote(ideaId, ip);
    // Возвращаем 201 Created
    res.status(201).json({ success: true });
  } catch (err: any) {
    // если сервис выбросил объект с полем status — используем его
    if (err && err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}
