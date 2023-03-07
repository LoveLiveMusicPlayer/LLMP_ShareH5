import { APISong } from './api';
export interface IMusicInfo {
    name: string;
    coverUrl: string;
    artistName: string;
}

// RootState里面有什么东西
export interface IRootState {
    isPlaying: boolean;
    musicUrl: string;
    musicInfo: IMusicInfo[];
}

export { APISong };
