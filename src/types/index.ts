export type ItemType = 'link' | 'short_video' | 'doc';

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
}