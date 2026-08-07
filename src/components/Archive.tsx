import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, Search, Clock, User, ArrowRight, FolderArchive, ChevronRight, FileText, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface ArchiveProps {
  onNewsClick: (news: any) => void;
  onNavigate: (page: string) => void;
}

export const Archive: React.FC<ArchiveProps> = ({ onNewsClick, onNavigate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get date from query string or default to today's YYYY-MM-DD
  const dateParam = searchParams.get('date');
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState<string>(dateParam || todayStr);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Keep state in sync with URL date param
  useEffect(() => {
    if (dateParam) {
      setSelectedDate(dateParam);
    }
  }, [dateParam]);

  // Fetch all news and filter by date
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNewsList(allNews);
      setIsLoading(false);
    }, (error) => {
      console.error("Archive fetch error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter news based on selectedDate and category
  useEffect(() => {
    if (!selectedDate) {
      setFilteredNews(newsList);
      return;
    }

    const targetDate = new Date(selectedDate);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const matched = newsList.filter(item => {
      if (!item.createdAt) return false;
      
      let itemDate: Date | null = null;

      // Handle Firestore Timestamp or string or Date
      if (typeof item.createdAt?.toDate === 'function') {
        itemDate = item.createdAt.toDate();
      } else if (item.createdAt?.seconds) {
        itemDate = new Date(item.createdAt.seconds * 1000);
      } else {
        itemDate = new Date(item.createdAt);
      }

      if (isNaN(itemDate.getTime())) return false;

      const sameDate = (
        itemDate.getFullYear() === targetYear &&
        itemDate.getMonth() === targetMonth &&
        itemDate.getDate() === targetDay
      );

      if (!sameDate) return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    setFilteredNews(matched);
  }, [selectedDate, selectedCategory, newsList]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setSearchParams({ date: newDate });
  };

  // Format date for Bengali display
  const formatBengaliDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('bn-BD', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const categories = ['all', 'জাতীয়', 'রাজনীতি', 'অর্থনীতি', 'সারা দেশ', 'আন্তর্জাতিক', 'জামালপুর', 'সরিষাবাড়ী', 'খেলাধুলা', 'তথ্যপ্রযুক্তি', 'বিনোদন'];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <button onClick={() => onNavigate('/')} className="hover:text-sami-red transition-colors">প্রচ্ছদ</button>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-sami-red font-black">সংবাদ আর্কাইভ (Archive)</span>
      </div>

      {/* Hero Header & Filter Controls Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-slate-700 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <FolderArchive size={260} />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-sami-red text-xs font-black uppercase tracking-widest mb-1">
                <FolderArchive size={16} />
                <span>পুরানো সংবাদ সংগ্রহশাল</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                সংবাদ আর্কাইভ (News Archive)
              </h1>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3">
              <Calendar size={18} className="text-sami-red shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">নির্বাচিত তারিখ</p>
                <p className="text-xs sm:text-sm font-bold text-slate-100">{formatBengaliDate(selectedDate)}</p>
              </div>
            </div>
          </div>

          {/* Date Selector Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="md:col-span-5 flex items-center gap-3">
              <label className="text-xs font-bold text-slate-300 shrink-0 flex items-center gap-1.5">
                <Search size={14} className="text-sami-red" />
                তারিখ নির্ধারণ করুন:
              </label>
              <input 
                type="date"
                value={selectedDate}
                max={todayStr}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-sami-red cursor-pointer"
              />
            </div>

            {/* Quick Presets */}
            <div className="md:col-span-7 flex flex-wrap items-center gap-2 justify-start md:justify-end">
              <button
                onClick={() => handleDateChange(todayStr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDate === todayStr 
                    ? 'bg-sami-red text-white shadow-md' 
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                আজকের খবর
              </button>

              <button
                onClick={() => {
                  const y = new Date();
                  y.setDate(y.getDate() - 1);
                  handleDateChange(y.toISOString().split('T')[0]);
                }}
                className="px-3 py-1.5 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all"
              >
                গতকালকের খবর
              </button>

              <button
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() - 7);
                  handleDateChange(d.toISOString().split('T')[0]);
                }}
                className="px-3 py-1.5 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all"
              >
                ৭ দিন আগে
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Sub-Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-gray-500 shrink-0 flex items-center gap-1 pr-1">
          <Filter size={13} className="text-sami-red" /> বিভাগ:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-sami-red text-white border-sami-red shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {cat === 'all' ? 'সকল বিভাগ' : cat}
          </button>
        ))}
      </div>

      {/* News Result Count Banner */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-sami-red" />
          <h2 className="text-lg font-black text-slate-900">
            {formatBengaliDate(selectedDate)}-এর প্রকাশিত সংবাদ
          </h2>
        </div>
        <span className="bg-red-50 text-sami-red text-xs font-extrabold px-3 py-1 rounded-full border border-red-100">
          মোট {filteredNews.length} টি সংবাদ পাওয়া গেছে
        </span>
      </div>

      {/* Main News Grid */}
      {isLoading ? (
        <div className="py-16 text-center bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 border-4 border-sami-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-gray-500">সংবাদ লোড করা হচ্ছে...</p>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredNews.map((news) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onNewsClick(news)}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img 
                  src={news.imageUrl} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {news.category && (
                  <span className="absolute top-2 left-2 bg-sami-red text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-sm">
                    {news.category}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 text-sm leading-snug group-hover:text-sami-red transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {news.content ? news.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...' : ''}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-sami-red" />
                    {news.journalistName || 'বিশেষ প্রতিনিধি'}
                  </span>
                  <span className="flex items-center gap-1 text-sami-red group-hover:translate-x-1 transition-transform">
                    বিস্তারিত <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-16 bg-white rounded-xl border border-gray-200 shadow-sm text-center p-6 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-red-50 text-sami-red rounded-full flex items-center justify-center mx-auto border border-red-100">
            <Calendar size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">এই তারিখে কোনো সংবাদ পাওয়া যায়নি</h3>
            <p className="text-xs text-gray-500 font-medium">
              {formatBengaliDate(selectedDate)}-এ প্রকাশিত কোনো সংবাদ আর্কাইভভুক্ত নেই। অনুগ্রহ করে অন্য কোনো তারিখ নির্বাচন করুন।
            </p>
          </div>
          <button 
            onClick={() => handleDateChange(todayStr)}
            className="bg-sami-red text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm inline-flex items-center gap-2"
          >
            আজকের সকল সংবাদ দেখুন <ArrowRight size={14} />
          </button>
        </div>
      )}

    </div>
  );
};
