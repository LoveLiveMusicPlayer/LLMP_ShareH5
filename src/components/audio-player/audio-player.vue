<template>
    <div class="audio-player">
        <div class="audio__btn-wrap">
            <div
                v-if="showPlaybackRate"
                class="audio__play-rate"
                :style="{
                    color: themeColor,
                }"
            >
                <span @click.stop="isShowRates = !isShowRates">{{
                    playbackRate.toFixed(1) + 'x'
                }}</span>
                <transition name="fade-rate">
                    <div
                        v-show="isShowRates"
                        class="audio__play-rate__dropdown"
                        :style="{
                            backgroundColor: themeColor,
                        }"
                    >
                        <div
                            v-for="rate in playbackRates"
                            :key="'pr_' + rate"
                            @click.stop="handleSetPlaybackRate(rate)"
                        >
                            {{ rate.toFixed(1) + 'x' }}
                        </div>
                    </div>
                </transition>
            </div>

            <div
                v-if="showPrevButton"
                class="audio__play-prev"
                :class="{ disable: !isLoop && currentPlayIndex === 0 }"
                @click.stop="playPrev"
                :style="{
                    color: themeColor,
                }"
            >
                <slot name="play-prev">
                    <svg class="audio__play-icon" aria-hidden="true">
                        <use xlink:href="#icon-play-prev" />
                    </svg>
                </slot>
            </div>

            <div v-if="isLoading" style="visibility: hidden">
                <span
                    v-for="item in 8"
                    :key="item"
                    :style="{
                        backgroundColor: themeColor,
                    }"
                />
            </div>

            <template v-else>
                <div
                    v-if="!isPlaying && showPlayButton"
                    class="audio__play-start"
                    @click.stop="play"
                    :style="{
                        color: themeColor,
                    }"
                >
                    <slot name="play-start">
                        <svg class="audio__play-icon" aria-hidden="true">
                            <use xlink:href="#icon-play" />
                        </svg>
                    </slot>
                </div>

                <div
                    v-else-if="showPlayButton"
                    class="audio__play-pause"
                    @click.stop="pause"
                    :style="{
                        color: themeColor,
                    }"
                >
                    <slot name="play-pause">
                        <svg class="audio__play-icon" aria-hidden="true">
                            <use xlink:href="#icon-play-pause" />
                        </svg>
                    </slot>
                </div>
            </template>

            <div
                v-if="showNextButton"
                class="audio__play-next"
                :class="{
                    disable:
                        !isLoop && currentPlayIndex === audioList.length - 1,
                }"
                @click.stop="playNext"
                :style="{
                    color: themeColor,
                }"
            >
                <slot name="play-next">
                    <svg class="audio__play-icon" aria-hidden="true">
                        <use xlink:href="#icon-play-next" />
                    </svg>
                </slot>
            </div>

            <div v-if="showVolumeButton" class="audio__play-volume-icon-wrap">
                <svg
                    class="audio__play-icon"
                    aria-hidden="true"
                    :style="{
                        color: themeColor,
                    }"
                    @click.stop="handleVolumeIconTouchstart"
                >
                    <use
                        :xlink:href="
                            currentVolume
                                ? `#icon-play-volume`
                                : `#icon-play-volume-no`
                        "
                    />
                </svg>

                <transition name="fade-volume">
                    <div
                        v-show="isShowVolume"
                        ref="playVolumeWrap"
                        class="audio__play-volume-wrap"
                        @click.stop="handleVolumePanmove"
                        @panmove="handleVolumePanmove"
                        @panend="handleVolumePanend"
                    >
                        <div
                            ref="playVolume"
                            class="audio__play-volume"
                            :style="{
                                height: currentVolume * 100 + '%',
                                backgroundColor: themeColor,
                            }"
                        />
                    </div>
                </transition>
            </div>
        </div>

        <div
            v-show="showProgressBar"
            ref="audioProgressWrap"
            class="audio__progress-wrap"
            @click.stop="handleClickProgressWrap"
        >
            <div
                ref="audioProgress"
                class="audio__progress"
                :style="{
                    backgroundColor: themeColor,
                }"
            />
            <div
                ref="audioProgressPoint"
                class="audio__progress-point"
                :style="{
                    backgroundColor: themeColor,
                    boxShadow: `0 0 10px 0 ${themeColor}`,
                }"
                @panstart="handleProgressPanstart"
                @panend="handleProgressPanend"
                @panmove="handleProgressPanmove"
            />
        </div>

        <div v-show="showProgressBar" class="audio__time-wrap">
            <div class="audio__current-time">
                {{ currentTimeFormatted }}
            </div>
            <div class="audio__duration">
                {{ durationFormatted }}
            </div>
        </div>

        <audio
            ref="audio"
            class="audio-player__audio"
            :src="
                audioList && audioList.length > 0 && audioList[currentPlayIndex]
            "
            v-bind="$attrs"
            @ended="onEnded"
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedmetadata"
        >
            浏览器太老咯，请升级浏览器吧~
        </audio>

        <div
            class="play-btn"
            @click.stop="playBtnClick"
            v-if="showMyPlayButton"
        >
            <img
                :src="
                    isPlaying
                        ? `${require('@/assets/images/pause.svg')}`
                        : `${require('@/assets/images/play.svg')}`
                "
                alt=""
            />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Core from '@any-touch/core';
import Pan from '@any-touch/pan';

export default defineComponent({
    name: 'audio-player',

    inheritAttrs: false,

    props: {
        // 音频播放列表
        audioList: {
            default: null,
            type: Array,
        },

        // 是否显示播放按钮
        showPlayButton: {
            default: false,
            type: Boolean,
        },

        // 是否显示播放按钮
        showMyPlayButton: {
            default: true,
            type: Boolean,
        },

        // 是否显示上一首按钮
        showPrevButton: {
            default: false,
            type: Boolean,
        },

        // 是否显示下一首按钮
        showNextButton: {
            default: false,
            type: Boolean,
        },

        // 是否显示音量按钮
        showVolumeButton: {
            default: false,
            type: Boolean,
        },

        // 显示进度条
        showProgressBar: {
            default: true,
            type: Boolean,
        },

        // 播放前的回调函数
        beforePlay: {
            default: null,
            type: Function,
        },

        afterPlay: {
            default: null,
            type: Function,
        },

        // 上一首前的回调函数
        beforePrev: {
            default: null,
            type: Function,
        },

        // 下一首前的回调函数
        beforeNext: {
            default: null,
            type: Function,
        },

        // 是否列表循环播放
        isLoop: {
            type: Boolean,
            default: true,
        },

        // 是否自动播放下一首
        isAutoPlayNext: {
            type: Boolean,
            default: true,
        },

        // 进度更新间隔
        progressInterval: {
            default: 1000,
            type: Number,
        },

        // 是否显示倍速播放速率
        showPlaybackRate: {
            type: Boolean,
            default: false,
        },

        playbackRates: {
            type: Array,
            default: () => [0.5, 1, 1.5, 2],
        },

        themeColor: {
            type: String,
            default: '#eaf4ff',
        },

        // 是否禁用进度条可拖拽功能
        disabledProgressDrag: {
            type: Boolean,
            default: false,
        },

        // 是否禁用进度条可点击功能
        disabledProgressClick: {
            type: Boolean,
            default: false,
        },
    },

    emits: [
        'pause',
        'play-prev',
        'play-next',
        'timeupdate',
        'loadedmetadata',
        'ended',
        'progress-start',
        'progress-end',
        'progress-move',
        'progress-click',
        'playing',
        'play',
        'play-error',
    ],

    data() {
        return {
            isIOS: /iPhone|iPad|iPod/i.test(window.navigator.userAgent), // 是否是IOS设备
            isPlaying: false, // 音频是否正在播放
            isDragging: false, // 是否正在拖拽音频进度
            isDraggingVolume: false, // 是否正在拖拽音量进度
            isLoading: false,
            isShowVolume: false,
            isShowRates: false,
            timer: null,
            noticeMessage: '',
            duration: '', // 音频持续时间
            currentPlayIndex: 0, // 当前播放的音频位置索引
            currentTime: '', // 音频当前播放时间
            currentVolume: 1, // 当前音量
            playbackRate: 1, // 当前播放速率
            at: null,
        };
    },

    computed: {
        currentTimeFormatted() {
            return this.currentTime
                ? this.formatTime(this.currentTime)
                : '00:00';
        },

        durationFormatted() {
            return this.duration ? this.formatTime(this.duration) : '00:00';
        },
    },

    mounted() {
        this.at = new Core(this.$el, { preventDefault: false });
        this.at.use(Pan);
    },

    beforeUnmount() {
        this.at.destroy();
        this.pause();
    },

    methods: {
        playBtnClick() {
            if (!this.audioList || this.audioList.length === 0) {
                return;
            }
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },

        handleVolumeIconTouchstart() {
            this.isShowVolume = !this.isShowVolume;
        },

        handleVolumePanmove(event) {
            let playVolumeWrapRect =
                this.$refs.playVolumeWrap.getBoundingClientRect();
            let pageY = event.y;
            let offsetTop;
            let volume;

            offsetTop = Math.round(playVolumeWrapRect.bottom - pageY);
            volume = offsetTop / this.$refs.playVolumeWrap.offsetHeight;
            volume = Math.min(volume, 1);
            volume = Math.max(volume, 0);
            this.$refs.audio.volume = volume;
            this.currentVolume = volume;
        },

        handleVolumePanend() {
            this.isShowVolume = false;
        },

        // 设定播放速率
        handleSetPlaybackRate(rate) {
            this.playbackRate = +rate;
            this.$refs.audio.playbackRate = +rate;
            this.isShowRates = false;
        },

        // 当媒介元素的持续时间以及其它媒介已加载数据时运行脚本
        onLoadedmetadata(event) {
            this.duration = this.$refs.audio.duration;
            this.$emit('loadedmetadata', event);
        },

        // 当前的播放位置发送改变时触发
        onTimeUpdate(event) {
            this.$emit('timeupdate', event);
        },

        // 格式化秒为分
        formatTime(second) {
            let result = '';
            const minutes = Math.floor((second % 3600) / 60);
            result += minutes < 10 ? `0${minutes}` : minutes;
            result += ':';
            const seconds = Math.floor(second % 60);
            result += seconds < 10 ? `0${seconds}` : seconds;
            return result;
        },

        // 音频播放完毕
        onEnded(event) {
            window.setTimeout(() => {
                this.pause();
                this.$emit('ended', event);

                if (this.isLoop && this.isAutoPlayNext) {
                    this.playNext();
                }
            }, 1000);
        },

        handleProgressPanstart(event) {
            if (this.disabledProgressDrag) return;

            this.isDragging = true;
            this.$emit('progress-start', event);
        },

        handleProgressPanend(event) {
            if (this.disabledProgressDrag) return;

            this.$refs.audio.currentTime = this.currentTime;
            this.play();
            this.isDragging = false;
            this.$emit('progress-end', event);
        },

        handleProgressPanmove(event) {
            if (this.disabledProgressDrag) return;

            let pageX = event.x;
            let bcr = event.target.getBoundingClientRect();
            let targetLeft = parseInt(getComputedStyle(event.target).left);
            let offsetLeft = targetLeft + (pageX - bcr.left);

            offsetLeft = Math.min(
                offsetLeft,
                this.$refs.audioProgressWrap.offsetWidth,
            );
            offsetLeft = Math.max(offsetLeft, 0);
            // 设置点点位置
            this.setPointPosition(offsetLeft);
            // 设置进度条
            this.$refs.audioProgress.style.width = offsetLeft + 'px';
            // 设置当前时间
            this.currentTime =
                (offsetLeft / this.$refs.audioProgressWrap.offsetWidth) *
                this.duration;
            this.$emit('progress-move', event);
        },

        // 初始化音频进度的点击逻辑
        handleClickProgressWrap(event) {
            if (this.disabledProgressClick) return;

            let target = event.target;
            let offsetX = event.offsetX;

            if (target === this.$refs.audioProgressPoint) {
                return;
            }

            // 设置当前播放位置
            this.currentTime =
                (offsetX / this.$refs.audioProgressWrap.offsetWidth) *
                this.duration;
            this.$refs.audio.currentTime = this.currentTime;
            // 设置点点位置
            this.setPointPosition(offsetX);
            // 设置进度条
            this.$refs.audioProgress.style.width = offsetX + 'px';
            this.play();
            this.$emit('progress-click', event);
        },

        // 设置点点位置
        setPointPosition(offsetLeft) {
            this.$refs.audioProgressPoint.style.left =
                offsetLeft -
                this.$refs.audioProgressPoint.offsetWidth / 2 +
                'px';
        },

        // 播放中
        playing() {
            // 正在拖拽进度
            if (this.isDragging) {
                return;
            }

            let offsetLeft =
                (this.$refs.audio.currentTime / this.$refs.audio.duration) *
                this.$refs.audioProgressWrap.offsetWidth;

            this.currentTime = this.$refs.audio.currentTime;
            // 设置播放进度条
            this.$refs.audioProgress.style.width = offsetLeft + 'px';
            // 设置播放进度拖拽点位置
            this.setPointPosition(offsetLeft);
            this.$emit('playing');
        },

        // 开始播放
        play() {
            if (!this.audioList || this.audioList.length === 0) {
                return;
            }
            this.isLoading = true;

            let handlePlay = () => {
                this.$refs.audio
                    .play()
                    .then(() => {
                        this.$nextTick(() => {
                            this.clearTimer();
                            this.timer = window.setInterval(
                                this.playing,
                                this.progressInterval,
                            );
                            this.isPlaying = true;
                            this.isLoading = false;
                        });
                        this.$emit('play');
                        if (this.afterPlay) {
                            this.afterPlay();
                        }
                    })
                    .catch((data) => {
                        // this.handleShowErrorMessage({
                        //     message: data.message,
                        // })
                        console.log(data.message);

                        if (data.code === 0) {
                            return;
                        }

                        // Failed to load because no supported source was found.
                        if (data.code === 9) {
                            if (this.isAutoPlayNext) {
                                window.setTimeout(() => {
                                    this.playNext();
                                }, 1000);
                            }
                        }

                        this.isLoading = false;
                        this.$emit('play-error', data);
                    });
            };

            // 解决 iOS 异步请求后无法播放
            if (this.isIOS) {
                this.$refs.audio.pause();
                this.$refs.audio.play();
            }

            if (this.beforePlay) {
                this.beforePlay((state) => {
                    if (state !== false) {
                        handlePlay();
                    }
                });
                return;
            }

            handlePlay();
        },

        // 暂停播放
        pause() {
            this.$refs.audio.pause();
            this.$nextTick(() => {
                this.clearTimer();
                this.isPlaying = false;
                this.$emit('pause');
            });
        },

        // 播放上一首
        playPrev() {
            if (this.currentPlayIndex <= 0 && !this.isLoop) {
                // 无上一首了
                return;
            }

            this.clearTimer();

            let handlePrev = () => {
                if (this.currentPlayIndex <= 0 && this.isLoop) {
                    // 列表循环
                    this.currentPlayIndex = this.audioList.length - 1;
                } else {
                    this.currentPlayIndex--;
                }

                this.$nextTick(() => {
                    this.play();
                    this.$emit('play-prev');
                });
            };

            if (this.beforePrev) {
                this.beforePrev((state) => {
                    if (state !== false) {
                        handlePrev();
                    }
                });
                return;
            }
            handlePrev();
        },

        clearTimer() {
            window.clearInterval(this.timer);
            this.timer = null;
        },

        // 播放下一首
        playNext() {
            if (
                this.currentPlayIndex + 1 >= this.audioList.length &&
                !this.isLoop
            ) {
                // 无下一首了
                return;
            }

            this.clearTimer();

            let handleNext = () => {
                // 已经到达列表最后一首
                if (
                    this.currentPlayIndex + 1 >= this.audioList.length &&
                    this.isLoop
                ) {
                    this.currentPlayIndex = 0;
                } else {
                    this.currentPlayIndex++;
                }

                this.$nextTick(() => {
                    this.play();
                    this.$emit('play-next');
                });
            };

            if (this.beforeNext) {
                this.beforeNext((state) => {
                    if (state !== false) {
                        handleNext();
                    }
                });
                return;
            }

            handleNext();
        },
    },
});
</script>

<style>
@keyframes fadeVolume {
    from {
        height: 0;
    }
    to {
        height: 50px;
    }
}

@keyframes fadeRate {
    from {
        max-height: 0;
    }
    to {
        max-height: 120px;
    }
}

.fade-volume-enter-active {
    animation: fadeVolume 0.3s;
}

.fade-volume-leave-active {
    animation: fadeVolume 0.3s reverse;
}

.fade-rate-enter-active {
    animation: fadeRate 0.3s;
}

.fade-rate-leave-active {
    animation: fadeRate 0.3s reverse;
}

.audio-player .audio__btn-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.audio-player .audio__play-icon {
    width: 100%;
    height: 100%;
    fill: currentColor;
    overflow: hidden;
}

.audio-player .audio__play-volume-icon-wrap {
    position: relative;
    width: 21px;
    height: 21px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    margin-left: 16px;
}

.audio-player .audio__play-volume-icon-wrap .audio__play-volume-wrap {
    position: absolute;
    width: 21px;
    height: 50px;
    bottom: 21px;
    left: 0;
    background-color: #ddd;
    border-radius: 10px;
}

.audio-player
    .audio__play-volume-icon-wrap
    .audio__play-volume-wrap
    .audio__play-volume {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
}

.audio-player .audio__play-rate {
    position: relative;
    height: 21px;
    line-height: 21px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    font-size: 16px;
    margin-right: 16px;
}

.audio-player .audio__play-rate__dropdown {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px;
    color: #fff;
    border-radius: 15px;
    font-size: 12px;
    overflow: hidden;
}

.audio-player .audio__play-prev {
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
}

.audio-player .audio__play-prev svg {
    display: block;
    width: 21px;
    height: 33px;
}

.audio-player .audio__play-prev.disable {
    opacity: 0.5;
}

.audio-player .audio__play-start {
    margin: 0 16px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
}

.audio-player .audio__play-start svg {
    display: block;
    width: 42px;
    height: 42px;
}

.audio-player .audio__play-pause {
    margin: 0 16px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
}

.audio-player .audio__play-pause svg {
    display: block;
    width: 42px;
    height: 42px;
}

.audio-player .audio__play-next {
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
}

.audio-player .audio__play-next svg {
    display: block;
    width: 21px;
    height: 33px;
}

.audio-player .audio__play-next.disable {
    opacity: 0.5;
}

.audio__notice {
    position: absolute;
    bottom: -15px;
    color: rgb(189, 178, 178);
    border-radius: 4px;
    font-size: 12px;
}

.audio-player .audio__progress-wrap {
    position: relative;
    background: #eaf4ff;
    width: 40vh;
    height: 5px;
    border-radius: 3px;
    box-shadow: inset 0 1px 3px 0 #ccddf1;
    margin-top: 20px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    max-width: 370px;
}

.audio-player .audio__progress {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    border-radius: 3px;
    box-shadow: inset 0 1px 3px 0 #ccddf1;
}

.audio-player .audio__progress-point {
    position: absolute;
    left: -8px;
    top: 50%;
    width: 16px;
    height: 16px;
    box-shadow: -3px -3px 6px 0px #ffffff, 5px 3px 6px 0px #d3e0ec;
    border-radius: 50%;
    margin-top: -9px;
}

.audio-player .audio__progress-point:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -6px 0 0 -8px;
    box-shadow: -3px -3px 6px 0 #ffffff, 5px 3px 6px 0 #d3e0ec;
    background: #f2f8ff;
    border-radius: 50%;
}

.audio-player .audio__time-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 7px;
}

.audio-player .audio__current-time {
    font-size: 14px;
    color: #888;
}

.audio-player .audio__duration {
    font-size: 14px;
    color: #888;
}

.audio-player .audio-player__audio {
    display: block;
    margin: 0 auto;
}

@media (any-hover: hover) {
    .audio-player .audio__play-rate:hover > span {
        opacity: 0.7;
    }

    .audio-player .audio__play-rate__dropdown > div:hover,
    .audio__play-icon:hover {
        opacity: 0.7;
    }
}

.audio__play-loading {
    width: 42px;
    height: 42px;
    position: relative;
    margin: 0 16px;
}

.audio__play-loading span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    animation: loading 1.04s ease infinite;
}

@keyframes loading {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
}

.audio__play-loading span:nth-child(1) {
    left: 0;
    top: 50%;
    margin-top: -4px;
    animation-delay: 0.13s;
}

.audio__play-loading span:nth-child(2) {
    left: 7px;
    top: 7px;
    animation-delay: 0.26s;
}

.audio__play-loading span:nth-child(3) {
    left: 50%;
    top: 0;
    margin-left: -4px;
    animation-delay: 0.39s;
}

.audio__play-loading span:nth-child(4) {
    top: 7px;
    right: 7px;
    animation-delay: 0.52s;
}

.audio__play-loading span:nth-child(5) {
    right: 0;
    top: 50%;
    margin-top: -4px;
    animation-delay: 0.65s;
}

.audio__play-loading span:nth-child(6) {
    right: 7px;
    bottom: 7px;
    animation-delay: 0.78s;
}

.audio__play-loading span:nth-child(7) {
    bottom: 0;
    left: 50%;
    margin-left: -4px;
    animation-delay: 0.91s;
}

.audio__play-loading span:nth-child(8) {
    bottom: 7px;
    left: 7px;
    animation-delay: 1.04s;
}

.play-btn {
    display: flex;
    width: 12vh;
    height: 12vh;
    border: none;
    background: #f2f8ff;
    box-shadow: -3px -3px 6px 0 #ffffff, 5px 3px 6px 0 #d3e0ec;
    border-radius: 50%;
    margin: 3vh auto;
    align-items: center;
    justify-content: center;
    max-width: 100px;
    max-height: 100px;
}

.play-btn img {
    width: 6vh;
    height: 6vh;
    max-width: 50px;
    max-height: 50px;
}

</style>
