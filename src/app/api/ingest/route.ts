// import { NextResponse } from 'next/server';
// import { scrapeMetadata } from '@/lib/scraper';
// import { analyzeContent } from '@/lib/ai';
// import { connectDB, ItemModel } from '@/lib/db';

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const { url, title: rawTitle, text } = await req.json();

//     let title = rawTitle;
//     let description = text || '';
//     let thumbnailUrl: string | null = null;
//     let type: 'link' | 'short_video' | 'doc' = 'link';

//     if (url) {
//       const scraped = await scrapeMetadata(url);
//       title = title || scraped.title;
//       description = description || scraped.description;
//       thumbnailUrl = scraped.thumbnailUrl;
//       type = scraped.type;
//     }

//     const aiResult = await analyzeContent(title, description, url);

//     const newItem = await ItemModel.create({
//       type,
//       url: url || null,
//       title: title || 'Saved Link',
//       summary: aiResult.summary || description || title,
//       thumbnail_url: thumbnailUrl,
//       category_name: aiResult.categoryId === 'cat-1' ? 'Tech & Code' : 'General',
//       category_color: '#3b82f6',
//       tags: aiResult.tags,
//     });

//     return NextResponse.json({ success: true, itemId: newItem._id });
//   } catch (error: any) {
//     console.error('Ingest API Error:', error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { scrapeMetadata } from '@/lib/scraper';
import { analyzeContent } from '@/lib/ai';
import { connectDB, ItemModel, CategoryModel } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await connectDB();
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

    // Look up category color or fall back to default
    const matchedCategory = await CategoryModel.findOne({ name: aiResult.categoryId }).lean();
    const categoryName = matchedCategory ? matchedCategory.name : 'General';
    const categoryColor = matchedCategory ? matchedCategory.color : '#6b7280';

    const newItem = await ItemModel.create({
      type,
      url: url || null,
      title: title || 'Saved Link',
      summary: aiResult.summary || description || title,
      thumbnail_url: thumbnailUrl,
      category_name: categoryName,
      category_color: categoryColor,
      tags: aiResult.tags,
    });

    return NextResponse.json({ success: true, itemId: newItem._id });
  } catch (error: any) {
    console.error('Ingest API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}