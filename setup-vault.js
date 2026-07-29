const fs = require('fs');
const path = require('path');

const files = {
  '.env.local': `OPENAI_API_KEY="your-api-key-here"\nDATABASE_PATH="./content_vault.db"`,
  
  'src/types/index.ts': `export type ItemType = 'link' | 'short_video' | 'doc';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  user_id: string;
  category_id: string | null;
  type: ItemType;
  url?: string | null;
  title: string;
  summary?: string | null;
  local_path?: string | null;
  thumbnail_url?: string | null;
  ai_processed: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_color?: string;
  tags?: string[];
}`,

  'src/lib/db.ts': `import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'content_vault.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

export function initDB() {
  db.exec(\`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT DEFAULT '#6366f1',
      icon TEXT DEFAULT 'folder',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'default_user',
      category_id TEXT,
      type TEXT CHECK(type IN ('link', 'short_video', 'doc')) NOT NULL,
      url TEXT,
      title TEXT NOT NULL,
      summary TEXT,
      local_path TEXT,
      thumbnail_url TEXT,
      ai_processed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS item_tags (
      item_id TEXT,
      tag_id TEXT,
      PRIMARY KEY (item_id, tag_id),
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  \`);

  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare('INSERT INTO categories (id, name, color, icon) VALUES (?, ?, ?, ?)');
    insertCategory.run('cat-1', 'Tech & Code', '#3b82f6', 'code');
    insertCategory.run('cat-2', 'Reels & Shorts', '#ec4899', 'video');
    insertCategory.run('cat-3', 'Recipes & Food', '#f59e0b', 'utensils');
    insertCategory.run('cat-4', 'Articles & Docs', '#10b981', 'file-text');
    insertCategory.run('cat-5', 'General', '#6b7280', 'box');
  }
}

initDB();
export default db;`
};

for (const [filePath, content] of Object.entries(files)) {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim(), 'utf8');
  console.log(`Created: ${filePath}`);
}

console.log('\nSuccess! Project setup files created.');