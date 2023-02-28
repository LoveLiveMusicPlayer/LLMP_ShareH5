<template>
    <div class="share-music-list">
        <div class="music-list">
            <template v-for="listItem in musicList" :key="listItem">
                <!-- <router-link :to="{ path: 'play', query: listItem }"> -->
                <section
                    class="list"
                    @click="handleListClick(listItem.name, listItem.singName)"
                >
                    <img
                        :src="
                            require(`@/assets/images/cd-img/${listItem.singName}/${listItem.name}.jpg`)
                        "
                        alt=""
                        class="list-img"
                    />
                    <div class="list-message">
                        <h2 class="list-name">{{ listItem.name }}</h2>
                        <p class="list-sing">{{ listItem.singName }}</p>
                    </div>
                </section>
                <!-- </router-link> -->
            </template>
        </div>
        <el-button class="load-more"> 点击加载更多歌曲 </el-button>
    </div>

    <audio
        ref="audioRef"
        :src="require(`@/assets/audio/${musicInfo.name}.mp3`)"
    >
        <!-- <source :src="require(`@/assets/audio/${musicInfoName}.mp3`)" type="" /> -->
    </audio>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    setup() {
        const store = useStore();
        const musicList = store.state.musicList;

        const audioRef = ref<HTMLAudioElement>();

        const musicInfo = reactive({
            name: musicList[0].name,
            singName: musicList[0].singName,
        });

        const handleListClick = (name: string, singName: string) => {
            if (musicInfo.name === name) {
                audioRef.value!.pause();
            } else {
                musicInfo.name = name;
                musicInfo.singName = singName;
                nextTick(() => {
                    if (store.state.isPlaying) {
                        audioRef.value!.pause();
                        setTimeout(() => {
                            audioRef.value!.play();
                        }, 500);
                    }
                    store.state.isPlaying = true;
                    audioRef.value!.play();
                });
            }
            console.log(musicInfo.name);

            store.state.isPlaying = !store.state.isPlaying;
            if (store.state.isPlaying) {
                audioRef.value!.play();
            } else {
                audioRef.value!.pause();
            }
        };

        return {
            musicInfo,
            musicList,
            audioRef,
            handleListClick,
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
