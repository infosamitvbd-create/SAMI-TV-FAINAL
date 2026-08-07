import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Download, ShieldCheck, Smartphone, CheckCircle2, 
  Tv, Bell, Cpu, Copy, Check, Sparkles, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppDownload: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const downloadUrl = "https://drive.google.com/file/d/1XRi5iMvvtLlyZNg9eYd9HynPS7FYBJi-/view?usp=drive_link";
  const logoUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sami-red/25 via-sami-red/10 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-red-800/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-5xl w-full z-10 space-y-8">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} className="text-sami-red" />
            ওয়েবসাইটে ফিরে যান
          </button>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            অফিশিয়াল মোবাইল অ্যাপ v1.0.0
          </span>
        </div>

        {/* ================= MAIN HERO CARD: ANDROID PHONE APP DOWNLOAD ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* Main Hero Header */}
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-12 border-b border-slate-700/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Brand Logo & Title */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                
                {/* Official SAMI TV Logo */}
                <div className="relative group mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sami-red via-red-500 to-sami-dark rounded-3xl blur opacity-35 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative bg-white p-4 sm:p-5 rounded-2xl border border-white/20 shadow-xl flex items-center justify-center">
                    <img 
                      src={logoUrl} 
                      alt="SAMI TV Logo" 
                      className="h-20 sm:h-24 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-sami-red/15 border border-sami-red/30 px-3.5 py-1 rounded-full text-sami-red text-xs font-black uppercase tracking-wider mb-3">
                  <Smartphone size={14} />
                  SAMI TV Official Android Mobile App
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                  সামি টিভি অফিশিয়াল অ্যান্ড্রয়েড মোবাইল অ্যাপ
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-lg mb-6">
                  দেশের প্রথম ও নির্ভরযোগ্য ২৪/৭ অনলাইন ও লাইভ খবর সরাসরি আপনার স্মার্টফোনে পেতে অফিশিয়াল মোবাইল অ্যাপটি এখনই ডাউনলোড করুন।
                </p>

                {/* Download CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-sami-red to-red-600 hover:from-sami-dark hover:to-sami-red text-white rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl shadow-sami-red/30 hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer border border-red-500/30"
                  >
                    <Download size={22} className="animate-bounce" />
                    ডাউনলোড করুন (APK)
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold text-xs border border-slate-600 transition-all cursor-pointer"
                    title="ডাউনলোড লিঙ্ক কপি করুন"
                  >
                    {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    <span>{copied ? 'লিঙ্ক কপি হয়েছে!' : 'লিঙ্ক কপি'}</span>
                  </button>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-5 text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" /> ১০০% নিরাপদ ও ভেরিফাইড
                  </span>
                  <span>•</span>
                  <span>সাইজ: ~১৫ MB</span>
                  <span>•</span>
                  <span>Android 5.0+</span>
                </div>

              </div>

              {/* Right Column: Phone Mockup Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-56 sm:w-64 bg-slate-900 border-4 border-slate-700 rounded-[40px] p-2.5 shadow-2xl shadow-sami-red/10">
                  <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></div>
                  </div>

                  <div className="bg-slate-950 rounded-[30px] overflow-hidden p-3 border border-slate-800 flex flex-col items-center justify-between min-h-[360px]">
                    <div className="w-full text-center py-2 border-b border-slate-800">
                      <img src={logoUrl} alt="Logo" className="h-8 mx-auto object-contain bg-white/90 p-1 rounded-lg" referrerPolicy="no-referrer" />
                      <span className="text-[10px] text-red-500 font-extrabold block mt-1">● LIVE STREAMING</span>
                    </div>

                    <div className="my-auto text-center p-2">
                      <div className="w-12 h-12 bg-sami-red/20 text-sami-red rounded-2xl flex items-center justify-center mx-auto mb-2 border border-sami-red/30">
                        <Smartphone size={24} />
                      </div>
                      <h4 className="text-xs font-black text-white">SAMI TV MOBILE</h4>
                      <p className="text-[10px] text-slate-400 mt-1">লাইভ টিভি ও তাৎক্ষণিক খবর পান আপনার মোবাইলে।</p>
                    </div>

                    <div className="w-full bg-sami-red text-white text-[11px] font-bold py-2 rounded-xl text-center shadow">
                      মোবাইলে লাইভ কভারেজ
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Key Features Grid */}
          <div className="p-6 sm:p-10 bg-slate-800/50">
            <h3 className="text-center text-xs sm:text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-8">
              মোবাইল অ্যাপের অনন্য সুবিধাসমূহ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/60 hover:border-sami-red/50 transition-all">
                <div className="w-10 h-10 bg-red-500/10 text-sami-red rounded-xl flex items-center justify-center mb-3 border border-red-500/20">
                  <Tv size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-white mb-1">২৪/৭ লাইভ টিভি</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">কোনো বাফারিং ছাড়াই সরাসরি লাইভ সম্প্রচার দেখুন।</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/60 hover:border-sami-red/50 transition-all">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-3 border border-emerald-500/20">
                  <Bell size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-white mb-1">ব্রেকিং খবর অ্যালার্ট</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">গুরুত্বপূর্ণ সংবাদের সাথে সাথে ফোনে পান রিয়েল-টাইম নোটিফিকেশন।</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/60 hover:border-sami-red/50 transition-all">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-3 border border-blue-500/20">
                  <Cpu size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-white mb-1">স্মার্ট প্লেব্যাক</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">ইন্টারনেট স্পিড অনুযায়ী ভিডিও কোয়ালিটি স্বয়ংক্রিয়ভাবে অ্যাডজাস্ট হয়।</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/60 hover:border-sami-red/50 transition-all">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-3 border border-amber-500/20">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-white mb-1">১০০% নিরাপদ</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">কোনো ক্ষতিকর বিজ্ঞাপন বা বাড়তি পারমিশন ছাড়াই।</p>
              </div>
            </div>
          </div>

          {/* Installation Steps */}
          <div className="p-6 sm:p-10 border-t border-slate-700/80 bg-slate-900/60">
            <h3 className="text-base font-extrabold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-sami-red" />
              স্মার্টফোনে ইনস্টল করার ৩ টি সহজ ধাপ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-sami-red text-white font-black text-sm flex items-center justify-center shrink-0">১</span>
                <div>
                  <h5 className="text-xs font-extrabold text-white mb-1">ডাউনলোড করুন</h5>
                  <p className="text-[11px] text-slate-400 font-medium">উপরে "ডাউনলোড করুন" বাটনে ক্লিক করে ফাইলটি নামিয়ে নিন।</p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-sami-red text-white font-black text-sm flex items-center justify-center shrink-0">২</span>
                <div>
                  <h5 className="text-xs font-extrabold text-white mb-1">পারমিশন এলাউ দিন</h5>
                  <p className="text-[11px] text-slate-400 font-medium">প্রয়োজন হলে ফোনের "Install from unknown sources" পারমিশন দিন।</p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-sami-red text-white font-black text-sm flex items-center justify-center shrink-0">৩</span>
                <div>
                  <h5 className="text-xs font-extrabold text-white mb-1">উপভোগ করুন</h5>
                  <p className="text-[11px] text-slate-400 font-medium">ইনস্টল শেষে অ্যাপ ওপেন করুন এবং সামি টিভির সাথেই থাকুন!</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Link / Banner to Android TV Coming Soon Page */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 text-center sm:flex sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-0">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0">
              <Tv size={20} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-extrabold text-white">স্মার্ট টিভিতে সামি টিভি দেখতে চান?</h4>
              <p className="text-xs text-slate-400">Android TV App (Coming Soon) আপডেট দেখুন</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/android-tv')}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-600 transition-all cursor-pointer"
          >
            <span>Android TV পেজ দেখুন</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 font-bold py-2">
          <p>© {new Date().getFullYear()} SAMI TV MultiMedia Ltd. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>

      </div>
    </div>
  );
};

export default AppDownload;
