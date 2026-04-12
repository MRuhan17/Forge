import { getDb } from '../db/database';
import { Experiment } from '../types';
import crypto from 'crypto';

export const getExperiments = (): Experiment[] => {
  const rows = getDb().prepare('SELECT * FROM experiments ORDER BY rowid DESC').all();
  return rows.map((r: any) => ({ ...r, createdAt: r.createdAt || r.created_at })) as Experiment[];
};

export const getExperimentsByProject = (projectId: string): Experiment[] => {
  const rows = getDb().prepare('SELECT * FROM experiments WHERE projectId = ? ORDER BY rowid DESC').all(projectId);
  return rows.map((r: any) => ({ ...r, createdAt: r.createdAt || r.created_at })) as Experiment[];
};

export const createExperiment = (projectId: string, name: string): Experiment => {
  const id = crypto.randomUUID();
  
  getDb().prepare(`
    INSERT INTO experiments (id, projectId, name)
    VALUES (?, ?, ?)
  `).run(id, projectId, name);

  const row: any = getDb().prepare('SELECT * FROM experiments WHERE id = ?').get(id);
  return { ...row, createdAt: row.createdAt || row.created_at } as Experiment;
};

export const deleteExperiment = (id: string): void => {
  getDb().prepare('DELETE FROM experiments WHERE id = ?').run(id);
};
