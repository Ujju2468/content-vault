'use client';

import { Folder, Video, Utensils, Code, FileText, Box, Plus } from 'lucide-react';
import { Category } from '@/types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onOpenIngest: () => void;
}

const iconMap: Record<string, any> = {
  code: Code,
  video: Video,
  utensils: Utensils,
  'file-text': FileText,
  box: Box,
};

export function Sidebar({ categories, selectedCategory, onSelectCategory, onOpenIngest }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 p-4 flex flex-col h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white tracking-wide">Content Vault</h1>
      </div>

      <button
        onClick={onOpenIngest}
        className="w-full mb-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" /> Save Link / Doc
      </button>

      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === null ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400'
          }`}
        >
          <Box className="w-4 h-4 text-slate-400" /> All Saved Items
        </button>

        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Categories
        </div>

        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Folder;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isSelected ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <IconComponent className="w-4 h-4" style={{ color: cat.color }} />
              <span className="truncate">{cat.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}