import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Upload, Lock, GraduationCap, FileText, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface JournalistApplicationFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const JournalistApplicationForm: React.FC<JournalistApplicationFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: 'উপজেলা প্রতিনিধি',
    village: '',
    union: '',
    upazila: '',
    district: '',
    education: '',
    phone: '',
    nid: '',
    email: '',
    password: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('ছবি সাইজ ৫ মেগাবাইটের কম হতে হবে');
        return;
      }
      setImageFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imageFile && !imagePreview) {
      setError('অনুগ্রহ করে আপনার একটি স্পষ্ট ছবি (প্রোফাইল পিকচার) আপলোড করুন');
      return;
    }

    if (!formData.name.trim()) {
      setError('আপনার নাম প্রদান করুন');
      return;
    }

    if (!formData.phone.trim()) {
      setError('মোবাইল নম্বর প্রদান করুন');
      return;
    }

    if (!formData.nid.trim()) {
      setError('জন্ম নিবন্ধন বা ভোটার আইডি (NID) নম্বর প্রদান করুন');
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setError('অনুগ্রহ করে অন্তত ৪-৬ ডিজিটের পাসওয়ার্ড দিন');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

      if (imageFile) {
        try {
          const storageRef = ref(storage, `applications/${Date.now()}_${imageFile.name}`);
          const snapshot = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadErr) {
          console.warn("Storage upload failed, using data URL fallback", uploadErr);
          imageUrl = imagePreview || imageUrl;
        }
      } else if (imagePreview) {
        imageUrl = imagePreview;
      }

      const applicationData = {
        name: formData.name.trim(),
        designation: formData.designation.trim() || 'সাংবাদিক',
        village: formData.village.trim(),
        union: formData.union.trim(),
        upazila: formData.upazila.trim(),
        district: formData.district.trim(),
        location: `${formData.village ? formData.village + ', ' : ''}${formData.upazila ? formData.upazila + ', ' : ''}${formData.district}`,
        education: formData.education.trim() || 'এস.এস.সি',
        phone: formData.phone.trim(),
        nid: formData.nid.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        pin: formData.password.trim(),
        imageUrl: imageUrl,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'applications'), applicationData);

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Application Submission Error: ", err);
      setError('আবেদন পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">আবেদন সফলভাবে জমা হয়েছে!</h2>
        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
          আপনার সাংবাদিকতার আবেদনপত্র মূল অ্যাডমিন প্যানেলে পাঠানো হয়েছে। মূল অ্যাডমিন আবেদনটি পর্যালোচনা করে অনুমোদন দিলে আপনি আপনার প্রদত্ত নাম/মোবাইল এবং ৬ ডিজিটের পাসওয়ার্ড দিয়ে সরাসরি লগইন করতে পারবেন।
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            if (onClose) onClose();
          }}
          className="w-full bg-sami-red text-white py-3.5 rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          লগইন পেজে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200/80 overflow-hidden text-left">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-slate-900 to-sami-dark p-5 sm:p-6 text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest text-sami-red uppercase bg-red-950/80 border border-red-800/60 px-3 py-1 rounded-full inline-block mb-1">
            SAMI TV সাংবাদিক নিয়োগ
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">সাংবাদিক পদের আবেদনপত্র</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto font-sans">
        
        {/* Photo Upload Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="block text-xs font-black text-slate-800 mb-1">
            আপনার ছবি (প্রোফাইল পিকচার) *
          </label>
          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-slate-300 shrink-0 flex items-center justify-center text-slate-400">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={36} />
              )}
            </div>

            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                id="journalist-photo-input"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="journalist-photo-input"
                className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-300 rounded-xl cursor-pointer hover:border-sami-red transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Upload size={16} className="text-sami-red group-hover:scale-110 transition-transform" />
                  <span className="truncate">{imageFile ? imageFile.name : 'No file chosen'}</span>
                </div>
                <span className="text-[11px] font-extrabold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                  ছবি সিলেক্ট করুন
                </span>
              </label>
              <p className="text-[11px] font-bold text-slate-500 mt-1.5 ml-1">
                জেপিজি / পিএনজি (JPG / PNG) ছবি আপলোড করুন
              </p>
            </div>
          </div>
        </div>

        {/* Name and Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              আপনার নাম *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-sm font-bold bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              চাহিত পদবী *
            </label>
            <select
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-sm font-bold bg-slate-50/50 focus:bg-white"
            >
              <option value="জেলা প্রতিনিধি">জেলা প্রতিনিধি</option>
              <option value="উপজেলা প্রতিনিধি">উপজেলা প্রতিনিধি</option>
              <option value="স্টাফ রিপোর্টার">স্টাফ রিপোর্টার</option>
              <option value="নিজস্ব প্রতিবেদক">নিজস্ব প্রতিবেদক</option>
              <option value="বিশেষ প্রতিনিধি">বিশেষ প্রতিনিধি</option>
              <option value="ক্রাইম রিপোর্টার">ক্রাইম রিপোর্টার</option>
              <option value="ক্যামেরাপারসন">ক্যামেরাপারসন</option>
            </select>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/80 space-y-3">
          <h3 className="text-xs font-black text-sami-red uppercase tracking-wider flex items-center gap-1.5">
            <MapPin size={14} />
            <span>বর্তমান ঠিকানা বিবরণ</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">গ্রাম *</label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder="গ্রামের নাম"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">ইউনিয়ন *</label>
              <input
                type="text"
                required
                value={formData.union}
                onChange={(e) => setFormData({ ...formData, union: e.target.value })}
                placeholder="ইউনিয়নের নাম"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">উপজেলা *</label>
              <input
                type="text"
                required
                value={formData.upazila}
                onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                placeholder="উপজেলার নাম"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">জেলা *</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="জেলার নাম"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold bg-white"
              />
            </div>
          </div>
        </div>

        {/* Education & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-0.5">
              শিক্ষাগত যোগ্যতা *
            </label>
            <p className="text-[10px] font-bold text-sami-red mb-1">সর্বনিম্ন এস.এস.সি পাশ</p>
            <input
              type="text"
              required
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="যেমন: এস.এস.সি / এইচ.এস.সি / বিএ"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-sm font-bold bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              মোবাইল নম্বর *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-sm font-bold bg-slate-50/50 focus:bg-white font-mono"
            />
          </div>
        </div>

        {/* NID & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              জন্ম নিবন্ধন/ভোটার আইডি (NID) নম্বর *
            </label>
            <input
              type="text"
              required
              value={formData.nid}
              onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
              placeholder="NID বা জন্ম নিবন্ধন নম্বর"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-sm font-bold bg-slate-50/50 focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              ইমেইল এড্রেস *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-sm font-bold bg-slate-50/50 focus:bg-white font-mono"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1">
            পাসওয়ার্ড (৬ ডিজিট) *
          </label>
          <input
            type="password"
            required
            maxLength={10}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="লগইন করার জন্য ৬ ডিজিটের গোপন পিন/পাসওয়ার্ড দিন"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-sm font-bold bg-slate-50/50 focus:bg-white font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            * অনুমোদন পাওয়ার পর এই পাসওয়ার্ড ও মোবাইল নম্বর দিয়ে প্যানেলে প্রবেশ করতে পারবেন।
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600 text-xs font-bold">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sami-red hover:bg-red-700 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <span>আবেদন জমা হচ্ছে...</span>
          ) : (
            <>
              <Send size={18} />
              <span>আবেদনপত্র জমা দিন</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
