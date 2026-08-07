import React, { useState, useEffect } from 'react';
import { Facebook, Layout, Radio, Download, Smartphone, Sparkles, Moon, ArrowRight } from 'lucide-react';
import { LiveTVPlayer } from './LiveTVPlayer';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';

export const Sidebar: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);
  const [sdNews, setSdNews] = useState<any[]>([]);
  const [archiveDate, setArchiveDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleArchiveSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (archiveDate && onNavigate) {
      onNavigate(`/archive?date=${archiveDate}`);
    }
  };

  useEffect(() => {
    // Sidebar Ads
    const qAds = query(
      collection(db, 'ads'), 
      where('position', '==', 'sidebar'),
      where('active', '==', true),
      limit(2)
    );
    const unsubscribeAds = onSnapshot(qAds, (snapshot) => {
      setSidebarAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // News for Sidebar Categories
    const qSD = query(
      collection(db, 'news'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubscribeSD = onSnapshot(qSD, (snapshot) => {
      setSdNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAds();
      unsubscribeSD();
    };
  }, []);

  return (
    <div className="hidden lg:flex flex-col gap-6">
      {/* Archive Section */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="bg-[#004a7c] text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
          <span>সংবাদ আর্কাইভ (Archive)</span>
        </div>
        <div className="p-3.5 bg-gray-50/50">
          <form onSubmit={handleArchiveSearch} className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-600">তারিখ নির্বাচন করুন:</label>
            <input 
              type="date"
              value={archiveDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setArchiveDate(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-sami-red bg-white text-gray-800 cursor-pointer shadow-inner"
            />
            <button 
              type="submit"
              className="w-full bg-[#1d70b8] hover:bg-[#004a7c] text-white px-4 py-2 text-xs font-black rounded-sm transition-colors shadow-sm flex items-center justify-center gap-1.5 mt-1"
            >
              সংবাদ খুঁজুন (Search)
            </button>
          </form>
        </div>
      </div>

      {/* Facebook Section */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="bg-[#004a7c] text-white px-4 py-2 font-bold text-sm uppercase tracking-tighter">ফেসবুকে আমরা..</div>
        <div className="p-0 border-b border-gray-100">
          <iframe 
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsamitvbd&tabs&width=320&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
            width="100%" 
            height="130" 
            style={{ border: 'none', overflow: 'hidden' }} 
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Sami TV Facebook Page"
          ></iframe>
        </div>
        <div className="p-3">
          <a 
            href="https://www.facebook.com/samitvbd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-2 bg-[#1877F2] text-white text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-[#166fe5] transition-all rounded-sm font-eng shadow-sm"
          >
            <Facebook size={12} fill="currentColor" /> Visit samitvbd
          </a>
        </div>
      </div>

      {/* Live TV Player Widget - Hidden on Mobile */}
      <div className="hidden lg:block bg-white rounded-sm shadow-sm overflow-hidden border-t-4 border-red-600">
        <div className="bg-red-50 px-4 py-2 flex items-center justify-between border-b border-red-100">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-red-600" />
            <span className="font-bold text-sm text-red-800 uppercase tracking-wider">LIVE TV</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
            <span className="text-[10px] font-bold text-red-600 uppercase">LIVE</span>
          </div>
        </div>
        <div className="p-2 bg-gray-50">
          <LiveTVPlayer />
        </div>
      </div>

      {/* Information Ad - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col gap-4">
        <div className="p-2 border-2 border-yellow-400 bg-yellow-50 rounded-sm shadow-sm">
          <div className="bg-white p-3 border border-yellow-200 rounded-sm">
            <h6 className="text-[10px] font-bold text-red-600 mb-2 text-center uppercase tracking-widest">বিজ্ঞপ্তি</h6>
            <div className="bg-red-600 text-white p-4 rounded-sm text-center font-bold text-sm shadow-inner mb-3">
              আপনার প্রতিষ্ঠানের সঠিক ও নির্ভরযোগ্য প্রচারের জন্য আজই যোগাযোগ করুন
            </div>
            <div className="bg-sami-dark text-white p-4 rounded-sm text-center border-l-4 border-yellow-400">
               <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Advertisement Hotline</p>
               <p className="text-xs font-black text-sami-red">COMING SOON</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Specific Ads - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col gap-4">
        <div className="bg-white border-2 border-sami-red/30 rounded-md overflow-hidden shadow-md group cursor-pointer relative p-1 bg-gradient-to-b from-gray-50 to-white">
          <div className="relative w-full overflow-hidden rounded-sm">
            <img 
              src="https://globaltvbd.com/storage/advertisements/01KVZ4HKPS9DT08924H9Q9Y4GZ.jpg" 
              alt="Sponsored Ad" 
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500 block"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 right-2 bg-sami-red text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-md">
              Sponsored Ad
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Category Blocks */}
      {['জাতীয়', 'সারাদেশ', 'আন্তর্জাতিক'].map((cat, idx) => {
        const catNews = sdNews.filter(n => n.category === cat || (cat === 'সারাদেশ' && (n.category === 'সারা দেশ' || n.category === 'সারাদেশ'))).slice(0, 4);
        if (catNews.length === 0) return null;
        
        return (
          <div key={idx} className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div className="bg-[#1a1a1a] text-white px-4 py-2 font-bold text-[13px] flex items-center gap-2">
               <span className="text-sami-red font-black">■</span> {cat === 'সারাদেশ' ? 'সারা দেশ' : cat}
            </div>
            <div className="p-3 space-y-3">
              {catNews[0] && (
                <div 
                  className="group cursor-pointer border-b border-gray-100 pb-3"
                  onClick={() => {}}
                >
                  <div className="aspect-video overflow-hidden mb-2 border border-gray-100 rounded-sm">
                     <img src={catNews[0].imageUrl} alt={catNews[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="text-[12px] font-bold leading-tight group-hover:text-sami-red line-clamp-2 transition-colors">{catNews[0].title}</h4>
                </div>
              )}
              <div className="space-y-2">
                {catNews.slice(1, 4).map((news) => (
                  <div key={news.id} className="group cursor-pointer flex gap-1 items-start">
                     <span className="text-gray-400 text-[10px] mt-0.5">»</span>
                     <h5 className="text-[11px] font-bold text-gray-700 leading-tight group-hover:text-sami-red line-clamp-2 transition-colors">
                        {news.title}
                     </h5>
                  </div>
                ))}
              </div>
              <button className="w-full py-1 text-[10px] font-bold text-sami-red hover:underline text-right uppercase tracking-wider font-eng">More News.. »</button>
            </div>
          </div>
        );
      })}

      {/* Sidebar Image Ads - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col gap-4">
        {sidebarAds.map((ad) => (
          <a 
            key={ad.id} 
            href={ad.link || '#'} 
            target={ad.link ? "_blank" : "_self"} 
            rel="noopener noreferrer"
            className="block bg-white rounded-sm shadow-sm overflow-hidden group border border-gray-200"
          >
            <div className="relative overflow-hidden">
              <img 
                src={ad.imageUrl} 
                alt={ad.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute top-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded uppercase">AD</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
