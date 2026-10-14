import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Image as ImageIcon, Film, ExternalLink, X, ChevronLeft, 
  ChevronRight, Search, Share2, Eye, Calendar, Sparkles, Filter, 
  Download, Maximize2, Check, Radio, Clock, ShieldCheck, Tag
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const DEFAULT_MEDIA = [
  {
    id: 'def-1',
    title: 'সামী টেলিভিশন কেন্দ্রীয় সম্প্রচার স্টুডিও ও নিউজরুম জামালপুর',
    type: 'image',
    category: 'স্টুডিও',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
    date: '১০ মে, ২০২৬',
    views: '১,৪২০',
    featured: true
  },
  {
    id: 'def-2',
    title: 'জামালপুর জেলা উন্নয়ন বিষয়ক বিশেষ অনুসন্ধানী প্রতিবেদন',
    type: 'video',
    category: 'প্রতিবেদন',
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7735e?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    date: '১২ মে, ২০২৬',
    views: '৩,১৮০',
    duration: '০৫:২২',
    featured: true
  },
  {
    id: 'def-3',
    title: 'মাঠপর্যায়ে সামী টিভির প্রতিনিধি দল ও সরাসরি সংবাদ সংগ্রহ',
    type: 'image',
    category: 'মাঠপর্যায়',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200',
    date: '৮ মে, ২০২৬',
    views: '২,১০০'
  },
  {
    id: 'def-4',
    title: 'প্রাইম টাইম বুলেটিন: জাতীয় রাজনীতি ও সমসাময়িক প্রেক্ষাপট',
    type: 'video',
    category: 'সংবাদ বুলেটিন',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    date: '১৫ মে, ২০২৬',
    views: '৪,৫০০',
    duration: '১২:৪৫'
  },
  {
    id: 'def-5',
    title: 'কৃষি বিপ্লব ও চরাঞ্চলের কৃষকদের জীবনগাথা নিয়ে বিশেষ তথ্যচিত্র',
    type: 'video',
    category: 'তথ্যচিত্র',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    date: '২০ মে, ২০২৬',
    views: '১,৮৯০',
    duration: '০৮:১৫'
  },
  {
    id: 'def-6',
    title: 'সামী টিভি প্রতিষ্ঠা বার্ষিকী ও গুণীজন সম্মাননা অনুষ্ঠান',
    type: 'image',
    category: 'অনুষ্ঠান',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
    date: '১১ নভেম্বর, ২০২৫',
    views: '৫,৪০০'
  },
  {
    id: 'def-7',
    title: 'আধুনিক স্যাটেলাইট ও ডিজিটাল সম্প্রচার কন্ট্রোল রুম পরিদর্শন',
    type: 'image',
    category: 'প্রযুক্তি',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    date: '১ মে, ২০২৬',
    views: '২,৭৫০'
  },
  {
    id: 'def-8',
    title: 'সরাসরি জনমত ও টকশো: সমসাময়িক অর্থনীতির হালচাল',
    type: 'video',
    category: 'টকশো',
    imageUrl: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    date: '২৫ মে, ২০২৬',
    views: '৩,২০০',
    duration: '২১:০৩'
  }
];

const CATEGORIES = ['সব', 'স্টুডিও', 'প্রতিবেদন', 'মাঠপর্যায়', 'সংবাদ বুলেটিন', 'তথ্যচিত্র', 'অনুষ্ঠান', 'প্রযুক্তি', 'টকশো'];

export const Media: React.FC = () => {
  const [mediaList, setMediaList] = useState<any[]>(DEFAULT_MEDIA);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Lightbox / Modal
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMediaList([...firestoreItems, ...DEFAULT_MEDIA]);
      } else {
        setMediaList(DEFAULT_MEDIA);
      }
      setLoading(false);
    }, (error) => {
      console.error("Media Firestore Error: ", error);
      setMediaList(DEFAULT_MEDIA);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredMedia = mediaList.filter(m => {
    const matchesType = activeFilter === 'all' || m.type === activeFilter;
    const matchesCategory = selectedCategory === 'সব' || m.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesCategory && matchesSearch;
  });

  const imagesCount = mediaList.filter(m => m.type === 'image').length;
  const videosCount = mediaList.filter(m => m.type === 'video').length;
  const featuredItem = mediaList.find(m => m.featured && m.type === 'video') || mediaList[0];

  const handleShare = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          url: window.location.href
        });
        return;
      } catch {
        // Fallback
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShareId(item.id);
      setTimeout(() => setCopiedShareId(null), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen text-slate-800 pb-20 font-sans">
      
      {/* =========================================================================
          DESKTOP (PC) HEADER BANNER
          ========================================================================= */}
      <div className="hidden md:block bg-[#0b0c10] text-white border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1700px] mx-auto px-6 lg:px-12 py-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Film size={13} className="text-red-400" />
                  SAMI TV OFFICIAL BROADCAST ARCHIVE
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-white/70 text-xs font-bold">ফটো অ্যালবাম ও ভিডিও সংগ্রহশালা</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                আমাদের <span className="text-red-500">মিডিয়া গ্যালারি</span>
              </h1>

              <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-2xl">
                সামী টিভির ঐতিহাসিক মুহূর্ত, নিউজরুম কার্যক্রম, মাঠপর্যায়ের সংবাদ সংগ্রহ, বিশেষ অনুসন্ধানী তথ্যচিত্র এবং সরাসরি সম্প্রচারের সমৃদ্ধ ভিজ্যুয়াল আর্কাইভ।
              </p>
            </div>

            {/* Quick Stats Ribbon (PC View) */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shrink-0">
              <div className="px-4 text-center border-r border-white/10">
                <span className="text-2xl font-black text-white font-mono tabular-nums">{mediaList.length}</span>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">মোট মিডিয়া</p>
              </div>
              <div className="px-4 text-center border-r border-white/10">
                <span className="text-2xl font-black text-red-400 font-mono tabular-nums">{imagesCount}</span>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">ফটো অ্যালবাম</p>
              </div>
              <div className="px-4 text-center">
                <span className="text-2xl font-black text-emerald-400 font-mono tabular-nums">{videosCount}</span>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">ভিডিও কন্টেন্ট</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE HEADER BANNER
          ========================================================================= */}
      <div className="md:hidden bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-white p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[8px] font-black uppercase tracking-wider">
                MEDIA ARCHIVE
              </span>
              <span className="text-[9px] text-emerald-400 font-bold">আল্ট্রা এইচডি</span>
            </div>
            <h1 className="text-xl font-black text-white mt-1 font-brand">
              মিডিয়া <span className="text-sami-red">গ্যালারি</span>
            </h1>
            <p className="text-[10.5px] text-slate-300">সামী টিভির ছবি ও ভিডিও সংগ্রহশালা</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-center">
            <span className="text-base font-black text-white font-mono">{mediaList.length}</span>
            <span className="text-[10px] text-slate-300 font-bold">আইটেম</span>
          </div>
        </div>

        {/* Mobile Type Filter Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              activeFilter === 'all' ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            সব ({mediaList.length})
          </button>
          <button 
            onClick={() => setActiveFilter('image')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeFilter === 'image' ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            <ImageIcon size={12} />
            <span>ছবি ({imagesCount})</span>
          </button>
          <button 
            onClick={() => setActiveFilter('video')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeFilter === 'video' ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            <Film size={12} />
            <span>ভিডিও ({videosCount})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONTROL & FILTER STRIP (Optimized for both Desktop & Mobile - Sticky Toolbar)
          ========================================================================= */}
      <div className="sticky top-[96px] sm:top-[100px] lg:top-10 z-35 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
        <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Segmented Filter Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সব মিডিয়া ({mediaList.length})
            </button>
            <button 
              onClick={() => setActiveFilter('image')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeFilter === 'image' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon size={14} />
              <span>ফটো অ্যালবাম ({imagesCount})</span>
            </button>
            <button 
              onClick={() => setActiveFilter('video')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeFilter === 'video' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film size={14} />
              <span>ভিডিও সংগ্রহ ({videosCount})</span>
            </button>
          </div>

          {/* Category Chips (Horizontal Scroll) */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-1 md:pb-0">
            {CATEGORIES.map((cat) => {
              const isCatActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isCatActive 
                      ? 'bg-slate-900 text-white shadow-xs font-black' 
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিরোনাম বা ক্যাটাগরি অনুসন্ধান..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-red-600 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MEDIA CONTENT CONTAINER (Spotlight + Grid)
          ========================================================================= */}
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-12 pt-6 space-y-8">
        
        {/* Desktop Spotlight Card (Visible when filter is all/video and no active search) */}
        {!searchQuery && selectedCategory === 'সব' && activeFilter !== 'image' && featuredItem && (
          <div className="hidden lg:block bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="grid grid-cols-12 items-center">
              <div 
                className="col-span-7 aspect-video relative overflow-hidden bg-black cursor-pointer group"
                onClick={() => setActiveModalItem(featuredItem)}
              >
                <img 
                  src={featuredItem.imageUrl} 
                  alt={featuredItem.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play size={28} fill="currentColor" className="ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles size={11} />
                    স্পেশাল ফিচারড
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-slate-200 text-[10px] font-bold backdrop-blur-md">
                    {featuredItem.category}
                  </span>
                </div>
                {featuredItem.duration && (
                  <span className="absolute bottom-4 right-4 bg-black/80 text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                    {featuredItem.duration}
                  </span>
                )}
              </div>

              <div className="col-span-5 p-8 lg:p-10 space-y-4">
                <span className="text-red-500 font-mono text-xs font-black uppercase tracking-wider">
                  SAMI TV SPOTLIGHT ARCHIVE
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">
                  {featuredItem.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  সামী টেলিভিশনের বিশেষ অনুসন্ধান দল কর্তৃক ধারণকৃত উচ্চমানের ভিজ্যুয়াল প্রতিবেদন। সত্য অনুসন্ধানে এক নির্ভরযোগ্য উপস্থাপনা।
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{featuredItem.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Eye size={13} className="text-slate-400" />
                    <span>{featuredItem.views} ভিউ</span>
                  </span>
                </div>
                <button 
                  onClick={() => setActiveModalItem(featuredItem)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  <span>এখনই দেখুন</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Grid Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">মিডিয়া কন্টেন্ট লোড হচ্ছে...</p>
          </div>
        ) : filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredMedia.map((item) => (
              <motion.div
                layout
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-red-400/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Thumbnail Container */}
                <div className="aspect-[16/10] sm:aspect-video relative overflow-hidden bg-slate-900">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Top Type Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider text-white shadow-md ${
                      item.type === 'video' ? 'bg-red-600' : 'bg-slate-950/85 backdrop-blur-sm'
                    }`}>
                      {item.type === 'video' ? 'ভিডিও' : 'ফটো'}
                    </span>
                    {item.category && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-black/60 text-slate-200 text-[9px] font-bold backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Play Center Indicator for Videos */}
                  {item.type === 'video' ? (
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={18} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  )}

                  {/* Date or Duration stamp */}
                  {item.duration ? (
                    <span className="absolute bottom-1.5 right-2 bg-black/80 text-white px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-mono font-bold">
                      {item.duration}
                    </span>
                  ) : (
                    <span className="absolute bottom-1.5 right-2 text-[9px] text-white/90 font-mono font-medium drop-shadow-md">
                      {item.date || '২০২৬'}
                    </span>
                  )}
                </div>

                {/* Media Details */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1 font-mono">
                      <Eye size={12} className="text-slate-400" />
                      <span>{item.views || '১.২K'} ভিউ</span>
                    </span>

                    <button 
                      onClick={(e) => handleShare(e, item)}
                      className="p-1 hover:text-red-600 rounded transition-colors"
                      title="শেয়ার করুন"
                    >
                      {copiedShareId === item.id ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Share2 size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <ImageIcon size={44} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">কোনো মিডিয়া কন্টেন্ট পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400 mt-1">অন্য কোনো ফিল্টার বা ক্যাটাগরি ব্যবহার করে অনুসন্ধান করুন।</p>
            <button 
              onClick={() => { setActiveFilter('all'); setSelectedCategory('সব'); setSearchQuery(''); }}
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
            >
              সকল মিডিয়া রিসেট করুন
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          INTERACTIVE LIGHTBOX / MEDIA MODAL (Full Experience)
          ========================================================================= */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl text-white flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-black">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    activeModalItem.type === 'video' ? 'bg-red-600 text-white' : 'bg-white/20 text-white'
                  }`}>
                    {activeModalItem.type === 'video' ? 'ভিডিও' : 'ছবি'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                    {activeModalItem.title}
                  </h4>
                </div>
                <button 
                  onClick={() => setActiveModalItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content Stage */}
              <div className="bg-black flex items-center justify-center relative aspect-video overflow-hidden">
                {activeModalItem.type === 'video' ? (
                  activeModalItem.videoUrl && activeModalItem.videoUrl.includes('youtube.com') ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${activeModalItem.videoUrl.split('v=')[1]?.split('&')[0] || ''}?autoplay=1`}
                      title={activeModalItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img 
                        src={activeModalItem.imageUrl} 
                        alt={activeModalItem.title} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <a 
                        href={activeModalItem.videoUrl || '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl">
                          <Play size={28} fill="currentColor" className="ml-1" />
                        </div>
                      </a>
                    </div>
                  )
                ) : (
                  <img 
                    src={activeModalItem.imageUrl} 
                    alt={activeModalItem.title} 
                    className="w-full h-full object-contain max-h-[65vh]"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Modal Footer Meta */}
              <div className="p-4 bg-zinc-900 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-bold">{activeModalItem.category || 'সামী টিভি'}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-slate-400 font-mono">{activeModalItem.date || '২০২৬'}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-slate-400 font-mono">{activeModalItem.views || '১.২K'} ভিউ</span>
                  </div>
                  <p className="text-slate-300 text-[11.5px] line-clamp-1">{activeModalItem.title}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={(e) => handleShare(e, activeModalItem)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedShareId === activeModalItem.id ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span>লিঙ্ক কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={13} />
                        <span>শেয়ার করুন</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => setActiveModalItem(null)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl font-bold transition-colors"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
