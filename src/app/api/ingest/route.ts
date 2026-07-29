import { NextResponse } from 'next/server';
import { scrapeMetadata } from '@/lib/scraper';
import { analyzeContent } from '@/lib/ai';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { url, title: rawTitle, text } = await req.json();

    let title = rawTitle;
    let description = text || '';
    let thumbnailUrl: string | null = null;
    let type: 'link' | 'short_video' | 'doc' = 'link';

    if (url) {
      const scraped = await scrapeMetadata(url);
      title = title || scraped.title;
      description = description || scraped.description;
      thumbnailUrl = scraped.thumbnailUrl;
      type = scraped.type;
    }

    const aiResult = await analyzeContent(title, description, url);
    const itemId = `item_${Date.now()}`;

    const insertItem = db.prepare(`
      INSERT INTO items (id, category_id, type, url, title, summary, thumbnail_url, ai_processed)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertItem.run(
      itemId,
      aiResult.categoryId,
      type,
      url || null,
      title,
      aiResult.summary,
      thumbnailUrl
    );

    // Insert Tags
    for (const tagName of aiResult.tags) {
      const tagId = `tag_${tagName.toLowerCase().replace(/\s+/g, '_')}`;
      db.prepare('INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)').run(tagId, tagName);
      db.prepare('INSERT OR IGNORE INTO item_tags (item_id, tag_id) VALUES (?, ?)').run(itemId, tagId);
    }

    return NextResponse.json({ success: true, itemId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}