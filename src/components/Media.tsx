import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Image as ImageIcon, Film, ExternalLink } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const Media: React.FC = () => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMediaList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Media Firestore Error: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredMedia = mediaList.filter(m => activeFilter === 'all' || m.type === activeFilter);
  const imagesCount = mediaList.filter(m => m.type === 'image').length;
  const videosCount = mediaList.filter(m => m.type === 'video').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white rounded-sm news-card-shadow overflow-hidden"
    >
      {/* Professional Header Section */}
      <div className="relative bg-gradient-to-br from-sami-dark to-sami-blue py-20 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-blue-100 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
            <Film size={14} /> মিডিয়া গ্যালারি
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">আমাদের মিডিয়া গ্যালারি</h1>
          <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium">
            সামী টিভির সকল বিশেষ মুহূর্তের ছবি এবং ভিডিওর সংগ্রহশালা। আমাদের কার্যক্রমের এক ঝলক দেখুন এখানে।
          </p>
        </div>
      </div>

      <div className="p-6 lg:p-10">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm ${activeFilter === 'all' ? 'bg-sami-blue text-white shadow-lg shadow-sami-blue/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            সব ({mediaList.length})
          </button>
          <button 
            onClick={() => setActiveFilter('image')}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${activeFilter === 'image' ? 'bg-sami-blue text-white shadow-lg shadow-sami-blue/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <ImageIcon size={18} /> ছবি ({imagesCount})
          </button>
          <button 
            onClick={() => setActiveFilter('video')}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${activeFilter === 'video' ? 'bg-sami-blue text-white shadow-lg shadow-sami-blue/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <Film size={18} /> ভিডিও ({videosCount})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-sami-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold">মিডিয়া লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMedia.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={item.id}
                  className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  onClick={() => item.type === 'video' && window.open(item.videoUrl, '_blank')}
                >
                  <div className={`aspect-[4/3] overflow-hidden relative ${item.type === 'video' ? 'cursor-pointer' : ''}`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest mb-2 inline-block">
                          {item.type === 'image' ? 'Photo' : 'Video'}
                        </span>
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{item.title}</h3>
                      </div>
                    </div>

                    {/* Type Indicator Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30 shadow-xl">
                      {item.type === 'image' ? <ImageIcon size={20} /> : <Play size={20} fill="currentColor" />}
                    </div>

                    {/* Play Button for Videos */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-sami-blue text-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Play size={32} fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info Bar (Always Visible) */}
                  <div className="p-4 bg-white">
                    <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-sami-blue transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                      {item.type === 'image' ? 'ফটো গ্যালারি' : 'ভিডিও গ্যালারি'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredMedia.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-400">কোনো মিডিয়া পাওয়া যায়নি</h3>
            <p className="text-gray-500 mt-2">অনুগ্রহ করে অন্য কোনো বিভাগ নির্বাচন করুন।</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
