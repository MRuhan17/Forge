import { getDb } from '../db/database';
import { Activity, ActivityType } from '../types';
import crypto from 'crypto';

export const log = (message: string, type: ActivityType = 'system'): Activity => {
  const id = crypto.randomUUID();
  getDb().prepare(`
    INSERT INTO activities (id, type, message)
    VALUES (?, ?, ?)
  `).run(id, type, message);

  const row: any = getDb().prepare('SELECT * FROM activities WHERE id = ?').get(id);
  // Using COALESCE aliasing logic as earlier discussed to handle legacy dbs gracefully
  return { ...row, createdAt: row.createdAt || row.created_at } as Activity;
};

export const getRecentActivities = (limit: number = 100): Activity[] => {
  const rows = getDb().prepare('SELECT * FROM activities ORDER BY rowid DESC LIMIT ?').all(limit);
  return rows.map((r: any) => ({ ...r, createdAt: r.createdAt || r.created_at })) as Activity[];
};
