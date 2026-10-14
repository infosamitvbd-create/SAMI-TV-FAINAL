import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Phone, MapPin, Clock, Send, Facebook, Youtube, Twitter, 
  Globe, MessageSquare, CheckCircle, PhoneCall, MessageCircle, 
  Share2, ShieldCheck, Radio, Building, AlertCircle, Check, Copy, ExternalLink 
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'সাধারণ জিজ্ঞাসা',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(text);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', department: 'সাধারণ জিজ্ঞাসা', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (error) {
      console.error("Error sending message: ", error);
      alert('দুঃখিত, বার্তাটি পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen text-slate-800 pb-20 font-sans">
      
      {/* =========================================================================
          DESKTOP (PC) VIEW HERO BANNER
          ========================================================= */}
      <div className="hidden md:block bg-[#0b0c10] text-white border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1700px] mx-auto px-6 lg:px-12 py-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Radio size={13} className="text-red-400 animate-pulse" />
                  SAMI TV HEADQUARTERS & BROADCAST DESK
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-white/70 text-xs font-bold">২৪/৭ সরাসরি যোগাযোগ ও তথ্য সহায়তা</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                আমাদের সাথে <span className="text-red-500">যোগাযোগ করুন</span>
              </h1>

              <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-2xl">
                আপনার এলাকার ব্রেকিং নিউজ, মতামত, বিজ্ঞাপনের প্রস্তাবনা কিংবা অনুসন্ধানী খবরের যেকোনো তথ্যের জন্য সামী টেলিভিশনের নিউজরুম ও বাণিজ্যিক দলের সাথে সরাসরি যোগাযোগ করুন।
              </p>
            </div>

            {/* Quick Action Buttons for PC */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a 
                href="tel:01912618994" 
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3.5 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
              >
                <PhoneCall size={16} />
                <span>হটলাইন: 01912618994</span>
              </a>
              <a 
                href="https://wa.me/8801912618994" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
              >
                <MessageCircle size={16} />
                <span>হোয়াটসঅ্যাপ মেসেজ</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW HEADER BANNER
          ========================================================================= */}
      <div className="md:hidden bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-white p-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[8px] font-black uppercase tracking-wider">
                CONTACT DESK
              </span>
              <span className="text-[9px] text-emerald-400 font-bold">২৪/৭ সেবা সক্রিয়</span>
            </div>
            <h1 className="text-xl font-black text-white mt-1 font-brand">
              যোগাযোগ <span className="text-sami-red">করুন</span>
            </h1>
            <p className="text-[10.5px] text-slate-300 font-medium">
              সামী টিভির কেন্দ্রীয় নিউজরুম ও অফিস
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <Radio size={18} className="text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Mobile Quick Action Strip */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
          <a 
            href="tel:01912618994"
            className="bg-red-600 active:bg-red-700 text-white py-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PhoneCall size={13} />
            <span>সরাসরি কল</span>
          </a>
          <a 
            href="https://wa.me/8801912618994"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 active:bg-emerald-700 text-white py-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <MessageCircle size={13} />
            <span>হোয়াটসঅ্যাপ</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTACT CONTAINER
          ========================================================================= */}
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-12 pt-6 sm:pt-8 space-y-8">
        
        {/* Contact Info Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Card 1: Emergency News & Hotline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PhoneCall size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600">জরুরি হটলাইন</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">নিউজ ডেস্ক ও সরাসরি কল</h3>
              <p className="text-xs text-slate-500 mt-1">যেকোনো সংবাদ কিংবা তাৎক্ষণিক তথ্য পাঠাতে যোগাযোগ করুন</p>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <a href="tel:01912618994" className="font-mono font-bold text-sm text-slate-900 hover:text-red-600 transition-colors">
                    01912618994
                  </a>
                  <button 
                    onClick={() => handleCopy('01912618994')} 
                    className="text-slate-400 hover:text-slate-700 p-1"
                    title="কপি করুন"
                  >
                    {copiedPhone === '01912618994' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <a href="tel:01939080605" className="font-mono font-bold text-sm text-slate-900 hover:text-red-600 transition-colors">
                    01939080605
                  </a>
                  <button 
                    onClick={() => handleCopy('01939080605')} 
                    className="text-slate-400 hover:text-slate-700 p-1"
                    title="কপি করুন"
                  >
                    {copiedPhone === '01939080605' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>২৪ ঘণ্টা সার্বক্ষণিক কল সাপোর্ট সক্রিয়</span>
            </div>
          </div>

          {/* Card 2: Official Email & Digital Desk */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mail size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">অফিসিয়াল ইমেইল</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">বিজ্ঞাপন ও প্রেস রিলিজ</h3>
              <p className="text-xs text-slate-500 mt-1">বাণিজ্যিক বিজ্ঞাপন, স্পন্সরশিপ এবং অফিসিয়াল চিঠিপত্রের জন্য</p>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                <a 
                  href="mailto:info.samitv.bd@gmail.com"
                  className="block p-2.5 rounded-xl bg-slate-50 font-bold text-xs text-slate-800 hover:text-blue-600 transition-colors truncate"
                >
                  info.samitv.bd@gmail.com
                </a>
                <a 
                  href="https://www.samitvbd.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block p-2.5 rounded-xl bg-slate-50 font-bold text-xs text-slate-800 hover:text-blue-600 transition-colors truncate"
                >
                  www.samitvbd.com
                </a>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <Clock size={13} className="text-slate-400" />
              <span>২৪ ঘণ্টার মধ্যে ফিরতি ইমেইল নিশ্চিত করা হয়</span>
            </div>
          </div>

          {/* Card 3: Central Studio Location */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">কেন্দ্রীয় কার্যালয়</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">সামী টিভি ভবন ও স্টুডিও</h3>
              <p className="text-xs text-slate-500 mt-1">সরাসরি অফিস ও সম্প্রচার স্টুডিওতে সাক্ষাতের জন্য</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 p-3 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 leading-relaxed">
                দিগপাইত, জামালপুর সদর উপজেলা,<br />
                জামালপুর জেলা, ময়মনসিংহ বিভাগ, বাংলাদেশ।
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-semibold">অফিস সময়: সকাল ১০:০০ - রাত ০৮:০০</span>
              <a 
                href="https://maps.google.com/maps?q=Digpait,+Jamalpur,+Bangladesh" 
                target="_blank" 
                rel="noreferrer"
                className="text-red-600 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>ম্যাপ দেখুন</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

        </div>

        {/* Contact Form & Google Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">আমাদের সরাসরি বার্তা পাঠান</h2>
                <p className="text-xs text-slate-500">আপনার বার্তাটি সরাসরি সংশ্লিষ্ট বিভাগীয় প্রধানের কাছে পৌঁছাবে</p>
              </div>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-xl font-black text-emerald-900">আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  ধন্যবাদ। সামী টেলিভিশন ডেস্ক আপনার বার্তাটি গ্রহণ করেছে। শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">আপনার নাম <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="পুরো নাম লিখুন"
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="যেমন: 017xxxxxxxx"
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="example@mail.com"
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">সংশ্লিষ্ট বিভাগ <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all cursor-pointer"
                    >
                      <option>সাধারণ জিজ্ঞাসা</option>
                      <option>বিজ্ঞাপন ও বাণিজ্যিক প্রচার</option>
                      <option>অনুসন্ধানী নিউজ টিপস</option>
                      <option>মতামত বা অভিযোগ</option>
                      <option>প্রতিনিধি নিয়োগ অনুসন্ধান</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">বিষয় <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="বার্তার মূল বিষয় সংক্ষেপে লিখুন"
                    className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">বিস্তারিত বার্তা <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="আপনার বার্তাটি এখানে বিস্তারিতভাবে লিখুন..."
                    className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'বার্তা পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Interactive Google Map & Social Connect */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Embedded Google Map */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-600" />
                  <h3 className="text-sm font-black text-slate-900">গুগল লাইভ ম্যাপ লোকেশন</h3>
                </div>
                <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
                  দিগপাইত, জামালপুর
                </span>
              </div>

              {/* Map Iframe */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
                <iframe 
                  title="SAMI TV Studio Map"
                  src="https://maps.google.com/maps?q=Digpait,+Jamalpur,+Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500 font-medium">সরাসরি গুগল ম্যাপে নেভিগেট করতে:</span>
                <a 
                  href="https://maps.google.com/maps?q=Digpait,+Jamalpur,+Bangladesh" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-red-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>দিকনির্দেশনা পান</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Social Community Grid */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                <span>অফিসিয়াল সোশ্যাল নেটওয়ার্ক</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                <a 
                  href="https://www.facebook.com/samitvbd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-2xl flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Facebook size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">ফেসবুক পেজ</p>
                    <p className="text-[9.5px] text-blue-600 truncate">সরাসরি আপডেট</p>
                  </div>
                </a>

                <a 
                  href="https://youtube.com/@stv2026Banglades" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-800 rounded-2xl flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Youtube size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">ইউটিউব চ্যানেল</p>
                    <p className="text-[9.5px] text-red-600 truncate">ভিডিও বুলেটিন</p>
                  </div>
                </a>

                <a 
                  href="https://wa.me/8801912618994" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">হোয়াটসঅ্যাপ</p>
                    <p className="text-[9.5px] text-emerald-600 truncate">তাৎক্ষণিক চ্যাট</p>
                  </div>
                </a>

                <a 
                  href="mailto:info.samitv.bd@gmail.com" 
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">অফিসিয়াল মেইল</p>
                    <p className="text-[9.5px] text-slate-500 truncate">প্রেস রিলিজ</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
