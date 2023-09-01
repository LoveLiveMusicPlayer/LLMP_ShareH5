import {APISong} from './API/info';
import {Datum} from './API/url';

export interface IMusicInfo {
    musicId: string,
    neteaseId: number | null;
    name: string;
    coverUrl: string;
    artistName: string;
    url: string;
    time: number;
}

export interface ILatestPlayingMusic {
    musicId: string,
    shareKey: string
}

// RootState里面有什么东西
export interface IRootState {
    playInfo: string,
    isAndroid: boolean,
    isMobile: boolean,
    shareKey: string,
    shareInfo: string,
    isPlaying: boolean;
    musicInfo: IMusicInfo[];
    latestPlayingMusic: ILatestPlayingMusic;
}

export {APISong, Datum};
