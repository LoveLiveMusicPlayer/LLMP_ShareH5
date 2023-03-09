<template>
    <div class="play">
        <share_affix></share_affix>
        <article class="music">
            <div class="music-logo">
                <img
                    :src="
                        info &&
                        info.coverUrl &&
                        info.coverUrl.toString().length > 0
                            ? info.coverUrl
                            : require(`@/assets/images/svg_logo.svg`)
                    "
                    alt=""
                />
            </div>
            <div class="music-text">
                <p class="music-name">{{ info && info.name }}</p>
                <p class="music-sing">{{ info && info.artistName }}</p>
            </div>
            <div class="music-control">
                <div ref="controlBar" class="music-control-bar">
                    <span
                        ref="btnControl"
                        class="control-btn"
                        :style="{ left: String(differenceX + 'px') }"
                        @touchstart="control_btn_touchstart"
                        @touchmove="control_btn_touchmove"
                        @touchend="control_btn_touchend"
                    ></span>
                    <span class="initial-time">{{ duration }}</span>
                    <span class="final-time">{{ info && info.calTime }}</span>
                </div>
                <el-button class="play-btn" @click="playBtnClick">
                    <img
                        :src="
                            isPlaying
                                ? `${require('@/assets/images/pause.svg')}`
                                : `${require('@/assets/images/play.svg')}`
                        "
                        alt=""
                    />
                </el-button>
            </div>
        </article>
        <audio ref="audioRef" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';
import share_affix from '@/components/share-affix/share-affix.vue';
import { useStore } from '@/store/main';
import { IMusicInfo } from '@/store/types';
import timeUtil from '@/utils/timeUtil';

let store = useStore();
let { playInfo, musicInfo } = storeToRefs(store);

/* eslint-disable */
let timeListener: EventListenerOrEventListenerObject;

export default defineComponent({
    components: {
        share_affix,
    },
    setup() {
        const isPlaying = ref(false);
        const info = ref<IMusicInfo>();
        const duration = ref('00:00');
        const audioRef = ref<HTMLAudioElement>();
        const btnControl = ref<HTMLSpanElement>();
        const controlBar = ref<HTMLDivElement>();

        const differenceX = ref(0);
        let startX: number,
            moveX,
            currentLeft = 0;
        // maxMove = controlBar.value!.clientHeight;

        // console.log(maxMove);

        const control_btn_touchstart = (e: any) => {
            startX = e.targetTouches[0].clientX;
        };
        const control_btn_touchmove = (e: any) => {
            moveX = e.targetTouches[0].clientX;
            differenceX.value = moveX - startX + currentLeft;
            const lastPosition = differenceX.value + currentLeft;

            if (lastPosition < 0) {
                differenceX.value = 0;
            }
        };
        const control_btn_touchend = () => {
            currentLeft = differenceX.value;
        };

        const playBtnClick = () => {
            isPlaying.value = !isPlaying.value;
            if (isPlaying.value) {
                audioRef.value!.play();
            } else {
                audioRef.value!.pause();
            }
        };

        timeListener = function (res) {
            const current = res.timeStamp;
            const total = info.value!.time;
            duration.value = timeUtil.millisecondToTime(
                current > total ? total : current,
            );
            btnControl.value!.style.left = timeUtil.musicControlLeftMargin(
                current,
                total,
            );
        };

        store.$subscribe((mutation, state) => {
            info.value = state.musicInfo[0];
        });

        return {
            audioRef,
            playBtnClick,
            isPlaying,
            info,
            duration,
            btnControl,
            controlBar,
            differenceX,
            control_btn_touchstart,
            control_btn_touchmove,
            control_btn_touchend,
        };
    },

    unmounted() {
        this.audioRef!.removeEventListener('timeupdate', timeListener);
    },

    async mounted() {
        this.audioRef?.addEventListener('timeupdate', timeListener, false);
        const info = JSON.parse(playInfo.value);
        await store.getMusicInfo([info.neteaseId]);
        if (this.audioRef != null) {
            this.audioRef.src = musicInfo.value[0].url;
        }
    },
});
</script>

<style scoped lang="less">
@box-shadow-bgc: #d3e0ec;
.music {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .music-logo {
        width: 80vw;
        height: 80vw;
        border-radius: 20px;
        overflow: hidden;
        object-fit: cover;
        box-shadow: 5px 3px 6px 0 @box-shadow-bgc;
        // margin: 5.333vw 0;
        margin: 3vh 0;

        img {
            width: 100%;
        }
    }

    .music-text {
        text-align: center;

        .music-name {
            color: #333;
            font-weight: 600;
            font-size: 4vw;
        }

        .music-sing {
            font-size: 4vw;
            font-weight: 500;
            color: #f940a7;
            margin-top: 1.333vw;
        }

        .music-time {
            font-size: 3.2vw;
            margin-top: 1.333vw;
            font-weight: 500;
            color: #999999;
        }
    }

    .music-control {
        margin-top: 5.267vh;

        .music-control-bar {
            position: relative;
            width: 87vw;
            height: 4px;
            background: #eaf4ff;
            box-shadow: inset 0px 1px 3px 0px #ccddf1;

            .control-btn {
                position: absolute;
                top: -150%;
                width: 4.267vw;
                height: 4.267vw;
                background: #f2f8ff;
                left: 0vw;
                box-shadow: -3px -3px 6px 0px #ffffff, 5px 3px 6px 0px #d3e0ec;
                border-radius: 50%;
            }

            .initial-time,
            .final-time {
                bottom: -640%;
                position: absolute;
                font-size: 3.2vw;
                color: #999999;
                font-weight: 500;
            }

            .initial-time {
                left: 0;
            }

            .final-time {
                right: 0;
            }
        }

        .play-btn {
            display: block;
            width: 21.333vw;
            height: 21.333vw;
            border: none;
            background: #f2f8ff;
            box-shadow: -3px -3px 6px 0px #ffffff, 5px 3px 6px 0px #d3e0ec;
            border-radius: 50%;
            margin: 0 auto;
            margin-top: 5vh;

            svg {
                width: 6.4vw;
                height: 6.4vw;
            }
        }
    }
}
</style>
