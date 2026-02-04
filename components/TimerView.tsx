
import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, Play, Pause, Maximize2, Minimize2, Sparkles, Clock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMER_PRESETS, MAX_TIMER_SECONDS } from '../types';

interface TimerViewProps {
  isPlaying: boolean;
  countdown: number;
  totalDuration: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onBack: () => void;
  onSelectDuration: (seconds: number) => void;
  onAddMinute: () => void;
  onNextBg: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const zenQuotes = [
  { left: ["不思善恶", "本来面目"], right: "一期一会" },
  { left: ["心无挂碍", "远离颠倒"], right: "万法归一" },
  { left: ["观心如镜", "照见五蕴"], right: "大愿同行" },
  { left: ["看山是山", "见性成佛"], right: "明心见性" },
  { left: ["行到水穷", "坐看云起"], right: "清净无为" },
  { left: ["应无所住", "而生其心"], right: "随缘自在" },
  { left: ["空即是色", "色即是空"], right: "般若智慧" },
  { left: ["放下执着", "当下即是"], right: "本自清净" },
  { left: ["静观自得", "妙悟天真"], right: "无住生心" },
  { left: ["身心安住", "自性圆满"], right: "觉悟本心" },
  { left: ["一念不生", "万法归宗"], right: "如如不动" },
  { left: ["直指人心", "见性成佛"], right: "顿悟菩提" },
];

const Digit = ({ value, color, glowIntensity }: { value: string; color: string; glowIntensity: number }) => (
  <div className="relative h-[140px] flex items-center justify-center overflow-hidden w-[80px] md:h-[280px] md:w-[155px]">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.1, filter: 'blur(15px)' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.8 } }}
        className="absolute text-[140px] leading-none font-thin tabular-nums select-none transition-all duration-1000 md:text-[280px]"
        style={{ color, textShadow: glowIntensity > 0 ? `0 0 ${glowIntensity * 50}px ${color}` : 'none' }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

const TimerView: React.FC<TimerViewProps> = ({ 
  isPlaying, 
  countdown, 
  totalDuration,
  onTogglePlay, 
  onReset,
  onBack, 
  onSelectDuration,
  onAddMinute,
  onNextBg,
  onToggleFullscreen,
  isFullscreen
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isControlsHovered, setIsControlsHovered] = useState(false);

  useEffect(() => {
    const positiveTime = Math.max(0, countdown);
    const newIndex = Math.floor(positiveTime / 20) % zenQuotes.length; // 每20秒切换一条禅语
    if (newIndex !== quoteIndex) {
      setQuoteIndex(newIndex);
    }
  }, [countdown]);

  const isOvertime = countdown < 0;
  const isExpiring = countdown >= 0 && countdown <= 15;
  const isOvertimeWarning = countdown < -30; // 超时超过30秒，强调提醒

  const getTimerStyles = () => {
    const amberColor = '#d97706';
    if (isOvertime) return { color: amberColor, glow: 0.8 }; 
    
    if (isExpiring) {
      const ratio = 1 - (countdown / 15);
      const r = Math.round(255 + (217 - 255) * ratio);
      const g = Math.round(255 + (119 - 255) * ratio);
      const b = Math.round(255 + (6 - 255) * ratio);
      
      return { 
        color: `rgb(${r}, ${g}, ${b})`, 
        glow: ratio * 0.5 
      };
    }
    
    return { 
      color: 'rgba(255,255,255,0.9)', 
      glow: 0 
    };
  };

  const { color: timerColor, glow: glowIntensity } = getTimerStyles();

  const formatTime = (seconds: number) => {
    const absSecs = Math.abs(seconds);
    const m = Math.floor(absSecs / 60);
    const s = absSecs % 60;
    return {
      min: m.toString().padStart(2, '0').split(''),
      sec: s.toString().padStart(2, '0').split('')
    };
  };

  const { min, sec } = formatTime(countdown);
  const progressPercent = Math.min(100, ((totalDuration - Math.max(0, countdown)) / totalDuration) * 100);
  const currentQuotes = zenQuotes[quoteIndex];

  return (
    <div className={`flex flex-col items-center justify-between h-full py-5 px-4 font-sans-sc transition-colors duration-1000 md:py-10 md:px-12`}>
      {/* Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-center z-20"
      >
        <div className="flex items-center space-x-4 md:space-x-12">
          <button onClick={onBack} className="transition-opacity duration-700 opacity-40 hover:opacity-100 active:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Home className="w-5 h-5" />
          </button>
          <span className="text-[9px] tracking-[0.6em] font-light uppercase opacity-50 md:text-[10px] md:tracking-[1em]">Deep Silence</span>
        </div>
        
        <div className="flex items-center opacity-40">
          <button onClick={onToggleFullscreen} className="hover:opacity-100 active:opacity-100 transition-opacity duration-700 min-w-[44px] min-h-[44px] flex items-center justify-center" title={isFullscreen ? "退出全屏" : "全屏"}>
            {isFullscreen ? <Minimize2 className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Main Display：手机隐藏两侧禅语；桌面显示 */}
      <div className="flex-1 w-full flex items-center justify-center relative min-h-0 overflow-hidden md:overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`left-${quoteIndex}`}
            initial={{ opacity: 0, x: -15, filter: 'blur(10px)' }}
            animate={{ opacity: 0.6, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 10, filter: 'blur(10px)' }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="hidden absolute left-0 top-1/2 -translate-y-1/2 md:flex flex-col space-y-8 text-lg font-light tracking-[0.8em] pointer-events-none select-none" 
            style={{ writingMode: 'vertical-rl' }}
          >
            {currentQuotes.left.map((text, i) => <span key={i}>{text}</span>)}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center flex-1 justify-center md:flex-initial">
          <div className="flex items-center justify-center scale-90 origin-center md:scale-100">
            <div className="flex">
              <Digit value={min[0]} color={timerColor} glowIntensity={glowIntensity} />
              <Digit value={min[1]} color={timerColor} glowIntensity={glowIntensity} />
            </div>
            <div className="flex flex-col space-y-8 py-4 px-3 md:space-y-16 md:py-8 md:px-6">
              <motion.div 
                animate={{ opacity: [0.2, 0.7, 0.2] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-1000`} 
                style={{ backgroundColor: timerColor, boxShadow: glowIntensity > 0 ? `0 0 ${glowIntensity * 25}px ${timerColor}` : 'none' }} 
              />
              <motion.div 
                animate={{ opacity: [0.2, 0.7, 0.2] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-1000`} 
                style={{ backgroundColor: timerColor, boxShadow: glowIntensity > 0 ? `0 0 ${glowIntensity * 25}px ${timerColor}` : 'none' }} 
              />
            </div>
            <div className="flex">
              <Digit value={sec[0]} color={timerColor} glowIntensity={glowIntensity} />
              <Digit value={sec[1]} color={timerColor} glowIntensity={glowIntensity} />
            </div>
          </div>

          {/* Dynamic Phase Messaging */}
          <div className="mt-4 min-h-[3.5rem] flex items-center justify-center md:mt-8 md:min-h-[4rem]">
            <AnimatePresence mode="wait">
              {isOvertime ? (
                <motion.div 
                  key="overtime-msg"
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(5px)' }}
                  className="flex flex-col items-center space-y-2 md:space-y-3"
                >
                  <motion.span 
                    animate={isOvertimeWarning ? { 
                      scale: [1, 1.05, 1],
                      textShadow: ["0 0 0px #f59e0b", "0 0 20px #f59e0b", "0 0 0px #f59e0b"]
                    } : {}}
                    transition={isOvertimeWarning ? { 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    } : {}}
                    className={`text-amber-500 text-sm md:text-base tracking-[0.8em] transition-all duration-500 ${isOvertimeWarning ? 'font-medium' : 'font-light'}`}
                  >
                    随 喜 学 长 分 享
                  </motion.span>
                  <motion.div 
                    animate={isOvertimeWarning ? { 
                      opacity: [0.9, 1, 0.9]
                    } : { opacity: 0.95 }}
                    transition={isOvertimeWarning ? { 
                      duration: 1.5, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    } : {}}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    <Clock className={`w-4 h-4 md:w-5 md:h-5 text-amber-500 flex-shrink-0 ${isOvertimeWarning ? 'animate-pulse' : ''}`} />
                    <motion.span
                      animate={isOvertimeWarning ? {
                        opacity: [0.9, 1, 0.9],
                        color: ['#d97706', '#fbbf24', '#d97706'],
                        textShadow: ['0 0 12px rgba(245,158,11,0.35)', '0 0 24px rgba(251,191,36,0.6)', '0 0 12px rgba(245,158,11,0.35)'],
                      } : {}}
                      transition={isOvertimeWarning ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                      className={`font-semibold text-sm tracking-[0.25em] md:text-base md:tracking-[0.35em] uppercase ${isOvertimeWarning ? 'font-bold' : ''}`}
                      style={!isOvertimeWarning ? { color: '#d97706', textShadow: '0 0 12px rgba(245,158,11,0.4)' } : undefined}
                    >
                      分享已超时
                    </motion.span>
                  </motion.div>
                </motion.div>
              ) : isExpiring ? (
                <motion.div 
                  key="expiring-msg"
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(5px)' }}
                  className="flex flex-col items-center"
                >
                  <motion.span
                    animate={{
                      opacity: [0.85, 1, 0.85],
                      color: ['#b45309', '#f59e0b', '#b45309'],
                      textShadow: ['0 0 10px rgba(245,158,11,0.3)', '0 0 20px rgba(245,158,11,0.55)', '0 0 10px rgba(245,158,11,0.3)'],
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-amber-500 text-sm md:text-base tracking-[0.4em] md:tracking-[0.5em] font-semibold"
                  >
                    即将分享到时，随喜分享
                  </motion.span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Breathing Halo Effect：手机缩小避免占满屏 */}
        {isPlaying && (
          <motion.div
            animate={{ 
              scale: isOvertime ? [1, 1.3, 1] : [0.85, 1.1, 0.85], 
              opacity: isOvertime ? [0.1, 0.25, 0.1] : (isExpiring ? [0.03, 0.1, 0.03] : [0.02, 0.08, 0.02]) 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-[320px] h-[320px] rounded-full blur-[60px] pointer-events-none transition-colors duration-1000 md:w-[600px] md:h-[600px] md:blur-[100px] ${isExpiring || isOvertime ? 'bg-amber-500/30' : 'bg-white/20'}`}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div 
            key={`right-${quoteIndex}`}
            initial={{ opacity: 0, x: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 0.55, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -10, filter: 'blur(10px)' }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="hidden absolute right-0 top-1/2 -translate-y-1/2 md:block text-sm font-light tracking-[1em] pointer-events-none select-none" 
            style={{ writingMode: 'vertical-rl' }}
          >
            <span>{currentQuotes.right}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls：手机缩小间距、按钮易点 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full flex flex-col items-center space-y-8 pb-6 md:space-y-12 md:pb-8"
        onMouseEnter={() => setIsControlsHovered(true)}
        onMouseLeave={() => setIsControlsHovered(false)}
      >
        {/* 固定时长选择：1 / 3 / 5 / 20 分钟；+1 分钟 */}
        <div className="flex items-center gap-3 flex-wrap justify-center md:gap-6">
          {TIMER_PRESETS.map((seconds) => {
            const label = seconds === 60 ? '1分钟' : seconds === 180 ? '3分钟' : seconds === 300 ? '5分钟' : '20分钟';
            const isActive = totalDuration === seconds;
            return (
              <button
                key={seconds}
                onClick={() => onSelectDuration(seconds)}
                className={`text-[11px] tracking-[0.5em] transition-all duration-700 relative py-2.5 px-4 rounded-full min-h-[44px] flex items-center justify-center md:py-2 ${
                  isActive ? 'text-white opacity-100 bg-white/10' : 'opacity-50 hover:opacity-80 active:opacity-80'
                }`}
              >
                {label}
                {isActive && (
                  <motion.div layoutId="duration-underline" className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
                )}
              </button>
            );
          })}
          <motion.button
            onClick={onAddMinute}
            disabled={totalDuration >= MAX_TIMER_SECONDS}
            whileHover={totalDuration < MAX_TIMER_SECONDS ? { scale: 1.05, opacity: 1 } : {}}
            whileTap={totalDuration < MAX_TIMER_SECONDS ? { scale: 0.98 } : {}}
            className={`flex items-center gap-1.5 text-[11px] tracking-[0.4em] py-2 px-3 rounded-full border transition-all duration-500 min-h-[44px] items-center justify-center ${
              totalDuration >= MAX_TIMER_SECONDS
                ? 'opacity-30 cursor-not-allowed border-white/10'
                : 'opacity-60 hover:opacity-100 active:opacity-100 border-white/20 hover:border-white/40'
            }`}
            title="加 1 分钟（最多 60 分钟）"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+1</span>
          </motion.button>
        </div>

        <div className="flex items-center space-x-12 relative md:space-x-20">
          {/* Glow behind play button - always present, just fades */}
          <motion.div 
            animate={{ 
              scale: isControlsHovered ? 1.2 : 0.9, 
              opacity: isControlsHovered ? 0.45 : 0.08 
            }}
            transition={{ 
              type: "tween",
              duration: 2.5, 
              ease: "easeInOut"
            }}
            className="absolute w-44 h-44 rounded-full bg-amber-500/40 blur-[50px] pointer-events-none"
          />
          
          <button onClick={onReset} className="transition-all duration-1000 hover:rotate-180 opacity-30 hover:opacity-100 active:opacity-100 text-white min-w-[44px] min-h-[44px] flex items-center justify-center md:min-w-[48px] md:min-h-[48px]"><RefreshCw className="w-5 h-5 md:w-6 md:h-6" /></button>
          <motion.button 
            onClick={onTogglePlay}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            animate={{
              borderColor: isControlsHovered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
              boxShadow: isControlsHovered ? "0 0 40px rgba(245, 158, 11, 0.25)" : "0 0 0px rgba(245, 158, 11, 0)",
            }}
            transition={{ type: "tween", duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 min-w-[72px] min-h-[72px] rounded-full border flex items-center justify-center bg-white/5 md:w-24 md:h-24 md:min-w-0 md:min-h-0"
          >
            {isPlaying ? <Pause className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-1000 ${isExpiring || isOvertime ? 'text-amber-500' : 'text-white/70'}`} /> : <Play className={`w-6 h-6 md:w-7 md:h-7 ml-1 transition-colors duration-1000 ${isExpiring || isOvertime ? 'text-amber-500' : 'text-white/70'}`} />}
          </motion.button>
          <button onClick={onNextBg} className="transition-opacity duration-700 opacity-30 hover:opacity-100 active:opacity-100 text-white min-w-[44px] min-h-[44px] flex items-center justify-center md:min-w-[48px] md:min-h-[48px]" title="切换背景"><Sparkles className="w-5 h-5 md:w-6 md:h-6" /></button>
        </div>

        <div className="w-full max-w-xl space-y-5 relative">
          {/* Progress bar glow - always present */}
          <motion.div 
            animate={{ 
              opacity: isControlsHovered ? 0.5 : 0.1,
            }}
            transition={{ 
              type: "tween",
              duration: 2.5,
              ease: "easeInOut"
            }}
            className="absolute -top-2 left-0 h-5 bg-amber-500/30 blur-[12px] pointer-events-none rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
          
          <div className="w-full h-[1px] relative bg-white/10">
            <motion.div 
              animate={{ 
                width: `${progressPercent}%`,
                opacity: isControlsHovered ? 1 : 0.6,
              }} 
              transition={{ 
                width: { duration: 0.5 },
                opacity: { 
                  type: "tween",
                  duration: 2,
                  ease: "easeInOut"
                }
              }}
              className={`absolute top-0 left-0 h-full ${isExpiring || isOvertime ? 'bg-amber-500' : 'bg-amber-500'}`} 
            />
          </div>
          <motion.p 
            animate={{
              opacity: isControlsHovered ? 0.6 : 0.3,
            }}
            transition={{ 
              type: "tween",
              duration: 2,
              ease: "easeInOut"
            }}
            className={`text-center text-[10px] tracking-[0.5em] uppercase ${isExpiring || isOvertime ? 'text-amber-500' : 'text-white'}`}
          >
            {Math.floor(totalDuration / 60)}:00
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default TimerView;
