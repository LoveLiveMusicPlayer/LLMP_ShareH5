export interface IMusicList {
    name: string;
    singName: string;
    id: number;
}

// interface musicInfo {
//     musicName: string[];
//     musicArtistName: string[];
//     musicCoverUrl: string[];
// }

interface musicInfo {
    name: string;
    coverUrl: string;
    artistName: string;
}

// RootState里面有什么东西
export interface IRootState {
    cdCover: string;
    musicList: IMusicList[];
    isPlaying: boolean;
    musicUrl: string;
    musicInfo: musicInfo[];
}
