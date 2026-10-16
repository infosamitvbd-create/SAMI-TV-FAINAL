import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { Sidebar } from './Sidebar';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronsRight, Calendar } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onNewsClick: (news: any) => void;
}

const categorySections = [
  { title: 'জাতীয়', slug: 'জাতীয়', keywords: ['জাতীয়', 'জাতীয়', 'National'] },
  { title: 'রাজনীতি', slug: 'রাজনীতি', keywords: ['রাজনীতি', 'Politics'] },
  { title: 'সারা দেশ', slug: 'সারা দেশ', keywords: ['সারাদেশ', 'সারা দেশ', 'জেলা খবর'] },
  { title: 'জামালপুর', slug: 'জামালপুর', keywords: ['জামালপুর', 'Jamalpur'] },
  { title: 'সরিষাবাড়ী', slug: 'সরিষাবাড়ী', keywords: ['সরিষাবাড়ী', 'Sarishabari'] },
  { title: 'আন্তর্জাতিক', slug: 'আন্তর্জাতিক', keywords: ['আন্তর্জাতিক', 'International'] },
  { title: 'খেলাধুলা', slug: 'খেলাধুলা', keywords: ['খেলাধুলা', 'খেলা', 'Sports'] },
  { title: 'বিনোদন', slug: 'বিনোদন', keywords: ['বিনোদন', 'Entertainment'] },
  { title: 'তথ্য-প্রযুক্তি', slug: 'তথ্যপ্রযুক্তি', keywords: ['তথ্যপ্রযুক্তি', 'তথ্য-প্রযুক্তি', 'Tech'] },
];

export const Home: React.FC<HomeProps> = ({ onNavigate, onNewsClick }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [popupAd, setPopupAd] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    const qPopup = query(
      collection(db, 'ads'), 
      where('position', '==', 'popup'),
      where('active', '==', true),
      limit(1)
    );
    const unsubscribePopup = onSnapshot(qPopup, (snapshot) => {
      if (!snapshot.empty) {
        setPopupAd({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        setTimeout(() => setShowPopup(true), 12000);
      }
    });

    return () => {
      unsubscribe();
      unsubscribePopup();
    };
  }, []);

  const getCategoryNews = (categoryKeywords: string[], count = 7) => {
    if (!newsList || newsList.length === 0) return [];
    
    const matches = newsList.filter(n => {
      if (!n || !n.category) return false;
      const catStr = String(n.category).trim().toLowerCase();
      return categoryKeywords.some(kw => catStr === kw.toLowerCase() || catStr.includes(kw.toLowerCase()));
    });

    if (matches.length >= count) {
      return matches.slice(0, count);
    }

    const matchIds = new Set(matches.map(m => m.id));
    const fallback = newsList.filter(n => n && n.id && !matchIds.has(n.id));
    return [...matches, ...fallback].slice(0, count);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row gap-5 sm:gap-8"
    >
      <AnimatePresence>
        {showPopup && popupAd && (
          <div className="hidden lg:flex fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors z-10 cursor-pointer"
              >
                <X size={18} />
              </button>
              <a 
                href={popupAd.link || '#'} 
                target={popupAd.link ? "_blank" : "_self"} 
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src={popupAd.imageUrl} 
                  alt={popupAd.title} 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </a>
              <div className="p-2 bg-sami-red text-white text-[10px] text-center font-bold uppercase tracking-widest">
                বিজ্ঞাপন
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-grow flex flex-col gap-5 sm:gap-8">
        <HeroSection onNewsClick={onNewsClick} onNavigate={onNavigate} />

        {/* 1st Sponsored Ad Banner (Fast) */}
        <div 
          onClick={() => onNavigate('/contact')}
          className="w-full bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden group cursor-pointer relative p-1.5 sm:p-2 bg-gradient-to-r from-slate-50 via-white to-slate-50 transition-all hover:border-sami-red/40"
          title="বিজ্ঞাপন ১"
        >
          <div className="relative w-full overflow-hidden rounded-lg max-h-[140px] sm:max-h-[110px] flex items-center justify-center bg-slate-50">
            <img 
              src="https://globaltvbd.com/storage/advertisements/01KVZ4HKPS9DT08924H9Q9Y4GZ.jpg" 
              alt="Sponsored Ad 1" 
              className="w-full h-full max-h-[140px] sm:max-h-[110px] object-contain group-hover:scale-[1.01] transition-transform duration-500 block"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider pointer-events-none">
              Sponsored Ad
            </div>
          </div>
        </div>

        {categorySections.map((section, idx) => {
          const items = getCategoryNews(section.keywords);
          if (items.length === 0) return null;

          return (
            <React.Fragment key={section.slug}>
              <section>
              {/* MOBILE ONLY VIEW (Compact 3-column layout showing 3 news items) */}
              <div className="sm:hidden bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                {/* Category Header Box */}
                <div className="m-2 mb-0 px-3 py-1.5 bg-[#f8f9fa] border border-slate-200/80 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-4 bg-[#990000] rounded-full shrink-0" />
                    <h2 className="text-[15px] font-extrabold text-[#8b0000] leading-snug tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => onNavigate(`/category/${section.slug}`)}
                    className="flex items-center gap-1 text-[11.5px] font-bold text-[#8b0000] active:opacity-75 cursor-pointer"
                  >
                    <span>আরও দেখুন</span>
                    <span className="flex items-center -space-x-1.5 text-[#8b0000]">
                      <ChevronRight size={13} strokeWidth={2.8} />
                      <ChevronRight size={13} strokeWidth={2.8} className="opacity-65" />
                      <ChevronRight size={13} strokeWidth={2.8} className="opacity-35" />
                    </span>
                  </button>
                </div>

                {/* 3-Column Compact Mobile News Card Grid (3 News Items) */}
                <div className="p-2.5 grid grid-cols-3 gap-2">
                  {items.slice(0, 3).map((news) => (
                    <div
                      key={news.id}
                      onClick={() => onNewsClick(news)}
                      className="flex flex-col h-full group cursor-pointer min-w-0"
                    >
                      {/* Thumbnail Image */}
                      <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-slate-100">
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Headline */}
                      <h3 className="font-extrabold text-[11px] leading-[1.3] text-slate-900 group-hover:text-sami-red transition-colors line-clamp-2 mb-1">
                        {news.title}
                      </h3>

                      {/* Short Excerpt */}
                      <p className="text-[9.5px] leading-[1.35] text-slate-500 line-clamp-2 mb-1.5 font-normal">
                        {news.content
                          ? news.content.replace(/<[^>]*>/g, '').slice(0, 75) + '...'
                          : 'বিস্তারিত সংবাদ পড়ুন...'}
                      </p>

                      {/* Divider, Date & Read More */}
                      <div className="border-t border-slate-200/80 pt-1.5 mt-auto flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-[8.5px] text-slate-500 font-medium whitespace-nowrap truncate">
                          <Calendar size={9} className="text-slate-500 shrink-0" />
                          <span className="truncate">
                            {new Date(
                              news.createdAt?.seconds * 1000 || Date.now()
                            ).toLocaleDateString('bn-BD', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-[#990000]">
                          <span>বিস্তারিত</span>
                          <ChevronsRight size={11} className="text-red-300 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESKTOP VIEW (Single Row of 6 Compact News Items) */}
              <div className="hidden sm:block bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 lg:p-4">
                <div className="flex items-center justify-between border-b border-slate-200/90 pb-2.5 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#990000] rounded-full shrink-0" />
                    <h2 className="text-base lg:text-lg font-black text-slate-900 tracking-tight font-sans">
                      {section.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => onNavigate(`/category/${section.slug}`)}
                    className="text-xs lg:text-sm font-bold text-[#8b0000] hover:text-red-700 transition-colors flex items-center gap-1 group cursor-pointer"
                  >
                    <span>আরও দেখুন</span>
                    <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Single Serial Row: 6 News Items */}
                <div className="grid grid-cols-6 divide-x divide-slate-200/90">
                  {items.slice(0, 6).map((news) => (
                    <div
                      key={news.id}
                      onClick={() => onNewsClick(news)}
                      className="group cursor-pointer flex flex-col min-w-0 px-2.5 lg:px-3 first:pl-0 last:pr-0"
                    >
                      <div className="w-full aspect-[16/10] overflow-hidden rounded-md bg-slate-100 border border-slate-100 mb-2">
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h3 className="font-bold text-[11.5px] lg:text-[12.5px] leading-[1.35] text-slate-900 group-hover:text-sami-red transition-colors line-clamp-3">
                        {news.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
              </section>

              {/* 2nd Sponsored Ad Banner */}
              {idx === 1 && (
                <div 
                  onClick={() => onNavigate('/contact')}
                  className="w-full bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden group cursor-pointer relative p-1.5 sm:p-2 bg-gradient-to-r from-slate-50 via-white to-slate-50 transition-all hover:border-sami-red/40"
                  title="বিজ্ঞাপন ২"
                >
                  <div className="relative w-full overflow-hidden rounded-lg max-h-[140px] sm:max-h-[110px] flex items-center justify-center bg-slate-50">
                    <img 
                      src="https://globaltvbd.com/storage/advertisements/01KVZ4HKPS9DT08924H9Q9Y4GZ.jpg" 
                      alt="Sponsored Ad 2" 
                      className="w-full h-full max-h-[140px] sm:max-h-[110px] object-contain group-hover:scale-[1.01] transition-transform duration-500 block"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider pointer-events-none">
                      Sponsored Ad
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <aside className="w-full lg:w-[320px] shrink-0 hidden lg:block">
        <Sidebar onNavigate={onNavigate} />
      </aside>
    </motion.div>
  );
};
