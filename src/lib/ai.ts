// // import { generateText } from 'ai';
// // import { openai } from '@ai-sdk/openai';
// // import db from './db';

// // export interface AIAnalysisResult {
// //   categoryId: string;
// //   summary: string;
// //   tags: string[];
// // }

// // export async function analyzeContent(title: string, description: string, url?: string): Promise<AIAnalysisResult> {
// //   const categories = db.prepare('SELECT id, name FROM categories').all() as { id: string; name: string }[];
// //   const categoryList = categories.map((c) => `ID: "${c.id}" -> Name: "${c.name}"`).join('\n');

// //   if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here') {
// //     const defaultCat = categories.find((c) => c.name.includes('General')) || categories[0];
// //     return {
// //       categoryId: defaultCat?.id || 'cat-5',
// //       summary: description || title,
// //       tags: ['uncategorized'],
// //     };
// //   }

// //   try {
// //     const prompt = `Analyze this saved content and categorize it.
// // Title: ${title}
// // Description: ${description}
// // URL: ${url || 'N/A'}

// // Available Categories:
// // ${categoryList}

// // Return JSON with format:
// // {
// //   "categoryId": "exact matching ID from list",
// //   "summary": "1-2 sentence quick summary",
// //   "tags": ["tag1", "tag2"]
// // }`;

// //     const { text } = await generateText({
// //       model: openai('gpt-4o-mini'),
// //       prompt,
// //     });

// //     const parsed = JSON.parse(text);
// //     return {
// //       categoryId: parsed.categoryId || categories[0].id,
// //       summary: parsed.summary || title,
// //       tags: Array.isArray(parsed.tags) ? parsed.tags : [],
// //     };
// //   } catch {
// //     return {
// //       categoryId: categories[0]?.id || 'cat-5',
// //       summary: description || title,
// //       tags: ['auto-saved'],
// //     };
// //   }
// // }

// import { generateText } from 'ai';
// import { openai } from '@ai-sdk/openai';
// import { connectDB, CategoryModel } from './db';

// export interface AIAnalysisResult {
//   categoryId: string;
//   summary: string;
//   tags: string[];
// }

// export async function analyzeContent(title: string, description: string, url?: string): Promise<AIAnalysisResult> {
//   await connectDB();
//   const categories = await CategoryModel.find().lean();
  
//   const categoryList = categories.map((c: any) => `Name: "${c.name}"`).join('\n');

//   if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'none' || process.env.OPENAI_API_KEY === 'your-api-key-here') {
//     return {
//       categoryId: 'General',
//       summary: description || title,
//       tags: ['saved-link'],
//     };
//   }

//   try {
//     const prompt = `Analyze this saved content and categorize it.
// Title: ${title}
// Description: ${description}
// URL: ${url || 'N/A'}

// Available Categories:
// ${categoryList}

// Return JSON with format:
// {
//   "categoryName": "exact matching name from list",
//   "summary": "1-2 sentence quick summary",
//   "tags": ["tag1", "tag2"]
// }`;

//     const { text } = await generateText({
//       model: openai('gpt-4o-mini'),
//       prompt,
//     });

//     const parsed = JSON.parse(text);
//     return {
//       categoryId: parsed.categoryName || 'General',
//       summary: parsed.summary || title,
//       tags: Array.isArray(parsed.tags) ? parsed.tags : [],
//     };
//   } catch {
//     return {
//       categoryId: 'General',
//       summary: description || title,
//       tags: ['saved-link'],
//     };
//   }
// }

//v2 code for this new version
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { connectDB, CategoryModel } from './db';

export interface AIAnalysisResult {
  categoryId: string;
  summary: string;
  tags: string[];
}

export async function analyzeContent(title: string, description: string, url?: string): Promise<AIAnalysisResult> {
  await connectDB();
  const categories = await CategoryModel.find().lean();
  const categoryNames = categories.map((c: any) => c.name);

  // Quick heuristic keyword classifier for instant/offline response
  const detectCategory = (text: string) => {
    const lower = text.toLowerCase();
    if (/recipe|food|cook|bake|dish|meal/i.test(lower)) return 'Recipes & Food';
    if (/code|tech|dev|js|python|react|github|ai|software/i.test(lower)) return 'Tech & Code';
    if (/reel|short|tiktok|video|watch|youtube/i.test(lower)) return 'Reels & Shorts';
    if (/article|doc|paper|guide|news|blog|pdf/i.test(lower)) return 'Articles & Docs';
    return 'General';
  };

  const autoCategory = detectCategory(`${title} ${description}`);

  // Fallback if no valid OpenAI API Key is present
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'none' || process.env.OPENAI_API_KEY === 'your-api-key-here') {
    const keywords = `${title} ${description}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter((w) => w.length > 4)
      .slice(0, 3);

    return {
      categoryId: autoCategory,
      summary: description ? (description.length > 140 ? description.substring(0, 140) + '...' : description) : `Saved entry: ${title}`,
      tags: keywords.length > 0 ? keywords : ['saved-v2'],
    };
  }

  try {
    const prompt = `Analyze this saved bookmark and output JSON only.
Title: ${title}
Description: ${description}
URL: ${url || 'N/A'}
Allowed Categories: ${categoryNames.join(', ')}

Respond ONLY in JSON format:
{
  "categoryName": "matching category name",
  "summary": "Concise 1-sentence summary",
  "tags": ["tag1", "tag2"]
}`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    });

    const parsed = JSON.parse(text);
    return {
      categoryId: categoryNames.includes(parsed.categoryName) ? parsed.categoryName : autoCategory,
      summary: parsed.summary || title,
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['v2-vault'],
    };
  } catch {
    return {
      categoryId: autoCategory,
      summary: description || title,
      tags: ['saved-v2'],
    };
  }
}
