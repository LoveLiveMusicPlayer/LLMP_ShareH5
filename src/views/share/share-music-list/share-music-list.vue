<template>
    <div class="share-music-list">
        <div class="share-player">
            <article class="cd">
                <div class="cd-logo">
                    <img
                        :src="
                            pic.length
                                ? pic
                                : `${require('@/assets/images/svg_logo.svg')}`
                        "
                        alt=""
                    />
                </div>
                <p class="cd-name">{{ menuName }}</p>
            </article>
            <el-affix :offset="60">
                <article class="player-bar">
                    <div class="bar-left">
                        <el-button class="bar-play" @click="playBtnClick">
                            <div class="bar-play-div">
                                <img
                                    :src="
                                        isPlaying
                                            ? `${require('@/assets/images/pause_light.svg')}`
                                            : `${require('@/assets/images/play_light.svg')}`
                                    "
                                    alt=""
                                />
                            </div>
                        </el-button>
                        <span class="bar-list-total"
                            >{{ musicInfo.length }}首歌曲</span
                        >
                    </div>
                    <div class="bar-table" style="display: block">
                        <ul>
                            <li class="bar-table-name">歌曲</li>
                            <li class="bar-table-author">歌手</li>
                            <li class="bar-table-album">专辑</li>
                            <li class="bar-table-time">时长</li>
                        </ul>
                    </div>
                </article>
            </el-affix>
        </div>
        <div class="share-music-list">
            <div class="music-list" ref="musicListRef">
                <template
                    v-for="(musicItem, index) in showMusicList"
                    :key="musicItem.musicId"
                >
                    <section class="list" @click="playSelect(index)">
                        <img
                            :src="musicItem.coverUrl"
                            alt=""
                            class="list-img"
                        />
                        <div class="list-message">
                            <h2 class="list-name" :style="renderText(index)">
                                {{ musicItem.name }}
                            </h2>
                            <p class="list-sing" :style="renderText(index)">
                                {{ musicItem.artistName }}
                            </p>
                        </div>
                    </section>
                </template>
            </div>
            <el-button class="load-more" @click="onLoadMore" v-if="isBottomShow"
                >点击加载更多歌曲
            </el-button>
        </div>
        <audio-player
            ref="audioRef"
            :audio-list="musicInfo.map((e) => e.url)"
            :before-play="handleBeforePlay"
            :after-play="handleAfterPlay"
            :show-progress-bar="false"
            :show-my-play-button="false"
            @play="() => (isPlaying = true)"
            @play-error="handlePlayError"
            @pause="() => (isPlaying = false)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store/main';
import { storeToRefs } from 'pinia';
import AudioPlayer from 'components/audio-player/audio-player.vue';
import { IMusicInfo } from '@/store/types';
import { ElMessage } from 'element-plus';

const LIMIT = 20;

const store = useStore();
let { musicInfo } = storeToRefs(store);

export default defineComponent({
    name: 'share-music-list',
    components: {
        AudioPlayer,
    },

    setup() {
        const audioRef = ref();
        const musicListRef = ref<HTMLElement>();
        const menuName = ref('');
        const pic = ref('');
        const showMusicList = ref<IMusicInfo[]>([]);
        const isPlaying = ref(false);
        const offset = ref(0); // 抽取音乐列表数据时使用的偏移量
        const isBottomShow = ref(false); // 是否显示'加载更多'文字

        return {
            musicInfo,
            musicListRef,
            showMusicList,
            offset,
            isBottomShow,
            menuName,
            pic,
            audioRef,
            isPlaying,
        };
    },

    mounted() {
        this.fetchData();
    },

    methods: {
        async fetchData() {
            await store.getShareInfo(store.shareKey);
            try {
                const info = JSON.parse(store.shareInfo);
                this.menuName = info.menuName;

                const musicIdMap = new Map();
                const nameMap = new Map();
                const nullMap = new Set<any>();
                info.musicList.forEach((music: any) => {
                    nameMap.set(parseInt(music.neteaseId), music.name);
                    if (music.neteaseId == null) {
                        nullMap.add(music);
                    } else {
                        musicIdMap.set(parseInt(music.neteaseId), music._id);
                    }
                });
                // 发送网络请求获取音乐数据
                await store.getMusicInfo(nameMap, musicIdMap, nullMap);
                this.showMusicList = this.musicInfo.slice(0, LIMIT);

                if (this.musicInfo.length > 0) {
                    if (store.latestPlayingMusic.shareKey == store.shareKey) {
                        const latestMusicIndex = this.musicInfo.findIndex(
                            (info) =>
                                info.musicId ==
                                store.latestPlayingMusic.musicId,
                        );

                        if (latestMusicIndex > 0) {
                            this.pic =
                                this.musicInfo[latestMusicIndex].coverUrl;
                            this.audioRef.currentPlayIndex = latestMusicIndex;
                        }
                    } else {
                        this.pic = this.musicInfo[0].coverUrl;
                    }
                    setTimeout(() => this.audioRef.play(), 1000);
                }

                if (this.musicInfo.length > LIMIT) {
                    this.isBottomShow = true;
                }
            } catch (e) {
                ElMessage.error('获取链接异常');
                this.menuName = '';
                this.pic = '';
                this.musicInfo = [];
                this.showMusicList = [];
            }
        },

        handleBeforePlay(next: any) {
            const music = this.musicInfo[this.audioRef.currentPlayIndex];
            this.pic = music.coverUrl;
            next();
        },

        handleAfterPlay() {
            const music = this.musicInfo[this.audioRef.currentPlayIndex];
            store.saveLatestPlayingMusic(store.shareKey, music.musicId);
        },

        handlePlayError(data: any) {
            this.isPlaying = false;
            const music = this.musicInfo[this.audioRef.currentPlayIndex];
            const isSourceNull = music.neteaseId == null;
            if (isSourceNull) {
                store.saveLatestPlayingMusic(store.shareKey, music.musicId);
                return;
            }
            window.location.reload();
        },

        playSelect(index: number) {
            if (this.audioRef.currentPlayIndex === index) {
                this.playBtnClick();
                return;
            }
            this.audioRef.currentPlayIndex = index;
            this.$nextTick(() => this.audioRef.play());
        },

        playBtnClick() {
            if (this.isPlaying) {
                this.audioRef.pause();
            } else {
                this.audioRef.play();
            }
        },

        onLoadMore() {
            this.offset += LIMIT;
            const appendMusicList = this.musicInfo.slice(
                this.offset,
                this.offset + LIMIT,
            );

            this.showMusicList = [...this.showMusicList, ...appendMusicList];

            if (
                this.musicInfo.length - this.musicListRef!.children.length <
                LIMIT
            ) {
                this.isBottomShow = false;
            }
        },

        renderText(index: number) {
            const mIndex = this.audioRef.currentPlayIndex;
            if (mIndex == null) {
                return;
            }
            return mIndex === index ? 'color: #FFAE00' : 'color: black';
        },
    },
});
</script>

<style scoped lang="less">
@box-shadow-bgc: #d3e0ec;
.share-player {
    width: 100%;

    .cd {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .cd-logo {
            width: 64vw;
            height: 64vw;
            border-radius: 20px;
            overflow: hidden;
            object-fit: cover;
            box-shadow: 5px 3px 6px 0 @box-shadow-bgc;
            margin: 5.333vw 0;

            img {
                width: 100%;
            }
        }

        .cd-name {
            color: #333;
            font-weight: 600;
            line-height: 24px;
        }
    }

    .player-bar {
        width: 100%;
        height: 17.067vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 3.2vw;
        background-color: #f2f8ff;

        .bar-left {
            display: flex;
            align-items: center;

            .bar-play {
                width: 14.933vw;
                height: 6.4vw;
                background: linear-gradient(270deg, #f940a7 0%, #ff86c9 100%);
                box-shadow: 5px 3px 6px 0 @box-shadow-bgc,
                    -3px -3px 6px 0px #ffffff;
                border-radius: 20px;
                overflow: hidden;

                .bar-play-div {
                    img {
                        width: 4.5vw;
                    }
                }
            }

            .bar-list-total {
                color: #333;
                font-size: 3.5vw;
                margin-left: 2.667vw;
                font-weight: 600;
            }
        }
    }
}

.share-music-list {
    width: 100%;
    display: flex;
    flex-direction: column;

    .music-list {
        .list {
            width: 100%;
            padding: 0 3.2vw;
            height: 48px;
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .list-img {
                width: 12.8vw;
                height: 12.8vw;
                object-fit: cover;
                overflow: hidden;
                border-radius: 10px;
                margin-right: 2.667vw;

                img {
                    width: 100%;
                }
            }

            .list-message {
                .list-name {
                    font-size: 4vw;
                    font-weight: bold;
                    color: #333;
                }

                .list-sing {
                    color: #999;
                    font-size: 3.2vw;
                }
            }
        }
    }

    .load-more {
        margin-bottom: 3.333vw;
        background-color: transparent;
        border: none;
        font-size: 3.6vw;
        color: #999;
    }
}
</style>

<style scoped lang="less">
@media screen and (min-width: 1267px) {
    .share-music-list {
        max-width: 1200px;
        margin: 0 auto;
        .share-player {
            .cd {
                flex-direction: row;
                align-items: stretch;
                .cd-logo {
                    width: 250px;
                    height: 250px;
                    margin: 40px 65px 35px 0;
                }
                .cd-name {
                    // margin: 7.633vw 0;
                    padding: 80px 0;
                    font-size: 31px;
                }
            }
            .player-bar {
                height: fit-content;
                flex-direction: column;
                padding: 0 80px;
                .bar-left {
                    width: 100%;
                    flex-direction: row;

                    .bar-play {
                        width: 80px;
                        height: 34px;
                        border-radius: 10px;

                        img {
                            width: 24px;
                        }
                    }
                    .bar-list-total {
                        font-size: 18px;
                        font-weight: normal;
                        display: block;
                        margin-left: 20px;
                    }
                }
                .bar-table {
                    width: 100%;
                    margin-top: 20px;
                    ul {
                        display: flex;
                        color: #999;
                        li {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            height: 50px;
                            font-size: 1vw;
                            &:nth-child(1) {
                                flex: 3;
                            }
                            &:nth-child(2),
                            &:nth-child(3) {
                                flex: 1;
                            }
                            &:nth-child(4) {
                                flex: 2;
                            }
                        }
                    }
                }
            }
        }
        .share-music-list {
            .music-list {
                height: 50px;
                .list {
                    padding: 0;
                    height: 100%;
                    img {
                        display: block;
                        width: 55px !important;
                        height: 100%;
                        margin-right: 28px;
                    }
                    .list-message {
                        display: flex;
                        width: 100%;
                        .list-name,
                        .list-sing {
                            font-size: 18px;
                        }
                        .list-name {
                            width: 445px;
                        }
                    }
                }
            }
        }
    }
}
</style>
