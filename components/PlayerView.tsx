
import React, { useEffect, useMemo, useState } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

/** 播放界面中央口诀：按曲目切换 */
const PHRASE_BY_TRACK: Record<string, string> = {
  'zen-10': '观呼吸',
  chushifan: '随闻入观',
  cijing: '善愿成就',
};

interface PlayerViewProps {
  trackId: string;
  trackTitle: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onBack: () => void;
}

type CaptionItem = { start: number; end: number; text: string };

const PlayerView: React.FC<PlayerViewProps> = ({ 
  trackId,
  trackTitle,
  isPlaying, 
  currentTime, 
  duration, 
  onTogglePlay, 
  onBack
}) => {
  const phrase = PHRASE_BY_TRACK[trackId] ?? '观呼吸';
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [isProgressHovered, setIsProgressHovered] = useState(false);

  useEffect(() => {
    let isActive = true;
    import('../subtitles/zen-mindfulness-10min.json')
      .then((module) => {
        if (!isActive) return;
        const data = (module as { default: unknown }).default;
        if (Array.isArray(data)) {
          setCaptions(data as CaptionItem[]);
        } else {
          setCaptions([]);
        }
      })
      .catch(() => {
        if (isActive) setCaptions([]);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const currentCaption = useMemo(() => {
    return captions.find((item) => currentTime >= item.start && currentTime < item.end);
  }, [captions, currentTime]);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;
  const radius = 145;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-between h-full py-6 px-4 font-sans-sc md:py-12 md:px-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-center"
      >
        <div className="space-y-1 min-w-0 flex-1 md:flex-initial">
          <h2 className="text-base font-extralight tracking-[0.3em] text-white/90 truncate md:text-xl md:tracking-[0.5em]">{trackTitle}</h2>
          <p className="text-[8px] tracking-[0.4em] opacity-30 uppercase md:text-[9px]">Fellowship Session</p>
        </div>
        <button 
          onClick={onBack}
          className="p-3 border border-white/5 rounded-full hover:bg-white/10 active:bg-white/10 transition-all duration-700 group shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>
      </motion.div>

      {/* Main Content：手机缩小圆环；桌面大圆环 */}
      <div className="flex-1 w-full flex items-center justify-center relative min-h-0 overflow-hidden md:overflow-visible">
        <div className="flex flex-col items-center space-y-6 md:space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-2 md:space-y-4"
          >
            <span className="text-[9px] tracking-[0.5em] text-amber-500/60 uppercase font-light md:text-[10px] md:tracking-[0.8em]">Guide Phase</span>
            <h1 className="text-4xl font-extralight tracking-[0.35em] ml-2 md:text-6xl md:tracking-[0.6em] md:ml-6">{phrase}</h1>
            <motion.p
              key={currentCaption?.text || 'empty'}
              initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
              animate={{ opacity: currentCaption ? 1 : 0, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-base font-light tracking-[0.2em] leading-relaxed text-white min-h-[1.5em]"
            >
              {currentCaption?.text || ''}
            </motion.p>
          </motion.div>

          <div 
            className="relative flex items-center justify-center scale-[0.58] origin-center md:scale-100"
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => setIsProgressHovered(false)}
          >
            {/* Animated Glow behind play button */}
            {isPlaying && (
              <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-72 h-72 rounded-full bg-amber-500/20 blur-[50px]"
              />
            )}

            {/* Circular Progress：手机由父级 scale 缩小 */}
            <svg className="w-[400px] h-[400px] transform -rotate-90 cursor-default touch-none md:touch-auto">
              <defs>
                <filter id="progressGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="200"
                cy="200"
                r={radius}
                stroke="white"
                strokeWidth="0.5"
                fill="transparent"
                className="opacity-5"
              />
              {/* Glow layer - visible on hover */}
              <motion.circle
                cx="200"
                cy="200"
                r={radius}
                stroke="#f59e0b"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                animate={{ 
                  strokeDashoffset,
                  opacity: isProgressHovered ? 0.35 : 0,
                }}
                transition={{ 
                  strokeDashoffset: { duration: 1, ease: "linear" },
                  opacity: { 
                    duration: isProgressHovered ? 1.5 : 2.5, 
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                filter="url(#progressGlow)"
                style={{ filter: 'blur(8px)' }}
              />
              <motion.circle
                cx="200"
                cy="200"
                r={radius}
                stroke="currentColor"
                fill="transparent"
                strokeDasharray={circumference}
                animate={{ 
                  strokeDashoffset,
                  strokeWidth: isProgressHovered ? 2.5 : 1.5,
                  stroke: isProgressHovered ? "rgba(251, 191, 36, 0.8)" : "rgba(245, 158, 11, 0.4)",
                }}
                transition={{ 
                  strokeDashoffset: { duration: 1, ease: "linear" },
                  strokeWidth: { 
                    duration: isProgressHovered ? 1.2 : 2, 
                    ease: [0.4, 0, 0.2, 1]
                  },
                  stroke: { 
                    duration: isProgressHovered ? 1.2 : 2, 
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
              />
            </svg>

            {/* Play Button Interface */}
            <div className="absolute flex flex-col items-center">
              <motion.button 
                onClick={onTogglePlay}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.95 }}
                className="w-28 h-28 rounded-full border border-white/10 flex items-center justify-center transition-all duration-1000 bg-white/5 group"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-white/5 text-white/80" />
                ) : (
                  <Play className="w-8 h-8 fill-white/5 ml-1 text-white/80" />
                )}
              </motion.button>
              
              <motion.div 
                className="mt-6 text-center md:mt-10"
                animate={{
                  opacity: isProgressHovered ? 1 : 0.6,
                }}
                transition={{ 
                  duration: isProgressHovered ? 1.2 : 2.5, 
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <motion.p 
                  className="text-[11px] tracking-[0.4em] tabular-nums"
                  animate={{
                    fontWeight: isProgressHovered ? 400 : 200,
                    color: isProgressHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.9)",
                  }}
                  transition={{ 
                    duration: isProgressHovered ? 1.2 : 2.5, 
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  {formatTime(currentTime)} 
                  <motion.span 
                    className="mx-2"
                    animate={{ opacity: isProgressHovered ? 0.4 : 0.2 }}
                    transition={{ 
                      duration: isProgressHovered ? 1.2 : 2.5, 
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >/</motion.span> 
                  {formatTime(duration)}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-wrap justify-center gap-3 text-center md:flex-nowrap md:justify-between md:items-end md:gap-0"
      >
        <div className="space-y-2 opacity-30 order-2 md:order-1">
          <p className="text-[8px] tracking-[0.4em] uppercase md:text-[9px]">Natural Resonance</p>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-[1px] bg-white/40" />
            <span className="text-[9px] tracking-[0.2em]">432Hz</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-2 opacity-20 mb-1 order-2">
           <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
           <span className="text-[7px] tracking-[0.8em] uppercase md:text-[8px]">Meditation in Progress</span>
        </div>
        
        <div className="opacity-20 text-[10px] tracking-[0.6em] select-none pointer-events-none uppercase w-full order-1 md:order-3 md:w-auto md:text-xs md:tracking-[1em]">
          归真 寻径
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerView;
