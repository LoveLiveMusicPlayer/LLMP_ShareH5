export interface IMusicList {
    name: string;
    singName: string;
    id: number;
}

// RootState里面有什么东西
export interface IRootState {
    cdCover: string;
    musicList: IMusicList[];
}
