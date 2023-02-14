<template>
    <div class="share">
        <affix_header></affix_header>
        <player></player>
        <music_list></music_list>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import affix_header from './affix/affix.vue';
import player from './player/player.vue';
import music_list from './music-list/music-list.vue';

export default defineComponent({
    name: 'share',
    components: {
        affix_header,
        player,
        music_list,
    },
});
</script>

<style scoped lang="less"></style>
