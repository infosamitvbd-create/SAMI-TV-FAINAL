import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Clock, User, Share2, Tag, Printer, MapPin, Facebook, Twitter, 
  MessageCircle, Copy, Check, ChevronRight, Bookmark, Eye, ThumbsUp, 
  ArrowUp, Home as HomeIcon, Calendar, Heart, MessageSquare, Send, 
  Sparkles, Minus, Plus, Share, CheckCircle2, Flame, Award
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';

interface NewsDetailProps {
  news: any;
  onBack: () => void;
  onNewsClick?: (news: any) => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news: initialNews, onBack, onNewsClick }) => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(initialNews);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!initialNews);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fontSize, setFontSize] = useState(18); // Default body font size in px

  // Reactions state
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    like: 34,
    love: 58,
    wow: 19,
    sad: 3
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);

  // Poll state
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [hasVotedPoll, setHasVotedPoll] = useState(false);

  // Comments state
  const [commentList, setCommentList] = useState<Array<{ id: string; name: string; text: string; date: string }>>([
    {
      id: '1',
      name: 'মো: রফিকুল ইসলাম',
      text: 'খবরটি প্রকাশ করার জন্য ধন্যবাদ। নিরপেক্ষ ও বস্তুনিষ্ঠ সাংবাদিকতার অগ্রযাত্রায় সামি টিভির শুভকামনা।',
      date: '১ ঘণ্টা আগে'
    },
    {
      id: '2',
      name: 'আব্দুল্লাহ আল মামুন',
      text: 'সামাজিক উন্নয়ন ও তথ্যের সঠিক প্রসারে এই জাতীয় পদক্ষেপ গুরুত্বপূর্ণ ভূমিকা রাখবে।',
      date: '৩০ মিনিট আগে'
    }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const calculateReadingTime = (text: string) => {
    if (!text) return 1;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const readingTime = news ? calculateReadingTime(news.content) : 1;

  const printRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!initialNews && newsId) {
      setLoading(true);
      const fetchNews = async () => {
        try {
          const docRef = doc(db, 'news', newsId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setNews({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (error) {
          console.error("Error fetching news:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNews();
    } else {
      setNews(initialNews);
      setLoading(false);
    }
  }, [newsId, initialNews]);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(12));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setLatestNews(allNews.filter(item => item.id !== news?.id).slice(0, 8));
      setRelatedNews(allNews.filter(item => item.id !== news?.id && item.category === news?.category).slice(0, 4));
    });
    return () => unsubscribe();
  }, [news?.id, news?.category]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-sami-red rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500">সংবাদ লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 max-w-xl mx-auto shadow-sm my-10 p-6">
        <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">সংবাদটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-slate-500 text-sm mb-6">সংবাদটি সরিয়ে ফেলা হতে পারে অথবা লিঙ্কটি ভুল হতে পারে।</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-sami-red text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-all shadow-md active:scale-95"
        >
          প্রধান পাতায় ফিরে যান
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSaveImage = async () => {
    if (!saveRef.current) return;
    setIsSaving(true);
    try {
      const dataUrl = await toPng(saveRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        quality: 1,
      });
      
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `SAMI-TV-${news.title.slice(0, 20).replace(/\s+/g, '-')}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: news.title,
            text: 'SAMI TV - ডিজিটাল ক্লিপ',
          });
          setIsLiked(true);
        } catch (shareError) {
          if ((shareError as Error).name !== 'AbortError') {
            throw shareError;
          }
        }
      } else {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (type: string) => {
    if (userReaction === type) {
      setUserReaction(null);
      setReactions(prev => ({ ...prev, [type]: prev[type] - 1 }));
    } else {
      if (userReaction) {
        setReactions(prev => ({ ...prev, [userReaction]: prev[userReaction] - 1 }));
      }
      setUserReaction(type);
      setReactions(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const commentObj = {
      id: Date.now().toString(),
      name: newCommentName.trim() || 'পাঠক',
      text: newCommentText.trim(),
      date: 'এইমাত্র'
    };
    setCommentList([commentObj, ...commentList]);
    setNewCommentText('');
    setNewCommentName('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  const formattedDate = new Date(news?.createdAt?.seconds ? news.createdAt.seconds * 1000 : Date.now())
    .toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-16">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-sami-red z-[70] origin-left"
        style={{ scaleX }}
      />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-11 h-11 bg-slate-900 text-white rounded-full shadow-xl z-50 flex items-center justify-center hover:bg-sami-red transition-all active:scale-95 group border border-white/20"
            aria-label="Back to top"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Top Header Breadcrumbs & Action Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sami-red hover:text-white transition-colors text-xs font-bold text-slate-700 shrink-0"
            >
              <ArrowLeft size={14} />
              <span>ফিরে যান</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 whitespace-nowrap overflow-hidden">
              <button onClick={() => navigate('/')} className="hover:text-sami-red flex items-center gap-1">
                <HomeIcon size={12} />
                <span>প্রচ্ছদ</span>
              </button>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-sami-red font-bold">{news.category || 'সংবাদ'}</span>
            </div>
          </div>

          {/* Quick Font Size & Share Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-extrabold text-xs rounded hover:bg-white transition-all"
                title="ফন্ট ছোট করুন"
              >
                <Minus size={12} />
              </button>
              <span className="text-[11px] font-bold px-1.5 text-slate-600 select-none">অঅ</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-extrabold text-xs rounded hover:bg-white transition-all"
                title="ফন্ট বড় করুন"
              >
                <Plus size={12} />
              </button>
            </div>

            <button 
              onClick={handleSaveImage}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              title="ডিজিটাল ক্লিপ হিসেবে সেভ করুন"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-sami-red border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Bookmark size={14} className={isLiked ? 'fill-sami-red text-sami-red' : 'text-slate-500'} />
              )}
              <span className="hidden sm:inline">সেভ ক্লিপ</span>
            </button>

            <button 
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              <Printer size={14} className="text-slate-500" />
              <span>প্রিন্ট</span>
            </button>

            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sami-red hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? 'কপি হয়েছে' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Article Column */}
          <main className="col-span-1 lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-8">
            <article>
              {/* Category Pill & Highlights Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 text-sami-red font-black text-xs border border-red-100 tracking-wide uppercase">
                  <Tag size={12} />
                  {news.category || 'সংবাদ'}
                </span>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    {readingTime} মিনিট পাঠ
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-slate-400" />
                    {news.viewCount || 342} পঠিত
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-[1.3] sm:leading-[1.35] tracking-tight mb-5 selection:bg-red-100 selection:text-sami-red">
                {news.title}
              </h1>

              {/* Reporter Info & Date Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sami-red/10 border border-sami-red/20 flex items-center justify-center text-sami-red shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span>{news.journalistName || 'কাকন আহমেদ ভূঁইয়া'}</span>
                      <CheckCircle2 size={14} className="text-blue-600 fill-blue-50" />
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500">বিশেষ প্রতিনিধি, জামালপুর • সামি টিভি</p>
                  </div>
                </div>

                <div className="text-right text-xs font-semibold text-slate-500 flex flex-col items-start sm:items-end gap-0.5">
                  <div className="flex items-center gap-1 text-slate-700">
                    <Calendar size={13} className="text-sami-red" />
                    <span>{formattedDate}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">সর্বশেষ আপডেট: {formattedDate}</span>
                </div>
              </div>

              {/* Featured Image Block */}
              <figure className="mb-8 group">
                <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs aspect-video relative">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Award size={12} className="text-amber-400" />
                    <span>সামি টিভি এক্সক্লুসিভ</span>
                  </div>
                </div>
                <figcaption className="mt-2.5 text-xs text-slate-500 font-medium italic flex items-start gap-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-700 not-italic shrink-0">ছবি:</span>
                  <span>{news.journalistName || 'কাকন আহমেদ ভূঁইয়া'} / বিশেষ প্রতিনিধি, সামি টিভি</span>
                </figcaption>
              </figure>

              {/* Quick Article Excerpt / Highlight Box */}
              {news.content && news.content.length > 100 && (
                <div className="mb-8 p-4 bg-red-50/50 border-l-4 border-sami-red rounded-r-xl">
                  <h3 className="text-xs font-black uppercase text-sami-red tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    এক নজরে সংক্ষেপ
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                    {news.content.slice(0, 180)}...
                  </p>
                </div>
              )}

              {/* Main News Content Body */}
              <div 
                className="news-article-body text-slate-800 leading-[1.85] sm:leading-[1.95] selection:bg-red-100 selection:text-sami-red font-medium tracking-normal mb-10"
                style={{ fontSize: `${fontSize}px` }}
              >
                {news.content?.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => {
                  const trimmed = paragraph.trim();
                  if (idx === 0) {
                    return (
                      <p key={idx} className="mb-6 first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-black first-letter:text-sami-red first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                        {trimmed}
                      </p>
                    );
                  }
                  return (
                    <p key={idx} className="mb-6">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Tag Badges */}
              <div className="pt-6 border-t border-slate-200 mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                    <Tag size={13} />
                    ট্যাগস:
                  </span>
                  {['জামালপুর', news.category || 'সংবাদ', 'সামি_টিভি', 'সর্বশেষ_সংবাদ'].map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-slate-100 hover:bg-sami-red hover:text-white transition-colors rounded-full text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reactions Bar */}
              <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80 mb-10 text-center">
                <h3 className="text-sm font-black text-slate-900 mb-3">সংবাদটি আপনার কেমন লাগলো?</h3>
                <div className="flex justify-center flex-wrap gap-3 sm:gap-4">
                  {[
                    { id: 'like', label: 'ধন্যবাদ', emoji: '👍', count: reactions.like },
                    { id: 'love', label: 'চমৎকার', emoji: '❤️', count: reactions.love },
                    { id: 'wow', label: 'বিস্ময়কর', emoji: '😮', count: reactions.wow },
                    { id: 'sad', label: 'দুঃখজনক', emoji: '😢', count: reactions.sad }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleReaction(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        userReaction === item.id 
                          ? 'bg-sami-red text-white border-sami-red shadow-sm scale-105' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sami-red/50 hover:bg-red-50/50'
                      }`}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-bold">
                        {item.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-200 pt-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <MessageSquare size={18} className="text-sami-red" />
                    <span>পাঠকের মতামত ({commentList.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">আপনার মন্তব্য লিখুন</span>
                </div>

                {/* New Comment Form */}
                <form onSubmit={handleAddComment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input 
                      type="text" 
                      placeholder="আপনার নাম (ঐচ্ছিক)" 
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-sami-red transition-colors"
                    />
                  </div>
                  <textarea 
                    rows={3} 
                    placeholder="সংবাদ সম্পর্কিত আপনার সুচিন্তিত মতামত লিখুন..." 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs font-semibold focus:outline-none focus:border-sami-red transition-colors resize-none mb-3"
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="bg-sami-red hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Send size={12} />
                      <span>মন্তব্য প্রকাশ করুন</span>
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-3">
                  {commentList.map((comment) => (
                    <div key={comment.id} className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-black text-slate-900">{comment.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-400">{comment.date}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related News Grid */}
              {relatedNews.length > 0 && (
                <div className="pt-8 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-5 bg-sami-red rounded-full"></span>
                      <span>সম্পর্কিত খবর</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedNews.map(item => (
                      <div 
                        key={item.id} 
                        className="flex gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 hover:border-sami-red/40 hover:bg-white transition-all cursor-pointer group" 
                        onClick={() => {
                          onNewsClick?.(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                          <img 
                            src={item.imageUrl} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div className="flex flex-col justify-between py-0.5 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-sami-red transition-colors leading-snug">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                            <Clock size={10} />
                            সামি টিভি
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </main>

          {/* Right Sidebar Column */}
          <aside className="col-span-1 lg:col-span-4 space-y-6">
            
            {/* Most Read (সর্বাধিক পঠিত) Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Flame size={18} className="text-sami-red" />
                  <h3 className="text-sm font-black text-slate-900">সর্বাধিক পঠিত</h3>
                </div>
                <span className="text-[10px] font-bold text-sami-red bg-red-50 px-2 py-0.5 rounded-md">
                  আজকের খবর
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {latestNews.slice(0, 6).map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="p-3 flex gap-3 group cursor-pointer hover:bg-slate-50 transition-colors items-center"
                    onClick={() => {
                      onNewsClick?.(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-sami-red group-hover:text-white transition-colors">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-sami-red transition-colors leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <div className="w-14 h-11 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAMI TV Live Streaming Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sami-red animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-sami-red">SAMI TV LIVE</span>
              </div>
              <h3 className="text-base font-black mb-1">সামি টিভি সরাসরি সম্প্রচার</h3>
              <p className="text-xs text-slate-300 mb-4 font-medium">জামালপুরের খবরের বিশ্বস্ত মাধ্যম। সরাসরি দেখুন ইউটিউব ও ফেসবুকে।</p>
              <button 
                onClick={() => navigate('/')} 
                className="w-full bg-sami-red hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>লাইভ দেখুন</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Opinion Poll (জনমত জরিপ) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-sami-red rounded-full"></span>
                <h3 className="text-sm font-black text-slate-900">জনমত জরিপ</h3>
              </div>

              <p className="text-xs font-bold text-slate-700 mb-4 leading-relaxed">
                আপনার কি মনে হয় জামালপুরে শিল্প পার্ক স্থাপনের ফলে স্থানীয় বেকারত্ব উল্লেখযোগ্য হারে হ্রাস পাবে?
              </p>

              {!hasVotedPoll ? (
                <div className="space-y-2 mb-4">
                  {['হ্যাঁ', 'না', 'মন্তব্য নেই'].map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPollOption(i)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        selectedPollOption === i 
                          ? 'border-sami-red bg-red-50/50 text-sami-red' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                    >
                      <span>{option}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPollOption === i ? 'border-sami-red bg-sami-red text-white' : 'border-slate-300'}`}>
                        {selectedPollOption === i && <Check size={10} />}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => selectedPollOption !== null && setHasVotedPoll(true)}
                    disabled={selectedPollOption === null}
                    className="w-full mt-2 bg-slate-900 hover:bg-sami-red disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                  >
                    ভোট দিন
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {[
                    { option: 'হ্যাঁ', percent: 82 },
                    { option: 'না', percent: 12 },
                    { option: 'মন্তব্য নেই', percent: 6 }
                  ].map((res, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{res.option}</span>
                        <span>{res.percent}%</span>
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
                    <CheckCircle2 size={12} /> আপনার মতামত গৃহীত হয়েছে
                  </p>
                </div>
              )}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800">
              <h3 className="font-black text-sm mb-1">ইমেইলে তাজা খবর</h3>
              <p className="text-slate-400 text-xs mb-4 font-medium">প্রতিদিনের প্রধান সংবাদ ইনবক্সে পেতে সাবস্ক্রাইব করুন।</p>
              
              {newsletterSubscribed ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="আপনার ইমেইল ঠিকানা" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sami-red transition-colors"
                    required
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-sami-red hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    সাবস্ক্রাইব
                  </button>
                </form>
              )}
            </div>

            {/* Social Share Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center">
              <h3 className="font-black text-xs text-slate-700 mb-3 uppercase tracking-wider">আমাদের সোশ্যাল মিডিয়া</h3>
              <div className="flex justify-center gap-2">
                {[
                  { icon: Facebook, color: 'hover:bg-blue-600 hover:text-white', link: '#' },
                  { icon: Twitter, color: 'hover:bg-sky-500 hover:text-white', link: '#' },
                  { icon: MessageCircle, color: 'hover:bg-emerald-600 hover:text-white', link: '#' },
                  { icon: Share2, color: 'hover:bg-sami-red hover:text-white', link: '#' }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.link} 
                    className={`w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center transition-all ${item.color}`}
                  >
                    <item.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Hidden Digital Edition Canvas for "Save Clip" functionality */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
        <div ref={saveRef} className="w-[800px] h-[1130px] bg-white p-0 overflow-hidden font-sans text-black shadow-2xl border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="bg-sami-red h-2"></div>
            <div className="px-8 py-4 border-b-2 border-sami-red bg-gradient-to-r from-slate-50 via-white to-red-50/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg"
                  alt="SAMI TV"
                  className="h-16 w-auto object-contain rounded-lg border border-gray-200 shadow-sm"
                  crossOrigin="anonymous"
                />
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">SAMI MULTIMEDIA LTD.</h2>
                  <h3 className="text-xs font-bold text-gray-600 tracking-wider mt-1">SAMI NETWORK BANGLADESH</h3>
                  <p className="text-[11px] font-bold text-sami-red italic mt-0.5">বাংলায় কথা বলে...</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-sami-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                  Digital Edition • A4
                </span>
                <p className="text-[10px] font-black text-sami-red mt-1.5 uppercase tracking-tighter">www.jamalpur-television.web.app</p>
              </div>
            </div>

            <div className="px-8 py-5">
              <h1 className="text-[23px] font-black text-gray-900 leading-[1.3] mb-3 tracking-tight line-clamp-2">
                {news.title}
              </h1>

              <div className="flex items-center justify-between gap-4 mb-4 text-[11px] text-gray-700 font-bold border-y border-gray-200 py-2 px-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Calendar size={13} className="text-sami-red" /> {formattedDate}</span>
                  <span className="flex items-center gap-1.5"><User size={13} className="text-sami-red" /> {news.journalistName || 'বিশেষ প্রতিনিধি, জামালপুর'}</span>
                  {news.category && <span className="bg-red-100 text-sami-red px-2 py-0.5 rounded text-[10px] font-black">{news.category}</span>}
                </div>
                <div className="text-slate-500 font-bold text-[10px]">সামি টেলিভিশন অফিশিয়াল পেপার</div>
              </div>

              <div className="mb-4 rounded-xl overflow-hidden shadow-md border border-gray-200 h-[240px] w-full bg-slate-100">
                <img 
                  src={news.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt="" 
                  crossOrigin="anonymous"
                />
              </div>

              <div 
                className="news-text-content relative text-justify leading-[1.7] text-gray-800 font-medium text-[12.5px] max-h-[510px] overflow-hidden"
              >
                <div className="columns-2 gap-6 space-y-2.5">
                  {news.content?.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-2 text-justify indent-2 break-inside-avoid-column">{paragraph.trim()}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 px-8 py-3 flex items-center justify-between text-white border-t-2 border-sami-red">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">SAMI MULTIMEDIA LTD. • ডিজিটাল সংস্করণ</p>
              <p className="text-[11px] font-black text-gray-200">{formattedDate}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-0.5">
                <span className="w-2 h-2 rounded-full bg-sami-red animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-200">Official Digital Clip</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold">© ২০২৬ সামী মাল্টিমিডিয়া লিমিটেড | সর্বস্বত্ব সংরক্ষিত</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print Template */}
      <div className="fixed left-[-9999px] top-0 print:static print:left-0 print:w-full">
        <div ref={printRef} className="w-[800px] max-h-[1100px] mx-auto bg-white p-8 font-sans text-black overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-sami-red pb-4 mb-4">
              <div className="flex items-center gap-4">
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg"
                  alt="SAMI TV"
                  className="h-16 w-auto object-contain rounded-md border border-gray-200"
                />
                <div>
                  <h1 className="text-2xl font-black text-gray-900 leading-none">SAMI MULTIMEDIA LTD.</h1>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1">SAMI NETWORK BANGLADESH</p>
                  <p className="text-[11px] font-bold text-sami-red italic mt-0.5">বাংলায় কথা বলে...</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-sami-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  1 Page A4 Print
                </span>
                <p className="text-[10px] font-bold text-gray-500 mt-1">www.jamalpur-television.web.app</p>
              </div>
            </div>
            
            <h2 className="text-[22px] font-black mb-3 leading-[1.3] text-gray-900 line-clamp-2">{news.title}</h2>
            
            <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 mb-4 border border-gray-200">
              <div className="flex gap-5">
                <span className="flex items-center gap-1.5"><User size={14} className="text-sami-red" /> প্রতিনিধি: {news.journalistName || 'বিশেষ প্রতিনিধি'}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-sami-red" /> {formattedDate}</span>
              </div>
              <div className="text-sami-red font-black text-[11px] uppercase">Official News Paper</div>
            </div>
            
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 h-[220px] bg-slate-100">
              <img src={news.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="text-[12px] leading-[1.65] text-gray-900 text-justify columns-2 gap-6 max-h-[480px] overflow-hidden">
              {news.content?.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-2 text-justify indent-2 break-inside-avoid-column">{paragraph.trim()}</p>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-300 flex justify-between items-center text-[10px] text-gray-600 font-bold">
            <div>
              <p className="font-black text-gray-800">SAMI MULTIMEDIA LTD. • জামালপুর, বাংলাদেশ</p>
              <p className="text-gray-500">www.jamalpur-television.web.app</p>
            </div>
            <div className="text-right">
              <p className="text-sami-red font-black">© ২০২৬ সামী মাল্টিমিডিয়া লিমিটেড</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
