import React from 'react';
import { motion } from 'motion/react';

export default function Logo({ collapsed = false, size = "md" }: { collapsed?: boolean, size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "w-8 h-8", text: "text-lg", icon: 16 },
    md: { box: "w-10 h-10", text: "text-2xl", icon: 20 },
    lg: { box: "w-12 h-12", text: "text-3xl", icon: 24 }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center gap-3 overflow-hidden group">
      <div className={`${currentSize.box} bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none relative`}>
        {/* Animated Character / Robot Face */}
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width={currentSize.icon * 1.5} height={currentSize.icon * 1.5} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <rect x="5" y="7" width="14" height="12" rx="3" fill="white" fillOpacity="0.2" />
            <rect x="5" y="7" width="14" height="12" rx="3" stroke="white" strokeWidth="1.5" />
            
            {/* Eyes */}
            <motion.circle 
              cx="9" cy="12" r="1.5" fill="white" 
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.95, 1] }}
            />
            <motion.circle 
              cx="15" cy="12" r="1.5" fill="white" 
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.95, 1] }}
            />
            
            {/* Mouth / Signal */}
            <motion.path 
              d="M9 16H15" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              animate={{ d: ["M9 16H15", "M10 16.5H14", "M9 16H15"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Antenna */}
            <line x1="12" y1="7" x2="12" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <motion.circle 
              cx="12" cy="3" r="1.5" fill="#F43F5E" 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>
      
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h1 className={`${currentSize.text} font-black tracking-tighter text-[#111827] dark:text-white leading-none`}>
            Humn<span className="text-[#4F46E5]">Ai</span>
          </h1>
          <span className="text-[10px] font-bold text-[#6B7280] dark:text-gray-400 uppercase tracking-[0.2em] mt-0.5">Tutor</span>
        </motion.div>
      )}
    </div>
  );
}
