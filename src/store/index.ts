import { createStore } from 'vuex';
import { IRootState } from './types';
import axios from 'axios';

import {
    getZhushenwudiMusicInfoAPI,
    getZhushenwudiMusicUrlAPI,
} from '@/constant/api';

export default createStore<IRootState>({
    state: {
        isPlaying: false,
        cdCover: '',
        musicList: [
            {
                name: 'Snow halation',
                singName: "μ's",
                id: 1,
            },
            {
                name: '僕らは今のなかで',
                singName: "μ's",
                id: 2,
            },
            {
                name: '未体験HORIZON',
                singName: 'Aqours',
                id: 3,
            },
            {
                name: 'HAPPY PARTY TRAIN',
                singName: 'Aqours',
                id: 4,
            },
            {
                name: '無敵級ビリーバー',
                singName: '虹咲学园学园偶像同好会',
                id: 5,
            },
            {
                name: '永遠の一瞬',
                singName: '虹咲学园学园偶像同好会',
                id: 6,
            },
            {
                name: '始まりは君の空',
                singName: 'Liella',
                id: 7,
            },
            {
                name: 'Tiny Stars',
                singName: 'Liella',
                id: 8,
            },
            {
                name: '永遠の一瞬',
                singName: '虹咲学园学园偶像同好会',
                id: 6,
            },
            {
                name: '始まりは君の空',
                singName: 'Liella',
                id: 7,
            },
            {
                name: 'Tiny Stars',
                singName: 'Liella',
                id: 8,
            },
        ],
        musicUrl: '',
        musicInfo: [],
    },
    getters: {},
    mutations: {
        changeMusicInfo(state, musicInfo: any) {
            state.musicInfo = musicInfo;
        },
    },
    actions: {
        // * 请求音乐数据
        async getMusicInfo({ commit, dispatch }, payload: any) {
            const infoAPI = getZhushenwudiMusicInfoAPI(payload);
            const res = await axios.get(infoAPI);
            // console.log(res.data);

            const songs = res.data.songs;
            const musicInfo: any[] = [];
            songs.forEach((song: any) => {
                musicInfo.push({
                    name: song.name,
                    coverUrl: song.al.picUrl,
                    artistName: song.ar[0].name,
                });
            });
            // console.log(musicInfo);

            commit('changeMusicInfo', musicInfo);
        },
    },
    modules: {},
});
