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
                <div class="music-info">
                    <div>
                        <p class="cd-name">{{ menuName }} </p>
                        <p class="music-size">{{ musicInfo.length }}首歌曲</p>
                    </div>
                    <el-button class="button-play" @click="playBtnClick">
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
                </div>
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
                    <div class="bar-table" style="display: block" v-if="showDetail">
                        <ul>
                            <li class="bar-table-name">歌曲</li>
                            <li class="bar-table-author">歌手</li>
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
                    <section class="list-item" @click="playSelect(index)">
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
let { musicInfo, isMobile } = storeToRefs(store);

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
        const showDetail = ref(false);

        return {
            musicInfo,
            isMobile,
            musicListRef,
            showMusicList,
            offset,
            isBottomShow,
            menuName,
            pic,
            audioRef,
            isPlaying,
            showDetail,
        };
    },

    mounted() {
        this.showDetail = window.innerWidth >= 1024 && !this.isMobile;
        window.addEventListener('resize', this.handleResize);
        this.fetchData();
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    methods: {
        handleResize() {
            this.showDetail = window.innerWidth >= 1024 && !this.isMobile;
        },

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
/* 样式适用于小屏幕设备，如手机 */
@box-shadow-bgc: #d3e0ec;
.share-player {
    width: 100%;
    margin-top: 8vh;

    .cd {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .cd-logo {
            width: 35vh;
            height: 35vh;
            max-width: 300px;
            max-height: 300px;
            border-radius: 20px;
            overflow: hidden;
            object-fit: cover;
            box-shadow: 5px 3px 6px 0 @box-shadow-bgc;
            margin-top: 3vh;
            margin-bottom: 3vh;

            img {
                width: 100%;
            }
        }

        .music-info {
            display: none;
        }

        .cd-name {
            color: #333;
            font-weight: 600;
            font-size: 2.5vh;
            max-font-size: 24px;
        }
    }

    .player-bar {
        width: 100%;
        height: 8vh;
        max-height: 8vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        background-color: #f2f8ff;

        .bar-left {
            display: flex;
            align-items: center;

            .bar-play {
                width: 70px;
                height: 32px;
                background: linear-gradient(270deg, #f940a7 0%, #ff86c9 100%);
                box-shadow: 5px 3px 6px 0 @box-shadow-bgc,
                    -3px -3px 6px 0px #ffffff;
                border-radius: 20px;
                overflow: hidden;

                .bar-play-div {
                    img {
                        width: 20px;
                    }
                }
            }

            .bar-list-total {
                margin-left: 2.667vw;
                color: #333;
                font-weight: 600;
                font-size: 2.5vh;
                max-font-size: 24px;
            }
        }
    }
}

.share-music-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .music-list {
        max-width: 476px;
        padding: 0 12px;
        .list-item {
            width: 100%;
            padding: 0 24px;
            height: 80px;
            display: flex;
            margin: 12px 0;

            .list-img {
                flex-shrink: 0;
                width: 80px;
                height: 80px;
                object-fit: cover;
                overflow: hidden;
                border-radius: 10px;
                margin-right: 12px;

                img {
                    width: 100%;
                }
            }

            .list-message {
                .list-name {
                    max-width: 396px;
                    font-weight: bold;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .list-sing {
                    margin-top: 4px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
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
@media screen and (max-width: 390px) {
    /* 样式适用于迷你尺寸的移动设备 */
    @box-shadow-bgc: #d3e0ec;
    .share-music-list {
        .music-list {
            width: 100%;
            padding: 0;
            .list-item {
                padding: 0 12px;
                height: 60px;

                .list-img {
                    width: 60px;
                    height: 60px;

                    img {
                        width: 100%;
                    }
                }

                .list-message {
                    .list-name {
                        font-size: 16px;
                    }
                }
            }
        }

        .share-player{
            width: 100%;
            .cd-logo {
                width: 85vw;
                height: 85vw;
                max-width: 300px;
                max-height: 300px;
            }
            .player-bar {
                .bar-left {
                    .bar-play {
                        width: 60px;
                        height: 28px;
                    }
                }
            }
        }
    }
}
</style>

<style scoped lang="less">
@media screen and (min-width: 1024px) {
    @box-shadow-bgc: #d3e0ec;
    /* 样式适用于大屏幕设备，如桌面电脑 */
    .share-music-list {
        max-width: 1024px;
        margin: 0 auto;
        .share-player {
            .cd {
                flex-direction: row;
                align-items: stretch;
                .cd-logo {
                    width: 250px;
                    height: 250px;
                    margin: 40px;
                }
                .music-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-evenly;
                    .cd-name {
                        font-size: 30px;
                    }
                    .music-size {
                        font-size: 20px;
                        margin-top: 10px;
                    }
                    .button-play {
                        width: 60px;
                        height: 60px;
                        background: linear-gradient(270deg, #f940a7 0%, #ff86c9 100%);
                        box-shadow: 5px 3px 6px 0 @box-shadow-bgc,
                            -3px -3px 6px 0px #ffffff;
                        border-radius: 30px;
                        overflow: hidden;

                        .bar-play-div {
                            img {
                                width: 30px;
                            }
                        }
                    }
                }

            }

            .player-bar {
                height: fit-content;
                display: flex;
                align-items: center;
                padding: 0;

                .bar-left {
                    width: 0%;
                    height: 40px;

                    .bar-play {
                        display: none;
                    }
                    .bar-list-total {
                        display: none;
                    }
                }
                .bar-table {
                    width: 100%;
                    ul {
                        display: flex;
                        color: #000;
                        li {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            height: 50px;
                            font-size: 18px;
                            &:nth-child(1) {
                                flex: 3;
                            }
                            &:nth-child(2),
                            &:nth-child(3) {
                                flex: 2;
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
                max-width: 1024px;
                .list-item {
                    padding: 0;
                    height: 80px;
                    img {
                        display: block;
                        width: 80px;
                        height: 80px;
                        margin-right: 28px;
                    }
                    .list-message {
                        display: flex;
                        align-items: center;
                        width: 100%;

                        .list-name {
                            width: 600px;
                            max-width: 600px;
                            padding: 0;
                            margin: 0;
                        }
                        .list-sing {
                            width: 200px;
                            font-size: 24px;
                            margin: 0;
                        }
                    }
                }
            }
        }
    }
}
</style>
