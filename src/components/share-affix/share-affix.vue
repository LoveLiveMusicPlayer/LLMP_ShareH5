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
    position: absolute;
    top: 0;

    .affix-header {
        position: relative;
        display: flex;
        align-items: center;
        background: #f2f8ff;
        width: 100%;
        height: 8vh;
        min-height: 50px;
        padding: 0 3.2vw;
        box-shadow: 5px 3px 6px 0 @box-shadow-bgc;

        .logo {
            width: 8vh;
            height: 8vh;
            min-height: 50px;
            min-width: 50px;
            margin-right: 2vw;
            border-radius: 8px;
            background: url('@/assets/images/svg_logo.svg') no-repeat center center / 100%;
        }

        .text {
            font-size: 16px;
            color: #999;
        }

        .button {
            position: absolute;
            right: 3.2vw;
            width: 13vw;
            max-width: 122px;
            min-width: 90px;
            min-height: 32px;
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

@media screen and (max-width: 366px) {
    .share-affix {
        .affix-header {
            .logo {
                width: 40px;
                height: 40px;
                min-height: 40px;
                min-width: 40px;
            }
            .text {
                font-size: 12px;
            }
            .button {
                width: 70px;
                max-width: 70px;
                min-width: 70px;
                height: 12px;
                font-size: 12px;
            }
        }
    }
}

@media screen and (min-height: 700px) and (min-width: 366px) {
    .share-affix {
        .affix-header {
            .text {
                font-size: 16px;
            }
            .button {
                height: 5.6vh;
            }
        }
    }
}

@media screen and (min-height: 700px) and (min-width: 700px) {
    .share-affix {
        .affix-header {
            .text {
                font-size: 24px;
            }
            .button {
                height: 50px;
                font-size: 18px;
            }
        }
    }
}
</style>
