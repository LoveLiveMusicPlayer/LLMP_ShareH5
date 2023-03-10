<template>
    <div class="play">
        <share_affix></share_affix>
        <article class="music">
            <div class="music-logo">
                <img
                    :src="
                        info && info.coverUrl && info.coverUrl.toString().length > 0 ?
                        info.coverUrl : require(`@/assets/images/svg_logo.svg`)"
                 alt=""/>
            </div>
            <div class="music-text">
                <p class="music-name">{{ info && info.name }}</p>
                <p class="music-sing">{{ info && info.artistName }}</p>
            </div>
            <div class="music-control">
                <audio-player
                    ref="audioRef"
                    :audio-list="[info && info.url]"
                />
            </div>
            <div style="margin-bottom: 10vh"></div>
        </article>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {storeToRefs} from 'pinia';
import share_affix from '@/components/share-affix/share-affix.vue';
import {useStore} from '@/store/main';
import {IMusicInfo} from '@/store/types';
import AudioPlayer from "components/audio-player/audio-player.vue";

let store = useStore();
let {playInfo} = storeToRefs(store);

export default defineComponent({
    components: {
        AudioPlayer,
        share_affix
    },

    setup() {
        const isPlaying = ref(false);
        const audioRef = ref()
        const info = ref<IMusicInfo>();

        store.$subscribe((mutation, state) => {
            info.value = state.musicInfo[0];
        });

        return {
            isPlaying,
            info,
            audioRef
        };
    },

    async mounted() {
        const info = JSON.parse(playInfo.value);
        await store.getMusicInfo([info.neteaseId]);
    },
});
</script>

<style scoped lang="less">
.play {
    height: 100vh;

    .music {
        width: 100%;
        height: 100vh - 8vw;
        margin: 3vh 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .music-logo {
            width: 60%;
            margin: 3vh 0;

            img {
                width: 100%;
                border-radius: 20px;
                box-shadow: 5px 3px 6px 3px #D3E0EC;
            }
        }

        .music-text {
            text-align: center;
            margin-bottom: 4vh;

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
        }
    }
}
</style>
