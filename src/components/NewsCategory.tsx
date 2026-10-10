import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { ArrowLeft, Clock, Calendar, ChevronsRight } from 'lucide-react';

interface NewsCategoryProps {
  category: string;
  onBack: () => void;
  onNewsClick: (news: any) => void;
}

export const NewsCategory: React.FC<NewsCategoryProps> = ({ category, onBack, onNewsClick }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = category === 'all'
      ? query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(60))
      : query(
          collection(db, 'news'),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  const displayTitle = category === 'all' ? 'সকল' : category;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-[1650px] mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6"
    >
      {/* MOBILE ONLY VIEW: Compact 3-Column Card Grid */}
      <div className="sm:hidden bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="m-2 mb-0 px-3 py-1.5 bg-[#f8f9fa] border border-slate-200/80 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-4 bg-[#990000] rounded-full shrink-0" />
            <h1 className="text-[15px] font-extrabold text-[#8b0000] leading-snug tracking-tight">
              {displayTitle} সংবাদ
            </h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[11px] font-bold text-[#8b0000] active:opacity-75 cursor-pointer"
          >
            <ArrowLeft size={12} />
            <span>প্রচ্ছদ</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold text-xs">সংবাদ লোড হচ্ছে...</div>
        ) : newsList.length > 0 ? (
          <div className="p-2.5 grid grid-cols-3 gap-x-2 gap-y-3.5">
            {newsList.map((news) => (
              <div
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="flex flex-col h-full group cursor-pointer min-w-0"
              >
                <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-slate-100">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-extrabold text-[11px] leading-[1.3] text-slate-900 group-hover:text-sami-red transition-colors line-clamp-2 mb-1">
                  {news.title}
                </h3>
                <p className="text-[9.5px] leading-[1.35] text-slate-500 line-clamp-2 mb-1.5 font-normal">
                  {news.content
                    ? news.content.replace(/<[^>]*>/g, '').slice(0, 75) + '...'
                    : 'বিস্তারিত সংবাদ পড়ুন...'}
                </p>
                <div className="border-t border-slate-200/80 pt-1.5 mt-auto flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-[8.5px] text-slate-500 font-medium whitespace-nowrap truncate">
                    <Calendar size={9} className="text-slate-500 shrink-0" />
                    <span className="truncate">
                      {news.createdAt?.toDate
                        ? news.createdAt.toDate().toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'সামি টিভি'}
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
        ) : (
          <div className="text-center py-12 text-slate-400 font-bold text-xs">
            এই বিভাগে এখনও কোনো সংবাদ প্রকাশিত হয়নি।
          </div>
        )}
      </div>

      {/* DESKTOP & TABLET VIEW (3-Column Rows with Hairline Dividers matching screenshot) */}
      <div className="hidden sm:block bg-white p-5 lg:p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5 mb-5">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={onBack}
              className="text-sami-red hover:text-red-700 font-bold text-sm flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft size={16} />
              <span>প্রচ্ছদ</span>
            </button>
            <span className="text-slate-300">·</span>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight truncate">
              {displayTitle} <span className="text-sami-red">সংবাদ</span>
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-500 shrink-0 tabular-nums">
            মোট {newsList.length}টি
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 font-bold text-sm">সংবাদ লোড হচ্ছে...</div>
        ) : newsList.length > 0 ? (
          <div className="flex flex-col">
            {Array.from({ length: Math.ceil(newsList.length / 3) }).map((_, rowIndex) => {
              const rowItems = newsList.slice(rowIndex * 3, rowIndex * 3 + 3);
              return (
                <React.Fragment key={rowIndex}>
                  {rowIndex > 0 && (
                    <div className="border-t border-slate-200/90 my-4 lg:my-5" />
                  )}
                  <div className="grid grid-cols-3 divide-x divide-slate-200/90">
                    {rowItems.map((news, idx) => (
                      <div
                        key={news.id}
                        onClick={() => onNewsClick(news)}
                        className={`group cursor-pointer flex flex-col ${
                          idx === 0
                            ? 'pr-4 lg:pr-5'
                            : idx === 1
                            ? 'px-4 lg:px-5'
                            : 'pl-4 lg:pl-5'
                        }`}
                      >
                        <div className="w-full aspect-[16/10] overflow-hidden rounded-lg bg-slate-100 border border-slate-100 mb-2.5">
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h3 className="font-bold text-[15px] lg:text-[17px] leading-[1.38] text-slate-900 group-hover:text-sami-red transition-colors line-clamp-3">
                          {news.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 font-bold text-sm">
            এই বিভাগে এখনও কোনো সংবাদ প্রকাশিত হয়নি।
          </div>
        )}
      </div>
    </motion.div>
  );
};
