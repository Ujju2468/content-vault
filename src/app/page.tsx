// 'use client';

// import { useState, useEffect } from 'react';
// import { Sidebar } from '@/components/sidebar';
// import { Item, Category } from '@/types';
// import { Search, ExternalLink, Tag as TagIcon, Loader2, X } from 'lucide-react';

// export default function Home() {
//   const [items, setItems] = useState<Item[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Ingest Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [inputUrl, setInputUrl] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const catRes = await fetch('/api/categories');
//       const catData = await catRes.json();
//       setCategories(catData.categories || []);

//       let itemUrl = `/api/items?q=${encodeURIComponent(searchQuery)}`;
//       if (selectedCategory) itemUrl += `&category=${selectedCategory}`;

//       const itemRes = await fetch(itemUrl);
//       const itemData = await itemRes.json();
//       setItems(itemData.items || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedCategory, searchQuery]);


//   const handleIngest = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!inputUrl.trim()) return;

//   setIsSubmitting(true);
//   try {
//     const res = await fetch('/api/ingest', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ url: inputUrl }),
//     });

//     // Check if response is valid JSON before parsing
//     const contentType = res.headers.get('content-type');
//     if (!res.ok || !contentType || !contentType.includes('application/json')) {
//       const text = await res.text();
//       console.error('API Error (Non-JSON):', text);
//       alert('Server error or route not found. Check terminal logs.');
//       return;
//     }

//     const data = await res.json();
//     if (data.success) {
//       setInputUrl('');
//       setIsModalOpen(false);
//       fetchData();
//     }
//   } catch (err) {
//     console.error('Fetch error:', err);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
//       <Sidebar
//         categories={categories}
//         selectedCategory={selectedCategory}
//         onSelectCategory={setSelectedCategory}
//         onOpenIngest={() => setIsModalOpen(true)}
//       />

//       <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8">
//         {/* Header & Search */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <div>
//             <h2 className="text-2xl font-bold">Library</h2>
//             <p className="text-slate-400 text-sm">Your AI-organized bookmarks and media</p>
//           </div>

//           <div className="relative w-full sm:w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
//             <input
//               type="text"
//               placeholder="Search items or keywords..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500"
//             />
//           </div>
//         </div>

//         {/* Content Grid */}
//         {isLoading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
//           </div>
//         ) : items.length === 0 ? (
//           <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
//             <p>No saved items found.</p>
//             <p className="text-sm">Click "Save Link / Doc" to add your first reel or article!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {items.map((item) => (
//               <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
//                 <div>
//                   {item.thumbnail_url && (
//                     <img src={item.thumbnail_url} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4" />
//                   )}
//                   <div className="flex items-center gap-2 mb-2">
//                     <span
//                       className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
//                       style={{ backgroundColor: `${item.category_color}20`, color: item.category_color || '#818cf8' }}
//                     >
//                       {item.category_name || 'General'}
//                     </span>
//                     <span className="text-xs text-slate-500 uppercase font-mono">{item.type}</span>
//                   </div>
//                   <h3 className="font-semibold text-slate-100 line-clamp-2 mb-2">{item.title}</h3>
//                   <p className="text-slate-400 text-sm line-clamp-3 mb-4">{item.summary}</p>
//                 </div>

//                 <div>
//                   {item.tags && item.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-1 mb-4">
//                       {item.tags.map((tag) => (
//                         <span key={tag} className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
//                           <TagIcon className="w-3 h-3" /> {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}

//                   {item.url && (
//                     <a
//                       href={item.url}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
//                     >
//                       Open Link <ExternalLink className="w-3 h-3" />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Quick Ingest Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h3 className="text-lg font-bold mb-1">Save Content to Vault</h3>
//             <p className="text-slate-400 text-sm mb-4">Paste an Instagram Reel, YouTube Short, or article URL below.</p>

//             <form onSubmit={handleIngest}>
//               <input
//                 type="url"
//                 required
//                 placeholder="https://www.instagram.com/reel/..."
//                 value={inputUrl}
//                 onChange={(e) => setInputUrl(e.target.value)}
//                 className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 mb-6"
//               />
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2"
//                 >
//                   {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
//                   {isSubmitting ? 'Analyzing & Saving...' : 'Save Content'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//v2
'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Item, Category } from '@/types';
import { Search, ExternalLink, Tag as TagIcon, Loader2, X, Sparkles, Film, FileText, Link as LinkIcon, Compass } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }

      let itemUrl = `/api/items?q=${encodeURIComponent(searchQuery)}`;
      if (selectedCategory) itemUrl += `&category=${encodeURIComponent(selectedCategory)}`;

      const itemRes = await fetch(itemUrl);
      if (itemRes.ok) {
        const itemData = await itemRes.json();
        setItems(itemData.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (res.ok) {
        setInputUrl('');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'short_video': return <Film className="w-3.5 h-3.5 text-pink-400" />;
      case 'doc': return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <LinkIcon className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 font-sans overflow-hidden">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        totalCount={items.length}
        onSelectCategory={setSelectedCategory}
        onOpenIngest={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto px-10 py-8 relative">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-800/60">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {selectedCategory || 'All Vault Content'}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Automated AI tagging and persistent local database storage
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, summary, or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 text-slate-200 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        {/* Main Grid Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-xs text-slate-500 font-medium">Querying local MongoDB...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-4 text-indigo-400">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-1">Vault is currently empty</h3>
            <p className="text-slate-500 text-xs max-w-sm mb-6">
              Paste an Instagram Reel, YouTube Short, or Web link to let AI auto-categorize it.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all"
            >
              Add First Bookmark
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
            {items.map((item: any) => (
              <div
                key={item._id || item.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div>
                  {item.thumbnail_url && (
                    <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-950/60">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border border-white/5"
                      style={{
                        backgroundColor: `${item.category_color || '#6366f1'}15`,
                        color: item.category_color || '#818cf8',
                      }}
                    >
                      {item.category_name || 'General'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/40 px-2 py-0.5 rounded-md border border-slate-800/50">
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 max-w-[70%]">
                    {item.tags?.slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={`${item._id}-t-${idx}`}
                        className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800"
                      >
                        <TagIcon className="w-2.5 h-2.5 text-indigo-400" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 transition-all ml-auto shrink-0"
                      title="Open Original Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Save Content Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Save Link to Content Vault v2</h3>
            </div>
            <p className="text-slate-400 text-xs mb-6">
              Paste an Instagram Reel, YouTube Short, or article URL below for AI categorization.
            </p>

            <form onSubmit={handleIngest}>
              <div className="mb-6">
                <input
                  type="url"
                  required
                  placeholder="https://www.instagram.com/reel/... or https://..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Ingesting & Categorizing...</span>
                    </>
                  ) : (
                    <span>Save Content</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}