import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Radio, Loader2, AlertCircle, Maximize, RefreshCw, Volume2, VolumeX, Minimize, Play, Pause, Settings, Info, Layout, Link2, Check, ExternalLink, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveTVPlayerProps {
  isTheaterMode?: boolean;
  onToggleTheater?: (val: boolean) => void;
}

const DEFAULT_STREAM_URL = "https://zibo1.tvhunter.top/SAMI_TV/index.m3u8";
const SAMPLE_TEST_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export const LiveTVPlayer: React.FC<LiveTVPlayerProps> = ({ isTheaterMode, onToggleTheater }) => {
  const [streamUrl, setStreamUrl] = useState<string>(() => {
    return localStorage.getItem('sami_custom_stream_url') || DEFAULT_STREAM_URL;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [inputUrl, setInputUrl] = useState(streamUrl);
  const playerRef = useRef<any>(null);
  const connectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const Player = ReactPlayer as any;

  // Clean up safely when unmounting so play() promise is never interrupted
  useEffect(() => {
    return () => {
      if (connectTimeoutRef.current) {
        clearTimeout(connectTimeoutRef.current);
      }
      try {
        if (playerRef.current) {
          const internal = playerRef.current.getInternalPlayer();
          if (internal && typeof internal.pause === 'function') {
            internal.pause();
          }
        }
      } catch {
        // Safe cleanup
      }
    };
  }, []);

  // Connection timeout watchdog
  useEffect(() => {
    if (playing && loading) {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = setTimeout(() => {
        if (loading) {
          setError(true);
          setLoading(false);
          setPlaying(false);
          setErrorMessage('স্ট্রিমিং সার্ভার (tvhunter.top) থেকে ক্লাউডফ্লেয়ার (Cloudflare 403 Forbidden) বাধা পাওয়া গেছে। সার্ভারের সিকিউরিটি রুলসের কারণে সরাসরি ব্রাউজারে স্ট্রিমটি প্লে হচ্ছে না।');
        }
      }, 9000);
    } else {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    }
    return () => {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
  }, [playing, loading]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (playing && !loading && !error) {
      timeout = setTimeout(() => setShowControls(false), 3500);
    }
    return () => clearTimeout(timeout);
  }, [playing, loading, error, showControls]);

  const toggleFullscreen = () => {
    const el = document.getElementById('sami-player-root');
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen();
      }
    }
  };

  const handleStartPlay = () => {
    setError(false);
    setLoading(true);
    setPlaying(true);
  };

  const handleSaveCustomUrl = (newUrl: string) => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    setStreamUrl(trimmed);
    localStorage.setItem('sami_custom_stream_url', trimmed);
    setShowUrlModal(false);
    setError(false);
    setLoading(true);
    setPlaying(true);
  };

  const handleLoadTestStream = () => {
    setStreamUrl(SAMPLE_TEST_STREAM);
    setInputUrl(SAMPLE_TEST_STREAM);
    localStorage.setItem('sami_custom_stream_url', SAMPLE_TEST_STREAM);
    setError(false);
    setLoading(true);
    setPlaying(true);
    setShowUrlModal(false);
  };

  const handleResetToDefault = () => {
    setStreamUrl(DEFAULT_STREAM_URL);
    setInputUrl(DEFAULT_STREAM_URL);
    localStorage.removeItem('sami_custom_stream_url');
    setError(false);
    setLoading(true);
    setPlaying(true);
    setShowUrlModal(false);
  };

  return (
    <div 
      id="sami-player-root"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
      className={`bg-black overflow-hidden relative transition-all duration-500 shadow-2xl border border-white/5 group ring-1 ring-white/10 ${isTheaterMode ? 'rounded-none' : 'rounded-sm aspect-video'}`}
      style={isTheaterMode ? { height: '80vh' } : {}}
    >
      {/* Background Poster / Brand Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0c0c0c] to-[#010101]">
        <img 
          src="https://images.unsplash.com/photo-1541873676947-d79045842c9f?auto=format&fit=crop&q=80&w=2070" 
          alt="" 
          className="w-full h-full object-cover opacity-10 pointer-events-none grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
      </div>

      {/* Top Bar Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-30 p-2.5 sm:p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent"
          >
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-[4px] text-[8.5px] sm:text-[10px] font-black uppercase flex items-center gap-1.5 sm:gap-2 shadow-xl shadow-red-600/30 ring-1 ring-white/20 shrink-0">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span>সরাসরি • LIVE</span>
              </div>
              <div className="hidden sm:block h-5 w-[1px] bg-white/20"></div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h4 className="text-white font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-wider drop-shadow-md truncate font-brand">SAMI TV <span className="hidden xs:inline">ULTRA HD</span></h4>
                  <span className="bg-yellow-500 text-black text-[7.5px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-sm tracking-tighter shadow-lg shadow-yellow-500/20 shrink-0">4K</span>
                </div>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest hidden sm:block">Official 4K Broadcast Stream</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button 
                onClick={() => { setShowUrlModal(true); setInputUrl(streamUrl); }}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/90 hover:text-white rounded-full transition-all backdrop-blur-md border border-white/10"
                title="স্ট্রিম লিংক কনফিগারেশন / পরিবর্তন"
              >
                <Link2 size={13} />
              </button>
              <button 
                onClick={() => { setError(false); setLoading(true); setPlaying(true); }}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md border border-white/10"
                title="Refresh"
              >
                <RefreshCw size={13} className={loading && playing ? "animate-spin" : ""} />
              </button>
              {onToggleTheater && (
                <button 
                  onClick={() => onToggleTheater(!isTheaterMode)}
                  className="w-7 h-7 sm:w-8 sm:h-8 hidden md:flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md border border-white/10"
                  title="Theater Mode"
                >
                  {isTheaterMode ? <Minimize size={14} /> : <Layout size={14} />}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center UI (Play/Loading) */}
      <AnimatePresence>
        {(!playing || loading) && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          >
            {loading && playing ? (
               <div className="flex flex-col items-center">
                  <div className="relative">
                    <Loader2 size={38} className="text-white animate-spin mb-3 opacity-80 sm:w-12 sm:h-12" />
                    <div className="absolute inset-0 blur-2xl bg-white/10 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1">Connecting to Stream...</p>
                  <p className="text-white/40 text-[9px] mt-1 font-mono max-w-xs truncate">{streamUrl}</p>
               </div>
            ) : (
              <button 
                onClick={handleStartPlay}
                className="w-14 h-14 sm:w-20 sm:h-20 bg-white/10 hover:bg-sami-red text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 group/play shadow-[0_0_50px_rgba(227,30,36,0.2)]"
              >
                <div className="w-0 h-0 border-t-[8px] sm:border-t-[12px] border-t-transparent border-l-[14px] sm:border-l-[22px] border-l-white border-b-[8px] sm:border-b-[12px] border-b-transparent ml-1 sm:ml-2 drop-shadow-xl group-hover/play:scale-110 transition-transform"></div>
              </button>
            )}
            
            {!loading && (
              <div className="absolute bottom-6 sm:bottom-16 text-center">
                <p className="text-white/40 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] animate-pulse">Official Live Broadcast</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State with Technical Diagnostics */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/95 p-2.5 sm:p-6 text-center backdrop-blur-md overflow-y-auto"
          >
            <div className="w-8 h-8 sm:w-16 sm:h-16 bg-red-600/10 border border-red-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1.5 sm:mb-4 ring-2 sm:ring-4 ring-red-600/5 shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-8 sm:h-8 text-red-500" />
            </div>

            <h3 className="text-white font-bold text-xs sm:text-xl mb-1 sm:mb-1.5 tracking-tight">
              স্ট্রিমিং সংযোগ বিভ্রাট (Cloudflare 403)
            </h3>
            
            <p className="text-gray-300 text-[10px] sm:text-sm max-w-md leading-snug sm:leading-relaxed font-normal mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
              {errorMessage || 'সার্ভার (tvhunter.top) থেকে সরাসরি ব্রাউজার সংযোগ ব্লক করা হচ্ছে (Cloudflare 403)।'}
            </p>

            {/* Diagnostics Card (Desktop/Tablet) */}
            <div className="hidden sm:block bg-black/60 border border-white/10 rounded-lg p-2.5 mb-5 max-w-md w-full text-left font-mono text-[11px] text-gray-400">
              <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1.5 text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">
                <span>সার্ভার ডায়াগনস্টিক রিপোর্ট</span>
                <span className="text-red-400 font-mono">STATUS: 403 FORBIDDEN</span>
              </div>
              <div className="truncate text-gray-300 mb-1">
                <span className="text-gray-400">URL:</span> {streamUrl}
              </div>
              <div className="text-[10px] text-yellow-500/90 leading-normal">
                কারণ: tvhunter.top সাইটে ক্লাউডফ্লেয়ারের সিকিউরিটি WAF সক্রিয় রয়েছে, যার কারণে ব্রাউজার বা প্লেয়ার সরাসরি m3u8 ফাইল পড়তে পারছে না।
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
              <button 
                onClick={handleStartPlay}
                className="bg-white text-sami-dark px-2.5 py-1 sm:px-4 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-[10px] sm:text-xs hover:bg-sami-red hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-1 sm:gap-2"
              >
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> পুনরায় চেষ্টা করুন
              </button>
              <button 
                onClick={() => { setShowUrlModal(true); setInputUrl(streamUrl); }}
                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 sm:px-4 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-[10px] sm:text-xs transition-all border border-white/15 flex items-center gap-1 sm:gap-2"
              >
                <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> লিঙ্ক পরিবর্তন
              </button>
              <button 
                onClick={handleLoadTestStream}
                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 sm:px-4 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-[10px] sm:text-xs transition-all flex items-center gap-1 sm:gap-2"
                title="প্লেয়ার ও অডিও-ভিডিও কাজ করছে কিনা পরীক্ষা করুন"
              >
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> টেস্ট স্ট্রিম চালান
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Player Layer */}
      <div className={`w-full h-full relative z-10 transition-opacity duration-700 ${loading || error ? 'opacity-0' : 'opacity-100'}`}>
        {Player && (
          <Player
            ref={playerRef}
            url={streamUrl}
            playing={playing}
            controls={false}
            muted={muted}
            width="100%"
            height="100%"
            onReady={() => {
              setLoading(false);
              setError(false);
            }}
            onStart={() => {
              setLoading(false);
              setPlaying(true);
              setError(false);
            }}
            onError={(err: any) => {
              console.warn('Live TV player error notice:', err);
              setError(true);
              setLoading(false);
              setPlaying(false);
              setErrorMessage('স্ট্রিমিং প্রোভাইডার (tvhunter.top) এর ক্লাউডফ্লেয়ার সিকিউরিটি পেজের কারণে ভিডিও লোড হতে ব্যর্থ হয়েছে (HTTP 403 Forbidden)।');
            }}
            config={{
              file: {
                hlsOptions: {
                  enableWorker: true,
                  lowLatencyMode: true,
                  backBufferLength: 60,
                },
                attributes: {
                  controlsList: 'nodownload',
                  onWaiting: () => setLoading(true),
                  onPlaying: () => setLoading(false),
                  style: { width: '100%', height: '100%', objectFit: isTheaterMode ? 'contain' : 'cover' }
                }
              }
            }}
          />
        )}
      </div>

      {/* Bottom Controls Overlay */}
      <AnimatePresence>
        {showControls && playing && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-40 p-2.5 sm:p-5 md:p-8 bg-gradient-to-t from-black via-black/60 to-transparent"
          >
            {/* Live Progress Bar (Full Width) */}
            <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-white/10 group/progress cursor-pointer">
              <div className="h-full bg-sami-red w-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full blur-[2px] opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-6">
                <button 
                  onClick={() => setPlaying(!playing)}
                  className="text-white hover:text-sami-red transition-all transform active:scale-90"
                >
                  {playing ? <Pause className="w-4.5 h-4.5 sm:w-6 sm:h-6" fill="currentColor" /> : <Play className="w-4.5 h-4.5 sm:w-6 sm:h-6" fill="currentColor" />}
                </button>
                
                <div className="flex items-center gap-2 sm:gap-3 group/vol">
                  <button 
                    onClick={() => setMuted(!muted)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {muted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  <div className="w-12 sm:w-20 md:w-24 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
                     <div className={`h-full bg-white transition-all ${muted ? 'w-0' : 'w-full'}`}></div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-600/10 rounded-lg border border-red-600/20">
                   <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                   <span className="text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2">
                     Ultra HD <span className="text-white/40">|</span> 2160p 
                     <span className="bg-white/10 px-1 rounded text-[8px]">4K</span>
                   </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors text-[9px] sm:text-[10px] font-black uppercase tracking-tight bg-white/5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10"
                  >
                    <Settings className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${showQualityMenu ? "rotate-90" : ""}`} /> {quality}
                  </button>
                  
                  <AnimatePresence>
                    {showQualityMenu && (
                        <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute bottom-full right-0 mb-3 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[140px] premium-blur"
                      >
                         <div className="px-4 py-2 border-b border-white/5 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">Quality Settings</div>
                         {['4K (UHD)', '1080p (HD)', '720p', '480p', 'Auto'].map((q) => (
                           <button 
                            key={q}
                            onClick={() => { setQuality(q); setShowQualityMenu(false); }}
                            className={`w-full text-left px-4 py-2.5 text-[10px] font-bold transition-colors ${quality === q ? 'bg-sami-red text-white' : 'text-gray-400 hover:bg-white/5'}`}
                           >
                             {q}
                           </button>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={toggleFullscreen}
                  className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stream URL Configuration Modal */}
      <AnimatePresence>
        {showUrlModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-4 sm:p-5 max-w-md w-full shadow-2xl text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <Link2 size={16} className="text-sami-red" />
                  <h4 className="font-bold text-sm">লাইভ স্ট্রিম লিঙ্ক সেটিংস</h4>
                </div>
                <button 
                  onClick={() => setShowUrlModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-zinc-400 text-xs mb-3">
                যে কোনো সক্রিয় HLS (.m3u8), MP4 বা অনলাইন লাইভ স্ট্রিম লিঙ্ক এখানে পেস্ট করে সরাসরি প্লে করতে পারবেন:
              </p>

              <div className="mb-4">
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                  স্ট্রিম URL:
                </label>
                <input 
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://.../index.m3u8"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800/80 text-[11px] text-zinc-400 mb-4 space-y-1">
                <p className="text-yellow-400/90 font-medium">⚠️ tvhunter.top লিঙ্ক সংক্রান্ত তথ্য:</p>
                <p>
                  <code>zibo1.tvhunter.top</code> ডোমেইনে ক্লাউডফ্লেয়ারের বট-প্রটেকশন সক্রিয় থাকার কারণে ব্রাউজার সরাসরি লিঙ্কটি প্লে করতে বাধাগ্রস্ত হচ্ছে (403 Forbidden)।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    type="button"
                    onClick={handleLoadTestStream}
                    className="text-[11px] text-emerald-400 hover:underline py-1"
                  >
                    টেস্ট স্ট্রিম লোড করুন
                  </button>
                  <span className="text-zinc-600">|</span>
                  <button 
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 py-1"
                  >
                    ডিফল্ট রিসেট
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowUrlModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSaveCustomUrl(inputUrl)}
                    className="bg-sami-red hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
                  >
                    সংরক্ষণ ও প্লে করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
