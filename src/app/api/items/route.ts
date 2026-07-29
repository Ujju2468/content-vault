import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category');

    let sql = `
      SELECT 
        i.*, 
        c.name as category_name, 
        c.color as category_color,
        GROUP_CONCAT(t.name) as tags
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN item_tags it ON i.id = it.item_id
      LEFT JOIN tags t ON it.tag_id = t.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (query) {
      sql += ` AND (i.title LIKE ? OR i.summary LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    if (categoryId) {
      sql += ` AND i.category_id = ?`;
      params.push(categoryId);
    }

    sql += ` GROUP BY i.id ORDER BY i.created_at DESC`;

    const items = db.prepare(sql).all(...params);

    const formattedItems = items.map((item: any) => ({
      ...item,
      tags: item.tags ? item.tags.split(',') : [],
      ai_processed: Boolean(item.ai_processed),
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}