import React, { useState, useEffect } from 'react';
import {
  Home,
  Tv,
  User,
  Globe,
  MapPin,
  Search,
  LayoutGrid,
  Clock,
  Film,
  Archive,
  Smartphone,
  Users,
  PhoneCall,
  Info,
  X,
  ChevronRight,
  ArrowUp,
  Share2,
  Check,
  Type,
  Flame,
  MonitorPlay,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface MobileBottomNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

type SheetType = 'latest' | 'search' | 'features' | null;

const quickCategories = [
  { label: 'জাতীয়', href: '/category/জাতীয়' },
  { label: 'রাজনীতি', href: '/category/রাজনীতি' },
  { label: 'সারা দেশ', href: '/category/সারা দেশ' },
  { label: 'জামালপুর', href: '/category/জামালপুর' },
  { label: 'সরিষাবাড়ী', href: '/category/সরিষাবাড়ী' },
  { label: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { label: 'অর্থনীতি', href: '/category/অর্থনীতি' },
  { label: 'খেলাধুলা', href: '/category/খেলাধুলা' },
  { label: 'বিনোদন', href: '/category/বিনোদন' },
  { label: 'তথ্য-প্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
  { label: 'শিক্ষা', href: '/category/শিক্ষা' },
  { label: 'মতামত', href: '/category/মতামত' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate, currentPage }) => {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [latestTab, setLatestTab] = useState<'recent' | 'popular'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [fontScale, setFontScale] = useState<'normal' | 'medium' | 'large'>('normal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 420);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if ((activeSheet === 'latest' || activeSheet === 'search') && newsItems.length === 0) {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(25));
      getDocs(q)
        .then((snap) => {
          setNewsItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        })
        .catch(() => {});
    }
  }, [activeSheet, newsItems.length]);

  const handleFontScaleChange = (scale: 'normal' | 'medium' | 'large') => {
    setFontScale(scale);
    if (scale === 'normal') {
      document.documentElement.style.fontSize = '16px';
    } else if (scale === 'medium') {
      document.documentElement.style.fontSize = '17.5px';
    } else {
      document.documentElement.style.fontSize = '19px';
    }
  };

  const handleSharePortal = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SAMI TV | সামি টেলিভিশন',
          text: 'সত্যের সাথে সবসময় — সামি টিভি অনলাইন নিউজ পোর্টাল',
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  const handleNavigateAndClose = (href: string) => {
    setActiveSheet(null);
    onNavigate(href);
  };

  const toggleSheet = (sheet: SheetType) => {
    setActiveSheet((prev) => (prev === sheet ? null : sheet));
  };

  const filteredNews = searchQuery.trim()
    ? newsItems.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          n.category?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          n.location?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : newsItems.slice(0, 6);

  const displayedLatestNews =
    latestTab === 'recent'
      ? newsItems.slice(0, 10)
      : [...newsItems]
          .sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))
          .slice(0, 10);

  return (
    <>
      {/* Floating Scroll-To-Top Button on Mobile */}
      <AnimatePresence>
        {showScrollTop && !activeSheet && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="lg:hidden fixed bottom-18 right-3.5 z-40 w-9 h-9 rounded-full bg-slate-900/90 text-white shadow-lg border border-white/15 flex items-center justify-center active:scale-95 cursor-pointer"
            aria-label="উপরে যান"
          >
            <ArrowUp size={17} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Interactive Bottom Sheets for Latest News, Quick Search & All Features */}
      <AnimatePresence>
        {activeSheet && (
          <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end pb-15">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setActiveSheet(null)}
              className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs"
            />

            {/* Sheet Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[78vh] flex flex-col overflow-hidden"
            >
              {/* Grab Handle */}
              <div className="pt-2.5 pb-1 flex justify-center shrink-0">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* SHEET 1: সর্বশেষ ও জনপ্রিয় খবর (Latest & Popular News) */}
              {activeSheet === 'latest' && (
                <div className="flex flex-col overflow-hidden h-full">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setLatestTab('recent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          latestTab === 'recent'
                            ? 'bg-white text-sami-red shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Clock size={13} />
                        <span>সর্বশেষ খবর</span>
                      </button>
                      <button
                        onClick={() => setLatestTab('popular')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          latestTab === 'popular'
                            ? 'bg-white text-sami-red shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Flame size={13} />
                        <span>জনপ্রিয়</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveSheet(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                      aria-label="বন্ধ করুন"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="overflow-y-auto px-4 py-2 divide-y divide-slate-100">
                    {displayedLatestNews.length > 0 ? (
                      displayedLatestNews.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigateAndClose(`/news/${item.id}`)}
                          className="w-full text-left py-2.5 flex items-center justify-between gap-3 group cursor-pointer"
                        >
                          <span className="text-xs font-black text-slate-300 w-5 shrink-0 tabular-nums">
                            {idx + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-sami-red line-clamp-2 leading-snug">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-1">
                              <span className="text-sami-red">{item.category || 'সংবাদ'}</span>
                              <span>·</span>
                              <span>
                                {new Date(
                                  item.createdAt?.seconds * 1000 || Date.now()
                                ).toLocaleDateString('bn-BD', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-16 h-12 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-100"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="py-10 text-center text-xs font-semibold text-slate-400">
                        সংবাদ লোড হচ্ছে...
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
                    <button
                      onClick={() => handleNavigateAndClose('/archive')}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>সকল সংবাদের আর্কাইভ দেখুন</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* SHEET 2: খুঁজুন (Instant News Search & Category Filter) */}
              {activeSheet === 'search' && (
                <div className="flex flex-col overflow-hidden h-full">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="সংবাদ, জেলা বা বিষয় খুঁজুন..."
                        className="w-full bg-slate-100 border border-slate-200/80 rounded-xl py-2 pl-3.5 pr-9 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sami-red focus:bg-white"
                      />
                      {searchQuery ? (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          <X size={14} />
                        </button>
                      ) : (
                        <Search
                          size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setActiveSheet(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer"
                      aria-label="বন্ধ করুন"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Quick Category Chips */}
                  <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
                    <div className="flex items-center gap-1.5 min-w-max">
                      {quickCategories.slice(0, 8).map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => handleNavigateAndClose(cat.href)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-[11px] font-bold text-slate-700 hover:border-sami-red hover:text-sami-red transition-colors whitespace-nowrap cursor-pointer"
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="overflow-y-auto px-4 py-2 divide-y divide-slate-100">
                    {filteredNews.length > 0 ? (
                      filteredNews.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigateAndClose(`/news/${item.id}`)}
                          className="w-full text-left py-2.5 flex items-center justify-between gap-3 group cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-sami-red line-clamp-2 leading-snug">
                              {item.title}
                            </p>
                            <span className="text-[10px] font-semibold text-sami-red mt-0.5 inline-block">
                              {item.category || 'সংবাদ'}
                            </span>
                          </div>
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-15 h-11 object-cover rounded-lg bg-slate-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs font-semibold text-slate-400">
                        কোনো সংবাদ পাওয়া যায়নি।
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SHEET 3: সব ফিচার ও কুইক হাব (All Features & Tools Hub) */}
              {activeSheet === 'features' && (
                <div className="flex flex-col overflow-hidden h-full">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">সব ফিচার ও মেনু</h3>
                      <p className="text-[10.5px] font-semibold text-slate-500">
                        সামি টিভি ডিজিটাল পোর্টাল সুবিধাসমূহ
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSheet(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                      aria-label="বন্ধ করুন"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="overflow-y-auto p-4 space-y-4">
                    {/* Reader Font Size & Share Bar */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sami-red shrink-0">
                          <Type size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">ফন্ট সাইজ</p>
                          <p className="text-[10px] font-medium text-slate-500">পড়ার সুবিধা অনুযায়ী</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        {[
                          { id: 'normal', label: 'A' },
                          { id: 'medium', label: 'A+' },
                          { id: 'large', label: 'A++' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() =>
                              handleFontScaleChange(opt.id as 'normal' | 'medium' | 'large')
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                              fontScale === opt.id
                                ? 'bg-sami-red text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Portal Feature Grid */}
                    <div>
                      <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        বিশেষ ফিচারসমূহ
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            label: 'লাইভ টিভি',
                            href: '/live',
                            icon: Tv,
                            accent: 'text-sami-red bg-red-50/80 border-red-100',
                          },
                          {
                            label: 'ভিডিও গ্যালারি',
                            href: '/media',
                            icon: Film,
                            accent: 'text-slate-800 bg-slate-50 border-slate-200/70',
                          },
                          {
                            label: 'আর্কাইভ',
                            href: '/archive',
                            icon: Archive,
                            accent: 'text-slate-800 bg-slate-50 border-slate-200/70',
                          },
                          {
                            label: 'মোবাইল অ্যাপ',
                            href: '/download-app',
                            icon: Smartphone,
                            accent: 'text-slate-800 bg-slate-50 border-slate-200/70',
                          },
                          {
                            label: 'অ্যান্ড্রয়েড টিভি',
                            href: '/android-tv',
                            icon: MonitorPlay,
                            accent: 'text-slate-800 bg-slate-50 border-slate-200/70',
                          },
                          {
                            label: 'আমাদের পরিবার',
                            href: '/family',
                            icon: Users,
                            accent: 'text-slate-800 bg-slate-50 border-slate-200/70',
                          },
                        ].map((feat) => {
                          const Icon = feat.icon;
                          return (
                            <button
                              key={feat.label}
                              onClick={() => handleNavigateAndClose(feat.href)}
                              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${feat.accent}`}
                            >
                              <Icon size={19} />
                              <span className="text-[11px] font-bold leading-snug text-center whitespace-nowrap">
                                {feat.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* All Categories Section */}
                    <div>
                      <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        সকল সংবাদ বিভাগ
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {quickCategories.map((cat) => (
                          <button
                            key={cat.label}
                            onClick={() => handleNavigateAndClose(cat.href)}
                            className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-xs font-bold text-slate-700 flex items-center justify-between cursor-pointer"
                          >
                            <span className="truncate">{cat.label}</span>
                            <ChevronRight size={12} className="text-slate-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Row: Share, Contact, Admin Login */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={handleSharePortal}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
                        <span>{copiedLink ? 'লিঙ্ক কপি হয়েছে!' : 'পোর্টাল শেয়ার করুন'}</span>
                      </button>

                      <button
                        onClick={() => handleNavigateAndClose('/admin')}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <User size={15} />
                        <span>প্রতিনিধি / এডমিন লগইন</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Sticky Mobile Bottom Navigation Bar */}
      <nav
        aria-label="মোবাইল নেভিগেশন"
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-slate-200/90 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="grid grid-cols-6 items-center max-w-lg mx-auto h-15 px-1">
          {/* 1. প্রচ্ছদ (Home) */}
          <button
            onClick={() => handleNavigateAndClose('/')}
            className={`flex flex-col items-center justify-center h-full px-0.5 transition-colors cursor-pointer relative ${
              currentPage === '/' && !activeSheet
                ? 'text-sami-red font-bold'
                : 'text-slate-600 font-semibold hover:text-slate-900'
            }`}
          >
            {currentPage === '/' && !activeSheet && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-sami-red rounded-b-full" />
            )}
            <Home
              size={18}
              className={currentPage === '/' && !activeSheet ? 'text-sami-red' : 'text-slate-600'}
            />
            <span className="text-[10px] mt-1 whitespace-nowrap leading-snug py-0.5">
              প্রচ্ছদ
            </span>
          </button>

          {/* 2. সর্বশেষ (Latest & Trending Drawer) */}
          <button
            onClick={() => toggleSheet('latest')}
            className={`flex flex-col items-center justify-center h-full px-0.5 transition-colors cursor-pointer relative ${
              activeSheet === 'latest'
                ? 'text-sami-red font-bold'
                : 'text-slate-600 font-semibold hover:text-slate-900'
            }`}
          >
            {activeSheet === 'latest' && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-sami-red rounded-b-full" />
            )}
            <Clock
              size={18}
              className={activeSheet === 'latest' ? 'text-sami-red' : 'text-slate-600'}
            />
            <span className="text-[10px] mt-1 whitespace-nowrap leading-snug py-0.5">
              সর্বশেষ
            </span>
          </button>

          {/* 3. লাইভ টিভি (Highlighted Broadcast Button) */}
          <button
            onClick={() => handleNavigateAndClose('/live')}
            className={`flex flex-col items-center justify-center h-full px-0.5 transition-colors cursor-pointer relative ${
              currentPage === '/live' && !activeSheet
                ? 'text-sami-red font-bold'
                : 'text-slate-700 font-bold hover:text-sami-red'
            }`}
          >
            {currentPage === '/live' && !activeSheet && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-sami-red rounded-b-full" />
            )}
            <div
              className={`px-2.5 py-0.5 rounded-full flex items-center justify-center transition-colors ${
                currentPage === '/live' && !activeSheet
                  ? 'bg-sami-red text-white shadow-xs'
                  : 'bg-red-50 text-sami-red'
              }`}
            >
              <Tv size={16} />
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap leading-snug py-0.5 text-sami-red font-bold">
              লাইভ টিভি
            </span>
          </button>

          {/* 4. মিডিয়া / ভিডিও (Media Gallery) */}
          <button
            onClick={() => handleNavigateAndClose('/media')}
            className={`flex flex-col items-center justify-center h-full px-0.5 transition-colors cursor-pointer relative ${
              currentPage === '/media' && !activeSheet
                ? 'text-sami-red font-bold'
                : 'text-slate-600 font-semibold hover:text-slate-900'
            }`}
          >
            {currentPage === '/media' && !activeSheet && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-sami-red rounded-b-full" />
            )}
            <Film
              size={18}
              className={
                currentPage === '/media' && !activeSheet ? 'text-sami-red' : 'text-slate-600'
              }
            />
            <span className="text-[10px] mt-1 whitespace-nowrap leading-snug py-0.5">
              মিডিয়া
            </span>
          </button>

          {/* 5. খুঁজুন (Instant Search Sheet) */}
          <button
            onClick={() => toggleSheet('search')}
            className={`flex flex-col items-center justify-center h-full px-0.5 transition-colors cursor-pointer relative ${
              activeSheet === 'search'
                ? 'text-sami-red font-bold'
                : 'text-slate-600 font-semibold hover:text-slate-900'
            }`}
          >
            {activeSheet === 'search' && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-sami-red rounded-b-full" />
            )}
            <Search
              size={18}
              className={activeSheet === 'search' ? 'text-sami-red' : 'text-slate-600'}
            />
            <span className="text-[10px] mt-1 whitespace-nowrap leading-snug py-0.5">
              খুঁজুন
            </span>
          </button>

          {/* 6. সব ফিচার (All Features & Login Hub Sheet) */}
          <button
            onClick={() => toggleSheet('features')}
            className={`flex flex-col items-center justify-center h-full px-0.5 transition-colors cursor-pointer relative ${
              activeSheet === 'features'
                ? 'text-sami-red font-bold'
                : 'text-slate-600 font-semibold hover:text-slate-900'
            }`}
          >
            {activeSheet === 'features' && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-sami-red rounded-b-full" />
            )}
            <LayoutGrid
              size={18}
              className={activeSheet === 'features' ? 'text-sami-red' : 'text-slate-600'}
            />
            <span className="text-[10px] mt-1 whitespace-nowrap leading-snug py-0.5">
              সব ফিচার
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
