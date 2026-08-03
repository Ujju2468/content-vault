// import { generateText } from 'ai';
// import { openai } from '@ai-sdk/openai';
// import db from './db';

// export interface AIAnalysisResult {
//   categoryId: string;
//   summary: string;
//   tags: string[];
// }

// export async function analyzeContent(title: string, description: string, url?: string): Promise<AIAnalysisResult> {
//   const categories = db.prepare('SELECT id, name FROM categories').all() as { id: string; name: string }[];
//   const categoryList = categories.map((c) => `ID: "${c.id}" -> Name: "${c.name}"`).join('\n');

//   if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here') {
//     const defaultCat = categories.find((c) => c.name.includes('General')) || categories[0];
//     return {
//       categoryId: defaultCat?.id || 'cat-5',
//       summary: description || title,
//       tags: ['uncategorized'],
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
//   "categoryId": "exact matching ID from list",
//   "summary": "1-2 sentence quick summary",
//   "tags": ["tag1", "tag2"]
// }`;

//     const { text } = await generateText({
//       model: openai('gpt-4o-mini'),
//       prompt,
//     });

//     const parsed = JSON.parse(text);
//     return {
//       categoryId: parsed.categoryId || categories[0].id,
//       summary: parsed.summary || title,
//       tags: Array.isArray(parsed.tags) ? parsed.tags : [],
//     };
//   } catch {
//     return {
//       categoryId: categories[0]?.id || 'cat-5',
//       summary: description || title,
//       tags: ['auto-saved'],
//     };
//   }
// }

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
  
  const categoryList = categories.map((c: any) => `Name: "${c.name}"`).join('\n');

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'none' || process.env.OPENAI_API_KEY === 'your-api-key-here') {
    return {
      categoryId: 'General',
      summary: description || title,
      tags: ['saved-link'],
    };
  }

  try {
    const prompt = `Analyze this saved content and categorize it.
Title: ${title}
Description: ${description}
URL: ${url || 'N/A'}

Available Categories:
${categoryList}

Return JSON with format:
{
  "categoryName": "exact matching name from list",
  "summary": "1-2 sentence quick summary",
  "tags": ["tag1", "tag2"]
}`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    });

    const parsed = JSON.parse(text);
    return {
      categoryId: parsed.categoryName || 'General',
      summary: parsed.summary || title,
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch {
    return {
      categoryId: 'General',
      summary: description || title,
      tags: ['saved-link'],
    };
  }
}