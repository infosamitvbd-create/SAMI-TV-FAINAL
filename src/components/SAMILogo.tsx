import React from 'react';
import { motion } from 'motion/react';

export const SAMILogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.94, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center relative group select-none ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.035, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative cursor-pointer"
      >
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJzBFxNLxCVm42e70gZrnyPMtqQ3piIxLnst-pNg7QZ-VnhzqA83dsxumwtFhBw77Pwf-YntlyB86rQWqIdoIrxe5Oe5aoMKS6lqjhFFL47Aql1u5UUs8dhquSy8dIko7xmfKwo61hWPKX0w6L80OTZQSWg7JTAVhBjZn2MS_B8V9K6EGv-500KIDb054e/s1434/sami%20logo%205.jpeg" 
          alt="Sami TV Logo" 
          className="h-24 w-auto object-contain drop-shadow-[0_8px_16px_rgba(204,0,0,0.22)] transition-shadow duration-300 group-hover:drop-shadow-[0_16px_28px_rgba(204,0,0,0.35)]"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle, soft breathing ambient glow circle behind the logo on hover */}
        <div className="absolute inset-0 bg-red-600/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </motion.div>
    </motion.div>
  );
};
