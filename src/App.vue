<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'App',
    components: {},
    setup() {
        // ! 禁止IOS缩放
        window.onload = function () {
            document.addEventListener('touchstart', function (event) {
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            });
            document.addEventListener('gesturestart', function (event) {
                event.preventDefault();
            });
        };
    },
});
</script>

<style>
.app {
    width: 100vw;
}
</style>
