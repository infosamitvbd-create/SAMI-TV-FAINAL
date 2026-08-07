import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Zap, Radio } from 'lucide-react';

interface BreakingNewsProps {
  isBottom?: boolean;
}

export const BreakingNews: React.FC<BreakingNewsProps> = ({ isBottom = false }) => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState<string | null>(null);

  useEffect(() => {
    // Ticker Subscription
    const unsubscribeTicker = onSnapshot(doc(db, 'settings', 'ticker'), (doc) => {
      if (doc.exists() && doc.data().text) {
        setTickerText(doc.data().text);
      }
    });

    // News Subscription (as fallback)
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(8));
    const unsubscribeNews = onSnapshot(q, (snapshot) => {
      setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeTicker();
      unsubscribeNews();
    };
  }, []);

  const containerClasses = isBottom
    ? "fixed bottom-0 left-0 right-0 z-50 bg-[#111111] text-white border-t-2 border-[#cc0000] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] h-11 flex items-center overflow-hidden select-none"
    : "bg-[#f4f5f7] border-b border-gray-200/80 h-11 flex items-center overflow-hidden relative select-none";

  const badgeBg = isBottom
    ? "bg-[#cc0000] text-white px-3.5 py-1 rounded-md flex items-center gap-2 shadow-sm shrink-0"
    : "bg-[#990000] px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-[0_2px_4px_rgba(153,0,0,0.3)] shrink-0";

  const textColor = isBottom ? "text-gray-100" : "text-slate-800";

  return (
    <div className={containerClasses}>
      <div className="w-full flex items-center h-full max-w-[1650px] mx-auto relative px-3 sm:px-4">
        
        {/* News Badge */}
        <div className={`z-20 ${isBottom ? 'bg-[#111111]' : 'bg-[#f4f5f7]'} flex items-center pr-3`}>
          <div className={badgeBg}>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-white font-extrabold text-[13px] sm:text-[14px] leading-none tracking-wide whitespace-nowrap">
              {isBottom ? 'ব্রেকিং নিউজ' : 'শিরোনাম'}
            </span>
          </div>
        </div>

        {/* Ticker Container Viewport */}
        <div className="w-full overflow-hidden relative h-full flex items-center z-10">
          {React.createElement(
            'marquee',
            {
              scrollamount: "5",
              behavior: "scroll",
              direction: "left",
              onMouseOver: (e: any) => e.currentTarget.stop(),
              onMouseOut: (e: any) => e.currentTarget.start(),
              className: `text-[13px] sm:text-[14px] font-bold ${textColor} w-full`
            },
            tickerText ? (
              <span className="inline-flex items-center gap-6 whitespace-nowrap">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="inline-flex items-center gap-3 mr-8">
                    <span>{tickerText}</span>
                    <span className="h-2 w-2 rounded-full bg-red-600 inline-block align-middle shrink-0"></span>
                  </span>
                ))}
              </span>
            ) : newsList.length > 0 ? (
              <span className="inline-flex items-center gap-6 whitespace-nowrap">
                {newsList.map((news) => (
                  <span 
                    key={news.id} 
                    onClick={() => navigate(`/news/${news.id}`)}
                    className="inline-flex items-center gap-3 hover:text-red-500 transition-colors duration-300 cursor-pointer mr-8"
                  >
                    <span className="text-red-500 font-extrabold">●</span>
                    <span>{news.title}</span>
                  </span>
                ))}
              </span>
            ) : (
              <span className="inline-flex items-center gap-3">
                <span>সামি টিভি ... সত্যের সন্ধানে নির্ভীক ... বস্তুনিষ্ঠ ও সঠিক সংবাদ দেখতে সাথে থাকুন ...</span>
                <span className="h-2 w-2 rounded-full bg-red-600 inline-block align-middle shrink-0"></span>
              </span>
            )
          )}
        </div>

      </div>
    </div>
  );
};

