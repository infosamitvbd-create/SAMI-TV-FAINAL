import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Twitter, Instagram, Linkedin, MapPin, Calendar, Search, PlayCircle, MoreVertical, X, Grid, ChevronRight, UserCheck, User, PenTool, Clock, CloudSun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMILogo } from './SAMILogo';

const allCategoriesList = [
  { name: 'প্রচ্ছদ', href: '/' },
  { name: 'জাতীয়', href: '/category/জাতীয়' },
  { name: 'রাজনীতি', href: '/category/রাজনীতি' },
  { name: 'অর্থনীতি', href: '/category/অর্থনীতি' },
  { name: 'সারা দেশ', href: '/category/সারা দেশ' },
  { name: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { name: 'জামালপুর', href: '/category/জামালপুর' },
  { name: 'সরিষাবাড়ী', href: '/category/সরিষাবাড়ী' },
  { name: 'খেলাধুলা', href: '/category/খেলাধুলা' },
  { name: 'তথ্য-প্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
  { name: 'বিনোদন', href: '/category/বিনোদন' },
  { name: 'শিক্ষা', href: '/category/শিক্ষা' },
  { name: 'মতামত', href: '/category/মতামত' },
  { name: 'লাইফস্টাইল', href: '/category/লাইফস্টাইল' },
  { name: 'আর্কাইভ', href: '/archive' },
  { name: 'মিডিয়া গ্যালারি', href: '/media' },
  { name: 'লাইভ টিভি', href: '/live' },
  { name: 'আমাদের পরিবার', href: '/family' },
];

export const Header: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
}> = ({ onNavigate, currentPage }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDateEng = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const today = new Date();
  
  // Bengali Date Logic
  const bnOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const bnDate = today.toLocaleDateString('bn-BD', bnOptions);

  return (
    <header className="bg-white">
      {/* Mobile Top Header Bar (Hidden on PC view) */}
      <div className="lg:hidden border-b border-gray-100 bg-white py-2 px-3 sm:px-4 font-sans text-xs">
        <div className="container mx-auto flex flex-col gap-2 max-w-[1650px]">
          {/* Main Top Row for Mobile */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: 3-Dot Category Menu Button & Brand Title with SAMI TV Logo */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setCategoryDrawerOpen(!categoryDrawerOpen)}
                className="md:hidden p-1.5 bg-red-50 hover:bg-sami-red text-sami-red hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center border border-red-100 shadow-xs"
                title="সকল বিষয়শ্রেণী ও ক্যাটাগরি"
                aria-label="Category Menu"
              >
                <MoreVertical size={20} className="stroke-[2.5px]" />
              </button>

              {/* Logo + Brand Name */}
              <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => onNavigate('/')}
              >
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg" 
                  alt="Sami TV Logo" 
                  className="h-10 sm:h-12 w-auto object-contain rounded-lg drop-shadow-sm group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />

                <div className="flex flex-col">
                  <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-sami-red transition-colors">
                    SAMI TV
                  </span>
                  <span className="text-[9px] font-extrabold text-slate-500 tracking-normal leading-none mt-0.5">
                    সত্যের সাথে সবসময়
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Search & Live Button */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-slate-700 hover:text-sami-red transition-colors cursor-pointer"
              >
                <Search size={20} className="stroke-[2.5px]" />
              </button>

              <button 
                onClick={() => onNavigate('/live')}
                className="flex items-center gap-1 bg-sami-red text-white px-2.5 py-1 rounded-full text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-500/20 group cursor-pointer"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>লাইভ</span>
              </button>
            </div>
          </div>

          {/* Sub-bar Row: Date & Socials */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 text-[11px] sm:text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-1 text-slate-700">
              <Calendar size={14} className="text-sami-red stroke-[2.5px]" />
              <span>{bnDate}</span>
            </div>

            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, color: 'text-[#1877F2]', href: 'https://www.facebook.com/samitvbd' },
                { icon: Twitter, color: 'text-[#1DA1F2]', href: '#' },
                { icon: Youtube, color: 'text-[#FF0000]', href: 'https://www.youtube.com/@stv2026Banglades' },
                { icon: Instagram, color: 'text-[#E4405F]', href: '#' }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-0.5 hover:opacity-80 transition-all ${social.color}`}
                >
                  <social.icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Dot Click Category Modal Drawer */}
      <AnimatePresence>
        {categoryDrawerOpen && (
          <div className="fixed inset-0 z-[90] flex items-start justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5 sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-sami-red text-white flex items-center justify-center font-black shadow-md shadow-red-500/20">
                    <Grid size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">সকল খবর ও বিষয়শ্রেণী</h3>
                    <p className="text-[11px] font-bold text-slate-500">SAMI TV ক্যাটাগরি মেন্যু</p>
                  </div>
                </div>

                <button
                  onClick={() => setCategoryDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {allCategoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(cat.href);
                      setCategoryDrawerOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-sami-red hover:text-white border border-slate-200/80 transition-all font-extrabold text-xs text-slate-800 group shadow-xs cursor-pointer"
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>

              {/* Footer Quick Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>© SAMI TV</span>
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setCategoryDrawerOpen(false);
                  }}
                  className="text-sami-red hover:underline font-black"
                >
                  সাংবাদিক ও এডমিন পোর্টাল →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50 border-b border-gray-200"
          >
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="সংবাদ খুঁজুন..."
                  className="w-full bg-white border-2 border-sami-accent rounded-xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:border-sami-red transition-all shadow-xl shadow-sami-red/5"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-sami-red text-white rounded-lg hover:bg-sami-purple transition-colors shadow-lg shadow-sami-red/20">
                  <Search size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Header Row: Logo & Ad (Hidden on mobile) */}
      <div className="hidden lg:flex container mx-auto px-4 py-5 flex-row items-center justify-between gap-4 max-w-[1650px]">
        {/* Logo Section */}
        <div className="flex items-center gap-6 shrink-0">
          <motion.div 
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => onNavigate('/')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SAMILogo className="scale-100 origin-center lg:origin-left" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden sm:flex flex-col border-l-2 border-sami-red/20 pl-5 py-1"
          >
            <motion.h1 
              className="text-2xl font-black text-sami-dark leading-none tracking-tighter uppercase font-eng"
              whileHover={{ scale: 1.015, originX: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 15 }}
            >
              SAMI MULTIMEDIA <span className="text-sami-red">LTD.</span>
            </motion.h1>
            <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.3em] font-eng">
              SAMI NETWORK BANGLADESH
            </p>
            <div className="flex items-center gap-3 mt-2.5">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest font-eng"
              >
                <span className="w-1.5 h-1.5 bg-sami-red rounded-full animate-pulse"></span>
                Digital Edition
              </motion.div>
              <span className="text-[11px] text-gray-500 font-bold italic tracking-wide">
                বাংলায় কথা বলে...
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Middle Info Card (Fills white space between LTD logo & Sponsor Ad) */}
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hidden xl:flex flex-col items-center justify-center px-5 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs shrink-0"
        >
          <div className="flex items-center gap-2 text-slate-900 text-xs sm:text-sm font-black">
            <Calendar size={15} className="text-sami-red shrink-0" />
            <span>{bnDate}</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1.5 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1 text-sami-red font-black bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              <Clock size={12} />
              <span>{formattedTime}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin size={12} className="text-sami-red shrink-0" />
              <span>জামালপুর</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
              <CloudSun size={13} className="text-amber-500 shrink-0" />
              <span>৩১° সে.</span>
            </span>
          </div>
        </motion.div>

        {/* Header Ad Slot (Commercial Advertisement Space) - Hidden on mobile */}
        <motion.div 
          onClick={() => onNavigate('/contact')}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block flex-grow w-full lg:max-w-[728px] h-[90px] bg-transparent overflow-hidden group relative cursor-pointer select-none"
          title="বিজ্ঞাপন"
        >
          {/* Breathing image with continuous animation */}
          <motion.img 
            src="https://globaltvbd.com/storage/advertisements/01KVZ4HKPS9DT08924H9Q9Y4GZ.jpg" 
            alt="Sponsored Ad" 
            animate={{
              scale: [1, 1.015, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full object-contain transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Premium Animated Shimmer Shine Overlay */}
          <motion.div
            initial={{ left: '-150%' }}
            animate={{ left: '150%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "linear"
            }}
            className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
          />

          {/* Subtle Border pulse glow */}
          <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/20 rounded-lg pointer-events-none transition-colors duration-500" />

          {/* Sponsored Badge */}
          <div className="absolute top-1 right-1 bg-black/75 backdrop-blur-sm text-[8px] font-black text-white/90 px-1.5 py-0.5 rounded uppercase tracking-widest pointer-events-none border border-white/10 z-10 shadow-sm">
            Sponsored Ad
          </div>
        </motion.div>
      </div>
    </header>
  );
};
