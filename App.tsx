
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ViewType, ThemeMode, MAX_TIMER_SECONDS } from './types';
import { TRACKS } from './tracks';
import HomeView from './components/HomeView';
import PlayerView from './components/PlayerView';
import TimerView from './components/TimerView';
import Background, { backgrounds } from './components/Background';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.HOME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('DARK');
  const [bgIndex, setBgIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState(TRACKS[0].id);
  const audioSrc = useMemo(
    () => TRACKS.find((t) => t.id === currentTrackId)?.audioUrl ?? TRACKS[0].audioUrl,
    [currentTrackId]
  );
  const currentTrack = useMemo(() => TRACKS.find((t) => t.id === currentTrackId) ?? TRACKS[0], [currentTrackId]);

  // Time states
  const [currentTime, setCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(600);
  
  // Timer: 固定时长选择 1/3/5/20 分钟，默认 5 分钟
  const [selectedTimerDuration, setSelectedTimerDuration] = useState(300); // 5 min
  const [countdown, setCountdown] = useState(selectedTimerDuration);
  const prevCountdownRef = useRef<number>(300);

  // 进入计时器或切换时长时同步倒计时
  useEffect(() => {
    if (view === ViewType.TIMER) {
      setCountdown(selectedTimerDuration);
      prevCountdownRef.current = selectedTimerDuration;
      setIsPlaying(false);
    }
  }, [view, selectedTimerDuration]);

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

  // 倒计时结束时播放磬/颂钵声（仅从 1→0 触发一次）
  // 音源：Buddha bell / Tibetan singing bowl (CC BY-NC 4.0). 可替换为本地 timer-bell.mp3 以离线或商用.
  const TIMER_END_BELL_URL = 'https://orangefreesounds.com/wp-content/uploads/2022/12/Buddha-bell-sound.mp3';

  const playTimerEndBell = useCallback(() => {
    const audio = new Audio(TIMER_END_BELL_URL);
    audio.volume = 0.8;
    const played = audio.play().catch(() => {
      // 外链失败（CORS/网络）时回退到合成钟声
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(256, now);
        osc.frequency.setValueAtTime(384, now + 0.08);
        osc.frequency.setValueAtTime(320, now + 0.2);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
        osc.start(now);
        osc.stop(now + 2.5);
      } catch (_) {}
    });
  }, []);

  useEffect(() => {
    if (view !== ViewType.TIMER) return;
    const prev = prevCountdownRef.current;
    prevCountdownRef.current = countdown;
    if (prev === 1 && countdown === 0) playTimerEndBell();
  }, [view, countdown, playTimerEndBell]);

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
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, []);

  const selectTrackAndPlay = useCallback((trackId: string) => {
    const track = TRACKS.find((t) => t.id === trackId) ?? TRACKS[0];
    setCurrentTrackId(trackId);
    setCurrentTime(0);
    setPlayerDuration(track.durationSeconds);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
    }
    setView(ViewType.PLAYER);
  }, []);

  const pageTransition = { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] };

  const pageVariants = {
    initial: { opacity: 0, y: 16, scale: 0.98, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -12, scale: 1.02, filter: 'blur(14px)' }
  };

  const backVariants = {
    initial: { opacity: 0, y: -12, scale: 1.02, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: 12, scale: 0.98, filter: 'blur(14px)' }
  };

  const isOvertime = view === ViewType.TIMER && countdown < 0;
  const isOvertimeWarning = view === ViewType.TIMER && countdown < -30; // 超时超过30秒

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${theme === 'DARK' ? 'bg-black text-white' : 'bg-[#f5f5f0] text-[#2c2c2c]'} selection:bg-white/20`}>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      <Background
        currentView={view}
        bgIndex={view === ViewType.PLAYER ? (currentTrack.backgroundIndex ?? 0) : bgIndex}
        theme={theme}
        isOvertime={isOvertime}
        isOvertimeWarning={isOvertimeWarning}
      />
      
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="sync">
          {view === ViewType.HOME && (
            <motion.div
              key="home"
              variants={backVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="absolute inset-0 w-full h-full"
            >
              <HomeView 
                tracks={TRACKS}
                onSelectTrack={selectTrackAndPlay}
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
              transition={pageTransition}
              className="absolute inset-0 w-full h-full"
            >
              <PlayerView 
                trackId={currentTrack.id}
                trackTitle={currentTrack.title}
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
              transition={pageTransition}
              className="absolute inset-0 w-full h-full"
            >
              <TimerView 
                isPlaying={isPlaying}
                countdown={countdown}
                totalDuration={selectedTimerDuration}
                onTogglePlay={togglePlay}
                onReset={() => setCountdown(selectedTimerDuration)}
                onBack={() => navigateTo(ViewType.HOME)}
                onSelectDuration={(seconds) => {
                  setSelectedTimerDuration(seconds);
                  setCountdown(seconds);
                  setIsPlaying(false);
                }}
                onAddMinute={() => {
                  setSelectedTimerDuration((prev) => Math.min(prev + 60, MAX_TIMER_SECONDS));
                  setCountdown((prev) => Math.min(prev + 60, MAX_TIMER_SECONDS));
                }}
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
