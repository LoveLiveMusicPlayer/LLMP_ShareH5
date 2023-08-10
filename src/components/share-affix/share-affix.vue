<template>
    <div class="share-affix">
        <el-affix :offset="0" :z-index="200">
            <header class="affix-header">
                <span class="logo"></span>
                <span class="text">更多有趣的歌尽在LLMP</span>
                <el-button class="button" @click="btnClick">
                    {{ text }}
                </el-button>
            </header>
        </el-affix>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore } from '@/store/main';
import router from '@/router';

let store = useStore();
let { isAndroid } = storeToRefs(store);

export default defineComponent({
    name: 'share-affix',
    props: {
        type: {
            default: '',
            type: String,
        },
        musicCallback: {
            default: null,
            type: Function,
        },
        menuCallback: {
            default: null,
            type: Function,
        },
    },

    setup() {
        const text = ref('');
        return { text };
    },

    mounted() {
        switch (this.type) {
            case '1':
                this.text = '打开LLMP';
                break;
            case '2':
                this.text = '导入LLMP';
                break;
        }
    },

    methods: {
        btnClick() {
            switch (this.type) {
                case '1':
                    this.musicCallback();
                    break;
                case '2':
                    this.menuCallback();
                    break;
            }
            setTimeout(() => router.push('/open-app'), 2000);
        },
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
            background: #ffffff url('@/assets/images/svg_logo.svg') no-repeat
                center center / 100%;

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

@media screen and (min-width: 1020px) and (max-width: 1267px) {
}

@media screen and (min-width: 1267px) {
    .share-affix {
        background-color: #f00;
        .affix-header {
            height: 100px;
        }
    }
}
</style>
