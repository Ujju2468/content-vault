'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Item, Category } from '@/types';
import { Search, ExternalLink, Tag as TagIcon, Loader2, X } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Ingest Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      setCategories(catData.categories || []);

      let itemUrl = `/api/items?q=${encodeURIComponent(searchQuery)}`;
      if (selectedCategory) itemUrl += `&category=${selectedCategory}`;

      const itemRes = await fetch(itemUrl);
      const itemData = await itemRes.json();
      setItems(itemData.items || []);
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

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenIngest={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Library</h2>
            <p className="text-slate-400 text-sm">Your AI-organized bookmarks and media</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search items or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <p>No saved items found.</p>
            <p className="text-sm">Click "Save Link / Doc" to add your first reel or article!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  {item.thumbnail_url && (
                    <img src={item.thumbnail_url} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${item.category_color}20`, color: item.category_color || '#818cf8' }}
                    >
                      {item.category_name || 'General'}
                    </span>
                    <span className="text-xs text-slate-500 uppercase font-mono">{item.type}</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 line-clamp-2 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-4">{item.summary}</p>
                </div>

                <div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          <TagIcon className="w-3 h-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Quick Ingest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-1">Save Content to Vault</h3>
            <p className="text-slate-400 text-sm mb-4">Paste an Instagram Reel, YouTube Short, or article URL below.</p>

            <form onSubmit={handleIngest}>
              <input
                type="url"
                required
                placeholder="https://www.instagram.com/reel/..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 mb-6"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Analyzing & Saving...' : 'Save Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}