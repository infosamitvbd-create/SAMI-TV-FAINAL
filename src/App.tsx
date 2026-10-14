import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { BreakingNews } from './components/BreakingNews';
import { SAMILogo } from './components/SAMILogo';
import { HeroSection } from './components/HeroSection';
import { Sidebar } from './components/Sidebar';
import { AboutUs } from './components/AboutUs';
import { OurFamily } from './components/OurFamily';
import { Media } from './components/Media';
import { NewsCategory } from './components/NewsCategory';
import { NewsDetail } from './components/NewsDetail';
import { AdminPanel } from './components/AdminPanel';
import { Home } from './components/Home';
import { LiveTV } from './components/LiveTV';
import { ContactUs } from './components/ContactUs';
import ComingSoon from './components/ComingSoon';
import AppDownload from './components/AppDownload';
import { FestivalPoster } from './components/FestivalPoster';
import { Archive } from './components/Archive';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TermsAndConditions } from './components/TermsAndConditions';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const handleNavigate = (page: string) => {
    navigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsClick = (news: any) => {
    setSelectedNews(news);
    navigate(`/news/${news.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sami-red selection:text-white pb-14 lg:pb-0">
      <div className="print:hidden">
        <Header onNavigate={handleNavigate} currentPage={location.pathname} />
        <Navbar 
          onNavigate={handleNavigate} 
          currentPage={location.pathname} 
          currentCategory={currentCategory} 
        />
        {location.pathname !== '/admin' && <BreakingNews />}
      </div>
      
      <main className={(location.pathname === '/download-app' || location.pathname === '/family' || location.pathname === '/about' || location.pathname === '/media' || location.pathname === '/contact' || location.pathname === '/admin' || location.pathname === '/live' || location.pathname.startsWith('/news/') || location.pathname.startsWith('/category/')) ? "flex-grow w-full" : "flex-grow container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1650px]"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home onNavigate={handleNavigate} onNewsClick={handleNewsClick} />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/family" element={<OurFamily />} />
              <Route path="/media" element={<Media />} />
              <Route path="/live" element={<LiveTV onNewsClick={handleNewsClick} onNavigate={handleNavigate} />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/android-tv" element={<ComingSoon />} />
              <Route path="/download-app" element={<AppDownload />} />
              <Route path="/archive" element={<Archive onNewsClick={handleNewsClick} onNavigate={handleNavigate} />} />
              <Route path="/news/:newsId" element={<NewsDetail news={selectedNews} onBack={() => handleNavigate('/')} onNewsClick={handleNewsClick} />} />
              <Route path="/category/:category" element={<CategoryWrapper onNavigate={handleNavigate} onNewsClick={handleNewsClick} setCurrentCategory={setCurrentCategory} />} />
              <Route path="*" element={
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="bg-white p-12 rounded-sm news-card-shadow text-center"
                >
                  <Info size={48} className="mx-auto text-sami-red mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                  <p className="text-gray-500">The page you are looking for does not exist.</p>
                  <button onClick={() => handleNavigate('/')} className="mt-6 bg-sami-red text-white px-6 py-2 rounded-md">Back to Home</button>
                </motion.div>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-auto print:hidden">
        <Footer onNavigate={handleNavigate} />
      </footer>

      {/* Sticky Mobile Bottom Navigation */}
      {location.pathname !== '/admin' && (
        <MobileBottomNav onNavigate={handleNavigate} currentPage={location.pathname} />
      )}
    </div>
  );
}

function CategoryWrapper({ onNavigate, onNewsClick, setCurrentCategory }: any) {
  const { category } = useParams();
  useEffect(() => {
    if (category) setCurrentCategory(category);
  }, [category, setCurrentCategory]);
  
  return <NewsCategory key={category} category={category || ''} onBack={() => onNavigate('/')} onNewsClick={onNewsClick} />;
}
