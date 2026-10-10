import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface BreakingNewsProps {
  isBottom?: boolean;
}

export const BreakingNews: React.FC<BreakingNewsProps> = ({ isBottom = false }) => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeTicker = onSnapshot(doc(db, 'settings', 'ticker'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().text) {
        setTickerText(docSnap.data().text);
      } else {
        setTickerText(null);
      }
    });

    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(12));
    const unsubscribeNews = onSnapshot(q, (snapshot) => {
      setNewsList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeTicker();
      unsubscribeNews();
    };
  }, []);

  const containerClasses = isBottom
    ? "fixed bottom-0 left-0 right-0 z-50 bg-[#111111] text-white border-t border-sami-red h-8 sm:h-9 flex items-center overflow-hidden select-none"
    : "bg-gradient-to-r from-white via-[#fafafa] to-[#f3f4f6] border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-8 sm:h-9 flex items-center overflow-hidden relative select-none";

  const textColor = isBottom ? "text-gray-100" : "text-slate-800";

  return (
    <div className={containerClasses}>
      <div className="w-full flex items-center h-full max-w-[1650px] mx-auto relative px-2 sm:px-4">
        {/* Smooth Scrolling Headlines Viewport */}
        <div className="w-full overflow-hidden relative h-full flex items-center z-10">
          {/* Subtle left fade mask where text emerges from the badge */}
          <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-3 z-20 bg-gradient-to-r ${isBottom ? 'from-[#111111]' : 'from-white'} to-transparent`} />

          {React.createElement(
            'marquee',
            {
              scrollamount: "4",
              behavior: "scroll",
              direction: "left",
              onMouseOver: (e: any) => e.currentTarget.stop(),
              onMouseOut: (e: any) => e.currentTarget.start(),
              className: `font-sans text-[12px] sm:text-[13px] font-semibold ${textColor} w-full flex items-center leading-normal`
            },
            tickerText ? (
              <span className="inline-flex items-center whitespace-nowrap">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="inline-flex items-center">
                    <span>{tickerText}</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-sami-red mx-4 shrink-0" />
                  </span>
                ))}
              </span>
            ) : newsList.length > 0 ? (
              <span className="inline-flex items-center whitespace-nowrap">
                {newsList.map((news) => (
                  <span 
                    key={news.id} 
                    onClick={() => navigate(`/news/${news.id}`)}
                    className="inline-flex items-center hover:text-sami-red transition-colors duration-200 cursor-pointer"
                  >
                    <span>{news.title}</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-sami-red mx-4 shrink-0" />
                  </span>
                ))}
              </span>
            ) : (
              <span className="inline-flex items-center">
                <span>সামি টিভি — সত্যের সাথে সবসময় — দেশ ও জনগণের বস্তুনিষ্ঠ সংবাদ দেখতে সাথে থাকুন</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sami-red mx-4 shrink-0" />
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};
