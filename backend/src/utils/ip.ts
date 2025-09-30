import { Request } from 'express';

export function getClientIp(req: Request): string {
  // Express позволяет включить trust proxy, тогда req.ip автоматически берёт X-Forwarded-For.
  // Мы комбинируем: сначала смотрим заголовок, затем req.ip, затем socket.
  const xff = (req.headers['x-forwarded-for'] || '') as string;
  if (xff) {
    // X-Forwarded-For обычно: client, proxy1, proxy2
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length) return parts[0];
  }
  if (req.ip) return req.ip;
  // fallback
  // @ts-ignore
  if (req.socket && req.socket.remoteAddress) return req.socket.remoteAddress;
  return 'unknown';
}
