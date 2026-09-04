import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Radio, Loader2, AlertCircle, Maximize, RefreshCw, Volume2, VolumeX, Minimize, Play, Pause, Settings, Info, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveTVPlayerProps {
  isTheaterMode?: boolean;
  onToggleTheater?: (val: boolean) => void;
}

export const LiveTVPlayer: React.FC<LiveTVPlayerProps> = ({ isTheaterMode, onToggleTheater }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const playerRef = useRef<any>(null);

  const liveUrl = "https://zibo1.tvhunter.top/SAMI_TV/index.m3u8";
  const Player = ReactPlayer as any;

  // Clean up safely when unmounting so play() promise is never interrupted
  useEffect(() => {
    return () => {
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

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (playing && !loading && !error) {
      timeout = setTimeout(() => setShowControls(false), 3000);
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
              <div className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-[4px] text-[9px] sm:text-[10px] font-black uppercase flex items-center gap-1.5 sm:gap-2 shadow-xl shadow-red-600/30 ring-1 ring-white/20 shrink-0">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span className="hidden xs:inline">মباشর</span> (LIVE)
              </div>
              <div className="hidden sm:block h-5 w-[1px] bg-white/20"></div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wider drop-shadow-md truncate">SAMI TV <span className="hidden xs:inline">ULTRA HD</span></h4>
                  <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm tracking-tighter shadow-lg shadow-yellow-500/20 shrink-0">4K</span>
                </div>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest hidden sm:block">Official 4K Broadcast Stream</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <button 
                onClick={() => { setError(false); setLoading(true); }}
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
                  <p className="text-white/60 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-1">Connecting</p>
               </div>
            ) : (
              <button 
                onClick={() => { setPlaying(true); setLoading(true); }}
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

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 p-8 text-center bg-gradient-to-br from-gray-900 to-black"
          >
            <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mb-6 ring-4 ring-red-600/5 rotate-12">
              <AlertCircle size={40} className="text-red-600 -rotate-12" />
            </div>
            <h3 className="text-white font-black text-2xl mb-3 tracking-tight">সার্ভার বিভ্রাট (Server Connection Error)</h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed font-medium mb-10 opacity-80">
              আমাদের স্ট্রিমিং সার্ভারের সাথে আপনার সংযোগটি সাময়িকভাবে বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আপনার সংযোগ পরীক্ষা করে পুনরায় ক্লিক করুন।
            </p>
            <button 
              onClick={() => { setError(false); setLoading(true); setPlaying(true); }}
              className="bg-white text-sami-dark px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-sami-red hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3 active:bg-sami-red/90"
            >
              <RefreshCw size={16} /> পুনরায় চেষ্টা করুন
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Player Layer */}
      <div className={`w-full h-full relative z-10 ${loading || error ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        {Player && (
          <Player
            ref={playerRef}
            url={liveUrl}
            playing={playing}
            controls={false}
            muted={muted}
            width="100%"
            height="100%"
            onReady={() => setLoading(false)}
            onStart={() => { setLoading(false); setPlaying(true); }}
            onError={(err: any) => {
              console.warn('Live TV player playback notice:', err);
              setError(true);
              setLoading(false);
              setPlaying(false);
            }}
            config={{
              file: {
                forceHLS: true,
                hlsOptions: {
                  enableWorker: true,
                  lowLatencyMode: true,
                  backBufferLength: 90,
                },
                attributes: {
                  controlsList: 'nodownload',
                  referrerPolicy: 'no-referrer',
                  crossOrigin: 'anonymous',
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
            className="absolute bottom-0 left-0 right-0 z-40 p-5 md:p-8 bg-gradient-to-t from-black via-black/60 to-transparent"
          >
            {/* Live Progress Bar (Full Width) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 group/progress cursor-pointer">
              <div className="h-full bg-sami-red w-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full blur-[2px] opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setPlaying(!playing)}
                  className="text-white hover:text-sami-red transition-all transform active:scale-90"
                >
                  {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                
                <div className="flex items-center gap-3 group/vol">
                  <button 
                    onClick={() => setMuted(!muted)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <div className="w-20 md:w-24 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
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

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[10px] font-black uppercase tracking-tight bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                  >
                    <Settings size={14} className={showQualityMenu ? "rotate-90" : ""} /> {quality}
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
    </div>
  );
};
