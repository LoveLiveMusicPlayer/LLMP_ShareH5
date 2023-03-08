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

    <audio ref="audioRef" :src="musicUrl[playCurrentIndex]"></audio>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    setup() {
        const store = useStore();
        const audioRef = ref<HTMLAudioElement>(); // audio 元素

        // 测试接口
        const musicListId = [
            26111145, 28768096, 1832849841, 469699072, 1834947914, 1988842994,
            1988842994, 1875023978,
        ];

        onMounted(() => {
            audioRef.value!.addEventListener('ended', () => {
                console.log('一首歌播放完成');
                audioRef.value!.pause();
                playCurrentIndex.value++;
                if (playCurrentIndex.value >= musicUrl.value.length) {
                    playCurrentIndex.value = 0;
                }
                audioRef.value!.src = musicUrl.value[playCurrentIndex.value];
                setTimeout(() => {
                    audioRef.value!.play();
                }, 500);
            });

            watch(
                () => store.isPlaying,
                (newValue, oldValue) => {
                    console.log('newValue:', newValue, 'oldValue:', oldValue);
                    if (newValue) {
                        audioRef.value!.play();
                    } else {
                        audioRef.value!.pause();
                    }
                },
            );
        });

        // 发送网络请求获取音乐数据
        store.getMusicInfo(musicListId);
        store.getMusicUrl(musicListId);
        const musicInfo = computed(() => store.musicInfo);
        const musicUrl = computed(() => store.musicUrl);

        const playCurrentIndex = ref(0);
        // audioRef.value!.src = musicUrl[playCurrentIndex.value];

        return {
            musicInfo,
            audioRef,
            musicUrl,
            playCurrentIndex,
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
