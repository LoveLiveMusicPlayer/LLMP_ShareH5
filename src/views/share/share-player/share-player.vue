<template>
    <div class="share-player">
        <article class="cd">
            <div class="cd-logo">
                <img src="@/assets/images/me-logo.jpg" alt="" />
            </div>
            <p class="cd-name">这是一个歌单的名称</p>
        </article>
        <el-affix :offset="60">
            <article class="player-bar">
                <div class="bar-left">
                    <el-button class="bar-play">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                        >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                                d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
                                fill="rgba(255,255,255,1)"
                            />
                        </svg>
                    </el-button>
                    <span class="bar-list-total">120首歌曲</span>
                </div>
                <div class="bar-add-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                    >
                        <path fill="none" d="M0 0H24V24H0z" />
                        <path
                            d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z"
                            fill="rgba(144,146,148,1)"
                        />
                    </svg>
                    <span>去LLMP添加此歌单</span>
                </div>
            </article>
        </el-affix>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const meLogo = require('@/assets/images/me-logo.jpg');
        return { meLogo };
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
            box-shadow: 5px 3px 6px 0px @box-shadow-bgc;
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
                box-shadow: 5px 3px 6px 0px #d3e0ec, -3px -3px 6px 0px #ffffff;
                border-radius: 20px;

                svg {
                    width: 4.5vw;
                }
            }
            .bar-list-total {
                color: #333;
                font-size: 3.5vw;
                margin-left: 2.667vw;
                font-weight: 600;
            }
        }

        .bar-add-btn {
            display: flex;
            align-items: center;

            svg {
                width: 4.5vw;
                margin-right: 0.2vw;
            }
            span {
                color: #999;
                font-size: 3.5vw;
            }
        }
    }
}
</style>
