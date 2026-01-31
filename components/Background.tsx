
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

// 古朴与现代禅意结合的背景（山水/石/雾/极简风景）
export const backgrounds = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2400", // 雪山晨光
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2400", // 山峰云海
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2400", // 星空雪山
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2400", // 山谷晨雾
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2400", // 瀑布山林
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=2400", // 平静湖面
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=2400", // 阿尔卑斯山
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&q=80&w=2400", // 秋日森林
];

// 超时警告专用莲花背景（暗色背景粉色莲花）
const lotusBackground = "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?auto=format&fit=crop&q=80&w=2400"; // 暗色背景莲花

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
  
  // 超时后背景遮罩变浅，亮度提升
  const getOverlayOpacity = () => {
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
  
  // 获取当前应显示的背景图
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

  // 用于背景切换的 key，莲花背景使用特殊 key
  const bgKey = isOvertimeWarning ? 'lotus' : `bg-${displayIndex}`;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        <motion.div 
          key={bgKey}
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
      </AnimatePresence>

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
