<template>
    <div class="share">
        <share_affix type="2" :menu-callback="menuCallback"></share_affix>
        <share_music_list></share_music_list>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import share_affix from '@/components/share-affix/share-affix.vue';
import share_music_list from './share-music-list/share-music-list.vue';
import {IMusicInfo} from "@/store/types";

export default defineComponent({
    name: 'share',
    components: {
        share_affix,
        share_music_list,
    },

    setup() {
        const info = ref<IMusicInfo[]>();
    },

    methods: {
        // menuCallback() {
        //
        // }
    }
});
</script>

<style scoped lang="less">
.share {
    width: 100%;
}
</style>
