import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/jumper',
    },
    {
        path: '/jumper',
        component: () => import('@/views/jumper/jumper.vue')
    },
    {
        path: '/share',
        component: () => import('@/views/share/share.vue'),
    },
    {
        path: '/play',
        component: () => import('@/views/play/play.vue'),
    },
    {
        path: '/open-app',
        component: () => import('@/views/open-app/open-app.vue'),
    },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

export default router;
