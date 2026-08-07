import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, Scale, AlertCircle, Clock, Mail } from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-sm news-card-shadow overflow-hidden border-t-4 border-sami-blue">
        {/* Header */}
        <div className="bg-gray-50 p-8 border-b border-gray-100 text-center">
          <div className="w-16 h-16 bg-sami-light text-sami-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">শর্ত ও নিয়মাবলী</h1>
          <p className="text-gray-500 text-sm">সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৪</p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-10">
          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <FileText size={20} className="text-sami-blue" /> ১. ভূমিকা
            </h2>
            <p className="text-gray-600 leading-relaxed">
              সামি টিভি (SAMI TV) ওয়েবসাইটে আপনাকে স্বাগতম। এই ওয়েবসাইটটি ব্যবহার করার মাধ্যমে আপনি আমাদের শর্ত ও নিয়মাবলী মেনে নিচ্ছেন বলে গণ্য হবে। আপনি যদি এই শর্তাবলীর সাথে একমত না হন, তবে দয়া করে ওয়েবসাইটটি ব্যবহার করা থেকে বিরত থাকুন।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-sami-blue" /> ২. মেধা সম্পদ ও কপিরাইট
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              এই ওয়েবসাইটে প্রকাশিত সকল সংবাদ, নিবন্ধ, ছবি, ভিডিও, লোগো এবং অন্যান্য বিষয়বস্তু সামি টিভির নিজস্ব সম্পদ অথবা যথাযথ অনুমতি সাপেক্ষে ব্যবহৃত। 
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <p className="text-sm text-red-700 font-medium italic">
                "এই ওয়েবসাইটে কোন লেখা ছবি ভিডিও অনুমতি ছাড়া ব্যবহার করা বেআইনি এবং আইনত দণ্ডনীয় অপরাধ।"
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-sami-blue" /> ৩. ব্যবহারকারীর আচরণ
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>ওয়েবসাইটের কোনো অংশ হ্যাক করার চেষ্টা করা যাবে না।</li>
              <li>মিথ্যা বা বিভ্রান্তিকর তথ্য প্রচারের জন্য এই প্ল্যাটফর্ম ব্যবহার করা যাবে না।</li>
              <li>অন্য কোনো ব্যবহারকারীর গোপনীয়তা লঙ্ঘন করা যাবে না।</li>
              <li>অশ্লীল বা মানহানিকর মন্তব্য করা থেকে বিরত থাকতে হবে।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <Clock size={20} className="text-sami-blue" /> ৪. শর্তাবলীর পরিবর্তন
            </h2>
            <p className="text-gray-600 leading-relaxed">
              সামি টিভি যেকোনো সময় এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। পরিবর্তনের পর ওয়েবসাইট ব্যবহার চালিয়ে গেলে তা নতুন শর্তাবলীর স্বীকৃতি হিসেবে গণ্য হবে।
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-sami-dark mb-4 flex items-center gap-2">
              <Mail size={20} className="text-sami-blue" /> যোগাযোগ
            </h2>
            <p className="text-gray-600 mb-4">
              শর্তাবলী সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:
            </p>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700">ইমেইল: info@samitv.com</p>
              <p className="text-sm font-bold text-gray-700">ফোন: 01912618994</p>
              <p className="text-sm text-gray-500">ঠিকানা: দিগপাইত, জামালপুর, বাংলাদেশ।</p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
