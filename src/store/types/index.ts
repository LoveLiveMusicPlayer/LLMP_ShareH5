import {APISong} from './API/info';
import {Datum} from './API/url';

export interface IMusicInfo {
    musicId: string,
    neteaseId: number;
    name: string;
    coverUrl: string;
    artistName: string;
    url: string;
    time: number;
}

// RootState里面有什么东西
export interface IRootState {
    playInfo: string,
    isAndroid: boolean,
    shareKey: string,
    shareInfo: string,
    isPlaying: boolean;
    musicInfo: IMusicInfo[];
}

export {APISong, Datum};
