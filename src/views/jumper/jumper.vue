<template>
    <div class="jumper">
        <div class="logo">
            <img src="@/assets/images/svg_logo.svg" alt=""/>
        </div>
    </div>
</template>

<script lang="ts">
import router from '@/router';
import urlParse from '@/utils/urlParse';
import {useStore} from '@/store/main';

/* eslint-disable */
export default {
    name: 'jumper',
    setup() {
        const store = useStore();
        const type = urlParse.getUrlKey('type');
        const data = urlParse.getUrlKey('data');

        const ua = navigator.userAgent.toLowerCase();
        store.saveIsAndroid(/Android/i.test(ua));
        store.saveIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua));

        switch (type) {
            case '1':
                if (data.length == 0) {
                    jumpToOpen();
                    return;
                }
                store.savePlayInfo(decodeURIComponent(data));
                router.replace('/play');
                break;
            case '2':
                if (data.length == 0) {
                    jumpToOpen();
                    return;
                }
                store.saveShareKey(decodeURIComponent(data));
                router.replace('/share');
                break;
            default:
                jumpToOpen();
                break;
        }

        return {};
    },
};

function jumpToOpen() {
    router.replace('/open-app');
}
</script>

<style scoped lang="less">
.jumper {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-items: center;

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
}
</style>
