<template>
    <div class="open-app">
        <div class="logo">
            <img src="@/assets/images/svg_logo.svg" alt=""/>
        </div>
        <el-button class="download" @click="btnDownload">立即下载</el-button>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import appUtil from "@/utils/appUtil";
import {storeToRefs} from 'pinia'
import {useStore} from "@/store/main";

let store = useStore()
let {isAndroid} = storeToRefs(store)

export default defineComponent({
    setup() {
        function btnDownload() {
            appUtil.jumpToDownload(isAndroid.value).then(url => window.location.href = url)
        }
        return {btnDownload};
    },
});
</script>

<style scoped lang="less">
.open-app {
    position: relative;
    width: 100vw;
    height: 100vh;
    // background-color: #fff;

    .logo {
        position: absolute;
        width: 80%;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            width: 100%;
        }
    }

    .download {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 24vw;
        margin: 0 auto;
        width: 85.333vw;
        height: 60px;
        background: linear-gradient(270deg, #f940a7 0%, #ff86c9 100%);
        box-shadow: 5px 3px 6px 0px #d3e0ec, -3px -3px 6px 0px #ffffff;
        border-radius: 30px;
        font-size: 4.533vw;
        color: #fff;
    }
}
</style>
