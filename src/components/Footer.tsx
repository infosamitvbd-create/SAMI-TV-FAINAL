import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, Mail, Phone, MapPin, Layout, Tv, UserCheck, Lock } from 'lucide-react';
import { SAMILogo } from './SAMILogo';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white pt-8 pb-4 mt-auto border-t border-white/5 text-xs sm:text-[13px] hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1650px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-3 text-center md:text-left">
            <div className="inline-block cursor-pointer" onClick={() => onNavigate('/')}>
              <SAMILogo className="scale-100 md:scale-110 origin-center md:origin-left -ml-1 md:ml-0" />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
              সর্বশেষ সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার সর্বজনীন নীতি মেনে আমরা সদা নিয়োজিত।
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2.5 pt-1">
              {[
                { icon: Facebook, color: 'hover:bg-[#1877F2]', href: 'https://www.facebook.com/samitvbd' },
                { icon: Youtube, color: 'hover:bg-[#FF0000]', href: 'https://www.youtube.com/@stv2026Banglades' },
                { icon: Twitter, color: 'hover:bg-[#1DA1F2]', href: '#' },
                { icon: Instagram, color: 'hover:bg-[#E4405F]', href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${social.color}`}
                >
                  <social.icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links & Details - 5 Column Grid for Desktop */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
            {/* Col 2: Important Links */}
            <div>
              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 justify-center md:justify-start">
                <span className="w-1 h-3.5 bg-sami-red rounded-full"></span>
                গুরুত্বপূর্ণ লিঙ্ক
              </h4>
              <ul className="space-y-1.5">
                {[
                  { label: 'লাইভ সম্প্রচার', path: '/live' },
                  { label: 'আমাদের সম্পর্কে', path: '/about' },
                  { label: 'শর্তাবলী ও নীতি', path: '/terms' },
                  { label: 'গোপনীয়তা নীতি', path: '/privacy' }
                ].map((link) => (
                  <li key={link.path}>
                    <button 
                      onClick={() => onNavigate(link.path)}
                      className="text-gray-400 hover:text-sami-red transition-all font-medium block w-full md:w-auto text-center md:text-left hover:translate-x-0.5 text-xs sm:text-[13px] cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div>
              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 justify-center md:justify-start">
                <span className="w-1 h-3.5 bg-sami-red rounded-full"></span>
                বিভাগসমূহ
              </h4>
              <ul className="grid grid-cols-2 gap-x-1 gap-y-1.5 text-center md:text-left">
                {['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'জামালপুর', 'সারাদেশ', 'বিনোদন'].map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => onNavigate(`/category/${cat}`)}
                      className="text-gray-400 hover:text-sami-red transition-all font-medium inline-block hover:translate-x-0.5 text-xs sm:text-[13px] cursor-pointer"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 justify-center md:justify-start">
                <span className="w-1 h-3.5 bg-sami-red rounded-full"></span>
                যোগাযোগ
              </h4>
              <ul className="space-y-2 text-gray-400 inline-block md:block text-left text-xs sm:text-[13px]">
                <li className="flex items-center gap-2">
                  <MapPin size={13} className="text-sami-red shrink-0" />
                  <span>দিগপাইত, জামালপুর, বাংলাদেশ</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={13} className="text-sami-red shrink-0" />
                  <span className="font-mono font-bold">01912618994</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={13} className="text-sami-red shrink-0" />
                  <span className="font-mono text-[11px] sm:text-xs">info.samitv.bd@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Col 5: Services & Apps */}
            <div>
              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 justify-center md:justify-start">
                <span className="w-1 h-3.5 bg-sami-red rounded-full"></span>
                সেবা ও পোর্টাল
              </h4>
              <ul className="space-y-1.5 mb-3 text-gray-400">
                <li>
                  <button 
                    onClick={() => onNavigate('/family')}
                    className="text-gray-400 hover:text-sami-red transition-all font-medium block w-full md:w-auto text-center md:text-left hover:translate-x-0.5 text-xs sm:text-[13px] cursor-pointer"
                  >
                    আমাদের পরিবার
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('/journalist-apply')}
                    className="text-gray-400 hover:text-sami-red transition-all font-medium block w-full md:w-auto text-center md:text-left hover:translate-x-0.5 text-xs sm:text-[13px] cursor-pointer"
                  >
                    প্রতিনিধি আবেদন
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('/contact')}
                    className="text-gray-400 hover:text-sami-red transition-all font-medium block w-full md:w-auto text-center md:text-left hover:translate-x-0.5 text-xs sm:text-[13px] cursor-pointer"
                  >
                    বিজ্ঞাপন সার্ভিস
                  </button>
                </li>
              </ul>

              {/* Micro Badges for Official Apps */}
              <div className="space-y-1.5 pt-1 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">সামী টিভি অ্যাপস</span>
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  <button 
                    onClick={() => onNavigate('/download-app')}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 py-1 px-2 rounded-md transition-all text-[11px] font-bold text-gray-300 hover:text-white cursor-pointer"
                  >
                    <Layout size={11} className="text-sami-red" />
                    <span>Android App</span>
                  </button>
                  <button 
                    onClick={() => onNavigate('/android-tv')}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 py-1 px-2 rounded-md transition-all text-[11px] font-bold text-gray-300 hover:text-white cursor-pointer"
                  >
                    <Tv size={11} className="text-blue-500" />
                    <span>Android TV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Ultra Slim */}
        <div className="pt-3.5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-gray-500 font-bold">
          <p>© {currentYear} সামি টেলিভিশন। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <p className="font-sans">DEVELOPED BY <a href="https://mahmudulhasansami12.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer">Emran Hasan Sami</a></p>
            <span className="text-gray-700">|</span>
            <button 
              onClick={() => {
                sessionStorage.setItem('sami_login_mode', 'admin');
                onNavigate('/admin');
              }}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-0.5 px-1.5 rounded hover:bg-white/5"
              title="অ্যাডমিন প্যানেল"
            >
              <Lock size={11} className="text-gray-400" />
              <span>অ্যাডমিন</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
