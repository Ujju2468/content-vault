// 'use client';

// import { Folder, Video, Utensils, Code, FileText, Box, Plus } from 'lucide-react';
// import { Category } from '@/types';

// interface SidebarProps {
//   categories: Category[];
//   selectedCategory: string | null;
//   onSelectCategory: (id: string | null) => void;
//   onOpenIngest: () => void;
// }

// const iconMap: Record<string, any> = {
//   code: Code,
//   video: Video,
//   utensils: Utensils,
//   'file-text': FileText,
//   box: Box,
// };

// export function Sidebar({ categories, selectedCategory, onSelectCategory, onOpenIngest }: SidebarProps) {
//   return (
//     <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 p-4 flex flex-col h-screen">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-xl font-bold text-white tracking-wide">Content Vault</h1>
//       </div>

//       <button
//         onClick={onOpenIngest}
//         className="w-full mb-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
//       >
//         <Plus className="w-4 h-4" /> Save Link / Doc
//       </button>

//       <nav className="flex-1 space-y-1">
//         <button
//           onClick={() => onSelectCategory(null)}
//           className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//             selectedCategory === null ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400'
//           }`}
//         >
//           <Box className="w-4 h-4 text-slate-400" /> All Saved Items
//         </button>

//         <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           Categories
//         </div>

//         {categories.map((cat) => {
//           const IconComponent = iconMap[cat.icon] || Folder;
//           const isSelected = selectedCategory === cat.id;

//           return (
//             <button
//               key={cat.id}
//               onClick={() => onSelectCategory(cat.id)}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                 isSelected ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400'
//               }`}
//             >
//               <IconComponent className="w-4 h-4" style={{ color: cat.color }} />
//               <span className="truncate">{cat.name}</span>
//             </button>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

//v2 code for side bar
'use client';

import { Folder, Video, Utensils, Code, FileText, Box, Plus, Sparkles, Layers } from 'lucide-react';
import { Category } from '@/types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  totalCount: number;
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

export function Sidebar({ categories, selectedCategory, totalCount, onSelectCategory, onOpenIngest }: SidebarProps) {
  return (
    <aside className="w-72 glass-panel border-r border-slate-800/80 text-slate-300 p-5 flex flex-col h-screen z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            Content Vault <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">v2</span>
          </h1>
          <p className="text-xs text-slate-400">AI Local Knowledge Hub</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onOpenIngest}
        className="w-full mb-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Save Link or Doc</span>
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
              : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Box className="w-4 h-4 text-indigo-400" />
            <span>All Saved Items</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">{totalCount}</span>
        </button>

        <div className="pt-6 pb-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Smart Categories</span>
          <Sparkles className="w-3 h-3 text-indigo-400" />
        </div>

        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Folder;
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.id || cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-slate-800/90 text-white border border-slate-700 shadow-sm'
                  : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <IconComponent className="w-4 h-4 shrink-0" style={{ color: cat.color }} />
                <span className="truncate">{cat.name}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}