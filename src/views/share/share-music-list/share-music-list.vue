<template>
    <div class="share-music-list">
        <div class="music-list">
            <!-- <router-link :to="{ path: 'play', query: listItem }"> -->
            <!-- </router-link> -->
            <template v-for="musicItem in musicInfo" :key="musicItem.name">
                <section class="list">
                    <img :src="musicItem.coverUrl" alt="" class="list-img" />
                    <div class="list-message">
                        <h2 class="list-name">{{ musicItem.name }}</h2>
                        <p class="list-sing">{{ musicItem.artistName }}</p>
                    </div>
                </section>
            </template>
        </div>
        <el-button class="load-more"> 点击加载更多歌曲 </el-button>
    </div>

    <audio ref="audioRef" :src="musicUrl[0]"></audio>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    setup() {
        const store = useStore();

        // 测试接口
        const musicListId = [
            26111145, 28768096, 1832849841, 469699072, 1834947914, 1988842994,
            1988842994, 1875023978,
        ];

        const audioRef = ref<HTMLAudioElement>(); // audio 元素

        // const handleListClick = (name: string, singName: string) => {
        //     if (musicInfo.name === name) {
        //         audioRef.value!.pause();
        //     } else {
        //         musicInfo.name = name;
        //         musicInfo.singName = singName;
        //         nextTick(() => {
        //             if (store.state.isPlaying) {
        //                 audioRef.value!.pause();
        //                 setTimeout(() => {
        //                     audioRef.value!.play();
        //                 }, 500);
        //             }
        //             store.state.isPlaying = true;
        //             audioRef.value!.play();
        //         });
        //     }
        //     console.log(musicInfo.name);

        //     store.state.isPlaying = !store.state.isPlaying;
        //     if (store.state.isPlaying) {
        //         audioRef.value!.play();
        //     } else {
        //         audioRef.value!.pause();
        //     }
        // };

        // 调用vuex中的actions
        // store.dispatch('getMusicInfo', musicListId);

        store.getMusicInfo(musicListId);
        store.getMusicUrl(musicListId);
        const musicInfo = computed(() => store.musicInfo);
        const musicUrl = computed(() => store.musicUrl);

        const play = () => {
            //
        };

        return {
            musicInfo,
            audioRef,
            musicUrl,
            // handleListClick,
        };
    },
});
</script>

<style scoped lang="less">
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
        margin-top: 5.333vw;
        margin-bottom: 50px;
        background-color: transparent;
        border: none;
        font-size: 3.6vw;
        color: #999;
    }
}
</style>
