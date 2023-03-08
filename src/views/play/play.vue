<template>
    <div class="play">
        <share_affix></share_affix>
        <article class="music">
            <div class="music-logo">
                <!-- <img
                    :src="
                        require(`@/assets/images/cd-img/${$route.query.singName}/${$route.query.name}.jpg`)
                    "
                    alt=""
                /> -->
            </div>
            <div class="music-text">
                <!-- <p class="music-name">{{ $route.query.name }}</p> -->
                <!-- <p class="music-sing">{{ $route.query.singName }}</p> -->
                <p class="music-time">二次元·2021.05.20</p>
            </div>
            <div class="music-control">
                <div ref="control_bar" class="music-control-bar">
                    <span ref="control_btn" class="control-btn"></span>
                    <span class="initial-time">0:00</span>
                    <span class="final-time">3:45</span>
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
        <audio ref="audioRef">
            <source
                :src="require(`@/assets/audio/${$route.query.name}.mp3`)"
                type=""
            />
        </audio>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import share_affix from '@/components/share-affix/share-affix.vue';

export default defineComponent({
    components: {
        share_affix,
    },
    setup() {
        let isPlaying = ref(false);
        const audioRef = ref<HTMLAudioElement>();
        const playBtnClick = () => {
            isPlaying.value = !isPlaying.value;
            if (isPlaying.value) {
                audioRef.value!.play();
            } else {
                audioRef.value!.pause();
            }
        };
        return { audioRef, playBtnClick, isPlaying };
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
        box-shadow: 5px 3px 6px 0px @box-shadow-bgc;
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
            width: 91.467vw;
            // width: 51.467vw;
            height: 4px;
            background: #eaf4ff;
            box-shadow: inset 0px 1px 3px 0px #ccddf1;

            .control-btn {
                position: absolute;
                top: -150%;
                width: 4.267vw;
                height: 4.267vw;
                background: #f2f8ff;
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
