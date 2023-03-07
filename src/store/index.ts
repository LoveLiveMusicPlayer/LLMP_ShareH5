import { defineStore } from 'pinia';
import axios from 'axios';

import {
    getZhushenwudiMusicInfoAPI,
    getZhushenwudiMusicUrlAPI,
} from '@/constant/api';

// * types
import type { APISong, Datum, IMusicInfo, IRootState } from './types';

export const useStore = defineStore('main', {
    state: (): IRootState => {
        return {
            isPlaying: false as boolean,
            musicUrl: [] as string[],
            musicInfo: [] as IMusicInfo[],
        };
    },
    actions: {
        // * 请求歌单列表数据
        async getMusicInfo(payload: number[]) {
            const infoAPI = getZhushenwudiMusicInfoAPI(payload);
            const res = await axios.get(infoAPI);

            const songs = res.data.songs;
            const musicInfo: IMusicInfo[] = [];
            songs.forEach((song: APISong) => {
                musicInfo.push({
                    name: song.name,
                    coverUrl: song.al.picUrl,
                    artistName: song.ar[0].name,
                });
            });

            this.musicInfo = musicInfo;
        },
        // * 请求音乐播放链接
        async getMusicUrl(payload: number[]) {
            const urlAPI = getZhushenwudiMusicUrlAPI(payload);
            const res = await axios.get(urlAPI);

            const datas = res.data.data;
            const musicUrl: string[] = [];
            datas.forEach((data: Datum) => {
                musicUrl.push(data.url);
            });

            this.musicUrl = musicUrl;
        },
    },
});
