import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tv, Bell, ArrowLeft, Check, Sparkles, Smartphone, ShieldCheck, Radio, Zap, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const logoUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailOrPhone('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-between py-8 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Soft Background Ambient Mesh */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Top Header Logo Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 mb-6">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-all"
        >
          <img src={logoUrl} alt="SAMI TV Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
          <div className="border-l border-slate-200 pl-3">
            <span className="text-xs font-black text-slate-900 block leading-none">SAMI TV</span>
            <span className="text-[10px] text-slate-500 font-bold">Android TV Edition</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/download-app')}
          className="inline-flex items-center gap-2 text-xs font-bold text-sami-red hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200/80 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Smartphone size={15} />
          <span className="hidden sm:inline">মোবাইল অ্যাপ ডাউনলোড করুন</span>
          <span className="sm:hidden">মোবাইল APK</span>
        </button>
      </div>

      {/* Center Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full text-center relative z-10 my-auto"
      >
        {/* TV Icon Badge with Badge '0' */}
        <div className="mb-6 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-sami-red/30 rounded-[2rem] blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 flex items-center justify-center relative z-10">
              <Tv size={46} className="text-[#be123c] stroke-[2.2]" />
            </div>
            {/* Red Circle Badge with '0' */}
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#990000] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow-md z-20">
              0
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Android TV App <span className="text-[#cc0000] font-black">Coming Soon</span>
        </h1>
        
        {/* Bengali Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-8 font-semibold max-w-lg mx-auto leading-relaxed px-2">
          আমরা আমাদের এন্ড্রয়েড টিভি অ্যাপ তৈরির কাজ করছি। খুব শীঘ্রই আপনি বড় পর্দায় সামি টিভি দেখতে পারবেন।
        </p>

        {/* Info Cards (4K Quality & Get Notified) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
          
          {/* Card 1: 4K Quality */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-11 h-11 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Tv size={22} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-0.5">4K Quality</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                সেরা ভিডিও কোয়ালিটি নিশ্চিত করতে আমরা কাজ করছি।
              </p>
            </div>
          </div>

          {/* Card 2: Get Notified */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-11 h-11 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Bell size={22} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-0.5">Get Notified</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                অ্যাপটি মুক্তি পাওয়া মাত্রই আপনাকে জানানো হবে।
              </p>
            </div>
          </div>

        </div>

        {/* Subscribe Form for TV Launch Updates */}
        <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-sami-red" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              টিভি অ্যাপের খবর পেতে নোটিফিকেশন বুক করুন
            </h4>
          </div>

          {subscribed ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <Check size={18} className="text-emerald-600" />
              <span>ধন্যবাদ! টিভি অ্যাপ মুক্তি পাওয়ার সাথে সাথে আপনাকে বার্তা পাঠানো হবে।</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="আপনার মোবাইল নম্বর বা ইমেইল লিখুন..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-sami-red/30 focus:border-sami-red transition-all"
                required
              />
              <button
                type="submit"
                className="bg-sami-red hover:bg-sami-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send size={14} />
                <span>বুক করুন</span>
              </button>
            </form>
          )}
        </div>

        {/* Upcoming Smart TV Specs Pill Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-[11px] font-bold text-slate-500">
          <span className="bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Radio size={13} className="text-sami-red" /> রিমোট কন্ট্রোল অপ্টিমাইজড
          </span>
          <span className="bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Zap size={13} className="text-amber-500" /> জিরো-বাফারিং স্ট্রিম
          </span>
          <span className="bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-600" /> ১০০% নিরাপদ
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-slate-900/10 cursor-pointer active:scale-95"
          >
            <ArrowLeft size={18} />
            হোম পেজে ফিরে যান
          </button>

          <div className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white border border-slate-200/90 text-slate-400 rounded-2xl font-bold text-sm cursor-not-allowed select-none shadow-sm">
            Download for TV (Inactive)
          </div>
        </div>

      </motion.div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 font-bold z-10 pt-6">
        <p>© {new Date().getFullYear()} SAMI TV MultiMedia Ltd. সর্বস্বত্ব সংরক্ষিত।</p>
      </div>

    </div>
  );
};

export default ComingSoon;
