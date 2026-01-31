
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ViewType, SharingMode, ThemeMode } from './types';
import HomeView from './components/HomeView';
import PlayerView from './components/PlayerView';
import TimerView from './components/TimerView';
import Background, { backgrounds } from './components/Background';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.HOME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('DARK');
  const [sharingMode, setSharingMode] = useState<SharingMode>('SUPPLEMENT');
  const [bgIndex, setBgIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = useMemo(() => new URL('./zen-mindfulness-10min.mp3', import.meta.url).href, []);

  // Time states
  const [currentTime, setCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(600); // Fallback to 10 minutes
  
  // Timer specific logic
  const timerDurations = useMemo(() => ({
    MAIN: 300, // 5:00
    SUPPLEMENT: 180 // 3:00
  }), []);

  const [countdown, setCountdown] = useState(timerDurations[sharingMode]);

  // Sync countdown when sharing mode changes
  useEffect(() => {
    setCountdown(timerDurations[sharingMode]);
    setIsPlaying(false);
  }, [sharingMode, timerDurations]);

  // Audio player logic (sync time + auto-transition on end)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };
    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setPlayerDuration(Math.round(audio.duration));
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setSharingMode('MAIN');
      setTimeout(() => setView(ViewType.TIMER), 600); // Smooth delay
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Control playback based on view + state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (view !== ViewType.PLAYER) {
      audio.pause();
      return;
    }
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, view]);

  // Timer countdown logic - Allow negative numbers for overtime
  useEffect(() => {
    let interval: any;
    if (isPlaying && view === ViewType.TIMER) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, view]);

  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  const toggleTheme = useCallback(() => setTheme(prev => prev === 'DARK' ? 'LIGHT' : 'DARK'), []);
  const nextBackground = useCallback(() => setBgIndex(prev => (prev + 1) % backgrounds.length), []);
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Track fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const navigateTo = useCallback((newView: ViewType) => {
    setView(newView);
    setIsPlaying(false);
    if (newView === ViewType.PLAYER) {
      setCurrentTime(0); // Reset player when entering
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 10, scale: 0.98, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -10, scale: 1.02, filter: 'blur(12px)' }
  };

  const backVariants = {
    initial: { opacity: 0, y: -10, scale: 1.02, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: 10, scale: 0.98, filter: 'blur(12px)' }
  };

  const isOvertime = view === ViewType.TIMER && countdown < 0;
  const isOvertimeWarning = view === ViewType.TIMER && countdown < -30; // 超时超过30秒

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${theme === 'DARK' ? 'bg-black text-white' : 'bg-[#f5f5f0] text-[#2c2c2c]'} selection:bg-white/20`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      <Background currentView={view} bgIndex={bgIndex} theme={theme} isOvertime={isOvertime} isOvertimeWarning={isOvertimeWarning} />
      
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {view === ViewType.HOME && (
            <motion.div
              key="home"
              variants={backVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <HomeView 
                onEnter={() => navigateTo(ViewType.PLAYER)} 
                onTimer={() => navigateTo(ViewType.TIMER)}
                onToggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
              />
            </motion.div>
          )}
          
          {view === ViewType.PLAYER && (
            <motion.div
              key="player"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <PlayerView 
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={playerDuration}
                onTogglePlay={togglePlay}
                onBack={() => navigateTo(ViewType.HOME)}
              />
            </motion.div>
          )}
          
          {view === ViewType.TIMER && (
            <motion.div
              key="timer"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <TimerView 
                isPlaying={isPlaying}
                countdown={countdown}
                totalDuration={timerDurations[sharingMode]}
                sharingMode={sharingMode}
                onTogglePlay={togglePlay}
                onReset={() => setCountdown(timerDurations[sharingMode])}
                onBack={() => navigateTo(ViewType.HOME)}
                onSwitchMode={setSharingMode}
                onNextBg={nextBackground}
                onToggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
