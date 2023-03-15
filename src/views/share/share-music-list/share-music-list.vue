<template>
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
                                        ? `${require('@/assets/images/pause.svg')}`
                                        : `${require('@/assets/images/play.svg')}`
                                "
                                alt=""
                            />
                        </div>
                    </el-button>
                    <span class="bar-list-total">{{ musicInfo.length }}首歌曲</span>
                </div>
            </article>
        </el-affix>
    </div>
    <div class="share-music-list">
        <div class="music-list">
            <template
                v-for="(musicItem, index) in musicInfo"
                :key="musicItem.musicId">
                <section class="list" @click="playSelect(index)">
                    <img :src="musicItem.coverUrl" alt="" class="list-img"/>
                    <div class="list-message">
                        <h2 class="list-name">{{ musicItem.name }}</h2>
                        <p class="list-sing">{{ musicItem.artistName }}</p>
                    </div>
                </section>
            </template>
        </div>
        <el-button class="load-more" @click="onLoadMore">点击加载更多歌曲</el-button>
    </div>
    <audio-player
        ref="audioRef"
        :audio-list="musicInfo.map((e) => e.url)"
        :before-play="handleBeforePlay"
        :show-progress-bar="false"
        :show-my-play-button="false"
        @play="() => (isPlaying = true)"
        @play-error="() => (isPlaying = false)"
        @pause="() => (isPlaying = false)"
    />
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from 'vue';
import {useStore} from '@/store/main';
import {storeToRefs} from 'pinia';
import AudioPlayer from 'components/audio-player/audio-player.vue';

const store = useStore();
let {musicInfo} = storeToRefs(store);

export default defineComponent({
    name: 'share-music-list',
    components: {
        AudioPlayer,
    },

    setup() {
        const audioRef = ref();
        const menuName = ref('');
        const pic = ref('');
        const isPlaying = ref(false);
        const newMusicInfo = reactive({});

        store.$subscribe((mutation, state) => {
            musicInfo.value = state.musicInfo;
            if (musicInfo.value.length > 0) {
                pic.value = musicInfo.value[0].coverUrl;
            }
        });

        return {
            musicInfo,
            newMusicInfo,
            menuName,
            pic,
            audioRef,
            isPlaying,
        };
    },

    async mounted() {
        await store.getShareInfo(store.shareKey);
        const info = JSON.parse(store.shareInfo);
        this.menuName = info.menuName;

        const musicIdMap = new Map();
        const nameMap = new Map();
        info.musicList.forEach((music: any) => {
            nameMap.set(parseInt(music.neteaseId), music.name);
            musicIdMap.set(parseInt(music.neteaseId), music._id);
        });

        // 发送网络请求获取音乐数据
        await store.getMusicInfo(nameMap, musicIdMap);
        this.newMusicInfo = this.musicInfo.slice(0, 1);
    },

    methods: {
        handleBeforePlay(next: any) {
            this.pic = this.musicInfo[this.audioRef.currentPlayIndex].coverUrl;
            next();
        },

        playSelect(index: number) {
            this.audioRef.currentPlayIndex = index;
            this.$nextTick(() => {
                this.audioRef.play();
            });
        },

        playBtnClick() {
            if (this.isPlaying) {
                this.audioRef.pause();
            } else {
                this.audioRef.play();
            }
        },

        onLoadMore() {
            let offset = 1;
            offset += 1;
            const oldMusicInfo = this.newMusicInfo;
            const newMusicInfo = this.musicInfo.slice(0, offset);
            this.newMusicInfo = {
                ...oldMusicInfo,
                ...newMusicInfo,
            };
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
                    text-indent: -80px;

                    img {
                        width: 4.5vw;
                        -webkit-filter: drop-shadow(40px 0px #fff);
                        filter: drop-shadow(40px 0px #fff);
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
    margin-bottom: 50px;
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
        margin-top: 5.333vw;
        margin-bottom: 30px;
        background-color: transparent;
        border: none;
        font-size: 3.6vw;
        color: #999;
    }
}
</style>
