import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Twitter, Instagram, MapPin, Calendar, Search, Menu, X, ChevronRight, Clock, CloudSun, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMILogo } from './SAMILogo';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const mobileQuickCategories = [
  { name: 'প্রচ্ছদ', href: '/' },
  { name: 'জাতীয়', href: '/category/জাতীয়' },
  { name: 'রাজনীতি', href: '/category/রাজনীতি' },
  { name: 'সারা দেশ', href: '/category/সারা দেশ' },
  { name: 'জামালপুর', href: '/category/জামালপুর' },
  { name: 'সরিষাবাড়ী', href: '/category/সরিষাবাড়ী' },
  { name: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { name: 'খেলাধুলা', href: '/category/খেলাধুলা' },
  { name: 'বিনোদন', href: '/category/বিনোদন' },
  { name: 'তথ্য-প্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
];

const allCategoriesList = [
  { name: 'প্রচ্ছদ', href: '/' },
  { name: 'জাতীয়', href: '/category/জাতীয়' },
  { name: 'রাজনীতি', href: '/category/রাজনীতি' },
  { name: 'অর্থনীতি', href: '/category/অর্থনীতি' },
  { name: 'সারা দেশ', href: '/category/সারা দেশ' },
  { name: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { name: 'জামালপুর', href: '/category/জামালপুর' },
  { name: 'সরিষাবাড়ী', href: '/category/সরিষাবাড়ী' },
  { name: 'খেলাধুলা', href: '/category/খেলাধুলা' },
  { name: 'তথ্য-প্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
  { name: 'বিনোদন', href: '/category/বিনোদন' },
  { name: 'শিক্ষা', href: '/category/শিক্ষা' },
  { name: 'মতামত', href: '/category/মতামত' },
  { name: 'লাইফস্টাইল', href: '/category/লাইফস্টাইল' },
];

const portalLinks = [
  { name: 'লাইভ টিভি', href: '/live' },
  { name: 'মিডিয়া গ্যালারি', href: '/media' },
  { name: 'আর্কাইভ', href: '/archive' },
  { name: 'আমাদের পরিবার', href: '/family' },
  { name: 'আমাদের সম্পর্কে', href: '/about' },
  { name: 'যোগাযোগ', href: '/contact' },
];

export const Header: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
}> = ({ onNavigate, currentPage }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchableNews, setSearchableNews] = useState<any[]>([]);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchOpen && searchableNews.length === 0) {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(40));
      getDocs(q).then((snap) => {
        setSearchableNews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }).catch(() => {});
    }
  }, [searchOpen, searchableNews.length]);

  const filteredSearchNews = searchQuery.trim()
    ? searchableNews.filter(n =>
        n.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        n.category?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const today = new Date();
  const bnOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const bnDate = today.toLocaleDateString('bn-BD', bnOptions);
  const bnShortDate = today.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });

  const isCategoryActive = (href: string) => {
    const decodedCurrent = decodeURIComponent(currentPage);
    const decodedHref = decodeURIComponent(href);
    return decodedCurrent === decodedHref;
  };

  return (
    <header className="bg-white sticky top-0 z-40 lg:static">
      {/* Clean & Professional Mobile Header + Category Strip (Hidden on Desktop) */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        {/* Row 1: Compact Mobile App Bar */}
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Left: Hamburger Menu + Brand Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setCategoryDrawerOpen(true)}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/80 transition-colors active:scale-95 cursor-pointer shrink-0"
              aria-label="মেনু খুলুন"
            >
              <Menu size={19} />
            </button>

            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer min-w-0"
            >
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg"
                alt="SAMI TV"
                className="h-11 sm:h-12 w-auto object-contain rounded-md border border-slate-100 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col justify-center border-l border-slate-200 pl-2.5 min-w-0">
                <div className="text-base sm:text-lg font-black text-sami-dark leading-none tracking-tight uppercase font-brand truncate">
                  SAMI <span className="text-sami-red">TV</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 italic mt-1 truncate">
                  বাংলায় কথা বলে...
                </span>
              </div>
            </div>
          </div>

          {/* Right: Search Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
                searchOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
              aria-label="সংবাদ খুঁজুন"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>
        </div>

        {/* Row 2: Editorial Horizontal Category Navigation Bar */}
        <div className="border-t border-slate-100 bg-white relative">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex items-center px-2 min-w-max h-9">
              {mobileQuickCategories.map((cat, idx) => {
                const active = isCategoryActive(cat.href);
                return (
                  <React.Fragment key={cat.name}>
                    <button
                      onClick={() => onNavigate(cat.href)}
                      className={`relative h-full px-3 flex items-center justify-center text-[12.5px] whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'text-sami-red font-extrabold'
                          : 'text-slate-700 font-bold hover:text-sami-red'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {active && (
                        <motion.span
                          layoutId="mobileActiveCategoryIndicator"
                          className="absolute bottom-0 inset-x-2 h-[2.5px] bg-sami-red rounded-t-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </button>
                    {idx < mobileQuickCategories.length - 1 && (
                      <span className="h-3 w-[1px] bg-slate-200/80 shrink-0" aria-hidden="true" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {/* Subtle right fade edge indicator for horizontal scroll */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Mobile Navigation Slide-Over Drawer */}
      <AnimatePresence>
        {categoryDrawerOpen && (
          <div className="fixed inset-0 z-[90] lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCategoryDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Slide-Over Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[84%] max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Drawer Top Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div
                    onClick={() => {
                      onNavigate('/');
                      setCategoryDrawerOpen(false);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <img
                      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg"
                      alt="SAMI TV"
                      className="h-9 w-auto object-contain rounded-md border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-none">SAMI TV</h3>
                      <p className="text-[11px] font-medium text-slate-500 mt-1">{bnDate}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCategoryDrawerOpen(false)}
                    className="w-9 h-9 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="বন্ধ করুন"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Categories Grid */}
                <div className="p-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    সংবাদ বিভাগসমূহ
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategoriesList.map((cat) => {
                      const active = isCategoryActive(cat.href);
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            onNavigate(cat.href);
                            setCategoryDrawerOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                            active
                              ? 'bg-sami-red text-white border-sami-red'
                              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/70'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <ChevronRight size={14} className={active ? 'text-white' : 'text-slate-400'} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Portal Pages */}
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-5 mb-2.5">
                    অন্যান্য পাতা
                  </p>
                  <div className="space-y-1">
                    {portalLinks.map((item) => {
                      const active = isCategoryActive(item.href);
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            onNavigate(item.href);
                            setCategoryDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            active
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronRight size={14} className={active ? 'text-white' : 'text-slate-400'} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">সোশ্যাল মিডিয়া</span>
                  <div className="flex items-center gap-2">
                    {[
                      { icon: Facebook, href: 'https://www.facebook.com/samitvbd' },
                      { icon: Youtube, href: 'https://www.youtube.com/@stv2026Banglades' },
                      { icon: Twitter, href: '#' },
                      { icon: Instagram, href: '#' }
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-sami-red flex items-center justify-center transition-colors"
                      >
                        <social.icon size={15} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">© SAMI TV</span>
                  <button
                    onClick={() => {
                      onNavigate('/admin');
                      setCategoryDrawerOpen(false);
                    }}
                    className="text-sami-red hover:underline font-bold cursor-pointer"
                  >
                    এডমিন ও প্রতিনিধি লগইন →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Functional Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white border-b border-slate-200 shadow-lg"
          >
            <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-5 max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="সংবাদ বা বিভাগ খুঁজুন..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3.5 pl-4 pr-12 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-sami-red focus:bg-white transition-all"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                )}
              </div>

              {searchQuery.trim() !== '' && (
                <div className="mt-2.5 divide-y divide-slate-100 border border-slate-100 rounded-xl bg-white max-h-72 overflow-y-auto">
                  {filteredSearchNews.length > 0 ? (
                    filteredSearchNews.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          onNavigate(`/news/${item.id}`);
                        }}
                        className="w-full text-left p-2.5 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-14 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{item.category || 'সংবাদ'}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-center text-xs font-semibold text-slate-500">
                      কোনো সংবাদ পাওয়া যায়নি।
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Row: Logo & Ad (Desktop Only) */}
      <div className="hidden lg:flex container mx-auto px-4 py-5 flex-row items-center justify-between gap-4 max-w-[1650px]">
        {/* Logo Section */}
        <div className="flex items-center gap-6 shrink-0">
          <motion.div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => onNavigate('/')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SAMILogo className="scale-100 origin-center lg:origin-left" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden sm:flex flex-col border-l border-slate-200 pl-4 py-0.5"
          >
            <motion.h1
              className="text-[19px] font-black text-sami-dark leading-none tracking-tighter uppercase font-brand"
              whileHover={{ scale: 1.015, originX: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 15 }}
            >
              SAMI MULTIMEDIA <span className="text-sami-red">LTD.</span>
            </motion.h1>
            <p className="text-[8.5px] font-black text-gray-400 mt-1 uppercase tracking-[0.26em] font-brand">
              SAMI NETWORK BANGLADESH
            </p>
            <div className="flex items-center gap-2.5 mt-1.5">
              <span className="bg-slate-900 text-white px-2 py-0.5 rounded flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider font-brand">
                <span className="w-1.5 h-1.5 rounded-full bg-sami-red"></span>
                DIGITAL EDITION
              </span>
              <span className="text-[10px] font-bold text-slate-500 italic">
                বাংলায় কথা বলে...
              </span>
            </div>
          </motion.div>
        </div>

        {/* Middle Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hidden xl:flex flex-col items-center justify-center px-5 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs shrink-0"
        >
          <div className="flex items-center gap-2 text-slate-900 text-xs sm:text-sm font-black">
            <Calendar size={15} className="text-sami-red shrink-0" />
            <span>{bnDate}</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1.5 text-[11px] font-bold text-slate-600 tabular-nums">
            <span className="flex items-center gap-1 text-sami-red font-black">
              <Clock size={12} />
              <span>{formattedTime}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin size={12} className="text-sami-red shrink-0" />
              <span>জামালপুর</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
              <CloudSun size={13} className="text-amber-500 shrink-0" />
              <span>৩১° সে.</span>
            </span>
          </div>
        </motion.div>

        {/* Header Ad Slot (Desktop) */}
        <motion.div
          onClick={() => onNavigate('/contact')}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block flex-grow w-full lg:max-w-[728px] h-[90px] bg-transparent overflow-hidden group relative cursor-pointer select-none"
          title="বিজ্ঞাপন"
        >
          <motion.img
            src="https://globaltvbd.com/storage/advertisements/01KVZ4HKPS9DT08924H9Q9Y4GZ.jpg"
            alt="Sponsored Ad"
            className="w-full h-full object-contain transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-1 right-1 bg-black/75 backdrop-blur-sm text-[8px] font-black text-white/90 px-1.5 py-0.5 rounded uppercase tracking-widest pointer-events-none border border-white/10 z-10 shadow-sm">
            Sponsored Ad
          </div>
        </motion.div>
      </div>
    </header>
  );
};
