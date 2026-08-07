import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Phone, Mail, ChevronRight, Users, Search, X, Send, CheckCircle, Upload, Calendar, Briefcase, PlusCircle } from 'lucide-react';
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
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  },
  {
    id: '2',
    name: 'মনজুরুল হক',
    designation: 'নিজস্ব প্রতিবেদক',
    phone: '01715058955',
    joiningDate: '১১ জুন, ২০২৬',
    reporterId: '২৬-০০০২',
    organization: 'SAMI TV',
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
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    division: 'ঢাকা',
    location: 'জামালপুর'
  }
];

export const OurFamily: React.FC = () => {
  const [reporters, setReporters] = useState<any[]>(DEFAULT_REPORTERS);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('সব');
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  // Application Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appForm, setAppForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    division: 'ঢাকা',
    experience: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = '';
      if (imageFile) {
        const fileRef = ref(storage, `applications/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'applications'), {
        ...appForm,
        imageUrl: finalImageUrl,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowModal(false);
        setAppForm({ name: '', phone: '', email: '', location: '', division: 'ঢাকা', experience: '', imageUrl: '' });
        setImageFile(null);
      }, 3000);
    } catch (error) {
      console.error("Application Error: ", error);
      alert('দুঃখিত, আবেদনটি পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReporters = reporters.filter(rep => {
    const matchesDivision = selectedDivision === 'সব' || rep.division === selectedDivision;
    const matchesSearch = (rep.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (rep.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (rep.designation || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-gray-900 pb-20 font-sans">
      
      {/* Application Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl"
            >
              <JournalistApplicationForm onClose={() => setShowModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-6">
        
        {/* Top Header Matching Screenshot Exactly */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-7 bg-[#990000] rounded-full inline-block shrink-0 shadow-xs"></span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#990000] tracking-tight">
                সংবাদকর্মী ও প্রতিনিধিগণ
              </h1>
            </div>
            <p className="text-gray-500 font-medium text-xs sm:text-sm mt-1.5 pl-4">
              SAMI TV-র দেশ-বিদেশের একঝাঁক দক্ষ সংবাদকর্মী
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Reporter Count Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fdf2f2] text-[#990000] border border-[#f8d0d0] px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-xs">
              <User size={16} className="text-[#990000]" />
              <span>মোট সংবাদকর্মী: {convertToBn(filteredReporters.length)} জন</span>
            </div>

            {/* Apply Button */}
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#990000] text-white px-3.5 py-2 rounded-full font-bold text-xs hover:bg-[#800000] transition-colors shadow-xs"
            >
              <PlusCircle size={15} />
              <span>আবেদন করুন</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-3 sm:p-4 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <input 
              type="text" 
              placeholder="নাম, পদবী বা এলাকা দিয়ে অনুসন্ধান করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          </div>

          {/* Division Selector */}
          <div className="w-full sm:w-52 shrink-0">
            <select 
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] transition-all cursor-pointer"
            >
              {divisions.map(div => <option key={div} value={div}>বিভাগ: {div}</option>)}
            </select>
          </div>
        </div>

        {/* Reporter Cards Grid - Matching Image Layout */}
        {filteredReporters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredReporters.map((rep, idx) => (
              <motion.div
                key={rep.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="bg-white border border-gray-200/90 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-red-200 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Main Content Area */}
                <div className="p-3.5 flex gap-3.5 items-center">
                  {/* Avatar Photo */}
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-xs">
                    <img 
                      src={rep.imageUrl || "https://picsum.photos/seed/user/400/400"} 
                      alt={rep.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details Column */}
                  <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h3 className="text-[15px] sm:text-[16px] font-extrabold text-gray-900 leading-tight truncate group-hover:text-[#990000] transition-colors">
                      {rep.name}
                    </h3>

                    {/* Designation */}
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#cc0000] mt-1 truncate">
                      <Briefcase size={13} className="shrink-0 text-[#cc0000]" />
                      <span className="truncate">{rep.designation}</span>
                    </div>

                    {/* Phone */}
                    {rep.phone && (
                      <a 
                        href={`tel:${rep.phone}`}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-600 mt-1 hover:text-[#990000] transition-colors"
                      >
                        <Phone size={12} className="shrink-0 text-gray-400" />
                        <span className="font-mono">{convertToBn(rep.phone)}</span>
                      </a>
                    )}

                    {/* Joining Date */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mt-1">
                      <Calendar size={12} className="shrink-0 text-gray-400" />
                      <span className="truncate">যুক্ত হয়েছেন: {rep.joiningDate || getBnDate(rep.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="bg-[#fcfdfe] border-t border-gray-100 px-3.5 py-2.5 flex items-center justify-between text-xs">
                  {/* ID Badge */}
                  <div className="bg-[#fef2f2] text-[#cc0000] border border-[#fecaca] px-2.5 py-0.5 rounded text-[11.5px] font-bold">
                    আইডি নং: {rep.reporterId ? convertToBn(rep.reporterId) : convertToBn(`২৬-${String(idx + 1).padStart(4, '0')}`)}
                  </div>

                  {/* Organization & Pin */}
                  <div className="flex items-center gap-1 text-gray-600 font-bold text-[11.5px]">
                    <span>{rep.organization || 'SAMI TV'}</span>
                    <MapPin size={12} className="text-[#cc0000] fill-[#cc0000]/10" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center my-8">
            <Users size={36} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">কোনো সংবাদকর্মী পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-xs">অন্য নাম বা ফিল্টার দিয়ে চেষ্টা করুন।</p>
            <button 
              onClick={() => { setSelectedDivision('সব'); setSearchTerm(''); }}
              className="mt-4 bg-[#990000] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#800000] transition-colors"
            >
              সকল সংবাদকর্মী দেখুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
