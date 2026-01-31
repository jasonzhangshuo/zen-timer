
export enum ViewType {
  HOME = 'HOME',
  PLAYER = 'PLAYER',
  TIMER = 'TIMER'
}

export type SharingMode = 'MAIN' | 'SUPPLEMENT';
export type ThemeMode = 'DARK' | 'LIGHT';

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
