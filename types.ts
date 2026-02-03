
export enum ViewType {
  HOME = 'HOME',
  PLAYER = 'PLAYER',
  TIMER = 'TIMER'
}

/** 计时器可选时长（秒）：1 / 3 / 5 / 20 分钟 */
export const TIMER_PRESETS = [60, 180, 300, 1200] as const;

/** 计时器最大时长（秒），60 分钟 */
export const MAX_TIMER_SECONDS = 3600;

export type SharingMode = 'MAIN' | 'SUPPLEMENT';
export type ThemeMode = 'DARK' | 'LIGHT';

/** 课程曲目：backgroundIndex 对应播放页背景图，卡片封面也用同一张 */
export interface Track {
  id: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  audioUrl: string;
  /** 背景图在 backgrounds 中的下标，卡片封面 = 播放页背景 */
  backgroundIndex: number;
}

export interface MeditationState {
  view: ViewType;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  countdown: number;
  sharingMode: SharingMode;
  theme: ThemeMode;
  bgIndex: number;
}
