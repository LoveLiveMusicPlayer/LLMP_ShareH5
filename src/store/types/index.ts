import {APISong} from './API/info';
import {Datum} from './API/url';

export interface IMusicInfo {
    id: number;
    name: string;
    coverUrl: string;
    artistName: string;
    url: string;
    time: number;
    calTime: string;
}

// RootState里面有什么东西
export interface IRootState {
    playInfo: string,
    shareInfo: string,
    isPlaying: boolean;
    musicInfo: IMusicInfo[];
}

export {APISong, Datum};
