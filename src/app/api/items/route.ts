// import { NextResponse } from 'next/server';
// import { connectDB, ItemModel } from '@/lib/db';

// export async function GET(req: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('q');

//     let filter: any = {};
//     if (query) {
//       filter = {
//         $or: [
//           { title: { $regex: query, $options: 'i' } },
//           { summary: { $regex: query, $options: 'i' } },
//         ],
//       };
//     }

//     const items = await ItemModel.find(filter).sort({ created_at: -1 });
//     return NextResponse.json({ items });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

//v2 response and the new code
import { NextResponse } from 'next/server';
import { connectDB, ItemModel } from '@/lib/db';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    let filter: any = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ];
    }

    if (category) {
      filter.category_name = category;
    }

    const items = await ItemModel.find(filter).sort({ created_at: -1 }).lean();
    return NextResponse.json({ items, total: items.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}