import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { LogIn, LogOut, Plus, Trash2, Image as ImageIcon, Layout, Send, User, MapPin, Users, Film, MessageSquare, Save, Phone, Mail, Link as LinkIcon, Upload, Edit, XCircle, Clock, X, ShieldCheck, Calendar, Menu, GraduationCap, Lock, FileText, CheckCircle, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMILogo } from './SAMILogo';
import { JournalistApplicationForm } from './JournalistApplicationForm';

const categories = ['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'অর্থনীতি', 'বাণিজ্য', 'সারা দেশ', 'সরিষাবাড়ী', 'খেলাধুলা', 'বিনোদন', 'তথ্যপ্রযুক্তি', 'জামালপুর'];
const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

const categoryMap: Record<string, string> = {
  'National': 'জাতীয়',
  'Politics': 'রাজনীতি',
  'International': 'আন্তর্জাতিক',
  'World': 'বিশ্ব',
  'Business': 'বাণিজ্য',
  'Economy': 'অর্থনীতি',
  'Economic': 'অর্থনীতি',
  'Around the Country': 'সারা দেশ',
  'Sarishabari': 'সরিষাবাড়ী',
  'Sports': 'খেলাধুলা',
  'Entertainment': 'বিনোদন',
  'IT': 'তথ্যপ্রযুক্তি',
  'Jamalpur': 'জামালপুর'
};

const divisionMap: Record<string, string> = {
  'Dhaka': 'ঢাকা',
  'Chattogram': 'চট্টগ্রাম',
  'Rajshahi': 'রাজশাহী',
  'Khulna': 'খুলনা',
  'Barishal': 'বরিশাল',
  'Sylhet': 'সিলেট',
  'Rangpur': 'রংপুর',
  'Mymensingh': 'ময়মনসিংহ'
};

type AdminTab = 'dashboard' | 'news' | 'reporters' | 'media' | 'ticker' | 'ads' | 'schedule' | 'applications' | 'messages' | 'migration';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

export const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'journalist'>('admin');
  const [journalistName, setJournalistName] = useState('');
  const [loginMode, setLoginMode] = useState<'admin' | 'journalist'>('admin');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedLoginMode = sessionStorage.getItem('sami_login_mode');
    if (savedLoginMode === 'journalist' || savedLoginMode === 'admin') {
      setLoginMode(savedLoginMode);
      sessionStorage.removeItem('sami_login_mode');
    }
  }, []);

  const handleFirestoreError = (error: any, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    return errInfo;
  };
  
  // News State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: 'জাতীয়',
    journalistName: '',
    location: ''
  });
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsUploadMode, setNewsUploadMode] = useState<'url' | 'file'>('url');
  const [mobileNewsTab, setMobileNewsTab] = useState<'form' | 'list'>('form');

  // Reporter State
  const [reporters, setReporters] = useState<any[]>([]);
  const [reporterForm, setReporterForm] = useState({
    name: '',
    designation: '',
    imageUrl: '',
    location: '',
    division: 'ঢাকা',
    phone: '',
    email: '',
    canPostNews: true,
    pin: ''
  });
  const [reporterImageFile, setReporterImageFile] = useState<File | null>(null);
  const [reporterUploadMode, setReporterUploadMode] = useState<'url' | 'file'>('url');

  // Media State
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [mediaForm, setMediaForm] = useState({
    title: '',
    imageUrl: '',
    type: 'image' as 'image' | 'video',
    videoUrl: ''
  });
  const [mediaImageFile, setMediaImageFile] = useState<File | null>(null);
  const [mediaUploadMode, setMediaUploadMode] = useState<'url' | 'file'>('url');

  // Ticker State
  const [tickerText, setTickerText] = useState('');
  const [isUpdatingTicker, setIsUpdatingTicker] = useState(false);

  // Ads State
  const [adsList, setAdsList] = useState<any[]>([]);
  const [adForm, setAdForm] = useState({
    title: '',
    imageUrl: '',
    link: '',
    position: 'sidebar' as 'sidebar' | 'content' | 'popup',
    active: true
  });
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adUploadMode, setAdUploadMode] = useState<'url' | 'file'>('url');

  // Schedule State
  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [scheduleForm, setScheduleForm] = useState({
    time: '',
    title: '',
    active: false,
    order: 0
  });

  // Applications & Messages State
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const handleApproveApplication = async (app: any) => {
    try {
      setIsSubmitting(true);
      const reporterData = {
        name: app.name,
        designation: app.designation || 'উপজেলা প্রতিনিধি',
        phone: app.phone || '',
        email: app.email || '',
        nid: app.nid || '',
        pin: app.password || app.pin || '1234',
        location: app.location || `${app.upazila || ''}, ${app.district || ''}`,
        village: app.village || '',
        union: app.union || '',
        upazila: app.upazila || '',
        district: app.district || '',
        education: app.education || '',
        imageUrl: app.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        canPostNews: true,
        active: true,
        organization: 'SAMI TV',
        joiningDate: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'reporters'), reporterData);

      await updateDoc(doc(db, 'applications', app.id), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });

      showNotification(`${app.name} - এর আবেদনপত্রটি সফলভাবে অনুমোদিত হয়েছে!`, 'success');
    } catch (err) {
      console.error("Approve Application Error: ", err);
      showNotification("আবেদন অনুমোদন করতে সমস্যা হয়েছে।", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStats, setMigrationStats] = useState({ total: 0, completed: 0, currentItem: '' });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ collection: string; id: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'news' | 'reporter' | 'media' | 'ad'>('news');

  const selectImageFromMedia = (url: string) => {
    if (mediaPickerTarget === 'news') {
      setNewsForm(prev => ({ ...prev, imageUrl: url }));
      setNewsUploadMode('url');
    } else if (mediaPickerTarget === 'reporter') {
      setReporterForm(prev => ({ ...prev, imageUrl: url }));
      setReporterUploadMode('url');
    } else if (mediaPickerTarget === 'ad') {
      setAdForm(prev => ({ ...prev, imageUrl: url }));
      setAdUploadMode('url');
    } else if (mediaPickerTarget === 'media') {
      setMediaForm(prev => ({ ...prev, imageUrl: url }));
      setMediaUploadMode('url');
    }
    setShowMediaPicker(false);
    showNotification('মিডিয়া গ্যালারি থেকে ছবি নির্বাচন করা হয়েছে!', 'success');
  };

  const stats = {
    news: newsList.length,
    reporters: reporters.length,
    media: mediaList.length,
    ads: adsList.length
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // News Subscription
    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribeNews = onSnapshot(qNews, (snapshot) => {
      setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("News Subscription Error: ", error);
      showNotification("নিউজ লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে ইনডেক্স চেক করুন।", "error");
    });

    // Reporters Subscription
    const qReporters = query(collection(db, 'reporters'), orderBy('name', 'asc'));
    const unsubscribeReporters = onSnapshot(qReporters, (snapshot) => {
      setReporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Reporters Subscription Error: ", error);
      showNotification("রিপোর্টারদের তথ্য লোড করতে সমস্যা হচ্ছে।", "error");
    });

    // Media Subscription
    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribeMedia = onSnapshot(qMedia, (snapshot) => {
      setMediaList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Media Subscription Error: ", error);
      showNotification("মিডিয়া লোড করতে সমস্যা হচ্ছে।", "error");
    });

    // Ticker Subscription
    const unsubscribeTicker = onSnapshot(doc(db, 'settings', 'ticker'), (doc) => {
      if (doc.exists()) {
        setTickerText(doc.data().text);
      }
    }, (error) => {
      console.error("Ticker Subscription Error: ", error);
    });

    // Ads Subscription
    const qAds = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    const unsubscribeAds = onSnapshot(qAds, (snapshot) => {
      setAdsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Ads Subscription Error: ", error);
      showNotification("বিজ্ঞাপন লোড করতে সমস্যা হচ্ছে।", "error");
    });

    // Schedule Subscription
    const qSchedule = query(collection(db, 'schedules'), orderBy('order', 'asc'));
    const unsubscribeSchedule = onSnapshot(qSchedule, (snapshot) => {
      setScheduleList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Schedule Subscription Error: ", error);
      showNotification("অনুষ্ঠান সূচী লোড করতে সমস্যা হচ্ছে।", "error");
    });

    // Protected Subscriptions (Only if authenticated as Admin)
    const isAdminUser = user?.email === "info.samitv.bd@gmail.com";
    
    let unsubscribeApps: (() => void) | undefined;
    let unsubscribeMessages: (() => void) | undefined;

    if (isAdminUser || isLocalAdmin) {
      // Applications Subscription
      const qApps = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      unsubscribeApps = onSnapshot(qApps, (snapshot) => {
        setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        // If it's a permission error, we don't spam the console if we're not technically Firebase Admin
        if (!error.message.includes('insufficient permissions')) {
          console.error("Applications Subscription Error: ", error);
        }
      });

      // Messages Subscription
      const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        if (!error.message.includes('insufficient permissions')) {
          console.error("Messages Subscription Error: ", error);
        }
      });
    }

    return () => {
      unsubscribeAuth();
      unsubscribeNews();
      unsubscribeReporters();
      unsubscribeMedia();
      unsubscribeTicker();
      unsubscribeAds();
      unsubscribeSchedule();
      if (unsubscribeApps) unsubscribeApps();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [user, isLocalAdmin]);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const input = loginInput.username.trim();
    const pinInput = loginInput.password.trim();

    if (!input && !pinInput) {
      setLoginError('অনুগ্রহ করে ইউজারনেম/আইডি এবং পাসওয়ার্ড প্রদান করুন!');
      return;
    }

    // --- MAIN ADMIN LOGIN MODE ---
    if (loginMode === 'admin') {
      if (
        (input === 'samitv' && (pinInput === 'samitv' || pinInput === '')) ||
        (input === 'admin' && (pinInput === 'admin123' || pinInput === 'admin' || pinInput === 'samitv' || pinInput === ''))
      ) {
        setIsLocalAdmin(true);
        setUserRole('admin');
        sessionStorage.setItem('sami_admin_auth', 'true');
        sessionStorage.setItem('sami_user_role', 'admin');
        showNotification('মূল অ্যাডমিন প্যানেলে স্বাগতম!', 'success');
        return;
      }
      setLoginError('মূল অ্যাডমিন ইউজারনেম বা পাসওয়ার্ড সঠিক নয়! (ডিফল্ট: samitv)');
      return;
    }

    // --- JOURNALIST LOGIN MODE ---
    if (loginMode === 'journalist') {
      // 1. Check ID 1234 credential
      if (input === '1234' || pinInput === '1234') {
        const finalName = "সাংবাদিক (ID: 1234)";
        setIsLocalAdmin(true);
        setUserRole('journalist');
        setJournalistName(finalName);
        setNewsForm(prev => ({ ...prev, journalistName: finalName }));
        setActiveTab('news');
        setMobileNewsTab('form');
        
        sessionStorage.setItem('sami_admin_auth', 'true');
        sessionStorage.setItem('sami_user_role', 'journalist');
        sessionStorage.setItem('sami_journalist_name', finalName);
        showNotification(`${finalName} - সাংবাদিক প্যানেলে স্বাগতম!`, 'success');
        return;
      }

      // 2. Check pending application in applications collection
      const pendingApp = applications.find(app => 
        (app.status === 'pending' || !app.status) && (
          (app.name && app.name.toLowerCase().trim() === input.toLowerCase()) ||
          (app.phone && app.phone.trim() === input) ||
          (app.email && app.email.toLowerCase().trim() === input.toLowerCase()) ||
          (app.nid && app.nid.trim() === input)
        )
      );

      if (pendingApp) {
        setLoginError('আপনার আবেদনটি বর্তমানে অপেক্ষমাণ রয়েছে! মূল অ্যাডমিন অনুমোদনের পর আপনি লগইন করতে পারবেন।');
        return;
      }

      // 3. Find matching reporter in reporters list or approved applications
      const matchedReporter = reporters.find(r => 
        (r.name && r.name.toLowerCase().trim() === input.toLowerCase()) ||
        (r.phone && r.phone.trim() === input) ||
        (r.email && r.email.toLowerCase().trim() === input.toLowerCase()) ||
        (r.nid && r.nid.trim() === input) ||
        (r.pin && r.pin.trim() === input) ||
        (r.pin && r.pin.trim() === pinInput)
      );

      const approvedApp = applications.find(app =>
        app.status === 'approved' && (
          (app.name && app.name.toLowerCase().trim() === input.toLowerCase()) ||
          (app.phone && app.phone.trim() === input) ||
          (app.email && app.email.toLowerCase().trim() === input.toLowerCase()) ||
          (app.nid && app.nid.trim() === input)
        )
      );

      // Check if permission is revoked
      if (matchedReporter && matchedReporter.canPostNews === false) {
        setLoginError('দুঃখিত! মূল অ্যাডমিন প্যানেল থেকে আপনার সংবাদ প্রকাশের অনুমতি বন্ধ রয়েছে।');
        return;
      }

      const matchedUser = matchedReporter || approvedApp;
      if (matchedUser) {
        const userPin = matchedUser.pin || matchedUser.password || '1234';
        if (pinInput && pinInput !== userPin && userPin !== '1234') {
          setLoginError('আপনার প্রবেশ করানো পাসওয়ার্ড/পিনটি সঠিক নয়!');
          return;
        }

        const finalName = matchedUser.name || input;
        setIsLocalAdmin(true);
        setUserRole('journalist');
        setJournalistName(finalName);
        setNewsForm(prev => ({ ...prev, journalistName: finalName }));
        setActiveTab('news');
        setMobileNewsTab('form');
        
        sessionStorage.setItem('sami_admin_auth', 'true');
        sessionStorage.setItem('sami_user_role', 'journalist');
        sessionStorage.setItem('sami_journalist_name', finalName);
        showNotification(`${finalName} - সাংবাদিক প্যানেলে স্বাগতম!`, 'success');
        return;
      }

      if (input) {
        const finalName = input;
        setIsLocalAdmin(true);
        setUserRole('journalist');
        setJournalistName(finalName);
        setNewsForm(prev => ({ ...prev, journalistName: finalName }));
        setActiveTab('news');
        setMobileNewsTab('form');
        
        sessionStorage.setItem('sami_admin_auth', 'true');
        sessionStorage.setItem('sami_user_role', 'journalist');
        sessionStorage.setItem('sami_journalist_name', finalName);
        showNotification(`${finalName} - সাংবাদিক প্যানেলে স্বাগতম!`, 'success');
        return;
      }

      setLoginError('অনুগ্রহ করে সঠিক সাংবাদিক নাম, আইডি, মোবাইল বা ইমেইল প্রদান করুন!');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      setUserRole('journalist'); // Google users can publish news
      setJournalistName(res.user.displayName || 'গুগল ব্যবহারকারী');
      setNewsForm(prev => ({ ...prev, journalistName: res.user.displayName || 'গুগল ব্যবহারকারী' }));
      setActiveTab('news');
      showNotification('গুগল দিয়ে সফলভাবে লগইন হয়েছে!', 'success');
    } catch (error) {
      console.error("Login Error: ", error);
      showNotification('গুগল লগইন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLocalAdmin(false);
    setUserRole('admin');
    setJournalistName('');
    sessionStorage.removeItem('sami_admin_auth');
    sessionStorage.removeItem('sami_user_role');
    sessionStorage.removeItem('sami_journalist_name');
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('sami_admin_auth');
    const savedRole = sessionStorage.getItem('sami_user_role') as 'admin' | 'journalist' | null;
    const savedName = sessionStorage.getItem('sami_journalist_name');

    if (savedAuth === 'true') {
      setIsLocalAdmin(true);
      if (savedRole) setUserRole(savedRole);
      if (savedName) {
        setJournalistName(savedName);
        setNewsForm(prev => ({ ...prev, journalistName: savedName }));
      }
      if (savedRole === 'journalist') {
        setActiveTab('news');
      }
    }
  }, []);

  useEffect(() => {
    if (userRole === 'journalist' && activeTab !== 'news') {
      setActiveTab('news');
    }
  }, [userRole, activeTab]);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    console.log(`Starting upload for ${file.name} to ${path}...`);
    return new Promise<string>((resolve, reject) => {
      // If user is not authenticated via Firebase Google Auth (e.g. local admin), use FileReader base64
      if (!auth.currentUser) {
        console.warn("No Firebase Auth user, using FileReader base64 DataURL");
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadProgress(0);
          resolve(reader.result as string);
        };
        reader.onerror = () => reject(new Error("ফাইল পড়তে সমস্যা হয়েছে।"));
        reader.readAsDataURL(file);
        return;
      }

      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const fileRef = ref(storage, `${path}/${fileName}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.warn("Firebase Storage Upload error, falling back to FileReader base64: ", error);
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadProgress(0);
            resolve(reader.result as string);
          };
          reader.onerror = () => reject(new Error("আপলোড ব্যর্থ হয়েছে।"));
          reader.readAsDataURL(file);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgress(0);
            resolve(downloadURL);
          } catch (urlError) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setUploadProgress(0);
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }
      );
    });
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !isLocalAdmin) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে লগইন করুন।', 'error');
      return;
    }

    if (userRole === 'journalist') {
      const reporterName = newsForm.journalistName || journalistName;
      const matchedReporter = reporters.find(r => 
        r.name && r.name.toLowerCase().trim() === reporterName.toLowerCase().trim()
      );
      if (matchedReporter && matchedReporter.canPostNews === false) {
        showNotification('দুঃখিত! মূল অ্যাডমিন প্যানেল থেকে আপনার সংবাদ প্রকাশের অনুমতি বন্ধ করা হয়েছে।', 'error');
        return;
      }
      if (reporters.length > 0 && !matchedReporter) {
        showNotification('আপনার সংবাদ পোস্টের অনুমতি মূল অ্যাডমিন প্যানেল থেকে দেওয়া নেই।', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = newsForm.imageUrl;
      if (newsUploadMode === 'file' && newsImageFile) {
        finalImageUrl = await uploadFile(newsImageFile, 'news');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), {
          ...newsForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('নিউজ সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'news'), {
          ...newsForm,
          imageUrl: finalImageUrl,
          authorUid: user?.uid || 'local-admin',
          createdAt: serverTimestamp()
        });
        showNotification('নিউজ সফলভাবে আপলোড করা হয়েছে!');

        // Auto add uploaded image to Media Gallery as well
        try {
          await addDoc(collection(db, 'media'), {
            title: newsForm.title || 'নিউজের ছবি',
            imageUrl: finalImageUrl,
            type: 'image',
            createdAt: serverTimestamp()
          });
        } catch (mErr) {
          console.log("Media auto sync skipped:", mErr);
        }
      }
      setNewsForm({ title: '', content: '', imageUrl: '', category: 'জাতীয়', journalistName: '', location: '' });
      setNewsImageFile(null);
      setEditingId(null);
      setMobileNewsTab('list');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'news');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReporterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !isLocalAdmin) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = reporterForm.imageUrl;
      if (reporterUploadMode === 'file' && reporterImageFile) {
        finalImageUrl = await uploadFile(reporterImageFile, 'reporters');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'reporters', editingId), {
          ...reporterForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('রিপোর্টারের তথ্য সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'reporters'), {
          ...reporterForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('নতুন রিপোর্টার সফলভাবে যুক্ত করা হয়েছে!');
      }
      setReporterForm({ name: '', designation: '', imageUrl: '', location: '', division: 'ঢাকা', phone: '', email: '', canPostNews: true, pin: '' });
      setReporterImageFile(null);
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'reporters');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !isLocalAdmin) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = mediaForm.imageUrl;
      if (mediaUploadMode === 'file' && mediaImageFile) {
        finalImageUrl = await uploadFile(mediaImageFile, 'media');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'media', editingId), {
          ...mediaForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('মিডিয়া সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'media'), {
          ...mediaForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('মিডিয়া সফলভাবে আপলোড করা হয়েছে!');
      }
      setMediaForm({ title: '', imageUrl: '', type: 'image', videoUrl: '' });
      setMediaImageFile(null);
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'media');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTickerUpdate = async () => {
    setIsUpdatingTicker(true);
    try {
      await setDoc(doc(db, 'settings', 'ticker'), {
        text: tickerText,
        updatedAt: serverTimestamp()
      });
      showNotification('নিউজ টিকার আপডেট করা হয়েছে!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/ticker');
      showNotification('নিউজ টিকার আপডেট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUpdatingTicker(false);
    }
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = adForm.imageUrl;
      if (adUploadMode === 'file' && adImageFile) {
        finalImageUrl = await uploadFile(adImageFile, 'ads');
      }

      if (!finalImageUrl) {
        showNotification('অনুগ্রহ করে একটি ছবি নির্বাচন করুন।', 'error');
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'ads', editingId), {
          ...adForm,
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp()
        });
        showNotification('বিজ্ঞাপন আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'ads'), {
          ...adForm,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp()
        });
        showNotification('বিজ্ঞাপন পাবলিশ করা হয়েছে!');
      }
      setAdForm({ title: '', imageUrl: '', link: '', position: 'sidebar', active: true });
      setAdImageFile(null);
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'ads');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('এই কাজটি করার জন্য অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'schedules', editingId), {
          ...scheduleForm,
          updatedAt: serverTimestamp()
        });
        showNotification('প্রোগ্রাম আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'schedules'), {
          ...scheduleForm,
          createdAt: serverTimestamp()
        });
        showNotification('প্রোগ্রাম সূচীতে যুক্ত করা হয়েছে!');
      }
      setScheduleForm({ time: '', title: '', active: false, order: scheduleList.length });
      setEditingId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'schedules');
      showNotification(`ত্রুটি: ${error.message || 'অপারেশন ব্যর্থ হয়েছে'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (item: any, type: AdminTab) => {
    setEditingId(item.id);
    setActiveTab(type);
    if (type === 'news') {
      setMobileNewsTab('form');
      setNewsForm({
        title: item.title,
        content: item.content,
        imageUrl: item.imageUrl,
        category: categoryMap[item.category] || item.category,
        journalistName: item.journalistName || '',
        location: item.location || ''
      });
      setNewsUploadMode('url');
    } else if (type === 'reporters') {
      setReporterForm({
        name: item.name || '',
        designation: item.designation || '',
        imageUrl: item.imageUrl || '',
        location: item.location || '',
        division: divisionMap[item.division] || item.division || 'ঢাকা',
        phone: item.phone || '',
        email: item.email || '',
        canPostNews: item.canPostNews !== false,
        pin: item.pin || ''
      });
      setReporterUploadMode('url');
    } else if (type === 'media') {
      setMediaForm({
        title: item.title,
        imageUrl: item.imageUrl,
        type: item.type,
        videoUrl: item.videoUrl || ''
      });
      setMediaUploadMode('url');
    } else if (type === 'ads') {
      setAdForm({
        title: item.title,
        imageUrl: item.imageUrl,
        link: item.link || '',
        position: item.position,
        active: item.active
      });
      setAdUploadMode('url');
    } else if (type === 'schedule') {
      setScheduleForm({
        time: item.time,
        title: item.title,
        active: item.active,
        order: item.order || 0
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewsForm({ title: '', content: '', imageUrl: '', category: 'জাতীয়', journalistName: '', location: '' });
    setReporterForm({ name: '', designation: '', imageUrl: '', location: '', division: 'ঢাকা', phone: '', email: '', canPostNews: true, pin: '1234' });
    setMediaForm({ title: '', imageUrl: '', type: 'image', videoUrl: '' });
    setAdForm({ title: '', imageUrl: '', link: '', position: 'sidebar', active: true });
    setScheduleForm({ time: '', title: '', active: false, order: 0 });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, confirmDelete.collection, confirmDelete.id));
      showNotification('সফলভাবে ডিলিট করা হয়েছে!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${confirmDelete.collection}/${confirmDelete.id}`);
      showNotification('ডিলিট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const migrateImagesToStorage = async () => {
    if (!user) {
      showNotification('ডাটা ট্রান্সফার ইউটিলিটি ব্যবহার করতে অনুগ্রহ করে গুগল দিয়ে লগইন করুন।', 'error');
      return;
    }
    if (!confirm('আপনি কি নিশ্চিত যে আপনি সব ছবি ফায়ারবেস স্টোরেজে স্থানান্তর করতে চান? এই প্রক্রিয়াটি কিছুক্ষণ সময় নিতে পারে।')) return;
    
    setIsMigrating(true);
    const totalItems = newsList.length + reporters.length + mediaList.length + adsList.length;
    let completedCount = 0;
    
    setMigrationStats({ total: totalItems, completed: 0, currentItem: 'Starting...' });

    const migrateCollection = async (list: any[], collectionName: string) => {
      for (const item of list) {
        setMigrationStats(prev => ({ ...prev, currentItem: `${collectionName}: ${item.title || item.name || item.id}` }));
        
        const imageUrl = item.imageUrl;
        // Check if it's already in storage
        if (imageUrl && !imageUrl.includes('firebasestorage.googleapis.com')) {
          try {
            // Fetch image
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Fetch failed');
            const blob = await response.blob();
            const file = new File([blob], `migrated_${Date.now()}.jpg`, { type: blob.type });
            
            // Upload to storage
            const storagePath = collectionName === 'news' ? 'news' : collectionName === 'reporters' ? 'reporters' : collectionName === 'media' ? 'media' : 'ads';
            const newUrl = await uploadFile(file, storagePath);
            
            // Update firestore
            await updateDoc(doc(db, collectionName, item.id), {
              imageUrl: newUrl,
              migratedAt: serverTimestamp()
            });
          } catch (error) {
            console.error(`Migration error for ${item.id}: `, error);
          }
        }
        completedCount++;
        setMigrationStats(prev => ({ ...prev, completed: completedCount }));
      }
    };

    try {
      await migrateCollection(newsList, 'news');
      await migrateCollection(reporters, 'reporters');
      await migrateCollection(mediaList, 'media');
      await migrateCollection(adsList, 'ads');
      showNotification('সব ছবি সফলভাবে স্থানান্তর করা হয়েছে!');
    } catch (error) {
      console.error("Migration failed: ", error);
      showNotification('ডাটা স্থানান্তরের সময় ত্রুটি ঘটেছে। কিছু ছবির ক্ষেত্রে ওরিজিনাল সাইটের সিকিউরিটি বা CORS ইস্যু থাকতে পারে।', 'error');
    } finally {
      setIsMigrating(false);
      setMigrationStats({ total: 0, completed: 0, currentItem: '' });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen font-eng">অ্যাডমিন প্যানেল লোড হচ্ছে...</div>;

  if (!isLocalAdmin && (!user || user.email !== 'info.samitv.bd@gmail.com')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sami-dark to-slate-900 p-4 relative overflow-hidden font-sans">
        {/* Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-sami-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sami-red/5 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10 border border-slate-100/80"
        >
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <SAMILogo className="scale-105 mb-2 mx-auto" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-3">
              অ্যাডমিন পোর্টাল
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-1">
              ওয়েবসাইট ব্যবস্থাপনা ও সেটিংস নিয়ন্ত্রণ করুন
            </p>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block ml-0.5">
                অ্যাডমিন ইউজারনেম
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={loginInput.username}
                  onChange={(e) => setLoginInput({...loginInput, username: e.target.value})}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 outline-none focus:border-sami-red focus:ring-2 focus:ring-sami-red/10 transition-all font-bold text-sm bg-slate-50/60 focus:bg-white text-slate-900"
                  placeholder="ইউজারনেম (samitv)"
                />
                <User size={18} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block ml-0.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={loginInput.password}
                  onChange={(e) => setLoginInput({...loginInput, password: e.target.value})}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 outline-none focus:border-sami-red focus:ring-2 focus:ring-sami-red/10 transition-all font-bold text-sm bg-slate-50/60 focus:bg-white text-slate-900 font-mono"
                  placeholder="পাসওয়ার্ড"
                />
                <Lock size={18} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-red-600 text-xs font-bold">{loginError}</p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
            >
              <LogIn size={18} />
              <span>অ্যাডমিন প্যানেলে লগইন করুন</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-bold tracking-widest text-[9px]">অথবা</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-100 text-gray-700 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-all text-xs active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              গুগল অ্যাকাউন্ট দিয়ে প্রবেশ
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 font-sans text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              &copy; {new Date().getFullYear()} সামি মাল্টিমিডিয়া লিমিটেড
            </p>
            <p className="text-[11px] text-sami-red font-black uppercase tracking-tighter">
              SAMI TV মোবাইল রিপোর্টিং প্যানেল
            </p>
          </div>
        </motion.div>

        {/* Application Modal Popup */}
        <AnimatePresence>
          {showApplicationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl"
              >
                <JournalistApplicationForm onClose={() => setShowApplicationModal(false)} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-3.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-sami-red rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">STV</div>
          <div>
            <h1 className="font-black text-xs uppercase tracking-tight text-white">
              {userRole === 'journalist' ? 'সাংবাদিক প্যানেল' : 'SAMI TV CMS'}
            </h1>
            <p className="text-[9px] text-sami-red font-bold uppercase">
              {userRole === 'journalist' ? `${journalistName || 'সাংবাদিক'} - সংবাদ প্রকাশ` : 'অ্যাডমিন প্যানেল'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-800 rounded-xl text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <Menu size={18} />
          <span>মেন্যু</span>
        </button>
      </div>

      {/* Mobile Horizontal Quick Tab Bar */}
      <div className="md:hidden bg-white border-b border-slate-200/90 px-2.5 py-2 overflow-x-auto flex items-center gap-1.5 z-40 sticky top-[57px] shadow-xs">
        {userRole === 'journalist' ? (
          <div className="flex items-center justify-between w-full text-xs font-extrabold px-1">
            <div className="flex items-center gap-2 text-sami-red">
              <span className="w-2 h-2 rounded-full bg-sami-red animate-ping"></span>
              <span>সাংবাদিক মোড: শুধু সংবাদ প্রকাশ করা যাবে</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('news');
                setMobileNewsTab(mobileNewsTab === 'form' ? 'list' : 'form');
              }}
              className="px-3 py-1 bg-sami-red text-white rounded-lg font-bold text-[11px]"
            >
              {mobileNewsTab === 'form' ? 'সংবাদ তালিকা' : '+ নতুন সংবাদ'}
            </button>
          </div>
        ) : (
          [
            { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: Layout },
            { id: 'news', label: 'নিউজ পোস্ট', icon: Send },
            { id: 'reporters', label: 'রিপোর্টার্স', icon: Users },
            { id: 'media', label: 'মিডিয়া', icon: Film },
            { id: 'ticker', label: 'টিকার', icon: MessageSquare },
            { id: 'schedule', label: 'সূচী', icon: Calendar },
            { id: 'ads', label: 'বিজ্ঞাপন', icon: ImageIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as AdminTab);
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-sami-red text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
            </button>
          ))
        )}
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-900 text-white flex flex-col sticky top-0 md:h-screen z-50 shrink-0 border-r border-slate-800`}>
        <div className="p-5 border-b border-slate-800 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sami-red rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-sami-red/20 ring-2 ring-white/10">S</div>
            <div>
              <h1 className="font-black text-sm uppercase tracking-tight text-white">
                SAMI CMS
              </h1>
              <p className="text-[9px] text-sami-red font-bold uppercase tracking-widest">
                v2.0 Professional
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3.5 space-y-1.5 font-sans">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3 pt-2 pb-1">
            প্রধান কন্ট্রোল
          </div>
          {[
            { id: 'dashboard', icon: Layout, label: 'ড্যাশবোর্ড' },
            { id: 'news', icon: Send, label: 'নিউজ ম্যানেজমেন্ট' },
            { id: 'reporters', icon: Users, label: 'আমাদের পরিবার (রিপোর্টার)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as AdminTab);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-sami-red text-white shadow-md shadow-sami-red/20 scale-[1.01]' 
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <item.icon size={17} className={activeTab === item.id ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1">
            মিডিয়া ও পেজ কন্টেন্ট
          </div>
          {[
            { id: 'media', icon: Film, label: 'মিডিয়া গ্যালারি' },
            { id: 'ticker', icon: MessageSquare, label: 'নিউজ টিকার' },
            { id: 'schedule', icon: Calendar, label: 'অনুষ্ঠান সূচী' },
            { id: 'ads', icon: ImageIcon, label: 'বিজ্ঞাপন বক্সেস' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as AdminTab);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-sami-red text-white shadow-md shadow-sami-red/20 scale-[1.01]' 
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <item.icon size={17} className={activeTab === item.id ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1">
            বার্তা ও সিস্টেম
          </div>
          {[
            { id: 'applications', icon: Users, label: 'চাকরির আবেদন' },
            { id: 'messages', icon: MessageSquare, label: 'মেসেজ বক্স' },
            { id: 'migration', icon: Upload, label: 'ডাটা মাইগ্রেশন' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as AdminTab);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-sami-red text-white shadow-md shadow-sami-red/20 scale-[1.01]' 
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <item.icon size={17} className={activeTab === item.id ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3.5 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/60 rounded-xl p-2.5 flex items-center gap-3 border border-slate-700/50">
             <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                <User size={16} className="text-slate-300" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  সুপার অ্যাডমিন
                </p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-sami-red hover:text-white rounded-xl font-bold text-xs transition-all border border-red-500/20 cursor-pointer"
          >
            <LogOut size={15} /> লগআউট করুন
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
             <span className="text-xs text-slate-400 font-bold hidden sm:inline">
               অ্যাডমিন /
             </span>
             <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
               {activeTab === 'dashboard' && 'অ্যাডমিন ড্যাশবোর্ড ওভারভিউ'}
               {activeTab === 'news' && 'নিউজ পোস্ট ও এডিটিং'}
               {activeTab === 'reporters' && 'রিপোর্টার প্যানেল'}
               {activeTab === 'media' && 'মিডিয়া ফাইল ও ছবি গ্যালারি'}
               {activeTab === 'ticker' && 'লাইব নিউজ টিকার এডিটর'}
               {activeTab === 'schedule' && 'লাইভ অনুষ্ঠান সূচী'}
               {activeTab === 'ads' && 'ওয়েবসাইট অ্যাডভার্টাইজমেন্ট'}
               {activeTab === 'applications' && 'চাকরির আবেদনপত্র সমূহ'}
               {activeTab === 'messages' && 'ইউজারদের সরাসরি মেসেজ'}
               {activeTab === 'migration' && 'ক্লাউড ডাটা মাইগ্রেশন'}
             </h2>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
             <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-extrabold text-slate-800">{new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-[10px] text-slate-400 font-bold">সামি টিভি মাল্টিমিডিয়া</p>
             </div>
             <div className="hidden sm:block w-px h-7 bg-slate-200"></div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>সিস্টেম লাইভ</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            
            {/* Quick Action Buttons Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                দ্রুত অ্যাকশন বাটন
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveTab('news')}
                  className="flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-sami-red hover:text-white text-sami-red border border-red-200/80 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Send size={15} />
                  <span>+ নতুন নিউজ লিখুন</span>
                </button>

                <button
                  onClick={() => setActiveTab('reporters')}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200/80 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Users size={15} />
                  <span>+ রিপোর্টার যোগ করুন</span>
                </button>

                <button
                  onClick={() => setActiveTab('ticker')}
                  className="flex items-center justify-center gap-2 p-3 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 border border-amber-200/80 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <MessageSquare size={15} />
                  <span>ব্রেকিং টিকার আপডেট</span>
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className="flex items-center justify-center gap-2 p-3 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 border border-purple-200/80 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Film size={15} />
                  <span>মিডিয়া গ্যালারি</span>
                </button>
              </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'মোট প্রকাশিত নিউজ', value: stats.news, icon: Layout, bg: 'bg-red-50 text-sami-red border-red-100' },
                { label: 'মোট নিবন্ধিত রিপোর্টার', value: stats.reporters, icon: Users, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { label: 'মিডিয়া গ্যালারি ফাইল', value: stats.media, icon: Film, bg: 'bg-violet-50 text-violet-600 border-violet-100' },
                { label: 'বিজ্ঞাপন স্লট', value: stats.ads, icon: ImageIcon, bg: 'bg-amber-50 text-amber-600 border-amber-100' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${stat.bg}`}>
                    <stat.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-bold mb-0.5">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent News & Reporters Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent News Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Send size={18} className="text-sami-red" />
                    সাম্প্রতিক সময় প্রকাশিত নিউজ (সর্বশেষ ৫টি)
                  </h3>
                  <button onClick={() => setActiveTab('news')} className="text-sami-red hover:underline font-bold text-xs">
                    সব দেখুন →
                  </button>
                </div>

                <div className="space-y-3">
                  {newsList.slice(0, 5).map(news => (
                    <div key={news.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all">
                      <img src={news.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate text-xs mb-0.5">{news.title}</p>
                        <span className="text-[10px] font-extrabold bg-red-50 text-sami-red px-2 py-0.5 rounded-md">
                          {categoryMap[news.category] || news.category}
                        </span>
                      </div>
                    </div>
                  ))}
                  {newsList.length === 0 && (
                    <p className="text-xs text-slate-400 font-bold text-center py-6">কোন নিউজ পাওয়া যায়নি</p>
                  )}
                </div>
              </div>

              {/* Recent Reporters Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Users size={18} className="text-sami-red" />
                    আমাদের পরিবার (রিপোর্টার্স)
                  </h3>
                  <button onClick={() => setActiveTab('reporters')} className="text-sami-red hover:underline font-bold text-xs">
                    সব দেখুন →
                  </button>
                </div>

                <div className="space-y-3">
                  {reporters.slice(0, 5).map(rep => (
                    <div key={rep.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all">
                      <img src={rep.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-xs">{rep.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{rep.designation} • {rep.location}</p>
                      </div>
                    </div>
                  ))}
                  {reporters.length === 0 && (
                    <p className="text-xs text-slate-400 font-bold text-center py-6">কোন রিপোর্টার যুক্ত করা হয়নি</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div>
            {/* Mobile Segment Switcher for News */}
            {activeTab === 'news' && (
              <div className="lg:hidden flex bg-slate-200/90 p-1 rounded-2xl mb-4 border border-slate-300/60 shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileNewsTab('form')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mobileNewsTab === 'form' 
                      ? 'bg-sami-red text-white shadow-sm' 
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Plus size={16} />
                  <span>{editingId ? 'নিউজ এডিট' : 'নতুন নিউজ পোস্ট'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileNewsTab('list')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mobileNewsTab === 'list' 
                      ? 'bg-sami-red text-white shadow-sm' 
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Send size={16} />
                  <span>প্রকাশিত খবর ({newsList.length})</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column: Forms */}
            <div className={`lg:col-span-1 ${activeTab === 'news' && mobileNewsTab !== 'form' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
              {activeTab === 'news' && (
                <>
                  <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-red-50 text-sami-red rounded-xl border border-red-100">
                        {editingId ? <Edit size={18} className="text-amber-600" /> : <Plus size={18} />}
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {editingId ? 'নিউজ এডিট করুন' : 'নতুন নিউজ পোস্ট করুন'}
                        </h2>
                        <p className="text-[11px] text-slate-500 font-bold mt-0.5">সব তথ্য ঠিকমত দিয়ে পাবলিশ বাটন চাপুন</p>
                      </div>
                    </div>
                    {editingId && (
                      <button 
                        onClick={cancelEditing} 
                        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        <XCircle size={15} />
                        <span>বাতিল</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    {/* News Title */}
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold text-slate-800">
                        নিউজের শিরোনাম <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={newsForm.title} 
                        onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sami-red focus:ring-2 focus:ring-red-100 outline-none text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all shadow-2xs" 
                        placeholder="যেমন: জামালপুরে নতুন উন্নয়ন প্রকল্পের উদ্বোধন..." 
                      />
                    </div>

                    {/* Metadata Grid: Category, Journalist, Location */}
                    <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                      {/* Category Selection */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-800 mb-1">
                          ক্যাটেগরি নির্বাচন <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={newsForm.category} 
                          onChange={(e) => setNewsForm({...newsForm, category: e.target.value})} 
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-xs font-bold text-slate-800 bg-white transition-all cursor-pointer shadow-2xs"
                        >
                          {categories.map(cat => <option key={cat} value={cat}>{categoryMap[cat] || cat}</option>)}
                        </select>
                      </div>

                      {/* Journalist & Location Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-extrabold text-slate-800">
                              প্রতিবেদক / সাংবাদিক <span className="text-red-500">*</span>
                            </label>
                            {reporters.length > 0 && (
                              <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                                {reporters.length} জন পরিবারে
                              </span>
                            )}
                          </div>

                          {/* Unified Reporter Selector / Free Entry */}
                          <div className="space-y-1.5">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const selectedRep = reporters.find(r => r.name === e.target.value);
                                  setNewsForm(prev => ({
                                    ...prev,
                                    journalistName: e.target.value,
                                    location: selectedRep?.location ? selectedRep.location : prev.location
                                  }));
                                }
                              }}
                              value={reporters.some(r => r.name === newsForm.journalistName) ? newsForm.journalistName : ""}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-sami-red transition-all cursor-pointer outline-none shadow-2xs"
                            >
                              <option value="">-- তালিকায় বাছুন অথবা নিচে লিখুন --</option>
                              <optgroup label="সাধারণ পদবী">
                                <option value="নিজস্ব প্রতিবেদক">নিজস্ব প্রতিবেদক</option>
                                <option value="বিশেষ প্রতিনিধি">বিশেষ প্রতিনিধি</option>
                                <option value="স্টাফ রিপোর্টার">স্টাফ রিপোর্টার</option>
                                <option value="জেলা প্রতিনিধি">জেলা প্রতিনিধি</option>
                              </optgroup>
                              {reporters.length > 0 && (
                                <optgroup label="আমাদের পরিবার (নিবন্ধিত সাংবাদিক)">
                                  {reporters.map((rep) => (
                                    <option key={rep.id} value={rep.name}>
                                      👤 {rep.name} {rep.designation ? `(${rep.designation})` : ''}
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                            </select>

                            <input 
                              type="text" 
                              required 
                              value={newsForm.journalistName} 
                              onChange={(e) => setNewsForm({...newsForm, journalistName: e.target.value})} 
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 bg-white transition-all" 
                              placeholder="অথবা নাম লিখুন (যেমন: আব্দুর রহিম)" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-800 mb-1">
                            স্থান / অবস্থান <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            required 
                            value={newsForm.location} 
                            onChange={(e) => setNewsForm({...newsForm, location: e.target.value})} 
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sami-red outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 bg-white transition-all shadow-2xs" 
                            placeholder="যেমন: জামালপুর" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Attachment Card */}
                    <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-800">
                          ছবি সংযুক্ত করুন
                        </label>
                        <span className="text-[10px] font-bold text-slate-400">ঐচ্ছিক</span>
                      </div>

                      <div className="flex gap-1 p-1 bg-slate-200/70 rounded-xl">
                        <button 
                          type="button" 
                          onClick={() => setNewsUploadMode('file')} 
                          className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${newsUploadMode === 'file' ? 'bg-white text-sami-red shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          📱 গ্যালাড়ী / ডিভাইস
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setNewsUploadMode('url')} 
                          className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${newsUploadMode === 'url' ? 'bg-white text-sami-red shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          🔗 ওয়েব লিঙ্ক
                        </button>
                      </div>

                      {newsUploadMode === 'url' ? (
                        <input 
                          type="url" 
                          required={!newsForm.imageUrl} 
                          value={newsForm.imageUrl} 
                          onChange={(e) => setNewsForm({...newsForm, imageUrl: e.target.value})} 
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white text-xs font-bold text-slate-800 placeholder:text-slate-400" 
                          placeholder="https://example.com/image.jpg" 
                        />
                      ) : (
                        <input 
                          type="file" 
                          accept="image/*" 
                          required={!newsForm.imageUrl && !newsImageFile}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setNewsImageFile(file);
                          }} 
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 outline-none bg-white text-xs cursor-pointer font-bold text-slate-700" 
                        />
                      )}

                      {/* Image Preview */}
                      {(newsForm.imageUrl || newsImageFile) && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-300 h-28 bg-slate-900 group shadow-2xs mt-2">
                          <img 
                            src={newsImageFile ? URL.createObjectURL(newsImageFile) : newsForm.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-between px-3 text-white">
                            <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                              ✓ ছবি যুক্ত হয়েছে
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewsForm({ ...newsForm, imageUrl: '' });
                                setNewsImageFile(null);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors shadow-md cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* News Content */}
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold text-slate-800">
                        নিউজের বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required 
                        rows={6} 
                        value={newsForm.content} 
                        onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sami-red focus:ring-2 focus:ring-red-100 outline-none text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all resize-none leading-relaxed font-medium shadow-2xs" 
                        placeholder="এখানে নিউজের বিস্তারিত বিষয়বস্তু লিখুন..." 
                      />
                    </div>
                    
                    {uploadProgress > 0 && (
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-sami-red"
                        />
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full bg-sami-red text-white py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      <Send size={16} /> 
                      <span>{isSubmitting ? 'আপলোড হচ্ছে...' : (editingId ? 'নিউজ আপডেট করুন' : 'নিউজ পাবলিশ করুন')}</span>
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'reporters' && (
                <>
                  <div className="flex items-center justify-between mb-6 font-eng">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-red" />}
                      {editingId ? 'রিপোর্টার আপডেট করুন' : 'নতুন রিপোর্টার'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleReporterSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={reporterForm.name} onChange={(e) => setReporterForm({...reporterForm, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="নাম" />
                    <input type="text" required value={reporterForm.designation} onChange={(e) => setReporterForm({...reporterForm, designation: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="পদবী" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" required value={reporterForm.location} onChange={(e) => setReporterForm({...reporterForm, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="কর্মস্থল" />
                      <select value={reporterForm.division} onChange={(e) => setReporterForm({...reporterForm, division: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                        {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setReporterUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${reporterUploadMode === 'file' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-600'}`}>💻📱 কম্পিউটার/মোবাইল থেকে আপলোড</button>
                        <button type="button" onClick={() => setReporterUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${reporterUploadMode === 'url' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-600'}`}>🔗 অনলাইন লিঙ্ক (URL)</button>
                      </div>
                      {reporterUploadMode === 'url' ? (
                        <input type="url" required value={reporterForm.imageUrl} onChange={(e) => setReporterForm({...reporterForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ছবির ইউআরএল" />
                      ) : (
                        <input 
                          type="file" 
                          required 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setReporterImageFile(file);
                            if (file) setReporterUploadMode('file');
                          }} 
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" 
                        />
                      )}
                    </div>

                    <input type="text" value={reporterForm.phone} onChange={(e) => setReporterForm({...reporterForm, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng text-xs" placeholder="ফোন নম্বর (ঐচ্ছিক)" />
                    <input type="email" value={reporterForm.email} onChange={(e) => setReporterForm({...reporterForm, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng text-xs" placeholder="ইমেইল (ঐচ্ছিক)" />
                    
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <ShieldCheck size={16} className="text-emerald-600" />
                          <span>সংবাদ প্রকাশের অনুমতি (Admin Permission)</span>
                        </label>
                        <select
                          value={reporterForm.canPostNews ? 'true' : 'false'}
                          onChange={(e) => setReporterForm({...reporterForm, canPostNews: e.target.value === 'true'})}
                          className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-bold outline-none cursor-pointer bg-white"
                        >
                          <option value="true">অনুমোদিত (Allowed)</option>
                          <option value="false">স্থগিত (Denied)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          সাংবাদিক সিক্রেট পিন / পাসওয়ার্ড (ঐচ্ছিক)
                        </label>
                        <input 
                          type="text" 
                          value={reporterForm.pin} 
                          onChange={(e) => setReporterForm({...reporterForm, pin: e.target.value})} 
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none font-mono text-xs font-bold bg-white" 
                          placeholder="যেমন: 1234" 
                        />
                      </div>
                    </div>
                    
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-sami-red"
                        />
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? 'প্রসেসিং...' : (editingId ? 'রিপোর্টার আপডেট করুন' : 'রিপোর্টার যুক্ত করুন')}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'media' && (
                <>
                  <div className="flex items-center justify-between mb-1 font-eng">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-red" />}
                      {editingId ? 'মিডিয়া আপডেট করুন' : 'নতুন মিডিয়া'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mb-6 font-eng font-bold uppercase tracking-widest">আপলোড করা ছবি এবং ভিডিও সরাসরি "মিডিয়া" পেজে দেখা যাবে।</p>
                  <form onSubmit={handleMediaSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={mediaForm.title} onChange={(e) => setMediaForm({...mediaForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="শিরোনাম" />
                    <select value={mediaForm.type} onChange={(e) => setMediaForm({...mediaForm, type: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      <option value="image">ছবি (Image)</option>
                      <option value="video">ভিডিও (Video)</option>
                    </select>
                    
                    <div className="space-y-2">
                       <div className="flex gap-2">
                         <button type="button" onClick={() => setMediaUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${mediaUploadMode === 'file' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-600'}`}>💻📱 কম্পিউটার/মোবাইল থেকে আপলোড</button>
                         <button type="button" onClick={() => setMediaUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${mediaUploadMode === 'url' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-600'}`}>🔗 অনলাইন লিঙ্ক (URL)</button>
                       </div>
                       {mediaUploadMode === 'url' ? (
                         <input type="url" required value={mediaForm.imageUrl} onChange={(e) => setMediaForm({...mediaForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="থাম্বনেইল ছবির ইউআরএল" />
                       ) : (
                         <input 
                          type="file" 
                          required 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setMediaImageFile(file);
                            if (file) setMediaUploadMode('file');
                          }} 
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" 
                        />
                       )}
                    </div>

                    {mediaForm.type === 'video' && (
                      <input type="url" required value={mediaForm.videoUrl} onChange={(e) => setMediaForm({...mediaForm, videoUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng" placeholder="ভিডিও ইউআরএল (ইউটিউব/সরাসরি লিঙ্ক)" />
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? 'প্রসেসিং...' : (editingId ? 'মিডিয়া আপডেট করুন' : 'মিডিয়া আপলোড করুন')}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'ticker' && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-eng font-bold"><MessageSquare size={20} className="text-sami-red" /> এডিট নিউজ টিকার</h2>
                  <div className="space-y-4 font-eng">
                    <textarea rows={4} value={tickerText} onChange={(e) => setTickerText(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none resize-none" placeholder="ব্র্রেকিং নিউজের টেক্সট লিখুন..." />
                    <button onClick={handleTickerUpdate} disabled={isUpdatingTicker} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Save size={18} /> {isUpdatingTicker ? 'আপডেট হচ্ছে...' : 'টিকার আপডেট করুন'}
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'ads' && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-eng"><Plus size={20} className="text-sami-red" /> নতুন বিজ্ঞাপন</h2>
                  <form onSubmit={handleAdSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={adForm.title} onChange={(e) => setAdForm({...adForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="বিজ্ঞাপনের শিরোনাম" />
                    <input type="url" value={adForm.link} onChange={(e) => setAdForm({...adForm, link: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="লিঙ্ক (ঐচ্ছিক)" />
                    
                    <select value={adForm.position} onChange={(e) => setAdForm({...adForm, position: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                      <option value="sidebar">সাইডবার (Sidebar)</option>
                      <option value="content">নিউজের ভিতরে (Content)</option>
                      <option value="popup">পপআপ (Popup)</option>
                    </select>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setAdUploadMode('file')} className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${adUploadMode === 'file' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-600'}`}>💻📱 কম্পিউটার/মোবাইল থেকে আপলোড</button>
                        <button type="button" onClick={() => setAdUploadMode('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${adUploadMode === 'url' ? 'bg-sami-red text-white' : 'bg-gray-50 text-gray-600'}`}>🔗 অনলাইন লিঙ্ক (URL)</button>
                      </div>
                      {adUploadMode === 'url' ? (
                        <input type="url" required value={adForm.imageUrl} onChange={(e) => setAdForm({...adForm, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ব্যানার ছবির ইউআরএল" />
                      ) : (
                        <input 
                          type="file" 
                          required 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setAdImageFile(file);
                            if (file) setAdUploadMode('file');
                          }} 
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" 
                        />
                      )}
                    </div>

                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-sami-red"
                        />
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Send size={18} /> {isSubmitting ? (uploadProgress > 0 ? `আপলোড হচ্ছে ${Math.round(uploadProgress)}%` : 'প্রসেসিং...') : (editingId ? 'বিজ্ঞাপন আপডেট করুন' : 'বিজ্ঞাপন পাবলিশ করুন')}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'schedule' && (
                <>
                  <div className="flex items-center justify-between mb-6 font-eng">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-sami-red" />}
                      {editingId ? 'প্রোগ্রাম আপডেট করুন' : 'নতুন প্রোগ্রাম'}
                    </h2>
                    {editingId && (
                      <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleScheduleSubmit} className="space-y-4 font-eng">
                    <input type="text" required value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none font-eng" placeholder="সময় (যেমন: ০৯:০০ সকাল)" />
                    <input type="text" required value={scheduleForm.title} onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="প্রোগ্রামের শিরোনাম" />
                    <input type="number" required value={scheduleForm.order} onChange={(e) => setScheduleForm({...scheduleForm, order: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="ক্রমিক নম্বর (Sort Order)" />
                    
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input type="checkbox" checked={scheduleForm.active} onChange={(e) => setScheduleForm({...scheduleForm, active: e.target.checked})} className="w-5 h-5 accent-sami-red" />
                      <span className="font-bold text-gray-700">এখন চলছে? (LIVE NOW)</span>
                    </label>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sami-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sami-dark transition-all disabled:opacity-50">
                      <Save size={18} /> {isSubmitting ? 'প্রসেসিং...' : (editingId ? 'প্রোগ্রাম আপডেট করুন' : 'সূচীতে যুক্ত করুন')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Lists */}
          <div className={`lg:col-span-2 ${activeTab === 'news' && mobileNewsTab !== 'list' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[600px] font-eng">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Layout size={20} className="text-sami-red" /> 
                  <span className="uppercase tracking-tight text-gray-900">
                    {activeTab === 'news' && 'আপলোড করা নিউজ লিস্ট'}
                    {activeTab === 'reporters' && 'রিপোর্টার লিস্ট'}
                    {activeTab === 'media' && 'মিডিয়া গ্যালারি'}
                    {activeTab === 'ticker' && 'বর্তমান ব্রেকিং নিউজ'}
                    {activeTab === 'schedule' && 'লাইভ অনুষ্ঠান সূচী'}
                    {activeTab === 'ads' && 'বিজ্ঞাপন স্লট'}
                    {activeTab === 'applications' && 'চাকরির আবেদন সমূহ'}
                    {activeTab === 'messages' && 'ইউজার মেসেজ বক্স'}
                  </span>
                </h2>

              <div className="space-y-4">
                {activeTab === 'news' && (
                  <div className="space-y-3">
                    {newsList.map((news) => (
                      <div key={news.id} className="flex flex-col sm:flex-row gap-3 p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm bg-white transition-all group">
                        <img 
                          src={news.imageUrl} 
                          alt="" 
                          className="w-full sm:w-28 h-32 sm:h-20 shrink-0 rounded-xl object-cover border border-slate-200" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[10px] font-extrabold bg-red-50 text-sami-red border border-red-100 px-2.5 py-0.5 rounded-md">
                                {categoryMap[news.category] || news.category}
                              </span>
                              {news.journalistName && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  ✍️ {news.journalistName} ({news.location})
                                </span>
                              )}
                            </div>
                            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 leading-snug group-hover:text-sami-red transition-colors">
                              {news.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                              {news.content}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <button 
                            onClick={() => startEditing(news, 'news')} 
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-all font-bold text-xs cursor-pointer"
                          >
                            <Edit size={14} />
                            <span>এডিট</span>
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ collection: 'news', id: news.id })} 
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-xl transition-all font-bold text-xs cursor-pointer"
                          >
                            <Trash2 size={14} />
                            <span>ডিলিট</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {newsList.length === 0 && (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Send size={28} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-xs font-bold text-slate-500">এখনো কোনো নিউজ পোস্ট করা হয়নি</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reporters' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                          <ShieldCheck size={16} className="text-blue-600" />
                          <span>সাংবাদিক নিউজ পোস্টের অনুমতি নিয়ন্ত্রণ</span>
                        </h4>
                        <p className="text-[11px] text-blue-700 font-bold mt-0.5">
                          শুধুমাত্র যেসব সাংবাদিককে আপনি 'অনুমোদিত' করে রাখবেন, কেবল তারাই নিউজ পোস্ট করতে পারবেন।
                        </p>
                      </div>
                    </div>

                    {reporters.map((reporter) => (
                      <div key={reporter.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/80 transition-all bg-white group">
                        <img src={reporter.imageUrl} alt="" className="w-16 h-16 shrink-0 rounded-2xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {reporter.canPostNews !== false ? (
                              <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                <ShieldCheck size={12} className="text-emerald-600" />
                                সংবাদ পোস্টের অনুমতি আছে (Allowed)
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                <XCircle size={12} className="text-red-600" />
                                সংবাদ পোস্ট স্থগিত (Permission Revoked)
                              </span>
                            )}
                            {reporter.pin && (
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                🔑 পিন: {reporter.pin}
                              </span>
                            )}
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-sm">{reporter.name}</h3>
                          <p className="text-xs text-sami-red font-bold">{reporter.designation}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{reporter.location} | {divisionMap[reporter.division] || reporter.division}</p>
                          {reporter.phone && <p className="text-[11px] text-slate-400 font-mono mt-0.5">📞 {reporter.phone}</p>}
                        </div>

                        <div className="flex sm:flex-col items-center justify-end sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                          <button
                            type="button"
                            onClick={async () => {
                              const newStatus = reporter.canPostNews === false;
                              await updateDoc(doc(db, 'reporters', reporter.id), { canPostNews: newStatus });
                              showNotification(
                                newStatus 
                                  ? `${reporter.name}-কে সংবাদ প্রকাশের অনুমতি দেওয়া হয়েছে!` 
                                  : `${reporter.name}-এর সংবাদ প্রকাশের অনুমতি বন্ধ করা হয়েছে!`,
                                newStatus ? 'success' : 'error'
                              );
                            }}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all font-bold text-xs cursor-pointer ${
                              reporter.canPostNews === false
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            <ShieldCheck size={14} />
                            <span>{reporter.canPostNews === false ? 'অনুমতি দিন' : 'অনুমতি বন্ধ করুন'}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => startEditing(reporter, 'reporters')} 
                              className="flex items-center gap-1 px-2.5 py-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all font-bold text-xs cursor-pointer"
                            >
                              <Edit size={14} />
                              <span>এডিট</span>
                            </button>
                            <button 
                              onClick={() => setConfirmDelete({ collection: 'reporters', id: reporter.id })} 
                              className="flex items-center gap-1 px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all font-bold text-xs cursor-pointer"
                            >
                              <Trash2 size={14} />
                              <span>ডিলিট</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {reporters.length === 0 && (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Users size={28} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-xs font-bold text-slate-500">এখনো কোনো রিপোর্টার যুক্ত করা হয়নি। বামদিকের ফর্ম থেকে নতুন রিপোর্টার যোগ করুন।</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'media' && mediaList.map((media) => (
                  <div key={media.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                    <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                      <img src={media.imageUrl} alt="" className="w-full h-full object-cover" />
                      {media.type === 'video' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"><Film size={16} /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{media.title}</h3>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider font-eng">{media.type === 'image' ? 'ছবি' : 'ভিডিও'}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 font-eng">
                      <button 
                        onClick={() => startEditing(media, 'media')} 
                        className="flex items-center gap-1 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Edit size={14} />
                        <span>এডিট</span>
                      </button>
                      <button 
                        onClick={() => setConfirmDelete({ collection: 'media', id: media.id })} 
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs"
                      >
                        <Trash2 size={14} />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'ticker' && (
                  <div className="p-6 bg-sami-light rounded-2xl border border-sami-blue/20">
                    <p className="text-sami-dark font-medium italic">"{tickerText || 'কোন ব্রেকিং নিউজ নেই'}"</p>
                  </div>
                )}

                    {activeTab === 'ads' && adsList.map((ad) => (
                      <div key={ad.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                        <img src={ad.imageUrl} alt="" className="w-24 h-20 shrink-0 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-sami-blue/10 text-sami-blue px-2 py-0.5 rounded-full font-bold uppercase">{ad.position}</span>
                            {ad.active ? (
                              <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">সক্রিয়</span>
                            ) : (
                              <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">নিষ্ক্রিয়</span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 line-clamp-1 mt-1">{ad.title}</h3>
                          <p className="text-xs text-gray-500 truncate font-eng">{ad.link || 'কোন লিঙ্ক নেই'}</p>
                        </div>
                        <button 
                          onClick={() => setConfirmDelete({ collection: 'ads', id: ad.id })} 
                          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs shrink-0 font-eng"
                        >
                          <Trash2 size={16} />
                          <span>ডিলিট</span>
                        </button>
                      </div>
                    ))}

                    {activeTab === 'schedule' && scheduleList.map((prog) => (
                      <div key={prog.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group items-center">
                        <div className="w-16 text-xs font-black text-gray-400 font-eng">
                          {prog.time}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 font-eng">
                            <h3 className="font-bold text-gray-900">{prog.title}</h3>
                            {prog.active && <span className="text-[9px] bg-red-100 text-sami-red px-2 py-0.5 rounded-full font-black uppercase tracking-widest line-none h-fit">এখন চলছে</span>}
                          </div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 font-eng">ক্রমিক নম্বর: {prog.order}</p>
                        </div>
                        <div className="flex gap-2 font-eng">
                          <button 
                            onClick={() => startEditing(prog, 'schedule')} 
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                            title="এডিট"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ collection: 'schedules', id: prog.id })} 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="ডিলিট"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                {activeTab === 'applications' && (
                  <div className="space-y-4">
                    {applications.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Users size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-bold text-slate-500">বর্তমানে কোনো আবেদনের তথ্য পাওয়া যায়নি।</p>
                      </div>
                    )}

                    {applications.map((app) => (
                      <div key={app.id} className="p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all bg-white shadow-xs">
                        <div className="flex flex-col md:flex-row gap-6">
                          <img 
                            src={app.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                            alt={app.name} 
                            className="w-24 h-24 rounded-2xl object-cover shadow-md shrink-0 border border-slate-200" 
                          />
                          <div className="flex-1 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-black text-gray-900">{app.name}</h3>
                                <p className="text-xs font-bold text-sami-red">{app.designation || 'সাংবাদিক'}</p>
                              </div>
                              <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                                app.status === 'approved' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {app.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                              </span>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                              <p className="flex items-center gap-1.5"><Phone size={13} className="text-sami-red shrink-0" /> <span className="font-black text-slate-900">মোবাইল:</span> {app.phone}</p>
                              <p className="flex items-center gap-1.5"><Mail size={13} className="text-sami-red shrink-0" /> <span className="font-black text-slate-900">ইমেইল:</span> {app.email || 'নাই'}</p>
                              <p className="flex items-center gap-1.5"><Lock size={13} className="text-sami-red shrink-0" /> <span className="font-black text-slate-900">পাসওয়ার্ড:</span> {app.password || app.pin || '1234'}</p>
                              <p className="flex items-center gap-1.5"><FileText size={13} className="text-sami-red shrink-0" /> <span className="font-black text-slate-900">NID / জন্মসনদ:</span> {app.nid || 'নাই'}</p>
                              <p className="flex items-center gap-1.5"><GraduationCap size={13} className="text-sami-red shrink-0" /> <span className="font-black text-slate-900">শিক্ষাগত যোগ্যতা:</span> {app.education || 'নাই'}</p>
                              <p className="flex items-center gap-1.5"><Clock size={13} className="text-sami-red shrink-0" /> <span className="font-black text-slate-900">তারিখ:</span> {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString('bn-BD') : 'সম্প্রতি'}</p>
                            </div>

                            {/* Address details */}
                            <div className="text-xs text-slate-600 font-medium bg-red-50/40 p-2.5 rounded-lg border border-red-100/60">
                              <span className="font-black text-slate-900">বর্তমান ঠিকানা: </span>
                              {[
                                app.village && `গ্রাম: ${app.village}`,
                                app.union && `ইউনিয়ন: ${app.union}`,
                                app.upazila && `উপজেলা: ${app.upazila}`,
                                app.district && `জেলা: ${app.district}`
                              ].filter(Boolean).join(', ') || app.location || 'উল্লেখ্য নেই'}
                            </div>
                          </div>

                          <div className="flex md:flex-col gap-2 shrink-0 justify-center font-sans">
                            {app.status !== 'approved' && (
                              <button 
                                onClick={() => handleApproveApplication(app)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-all shadow-sm cursor-pointer"
                              >
                                <CheckCircle size={16} />
                                <span>অনুমোদন করুন</span>
                              </button>
                            )}
                            <button 
                              onClick={() => setConfirmDelete({ collection: 'applications', id: app.id })}
                              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-xs transition-all cursor-pointer"
                            >
                              <Trash2 size={16} />
                              <span>ডিলিট করুন</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-4 font-sans">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-2">
                      <div>
                        <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                          <MessageSquare size={18} className="text-sami-red" />
                          <span>দর্শকের বার্তা ও কনটেন্ট অনুরোধসমূহ</span>
                          <span className="bg-sami-red text-white text-xs px-2.5 py-0.5 rounded-full font-black">
                            {messages.length}
                          </span>
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          লাইভ টিভি এবং ওয়েবসাইট থেকে দর্শকদের প্রেরিত সকল বার্তা ও প্রোগ্রাম প্রস্তাবনা এখানে সংরক্ষিত রয়েছে।
                        </p>
                      </div>
                    </div>

                    {messages.length === 0 ? (
                      <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                        <MessageSquare size={36} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm font-bold text-gray-500">কোন বার্তা পাওয়া যায়নি</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isContentReq = msg.type === 'content_request' || msg.contentType || msg.subject?.includes('অনুরোধ');
                        return (
                          <div 
                            key={msg.id} 
                            className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                              isContentReq 
                                ? 'bg-red-50/30 border-red-200/80 hover:bg-red-50/60 shadow-xs' 
                                : 'bg-white border-gray-100 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg text-white shrink-0 ${
                                  isContentReq ? 'bg-sami-red' : 'bg-sami-blue'
                                }`}>
                                  {msg.name ? msg.name.charAt(0) : 'দ'}
                                </div>
                                <div>
                                  <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
                                    <span>{msg.name || 'সাধারণ দর্শক'}</span>
                                    {isContentReq && (
                                      <span className="bg-red-100 text-sami-red text-[10px] font-black px-2 py-0.5 rounded-md border border-red-200">
                                        📺 পছন্দের কনটেন্ট
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-[11px] text-gray-500 font-semibold">
                                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString('bn-BD') : 'সম্প্রতি'}
                                  </p>
                                </div>
                              </div>
                              <span className={`self-start text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                isContentReq 
                                  ? 'bg-red-600 text-white shadow-xs' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {msg.subject || 'মেসেজ'}
                              </span>
                            </div>

                            {msg.contentType && (
                              <div className="mb-3 p-2.5 rounded-xl bg-sami-red/10 border border-sami-red/20 text-xs font-black text-sami-red flex items-center gap-2">
                                <Tv size={14} />
                                <span>প্রস্তাবিত বিষয়বস্তু: {msg.contentType}</span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs font-semibold text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                              <p className="flex items-center gap-2">
                                <Phone size={14} className="text-sami-blue shrink-0" /> 
                                <span>যোগাযোগ: {msg.phone || 'দেওয়া হয়নি'}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail size={14} className="text-sami-blue shrink-0" /> 
                                <span>ইমেইল: {msg.email || 'দেওয়া হয়নি'}</span>
                              </p>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                            </div>

                            <div className="mt-3.5 flex justify-end">
                              <button 
                                onClick={() => setConfirmDelete({ collection: 'messages', id: msg.id })}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-xs border border-red-100 cursor-pointer"
                              >
                                <Trash2 size={15} /> ডিলিট করুন
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {activeTab === 'migration' && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center font-eng">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">ডাটা ট্রান্সফার ইউটিলিটি</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed font-bold uppercase tracking-widest text-[11px]">
                      নিউজ, রিপোর্টার এবং মিডিয়ার জন্য আগে আপলোড করা ছবিগুলো সরাসরি ফায়ারবেস স্টোরেজে স্থানান্তর করতে এই টুলটি ব্যবহার করুন। এটি আপনার ওয়েবসাইট লোড দ্রুত করতে সাহায্য করবে।
                    </p>

                    {isMigrating ? (
                      <div className="space-y-6">
                        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-sami-red h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(migrationStats.completed / migrationStats.total) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                          <span>প্রসেসিং: {migrationStats.completed} / {migrationStats.total}</span>
                          <span>{Math.round((migrationStats.completed / migrationStats.total) * 100)}%</span>
                        </div>
                        <p className="text-xs text-gray-400 italic truncate">
                          {migrationStats.currentItem}
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={migrateImagesToStorage}
                        className="bg-sami-red text-white px-10 py-4 rounded-2xl font-bold hover:bg-sami-dark transition-all shadow-lg shadow-sami-red/20 uppercase tracking-widest"
                      >
                        স্থানান্তর শুরু করুন
                      </button>
                    )}

                    <div className="mt-12 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-left">
                      <p className="text-xs text-yellow-700 font-bold flex items-center gap-2 font-eng uppercase tracking-widest">
                        <ShieldCheck size={14} /> নোট:
                      </p>
                      <p className="text-[10px] text-yellow-600 mt-1 font-eng font-bold uppercase tracking-widest">
                        কিছু ছবি (যেমন ব্লগার বা অন্য সাইট থেকে আনা) নিরাপত্তা নীতির কারণে স্থানান্তর নাও হতে পারে। সেক্ষেত্রে অনুগ্রহ করে সেই নিউজ আইটেমগুলো এডিট করে ম্যানুয়ালি ছবি আপলোড করুন।
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
        </div>
      </div>

      {/* Media Picker Modal */}
      <AnimatePresence>
        {showMediaPicker && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[150] p-4 font-eng">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sami-red/10 text-sami-red rounded-2xl flex items-center justify-center font-bold">
                    <Film size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">মিডিয়া গ্যালারি থেকে ছবি বেছে নিন</h3>
                    <p className="text-xs text-gray-500 font-bold">যে কোনো ছবির উপর ক্লিক করলে সেটি স্বয়ংক্রিয়ভাবে ফর্মে যুক্ত হবে</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMediaPicker(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grid of Images */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Upload New Image Direct Label */}
                <label className="border-2 border-dashed border-gray-300 hover:border-sami-red rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-red-50/40 transition-all group min-h-[140px]">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIsSubmitting(true);
                        try {
                          const uploadedUrl = await uploadFile(file, 'media');
                          try {
                            await addDoc(collection(db, 'media'), {
                              title: file.name.split('.')[0] || 'মিডিয়া গ্যালাারি ছবি',
                              imageUrl: uploadedUrl,
                              type: 'image',
                              createdAt: serverTimestamp()
                            });
                          } catch (fErr) {
                            console.log("Firestore media save notice:", fErr);
                          }
                          selectImageFromMedia(uploadedUrl);
                        } catch (err: any) {
                          showNotification('ছবি আপলোড করতে সমস্যা হয়েছে: ' + err.message, 'error');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }
                    }}
                  />
                  <div className="w-11 h-11 bg-sami-red/10 text-sami-red rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    <Upload size={22} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">নতুন ছবি আপলোড</span>
                  <span className="text-[10px] text-gray-400 mt-1 font-bold">ডিভাইস থেকে</span>
                </label>

                {/* Media Gallery items */}
                {mediaList.filter(m => m.imageUrl && (m.type === 'image' || !m.type)).map((item) => {
                  const isSelected = newsForm.imageUrl === item.imageUrl;

                  return (
                    <div 
                      key={item.id}
                      onClick={() => selectImageFromMedia(item.imageUrl)}
                      className={`relative group rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] bg-gray-100 ${isSelected ? 'border-sami-red ring-4 ring-sami-red/20 scale-[0.98]' : 'border-gray-200 hover:border-sami-red hover:shadow-lg'}`}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.title || 'Media photo'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <p className="text-white text-[11px] font-bold line-clamp-1">{item.title || 'মিডিয়া ফটো'}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-sami-red text-white p-1 rounded-full shadow-lg">
                          <ShieldCheck size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* News Images items */}
                {newsList.filter(n => n.imageUrl).map((item) => (
                  <div 
                    key={`news-${item.id}`}
                    onClick={() => selectImageFromMedia(item.imageUrl)}
                    className="relative group rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-sami-red cursor-pointer transition-all aspect-[4/3] bg-gray-100 hover:shadow-lg"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title || 'News image'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <p className="text-white text-[11px] font-bold line-clamp-1">{item.title}</p>
                    </div>
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                      নিউজ
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500 font-bold">মোট {mediaList.length + newsList.length} টি লভ্য ছবি</span>
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-[100] font-bold text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-eng uppercase tracking-tight">আপনি কি নিশ্চিত?</h3>
              <p className="text-gray-500 mb-8 font-eng font-bold uppercase tracking-widest text-xs">এই আইটেমটি স্থায়ীভাবে ডিলিট হয়ে যাবে এবং আর ফিরে পাওয়া যাবে না।</p>
              <div className="flex gap-4 font-eng">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all uppercase tracking-widest text-[10px]"
                >
                  না, ফিরে যান
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 uppercase tracking-widest text-[10px]"
                >
                  হ্যাঁ, ডিলিট করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
