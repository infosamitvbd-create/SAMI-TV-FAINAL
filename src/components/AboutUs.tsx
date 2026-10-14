import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, MapPin, Mail, Radio, History, Facebook, Globe, Tv, 
  ChevronRight, ShieldCheck, Target, Newspaper, Users, Clock, 
  Building, Phone, Send, CheckCircle2, FileText, Compass, 
  ExternalLink, ChevronDown, Check, Quote, Share2
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  // Mobile active tab state
  const [mobileTab, setMobileTab] = useState<'overview' | 'chairman' | 'charter' | 'contact'>('overview');
  // PC active tab / scroll state
  const [pcTab, setPcTab] = useState<'overview' | 'chairman' | 'charter' | 'reach' | 'contact'>('overview');

  // Mobile Accordion state for Editorial Charter
  const [expandedPillar, setExpandedPillar] = useState<number | null>(0);

  const pillars = [
    {
      id: 1,
      title: 'বস্তুনিষ্ঠতা ও সত্যনিষ্ঠতা',
      enTitle: 'Uncompromising Objectivity',
      desc: 'কোনো দল, গোষ্ঠী বা বিশেষ স্বার্থের প্রতি পক্ষপাত না করে তথ্যের সত্যতা সর্বোচ্চ গুরুত্ব দিয়ে যাচাই করা হয়। খবরের পেছনের আসল খবর এবং নিরপেক্ষ অনুসন্ধান আমাদের প্রধান শক্তি।',
      icon: ShieldCheck,
      color: 'from-red-600 to-rose-700'
    },
    {
      id: 2,
      title: 'তৃণমূল ও গণমানুষের কণ্ঠস্বর',
      enTitle: 'Voice of the Grassroots',
      desc: 'শুধু রাজধানী বা বিভাগীয় শহর নয়, জামালপুরসহ দেশের প্রত্যন্ত চরাঞ্চল, গ্রাম-গঞ্জ ও সাধারণ খেটে খাওয়া মানুষের সুখ-দুঃখ, সমস্যা ও সম্ভাবনার কথা জাতীয় দরবারে তুলে ধরাই সামী টিভির ব্রত।',
      icon: Users,
      color: 'from-amber-600 to-orange-700'
    },
    {
      id: 3,
      title: 'সাহসিকতা ও দায়বদ্ধতা',
      enTitle: 'Fearless Integrity',
      desc: 'সংবাদ প্রকাশে ভয় বা অনুগ্রহের ঊর্ধ্বে থেকে জনগণের তথ্য জানার অধিকার রক্ষা করা। রাষ্ট্রীয় আইন, জাতীয় সংহতি ও সাংবাদিকতার আন্তর্জাতিক নীতিমালার প্রতি আমরা সর্বদা শ্রদ্ধাশীল।',
      icon: Target,
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 4,
      title: 'আধুনিক সম্প্রচার ও উদ্ভাবন',
      enTitle: 'Broadcast Innovation',
      desc: 'আধুনিক ডিজিটাল ওটিটি, ক্লাউড অটোমেশন, আল্ট্রা এইচডি ভিডিও প্রোডাকশন এবং দ্রুততম ব্রেকিং নিউজ ডিস্ট্রিবিউশনের মাধ্যমে নতুন প্রজন্মের দর্শকদের সাথে সরাসরি সম্পৃক্ততা।',
      icon: Tv,
      color: 'from-emerald-600 to-teal-700'
    }
  ];

  const milestones = [
    { year: '২০১০', title: 'প্রতিষ্ঠা ও আনুষ্ঠানিক সম্প্রচার', desc: '১১ নভেম্বর ২০১০ সালে জামালপুর সদর থেকে বেসরকারি মালিকানায় পরীক্ষামূলক সম্প্রচার শুরু।' },
    { year: '২০১৫', title: 'ডিজিটাল নিউজ হাব ও ব্যুরো বিস্তার', desc: 'ময়মনসিংহ ও ঢাকা বিভাগের গুরুত্বপূর্ণ স্থানসমূহে সমন্বিত রিপোর্টার্স নেটওয়ার্ক স্থাপন।' },
    { year: '২০২০', title: '২৪/৭ ক্লাউড স্যাটেলাইট টেলিকাস্ট', desc: 'আইপিটিভি ও ডিটিএইচ প্লাটফর্মে উচ্চমানের আল্ট্রা এইচডি লাইভ স্ট্রিমিং প্রযুক্তি সংযোজন।' },
    { year: 'বর্তমান', title: 'মাল্টি-প্ল্যাটফর্ম জাতীয় সম্প্রচার', desc: 'ওয়েব পোর্টাল, মোবাইল অ্যাপ ও সামাজিক যোগাযোগ মাধ্যমে কোটি দর্শকের বিশ্বস্ত গণমাধ্যম।' }
  ];

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen text-slate-800">
      
      {/* =========================================================================
          DESKTOP (PC) VIEW LAYOUT (Visible on md: and up)
          Tailored for widescreen, high-fidelity institutional presence
          ========================================================================= */}
      <div className="hidden md:block">
        {/* Executive Hero Banner */}
        <section className="bg-[#0b0c10] text-white border-b border-white/10 relative overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
            <div className="grid grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Official Introduction */}
              <div className="col-span-7 xl:col-span-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Radio size={12} className="animate-pulse" />
                    SAMI TELEVISION NETWORK • ESTD 2010
                  </span>
                  <span className="text-white/40 text-xs">·</span>
                  <span className="text-white/60 text-xs font-medium">নিবন্ধিত সম্প্রচারক ও গণমাধ্যম প্রতিষ্ঠান</span>
                </div>

                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.15] tracking-tight">
                  বস্তুনিষ্ঠ সংবাদে সাহসের উচ্চারণ <br />
                  <span className="text-red-500">সামী টেলিভিশন</span> (SAMI TV)
                </h1>

                <p className="text-slate-300 text-sm lg:text-base font-normal leading-relaxed max-w-2xl">
                  এক যুগেরও বেশি সময় ধরে সত্য প্রকাশে আপসহীন ও দায়িত্বশীল সাংবাদিকতার বিশ্বস্ত নাম। জামালপুর থেকে যাত্রা শুরু করে আজ দেশ-বিদেশের লক্ষ লক্ষ বাঙালির আস্থা ও ভালোবাসায় সমৃদ্ধ একটি আধুনিক সম্প্রচার মাধ্যম।
                </p>

                {/* Quantitative Metric Ribbon (Tabular Numerals) */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10 max-w-2xl">
                  <div className="space-y-0.5">
                    <span className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">১২+</span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">বছর গৌরবময় পথচলা</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-2xl lg:text-3xl font-black text-red-500 font-mono tabular-nums">৫০০+</span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">সংবাদকর্মী ও প্রতিনিধি</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums">৬৪</span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">জেলায় বিস্তৃত কভারেজ</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono tabular-nums">২৪/৭</span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">সরাসরি আল্ট্রা এইচডি লাইভ</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Institutional Identity Shield */}
              <div className="col-span-5 xl:col-span-4">
                <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded text-[10px] font-black uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      অফিসিয়াল পোর্টাল
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-24 h-24 rounded-2xl bg-black border border-white/20 p-2 flex items-center justify-center shadow-lg">
                      <img 
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg" 
                        alt="Sami TV Logo" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">সামী মাল্টিমিডিয়া লিমিটেড</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">SAMI MULTIMEDIA LTD. (GOVT. REG.)</p>
                    </div>

                    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-left space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">সম্প্রচার ধরন:</span>
                        <span className="text-white font-bold">স্যাটেলাইট, আইপিটিভি ও ডিজিটাল</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">কেন্দ্রীয় স্টুডিও:</span>
                        <span className="text-white font-bold">দিগপাইত, জামালপুর সদর</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ভাষা:</span>
                        <span className="text-white font-bold">বাংলা (সর্বজনীন)</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3 w-full">
                      <a 
                        href="mailto:info.samitv.bd@gmail.com" 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Mail size={13} />
                        <span>যোগাযোগ করুন</span>
                      </a>
                      <a 
                        href="https://www.facebook.com/samitvbd" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/15"
                        title="Facebook Page"
                      >
                        <Facebook size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PC Interactive Section Navigation Bar */}
        <div className="sticky top-10 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between h-14">
            <div className="flex items-center gap-1">
              {[
                { id: 'overview', label: 'নেটওয়ার্ক পরিচিতি ও ইতিহাস', icon: History },
                { id: 'chairman', label: 'চেয়ারম্যান ও প্রতিষ্ঠাতা বার্তা', icon: Award },
                { id: 'charter', label: 'সম্পাদকীয় মূলনীতি ও আদর্শ', icon: FileText },
                { id: 'reach', label: 'সম্প্রচার ব্যাপ্তি ও প্রযুক্তি', icon: Radio },
                { id: 'contact', label: 'স্টুডিও ও ব্যুরো কার্যালয়', icon: Building },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = pcTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPcTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-red-400' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ভেরিফায়েড ব্রডকাস্টার</span>
            </div>
          </div>
        </div>

        {/* PC Content Container */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 space-y-16">
          
          {/* TAB 1: Network History & Heritage */}
          {(pcTab === 'overview' || pcTab === 'reach') && (
            <section className="space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-red-600 font-black text-xs uppercase tracking-widest">ESTABLISHED 2010 • JAMALPUR</span>
                <h2 className="text-3xl font-black text-slate-950 mt-1">আমাদের পথচলা ও ঐতিহ্য</h2>
              </div>

              <div className="grid grid-cols-12 gap-8 items-stretch">
                {/* Main Narrative Card */}
                <div className="col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center gap-3 text-red-600">
                    <History size={24} />
                    <h3 className="text-xl font-black text-slate-900">এক নজরে সামী টিভি (SAMI TV)</h3>
                  </div>

                  <div className="space-y-4 text-slate-700 text-sm leading-relaxed text-justify font-sans">
                    <p>
                      <strong>সামী টেলিভিশন (SAMI TV)</strong> একটি বেসরকারি মালিকানাধীন শীর্ষস্থানীয় বাংলাদেশি বাংলা ভাষার আকাশ ডিটিএইচ (DTH), আইপিটিভি ও ডিজিটাল টেলিভিশন চ্যানেল। ১১ নভেম্বর ২০১০ সালে জামালপুর জেলা সদর থেকে চ্যানেলটি তার আনুষ্ঠানিক সম্প্রচার যাত্রা সফলভাবে শুরু করে।
                    </p>
                    <p>
                      সূচনালগ্ন থেকেই প্রান্তিক মানুষের জীবনের টানাপোড়েন, আঞ্চলিক উন্নয়ন, কৃষি, শিক্ষা, খেলাধুলা এবং সত্য প্রকাশে আপসহীন নীতি ধারণ করে আমরা এগিয়ে চলেছি। তথ্যপ্রযুক্তির আধুনিক অগ্রযাত্রার সাথে তাল মিলিয়ে চ্যানেলটি আজ বৈশ্বিক পরিসরে কোটি বাংলাভাষী মানুষের হৃদয়ে স্থান করে নিয়েছে।
                    </p>
                    <p>
                      সংবাদ পরিবেশনায় নির্ভুলতা ও দ্রুততার সর্বোচ্চ সমন্বয় বজায় রেখে আমরা শুধু সংবাদ প্রচার করি না, বরং সমাজ পরিবর্তনের ইতিবাচক হাতিয়ার হিসেবে কাজ করতে অঙ্গীকারবদ্ধ।
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>সরকারি অনুমোদন ও নীতিমালার অনুসারী</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>২৪ ঘণ্টা নিরবচ্ছিন্ন সরাসরি সম্প্রচার</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>স্বতন্ত্র তদন্তমূলক প্রতিবেদন ইউনিট</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>সর্বাধুনিক 4K ও ক্লাউড স্টুডিও ফ্যাসিলিটি</span>
                    </div>
                  </div>
                </div>

                {/* Milestones Timeline */}
                <div className="col-span-5 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6">
                      <Clock size={20} className="text-red-500" />
                      <span>ঐতিহাসিক মাইলফলকসমূহ</span>
                    </h3>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
                      {milestones.map((m, i) => (
                        <div key={i} className="flex items-start gap-4 relative">
                          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-md ring-4 ring-slate-900">
                            {i + 1}
                          </div>
                          <div>
                            <span className="text-red-400 font-mono text-xs font-black">{m.year}</span>
                            <h4 className="text-sm font-bold text-white leading-tight">{m.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
                    সামী টিভি গ্রুপ • সত্যের সন্ধানে নির্ভীক পদচারণা
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Chairman's Executive Dossier */}
          {(pcTab === 'chairman' || pcTab === 'overview') && (
            <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-8 lg:p-12">
              <div className="border-b border-slate-200 pb-4 mb-8">
                <span className="text-red-600 font-black text-xs uppercase tracking-widest">EXECUTIVE LEADERSHIP</span>
                <h2 className="text-3xl font-black text-slate-950 mt-1">চেয়ারম্যান ও প্রতিষ্ঠাতা প্রোফাইল</h2>
              </div>

              <div className="grid grid-cols-12 gap-10 items-center">
                
                {/* Chairman Portrait & Verification Card */}
                <div className="col-span-4">
                  <div className="bg-slate-900 rounded-3xl p-6 text-white text-center border border-slate-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 to-amber-500" />
                    
                    <div className="relative mx-auto w-48 h-60 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mb-5">
                      <img 
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQIlNZaI7KugfIRmOXvHPu4i_B9xUhdTeG8JBDSYRlRQxJEJNhUWxdQUnWvTfJFCxvDnF9D3oiZtlJcYksYnrJPdGon084dAjJ38JQFjWj0iyFc8Ed-4zaELMmQk27qfCHswas0Rh5hfEvoZrlz6BQwcaWTvXnnByRZPjfSWpOcbtnlT2OthhwDgVN1lgE/s320/645363491_979533377908521_7060082878587727711_n.jpg" 
                        alt="Md. Abul Kashem" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                        FOUNDER
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-white font-sans">Md. Abul Kashem</h3>
                    <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mt-1">
                      চেয়ারম্যান, সামী টিভি গ্রুপ
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      সামী মাল্টিমিডিয়া লিমিটেড
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                      <a 
                        href="mailto:info.samitv.bd@gmail.com" 
                        className="px-4 py-2 bg-white/10 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Mail size={13} />
                        <span>অফিসিয়াল ইমেইল</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Chairman's Message / Presidential Address */}
                <div className="col-span-8 space-y-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <Quote size={28} className="rotate-180" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">প্রতিষ্ঠাতা ও চেয়ারম্যানের বাণী</span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 leading-snug">
                    "আমরা শুধু সংবাদ প্রচার করি না, গণমানুষের অধিকার ও সত্য প্রতিষ্ঠার দায়িত্ব পালন করি।"
                  </h3>

                  <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-sans text-justify">
                    <p>
                      বিসমিল্লাহির রাহমানির রাহিম। প্রিয় দর্শক ও শুভানুধ্যায়ী, সামী টেলিভিশন প্রতিষ্ঠার পেছনে আমাদের একমাত্র উদ্দেশ্য ছিল সমাজের ইতিবাচক পরিবর্তন এবং গণমানুষের কণ্ঠস্বরকে বলিষ্ঠভাবে জাতীয় পর্যায়ে তুলে ধরা।
                    </p>
                    <p>
                      সাংবাদিকতার মূল ভিত্তি হলো সততা ও নির্মোহ দৃষ্টিভঙ্গি। কোনো ব্যক্তি, গোষ্ঠী বা বাণিজ্যিক স্বার্থের কাছে মাথানত না করে আমরা শুরু থেকেই তথ্যভিত্তিক, বস্তুনিষ্ঠ এবং অনুসন্ধানী সংবাদ পরিবেশনে আপসহীন থেকেছি। বিশেষ করে জামালপুরসহ দেশের প্রতিটি জেলার উন্নয়ন, সাধারণ মানুষের জীবনযাত্রা ও সাফল্যের গল্পগুলোকে আমরা বিশ্বমঞ্চে তুলে ধরতে অঙ্গীকারবদ্ধ।
                    </p>
                    <p>
                      আমাদের একনিষ্ঠ সাংবাদিক, প্রযুক্তিবিদ ও শুভাকাঙ্ক্ষীদের অক্লান্ত পরিশ্রমে সামী টেলিভিশন আজ দেশের অন্যতম নির্ভরযোগ্য গণমাধ্যমে পরিণত হয়েছে। আপনাদের অব্যাহত সমর্থনই আমাদের চলার পথের সবচেয়ে বড় প্রেরণা।
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900 text-sm">আলহাজ্ব মোঃ আবুল কাশেম</p>
                      <p className="text-xs text-slate-500 font-semibold">চেয়ারম্যান ও প্রতিষ্ঠাতা, সামী টেলিভিশন</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-400">অফিসিয়াল বার্তা • সামী টিভি প্রকাশনা</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* TAB 3: Editorial Charter & Principles */}
          {(pcTab === 'charter' || pcTab === 'overview') && (
            <section className="space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-red-600 font-black text-xs uppercase tracking-widest">EDITORIAL CHARTER</span>
                <h2 className="text-3xl font-black text-slate-950 mt-1">আমাদের সম্পাদকীয় মূলনীতি ও আদর্শ</h2>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div 
                      key={pillar.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-red-500/40 transition-all shadow-xs flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                          <Icon size={22} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{pillar.enTitle}</span>
                          <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">{pillar.title}</h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed text-justify">
                          {pillar.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-red-600">
                        <Check size={14} />
                        <span>সম্পাদকীয় নীতিতে সংরক্ষিত</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* TAB 4: Contact & Bureau Offices */}
          {(pcTab === 'contact' || pcTab === 'overview') && (
            <section className="space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-red-600 font-black text-xs uppercase tracking-widest">OFFICIAL HUBS</span>
                <h2 className="text-3xl font-black text-slate-950 mt-1">প্রধান কার্যালয় ও ব্যুরো অফিস</h2>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Hub 1: Central Studio */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Building size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">প্রধান সম্প্রচার কেন্দ্র</span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">কেন্দ্রীয় স্টুডিও ও কর্পোরেট অফিস</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    দিগপাইত, জামালপুর সদর উপজেলা, জামালপুর জেলা, ময়মনসিংহ বিভাগ, বাংলাদেশ।
                  </p>
                  <div className="pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span>২৪/৭ সরাসরি সম্প্রচার ও নিউজরুম</span>
                  </div>
                </div>

                {/* Hub 2: Media & Commercial Inquiry */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">যোগাযোগ ও বিজ্ঞাপন</span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">নিউজ ডেস্ক ও বাণিজ্যিক বিভাগ</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ইমেইল: <a href="mailto:info.samitv.bd@gmail.com" className="text-red-600 font-bold hover:underline">info.samitv.bd@gmail.com</a>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ওয়েবসাইট: <a href="https://www.samitvbd.com" target="_blank" rel="noreferrer" className="text-red-600 font-bold hover:underline">www.samitvbd.com</a>
                  </p>
                  <div className="pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Globe size={14} className="text-slate-400" />
                    <span>সারা বিশ্ব থেকে সরাসরি যোগাযোগ</span>
                  </div>
                </div>

                {/* Hub 3: Social & Community */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                      <Facebook size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">সামাজিক যোগাযোগ মাধ্যম</span>
                      <h3 className="text-base font-black text-white mt-0.5">অফিসিয়াল সোশ্যাল নেটওয়ার্ক</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ব্রেকিং নিউজ আপডেট ও তাৎক্ষণিক সংবাদের জন্য আমাদের ফেসবুক পেজ ও ডিজিটাল হ্যান্ডেলে যুক্ত থাকুন।
                    </p>
                  </div>

                  <a 
                    href="https://www.facebook.com/samitvbd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>ফেসবুক পেজ ভিজিট করুন</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>


      {/* =========================================================================
          MOBILE VIEW LAYOUT (Visible on md:hidden)
          Tailored specifically for compact vertical screens, thumb navigation, 
          collapsible accordions, and rapid readability
          ========================================================================= */}
      <div className="md:hidden">
        
        {/* Mobile Header Banner */}
        <section className="bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-white p-4 border-b border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-black border border-white/20 p-1.5 flex items-center justify-center shrink-0 shadow-md">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg" 
                alt="Sami TV Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 bg-red-600 text-white rounded text-[8px] font-black uppercase tracking-wider">
                  ESTD 2010
                </span>
                <span className="text-[9px] text-emerald-400 font-bold">২৪/৭ সরাসরি সম্প্রচার</span>
              </div>
              <h1 className="text-lg font-black uppercase tracking-tight text-white mt-0.5 font-brand">
                SAMI TV <span className="text-sami-red">NEWS</span>
              </h1>
              <p className="text-[10px] text-slate-300 font-semibold truncate">
                সামী মাল্টিমিডিয়া লিমিটেড • জামালপুর
              </p>
            </div>
          </div>

          {/* Quick Quantitative Ribbon (Mobile Compact) */}
          <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/10 text-center text-slate-300">
            <div className="bg-white/5 py-1 px-1 rounded-lg">
              <span className="text-xs font-black text-white font-mono">১২+</span>
              <p className="text-[7.5px] uppercase font-bold text-slate-400">বছর</p>
            </div>
            <div className="bg-white/5 py-1 px-1 rounded-lg">
              <span className="text-xs font-black text-red-500 font-mono">৫০০+</span>
              <p className="text-[7.5px] uppercase font-bold text-slate-400">প্রতিনিধি</p>
            </div>
            <div className="bg-white/5 py-1 px-1 rounded-lg">
              <span className="text-xs font-black text-white font-mono">৬৪</span>
              <p className="text-[7.5px] uppercase font-bold text-slate-400">জেলা</p>
            </div>
            <div className="bg-white/5 py-1 px-1 rounded-lg">
              <span className="text-xs font-black text-emerald-400 font-mono">UHD</span>
              <p className="text-[7.5px] uppercase font-bold text-slate-400">লাইভ</p>
            </div>
          </div>
        </section>

        {/* Mobile Thumb-Friendly Segmented Switcher */}
        <div className="sticky top-[96px] sm:top-[100px] z-35 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs p-1.5 transition-all">
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'overview', label: 'পরিচিতি' },
              { id: 'chairman', label: 'চেয়ারম্যান' },
              { id: 'charter', label: 'মূলনীতি' },
              { id: 'contact', label: 'যোগাযোগ' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id as any)}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer ${
                  mobileTab === tab.id
                    ? 'bg-sami-red text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tabbed Content Area */}
        <div className="p-3 space-y-3.5">
          
          {/* TAB 1: Mobile Overview & Milestones */}
          {mobileTab === 'overview' && (
            <div className="space-y-3">
              {/* Overview Card */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-sami-red">
                  <History size={15} />
                  <h3 className="text-xs font-black text-slate-900">আমাদের পরিচিতি ও পথচলা</h3>
                </div>

                <p className="text-[11.5px] text-slate-600 leading-relaxed text-justify font-sans">
                  <strong>সামী টেলিভিশন (SAMI TV)</strong> একটি শীর্ষস্থানীয় বাংলাদেশি বেসরকারি বাংলা ভাষার আকাশ ডিটিএইচ (DTH), আইপিটিভি ও ডিজিটাল টেলিভিশন চ্যানেল। ১১ নভেম্বর ২০১০ সালে জামালপুর জেলা সদর থেকে চ্যানেলটি তার আনুষ্ঠানিক সম্প্রচার শুরু করে।
                </p>
                <p className="text-[11.5px] text-slate-600 leading-relaxed text-justify font-sans">
                  সত্য প্রকাশে অবিচল ও দায়িত্বশীল সাংবাদিকতার নীতি মেনে প্রান্তিক মানুষের সুখ-দুঃখ ও উন্নয়নের চিত্র সরাসরি কোটি দর্শকের কাছে পৌঁছে দিচ্ছে সামী টেলিভিশন।
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[10px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>২৪/৭ আল্ট্রা এইচডি ডিজিটাল সম্প্রচার</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>৬৪ জেলায় নিজস্ব ও উপজেলা প্রতিনিধি</span>
                  </div>
                </div>
              </div>

              {/* Milestones Mini List */}
              <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <Clock size={13} className="text-sami-red" />
                  <span>ঐতিহাসিক মাইলফলক</span>
                </h4>

                <div className="space-y-2 text-[10.5px]">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="font-mono font-black text-red-400 shrink-0">{m.year}</span>
                      <div>
                        <p className="font-bold text-slate-200">{m.title}</p>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 leading-snug">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Mobile Chairman Profile */}
          {mobileTab === 'chairman' && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-xl overflow-hidden shadow-md border-2 border-red-500 shrink-0">
                    <img 
                      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQIlNZaI7KugfIRmOXvHPu4i_B9xUhdTeG8JBDSYRlRQxJEJNhUWxdQUnWvTfJFCxvDnF9D3oiZtlJcYksYnrJPdGon084dAjJ38JQFjWj0iyFc8Ed-4zaELMmQk27qfCHswas0Rh5hfEvoZrlz6BQwcaWTvXnnByRZPjfSWpOcbtnlT2OthhwDgVN1lgE/s320/645363491_979533377908521_7060082878587727711_n.jpg" 
                      alt="Md. Abul Kashem" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                      প্রতিষ্ঠাতা ও চেয়ারম্যান
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-1">Md. Abul Kashem</h3>
                    <p className="text-[10.5px] font-bold text-slate-600">চেয়ারম্যান, সামী টিভি গ্রুপ</p>
                    <p className="text-[9.5px] text-slate-400 font-medium">সামী মাল্টিমিডিয়া লিমিটেড</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[11px] text-slate-700 italic leading-relaxed">
                  "সামী টেলিভিশনের স্বপ্নদ্রষ্টা এবং অভিভাবক। তাঁর দূরদর্শী ও বলিষ্ঠ নেতৃত্বে আমরা এক যুগেরও বেশি সময় ধরে বস্তুনিষ্ঠ ও নিরপেক্ষ সাংবাদিকতার পথে নিরভয়ভাবে এগিয়ে চলেছি।"
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                  সাংবাদিকতার নীতি মেনে সমাজের অন্যায়, অবিচার ও প্রান্তিক মানুষের কথা তুলে ধরাই আমাদের অঙ্গীকার। দর্শক ও শুভানুধ্যায়ীদের ভালোবাসাই সামী টিভির পথচলার শক্তি।
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a 
                    href="mailto:info.samitv.bd@gmail.com" 
                    className="flex-1 bg-sami-red text-white py-1.5 rounded-lg text-center font-bold text-[10.5px] shadow-2xs flex items-center justify-center gap-1"
                  >
                    <Mail size={12} />
                    <span>ইমেইল পাঠান</span>
                  </a>
                  <a 
                    href="https://www.facebook.com/samitvbd" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg font-bold text-[10.5px] flex items-center gap-1"
                  >
                    <Facebook size={12} className="text-blue-600" />
                    <span>ফেসবুক</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Mobile Editorial Charter (Touch Accordion) */}
          {mobileTab === 'charter' && (
            <div className="space-y-2">
              <div className="px-1 pb-1">
                <span className="text-[10px] font-black uppercase text-red-600">EDITORIAL VALUES</span>
                <h3 className="text-xs font-black text-slate-900">আমাদের সম্পাদকীয় ৪টি মূল স্তম্ভ</h3>
              </div>

              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                const isExpanded = expandedPillar === idx;
                return (
                  <div 
                    key={pillar.id}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedPillar(isExpanded ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[12px] font-black text-slate-900 truncate">{pillar.title}</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{pillar.enTitle}</p>
                        </div>
                      </div>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-red-600' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-0 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed text-justify bg-slate-50/50">
                        <p className="mt-2">{pillar.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: Mobile Hubs & Contact */}
          {mobileTab === 'contact' && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-sami-red">
                  <Building size={16} />
                  <h3 className="text-xs font-black text-slate-900">প্রধান কার্যালয় ও স্টুডিও</h3>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-bold">
                  দিগপাইত, জামালপুর সদর, জামালপুর জেলা, ময়মনসিংহ বিভাগ, বাংলাদেশ।
                </p>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                  ২৪ ঘণ্টা সরাসরি সম্প্রচার ও নিউজরুম ডেস্ক সক্রিয়।
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Mail size={16} />
                  <h3 className="text-xs font-black text-slate-900">নিউজ ডেস্ক ও যোগাযোগ</h3>
                </div>
                <p className="text-[11px] text-slate-700">
                  অফিসিয়াল ইমেইল: <a href="mailto:info.samitv.bd@gmail.com" className="text-sami-red font-bold">info.samitv.bd@gmail.com</a>
                </p>
                <p className="text-[11px] text-slate-700">
                  ওয়েবসাইট: <a href="https://www.samitvbd.com" target="_blank" rel="noreferrer" className="text-sami-red font-bold">www.samitvbd.com</a>
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl p-3 shadow-2xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Facebook size={18} />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black truncate">ফেসবুক অফিসিয়াল পেজ</p>
                    <p className="text-[9.5px] text-blue-100 truncate">সরাসরি বার্তা ও আপডেট</p>
                  </div>
                </div>
                <a 
                  href="https://www.facebook.com/samitvbd" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white text-blue-800 font-bold text-[10px] px-2.5 py-1 rounded-md shrink-0"
                >
                  ভিজিট করুন
                </a>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
