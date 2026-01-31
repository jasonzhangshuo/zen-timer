
import React from 'react';
import { ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeViewProps {
  onEnter: () => void;
  onTimer: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ onEnter, onTimer, onToggleFullscreen, isFullscreen }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full py-12 px-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-full flex justify-between items-start"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-extralight tracking-[0.3em] text-white/90">同修课程交流</h2>
          <p className="text-[9px] font-sans-sc tracking-[0.4em] opacity-30 uppercase">Zen Path Fellowship</p>
        </div>
        <button 
          onClick={onToggleFullscreen}
          className="opacity-30 hover:opacity-100 transition-opacity duration-700"
          title={isFullscreen ? "退出全屏" : "全屏"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center max-w-3xl space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="px-6 py-1 border border-white/10 rounded-full"
        >
          <span className="text-[9px] tracking-[0.5em] font-sans-sc opacity-40 uppercase">Phase 01 — Solitude</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          className="text-8xl font-extralight tracking-[0.5em] ml-8 text-white/95"
        >
          正念静坐
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 2 }}
          className="text-lg font-sans-sc font-extralight tracking-[0.2em] leading-relaxed max-w-lg"
        >
          在晨雾缭绕的森林深处，找回失落的自我。每一次呼吸都是与大地的对话，每一刻静谧都是对灵魂的洗礼。
        </motion.p>
        
        <motion.button 
          onClick={onEnter}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-16 px-16 py-5 border border-white/10 rounded-full group relative overflow-hidden transition-colors duration-700"
        >
          <span className="relative z-10 text-xs tracking-[0.8em] font-sans-sc uppercase font-light group-hover:text-white transition-colors duration-700">开始正念10分钟</span>
          <motion.div 
            className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
          />
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="w-full flex justify-between items-end"
      >
        <div className="flex items-center space-x-5 opacity-20">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-[9px] tracking-[0.4em] font-sans-sc uppercase">Inner Peace Sanctuary</span>
        </div>
        
        <div 
          onClick={onTimer}
          className="flex flex-col items-center space-y-5 cursor-pointer group opacity-30 hover:opacity-100 transition-all duration-700"
        >
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-700" />
          <span className="text-[9px] tracking-[0.4em] font-sans-sc uppercase">进入课程 倒计时</span>
        </div>
        
        <div className="text-xl font-extralight tracking-[0.8em] opacity-20 flex items-center">
          寻径<span className="mx-3 opacity-30">•</span>归真
        </div>
      </motion.div>
    </div>
  );
};

export default HomeView;
