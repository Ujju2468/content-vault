import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/content-vault-v1';

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Schemas
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#6366f1' },
  icon: { type: String, default: 'folder' },
});

const ItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['link', 'short_video', 'doc'], required: true },
  url: String,
  title: { type: String, required: true },
  summary: String,
  thumbnail_url: String,
  category_name: { type: String, default: 'General' },
  category_color: { type: String, default: '#6b7280' },
  tags: [String],
  created_at: { type: Date, default: Date.now },
});

export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const ItemModel = mongoose.models.Item || mongoose.model('Item', ItemSchema);