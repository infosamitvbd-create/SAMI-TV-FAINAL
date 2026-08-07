import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'প্রচ্ছদ', href: '/' },
  { label: 'জাতীয়', href: '/category/জাতীয়' },
  { label: 'রাজনীতি', href: '/category/রাজনীতি' },
  { label: 'অর্থনীতি', href: '/category/অর্থনীতি' },
  { label: 'সারা দেশ', href: '/category/সারা দেশ' },
  { label: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { label: 'জামালপুর', href: '/category/জামালপুর' },
  { label: 'সরিষাবাড়ী', href: '/category/সরিষাবাড়ী' },
  { label: 'খেলা-ধুলা', href: '/category/খেলাধুলা' },
  { label: 'তথ্য-প্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
  { label: 'বিনোদন', href: '/category/বিনোদন' },
];

const otherNavItems: NavItem[] = [
  { label: 'আর্কাইভ (Archive)', href: '/archive' },
  { label: 'মিডিয়া', href: '/media' },
  { label: 'আমাদের সম্পর্কে', href: '/about' },
  { label: 'যোগাযোগ', href: '/contact' },
  { label: 'আওয়ার ফ্যামিলি', href: '/family' },
  { label: 'LIVE TV', href: '/live' },
];

export const Navbar: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
  currentCategory: string;
}> = ({ onNavigate, currentPage, currentCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOthersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    onNavigate(href);
    setIsMenuOpen(false);
    setIsOthersOpen(false);
  };

  const isItemActive = (href: string) => {
    if (href.startsWith('/category/')) {
      const cat = href.replace('/category/', '');
      return currentPage.includes('/category/') && currentCategory === cat;
    }
    return currentPage === href;
  };

  return (
    <nav className="hidden lg:block bg-[#1a1a1a] text-white sticky top-0 z-50 shadow-md border-b border-black">
      <div className="container mx-auto px-4 flex items-center justify-between h-10 max-w-[1650px]">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center font-bold text-[13px] h-full tracking-normal">
          {mainNavItems.map((item, index) => {
            const isActive = isItemActive(item.href);
            return (
              <li 
                key={item.label} 
                className={`h-full flex items-center border-r border-white/10 ${
                  index === 0 ? 'border-l border-white/10' : ''
                }`}
              >
                <button 
                  onClick={() => handleNavClick(item.href)}
                  className={`px-3.5 h-full flex items-center transition-all duration-150 whitespace-nowrap ${
                    isActive 
                      ? 'bg-sami-red text-white font-black' 
                      : 'hover:bg-white/10 text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
          
          {/* Others Dropdown Desktop */}
          <li className="h-full flex items-center relative border-r border-white/10" ref={dropdownRef}>
            <button 
              onClick={() => setIsOthersOpen(!isOthersOpen)}
              className={`px-3.5 h-full flex items-center gap-1 transition-all duration-150 text-white/90 hover:text-white hover:bg-white/10 ${isOthersOpen ? 'bg-white/10 text-white' : ''}`}
            >
              অন্যান্য <ChevronDown size={14} className={`transition-transform duration-200 ${isOthersOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isOthersOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 w-52 bg-white text-gray-900 shadow-2xl py-2 border-t-2 border-sami-red rounded-b z-50 border border-gray-200"
                >
                  {otherNavItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-100 transition-colors ${
                        isItemActive(item.href) ? 'text-sami-red bg-red-50' : 'text-gray-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleNavClick('/live')}
            className="flex items-center gap-1.5 bg-sami-red text-white px-3 py-1 rounded font-extrabold text-[11px] uppercase tracking-wider hover:bg-red-700 transition-all shrink-0 shadow-sm"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </button>
          
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-all text-white/80 hover:text-white flex items-center justify-center shrink-0">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-4/5 max-w-xs bg-slate-900 text-white z-50 overflow-y-auto flex flex-col justify-between shadow-2xl border-r border-slate-800"
            >
              <div>
                {/* Mobile Drawer Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-sami-red rounded-lg flex items-center justify-center font-black text-white text-xs">
                      S
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-white uppercase tracking-tight">সামি টিভি</h3>
                      <p className="text-[9px] text-slate-400 font-bold">অনলাইন নিউজ পোর্টাল</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Mobile Search Input inside drawer */}
                <div className="p-3 bg-slate-900/90 border-b border-slate-800">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="খবর খুঁজুন..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-3 pr-9 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-sami-red"
                    />
                    <Search size={15} className="absolute right-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                {/* Main Category Nav Links */}
                <div className="p-3">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3 py-1">
                    ক্যাটেগরি সমূহ
                  </p>
                  <ul className="space-y-1">
                    {mainNavItems.map((item) => {
                      const isActive = isItemActive(item.href);
                      return (
                        <li key={item.label}>
                          <button 
                            onClick={() => handleNavClick(item.href)}
                            className={`w-full text-left py-2.5 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                              isActive 
                                ? 'bg-sami-red text-white shadow-md shadow-sami-red/20' 
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span>{item.label}</span>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1">
                    অন্যান্য পেজ
                  </p>
                  <ul className="space-y-1">
                    {otherNavItems.map((item) => {
                      const isActive = isItemActive(item.href);
                      return (
                        <li key={item.label}>
                          <button 
                            onClick={() => handleNavClick(item.href)}
                            className={`w-full text-left py-2.5 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                              isActive 
                                ? 'bg-sami-red text-white' 
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
                <button 
                  onClick={() => handleNavClick('/download-app')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sami-red to-red-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
                >
                  <Layout size={15} />
                  <span>অ্যান্ড্রয়েড অ্যাপ ডাউনলোড</span>
                </button>
                <p className="text-[10px] text-center text-slate-500 font-semibold pt-1">
                  © SAMI TV MultiMedia Ltd.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Horizontal Touch Scroll Category Bar for Mobile */}
      <div className="lg:hidden bg-slate-900 border-t border-slate-800/80 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center px-2 py-1.5 min-w-max gap-1">
          {mainNavItems.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-sami-red text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
