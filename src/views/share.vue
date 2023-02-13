<template>
    <div class="share">
        <affix_header></affix_header>
        <player></player>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import affix_header from './affix/affix.vue';
import player from './player/player.vue';

export default defineComponent({
    name: 'share',
    components: {
        affix_header,
        player,
    },
});
</script>

<style scoped lang="less"></style>
