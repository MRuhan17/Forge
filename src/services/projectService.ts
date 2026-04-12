import { getDb } from '../db/database';
import { Project } from '../types';
import crypto from 'crypto';

export const getProjects = (): Project[] => {
  const rows = getDb().prepare('SELECT * FROM projects ORDER BY rowid DESC').all();
  return rows.map((r: any) => ({ ...r, createdAt: r.createdAt || r.created_at })) as Project[];
};

export const createProject = (name: string): Project => {
  const id = crypto.randomUUID();
  // Safe generic path handling for demo
  const projectPath = `/home/user/workspace/${name.replace(/\s+/g, '-').toLowerCase()}`;
  
  getDb().prepare(`
    INSERT INTO projects (id, name, path)
    VALUES (?, ?, ?)
  `).run(id, name, projectPath);

  const row: any = getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id);
  return { ...row, createdAt: row.createdAt || row.created_at } as Project;
};

export const deleteProject = (id: string): void => {
  getDb().prepare('DELETE FROM projects WHERE id = ?').run(id);
};
