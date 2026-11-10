import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, User, Phone, Mail, ChevronRight, Users, Search, X, 
  Send, CheckCircle, Upload, Calendar, Briefcase, PlusCircle, 
  ShieldCheck, Award, QrCode, CreditCard, Sparkles, Filter, 
  PhoneCall, ExternalLink, Check, Copy, Download, Building,
  Radio, RotateCw, Share2, Printer, Eye, Zap, Flame
} from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { JournalistApplicationForm } from './JournalistApplicationForm';

const divisions = ['সব', 'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

const DEFAULT_REPORTERS = [
  {
    id: '1',
    name: 'এস.এম খোকন চৌধুরী',
    designation: 'প্রধান সম্পাদক',
    phone: '01972940587',
    joiningDate: '১ মে, ২০২৬',
    reporterId: '২৬-০০০১',
    organization: 'SAMI TV',
    bloodGroup: 'B+',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর',
    isKeyLeader: true
  },
  {
    id: '2',
    name: 'মনজুরুল হক',
    designation: 'নিজস্ব প্রতিবেদক',
    phone: '01715058955',
    joiningDate: '১১ জুন, ২০২৬',
    reporterId: '২৬-০০০২',
    organization: 'SAMI TV',
    bloodGroup: 'O+',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '3',
    name: 'মোঃ খোরশেদ আলম',
    designation: 'নিজস্ব প্রতিবেদক',
    phone: '01721927241',
    joiningDate: '৮ মে, ২০২৬',
    reporterId: '২৬-০০০৩',
    organization: 'SAMI TV',
    bloodGroup: 'A+',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '4',
    name: 'মোঃ আনোয়ার হোসাইন',
    designation: 'স্টাফ রিপোর্টার, জামালপুর।',
    phone: '01321655207',
    joiningDate: '৮ মে, ২০২৬',
    reporterId: '২৬-০০০৫',
    organization: 'SAMI TV',
    bloodGroup: 'AB+',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '5',
    name: 'ফারুক আহমেদ ভূঁইয়া',
    designation: 'বিশেষ প্রতিনিধি',
    phone: '01987256944',
    joiningDate: '১ জুন, ২০২৬',
    reporterId: '২৬-০০০৮',
    organization: 'SAMI TV',
    bloodGroup: 'B+',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '6',
    name: 'মোঃ জাহিদুল ইসলাম',
    designation: 'জামালপুর জেলা প্রতিনিধি',
    phone: '01914362738',
    joiningDate: '৮ মে, ২০২৬',
    reporterId: '২৬-০০১১',
    organization: 'SAMI TV',
    bloodGroup: 'O+',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '7',
    name: 'আল বিল্লাল খাঁন',
    designation: 'নিজস্ব প্রতিবেদক',
    phone: '01887856758',
    joiningDate: '৮ মে, ২০২৬',
    reporterId: '২৬-০০১২',
    organization: 'SAMI TV',
    bloodGroup: 'A+',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '8',
    name: 'মোঃ সোহাগ মিয়া',
    designation: 'ক্রাইম রিপোর্টার',
    phone: '01304436992',
    joiningDate: '৮ মে, ২০২৬',
    reporterId: '২৬-০০১৫',
    organization: 'SAMI TV',
    bloodGroup: 'B+',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '9',
    name: 'মোঃ সিফাত',
    designation: 'সরিষাবাড়ী উপজেলা প্রতিনিধি',
    phone: '01733602458',
    joiningDate: '১ জুলাই, ২০২৬',
    reporterId: '২৬-০০১৪',
    organization: 'SAMI TV',
    bloodGroup: 'O+',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'সরিষাবাড়ী'
  },
  {
    id: '10',
    name: 'মোঃ মোজাম্মেল হক',
    designation: 'বীরগঞ্জ উপজেলা (দিনাজপুর) প্রতিনিধি',
    phone: '01735824041',
    joiningDate: '২৯ মে, ২০২৬',
    reporterId: '২৬-০০২৩',
    organization: 'SAMI TV',
    bloodGroup: 'A+',
    imageUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80',
    division: 'রংপুর',
    location: 'দিনাজপুর'
  },
  {
    id: '11',
    name: 'মোঃ বাহার মিয়া',
    designation: 'ভালুকা উপজেলা প্রতিনিধি (ময়মনসিংহ)',
    phone: '01302368196',
    joiningDate: '২ জুন, ২০২৬',
    reporterId: '২৬-০০২৪',
    organization: 'SAMI TV',
    bloodGroup: 'B+',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    division: 'ময়মনসিংহ',
    location: 'ভালুকা'
  },
  {
    id: '12',
    name: 'বিপুল মিয়া',
    designation: 'বিশেষ প্রতিনিধি',
    phone: '01723877360',
    joiningDate: '১১ জুন, ২০২৬',
    reporterId: '২৬-০০২৫',
    organization: 'SAMI TV',
    bloodGroup: 'AB+',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '13',
    name: 'আহমেদ রাজা',
    designation: 'স্টাফ রিপোর্টার',
    phone: '01712345678',
    joiningDate: '১৫ জুন, ২০২৬',
    reporterId: '২৬-০০২৬',
    organization: 'SAMI TV',
    bloodGroup: 'B+',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  }
];

// Motion Animation Variants for Staggered Entrances
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 22
    }
  }
};

export const OurFamily: React.FC = () => {
  const [reporters, setReporters] = useState<any[]>(DEFAULT_REPORTERS);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('সব');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedIdCardReporter, setSelectedIdCardReporter] = useState<any | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Convert numbers to Bengali
  const convertToBn = (text: string | number): string => {
    if (text === undefined || text === null) return '';
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return text.toString().replace(/\d/g, (d) => bnNums[parseInt(d)] || d);
  };

  // Convert joining date to Bengali format
  const getBnDate = (createdAt?: any) => {
    if (!createdAt) return '১৮ মে, ২০২৬';
    const date = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(0);
    if (date.getTime() === 0) return '১৮ মে, ২০২৬';
    return date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const q = query(collection(db, 'reporters'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbReporters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dbReporters.length > 0) {
        setReporters(dbReporters);
      } else {
        setReporters(DEFAULT_REPORTERS);
      }
      setLoading(false);
    }, (error) => {
      console.error("Reporters Firestore Error: ", error);
      setReporters(DEFAULT_REPORTERS);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCopyPhone = (e: React.MouseEvent, phone: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const handleOpenIdCard = (rep: any) => {
    setIsCardFlipped(false);
    setSelectedIdCardReporter(rep);
  };

  const filteredReporters = reporters.filter(rep => {
    const matchesDivision = selectedDivision === 'সব' || rep.division === selectedDivision;
    const matchesSearch = (rep.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (rep.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (rep.designation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (rep.reporterId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20 font-sans selection:bg-red-600 selection:text-white">
      
      {/* =========================================================================
          APPLICATION MODAL (Journalist Join Request)
          ========================================================================= */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 25 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            >
              <JournalistApplicationForm onClose={() => setShowModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          AUTHENTIC DIGITAL PRESS ID CARD MODAL (With Lanyard & 3D Flip)
          ========================================================================= */}
      <AnimatePresence>
        {selectedIdCardReporter && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            {/* Modal Wrapper */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40, rotateX: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="relative w-full max-w-sm flex flex-col items-center my-auto"
            >
              {/* Lanyard Simulation (Neckstrap & Metallic Badge Clip) */}
              <div className="w-16 h-8 bg-gradient-to-b from-red-800 to-red-600 rounded-t-lg border-x-2 border-red-900 shadow-md flex items-center justify-center relative -mb-1 z-10">
                <span className="text-[7.5px] font-black text-white/90 tracking-widest font-mono uppercase">
                  SAMI TV
                </span>
              </div>
              <div className="w-8 h-4 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 rounded-sm shadow-md border border-zinc-400 relative z-10 flex items-center justify-center">
                <div className="w-4 h-1.5 bg-zinc-800 rounded-full"></div>
              </div>

              {/* Close Button Floating */}
              <button 
                onClick={() => setSelectedIdCardReporter(null)}
                className="absolute -top-3 -right-2 z-30 w-8 h-8 rounded-full bg-zinc-800/90 hover:bg-zinc-900 text-white flex items-center justify-center transition-all shadow-xl border border-white/20 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X size={16} />
              </button>

              {/* ID Card Outer Container */}
              <div className="w-full bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-slate-200/90 relative text-slate-800 mt-[-2px]">
                
                {/* Metallic Hologram Sheen Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-400 via-emerald-400 via-sky-400 to-red-600 animate-shimmer" />

                {/* CARD FRONT SIDE */}
                {!isCardFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, rotateY: -60 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 60 }}
                    transition={{ duration: 0.25 }}
                    className="p-5 space-y-4"
                  >
                    {/* Official Card Header */}
                    <div className="bg-gradient-to-r from-[#990000] via-[#c00000] to-[#800000] text-white p-3.5 rounded-2xl shadow-md text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-md shrink-0">
                          <img 
                            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg" 
                            alt="Sami TV Logo" 
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xs font-black tracking-tight leading-none uppercase">SAMI TELEVISION</h3>
                          <p className="text-[7.5px] text-red-200 font-bold uppercase tracking-widest mt-0.5">PRESS CORPS • BROADCAST NETWORK</p>
                        </div>
                      </div>
                      <span className="inline-block bg-white/20 border border-white/30 text-white text-[9px] font-black px-2.5 py-0.2 rounded-full uppercase tracking-wider">
                        অফিসিয়াল প্রেস আইডি কার্ড
                      </span>
                    </div>

                    {/* Reporter Profile Block */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-22 h-26 rounded-2xl overflow-hidden bg-slate-100 border-2 border-red-600 shadow-md shrink-0">
                        <img 
                          src={selectedIdCardReporter.imageUrl || "https://picsum.photos/seed/user/400/400"} 
                          alt={selectedIdCardReporter.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <span className="text-[9.5px] font-black text-red-700 uppercase tracking-widest bg-red-50 border border-red-200 px-2 py-0.5 rounded-md inline-block font-mono">
                          আইডি: {convertToBn(selectedIdCardReporter.reporterId || '২৬-০০০১')}
                        </span>
                        <h4 className="text-base font-black text-slate-900 leading-tight truncate">
                          {selectedIdCardReporter.name}
                        </h4>
                        <p className="text-xs font-bold text-red-600 leading-snug">
                          {selectedIdCardReporter.designation}
                        </p>
                        <p className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1">
                          <MapPin size={11} className="text-red-600 shrink-0" />
                          <span className="truncate">{selectedIdCardReporter.location}, {selectedIdCardReporter.division}</span>
                        </p>
                      </div>
                    </div>

                    {/* Information Table */}
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex justify-between border-b border-slate-200/50 pb-1">
                        <span className="text-slate-500 font-medium text-[11px]">প্রতিষ্ঠান:</span>
                        <span className="font-black text-slate-900 text-[11px]">সামী মাল্টিমিডিয়া লিমিটেড</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-1">
                        <span className="text-slate-500 font-medium text-[11px]">মোবাইল:</span>
                        <a href={`tel:${selectedIdCardReporter.phone}`} className="font-mono font-bold text-red-600 hover:underline text-[11px]">
                          {convertToBn(selectedIdCardReporter.phone)}
                        </a>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-1">
                        <span className="text-slate-500 font-medium text-[11px]">রক্তের গ্রুপ:</span>
                        <span className="font-bold text-red-600 text-[11px] font-mono">{selectedIdCardReporter.bloodGroup || 'B+'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium text-[11px]">স্ট্যাটাস:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1 text-[11px]">
                          <CheckCircle size={12} />
                          ভেরিফাইড ও সক্রিয়
                        </span>
                      </div>
                    </div>

                    {/* Holographic Security & QR */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-center">
                      <div className="flex flex-col items-center relative">
                        <QrCode size={36} className="text-slate-900" />
                        <span className="text-[7.5px] text-slate-400 font-mono mt-0.5">SCAN TO VERIFY</span>
                      </div>
                      <div className="text-right">
                        <div className="h-5 w-28 bg-slate-900 mx-auto rounded-xs opacity-80 flex items-center justify-center">
                          <span className="text-[7.5px] font-mono tracking-widest text-white">|||| | | ||||| ||</span>
                        </div>
                        <span className="text-[8px] text-slate-400 font-semibold uppercase">AUTHORIZED SIGNATURE</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* CARD BACK SIDE */
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, rotateY: 60 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -60 }}
                    transition={{ duration: 0.25 }}
                    className="p-5 space-y-4 text-xs"
                  >
                    <div className="bg-slate-900 text-white p-3 rounded-2xl text-center space-y-1">
                      <span className="text-[9px] font-black uppercase text-red-400 tracking-wider">
                        INSTRUCTIONS & LEGAL DISCLAIMER
                      </span>
                      <h4 className="text-xs font-black">প্রেস কার্ডের নিয়মাবলী ও শর্ত</h4>
                    </div>

                    <div className="space-y-2 text-[10.5px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p>১. এই কার্ডটি সামী টেলিভিশনের অফিসিয়াল সম্পত্তি। কার্ডধারী ব্যক্তি সামী টিভির অনুমোদিত সংবাদকর্মী।</p>
                      <p>২. আইনশৃঙ্খলা বাহিনী ও প্রশাসনকে পেশাগত দায়িত্ব পালনে সহযোগিতা করার বিনীত অনুরোধ করা হলো।</p>
                      <p>৩. কার্ডটি কোথাও পাওয়া গেলে নিম্নের প্রধান কার্যালয়ের ঠিকানায় জমা দেওয়ার অনুরোধ রইল।</p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-2.5 text-center space-y-0.5 bg-red-50/50">
                      <p className="text-[10px] font-black text-red-700">জরুরি যোগাযোগ ও নিউজরুম:</p>
                      <p className="text-xs font-mono font-black text-slate-900">01912618994 • 01939080605</p>
                      <p className="text-[9px] text-slate-500">দিগপাইত, জামালপুর সদর, জামালপুর</p>
                    </div>

                    <div className="text-center pt-1 border-t border-slate-200">
                      <p className="text-[9px] text-slate-400 font-mono">ISSUED BY: SAMI MULTIMEDIA LTD. • GOVT. REG.</p>
                    </div>
                  </motion.div>
                )}

                {/* ID Card Footer Actions (Call & Flip) */}
                <div className="bg-slate-100/90 border-t border-slate-200 p-3 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <RotateCw size={13} className="text-red-600" />
                    <span>{isCardFlipped ? 'সামনের পাশ দেখুন' : 'বিপরীত পাশ দেখুন'}</span>
                  </button>

                  <a 
                    href={`tel:${selectedIdCardReporter.phone}`}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md text-center"
                  >
                    <PhoneCall size={13} />
                    <span>সরাসরি কল</span>
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          CLEAN & PROFESSIONAL NEWSROOM HEADER
          ========================================================================= */}
      <section className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Title & Description */}
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 sm:h-5 bg-[#990000] rounded-full shrink-0" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#8b0000]">
                  SAMI TV PRESS CORPS • অনুমোদিত প্রতিনিধি প্যানেল
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                সংবাদকর্মী ও <span className="text-[#8b0000]">প্রতিনিধিগণ</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                দেশ ও বিদেশের সর্বশেষ সত্য সংবাদ দ্রুত ও বস্তুনিষ্ঠভাবে জনগণের সামনে তুলে ধরতে তৃণমূল পর্যায়ে সার্বক্ষণিক কর্মরত সামী টেলিভিশনের অনুমোদিত সাংবাদিক ও প্রতিনিধি দল।
              </p>
            </div>

            {/* Quick Metrics & Application Button */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shrink-0">
              <div className="bg-[#f8f9fa] border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center gap-4 sm:gap-6 shadow-2xs">
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-black text-slate-900 font-mono tabular-nums block">
                    {convertToBn(filteredReporters.length)}
                  </span>
                  <p className="text-[9.5px] uppercase font-bold text-slate-500">মোট প্রতিনিধি</p>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-black text-[#8b0000] font-mono tabular-nums block">
                    ৬৪
                  </span>
                  <p className="text-[9.5px] uppercase font-bold text-slate-500">জেলা কভারেজ</p>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-black text-emerald-600 font-mono tabular-nums block">
                    ১০০%
                  </span>
                  <p className="text-[9.5px] uppercase font-bold text-slate-500">ভেরিফাইড</p>
                </div>
              </div>

              <button 
                onClick={() => setShowModal(true)}
                className="bg-[#990000] hover:bg-[#800000] active:bg-[#660000] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <PlusCircle size={16} />
                <span>প্রতিনিধি আবেদন</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CLEAN STICKY TOOLBAR (Division Filters & Search)
          ========================================================================= */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Division Filter Pills */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-1 md:pb-0">
            {divisions.map((div) => {
              const isActive = selectedDivision === div;
              const count = div === 'সব' 
                ? reporters.length 
                : reporters.filter(r => r.division === div).length;
              return (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive 
                      ? 'bg-[#990000] text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <span>{div}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {convertToBn(count)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="নাম, পদবী, এলাকা বা আইডি..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#990000] transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          REPORTERS GRID CONTAINER
          ========================================================================= */}
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2.5">
            <div className="w-8 h-8 border-2 border-[#990000] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-bold">সংবাদকর্মী তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredReporters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredReporters.map((rep, idx) => {
              const repIdDisplay = rep.reporterId ? convertToBn(rep.reporterId) : convertToBn(`২৬-${String(idx + 1).padStart(4, '0')}`);
              return (
                <div
                  key={rep.id || idx}
                  className="bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header Strip */}
                  <div className="bg-[#f8f9fa] border-b border-slate-200/80 px-3.5 py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#8b0000] font-mono font-bold text-[11px]">
                      <CreditCard size={12} className="text-[#8b0000]" />
                      <span>আইডি: {repIdDisplay}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {rep.isKeyLeader && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold">
                          কেন্দ্রীয়
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 font-semibold">
                        {rep.division || 'বাংলাদেশ'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 flex gap-3 items-start">
                    {/* Photo with Verified Badge */}
                    <div className="relative w-18 h-22 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img 
                        src={rep.imageUrl || "https://picsum.photos/seed/user/400/400"} 
                        alt={rep.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xs" title="ভেরিফাইড প্রতিনিধি">
                        <Check size={9} strokeWidth={3} />
                      </div>
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-snug truncate group-hover:text-[#990000] transition-colors">
                        {rep.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b0000] truncate">
                        <Briefcase size={12} className="shrink-0" />
                        <span className="truncate">{rep.designation}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 truncate">
                        <MapPin size={11} className="shrink-0 text-slate-400" />
                        <span className="truncate">{rep.location || 'জামালপুর'}</span>
                      </div>

                      {rep.phone && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <a 
                            href={`tel:${rep.phone}`}
                            className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 hover:text-[#990000] transition-colors"
                          >
                            <Phone size={10} className="text-slate-400" />
                            <span>{convertToBn(rep.phone)}</span>
                          </a>
                          <button 
                            onClick={(e) => handleCopyPhone(e, rep.phone, rep.id || String(idx))}
                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            title="ফোন নম্বর কপি করুন"
                          >
                            {copiedPhoneId === (rep.id || String(idx)) ? (
                              <Check size={11} className="text-emerald-600" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="bg-[#f8f9fa] border-t border-slate-200/70 px-3 py-2 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => handleOpenIdCard(rep)}
                      className="flex-1 bg-white hover:bg-red-50 hover:text-[#990000] hover:border-red-200 text-slate-700 border border-slate-200/90 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      <CreditCard size={12} className="text-[#8b0000]" />
                      <span>প্রেস কার্ড</span>
                    </button>

                    {rep.phone && (
                      <a 
                        href={`tel:${rep.phone}`}
                        className="bg-[#990000] hover:bg-[#800000] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-2xs"
                        title="সরাসরি কল করুন"
                      >
                        <PhoneCall size={12} />
                        <span>কল</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/90 p-10 text-center my-6 shadow-2xs">
            <Users size={36} className="mx-auto text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">কোনো সংবাদকর্মী পাওয়া যায়নি</h3>
            <p className="text-slate-400 text-xs">অন্য নাম, পদবী বা ফিল্টার দিয়ে পুনরায় চেষ্টা করুন।</p>
            <button 
              onClick={() => { setSelectedDivision('সব'); setSearchTerm(''); }}
              className="mt-3.5 bg-[#990000] text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-[#800000] transition-colors cursor-pointer"
            >
              সকল সংবাদকর্মী দেখুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
