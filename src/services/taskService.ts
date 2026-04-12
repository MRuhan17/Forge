import { getDb } from '../db/database';
import { Task } from '../types';
import crypto from 'crypto';

export const getTasks = (): Task[] => {
  return getDb().prepare('SELECT * FROM tasks').all() as Task[];
};

export const createTask = (name: string): Task => {
  const id = crypto.randomUUID();
  
  getDb().prepare(`
    INSERT INTO tasks (id, name, status)
    VALUES (?, ?, 'pending')
  `).run(id, name);

  return getDb().prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task;
};

export const deleteTask = (id: string): void => {
  getDb().prepare('DELETE FROM tasks WHERE id = ?').run(id);
};
