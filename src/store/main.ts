import {defineStore} from 'pinia';
import axios from 'axios';
import {getShareKV, getZhushenwudiMusicInfoAPI, getZhushenwudiMusicUrlAPI,} from '@/constant/api';

// * types
import type {APISong, Datum, IMusicInfo, IRootState} from './types';

axios.interceptors.request.use(
    (config: any) => {
        // console.log('请求地址:', config.url);
        return config;
    },
    (err: any) => {
        console.log(err);
        return err;
    },
);

axios.interceptors.response.use(
    (res: any) => {
        return res;
    },
    (err: any) => {
        return err;
    },
);

export const useStore = defineStore('main', {
    state: (): IRootState => {
        return {
            playInfo: '' as string,
            shareKey: '' as string,
            shareInfo: '' as string,
            isPlaying: false as boolean,
            isAndroid: false as boolean,
            musicInfo: [] as IMusicInfo[],
        };
    },
    persist: {
        // 自定义持久化方式
        storage: window.localStorage,
    },
    actions: {
        // 保存单曲页入参
        savePlayInfo(payload: string) {
            if (payload && payload.length > 0) {
                this.playInfo = payload;
            }
        },

        // 保存歌单页入参
        saveShareKey(payload: string) {
            if (payload && payload.length > 0) {
                this.shareKey = payload;
            }
        },

        saveIsAndroid(isAndroid: boolean) {
            this.isAndroid = isAndroid;
        },

        // * 请求歌单列表数据
        async getMusicInfo(
            nameMap: Map<number, string>,
            musicIdMap: Map<number, string>,
        ) {
            const infoAPI = getZhushenwudiMusicInfoAPI([...musicIdMap.keys()]);
            const resp1 = await axios.get(infoAPI);
            const urlAPI = getZhushenwudiMusicUrlAPI([...musicIdMap.keys()]);
            const resp2 = await axios.get(urlAPI);

            if (resp1.data.code == 200 && resp2.data.code == 200) {
                const data1 = resp1.data.songs;
                const data2 = resp2.data.data;
                const musicInfo: IMusicInfo[] = [];

                data1.forEach((song1: APISong) => {
                    data2.forEach((song2: Datum) => {
                        if (song1.id == song2.id) {
                            const musicId = musicIdMap.get(song2.id);
                            if (musicId) {
                                musicInfo.push({
                                    musicId: musicId,
                                    neteaseId: song1.id,
                                    name:
                                        nameMap.get(song2.id) ?? song1.al.name,
                                    coverUrl: song1.al.picUrl,
                                    artistName: song1.ar[0].name,
                                    url: song2.url,
                                    time: song2.time,
                                });
                            }
                        }
                    });
                });
                this.musicInfo = musicInfo;
            }
        },

        async getShareInfo(key: string) {
            if (key.length === 0) {
                return;
            }
            const resp = await axios.post(getShareKV(), {"key": key});

            if (resp.data.success) {
                this.shareInfo = resp.data.value
            }
        }
    },
});
