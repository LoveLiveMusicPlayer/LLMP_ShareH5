<template>
    <div class="app">
        <share></share>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import share from './views/share.vue';

export default defineComponent({
    name: 'App',
    components: {
        share,
    },
});
</script>

<style>
.app {
    width: 100vw;
}
</style>
