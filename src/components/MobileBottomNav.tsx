import React from 'react';
import { Home, Tv, User, Globe, MapPin, Megaphone } from 'lucide-react';

interface MobileBottomNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { id: '/', label: 'প্রচ্ছদ', icon: Home },
    { id: `/category/${encodeURIComponent('জাতীয়')}`, label: 'জাতীয়', icon: Globe },
    { id: '/live', label: 'লাইভ', icon: Tv },
    { id: `/category/${encodeURIComponent('সারা দেশ')}`, label: 'সারাদেশ', icon: MapPin },
    { id: '/download-app', label: 'বিজ্ঞাপন', icon: Megaphone },
    { id: '/admin', label: 'লগইন', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 shadow-2xl px-1 py-1">
      <div className="grid grid-cols-6 items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const decodedCurrent = decodeURIComponent(currentPage);
          const decodedTarget = decodeURIComponent(item.id);
          const isActive = currentPage === item.id || (item.id.startsWith('/category/') && decodedCurrent === decodedTarget);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-sami-red font-black scale-105' : 'text-slate-600 font-bold hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-sami-red' : 'text-slate-700'} />
              <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

