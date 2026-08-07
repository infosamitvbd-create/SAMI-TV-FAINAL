import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  MapPin, 
  Mail, 
  Radio, 
  History, 
  Facebook, 
  Globe, 
  Tv, 
  Flame, 
  Sparkles, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-10 text-gray-800"
    >
      {/* 3D Header Spotlight */}
      <div className="relative mb-12 text-center">
        {/* Decorative 3D Ambient Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-0 right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600/15 to-red-800/15 px-3.5 py-1.5 rounded-full border border-red-500/20 text-[10px] font-black uppercase tracking-wider text-red-600 mb-4 animate-pulse">
          <Radio size={12} /> আমাদের সম্পর্কে • SAMI TELEVISION
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight leading-none uppercase">
          আমাদের <span className="bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">গৌরবময় পথচলা</span>
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm font-bold mt-2.5 max-w-lg mx-auto leading-relaxed">
          সত্য প্রকাশে অবিচল এবং আধুনিক সম্প্রচার প্রযুক্তির ছোঁয়ায় এক যুগেরও বেশি সময় ধরে দর্শকদের আস্থার বিশ্বস্ত নাম।
        </p>
      </div>

      {/* Main 3D Card Deck Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: 3D Legacy Glass Card (span 7) */}
        <motion.div 
          whileHover={{ y: -6, rotateX: 1, rotateY: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-gray-150 shadow-[rgba(17,12,46,0.06)_0px_48px_100px_0px] relative overflow-hidden flex flex-col justify-between"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtle neon indicator top line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500" />
          
          <div className="space-y-6">
            {/* Header Badge & Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100/60 shadow-[inset_0_2px_4px_rgba(239,68,68,0.08)]">
                  <History className="text-red-600" size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D92B2B]">SAMI TV ESTD 2010</h4>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-none mt-0.5">আমাদের পথচলা ও ইতিহাস</h2>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase bg-gray-100 hover:bg-gray-200 text-gray-500 px-3 py-1 rounded-full border border-gray-200/50">
                ১২ বছর+
              </span>
            </div>

            {/* Dynamic visual representation of channel values */}
            <div className="rounded-xl overflow-hidden border border-gray-100 relative aspect-video shadow-[rgba(0,0,0,0.02)_0px_20px_40px]">
              <img 
                src="https://images.unsplash.com/photo-1495020689067-958852a7735e?auto=format&fit=crop&q=80&w=1200" 
                alt="Broadcast news mockup" 
                className="w-full h-full object-cover grayscale opacity-90 brightness-[0.9] hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase font-black tracking-widest text-red-500 flex items-center gap-1">
                  <Flame size={10} /> SAMI TELEVISION GROUP
                </span>
                <p className="text-xs sm:text-sm font-black mt-1 text-gray-100 leading-snug">
                  জামালপুর ও সারা দেশজুড়ে সত্যনিষ্ঠ সাংবাদিকতার আলোকবর্তিকা।
                </p>
              </div>
            </div>

            {/* Condensed narrative */}
            <div className="space-y-3 text-xs sm:text-[13.5px] font-bold text-gray-600 leading-relaxed font-sans text-justify">
              <p>
                <strong className="text-gray-900 border-b-2 border-red-500/20 pb-0.5">SAMI TV</strong> একটি বেসরকারি মালিকানাধীন শীর্ষস্থানীয় বাংলাদেশি বাংলা ভাষার আকাশ ডিটিএইচ (DTH) ও ডিজিটাল টেলিভিশন চ্যানেল। ১১ নভেম্বর ২০১০ সালে জামালপুর, ময়মনসিংহ থেকে চ্যানেলটি তার আনুষ্ঠানিক সম্প্রচার যাত্রা সফলভাবে শুরু করে।
              </p>
              <p>
                সত্য প্রকাশে সদা আপসহীন ও দায়িত্বশীল সাংবাদিকতার অনন্য নীতি মেনে বস্তুনিষ্ঠ সংবাদ, তথ্যচিত্র, টকশো এবং তথ্য-প্রযুক্তিনির্ভর সমসাময়িক বিশেষ বিশেষ অনুষ্ঠানমালা সম্প্রচারের মাধ্যমে দর্শকদের হৃদয়ের মণিকোঠায় স্থান করে নিয়েছে সামি টেলিভিশন।
              </p>
            </div>
          </div>

          {/* Quick Metrics stats dock */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 mt-6 text-center bg-gray-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-red-600 font-sans">১২৫কে+</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-black">অনলাইন ফলোয়ার</span>
            </div>
            <div className="flex flex-col border-x border-gray-200/60">
              <span className="text-lg md:text-xl font-black text-gray-900 font-sans">৫০০+</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-black">সংবাদকর্মী</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-gray-900 font-sans">২৪x৭</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-black">লাইভ টেলিভিশন</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: 3D Chairman Interactive Card (span 5) */}
        <motion.div 
          whileHover={{ y: -6, rotateX: -1, rotateY: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="lg:col-span-5 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white rounded-2xl p-6 md:p-8 border border-white/10 shadow-[rgba(0,0,0,0.25)_0px_25px_50px_-12px] relative overflow-hidden flex flex-col justify-between"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Neon Spotlight top accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600" />
          
          {/* Geometric subtle space background patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="space-y-6 z-10">
            {/* Title & Organization header */}
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">চেয়ারম্যান ও প্রতিষ্ঠাতা</span>
            </div>

            {/* Chairman Profile Visual container: 3D Frame style */}
            <div className="relative mx-auto w-44 h-56 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 outline outline-offset-2 outline-1 outline-red-500/20 group">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQIlNZaI7KugfIRmOXvHPu4i_B9xUhdTeG8JBDSYRlRQxJEJNhUWxdQUnWvTfJFCxvDnF9D3oiZtlJcYksYnrJPdGon084dAjJ38JQFjWj0iyFc8Ed-4zaELMmQk27qfCHswas0Rh5hfEvoZrlz6BQwcaWTvXnnByRZPjfSWpOcbtnlT2OthhwDgVN1lgE/s320/645363491_979533377908521_7060082878587727711_n.jpg" 
                alt="Md. Abul Kashem" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 bg-red-600 text-white font-sans text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm border border-red-500">
                CHAIRMAN
              </div>
            </div>

            {/* Profile Info & Description */}
            <div className="text-center space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-white hover:text-red-500 transition-colors drop-shadow-sm font-sans">
                Md. Abul Kashem
              </h3>
              <p className="text-[#ffd700] text-[11px] font-black tracking-widest uppercase font-sans">
                চেয়ারম্যান, সামী টিভি গ্রুপ
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-[12px] sm:text-xs text-gray-300 font-bold leading-relaxed text-center italic">
              "সামী টেলিভিশনের স্বপ্নদ্রষ্টা এবং অভিভাবক। তাঁর দূরদর্শী ও বলিষ্ঠ নেতৃত্বে আমরা গত এক যুগেরও বেশি সময় ধরে বস্তুনিষ্ঠ ও নিরপেক্ষ সাংবাদিকতার পথে নিরভয়ভাবে এগিয়ে চলেছি।"
            </div>
          </div>

          {/* Social connections wrapper */}
          <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-6 relative z-10 text-[10px]">
            <span className="text-gray-400 font-bold">যোগাযোগ করুন:</span>
            <div className="flex items-center gap-2">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-white/5 hover:bg-red-600 hover:text-white border border-white/5 transition-all text-gray-300 flex items-center justify-center"
                title="Facebook"
              >
                <Facebook size={12} />
              </a>
              <a 
                href="mailto:info.samitv.bd@gmail.com" 
                className="p-2 rounded-lg bg-white/5 hover:bg-red-600 hover:text-white border border-white/5 transition-all text-gray-300 flex items-center justify-center gap-1"
                title="Email Us"
              >
                <Mail size={12} /> <span className="font-sans font-extrabold text-[9px]">SAMI TV</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer Contact Details Ribbon & Address (3D Styled Segment) */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="mt-8 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-5 border border-red-500/30 shadow-[rgba(239,68,68,0.15)_0px_10px_30px_-5px] flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15 shadow-inner">
            <MapPin size={18} className="text-yellow-300 animate-bounce" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-yellow-300 tracking-wider">প্রধান কার্যালয় / অফিস</h4>
            <p className="text-xs sm:text-sm font-black text-white leading-relaxed">
              জামালপুর সদর, ময়মনসিংহ বিভাগ, বাংলাদেশ।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="mailto:info.samitv.bd@gmail.com" 
            className="px-4 py-2 bg-white text-rose-950 hover:bg-rose-50 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <Mail size={13} className="text-red-600" /> আমাদের লিখুন (Email)
          </a>
          <a 
            href="https://www.samitvbd.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-4 py-2 bg-red-950/30 hover:bg-red-950/50 text-white rounded-xl text-xs font-black transition-all border border-white/10 flex items-center gap-1.5"
          >
            <Globe size={13} className="text-yellow-300" /> ভিজিট করুন
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};
