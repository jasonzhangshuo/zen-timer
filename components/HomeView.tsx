import React from 'react';
import { Maximize2, Minimize2, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Track } from '../types';
import { backgrounds } from './Background';

interface HomeViewProps {
  tracks: Track[];
  onSelectTrack: (trackId: string) => void;
  onTimer: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const CARD_SUBTITLE: Record<string, string> = {
  'zen-10': 'INNER STILLNESS',
  chushifan: 'PRACTICE SUTRA',
  cijing: 'LOVING KINDNESS',
};

const HomeView: React.FC<HomeViewProps> = ({
  tracks,
  onSelectTrack,
  onTimer,
  onToggleFullscreen,
  isFullscreen,
}) => {
  return (
    <div className="flex flex-col items-center justify-between h-full py-5 px-4 md:py-10 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full flex justify-between items-start"
      >
        <div className="space-y-1">
          <h2 className="text-base font-extralight tracking-[0.2em] text-white/90 md:text-xl md:tracking-[0.3em]">分享互动交流</h2>
          <p className="text-[8px] font-sans-sc tracking-[0.3em] opacity-30 uppercase md:text-[9px] md:tracking-[0.4em]">Zen Path Fellowship</p>
        </div>
        <button
          onClick={onToggleFullscreen}
          className="opacity-30 hover:opacity-100 active:opacity-100 transition-opacity duration-700 min-w-[44px] min-h-[44px] flex items-center justify-center md:min-w-[44px] md:min-h-[44px]"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </motion.div>

      {/* Main：手机竖排单列；桌面横排卡片（内联样式兜底，避免 Tailwind 未加载时只有一条线） */}
      <div
        className="flex flex-col items-center w-full max-w-4xl flex-1 min-h-0 justify-center overflow-y-auto overflow-x-hidden md:overflow-visible"
        style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
      >
        <div
          className="flex flex-col items-center gap-4 mb-6 w-full flex-shrink-0 md:flex-row md:flex-wrap md:justify-center md:gap-6 md:mb-10 overflow-visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', flexShrink: 0 }}
        >
          {tracks.map((track, i) => {
            const cardBgUrl = backgrounds[track.backgroundIndex] ?? backgrounds[0];
            const subtitleEn = CARD_SUBTITLE[track.id] ?? track.subtitle;
            return (
              <motion.div
                key={track.id}
                className="overflow-visible"
                style={{ width: '100%', maxWidth: 280 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4.2 + i * 0.6,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: i * 0.8,
                }}
              >
                <button
                  type="button"
                  onClick={() => onSelectTrack(track.id)}
                  className="home-card group relative flex flex-col text-left rounded-2xl w-full max-w-[280px] min-h-[220px] border border-white/15 overflow-hidden
                    hover:border-amber-500/40 hover:shadow-[0_0_48px_rgba(245,158,11,0.2)]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent
                    md:w-[200px] md:max-w-none md:min-h-[280px] md:rounded-[1.75rem]"
                  style={{ width: '100%', maxWidth: 280, minHeight: 220, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 flex flex-col"
                  >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-[filter] duration-200 group-hover:brightness-110"
                    style={{ backgroundImage: `url(${cardBgUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black/55 transition-colors duration-200 group-hover:bg-black/40" />
                  <div className="relative flex flex-col flex-1 p-5 z-10">
                    <h3 className="text-lg font-extralight tracking-[0.2em] text-white mt-auto">
                      {track.title}
                    </h3>
                    <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase mt-1">
                      {subtitleEn}
                    </p>
                  </div>
                  <div className="relative px-5 pb-5 z-10 flex items-center gap-1 text-[10px] tracking-[0.15em] text-white/50 transition-colors duration-200 group-hover:text-amber-500/90 mt-auto">
                    <span>开始聆听</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </motion.div>
              </button>
              </motion.div>
            );
          })}
        </div>

        {/* 开始分享计时 */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          onClick={onTimer}
          className="flex items-center gap-4 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group w-full max-w-[320px] min-h-[48px] md:w-auto md:max-w-none md:px-8 md:py-4"
        >
          <Clock className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors duration-300" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-light tracking-[0.2em] text-white/90 uppercase md:text-sm md:tracking-[0.25em]">开始分享计时</span>
            <span className="text-[9px] tracking-[0.15em] text-white/50 md:text-[10px]">倒计时 · 1 / 3 / 5 / 20 分钟</span>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="w-full flex flex-wrap justify-center gap-2 pt-3 text-center md:flex-nowrap md:justify-between md:pt-4 md:text-left"
      >
        <div className="flex items-center space-x-3 opacity-20 order-2 md:order-1 md:space-x-5">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-[8px] tracking-[0.4em] font-sans-sc uppercase md:text-[9px]">Inner Peace Sanctuary</span>
        </div>
        <div className="text-base font-extralight tracking-[0.5em] opacity-20 flex items-center justify-center w-full order-1 md:order-2 md:w-auto md:justify-end md:text-xl md:tracking-[0.8em]">
          寻径<span className="mx-3 opacity-30">·</span>归真
          {typeof __BUILD_TIME__ !== 'undefined' && (
            <span className="hidden md:inline ml-4 text-[9px] opacity-15 font-sans-sc tabular-nums" title="构建时间">{__BUILD_TIME__}</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HomeView;
