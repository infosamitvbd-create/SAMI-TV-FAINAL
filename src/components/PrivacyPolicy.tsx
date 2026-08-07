import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, Database, Globe, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-sm news-card-shadow overflow-hidden border-t-4 border-red-600">
        {/* Header */}
        <div className="bg-gray-50 p-8 border-b border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">গোপনীয়তা নীতি</h1>
          <p className="text-gray-500 text-sm">সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৪</p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-10">
          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <Eye size={20} className="text-red-600" /> ১. তথ্য সংগ্রহ
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              সামি টিভি (SAMI TV) আপনার গোপনীয়তাকে অত্যন্ত গুরুত্ব দেয়। আমরা আপনার কাছ থেকে সরাসরি এবং পরোক্ষভাবে কিছু তথ্য সংগ্রহ করতে পারি:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>নাম, ইমেইল এবং ফোন নম্বর (যদি আপনি আমাদের সাথে যোগাযোগ করেন)।</li>
              <li>আইপি অ্যাড্রেস, ব্রাউজারের ধরন এবং ডিভাইসের তথ্য।</li>
              <li>কুকিজ (Cookies) এবং ট্র্যাকিং প্রযুক্তির মাধ্যমে ব্যবহারের তথ্য।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <Database size={20} className="text-red-600" /> ২. তথ্যের ব্যবহার
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              সংগৃহীত তথ্যগুলো আমরা নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>ওয়েবসাইটের অভিজ্ঞতা উন্নত করতে।</li>
              <li>আপনাকে গুরুত্বপূর্ণ আপডেট এবং সংবাদ পাঠাতে।</li>
              <li>ওয়েবসাইটের নিরাপত্তা নিশ্চিত করতে।</li>
              <li>আপনার প্রশ্নের উত্তর দিতে এবং গ্রাহক সেবা প্রদান করতে।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-red-600" /> ৩. তথ্য সুরক্ষা
            </h2>
            <p className="text-gray-600 leading-relaxed">
              আমরা আপনার তথ্য সুরক্ষিত রাখতে আধুনিক প্রযুক্তি এবং নিরাপত্তা ব্যবস্থা ব্যবহার করি। আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা ভাড়ায় দিই না। তবে আইনি বাধ্যবাধকতা থাকলে যথাযথ কর্তৃপক্ষের কাছে তথ্য প্রদান করা হতে পারে।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <Globe size={20} className="text-red-600" /> ৪. কুকিজ (Cookies)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              আমাদের ওয়েবসাইটে আপনার অভিজ্ঞতা উন্নত করতে আমরা কুকিজ ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজার সেটিং থেকে কুকিজ বন্ধ করে রাখতে পারেন, তবে এতে ওয়েবসাইটের কিছু ফিচার সঠিকভাবে কাজ নাও করতে পারে।
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <Mail size={20} className="text-red-600" /> যোগাযোগ
            </h2>
            <p className="text-gray-600 mb-4">
              গোপনীয়তা নীতি সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:
            </p>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700">ইমেইল: privacy@samitv.com</p>
              <p className="text-sm font-bold text-gray-700">ফোন: 01912618994</p>
              <p className="text-sm text-gray-500">ঠিকানা: দিগপাইত, জামালপুর, বাংলাদেশ।</p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
