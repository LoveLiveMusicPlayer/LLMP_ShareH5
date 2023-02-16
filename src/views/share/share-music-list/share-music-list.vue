<template>
    <div class="share-music-list">
        <div class="music-list">
            <template v-for="listItem in musicList" :key="listItem">
                <router-link :to="{ path: 'play', query: listItem }">
                    <section class="list">
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
                </router-link>
            </template>
        </div>
        <el-button class="load-more" @click="handleLoadMore">
            点击加载更多歌曲
        </el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    setup() {
        const store = useStore();
        const musicList = store.state.musicList;

        const handleLoadMore = () => {
            //
        };
        return {
            musicList,
            handleLoadMore,
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
