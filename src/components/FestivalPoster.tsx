import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  User, 
  Sparkles, 
  Moon, 
  Compass, 
  Maximize2, 
  Move,
  RefreshCw,
  Award,
  Check,
  Type
} from 'lucide-react';

interface FestivalPosterProps {
  onNavigate: (page: string) => void;
}

const GREETINGS = [
  'পবিত্র ঈদ-উল-আযহা উপলক্ষে সবাইকে জানাই আন্তরিক শুভেচ্ছা ও ঈদ মোবারক।',
  'আপনাকে ও আপনার পরিবারের সকলকে পবিত্র ঈদ-উল-আযহার শুভেচ্ছা ও অভিনন্দন। ঈদ মোবারক!',
  'ত্যাগের মহিমায় ভাস্বর পবিত্র ঈদ-উল-আযহা বয়ে আনুক সুখ, শান্তি ও অনাবিল আনন্দ।',
  'মহান আল্লাহর দরবারে আপনার কোরবানি ও সকল ইবাদত কবুল হোক। পবিত্র ঈদ মোবারক।'
];

// Sami TV logo official URL (local file to avoid CORS export issues with canvas)
const SAMI_TV_LOGO_URL = "/sami_logo.png";

export const FestivalPoster: React.FC<FestivalPosterProps> = ({ onNavigate }) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [userName, setUserName] = useState('আপনার নাম এখানে');
  const [designation, setDesignation] = useState('শুভেচ্ছান্তে');
  const [greetingText, setGreetingText] = useState(GREETINGS[0]);
  
  // Image states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [frameShape, setFrameShape] = useState<'circle' | 'square' | 'rounded' | 'borderless'>('borderless');
  const [frameBorderColor, setFrameBorderColor] = useState<string>('none');
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
  const [themeStyle, setThemeStyle] = useState<'sky-blue' | 'crimson'>('sky-blue');
  const [showSamiLogo, setShowSamiLogo] = useState<boolean>(true);
  
  // Custom font customization
  const [nameFontSize, setNameFontSize] = useState<number>(34);
  const [nameColor, setNameColor] = useState<string>('#ffd700');

  // System States
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [containerWidth, setContainerWidth] = useState(400);

  // Resize listener to scale the 800px fixed canvas into the responsive preview panel
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  const calculateScale = () => {
    if (previewWrapperRef.current) {
      const width = previewWrapperRef.current.clientWidth;
      setContainerWidth(width);
    }
  };

  useEffect(() => {
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবিটি অনেক বড়! ৫ এমবি মাপে বা ছোট যেকোনো ছবি আপলোড করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        // Reset transform values on upload
        setScale(1);
        setOffsetX(0);
        setOffsetY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবিটি অনেক বড়! ৫ এমবি মাপে বা ছোট যেকোনো ছবি আপলোড করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setScale(1);
        setOffsetX(0);
        setOffsetY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetPoster = () => {
    setUserName('আপনার নাম এখানে');
    setDesignation('শুভেচ্ছান্তে');
    setGreetingText(GREETINGS[0]);
    setImageSrc(null);
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    setFrameShape('circle');
    setFrameBorderColor('gold');
    setImageFit('cover');
    setNameFontSize(34);
    setNameColor('#ffd700');
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);
    setExportError('');
    setExportSuccess(false);

    try {
      // Small timeout for DOM repaint
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(posterRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Retains premium printing resolution
        width: 800,
        height: 1000,
        cacheBust: true,
      });

      const fileName = `SamiTV_Eid_Poster_${Date.now()}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      setExportSuccess(true);
    } catch (err: any) {
      console.error('Export Error:', err);
      setExportError('পোস্টারটি তৈরি করতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা ছবি পরিবর্তন করুন।');
    } finally {
      setIsExporting(false);
    }
  };

  // Safe display scaling calculation
  const calculatedDisplayScale = containerWidth / 800;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-gray-50/50 p-4 sm:p-6 lg:p-8 rounded-sm news-card-shadow border border-gray-100"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200/80 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('/')}
            className="p-2 border border-blue-100 bg-white hover:bg-red-50 hover:text-red-500 rounded-lg text-sami-blue transition-all cursor-pointer"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={16} className="text-red-650 animate-spin" />
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">ঈদ উৎসব পোস্টার মেকার</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-sami-blue">পছন্দসই ঈদ পোস্টার ডিজাইন করুন</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={resetPoster}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-500 transition-all cursor-pointer"
          >
            <RefreshCw size={12} /> সবগুলো মুছুন
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
        {/* LEFT COLUMN: Controls Panel (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          
          {/* Step 1: Theme & Logo customizer */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs sm:text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 text-xs flex items-center justify-center font-bold">১</span>
              থিম ও ব্র্যান্ড লোগো সেটিংস
            </h3>
            
            {/* Theme Selector */}
            <div className="flex flex-col gap-2 bg-gray-50/75 p-3 rounded-xl border border-gray-100">
              <label className="text-[11px] font-black uppercase text-gray-500 flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-600 animate-pulse" /> কোলাজ থিম নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setThemeStyle('sky-blue');
                    setNameColor('#ffff00'); // Gold looks stunning on blue
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${themeStyle === 'sky-blue' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${themeStyle === 'sky-blue' ? 'bg-white' : 'bg-sky-450 bg-sky-400'}`} />
                  আকাশী নীল উৎসব
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThemeStyle('crimson');
                    setNameColor('#ffd700'); // Shiny gold for crimson
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${themeStyle === 'crimson' ? 'bg-rose-750 bg-red-650 border-red-650 text-white shadow-md' : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${themeStyle === 'crimson' ? 'bg-white' : 'bg-rose-500 animate-pulse'}`} />
                  রাজকীয় লাল-কালো
                </button>
              </div>
            </div>

            {/* Logo Settings */}
            <div className="flex items-center justify-between bg-gray-50/75 p-3 rounded-xl border border-gray-100">
              <span className="text-[11px] font-black uppercase text-gray-500 flex items-center gap-1.5">
                <Award size={12} className="text-amber-500 animate-bounce" /> সামি টেলিভিশন অফিশিয়াল লোগো:
              </span>
              <button
                type="button"
                onClick={() => setShowSamiLogo(!showSamiLogo)}
                className={`text-[10px] font-black px-3 py-1 rounded-lg border cursor-pointer transition-all ${showSamiLogo ? 'bg-amber-100 border-amber-300 text-amber-800 font-extrabold' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {showSamiLogo ? '✓ প্রদর্শিত' : '✗ লুকানো'}
              </button>
            </div>
          </div>

          {/* Step 2: Upload Image */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs sm:text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-red-50 text-red-600 text-xs flex items-center justify-center font-bold">২</span>
              আপনার ছবি যুক্ত করুন
            </h3>
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileUpload}
              className="border-2 border-dashed border-gray-200 hover:border-red-500/50 rounded-2xl p-6 bg-gray-50/50 hover:bg-red-50/10 cursor-pointer text-center transition-all group flex flex-col items-center justify-center relative min-h-[140px]"
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {imageSrc ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 shadow-md">
                    <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    ✓ ছবি যুক্ত হয়েছে
                  </span>
                  <span className="text-[10px] text-gray-400">পরিবর্তন করতে পুনরায় ক্লিক বা ড্রপ করুন</span>
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 group-hover:text-red-600 transition-colors mb-2 animate-bounce" />
                  <span className="text-xs font-bold text-gray-700">জিপিজি / পিএনজি ছবি ক্লিক করে আপলোড করুন</span>
                  <span className="text-[10px] text-gray-400 mt-1">সর্বোচ্চ ফাইলের সাইজ: ৫ মেগাবাইট</span>
                </>
              )}
            </div>

            {/* If image is uploaded: Display scale & positioning controls */}
            {imageSrc && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-indigo-50/20 p-4 rounded-xl border border-indigo-100 mt-2 flex flex-col gap-3.5"
                id="positioning-controls-container"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-indigo-700 flex items-center gap-1">
                    <Maximize2 size={12} /> ছবির পজিশনিং ও সাইজ
                  </span>
                  <button 
                    onClick={() => { setScale(1); setOffsetX(0); setOffsetY(0); }}
                    className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    রিসেট পজিশন
                  </button>
                </div>

                {/* Scale Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1"><Maximize2 size={12} className="text-gray-400" /> আকার পরিবর্তন (Scale):</span>
                    <span className="text-indigo-600 font-sans">{Math.round(scale * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0.3"
                    max="3.0"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                  />
                </div>

                {/* Offset X Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1"><Move size={12} className="text-gray-400" /> ডানে-বামে সরান (Offset X):</span>
                    <span className="text-indigo-600 font-sans">{offsetX}px</span>
                  </div>
                  <input 
                    type="range"
                    min="-250"
                    max="250"
                    step="1"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                  />
                </div>

                {/* Offset Y Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1"><Move size={12} className="text-gray-400" /> ওপরে-নিচে সরান (Offset Y):</span>
                    <span className="text-indigo-600 font-sans">{offsetY}px</span>
                  </div>
                  <input 
                    type="range"
                    min="-250"
                    max="250"
                    step="1"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                  />
                </div>

                {/* Frame Style Settings */}
                <div className="grid grid-cols-2 gap-3 mt-1 pt-2 border-t border-indigo-100">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500">ফ্রেমের স্টাইল:</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white text-xs">
                      <button 
                        type="button"
                        onClick={() => setFrameShape('circle')}
                        className={`flex-1 py-1.5 font-bold transition-all ${frameShape === 'circle' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        বৃত্তাকার
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFrameShape('rounded')}
                        className={`flex-1 py-1.5 font-bold transition-all ${frameShape === 'rounded' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        গোলকোণা
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500">বর্ডার কালার:</label>
                    <select 
                      value={frameBorderColor}
                      onChange={(e) => setFrameBorderColor(e.target.value)}
                      className="border border-gray-200 rounded-lg py-1.5 px-2 bg-white text-xs text-gray-700 outline-none"
                    >
                      <option value="none">বর্ডার ছাড়া (None)</option>
                      <option value="gold">স্বর্ণালী (Golden)</option>
                      <option value="white">সাদা (White)</option>
                      <option value="red">লাল (Red Intense)</option>
                    </select>
                  </div>
                </div>

                {/* Fit Mode Controls */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-indigo-100">
                  <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                    <Maximize2 size={11} className="text-gray-400" /> ছবি প্রদর্শন স্টাইল (Fit Mode):
                  </label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white text-xs">
                    <button 
                      type="button"
                      onClick={() => setImageFit('cover')}
                      className={`flex-1 py-1.5 font-bold transition-all ${imageFit === 'cover' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      ভরাট করুন (Fill Frame)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageFit('contain')}
                      className={`flex-1 py-1.5 font-bold transition-all ${imageFit === 'contain' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      সম্পূর্ণ ছবি (Show Full Pic)
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    * ‘ভরাট করুন’ দিলে ছবিটি পুরো ফ্রেমজুড়ে থাকবে। ‘সম্পূর্ণ ছবি’ দিলে ছবি কাটার প্রয়োজন ছাড়া পুরো ছবিটি ফ্রেমের ভেতর চমৎকার করে ফিট হয়ে থাকবে।
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Step 3: Input Name & Greetings */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs sm:text-sm font-black text-gray-950 flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-amber-50 text-amber-600 text-xs flex items-center justify-center font-bold">৩</span>
              আপনার শুভকামনা ও নাম লিখুন
            </h3>

            {/* Input Name field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name-input" className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <User size={13} /> আপনার নাম:
              </label>
              <input 
                id="name-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={40}
                placeholder="যেমন: মোঃ এমরান হাসান সামি"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 font-bold focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Subtitle / Designation field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="designation-input" className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Award size={13} /> পদবি / শুভেচ্ছা বাণী:
              </label>
              <input 
                id="designation-input"
                type="text"
                value={designation === 'শুভেচ্ছান্তে' ? '' : designation}
                onChange={(e) => setDesignation(e.target.value || 'শুভেচ্ছান্তে')}
                maxLength={50}
                placeholder="যেমন: প্রতিষ্ঠাতা পরিচালক, সামি টেলিভিশন"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 font-bold focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Selecting Custom Colors & Font Size for typography */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">নামের ফন্ট সাইজ:</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range"
                    min="18"
                    max="48"
                    value={nameFontSize}
                    onChange={(e) => setNameFontSize(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1"
                  />
                  <span className="text-[11px] font-sans font-bold text-gray-600">{nameFontSize}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">নামের রঙ:</label>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="color"
                    value={nameColor}
                    onChange={(e) => setNameColor(e.target.value)}
                    className="w-8 h-5 border border-gray-300 cursor-pointer rounded overflow-hidden p-0"
                    title="নামের রঙ পরিবর্তন করুন"
                  />
                  <span className="text-[10px] font-mono text-gray-555 text-gray-500">{nameColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Selected greeting presets */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-xs font-bold text-gray-550 flex items-center gap-1">
                <Type size={13} /> শুভেচ্ছা বার্তা নির্বাচন করুন:
              </label>
              <div className="flex flex-col gap-2">
                {GREETINGS.map((greet, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGreetingText(greet)}
                    className={`text-left text-xs p-2.5 rounded-xl border transition-all duration-200 flex items-start gap-2.5 ${greetingText === greet ? 'bg-indigo-50/50 border-indigo-400 text-indigo-805 text-indigo-800 font-extrabold shadow-sm' : 'bg-white border-gray-100 text-gray-655 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className={`w-3.5 h-3.5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${greetingText === greet ? 'border-indigo-650 border-indigo-600 text-indigo-650 bg-white' : 'border-gray-300 text-transparent'}`}>
                      <Check size={8} className="stroke-[4]" />
                    </span>
                    <span className="line-clamp-2">{greet}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Manual Greeting text box */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label htmlFor="custom-greeting-text-area" className="text-xs font-bold text-gray-550 flex items-center gap-1">
                <Type size={13} /> নিজের মতো কাস্টম শুভেচ্ছা বার্তা লিখুন:
              </label>
              <textarea 
                id="custom-greeting-text-area"
                rows={2}
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                placeholder="এখানে আপনার নিজের উৎসব এবং শুভেচ্ছা বার্তা লিখুন..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs text-slate-800 font-bold focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Trigger Export Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <button 
              onClick={downloadPoster}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-red-650 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download size={18} className={isExporting ? "animate-spin" : ""} />
              {isExporting ? 'পোস্টার তৈরি হচ্ছে...' : 'পোস্টার ডাউনলোড করুন'}
            </button>
            <p className="text-[9.5px] text-gray-450 text-center leading-normal">
              ডাউনলোড বাটনে ক্লিক করলে সামি টেলিভিশনের অফিশিয়াল লোগো এবং আপনার ছবি ও নামের সমন্বয়ে তৈরি আকর্ষণীয় এইচডি উৎসব কার্ডটি ডাউনলোড হয়ে আপনার গ্যালারিতে সংরক্ষিত হবে।
            </p>

            {exportError && (
              <p className="text-xs font-bold text-red-650 bg-red-50 p-2.5 rounded-lg border border-red-100 text-center animate-shake">
                {exportError}
              </p>
            )}

            {exportSuccess && (
              <p className="text-xs font-bold text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100 text-center animate-bounce">
                ✓ আপনার পোস্টারটি সফলভাবে আপনার ডিভাইসে ডাউনলোড হয়েছে!
              </p>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Realistic Live Preview Canvas (span 7) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start gap-4 font-sans">
          <div className="text-center w-full bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
            <span className="text-xs font-extrabold text-gray-700 inline-flex items-center gap-1.5 font-sans">
              <Compass size={13} className="text-red-600 animate-spin" />
              লাইভ রিভিউ বোর্ড (Live Preview Canvas)
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">পোস্টারটি তৈরি সম্পন্ন হলে দেখতে কেমন হবে তা নিচে লক্ষ্য করুন</p>
          </div>

          <div 
            ref={previewWrapperRef}
            className="w-full relative flex items-center justify-center scroll-mt-20 overflow-hidden bg-gray-100 p-2 sm:p-4 rounded-xl border border-dashed border-gray-300 min-h-[500px]"
          >
            {/* 800x1000px absolute layout. We scale it using transform for perfect responsiveness */}
            <div 
              style={{
                width: '800px',
                height: '1000px',
                transform: `scale(${calculatedDisplayScale})`,
                transformOrigin: 'top center',
                position: 'absolute',
                top: '16px',
              }}
              className="shadow-2xl select-none shrink-0"
              id="eid-festival-canvas-element"
            >
              
              {/* Actual Printable Canvas node container */}
              <div 
                ref={posterRef}
                className={`w-[800px] h-[1000px] relative overflow-hidden flex flex-col justify-between p-12 select-none border-[14px] border-double ${
                  themeStyle === 'sky-blue' 
                    ? 'bg-gradient-to-b from-[#bfe6f9] via-[#eef9ff] to-[#a3daf7] border-sky-400/90 shadow-[inset_0_0_60px_rgba(3,105,161,0.1)]' 
                    : 'bg-gradient-to-b from-[#3a0007] via-[#7a0410] to-[#1e0003] border-amber-400/90 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]'
                }`}
              >
                {themeStyle === 'sky-blue' ? (
                  // SKY BLUE FESTIVAL THEME LAYOUT
                  <>
                    {/* Traditional Border corner ornaments */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-sky-600/60 opacity-80 pointer-events-none"></div>
                    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-sky-600/60 opacity-80 pointer-events-none"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-sky-600/60 opacity-80 pointer-events-none"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-sky-600/60 opacity-80 pointer-events-none"></div>

                    {/* Top Bismillah Banner */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-7 py-2 bg-gradient-to-r from-sky-500/10 via-white/95 to-sky-500/10 rounded-full border border-sky-300 shadow-sm z-15 flex items-center justify-center">
                      <span className="text-sky-900 font-extrabold text-[14px] font-sans tracking-wide">বিসমিল্লাহির রাহমানির রাহিম</span>
                    </div>

                    {/* Top Left Poem: Eid mane Khushi */}
                    <div className="absolute top-[85px] left-[45px] w-[260px] text-left leading-relaxed z-10 font-sans">
                      <div className="flex flex-col gap-0.5 animate-pulse">
                        <p className="text-red-600 text-[18px] font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">ঈদ মানে খুশি</p>
                        <p className="text-red-650 text-[18px] font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">ঈদ মানে আনন্দ</p>
                        <p className="text-indigo-800 text-[18px] font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] mt-1">ঈদ আসে ভুলিয়ে দিতে</p>
                        <p className="text-indigo-800 text-[18px] font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">সকল বিবাদ দ্বন্দ্ব</p>
                      </div>
                    </div>

                    {/* Glowing golden crescent moon + masjid cutout (middle) */}
                    <div className="absolute top-[75px] left-[325px] w-[150px] h-[150px] flex items-center justify-center pointer-events-none opacity-90 z-10">
                      <div className="relative">
                        <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-tr from-amber-400 to-yellow-350 shadow-[0_0_20px_rgba(251,191,36,0.25)] flex items-center justify-center overflow-hidden">
                          {/* Inner cutout */}
                          <div className="absolute top-1 left-5 w-[110px] h-[110px] rounded-full bg-[#f0f9ff]" />
                        </div>
                        {/* Hanging decorative lamps / lanterns */}
                        <div className="absolute -bottom-6 left-[15px] h-6 w-[1px] bg-amber-500/50 flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-450" />
                        </div>
                        <div className="absolute -bottom-8 left-[55px] h-8 w-[1px] bg-amber-500/50 flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        </div>
                        <div className="absolute -bottom-5 left-[95px] h-5 w-[1px] bg-amber-500/50 flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-450" />
                        </div>
                      </div>
                    </div>

                    {/* Top Right Header greeting */}
                    <div className="absolute top-[85px] right-[45px] w-[410px] text-right z-10 font-sans">
                      <span className="text-slate-700 font-extrabold text-[15px] block leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        দেশ ও বিদেশে সর্বস্তরের ধর্মপ্রাণ মুসলিম ভাই-বোনদের জানাই
                      </span>
                      <span className="text-red-650 font-black text-[28px] block mt-1 leading-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                        পবিত্র ঈদুল আযহার শুভেচ্ছা ও
                      </span>
                      <span className="text-sky-800 font-black text-[52px] block mt-2 font-sans leading-none tracking-wide drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                        অভিনন্দন
                      </span>
                    </div>

                    {/* Official branding logo (Left center) */}
                    {showSamiLogo && (
                      <div className="absolute top-[230px] left-[50px] z-10 flex flex-col items-start gap-1">
                        <img 
                          src={SAMI_TV_LOGO_URL} 
                          alt="Sami TV Logo" 
                          crossOrigin="anonymous"
                          className="h-[60px] w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)]" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-sky-900 font-black text-[12px] tracking-widest font-sans opacity-95">SAMI TV MEDIA</span>
                      </div>
                    )}

                    {/* Big Calligraphy: "ঈদ মোবারক" with 3D shadow effect (Right center) */}
                    <div className="absolute right-[45px] top-[245px] w-[350px] flex flex-col items-end z-12 animate-pulse">
                      <div className="relative transform rotate-[-3deg] scale-105">
                        <div className="text-[72px] font-sans font-black text-rose-800 leading-none tracking-wider select-none absolute top-2 left-2 drop-shadow-[0_12px_20px_rgba(0,0,0,0.4)]">
                          ঈদ মোবারক
                        </div>
                        <div className="text-[72px] font-sans font-black text-white leading-none tracking-wider select-none absolute top-1 left-1">
                          ঈদ মোবারক
                        </div>
                        <div className="text-[72px] font-sans font-black text-transparent bg-gradient-to-b from-red-600 to-[#a80816] bg-clip-text leading-none tracking-wider select-none relative z-10">
                          ঈদ মোবারক
                        </div>
                      </div>
                    </div>

                    {/* Mosque Background Shadow Overlay */}
                    <div className="absolute bottom-[200px] right-[45px] opacity-[0.12] pointer-events-none">
                      <svg className="w-[300px] h-[300px] text-sky-850" fill="currentColor" viewBox="0 0 100 100">
                        <path d="M50 20c-15 0-20 18-20 30h40c0-12-5-30-20-30zm-25 30h-5v30h5V50zm50 0h-5v30h5V50zM50 12l2 4h-4l2-4zm-25 30l1-2h-2l1 2zm50 0l1-2h-2l1 2z" />
                      </svg>
                    </div>

                    {/* Greeting Message text body (Left Center middle) */}
                    <div className="absolute left-[50px] top-[320px] w-[340px] text-left z-10 font-sans">
                      <p className="text-slate-805 text-slate-800 text-[18px] font-bold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        "{greetingText}"
                      </p>
                    </div>

                    {/* Profile Framed Picture overlay on the bottom banner area */}
                    <div className="absolute bottom-[108px] left-[85px] z-10 flex items-center justify-center">
                      <div 
                        className={`relative w-[280px] h-[350px] overflow-hidden shadow-[0_15px_36px_rgba(0,0,0,0.3)] bg-sky-950/5 ${
                          frameShape === 'circle' ? 'rounded-full w-[280px] h-[280px]' : frameShape === 'rounded' ? 'rounded-3xl' : 'rounded-none'
                        } ${
                          frameBorderColor === 'gold' ? 'border-[8px] border-double border-amber-400 outline outline-4 outline-amber-500/20 shadow-amber-400/10' :
                          frameBorderColor === 'white' ? 'border-[6px] border-white outline outline-4 outline-white/20' :
                          frameBorderColor === 'red' ? 'border-[6px] border-red-650 outline outline-4 outline-red-500/20' :
                          'border-none'
                        }`}
                      >
                        {imageSrc ? (
                          <div 
                            className="w-full h-full relative"
                            style={{
                              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                              transformOrigin: 'center center',
                              transition: isExporting ? 'none' : 'transform 0.05s ease-out'
                            }}
                          >
                            <img 
                              src={imageSrc} 
                              alt="User Upload" 
                              className={`w-full h-full ${imageFit === 'cover' ? 'object-cover' : 'object-contain bg-sky-100'}`}
                              style={{ pointerEvents: 'none' }}
                              crossOrigin="anonymous"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-b from-sky-50 to-sky-100 p-8 text-center border-2 border-sky-200 rounded-inherit">
                            <User size={60} className="text-sky-800/40 mb-2 animate-pulse" />
                            <p className="text-xs font-black text-sky-900/60">আপনার ছবি এখানে শো হবে</p>
                            <p className="text-[10px] text-sky-800/50 mt-1">বামদিকের বাটন থেকে পছন্দের ছবি যুক্ত করুন</p>
                          </div>
                        )}
                        <div className="absolute inset-0 pointer-events-none border border-white/5 mix-blend-overlay"></div>
                      </div>
                    </div>

                    {/* Full width blue bottom banner containing names & details */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-[#031d44] via-[#04395e] to-[#031d44] border-t-4 border-amber-400 py-6 px-16 flex items-center justify-between z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
                      <div className="flex flex-col items-start gap-1 text-left">
                        <h2 
                          style={{ fontSize: `${nameFontSize}px`, color: nameColor || '#ffffff' }} 
                          className="font-sans font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                        >
                          {userName}
                        </h2>
                        <p className="text-gray-200 font-bold text-[14px] opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                          {designation}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 font-sans text-right">
                        <span className="text-[13px] text-amber-300 font-black tracking-widest uppercase">সামি টেলিভিশন</span>
                        <span className="text-[10px] text-gray-300/80 font-bold">www.samitvbd.com</span>
                      </div>
                    </div>
                  </>
                ) : (
                  // ROYAL CRIMSON NIGHT THEME LAYOUT (Enhanced night design flow)
                  <>
                    {/* Traditional Border design layout inside corner ornaments */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400 opacity-80 pointer-events-none"></div>
                    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400 opacity-80 pointer-events-none"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400 opacity-80 pointer-events-none"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400 opacity-80 pointer-events-none"></div>

                    {/* Glowing Background Sparkles & Festive Crescent Moons */}
                    <div className="absolute top-16 left-12 opacity-35 text-white/30 pointer-events-none">
                      <Moon size={180} className="text-yellow-300 fill-yellow-200/5 rotate-[-15deg]" />
                    </div>
                    
                    <div className="absolute top-24 right-16 opacity-30 pointer-events-none">
                      <Sparkles size={80} className="text-yellow-100 animate-pulse" />
                    </div>

                    {/* Hanging Elegant Festival Lanterns */}
                    <div className="absolute top-0 right-32 w-[2px] h-[140px] bg-gradient-to-b from-amber-400 to-transparent opacity-70">
                      <div className="absolute bottom-0 -left-[14px] w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 shadow-xl border border-yellow-200 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-yellow-100 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="absolute top-0 left-28 w-[2px] h-[190px] bg-gradient-to-b from-amber-400 to-transparent opacity-70">
                      <div className="absolute bottom-0 -left-[14px] w-7 h-[36px] rounded-lg bg-gradient-to-b from-amber-400 via-yellow-200 to-amber-600 shadow-xl border border-yellow-200 flex flex-col justify-center items-center">
                        <div className="w-1.5 h-3 bg-red-600 rounded-full"></div>
                        <div className="w-3.5 h-1 bg-yellow-100 rounded-full mt-0.5 opacity-90"></div>
                      </div>
                    </div>

                    {/* Header segment: Official Real SAMI TV Logo with glowing back ring */}
                    {showSamiLogo && (
                      <div className="z-10 text-center flex flex-col items-center gap-2 mt-2 relative">
                        <div className="absolute -top-12 w-[160px] h-[160px] bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
                        
                        <img 
                          src={SAMI_TV_LOGO_URL} 
                          alt="Sami TV Logo" 
                          crossOrigin="anonymous"
                          className="h-[125px] w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500 ease-out" 
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="h-[2px] w-[260px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent mt-1"></div>
                      </div>
                    )}

                    {/* Festival Main Heading */}
                    <div className="z-10 text-center flex flex-col gap-1.5 mt-2 font-sans w-full">
                      <span className="text-[#ffdf3f] text-[18px] font-black tracking-[0.13em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        পবিত্র ঈদ-উল-আযহার শুভেচ্ছা
                      </span>
                      <h1 className="text-6xl sm:text-7xl font-sans font-black text-white leading-tight tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white via-amber-50 to-yellow-100 bg-clip-text text-transparent">
                        ঈদ মোবারক
                      </h1>
                    </div>

                    {/* Dynamic greeting preset text */}
                    <div className="z-10 text-center px-14 max-w-[660px] mx-auto mt-2 font-sans">
                      <p className="text-amber-100 text-[19px] font-bold leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] italic">
                        "{greetingText}"
                      </p>
                    </div>

                    {/* User uploaded Picture / Premium Frame Zone */}
                    <div className="z-10 my-3 flex items-center justify-center">
                      <div 
                        className={`relative w-[270px] h-[270px] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.7)] bg-amber-950/20 ${
                          frameShape === 'circle' ? 'rounded-full' : frameShape === 'rounded' ? 'rounded-3xl' : 'rounded-none'
                        } ${
                          frameBorderColor === 'gold' ? 'border-[8px] border-double border-amber-400 outline outline-4 outline-amber-550/40 shadow-amber-400/10' :
                          frameBorderColor === 'white' ? 'border-[6px] border-white outline outline-4 outline-white/20' :
                          frameBorderColor === 'red' ? 'border-[6px] border-red-650 outline outline-4 outline-red-500/20' :
                          'border-none'
                        }`}
                      >
                        {imageSrc ? (
                          <div 
                            className="w-full h-full relative"
                            style={{
                              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                              transformOrigin: 'center center',
                              transition: isExporting ? 'none' : 'transform 0.05s ease-out'
                            }}
                          >
                            <img 
                              src={imageSrc} 
                              alt="User Upload" 
                              className={`w-full h-full ${imageFit === 'cover' ? 'object-cover' : 'object-contain bg-[#110103]'}`}
                              style={{ pointerEvents: 'none' }}
                              crossOrigin="anonymous"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center border-2 border-slate-800 rounded-inherit">
                            <User size={60} className="text-slate-800 mb-2 animate-pulse" />
                            <p className="text-xs font-black text-slate-400">আপনার ছবি এখানে শো হবে</p>
                            <p className="text-[10px] text-slate-500 mt-1">বামদিকের বাটন থেকে পছন্দের ছবি যুক্ত করুন</p>
                          </div>
                        )}
                        <div className="absolute inset-0 pointer-events-none border border-white/5 mix-blend-overlay"></div>
                      </div>
                    </div>

                    {/* Footer segment: Name & Designation card overlay */}
                    <div className="z-10 flex flex-col items-center justify-center text-center mt-2 mb-3">
                      <div className="px-10 py-4 max-w-[560px] bg-black/60 backdrop-blur-md rounded-2xl border border-amber-400/20 shadow-2xl relative min-w-[390px]">
                        <div className="absolute -top-[1.5px] left-1/2 -translate-x-1/2 w-[90px] h-[3px] bg-amber-400 rounded-full"></div>
                        
                        <h2 
                          className="font-black leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-sans"
                          style={{ fontSize: `${nameFontSize}px`, color: nameColor }}
                        >
                          {userName}
                        </h2>
                        
                        <h3 className="text-sm font-bold text-gray-200 mt-1.5 opacity-90 tracking-wide font-sans">
                          {designation}
                        </h3>
                      </div>
                    </div>

                    {/* Footer Slogan / Copy rights info */}
                    <div className="z-15 text-center flex items-center justify-between text-white/40 text-[10px] font-bold border-t border-white/10 pt-4 font-sans w-full">
                      <span>© সামি টেলিভিশন</span>
                      <span className="text-[#ffd700]">www.samitvbd.com</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Placeholder spacer to contain absolute styled 800x1000 scaled component correctly */}
            <div 
              style={{
                width: '100%',
                paddingBottom: '125%', // Maintain 800:1000 aspect-ratio responsive flow
              }}
              className="pointer-events-none"
            ></div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};
