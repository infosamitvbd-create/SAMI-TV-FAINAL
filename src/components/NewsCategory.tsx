import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, Clock } from 'lucide-react';

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
    const q = query(
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6"
    >
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between border-b-2 border-sami-red pb-3 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={onBack}
              className="text-sami-red hover:text-red-700 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> হোমে ফিরুন
            </button>
            <span className="text-slate-300 font-light">|</span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {category} <span className="text-sami-red">সংবাদ</span>
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            মোট নিউজ: {newsList.length}টি
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold text-sm">লোডিং...</div>
        ) : newsList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {newsList.map((news) => (
              <div 
                key={news.id} 
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 border border-slate-200/80 flex flex-col hover:-translate-y-1"
                onClick={() => onNewsClick(news)}
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {news.category && (
                    <span className="absolute top-2 left-2 bg-sami-red text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xs">
                      {news.category}
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-grow">
                  <h3 className="font-bold text-slate-900 leading-snug group-hover:text-sami-red transition-colors line-clamp-2 text-xs sm:text-sm">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-3 font-semibold pt-2 border-t border-slate-100">
                    <Clock size={11} className="text-sami-red shrink-0" />
                    <span className="truncate">
                      {news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 font-bold text-sm">
            এই ক্যাটাগরিতে এখনও কোনো নিউজ নেই।
          </div>
        )}
      </div>
    </motion.div>
  );
};
