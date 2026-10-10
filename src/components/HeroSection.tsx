import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, ChevronsRight } from 'lucide-react';

interface HeroSectionProps {
  onNewsClick: (news: any) => void;
  onNavigate?: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNewsClick, onNavigate }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const featuredCount = Math.min(newsList.length, 5);
    if (featuredCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCount);
    }, 5000);

    return () => clearInterval(timer);
  }, [newsList]);

  if (newsList.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-h-[200px] sm:min-h-[300px]">
        <div className="lg:col-span-8 bg-slate-100 animate-pulse rounded-2xl h-[195px] sm:h-[360px]"></div>
        <div className="lg:col-span-4 bg-slate-100 animate-pulse rounded-2xl h-[240px] sm:h-[360px]"></div>
      </div>
    );
  }

  const sliderNews = newsList.slice(0, 5);
  const featured = sliderNews[currentIndex] || newsList[0];
  const latestNews = newsList.slice(0, 4);

  return (
    <motion.div 
      id="home_upper_layout" 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch"
    >
      {/* COLUMN 1: Main Featured News Slider (span-8) */}
      <div id="col_editor_choice" className="lg:col-span-8 flex flex-col h-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={featured?.id || currentIndex}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.85 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNewsClick(featured)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 p-3 sm:p-5 flex flex-row items-stretch justify-between gap-3 sm:gap-6 group cursor-pointer h-full min-h-[185px] sm:min-h-[310px]"
          >
            {/* Text Block (Left on both Mobile and Desktop) */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div className="space-y-1.5 sm:space-y-3">
                {featured?.category && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold text-sami-red truncate">
                    <span className="truncate">{featured.category}</span>
                    {featured.location && (
                      <>
                        <span className="text-slate-300 shrink-0">·</span>
                        <span className="text-slate-500 truncate">{featured.location}</span>
                      </>
                    )}
                  </div>
                )}

                <h2 className="text-[13.5px] sm:text-xl lg:text-2xl font-black text-slate-900 leading-snug group-hover:text-sami-red transition-colors line-clamp-2 sm:line-clamp-3">
                  {featured?.title}
                </h2>
                
                <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                  {featured?.content 
                    ? featured.content.replace(/<[^>]*>/g, '').slice(0, 180) + "..." 
                    : "দেশ-বিদেশের সর্বশেষ সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে SAMI TV।"}
                </p>
              </div>
              
              {/* Bottom Metadata & Slider Dots */}
              <div className="pt-2 sm:pt-3 border-t border-slate-100 mt-2 sm:mt-3 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0">
                <div className="flex items-center gap-1 sm:gap-1.5 text-[9.5px] sm:text-xs font-semibold text-slate-500 whitespace-nowrap">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                  <span>{new Date(featured?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  {sliderNews.length > 1 && (
                    <div className="flex gap-1 sm:gap-1.5 items-center">
                      {sliderNews.map((_, i) => (
                        <button 
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(i);
                          }}
                          className={`transition-all duration-200 rounded-full ${
                            currentIndex === i 
                              ? 'w-3 sm:w-4 h-1 sm:h-1.5 bg-sami-red' 
                              : 'w-1 sm:w-1.5 h-1 sm:h-1.5 bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] sm:text-xs font-bold text-sami-red flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0 whitespace-nowrap">
                    <span>বিস্তারিত</span>
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Image Block (Right Column on both Mobile and Desktop) */}
            <div className="w-[43%] sm:w-[46%] shrink-0 rounded-xl overflow-hidden bg-slate-100 relative border border-slate-100">
              <img 
                src={featured?.imageUrl} 
                alt={featured?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* COLUMN 2: সর্বশেষ খবর (span-4) */}
      <div id="col_latest_news" className="lg:col-span-4 h-full">
        {/* MOBILE ONLY VIEW: Compact 3-column layout showing 3 latest news items */}
        <div className="sm:hidden bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Header Box */}
          <div className="m-2 mb-0 px-3 py-1.5 bg-[#f8f9fa] border border-slate-200/80 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-4 bg-[#990000] rounded-full shrink-0" />
              <h2 className="text-[15px] font-extrabold text-[#8b0000] leading-snug tracking-tight">
                সর্বশেষ খবর
              </h2>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('/archive')}
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
            {latestNews.slice(0, 3).map((news) => (
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

        {/* DESKTOP & TABLET VIEW (Unchanged) */}
        <div className="hidden sm:flex flex-col bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs h-full justify-between">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
            <h2 className="text-base font-black text-slate-900 tracking-tight">সর্বশেষ খবর</h2>
            <button 
              onClick={() => onNavigate && onNavigate('/archive')} 
              className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group cursor-pointer"
            >
              <span>সব খবর</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Vertical News List */}
          <div className="flex flex-col divide-y divide-slate-100">
            {latestNews.map((news) => (
              <div 
                key={news.id} 
                onClick={() => onNewsClick(news)}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 group cursor-pointer"
              >
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-sami-red transition-colors">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span>{new Date(news.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })}</span>
                    {(news.location || news.category) && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="text-sami-red font-semibold truncate">{news.location || news.category}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                  <img 
                    src={news.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
