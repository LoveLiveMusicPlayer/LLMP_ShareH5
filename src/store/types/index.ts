export interface IMusicList {
    name: string;
    singName: string;
    id: number;
}

export interface IRootState {
    musicList: IMusicList[];
}
