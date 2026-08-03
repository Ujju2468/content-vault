import { NextResponse } from 'next/server';
import { connectDB, CategoryModel } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    // Seed default categories if none exist in MongoDB yet
    const count = await CategoryModel.countDocuments();
    if (count === 0) {
      await CategoryModel.insertMany([
        { name: 'Tech & Code', color: '#3b82f6', icon: 'code' },
        { name: 'Reels & Shorts', color: '#ec4899', icon: 'video' },
        { name: 'Recipes & Food', color: '#f59e0b', icon: 'utensils' },
        { name: 'Articles & Docs', color: '#10b981', icon: 'file-text' },
        { name: 'General', color: '#6b7280', icon: 'box' },
      ]);
    }

    const rawCategories = await CategoryModel.find().lean();
    
    // Format _id as id string for frontend compatibility
    const categories = rawCategories.map((cat: any) => ({
      id: cat._id.toString(),
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
    }));

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}