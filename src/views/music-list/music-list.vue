<template>
    <div class="music-list">
        <template v-for="listItem in musicList" :key="listItem">
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
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    setup() {
        const store = useStore();
        const musicList = store.state.musicList;
        return {
            musicList,
        };
    },
});
</script>

<style scoped lang="less">
.music-list {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
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
</style>
