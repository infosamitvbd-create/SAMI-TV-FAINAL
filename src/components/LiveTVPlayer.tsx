import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { 
  Radio, Loader2, Maximize, RefreshCw, Volume2, VolumeX, 
  Minimize, Play, Pause, Settings, Layout 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveTVPlayerProps {
  isTheaterMode?: boolean;
  onToggleTheater?: (val: boolean) => void;
}

export const DEFAULT_STREAM_URL = "http://103.238.115.159:8080/samitv/index.m3u8";

export const getPlayableUrl = (url: string): string => {
  if (!url) return '';
  // Convert official HTTP port 8080 stream to secure origin-relative proxy path.
  // This completely eliminates Mixed Content (HTTP on HTTPS) and CORS errors on Netlify,
  // and bypasses restrictive ISP / corporate firewalls that block outbound port 8080.
  if (url.startsWith('http://103.238.115.159:8080/samitv/')) {
    const sub = url.replace('http://103.238.115.159:8080/samitv/', '');
    return `/api/stream/${sub || 'index.m3u8'}`;
  }
  // If running over HTTPS and URL is insecure HTTP
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    if (url.includes('/samitv/')) {
      const idx = url.indexOf('/samitv/');
      const sub = url.substring(idx + '/samitv/'.length);
      return `/api/stream/${sub || 'index.m3u8'}`;
    }
  }
  return url;
};

const getInitialStreamUrl = (): string => {
  try {
    const saved = localStorage.getItem('sami_custom_stream_url');
    if (saved) {
      if (saved.includes('tvhunter') || saved.includes('zibo1') || saved.includes('localhost') || saved.includes('103.238.115.159:8080/samitv/')) {
        localStorage.removeItem('sami_custom_stream_url');
        return DEFAULT_STREAM_URL;
      }
      return saved;
    }
  } catch {
    // localStorage might not be accessible
  }
  return DEFAULT_STREAM_URL;
};

export const LiveTVPlayer: React.FC<LiveTVPlayerProps> = ({ isTheaterMode, onToggleTheater }) => {
  const [streamUrl] = useState<string>(getInitialStreamUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reconnectTick, setReconnectTick] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('Auto');
  const [availableQualities, setAvailableQualities] = useState<string[]>(['Auto', '720p HD']);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentResolution, setCurrentResolution] = useState<string>('720p HD');
  const [isAnamorphicOr169, setIsAnamorphicOr169] = useState<boolean>(true);
  const [aspectMode, setAspectMode] = useState<'fit' | 'contain' | 'fill'>('fit');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const connectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkVideoDimensions = (video: HTMLVideoElement) => {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw && vh) {
      const ratio = vw / vh;
      // 1280x1080 is broadcast anamorphic 16:9 (DVCPRO HD / HDCAM standard raster scaled to 16:9 display).
      // Standard 16:9 square pixels is ~1.777 (1280x720, 1920x1080).
      const is169 = Math.abs(ratio - (16 / 9)) < 0.08 || (vw === 1280 && vh === 1080);
      setIsAnamorphicOr169(is169);
    }
  };

  // Connection timeout watchdog
  useEffect(() => {
    if (playing && loading) {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = setTimeout(() => {
        if (loading) {
          setError(true);
          setLoading(false);
          setPlaying(false);
        }
      }, 12000);
    } else {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    }
    return () => {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
  }, [playing, loading]);

  // Auto-reconnect when offline: periodically polls so that when broadcast resumes, live video starts automatically
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout | null = null;
    if (error && !loading) {
      reconnectTimer = setTimeout(() => {
        setError(false);
        setLoading(true);
        setPlaying(true);
        setReconnectTick(prev => prev + 1);
      }, 6000);
    }
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [error, loading]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (playing && !loading && !error) {
      timeout = setTimeout(() => setShowControls(false), 3500);
    }
    return () => clearTimeout(timeout);
  }, [playing, loading, error, showControls]);

  // Sync muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  // Main HLS.js and Video stream setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Clean up previous Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!playing) {
      try {
        video.pause();
      } catch {
        // ignore
      }
      return;
    }

    setLoading(true);
    setError(false);

    const effectiveUrl = getPlayableUrl(streamUrl);
    let networkRetryCount = 0;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        manifestLoadingTimeOut: 12000,
        manifestLoadingMaxRetry: 4,
        levelLoadingTimeOut: 12000,
        fragLoadingTimeOut: 15000,
        fragLoadingMaxRetry: 4,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        }
      });

      hlsRef.current = hls;

      hls.loadSource(effectiveUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        networkRetryCount = 0;
        setLoading(false);
        setError(false);
        if (data.levels && data.levels.length > 0) {
          const lvls = data.levels
            .map(l => (l.height ? `${l.height}p` : ''))
            .filter(Boolean);
          if (lvls.length > 0) {
            setAvailableQualities(['Auto', ...Array.from(new Set(lvls))]);
          }
        }
        video.play().catch((err) => {
          console.log('Autoplay deferred or muted required:', err);
        });
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        networkRetryCount = 0;
        setLoading(false);
        setError(false);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        if (hls.levels && hls.levels[data.level]) {
          const lvl = hls.levels[data.level];
          if (lvl.height) {
            setCurrentResolution(`${lvl.height}p`);
          }
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.warn('HLS.js player event notice:', data.type, data.details);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              networkRetryCount += 1;
              if (networkRetryCount <= 3) {
                console.log(`HLS Network error: retrying (${networkRetryCount}/3)...`);
                hls.startLoad();
              } else {
                console.warn('HLS Network error limit reached, stream offline');
                hls.destroy();
                hlsRef.current = null;
                setError(true);
                setLoading(false);
                setPlaying(false);
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('HLS Media error: recovering...');
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              hlsRef.current = null;
              setError(true);
              setLoading(false);
              setPlaying(false);
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS for Safari (iOS & macOS)
      video.src = effectiveUrl;
      const onLoadedMetadata = () => {
        setLoading(false);
        setError(false);
        checkVideoDimensions(video);
        video.play().catch(() => {});
      };
      const onCanPlay = () => {
        setLoading(false);
        setError(false);
      };
      const onVideoError = () => {
        console.warn('Native video error fired');
        setError(true);
        setLoading(false);
        setPlaying(false);
      };
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('error', onVideoError);
      return () => {
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('error', onVideoError);
      };
    } else {
      video.src = effectiveUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl, playing, reconnectTick]);

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
    setReconnectTick(prev => prev + 1);
  };

  const handleTogglePlay = () => {
    if (playing) {
      setPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      handleStartPlay();
    }
  };

  const handleSelectQuality = (selected: string) => {
    setQuality(selected);
    setShowQualityMenu(false);
    if (!hlsRef.current) return;

    if (selected === 'Auto') {
      hlsRef.current.currentLevel = -1;
    } else {
      const targetHeight = parseInt(selected, 10);
      const index = hlsRef.current.levels.findIndex(l => l.height === targetHeight);
      if (index !== -1) {
        hlsRef.current.currentLevel = index;
      }
    }
  };

  return (
    <div 
      id="sami-player-root"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
      className={`bg-black overflow-hidden relative transition-all duration-500 shadow-2xl border border-white/5 group ring-1 ring-white/10 w-full ${isTheaterMode ? 'rounded-none h-[80vh]' : 'rounded-sm aspect-video h-full'}`}
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
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest hidden sm:block">Official Broadcast Stream</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button 
                onClick={handleStartPlay}
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

      {/* Offline / Error State (No Raw URL, No Server IP, Clean Message) */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/95 p-4 sm:p-6 text-center backdrop-blur-md overflow-hidden"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ring-4 ring-red-600/5 shrink-0">
              <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
            </div>

            <h3 className="text-white font-bold text-sm sm:text-lg mb-1.5 sm:mb-2 tracking-tight">
              SAMI TV — সম্প্রচার সাময়িকভাবে বন্ধ রয়েছে
            </h3>
            
            <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed font-normal mb-4">
              অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন। সম্প্রচার পুনরায় শুরু হওয়ামাত্র স্বয়ংক্রিয়ভাবে লাইভ সম্প্রচার চালু হবে।
            </p>

            <div className="flex items-center gap-2 mb-4 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[11px] text-emerald-400 font-bold">পুনঃসংযোগের চেষ্টা চলছে...</span>
            </div>

            <button 
              onClick={handleStartPlay}
              className="bg-white text-sami-dark px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-bold text-xs hover:bg-sami-red hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> পুনরায় চেষ্টা করুন
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTML5 Video Layer with HLS.js */}
      <div className={`w-full h-full absolute inset-0 z-10 flex items-center justify-center overflow-hidden transition-opacity duration-700 ${loading || error ? 'opacity-0' : 'opacity-100'}`}>
        <video
          ref={videoRef}
          className="w-full h-full bg-black block"
          style={{
            width: '100%',
            height: '100%',
            objectFit: isTheaterMode 
              ? 'contain' 
              : aspectMode === 'contain'
              ? 'contain'
              : aspectMode === 'fill'
              ? 'fill'
              : (isAnamorphicOr169 ? 'fill' : 'contain'),
          }}
          playsInline
          muted={muted}
          onLoadedMetadata={(e) => checkVideoDimensions(e.currentTarget)}
          onWaiting={() => setLoading(true)}
          onPlaying={(e) => {
            checkVideoDimensions(e.currentTarget);
            setLoading(false);
            setPlaying(true);
            setError(false);
          }}
          onCanPlay={(e) => {
            checkVideoDimensions(e.currentTarget);
            setLoading(false);
          }}
          onError={() => {
            console.warn('Native video error fired');
          }}
        />
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
                  onClick={handleTogglePlay}
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
                  <div 
                    onClick={() => setMuted(!muted)}
                    className="w-12 sm:w-20 md:w-24 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer"
                  >
                     <div className={`h-full bg-white transition-all ${muted ? 'w-0' : 'w-full'}`}></div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-600/10 rounded-lg border border-red-600/20">
                   <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                   <span className="text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2">
                     HD Live <span className="text-white/40">|</span> {currentResolution} 
                     <span className="bg-white/10 px-1 rounded text-[8px]">HLS</span>
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
                         <div className="px-4 py-2 border-b border-white/5 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">Aspect Ratio</div>
                         <div className="p-1.5 grid grid-cols-2 gap-1 border-b border-white/5">
                           <button 
                            onClick={() => { setAspectMode('fit'); setShowQualityMenu(false); }}
                            className={`px-2 py-1.5 rounded-lg text-[9.5px] font-bold transition-colors text-center ${aspectMode === 'fit' ? 'bg-sami-red text-white' : 'text-gray-400 hover:bg-white/5'}`}
                           >
                             16:9 Fit
                           </button>
                           <button 
                            onClick={() => { setAspectMode('contain'); setShowQualityMenu(false); }}
                            className={`px-2 py-1.5 rounded-lg text-[9.5px] font-bold transition-colors text-center ${aspectMode === 'contain' ? 'bg-sami-red text-white' : 'text-gray-400 hover:bg-white/5'}`}
                           >
                             Original
                           </button>
                         </div>
                         <div className="px-4 py-2 border-b border-white/5 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">Quality Settings</div>
                         {availableQualities.map((q) => (
                           <button 
                            key={q}
                            onClick={() => handleSelectQuality(q)}
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
