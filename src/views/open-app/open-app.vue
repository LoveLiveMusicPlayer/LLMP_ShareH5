<template>
    <div class="open-app">
        <div class="logo">
            <img src="@/assets/images/share_logo.png" alt="" />
        </div>
        <el-button class="download" @click="btnDownload">立即下载</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import appUtil from '@/utils/appUtil';
import { storeToRefs } from 'pinia';
import { useStore } from '@/store/main';

let store = useStore();
let { isAndroid } = storeToRefs(store);

export default defineComponent({
    setup() {
        function btnDownload() {
            appUtil
                .jumpToDownload(isAndroid.value)
                .then((url) => (window.location.href = url));
        }

        return { btnDownload };
    },
});
</script>

<style scoped lang="less">
.open-app {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .logo {
        width: 300px;
        height: 300px;
        top: 45%;
        left: 50%;

        img {
            width: 100%;
        }
    }

    .download {
        margin-top: 2vh;
        width: 300px;
        height: 55px;
        background: linear-gradient(270deg, #f940a7 0%, #ff86c9 100%);
        box-shadow: 5px 3px 6px 0 #d3e0ec, -3px -3px 6px 0px #ffffff;
        border-radius: 30px;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
    }
}

@media screen and (max-height: 500px) {
    .open-app {
        .logo {
            width: 50vh;
            height: 50vh;
        }
        .download {
            width: 50vh;
            height: 10vh;
            font-size: 4vh;
        }
    }
}
</style>
