import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Clock, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onNewsClick: (news: any) => void;
  onNavigate?: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNewsClick, onNavigate }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch news items
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Set up carousel interval
  useEffect(() => {
    const featuredCount = Math.min(newsList.length, 5);
    if (featuredCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCount);
    }, 5000); // 5 seconds interval for natural reading pace

    return () => clearInterval(timer);
  }, [newsList]);

  if (newsList.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[380px]">
        <div className="lg:col-span-8 bg-gray-100 animate-pulse rounded-2xl h-[380px]"></div>
        <div className="lg:col-span-4 bg-gray-100 animate-pulse rounded-2xl h-[380px]"></div>
      </div>
    );
  }

  // Column 1 Components: Slider (first 5 news)
  const sliderNews = newsList.slice(0, 5);
  const featured = sliderNews[currentIndex] || newsList[0];

  // Column 2 Components: Latest news
  const latestNews = newsList.slice(0, 4);

  return (
    <motion.div 
      id="home_upper_layout" 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
    >
      
      {/* COLUMN 1: Main Featured News Slider (span-8) */}
      <div id="col_editor_choice" className="lg:col-span-8 flex flex-col h-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={featured?.id || currentIndex}
            initial={{ opacity: 0.8, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.8, x: -10 }}
            transition={{ duration: 0.3 }}
            onClick={() => onNewsClick(featured)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-5 flex flex-row items-center sm:items-stretch justify-between gap-3 sm:gap-6 group cursor-pointer h-full min-h-[140px] sm:min-h-[300px]"
          >
            {/* Left Text Block */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full py-0.5 sm:py-1">
              <div className="space-y-1.5 sm:space-y-3">
                <h3 className="text-xs sm:text-xl font-black text-slate-900 leading-snug group-hover:text-sami-red transition-colors line-clamp-3 sm:line-clamp-4">
                  {featured?.title}
                </h3>
                
                <p className="hidden sm:block text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-4 font-medium">
                  {featured?.content 
                    ? featured.content.replace(/<[^>]*>/g, '').slice(0, 200) + "..." 
                    : "দেশ-বিদেশের সর্বশেষ সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে SAMI TV।"}
                </p>
              </div>
              
              {/* Bottom Info & Slider Dots */}
              <div className="pt-2 sm:pt-3 border-t border-slate-100 mt-2 sm:mt-3 flex flex-col gap-1.5 sm:gap-2 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-500">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    <span>{new Date(featured?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  <span className="text-[10px] sm:text-xs font-bold text-sami-red group-hover:translate-x-1 transition-transform shrink-0">
                    বিস্তারিত &gt;
                  </span>
                </div>

                {/* Dot Indicators */}
                {sliderNews.length > 1 && (
                  <div className="flex gap-1.5 items-center pt-0.5">
                    {sliderNews.map((_, i) => (
                      <button 
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(i);
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          currentIndex === i 
                            ? 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-sami-red' 
                            : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Image Block */}
            <div className="w-24 sm:w-[46%] h-20 sm:h-auto shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 relative border border-slate-100">
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
      <div id="col_latest_news" className="lg:col-span-4 flex flex-col bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm h-full justify-between">
        {/* Header with Red Circle and More button */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sami-red inline-block"></span>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">সর্বশেষ খবর</h2>
          </div>
          <button 
            onClick={() => onNavigate && onNavigate('/category/all')} 
            className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group cursor-pointer"
          >
            <span>আরও</span>
            <span className="font-black text-sami-red group-hover:translate-x-0.5 transition-transform">&gt;&gt;&gt;</span>
          </button>
        </div>

        {/* Vertical News List */}
        <div className="flex flex-col gap-2.5">
          {latestNews.map((news) => (
            <div 
              key={news.id} 
              onClick={() => onNewsClick(news)}
              className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0 group cursor-pointer"
            >
              <div className="w-20 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src={news.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-sami-red transition-colors">
                  {news.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <div className="flex items-center gap-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(news.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {news.location && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-sami-red font-bold">{news.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
