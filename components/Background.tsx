
import React, { useEffect, useState } from 'react';
import { ViewType, ThemeMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundProps {
  currentView: ViewType;
  bgIndex: number;
  theme: ThemeMode;
  isOvertime?: boolean;
  isOvertimeWarning?: boolean; // 超时超过30秒
}

// 前 3 张为三首曲目专用，统一暖调 / 柔和，与慈经搭配
export const backgrounds = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=2400", // 正念静坐：暖色林光
  "https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?auto=format&fit=crop&q=80&w=2400", // 处世梵：暖光 / 柔和
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=2400", // 慈经：暖光 / 柔和（保留）
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2400", // 山谷晨雾
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2400", // 瀑布山林
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=2400", // 平静湖面
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=2400", // 阿尔卑斯山
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&q=80&w=2400", // 秋日森林
];

// 超时警告专用莲花背景（暗色背景粉色莲花）
const lotusBackground = "https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?auto=format&fit=crop&q=80&w=2400"; // 暗色背景莲花

const Background: React.FC<BackgroundProps> = ({ currentView, bgIndex, theme, isOvertime = false, isOvertimeWarning = false }) => {
  const isDark = theme === 'DARK';
  const [displayIndex, setDisplayIndex] = useState(bgIndex);
  const [loadedIndexes, setLoadedIndexes] = useState(() => new Set<number>());
  const [lotusLoaded, setLotusLoaded] = useState(false);
  
  // 预加载莲花背景
  useEffect(() => {
    const img = new Image();
    img.src = lotusBackground;
    img.onload = () => setLotusLoaded(true);
  }, []);
  
  // 首页无遮罩（纯色渐变）；其他页统一遮罩；超时后背景遮罩变浅
  const getOverlayOpacity = () => {
    if (currentView === ViewType.HOME) return 0;
    if (currentView !== ViewType.TIMER) return 0.45;
    if (isOvertimeWarning) return 0.3; // 莲花背景更透
    return isOvertime ? 0.35 : 0.45;
  };

  const getBrightness = () => {
    if (currentView !== ViewType.TIMER) return isDark ? 0.8 : 1.1;
    if (isOvertimeWarning) return 1.1; // 莲花背景稍亮
    // 超时模式下提升亮度，营造"光明感"
    if (isOvertime) return isDark ? 1.3 : 1.4; 
    return isDark ? 1.0 : 1.2;
  };

  const getSaturate = () => {
    if (isOvertimeWarning) return 'saturate(1.15)'; // 莲花更鲜艳
    return isOvertime ? 'saturate(1.2)' : 'saturate(0.8)';
  };
  
  const getCurrentBackground = () => {
    if (isOvertimeWarning && lotusLoaded) return lotusBackground;
    return backgrounds[displayIndex];
  };

  useEffect(() => {
    let isActive = true;
    const loadImage = (index: number) => {
      const img = new Image();
      img.src = backgrounds[index];
      img.onload = () => {
        if (!isActive) return;
        setLoadedIndexes((prev) => {
          if (prev.has(index)) return prev;
          const next = new Set(prev);
          next.add(index);
          return next;
        });
        setDisplayIndex(index);
      };
      img.onerror = () => {
        if (!isActive) return;
        // Keep current displayIndex if new image fails to load
      };
    };

    if (loadedIndexes.has(bgIndex)) {
      setDisplayIndex(bgIndex);
      return () => {
        isActive = false;
      };
    }

    loadImage(bgIndex);
    return () => {
      isActive = false;
    };
  }, [bgIndex, loadedIndexes]);

  useEffect(() => {
    let isActive = true;
    backgrounds.forEach((_, index) => {
      if (loadedIndexes.has(index)) return;
      const img = new Image();
      img.src = backgrounds[index];
      img.onload = () => {
        if (!isActive) return;
        setLoadedIndexes((prev) => {
          if (prev.has(index)) return prev;
          const next = new Set(prev);
          next.add(index);
          return next;
        });
      };
    });
    return () => {
      isActive = false;
    };
  }, [loadedIndexes]);

  const isHomeView = currentView === ViewType.HOME;
  const bgKey = isHomeView ? 'home' : (isOvertimeWarning ? 'lotus' : `bg-${displayIndex}`);

  return (
    <div className="fixed inset-0 z-0 bg-black" style={{ overflow: isHomeView ? 'visible' : 'hidden' }}>
      <AnimatePresence initial={false}>
        {isHomeView ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-b from-[#10121c] via-[#14182a] to-[#0a0c14]"
          />
        ) : (
          <motion.div 
            key={isOvertimeWarning ? 'lotus' : `bg-${displayIndex}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              filter: `brightness(${getBrightness()}) ${getSaturate()}`
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${getCurrentBackground()})`,
            }}
          />
        )}
      </AnimatePresence>

      {/* 首页专用：极淡冷色光效，不抢封面，仅做层次 */}
      {isHomeView && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 2 }}
          aria-hidden
        >
          <div
            className="absolute rounded-full will-change-transform"
            style={{
              width: '120%',
              height: '120%',
              top: '-15%',
              left: '-15%',
              background: 'radial-gradient(ellipse 70% 50% at 40% 30%, rgba(140,150,170,0.09) 0%, transparent 55%)',
              animation: 'drift-light 22s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full will-change-transform"
            style={{
              width: '120%',
              height: '120%',
              top: '-12%',
              right: '-12%',
              background: 'radial-gradient(ellipse 60% 70% at 70% 60%, rgba(120,130,160,0.07) 0%, transparent 55%)',
              animation: 'drift-light 28s ease-in-out infinite reverse',
              animationDelay: '-8s',
            }}
          />
          <div
            className="absolute rounded-full will-change-transform"
            style={{
              width: '110%',
              height: '100%',
              bottom: '-10%',
              left: '-5%',
              background: 'radial-gradient(ellipse 65% 45% at 50% 85%, rgba(150,155,165,0.06) 0%, transparent 55%)',
              animation: 'drift-light 25s ease-in-out infinite',
              animationDelay: '-4s',
            }}
          />
        </div>
      )}

      {/* 主色调遮罩：超时时色彩会偏向琥珀暖色 */}
      <motion.div 
        animate={{ 
          opacity: getOverlayOpacity(),
          backgroundColor: isOvertimeWarning ? '#1a0a00' : (isOvertime ? (isDark ? '#261a00' : '#fff9eb') : (isDark ? '#000000' : '#f5f5f0'))
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0" 
      />
      
      {/* 超时特有的暖金色光晕层 */}
      <AnimatePresence>
        {isOvertime && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isOvertimeWarning ? 0.4 : 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 bg-gradient-to-tr from-amber-900/40 via-transparent to-amber-500/20 mix-blend-screen pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* 通用暗角/渐变，增加层次感 */}
      <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/40 via-transparent to-black/60' : 'from-white/20 via-transparent to-black/5'} pointer-events-none`} />
    </div>
  );
};

export default Background;
