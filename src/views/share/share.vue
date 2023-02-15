<template>
    <div class="share">
        <share_affix></share_affix>
        <share_player></share_player>
        <share_music_list></share_music_list>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import share_affix from '@/components/share-affix/share-affix.vue';
import share_player from './share-player/share-player.vue';
import share_music_list from './share-music-list/share-music-list.vue';

export default defineComponent({
    name: 'share',
    components: {
        share_affix,
        share_player,
        share_music_list,
    },
});
</script>

<style scoped lang="less">
.share {
    width: 100%;
}
</style>
