import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Youtube, Twitter, Globe, MessageSquare, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'সাধারণ জিজ্ঞাসা',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', subject: 'সাধারণ জিজ্ঞাসা', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message: ", error);
      alert('দুঃখিত, বার্তাটি পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6"
    >
      {/* Header Section */}
      <div className="bg-sami-dark text-white py-16 px-8 rounded-sm news-card-shadow mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sami-blue/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">আমাদের সাথে যোগাযোগ করুন</h1>
          <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            আপনার যেকোনো মতামত, অভিযোগ বা বিজ্ঞাপনের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন। আমরা আপনার বার্তার অপেক্ষায় আছি।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-sm news-card-shadow border-l-4 border-sami-blue group hover:bg-sami-blue transition-all duration-300">
            <div className="w-12 h-12 bg-sami-light text-sami-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
              <Phone size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white">ফোন করুন</h3>
            <p className="text-gray-500 text-sm group-hover:text-blue-100 mb-4">যেকোনো জরুরি প্রয়োজনে কল করুন</p>
            <div className="space-y-1">
              <p className="font-bold text-gray-900 group-hover:text-white">01912618994</p>
              <p className="font-bold text-gray-900 group-hover:text-white">01939080605</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm news-card-shadow border-l-4 border-red-600 group hover:bg-red-600 transition-all duration-300">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white">ইমেইল পাঠান</h3>
            <p className="text-gray-500 text-sm group-hover:text-red-100 mb-4">অফিসিয়াল যোগাযোগের জন্য</p>
            <p className="font-bold text-gray-900 group-hover:text-white">info.samitv.bd@gmail.com</p>
          </div>

          <div className="bg-white p-8 rounded-sm news-card-shadow border-l-4 border-green-600 group hover:bg-green-600 transition-all duration-300">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white">আমাদের ঠিকানা</h3>
            <p className="text-gray-500 text-sm group-hover:text-green-100 mb-4">সরাসরি অফিসে আসতে পারেন</p>
            <p className="font-bold text-gray-900 group-hover:text-white leading-relaxed">
              দিগপাইত, জামালপুর সদর,<br />জামালপুর, বাংলাদেশ।
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 sm:p-10 rounded-sm news-card-shadow h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-sami-blue text-white rounded-lg flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">আমাদের বার্তা পাঠান</h2>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-xl">
                  <CheckCircle size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">বার্তাটি পাঠানো হয়েছে!</h3>
                  <p className="text-gray-500">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। ধন্যবাদ।</p>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-8 py-2 bg-sami-blue text-white font-bold rounded-lg hover:bg-sami-dark transition-all"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">আপনার নাম</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="পুরো নাম লিখুন"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">মোবাইল নম্বর</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="আপনার মোবাইল নম্বর"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="আপনার ইমেইল"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">বার্তার বিষয়</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                  >
                    <option>সাধারণ জিজ্ঞাসা</option>
                    <option>বিজ্ঞাপন সংক্রান্ত</option>
                    <option>অভিযোগ বা পরামর্শ</option>
                    <option>নিউজ টিপস</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">আপনার বার্তা</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="আপনার বার্তাটি এখানে বিস্তারিত লিখুন..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sami-blue text-white py-4 rounded-lg font-bold text-lg hover:bg-sami-dark transition-all shadow-xl shadow-sami-blue/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'} <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Map & Social Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-4 rounded-sm news-card-shadow h-[400px] overflow-hidden">
          {/* Placeholder for Google Map */}
          <div className="w-full h-full bg-gray-100 rounded flex flex-col items-center justify-center text-gray-400 gap-4 border-2 border-dashed border-gray-200">
            <Globe size={48} className="animate-pulse" />
            <div className="text-center">
              <p className="font-bold text-gray-600">গুগল ম্যাপ (জামালপুর অফিস)</p>
              <p className="text-xs">দিগপাইত, জামালপুর সদর, জামালপুর</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-sm news-card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-sami-blue rounded-full"></div>
              সামাজিক যোগাযোগ
            </h3>
            <div className="space-y-4">
              <a href="https://www.facebook.com/samitvbd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all group">
                <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold">ফেসবুক পেজ</span>
              </a>
              <a href="https://youtube.com/@stv2026Banglades" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all group">
                <Youtube size={24} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold">ইউটিউব চ্যানেল</span>
              </a>
              <a href="#" className="flex items-center gap-4 p-4 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-all group">
                <Twitter size={24} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold">টুইটার (X)</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-500">
              <Clock size={18} className="text-sami-blue" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest">অফিস সময়</p>
                <p className="text-sm font-bold text-gray-700">সকাল ১০:০০ - রাত ০৮:০০</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
