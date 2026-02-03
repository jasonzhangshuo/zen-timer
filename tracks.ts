import type { Track } from './types';

const zenUrl = new URL('./zen-mindfulness-10min.mp3', import.meta.url).href;
const chushifanUrl = new URL('./chushifan.mp3', import.meta.url).href;
const cijingUrl = new URL('./cijing.mp3', import.meta.url).href;

/** 三首课程：每首对应一张背景图，卡片封面 = 点击进入播放页的背景 */
export const TRACKS: Track[] = [
  { id: 'zen-10', title: '正念静坐', subtitle: '10 分钟', durationSeconds: 600, audioUrl: zenUrl, backgroundIndex: 0 },
  { id: 'chushifan', title: '处世梵', subtitle: '', durationSeconds: 600, audioUrl: chushifanUrl, backgroundIndex: 2 },
  { id: 'cijing', title: '慈经', subtitle: '', durationSeconds: 600, audioUrl: cijingUrl, backgroundIndex: 1 },
];
