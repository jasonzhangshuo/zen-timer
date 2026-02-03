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
    <div className="flex flex-col items-center justify-between h-full py-10 px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full flex justify-between items-start"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-extralight tracking-[0.3em] text-white/90">分享互动交流</h2>
          <p className="text-[9px] font-sans-sc tracking-[0.4em] opacity-30 uppercase">Zen Path Fellowship</p>
        </div>
        <button
          onClick={onToggleFullscreen}
          className="opacity-30 hover:opacity-100 transition-opacity duration-700"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Main：卡片悬停放大，父层 overflow-visible 避免被裁切 */}
      <div className="flex flex-col items-center w-full max-w-4xl flex-1 min-h-0 justify-center overflow-visible">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 overflow-visible">
          {tracks.map((track, i) => {
            const cardBgUrl = backgrounds[track.backgroundIndex] ?? backgrounds[0];
            const subtitleEn = CARD_SUBTITLE[track.id] ?? track.subtitle;
            return (
              <motion.div
                key={track.id}
                className="overflow-visible"
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
                  className="home-card group relative flex flex-col text-left rounded-[1.75rem] w-[200px] min-h-[280px] border border-white/15 overflow-hidden
                    hover:border-amber-500/40 hover:shadow-[0_0_48px_rgba(245,158,11,0.2)]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
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
          className="flex items-center gap-4 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group"
        >
          <Clock className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors duration-300" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-light tracking-[0.25em] text-white/90 uppercase">开始分享计时</span>
            <span className="text-[10px] tracking-[0.15em] text-white/50">倒计时 · 1 / 3 / 5 / 20 分钟</span>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="w-full flex justify-between items-end pt-4"
      >
        <div className="flex items-center space-x-5 opacity-20">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-[9px] tracking-[0.4em] font-sans-sc uppercase">Inner Peace Sanctuary</span>
        </div>
        <div className="text-xl font-extralight tracking-[0.8em] opacity-20 flex items-center">
          寻径<span className="mx-3 opacity-30">·</span>归真
          {typeof __BUILD_TIME__ !== 'undefined' && (
            <span className="ml-4 text-[9px] opacity-15 font-sans-sc tabular-nums" title="构建时间">{__BUILD_TIME__}</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HomeView;
