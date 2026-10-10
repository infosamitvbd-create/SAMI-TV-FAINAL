import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Clock, User, Share2, Tag, Printer, MapPin, Facebook, Twitter, 
  MessageCircle, Copy, Check, ChevronRight, Bookmark, Eye, ThumbsUp, 
  ArrowUp, Home as HomeIcon, Calendar, Heart, MessageSquare, Send, 
  Sparkles, Minus, Plus, Share, CheckCircle2, Flame, Award, ChevronsRight
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
  const [fontSize, setFontSize] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 14 : 18));

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
  const [activeSidebarTab, setActiveSidebarTab] = useState<'popular' | 'latest'>('popular');

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

  const toBanglaNum = (num: number | string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (d) => banglaDigits[Number(d)]);
  };

  const formattedDate = new Date(news?.createdAt?.seconds ? news.createdAt.seconds * 1000 : Date.now())
    .toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const formattedTime = new Date(news?.createdAt?.seconds ? news.createdAt.seconds * 1000 : Date.now())
    .toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = encodeURIComponent(news?.title || 'SAMI TV News');

  const desktopRelatedPool = (relatedNews.length >= 4
    ? relatedNews
    : [...relatedNews, ...latestNews.filter(l => !relatedNews.some(r => r.id === l.id))]
  ).slice(0, 4);

  const paragraphs: string[] = news?.content
    ? news.content.split('\n').filter((p: string) => p.trim() !== '')
    : [];

  return (
    <div className="bg-slate-50 lg:bg-[#f4f5f7] min-h-screen text-slate-800 pb-16">
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
            className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-10 h-10 sm:w-11 sm:h-11 bg-slate-900 text-white rounded-full shadow-xl z-50 flex items-center justify-center hover:bg-sami-red transition-all active:scale-95 group border border-white/20 cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Top Header Breadcrumbs & Action Bar */}
      <div className="bg-white border-b border-slate-200/90 lg:sticky lg:top-10 z-30 shadow-2xs">
        <div className="w-full max-w-[1650px] mx-auto px-2.5 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 lg:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 lg:gap-3 overflow-hidden">
            <button 
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-sami-red hover:text-white transition-colors text-[11px] sm:text-xs font-bold text-slate-700 shrink-0 cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>ফিরে যান</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs lg:text-[13px] font-medium text-slate-500 whitespace-nowrap overflow-hidden">
              <span className="text-slate-300 hidden lg:inline">|</span>
              <button onClick={() => navigate('/')} className="hover:text-sami-red flex items-center gap-1.5 transition-colors cursor-pointer">
                <HomeIcon size={13} />
                <span>প্রচ্ছদ</span>
              </button>
              <ChevronRight size={13} className="text-slate-300 shrink-0" />
              <button 
                onClick={() => navigate(`/category/${encodeURIComponent(news.category || 'জাতীয়')}`)}
                className="text-sami-red font-bold hover:underline cursor-pointer"
              >
                {news.category || 'সংবাদ'}
              </button>
              <ChevronRight size={13} className="text-slate-300 hidden lg:inline shrink-0" />
              <span className="hidden lg:inline text-slate-600 font-medium truncate max-w-[420px] xl:max-w-[580px]">
                {news.title}
              </span>
            </div>
          </div>

          {/* Quick Font Size & Share Controls */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 mr-1 text-xs font-semibold text-slate-500">
              <span>ফন্ট সাইজ:</span>
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/90">
              <button 
                onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-extrabold text-xs rounded hover:bg-white transition-all cursor-pointer"
                title="ফন্ট ছোট করুন"
              >
                <Minus size={11} />
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold px-1 sm:px-2 text-slate-700 select-none">অঅ</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-extrabold text-xs rounded hover:bg-white transition-all cursor-pointer"
                title="ফন্ট বড় করুন"
              >
                <Plus size={11} />
              </button>
            </div>

            <button 
              onClick={handleSaveImage}
              disabled={isSaving}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-[11px] sm:text-xs font-bold text-slate-700 transition-colors border border-transparent lg:border-slate-200/80 cursor-pointer"
              title="ডিজিটাল ক্লিপ হিসেবে সেভ করুন"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-sami-red border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Bookmark size={13} className={isLiked ? 'fill-sami-red text-sami-red' : 'text-slate-600'} />
              )}
              <span className="hidden sm:inline">ডিজিটাল ক্লিপ</span>
            </button>

            <button 
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-700 transition-colors border border-transparent lg:border-slate-200/80 cursor-pointer"
            >
              <Printer size={14} className="text-slate-600" />
              <span>প্রিন্ট</span>
            </button>

            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg bg-sami-red hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              <span>{copied ? 'কপি হয়েছে' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1650px] mx-auto px-2.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-6 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 items-start">
          
          {/* Main Article Column */}
          <main className="col-span-1 lg:col-span-8 xl:col-span-8 bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs p-3 sm:p-8 lg:p-10 xl:p-12">
            <article>
              {/* Category Kicker & Metadata Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 sm:mb-4 lg:mb-5 lg:pb-4 lg:border-b lg:border-slate-100">
                <div className="flex items-center gap-2 lg:gap-3">
                  <span 
                    onClick={() => navigate(`/category/${encodeURIComponent(news.category || 'জাতীয়')}`)}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 lg:px-3.5 lg:py-1 rounded-md bg-red-50 text-sami-red font-black text-[10px] sm:text-xs lg:text-[13px] border border-red-100 tracking-wide uppercase cursor-pointer hover:bg-sami-red hover:text-white transition-colors"
                  >
                    <Tag size={11} className="sm:hidden" />
                    <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-sami-red mr-0.5"></span>
                    {news.category || 'সংবাদ'}
                  </span>
                  <span className="hidden lg:inline text-slate-300">•</span>
                  <span className="hidden lg:inline-flex items-center gap-1 text-xs font-bold text-slate-600">
                    <MapPin size={13} className="text-sami-red" />
                    <span>জামালপুর ডেস্ক</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-[10.5px] sm:text-xs lg:text-[13px] font-semibold text-slate-500 tabular-nums">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    {toBanglaNum(readingTime)} মিনিট পাঠ
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-slate-400" />
                    {toBanglaNum(news.viewCount || 342)} পঠিত
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-[16.5px] sm:text-3xl md:text-4xl lg:text-[34px] xl:text-[38px] font-black text-slate-900 lg:text-slate-950 leading-[1.35] sm:leading-[1.35] lg:leading-[1.32] tracking-tight mb-3 sm:mb-5 lg:mb-6 selection:bg-red-100 selection:text-sami-red">
                {news.title}
              </h1>

              {/* PC-Only Editorial Sub-deck / Lead Line */}
              {paragraphs.length > 0 && (
                <p className="hidden lg:block text-[17px] text-slate-600 font-medium leading-[1.65] mb-6">
                  {paragraphs[0].slice(0, 185)}{paragraphs[0].length > 185 ? '...' : ''}
                </p>
              )}

              {/* Reporter Info, Date Bar & PC Social Share Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 py-2 px-2.5 sm:py-3.5 sm:px-4 lg:py-4 lg:px-5 rounded-lg sm:rounded-xl bg-slate-50 lg:bg-[#f8f9fa] border border-slate-100 lg:border-slate-200/80 mb-3.5 sm:mb-6 lg:mb-8">
                <div className="flex items-center gap-2 sm:gap-3.5">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-sami-red/10 border border-sami-red/20 flex items-center justify-center text-sami-red shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h4 className="text-[11px] sm:text-sm lg:text-[15px] font-black text-slate-900 flex items-center gap-1 sm:gap-1.5">
                      <span>{news.journalistName || 'কাকন আহমেদ ভূঁইয়া'}</span>
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-blue-600 fill-blue-50" />
                    </h4>
                    <p className="text-[9.5px] sm:text-[11px] lg:text-xs font-semibold text-slate-500">
                      বিশেষ প্রতিনিধি, জামালপুর • সামি টিভি নিউজরুম
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-left sm:text-right text-[10px] sm:text-xs lg:text-[13px] font-semibold text-slate-500 flex flex-col items-start sm:items-end gap-0.5">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sami-red" />
                      <span>প্রকাশ: {formattedDate}</span>
                    </div>
                    <span className="hidden sm:inline text-[11px] lg:text-xs text-slate-500">
                      আপডেট: {formattedTime} • বাংলাদেশ সময়
                    </span>
                  </div>

                  {/* PC Direct Share Icons in Byline */}
                  <div className="hidden xl:flex items-center gap-1.5 pl-5 border-l border-slate-200">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="ফেসবুকে শেয়ার করুন"
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 text-slate-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] flex items-center justify-center transition-all shadow-2xs"
                    >
                      <Facebook size={14} />
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="হোয়াটসঅ্যাপে শেয়ার করুন"
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 text-slate-600 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] flex items-center justify-center transition-all shadow-2xs"
                    >
                      <MessageCircle size={14} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="এক্স (টুইটার)-এ শেয়ার করুন"
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <Twitter size={14} />
                    </a>
                    <button
                      onClick={handleCopyLink}
                      title="লিঙ্ক কপি করুন"
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 text-slate-600 hover:bg-sami-red hover:text-white hover:border-sami-red flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Image Block */}
              <figure className="mb-3.5 sm:mb-8 lg:mb-9 group">
                <div className="rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs aspect-video relative">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 bg-slate-900/85 backdrop-blur-md text-white text-[8.5px] sm:text-[10px] lg:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                    <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-amber-400" />
                    <span>সামি টিভি এক্সক্লুসিভ</span>
                  </div>
                </div>
                <figcaption className="mt-1.5 sm:mt-2.5 text-[10px] sm:text-xs lg:text-[13px] text-slate-500 font-medium flex items-center justify-between gap-2 bg-slate-50/90 p-1.5 sm:p-2.5 lg:px-4 lg:py-2.5 rounded-lg border border-slate-100 lg:border-slate-200/70">
                  <div className="flex items-start gap-1.5 sm:gap-2 italic">
                    <span className="font-bold text-slate-700 not-italic shrink-0">ছবি:</span>
                    <span>{news.journalistName || 'কাকন আহমেদ ভূঁইয়া'} / বিশেষ প্রতিনিধি, সামি টিভি</span>
                  </div>
                  <span className="hidden lg:inline text-[11px] font-bold text-slate-400 not-italic shrink-0">
                    সামি মাল্টিমিডিয়া আর্কাইভ
                  </span>
                </figcaption>
              </figure>

              {/* Desktop Split Reading Layout: Sticky Reader Rail + Editorial Body */}
              <div className="flex gap-8 items-start">
                {/* PC Sticky Left Utility Rail */}
                <div className="hidden xl:flex flex-col items-center gap-2.5 sticky top-28 w-11 shrink-0 pt-1">
                  <button
                    onClick={() => handleReaction('love')}
                    title="পছন্দ করুন"
                    className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      userReaction === 'love'
                        ? 'bg-red-50 border-sami-red text-sami-red shadow-2xs'
                        : 'bg-slate-50/80 border-slate-200/80 text-slate-600 hover:border-sami-red hover:text-sami-red hover:bg-white'
                    }`}
                  >
                    <Heart size={15} className={userReaction === 'love' ? 'fill-sami-red text-sami-red' : ''} />
                    <span className="text-[9px] font-black mt-0.5 tabular-nums">{toBanglaNum(reactions.love)}</span>
                  </button>

                  <button
                    onClick={() => setFontSize(prev => (prev >= 24 ? 18 : prev + 2))}
                    title="ফন্ট বড়/স্বাভাবিক করুন"
                    className="w-10 h-10 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-700 hover:border-sami-red hover:text-sami-red hover:bg-white flex flex-col items-center justify-center transition-all cursor-pointer"
                  >
                    <span className="text-xs font-black leading-none">অ+</span>
                    <span className="text-[8px] font-bold text-slate-400 mt-0.5">{toBanglaNum(fontSize)}</span>
                  </button>

                  <button
                    onClick={handleSaveImage}
                    disabled={isSaving}
                    title="ডিজিটাল ক্লিপ সেভ করুন"
                    className="w-10 h-10 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-600 hover:border-sami-red hover:text-sami-red hover:bg-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Bookmark size={15} className={isLiked ? 'fill-sami-red text-sami-red' : ''} />
                  </button>

                  <button
                    onClick={handlePrint}
                    title="প্রিন্ট করুন"
                    className="w-10 h-10 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-600 hover:border-sami-red hover:text-sami-red hover:bg-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Printer size={15} />
                  </button>

                  <div className="w-6 h-px bg-slate-200 my-0.5" />

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="ফেসবুকে শেয়ার"
                    className="w-10 h-10 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] flex items-center justify-center transition-all"
                  >
                    <Facebook size={15} />
                  </a>

                  <button
                    onClick={handleCopyLink}
                    title="লিঙ্ক কপি করুন"
                    className="w-10 h-10 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-600 hover:bg-sami-red hover:text-white hover:border-sami-red flex items-center justify-center transition-all cursor-pointer"
                  >
                    {copied ? <Check size={15} /> : <Share2 size={15} />}
                  </button>
                </div>

                {/* Primary Prose Column */}
                <div className="flex-1 min-w-0">
                  {/* Quick Article Excerpt / Highlight Box */}
                  {news.content && news.content.length > 100 && (
                    <div className="mb-3.5 sm:mb-8 p-2.5 sm:p-4 lg:p-5 bg-slate-50 lg:bg-[#fafaf9] border border-slate-200/80 rounded-lg sm:rounded-xl">
                      <h3 className="text-[10.5px] sm:text-xs lg:text-[13px] font-black text-sami-red tracking-wide mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        এক নজরে সংক্ষেপ
                      </h3>
                      <p className="text-[11px] sm:text-sm lg:text-[15px] font-bold text-slate-800 leading-relaxed">
                        {news.content.slice(0, 160)}...
                      </p>
                    </div>
                  )}

                  {/* Main News Content Body */}
                  <div 
                    className="news-article-body text-slate-800 lg:text-slate-900 leading-[1.68] sm:leading-[1.95] lg:leading-[2.0] selection:bg-red-100 selection:text-sami-red font-medium lg:font-normal tracking-normal mb-5 sm:mb-10"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {paragraphs.map((paragraph: string, idx: number) => {
                      const trimmed = paragraph.trim();
                      return (
                        <React.Fragment key={idx}>
                          {idx === 0 ? (
                            <p className="mb-3.5 sm:mb-6 lg:mb-7 first-letter:text-2xl sm:first-letter:text-5xl first-letter:font-black first-letter:text-sami-red first-letter:mr-1.5 sm:first-letter:mr-2.5 first-letter:float-left first-letter:leading-none">
                              {trimmed}
                            </p>
                          ) : (
                            <p className="mb-3.5 sm:mb-6 lg:mb-7">
                              {trimmed}
                            </p>
                          )}

                          {/* PC-Only In-Article Related News Callout after 2nd paragraph */}
                          {idx === 1 && paragraphs.length > 2 && desktopRelatedPool.length > 0 && (
                            <div 
                              onClick={() => {
                                onNewsClick?.(desktopRelatedPool[0]);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="hidden lg:flex items-center justify-between gap-4 my-7 p-4 rounded-xl bg-[#f8f9fa] border border-slate-200/90 hover:border-sami-red/40 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                                  <img 
                                    src={desktopRelatedPool[0].imageUrl} 
                                    alt={desktopRelatedPool[0].title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[11px] font-black text-sami-red uppercase tracking-wider block mb-0.5">
                                    আরও পড়ুন • {desktopRelatedPool[0].category || 'প্রাসঙ্গিক সংবাদ'}
                                  </span>
                                  <h4 className="text-base font-extrabold text-slate-900 group-hover:text-sami-red transition-colors line-clamp-1">
                                    {desktopRelatedPool[0].title}
                                  </h4>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-sami-red group-hover:text-white group-hover:border-sami-red transition-colors shrink-0">
                                <ChevronRight size={16} />
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* PC-Only Newsroom Verification & Correspondent Footer Card */}
                  <div className="hidden lg:flex items-center justify-between gap-6 p-5 rounded-xl bg-[#f8f9fa] border border-slate-200/80 mb-8">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-base shrink-0">
                        STV
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">সামি টিভি ডিজিটাল নিউজরুম</h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            ভেরিফাইড রিপোর্ট
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">
                          বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদের সাথে থাকতে আমাদের অফিশিয়াল আর্কাইভ ও লাইভ সম্প্রচার দেখুন।
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/archive')}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-sami-red hover:text-sami-red text-xs font-bold text-slate-800 transition-colors shrink-0 cursor-pointer shadow-2xs"
                    >
                      সকল সংবাদ আর্কাইভ
                    </button>
                  </div>
                </div>
              </div>

              {/* Tag Badges */}
              <div className="pt-3 sm:pt-6 border-t border-slate-200 mb-4 sm:mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 mr-1 sm:mr-2 flex items-center gap-1">
                      <Tag size={12} />
                      ট্যাগস:
                    </span>
                    {['জামালপুর', news.category || 'সংবাদ', 'সামি_টিভি', 'সর্বশেষ_সংবাদ', 'বাংলাদেশ'].map((tag, i) => (
                      <span 
                        key={i} 
                        onClick={() => navigate(`/category/${encodeURIComponent(tag.replace(/_/g, ' '))}`)}
                        className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-100 hover:bg-sami-red hover:text-white transition-colors rounded-full text-[10px] sm:text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* PC Share Action Buttons inline with tags */}
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={handleSaveImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Bookmark size={13} />
                      <span>পেপার ক্লিপ ডাউনলোড</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>প্রিন্ট করুন</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reactions Bar */}
              <div className="p-3 sm:p-6 lg:p-7 bg-slate-50 lg:bg-[#f8f9fa] rounded-xl sm:rounded-2xl border border-slate-200/80 mb-5 sm:mb-10 text-center lg:flex lg:items-center lg:justify-between lg:text-left">
                <div className="mb-2 sm:mb-3 lg:mb-0">
                  <h3 className="text-xs sm:text-sm lg:text-base font-black text-slate-900">সংবাদটি আপনার কেমন লাগলো?</h3>
                  <p className="hidden lg:block text-xs text-slate-500 font-medium mt-0.5">
                    আপনার অনুভূতি প্রকাশ করুন • মোট {toBanglaNum(reactions.like + reactions.love + reactions.wow + reactions.sad)} জন পাঠক মতামত দিয়েছেন
                  </p>
                </div>
                <div className="flex justify-center flex-wrap gap-1.5 sm:gap-3">
                  {[
                    { id: 'like', label: 'ধন্যবাদ', emoji: '👍', count: reactions.like },
                    { id: 'love', label: 'চমৎকার', emoji: '❤️', count: reactions.love },
                    { id: 'wow', label: 'বিস্ময়কর', emoji: '😮', count: reactions.wow },
                    { id: 'sad', label: 'দুঃখজনক', emoji: '😢', count: reactions.sad }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleReaction(item.id)}
                      className={`flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs lg:text-[13px] font-bold transition-all border cursor-pointer ${
                        userReaction === item.id 
                          ? 'bg-sami-red text-white border-sami-red shadow-sm scale-105' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sami-red/50 hover:bg-red-50/50'
                      }`}
                    >
                      <span className="text-xs sm:text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                      <span className={`px-1 py-0.5 sm:px-1.5 rounded-full text-[9px] sm:text-[10px] font-bold tabular-nums ${
                        userReaction === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {toBanglaNum(item.count)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-200 pt-4 sm:pt-8 mb-5 sm:mb-10">
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                  <h3 className="text-sm sm:text-lg lg:text-xl font-black text-slate-900 flex items-center gap-1.5 sm:gap-2">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-sami-red" />
                    <span>পাঠকের মতামত ({toBanglaNum(commentList.length)})</span>
                  </h3>
                  <span className="text-[10.5px] sm:text-xs text-slate-500 font-semibold">মার্জিত ও প্রাসঙ্গিক মন্তব্য করুন</span>
                </div>

                {/* New Comment Form */}
                <form onSubmit={handleAddComment} className="bg-slate-50 lg:bg-[#f8f9fa] p-2.5 sm:p-5 rounded-xl border border-slate-200/90 mb-4 sm:mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <input 
                      type="text" 
                      placeholder="আপনার নাম (ঐচ্ছিক)" 
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 text-[11px] sm:text-xs lg:text-sm font-semibold focus:outline-none focus:border-sami-red transition-colors"
                    />
                  </div>
                  <textarea 
                    rows={2} 
                    placeholder="সংবাদ সম্পর্কিত আপনার সুচিন্তিত মতামত লিখুন..." 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 sm:p-3.5 text-[11px] sm:text-xs lg:text-sm font-semibold focus:outline-none focus:border-sami-red transition-colors resize-none mb-2 sm:mb-3"
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="bg-sami-red hover:bg-red-700 text-white px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-[11px] sm:text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send size={12} />
                      <span>মন্তব্য প্রকাশ করুন</span>
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-2 sm:space-y-3">
                  {commentList.map((comment) => (
                    <div key={comment.id} className="p-2.5 sm:p-4 bg-slate-50/60 lg:bg-white rounded-xl border border-slate-100 lg:border-slate-200/80 flex gap-3 items-start">
                      <div className="hidden sm:flex w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs items-center justify-center shrink-0">
                        {comment.name.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[11px] sm:text-xs lg:text-sm font-black text-slate-900">{comment.name}</h4>
                          <span className="text-[9.5px] sm:text-[10px] lg:text-xs font-semibold text-slate-400">{comment.date}</span>
                        </div>
                        <p className="text-[11px] sm:text-xs lg:text-[13.5px] font-medium text-slate-700 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related News Grid */}
              {(relatedNews.length > 0 || latestNews.length > 0) && (
                <div className="pt-4 sm:pt-8 border-t border-slate-200">
                  {/* MOBILE ONLY: 3-Column Compact Card Layout for Related News (Untouched) */}
                  <div className="sm:hidden bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="m-2 mb-0 px-3 py-1.5 bg-[#f8f9fa] border border-slate-200/80 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-4 bg-[#990000] rounded-full shrink-0" />
                        <h3 className="text-[15px] font-extrabold text-[#8b0000] leading-snug tracking-tight">
                          সম্পর্কিত খবর
                        </h3>
                      </div>
                      <button
                        onClick={() => navigate(`/category/${encodeURIComponent(news.category || 'all')}`)}
                        className="flex items-center gap-1 text-[11.5px] font-bold text-[#8b0000] active:opacity-75 cursor-pointer"
                      >
                        <span>আরও দেখুন</span>
                        <span className="flex items-center -space-x-1.5 text-[#8b0000]">
                          <ChevronRight size={13} strokeWidth={2.8} />
                          <ChevronRight size={13} strokeWidth={2.8} className="opacity-65" />
                          <ChevronRight size={13} strokeWidth={2.8} className="opacity-35" />
                        </span>
                      </button>
                    </div>

                    <div className="p-2.5 grid grid-cols-3 gap-2">
                      {(relatedNews.length >= 3 ? relatedNews : [...relatedNews, ...latestNews]).slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onNewsClick?.(item);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex flex-col h-full group cursor-pointer min-w-0"
                        >
                          <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-slate-100">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h4 className="font-extrabold text-[11px] leading-[1.3] text-slate-900 group-hover:text-sami-red transition-colors line-clamp-2 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-[9.5px] leading-[1.35] text-slate-500 line-clamp-2 mb-1.5 font-normal">
                            {item.content
                              ? item.content.replace(/<[^>]*>/g, '').slice(0, 75) + '...'
                              : 'বিস্তারিত সংবাদ পড়ুন...'}
                          </p>
                          <div className="border-t border-slate-200/80 pt-1.5 mt-auto flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-[8.5px] text-slate-500 font-medium whitespace-nowrap truncate">
                              <Calendar size={9} className="text-slate-500 shrink-0" />
                              <span className="truncate">
                                {new Date(
                                  item.createdAt?.seconds * 1000 || Date.now()
                                ).toLocaleDateString('bn-BD', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-[#990000]">
                              <span>বিস্তারিত</span>
                              <ChevronsRight size={11} className="text-red-300 stroke-[2.5]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DESKTOP & TABLET VIEW: Professional 4-Column Editorial Card Grid */}
                  <div className="hidden sm:block">
                    <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-slate-200/90">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-[#990000] rounded-full"></span>
                        <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                          সম্পর্কিত আরও সংবাদ
                        </h3>
                      </div>
                      <button
                        onClick={() => navigate(`/category/${encodeURIComponent(news.category || 'জাতীয়')}`)}
                        className="text-xs lg:text-sm font-bold text-[#8b0000] hover:text-red-700 flex items-center gap-1 group cursor-pointer"
                      >
                        <span>সবগুলো দেখুন</span>
                        <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                      {desktopRelatedPool.map(item => (
                        <div 
                          key={item.id} 
                          className="flex flex-col bg-[#f8f9fa] hover:bg-white rounded-xl border border-slate-200/80 hover:border-sami-red/40 hover:shadow-sm transition-all cursor-pointer group overflow-hidden" 
                          onClick={() => {
                            onNewsClick?.(item);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <div className="w-full aspect-[16/10] overflow-hidden bg-slate-200 relative">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              referrerPolicy="no-referrer" 
                            />
                            {item.category && (
                              <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <div className="p-3.5 flex flex-col flex-1 justify-between">
                            <div>
                              <h4 className="text-xs lg:text-[13.5px] font-extrabold text-slate-900 line-clamp-2 group-hover:text-sami-red transition-colors leading-snug mb-1.5">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                {item.content ? item.content.replace(/<[^>]*>/g, '').slice(0, 80) + '...' : 'বিস্তারিত সংবাদ পড়ুন...'}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10.5px] font-bold text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={11} className="text-sami-red" />
                                {new Date(item.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                              <span className="text-[#990000] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                                বিস্তারিত <ChevronRight size={11} />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          </main>

          {/* Right Sidebar Column */}
          <aside className="col-span-1 lg:col-span-4 xl:col-span-4 space-y-3.5 sm:space-y-6 lg:sticky lg:top-24">
            
            {/* Most Read (সর্বাধিক পঠিত) Widget */}
            {/* MOBILE ONLY: 3-Column Compact Card Layout for সর্বাধিক পঠিত (Untouched) */}
            <div className="sm:hidden bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="m-2 mb-0 px-3 py-1.5 bg-[#f8f9fa] border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-[#990000] rounded-full shrink-0" />
                  <h3 className="text-[15px] font-extrabold text-[#8b0000] leading-snug tracking-tight">
                    সর্বাধিক পঠিত
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/archive')}
                  className="flex items-center gap-1 text-[11.5px] font-bold text-[#8b0000] active:opacity-75 cursor-pointer"
                >
                  <span>আরও দেখুন</span>
                  <span className="flex items-center -space-x-1.5 text-[#8b0000]">
                    <ChevronRight size={13} strokeWidth={2.8} />
                    <ChevronRight size={13} strokeWidth={2.8} className="opacity-65" />
                    <ChevronRight size={13} strokeWidth={2.8} className="opacity-35" />
                  </span>
                </button>
              </div>

              <div className="p-2.5 grid grid-cols-3 gap-2">
                {latestNews.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onNewsClick?.(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex flex-col h-full group cursor-pointer min-w-0"
                  >
                    <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h4 className="font-extrabold text-[11px] leading-[1.3] text-slate-900 group-hover:text-sami-red transition-colors line-clamp-2 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[9.5px] leading-[1.35] text-slate-500 line-clamp-2 mb-1.5 font-normal">
                      {item.content
                        ? item.content.replace(/<[^>]*>/g, '').slice(0, 75) + '...'
                        : 'বিস্তারিত সংবাদ পড়ুন...'}
                    </p>
                    <div className="border-t border-slate-200/80 pt-1.5 mt-auto flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-[8.5px] text-slate-500 font-medium whitespace-nowrap truncate">
                        <Calendar size={9} className="text-slate-500 shrink-0" />
                        <span className="truncate">
                          {new Date(
                            item.createdAt?.seconds * 1000 || Date.now()
                          ).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-[#990000]">
                        <span>বিস্তারিত</span>
                        <ChevronsRight size={11} className="text-red-300 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP & TABLET: Tabbed Most Read & Latest News Widget */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-2 bg-[#f8f9fa] border-b border-slate-200/80 grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setActiveSidebarTab('popular')}
                  className={`py-2 px-3 rounded-xl text-xs lg:text-[13px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeSidebarTab === 'popular'
                      ? 'bg-sami-red text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Flame size={15} />
                  <span>সর্বাধিক পঠিত</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('latest')}
                  className={`py-2 px-3 rounded-xl text-xs lg:text-[13px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeSidebarTab === 'latest'
                      ? 'bg-sami-red text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Clock size={15} />
                  <span>সর্বশেষ সংবাদ</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {(activeSidebarTab === 'popular' ? latestNews.slice(0, 6) : [...latestNews].reverse().slice(0, 6)).map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="p-3.5 lg:p-4 flex gap-3.5 group cursor-pointer hover:bg-slate-50/90 transition-colors items-start"
                    onClick={() => {
                      onNewsClick?.(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-sami-red group-hover:text-white transition-colors mt-0.5 tabular-nums">
                      {toBanglaNum(idx + 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-sami-red block mb-0.5">
                        {item.category || 'সংবাদ'}
                      </span>
                      <h4 className="text-xs lg:text-[13.5px] font-extrabold text-slate-900 line-clamp-2 group-hover:text-sami-red transition-colors leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
                <button
                  onClick={() => navigate('/archive')}
                  className="text-xs font-extrabold text-[#8b0000] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>সকল সংবাদের আর্কাইভ দেখুন</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* SAMI TV Live Streaming Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white rounded-2xl p-5 lg:p-6 shadow-sm relative overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sami-red animate-pulse"></span>
                  <span className="text-[10px] lg:text-xs font-black uppercase tracking-wider text-red-400">SAMI TV LIVE</span>
                </div>
                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-slate-300">24/7 HD</span>
              </div>
              <h3 className="text-base lg:text-lg font-black mb-1.5">সামি টিভি সরাসরি সম্প্রচার</h3>
              <p className="text-xs text-slate-300 mb-4 font-medium leading-relaxed">
                জামালপুরসহ সারাদেশের খবরের বিশ্বস্ত মাধ্যম। সরাসরি দেখুন আমাদের অফিশিয়াল স্ট্রিমিং পোর্টালে।
              </p>
              <button 
                onClick={() => navigate('/live')} 
                className="w-full bg-sami-red hover:bg-red-700 text-white text-xs lg:text-sm font-bold py-2.5 lg:py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>সরাসরি লাইভ দেখুন</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Opinion Poll (জনমত জরিপ) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-sami-red rounded-full"></span>
                  <h3 className="text-sm lg:text-base font-black text-slate-900">অনলাইন জনমত জরিপ</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">আজকের প্রশ্ন</span>
              </div>

              <p className="text-xs lg:text-[13.5px] font-bold text-slate-700 mb-4 leading-relaxed">
                আপনার কি মনে হয় জামালপুরে শিল্প পার্ক স্থাপনের ফলে স্থানীয় বেকারত্ব উল্লেখযোগ্য হারে হ্রাস পাবে?
              </p>

              {!hasVotedPoll ? (
                <div className="space-y-2 mb-4">
                  {['হ্যাঁ', 'না', 'মন্তব্য নেই'].map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPollOption(i)}
                      className={`w-full text-left p-2.5 lg:p-3 rounded-xl border text-xs lg:text-[13px] font-bold transition-all flex items-center justify-between cursor-pointer ${
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
                    className="w-full mt-2 bg-slate-900 hover:bg-sami-red disabled:opacity-50 text-white text-xs lg:text-sm font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    ভোট প্রদান করুন
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
                      <div className="flex justify-between text-xs font-bold text-slate-700 tabular-nums">
                        <span>{res.option}</span>
                        <span>{toBanglaNum(res.percent)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sami-red rounded-full transition-all duration-1000" 
                          style={{ width: `${res.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-emerald-600 font-bold text-center mt-2 flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} /> আপনার মতামত সফলভাবে গৃহীত হয়েছে
                  </p>
                </div>
              )}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 lg:p-6 shadow-xs border border-slate-800">
              <h3 className="font-black text-sm lg:text-base mb-1">ইমেইলে প্রতিদিনের শীর্ষ সংবাদ</h3>
              <p className="text-slate-400 text-xs mb-4 font-medium leading-relaxed">
                প্রতিদিনের প্রধান সংবাদ ও বিশেষ প্রতিবেদন সরাসরি ইনবক্সে পেতে সাবস্ক্রাইব করুন।
              </p>
              
              {newsletterSubscribed ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                  <input 
                    type="email" 
                    placeholder="আপনার ইমেইল ঠিকানা লিখুন" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs lg:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sami-red transition-colors"
                    required
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-sami-red hover:bg-red-700 text-white text-xs lg:text-sm font-bold py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    সাবস্ক্রাইব করুন
                  </button>
                </form>
              )}
            </div>

            {/* Social Share Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-center">
              <h3 className="font-black text-xs text-slate-700 mb-3 uppercase tracking-wider">সংবাদটি শেয়ার করুন</h3>
              <div className="flex justify-center gap-2.5">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white"
                  title="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center transition-all hover:bg-sky-500 hover:text-white"
                  title="Twitter / X"
                >
                  <Twitter size={16} />
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center transition-all hover:bg-emerald-600 hover:text-white"
                  title="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
                <button 
                  onClick={handleCopyLink}
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center transition-all hover:bg-sami-red hover:text-white cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                </button>
              </div>
            </div>

          </aside>
        </div>

        {/* PC-ONLY Bottom Full-Width Strip: প্রচ্ছদের অন্যান্য শীর্ষ সংবাদ */}
        {latestNews.length > 0 && (
          <section className="hidden lg:block mt-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-6 bg-[#990000] rounded-full shrink-0" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  প্রচ্ছদের অন্যান্য শীর্ষ সংবাদ
                </h2>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-sm font-bold text-[#8b0000] hover:text-red-700 transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <span>প্রচ্ছদে ফিরে যান</span>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-6 divide-x divide-slate-200/90">
              {latestNews.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onNewsClick?.(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer flex flex-col min-w-0 px-3.5 first:pl-0 last:pr-0"
                >
                  <div className="w-full aspect-[16/10] overflow-hidden rounded-lg bg-slate-100 border border-slate-100 mb-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10.5px] font-bold text-sami-red mb-1">
                    {item.category || 'জাতীয়'}
                  </span>
                  <h3 className="font-extrabold text-[13px] leading-[1.38] text-slate-900 group-hover:text-sami-red transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}
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
