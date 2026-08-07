import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { Sidebar } from './Sidebar';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, X, Image as ImageIcon, Layout, Sparkles, Moon, ArrowRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onNewsClick: (news: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onNewsClick }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [reporters, setReporters] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [popupAd, setPopupAd] = useState<any>(null);
  const [contentAds, setContentAds] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    // Reporters for Home
    const qReporters = query(collection(db, 'reporters'), limit(6));
    const unsubscribeReporters = onSnapshot(qReporters, (snapshot) => {
      setReporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Media for Home
    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(4));
    const unsubscribeMedia = onSnapshot(qMedia, (snapshot) => {
      setMediaItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Popup Ad Subscription
    const qPopup = query(
      collection(db, 'ads'), 
      where('position', '==', 'popup'),
      where('active', '==', true),
      limit(1)
    );
    const unsubscribePopup = onSnapshot(qPopup, (snapshot) => {
      if (!snapshot.empty) {
        setPopupAd({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        // Show popup after 2 seconds
        setTimeout(() => setShowPopup(true), 2000);
      }
    });

    // Content Ad Subscription
    const qContent = query(
      collection(db, 'ads'), 
      where('position', '==', 'content'),
      where('active', '==', true),
      limit(1)
    );
    const unsubscribeContent = onSnapshot(qContent, (snapshot) => {
      setContentAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe();
      unsubscribeReporters();
      unsubscribeMedia();
      unsubscribePopup();
      unsubscribeContent();
    };
  }, []);

  // Helper to ensure exactly 7 items for any category section
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
      className="flex flex-col lg:flex-row gap-8"
    >
      <AnimatePresence>
        {showPopup && popupAd && (
          <div className="hidden lg:flex fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-lg w-full bg-white rounded-sm overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors z-10"
              >
                <X size={20} />
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

      <div className="flex-grow flex flex-col gap-8">
        <HeroSection onNewsClick={onNewsClick} onNavigate={onNavigate} />
        
        {/* Category: 'রাজনীতি' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">রাজনীতি</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/রাজনীতি')}
              className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group"
            >
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['রাজনীতি', 'Politics']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-colors line-clamp-2 duration-300">
                    {news.title}
                  </h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: 'জাতীয়' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">জাতীয়</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/জাতীয়')}
              className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group"
            >
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['জাতীয়', 'জাতীয়', 'National']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-colors line-clamp-2 duration-300">
                    {news.title}
                  </h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: 'সারা দেশ' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">সারা দেশ</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/সারা দেশ')}
              className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group"
            >
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['সারাদেশ', 'সারা দেশ', 'জেলা খবর']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-colors line-clamp-2 duration-300">
                    {news.title}
                  </h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: 'আন্তর্জাতিক' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">আন্তর্জাতিক</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/আন্তর্জাতিক')}
              className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group"
            >
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['আন্তর্জাতিক', 'International']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-colors line-clamp-2 duration-300">
                    {news.title}
                  </h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Categories: 'খেলাধুলা' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">খেলাধুলা</h2>
            </div>
            <button onClick={() => onNavigate('/category/খেলাধুলা')} className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group">
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['খেলাধুলা', 'খেলা', 'Sports']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-colors line-clamp-2 duration-300">
                    {news.title}
                  </h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories: 'বিনোদন' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">বিনোদন</h2>
            </div>
            <button onClick={() => onNavigate('/category/বিনোদন')} className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group">
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['বিনোদন', 'Entertainment']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-colors line-clamp-2 duration-300">
                    {news.title}
                  </h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combined Category: 'জামালপুর' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">জামালপুর</h2>
            </div>
            <button onClick={() => onNavigate('/category/জামালপুর')} className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group">
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['জামালপুর', 'Jamalpur']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-all line-clamp-2 duration-300">{news.title}</h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: 'তথ্য-প্রযুক্তি' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">তথ্য-প্রযুক্তি</h2>
            </div>
            <button onClick={() => onNavigate('/category/তথ্যপ্রযুক্তি')} className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group">
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['তথ্যপ্রযুক্তি', 'তথ্য-প্রযুক্তি', 'Tech']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-all line-clamp-2 duration-300">{news.title}</h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: 'সরিষাবাড়ী' - 5 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 bg-sami-red rounded-full"></span>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-sans">সরিষাবাড়ী</h2>
            </div>
            <button onClick={() => onNavigate('/category/সরিষাবাড়ী')} className="text-xs font-bold text-sami-red hover:text-red-700 transition-colors flex items-center gap-0.5 group">
              আরও খবর <span className="group-hover:translate-x-0.5 transition-transform">»</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {getCategoryNews(['সরিষাবাড়ী', 'Sarishabari']).map((news, idx) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className={`bg-white group cursor-pointer rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.045)] p-2 sm:p-2.5 transition-all duration-300 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-2.5 h-full ${
                  idx >= 6 ? 'hidden lg:flex' : ''
                }`}
              >
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                  <h3 className="font-bold text-[11px] sm:text-xs leading-snug text-gray-800 group-hover:text-sami-red transition-all line-clamp-2 duration-300">{news.title}</h3>
                </div>
                <div className="w-20 h-14 sm:w-24 sm:h-16 lg:w-full lg:h-auto lg:aspect-video shrink-0 overflow-hidden rounded-lg border border-gray-50 bg-slate-100 order-2 lg:order-1 mb-0 lg:mb-2">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-[320px] shrink-0 hidden lg:block">
        <Sidebar onNavigate={onNavigate} />
      </aside>
    </motion.div>
  );
};
