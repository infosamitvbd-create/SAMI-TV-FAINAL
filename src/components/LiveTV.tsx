import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, MessageCircle, Users, Share2, Info, ChevronRight, Calendar, Clock, 
  MapPin, X, Image as ImageIcon, Layout, Maximize2, Send, Facebook, Heart, 
  ThumbsUp, Flame, Award, Sparkles, Check, CheckCircle2, ShieldAlert, Video, 
  Tv, Play, Bell, Volume2, Globe, MessageSquare, Tag, Eye, RefreshCw, Server,
  Sliders, Mic, UserCheck, HelpCircle, Activity, ExternalLink
} from 'lucide-react';
import { LiveTVPlayer } from './LiveTVPlayer';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface LiveTVProps {
  onNewsClick?: (news: any) => void;
  onNavigate?: (page: string) => void;
}

export const LiveTV: React.FC<LiveTVProps> = ({ onNewsClick, onNavigate }) => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [scheduleTab, setScheduleTab] = useState<'today' | 'tomorrow' | 'weekly'>('today');

  // Live chat messages state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; name: string; text: string; time: string; isReporter?: boolean }>>([
    { id: '1', name: 'মোঃ রফিকুল ইসলাম', text: 'সামি টিভির সম্প্রচার আগের চেয়ে অনেক পরিষ্কার লাগছে! শুভকামনা।', time: '১০:৪১ AM' },
    { id: '2', name: 'কাকন আহমেদ ভূঁইয়া', text: 'খবর কক্ষ জামালপুর: কিছুক্ষণের মধ্যেই থাকছে স্থানীয় উন্নয়ন বিষয়ক বিশেষ প্রতিবেদন।', time: '১০:৪৪ AM', isReporter: true },
    { id: '3', name: 'আরিফুল হক', text: 'লাইভ সংবাদ বুলেটিনের সরাসরি আপডেট দেওয়ার জন্য ধন্যবাদ।', time: '১০:৪৬ AM' },
    { id: '4', name: 'শাহীন আলম', text: 'দিগপাইত জামালপুর থেকে সরাসরি দেখছি, চমৎকার কোয়ালিটি।', time: '১০:৪৮ AM' }
  ]);
  const [chatName, setChatName] = useState('');
  const [chatInput, setChatInput] = useState('');

  // Live Poll state
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [hasVotedPoll, setHasVotedPoll] = useState(false);

  useEffect(() => {
    // Fetch schedule
    const qSchedule = query(collection(db, 'schedules'), orderBy('order', 'asc'));
    const unsubscribeSchedule = onSnapshot(qSchedule, (snapshot) => {
      setSchedule(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingSchedule(false);
    }, (error) => {
      console.error("Error fetching schedule:", error);
      setLoadingSchedule(false);
    });

    // Fetch latest news for recent broadcasts section
    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(8));
    const unsubscribeNews = onSnapshot(qNews, (snapshot) => {
      setLatestNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Error fetching news:", error);
    });

    return () => {
      unsubscribeSchedule();
      unsubscribeNews();
    };
  }, []);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now().toString(),
      name: chatName.trim() || 'দর্শক',
      text: chatInput.trim(),
      time: timeStr
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const displaySchedule = schedule;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`${isTheaterMode ? 'bg-[#0a0a0a] min-h-screen -mt-6 -mx-4 sm:-mx-6 lg:-mx-8' : 'w-full px-2 sm:px-6 lg:px-8 py-3 sm:py-6'} transition-colors duration-500`}
    >
      <div className={`${isTheaterMode ? '' : 'grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8'}`}>
        
        {/* Main Player & Primary Stream Content */}
        <div className={`${isTheaterMode ? 'w-full' : 'lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-4 sm:space-y-6'}`}>
          <div className={`${isTheaterMode ? 'rounded-none border-0 shadow-none' : 'bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100'} transition-all duration-500`}>
            
            {/* Header Status Bar */}
            {!isTheaterMode && (
              <div className="bg-[#0a0a0a] text-white px-3 sm:px-6 py-3 sm:py-5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 border-b border-white/10">
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <div className="relative">
                    <div className="bg-red-600 p-2 sm:p-2.5 rounded-xl animate-pulse shadow-[0_0_20px_rgba(204,0,0,0.5)]">
                      <Radio size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500 rounded-full border-2 border-[#1a1a1a] shadow-lg"></div>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-2">
                      SAMI TV <span className="text-sami-red">LIVE</span>
                      <span className="inline-block px-1.5 py-0.5 bg-sami-red/20 border border-sami-red/40 rounded text-[8px] sm:text-[9px] font-black text-sami-red tracking-widest uppercase">
                        4K UHD
                      </span>
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-gray-400 font-bold">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-400">২৪/৭ সরাসরি সম্প্রচার</span>
                    </div>
                  </div>
                </div>

                {/* Stream Status Indicator */}
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>সরাসরি সম্প্রচার সক্রিয় (Ultra HD)</span>
                </div>
              </div>
            )}
            
            {/* Live TV Video Player Component Container */}
            <div className={`p-0 bg-black relative group ${isTheaterMode ? '' : 'aspect-video'}`}>
              <LiveTVPlayer isTheaterMode={isTheaterMode} onToggleTheater={setIsTheaterMode} />
            </div>

            {/* Title, Share & Meta Details Bar */}
            <div className={`${isTheaterMode ? 'bg-[#111] py-6 sm:py-10 px-4 sm:px-8 lg:px-12 text-white border-t border-white/10' : 'p-4 sm:p-8'} transition-all`}>
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-tight shadow-md shadow-red-600/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                      সরাসরি সম্প্রচার
                    </span>
                    <span className={`text-[11px] sm:text-xs ${isTheaterMode ? 'text-gray-400' : 'text-gray-500'} font-bold flex items-center gap-1`}>
                      <Calendar size={13} className="text-sami-red shrink-0" /> 
                      {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  <h2 className={`text-xl sm:text-3xl lg:text-4xl font-black ${isTheaterMode ? 'text-white' : 'text-slate-900'} leading-tight tracking-tight`}>
                    LIVE BROADCAST: SAMI TV (SAMI MULTIMEDIA LTD.)
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 ${isTheaterMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-50 border-slate-200 text-slate-700'} rounded-lg border text-[11px] font-bold`}>
                      <MapPin size={14} className="text-sami-red shrink-0" />
                      <span>দিগপাইত, জামালপুর</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 ${isTheaterMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-50 border-slate-200 text-slate-700'} rounded-lg border text-[11px] font-bold`}>
                      <Clock size={14} className="text-sami-red shrink-0" />
                      <span>২৪ ঘণ্টা সম্প্রচার</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 ${isTheaterMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} rounded-lg border text-[11px] font-bold`}>
                      <Activity size={14} className="text-emerald-600 shrink-0 animate-pulse" />
                      <span>লেটেন্সি: ১৮ মি.সে</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Sami TV Live Stream',
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('লাইভ স্ট্রিম লিঙ্ক কপি করা হয়েছে!');
                      }
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-sami-red text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-red-700 transition-all shadow-md shadow-sami-red/20 active:scale-95"
                  >
                    <Share2 size={16} /> 
                    <span>শেয়ার করুন</span>
                  </button>

                  {isTheaterMode && (
                    <button 
                      onClick={() => setIsTheaterMode(false)}
                      className="p-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all active:scale-95"
                      title="Exit Theater Mode"
                    >
                      <Layout size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent News Broadcasts & Video Highlights Grid */}
          {latestNews.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Video size={20} className="text-sami-red" />
                  <h3 className="text-base font-black text-slate-900">সম্প্রতি সম্প্রচারিত শীর্ষ খবরের হাইলাইটস</h3>
                </div>
                <button 
                  onClick={() => onNavigate?.('/archive')}
                  className="text-xs font-bold text-sami-red hover:underline flex items-center gap-1"
                >
                  <span>আর্কাইভ দেখুন</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {latestNews.slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onNewsClick?.(item)}
                    className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:bg-white hover:border-sami-red/40 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-200">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-sami-red/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={18} className="ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-black px-2 py-0.5 rounded">
                        {item.category || 'সংবাদ'}
                      </span>
                    </div>

                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-sami-red transition-colors mb-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {item.viewCount || 210} বার পঠিত
                        </span>
                        <span>সামি টিভি</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Column: Program Schedule, Interactive Live Chat, Audience Poll & Socials */}
        <div className={`${isTheaterMode ? 'hidden' : 'lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-6'}`}>
          
          {/* Interactive Program Schedule Widget */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-sami-red" />
                <div>
                  <h3 className="font-black text-sm tracking-tight">অনুষ্ঠান সূচী</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">LIVE TIMELINE</p>
                </div>
              </div>

              {/* Day Filter Tabs */}
              <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/10 text-[10px] font-bold">
                {[
                  { key: 'today', label: 'আজ' },
                  { key: 'tomorrow', label: 'কাল' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setScheduleTab(tab.key as any)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      scheduleTab === tab.key ? 'bg-sami-red text-white font-black shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 space-y-2 max-h-[380px] overflow-y-auto">
              {loadingSchedule ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-3 border-sami-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">সূচী লোড হচ্ছে...</p>
                </div>
              ) : displaySchedule.length > 0 ? (
                displaySchedule.map((prog, i) => (
                  <div 
                    key={prog.id || i} 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all relative ${
                      prog.active 
                        ? 'bg-slate-900 text-white shadow-md border border-sami-red/40' 
                        : 'hover:bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <div className={`text-[10px] font-black shrink-0 w-16 text-center py-1.5 rounded-lg ${
                      prog.active ? 'bg-sami-red text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {prog.time}
                    </div>

                    <div className="flex-grow min-w-0">
                      <p className={`text-xs font-bold truncate ${prog.active ? 'text-white' : 'text-slate-900'}`}>
                        {prog.title}
                      </p>
                      {prog.active && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-sami-red rounded-full animate-pulse"></span>
                          <span className="text-[9px] font-black uppercase text-sami-red">এখন সম্প্রচারিত</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-bold text-slate-600">কোনো অনুষ্ঠান সূচী পাওয়া যায়নি</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">অ্যাডমিন প্যানেল থেকে নতুন অনুষ্ঠান সূচী যুক্ত করা হলে এখানে প্রদর্শিত হবে</p>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Viewer Live Chat & Comments Board */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col h-[480px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sami-red/10 text-sami-red flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xs">লাইভ চ্যাট ও দর্শকদের মন্তব্য</h3>
                  <p className="text-[10px] font-bold text-slate-400">সরাসরি বার্তা পাঠান</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md text-[9px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                সক্রিয় চ্যাট
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto bg-slate-50/30">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-2.5 rounded-xl text-xs border ${
                    msg.isReporter 
                      ? 'bg-red-50/80 border-red-100 text-slate-900' 
                      : 'bg-white border-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-black text-[11px] flex items-center gap-1 ${msg.isReporter ? 'text-sami-red' : 'text-slate-900'}`}>
                      {msg.name}
                      {msg.isReporter && <CheckCircle2 size={12} className="text-sami-red fill-red-100" />}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">{msg.time}</span>
                  </div>
                  <p className="font-medium leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 bg-white space-y-2">
              <input 
                type="text" 
                placeholder="আপনার নাম (ঐচ্ছিক)" 
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-sami-red transition-colors"
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="লাইভ চ্যাটে লিখুন..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-sami-red transition-colors"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-sami-red hover:bg-red-700 text-white p-2 rounded-lg transition-all shadow-xs shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Audience Poll (জনমত জরিপ) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 bg-sami-red rounded-full"></span>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">আজকের সরাসরি জনমত জরিপ</h3>
            </div>

            <p className="text-xs font-bold text-slate-800 mb-4 leading-relaxed">
              সামি টিভির সরাসরি সম্প্রচারে প্রচারিত সংবাদ উপস্থাপনা ও তথ্য উপস্থাপনের মান কেমন লাগছে?
            </p>

            {!hasVotedPoll ? (
              <div className="space-y-2">
                {['অত্যন্ত চমৎকার ও স্পষ্ট', 'ভালো, তবে আরও উন্নয়ন সম্ভব', 'সাধারণ'].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPollOption(i)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      selectedPollOption === i 
                        ? 'border-sami-red bg-red-50/50 text-sami-red' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPollOption === i ? 'border-sami-red bg-sami-red text-white' : 'border-slate-300'}`}>
                      {selectedPollOption === i && <Check size={10} />}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => selectedPollOption !== null && setHasVotedPoll(true)}
                  disabled={selectedPollOption === null}
                  className="w-full mt-3 bg-slate-900 hover:bg-sami-red disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-xs"
                >
                  ভোট সাবমিট করুন
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { option: 'অত্যন্ত চমৎকার ও স্পষ্ট', percent: 86 },
                  { option: 'ভালো, তবে আরও উন্নয়ন সম্ভব', percent: 11 },
                  { option: 'সাধারণ', percent: 3 }
                ].map((res, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{res.option}</span>
                      <span className="text-sami-red">{res.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sami-red rounded-full transition-all duration-1000" 
                        style={{ width: `${res.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-emerald-600 font-bold text-center mt-2 flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> আপনার মতামত সফলভাবে গৃহীত হয়েছে
                </p>
              </div>
            )}
          </div>

          {/* Facebook Official Community Box */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-5 text-white shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Facebook size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm">ফেসবুক অফিসিয়াল পেজ</h4>
                <p className="text-[10px] text-blue-100 font-semibold">সরাসরি নিউজ মেসেজিং</p>
              </div>
            </div>
            <p className="text-xs text-blue-50 font-medium mb-4 leading-relaxed">
              সামি টিভির অফিসিয়াল ফেসবুক পেজে যুক্ত হয়ে সরাসরি আপডেট নিন এবং লাইভ বার্তা পাঠান।
            </p>
            <a 
              href="https://www.facebook.com/samitvbd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>ফেসবুক পেজ দেখুন</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
