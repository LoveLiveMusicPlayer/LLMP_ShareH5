<template>
    <div class="share">
        <share_affix type="2" :menu-callback="menuCallback"></share_affix>
        <share_music_list></share_music_list>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import share_affix from '@/components/share-affix/share-affix.vue';
import share_music_list from './share-music-list/share-music-list.vue';
import { useStore } from '@/store/main';

const store = useStore();

export default defineComponent({
    name: 'share',
    components: {
        share_affix,
        share_music_list,
    },

    methods: {
        menuCallback() {
            const info = JSON.parse(store.shareInfo);
            if (info.musicList.length > 0) {
                const musicIds: string[] = [];
                info.musicList.forEach((music: any) => {
                    musicIds.push(music._id);
                });
                const obj = {
                    menuName: info.menuName,
                    musicIds: musicIds,
                };
                const params = encodeURIComponent(
                    'type=2&data=' + JSON.stringify(obj),
                );
                window.location.href = `llmp://top.zhushenwudi?${params}`;
            }
        },
    },
});
</script>

<style scoped lang="less">
.share {
    width: 100%;
}

@media screen and (min-width: 1020px) and (max-width: 1267px) {
    .share {
        width: 100%;
        height: 100vh;
    }
}

@media screen and (min-width: 1267px) {
    .share {
        height: 100vh;
    }
}
</style>
