<template>
    <div class="play">
        <share_affix></share_affix>
        <article class="music">
            <div class="music-logo">
                <img
                    src="@/assets/images/cd-img/Aqours/未体験HORIZON.jpg"
                    alt=""
                />
            </div>
            <div class="music-text">
                <p class="music-name">未体験HORIZON</p>
                <p class="music-sing">Aqours</p>
                <p class="music-time">二次元·2021.05.20</p>
            </div>
            <div class="music-control">
                <div ref="control_bar" class="music-control-bar">
                    <span
                        ref="control_btn"
                        @touchstart="control_btn_touchstart"
                        @touchmove="control_btn_touchmove"
                        @touchend="control_btn_touchend"
                        class="control-btn"
                        :style="{ left: differenceX + 'px' }"
                    ></span>
                </div>
                <el-button class="play-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                    >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
                        />
                    </svg>
                </el-button>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import share_affix from '@/components/share-affix/share-affix.vue';

export default defineComponent({
    components: {
        share_affix,
    },
    setup() {
        const control_bar = ref<HTMLDivElement>();
        const control_btn = ref<HTMLSpanElement>();

        let differenceX = ref(0);
        let startX: number,
            moveX,
            currentLeft = 0;
        // maxMove = control_bar.value!.offsetWidth;

        const control_btn_touchstart = (e: any) => {
            startX = e.targetTouches[0].clientX;
        };
        const control_btn_touchmove = (e: any) => {
            moveX = e.targetTouches[0].clientX;
            differenceX.value = moveX - startX;
            let lastPosition = differenceX.value + currentLeft;

            if (lastPosition < 0) {
                differenceX.value = 0;
            }
            // else if (lastPosition > maxMove) {
            //     differenceX.value = maxMove;
            // }
        };
        const control_btn_touchend = () => {
            currentLeft = differenceX.value;
            console.log(currentLeft);
        };

        return {
            control_bar,
            control_btn,
            control_btn_touchstart,
            control_btn_touchmove,
            control_btn_touchend,
            differenceX,
        };
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