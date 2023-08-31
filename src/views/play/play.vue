<template>
    <div class="play">
        <share_affix type="1" :music-callback="musicCallback"></share_affix>
        <article class="music">
            <div class="container">
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
                    <audio-player :audio-list="[info && info.url]" />
                </div>
            </div>

        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import share_affix from '@/components/share-affix/share-affix.vue';
import { useStore } from '@/store/main';
import { IMusicInfo } from '@/store/types';
import AudioPlayer from 'components/audio-player/audio-player.vue';

let store = useStore();
let { playInfo } = storeToRefs(store);

export default defineComponent({
    components: {
        AudioPlayer,
        share_affix,
    },

    setup() {
        const isPlaying = ref(false);
        const info = ref<IMusicInfo>();

        return {
            isPlaying,
            info,
        };
    },

    methods: {
        musicCallback() {
            if (this.info) {
                const params = encodeURIComponent(
                    'type=1&musicId=' + this.info.musicId,
                );
                window.location.href = `llmp://top.zhushenwudi?${params}`;
            }
        },
    },

    async mounted() {
        const music = JSON.parse(playInfo.value);
        const nameMap = new Map();
        nameMap.set(parseInt(music.neteaseId), music.name);
        const musicIdMap = new Map();
        const nullMap = new Set<any>();
        if (music.neteaseId == null) {
            nullMap.add(music);
        }
        musicIdMap.set(parseInt(music.neteaseId), music._id);
        await store.getMusicInfo(nameMap, musicIdMap, nullMap);
        this.info = store.musicInfo[0];
    },
});
</script>

<style scoped lang="less">
.play {
    .music {
        --dynamic-height: 8vh;
        width: 100%;
        height: calc(100vh - min(50px, var(--dynamic-height)));
        display: flex;
        margin-top: min(50px, var(--dynamic-height));
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .container {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;

            .music-logo {
                width: 35vh;
                max-width: 300px;
                height: 35vh;
                margin: 3vh 0;

                img {
                    width: 100%;
                    border-radius: 20px;
                    box-shadow: 5px 3px 6px 3px #d3e0ec;
                }
            }

            .music-text {
                text-align: center;
                margin-bottom: 4vh;

                .music-name {
                    color: #333;
                    font-weight: 600;
                    font-size: 2.5vh;
                    max-font-size: 24px;
                }

                .music-sing {
                    font-size: 20px;
                    font-weight: 500;
                    color: #f940a7;
                    margin-top: 1vh;
                }
            }
        }
    }
}
@media screen and (max-height: 400px) {
    .play {
        .music {
            .container {
                position: absolute;
                top: calc(3vh + min(50px, var(--dynamic-height)));
            }
        }
    }
}
</style>
