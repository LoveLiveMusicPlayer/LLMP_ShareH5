<template>
    <div class="share-affix">
        <el-affix :offset="0" :z-index="200">
            <header class="affix-header">
                <span class="logo"></span>
                <span class="text">更多有趣的歌尽在LLMP</span>
                <el-button class="button" @click="openApp">
                    打开LLMP
                </el-button>
            </header>
        </el-affix>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import appUtil from "@/utils/appUtil";
import {storeToRefs} from 'pinia'
import {useStore} from "@/store/main";
import router from "@/router";

let store = useStore()
let {isAndroid} = storeToRefs(store)

export default defineComponent({
    name: 'share-affix',
    setup() {
        function openApp() {
            window.location.href = "llmp://top.zhushenwudi?musicName=%E5%A0%95%E5%A4%A9%E4%BD%BF%E6%AD%8C%E5%8D%95&musicId=12345678,23456789,34567890,45678901,56789012,67890123,78901234,89012345,90123456"
            setTimeout(() => {
                router.push("/open-app")
            }, 2000)
        }
        return {openApp};
    },
});
</script>

<style scoped lang="less">
@box-shadow-bgc: #d3e0ec;

a {
    &:link,
    &:active {
        color: skyblue;
    }

    &:visited {
        color: #333;
    }
}

.share-affix {
    width: 100%;

    .affix-header {
        position: relative;
        display: flex;
        align-items: center;
        background: #f2f8ff;
        width: 100%;
        height: 16vw;
        padding: 0 3.2vw;
        box-shadow: 5px 3px 6px 0 @box-shadow-bgc;

        .logo {
            width: 8.533vw;
            height: 8.533vw;
            margin-right: 3.2vw;
            border-radius: 8px;
            background: #ffffff url('@/assets/images/svg_logo.svg') no-repeat center center / 100%;

            img {
                width: 100%;
            }
        }

        .text {
            font-size: 3.8vw;
            color: #999;
        }

        .button {
            position: absolute;
            right: 3.2vw;
            width: 102px;
            height: 42px;
            border: none;
            font-weight: bold;
            background: #f2f8ff;
            box-shadow: -3px -3px 6px 0px #ffffff,
            5px 3px 6px 0px @box-shadow-bgc;
            border-radius: 21px;
        }
    }
}
</style>
