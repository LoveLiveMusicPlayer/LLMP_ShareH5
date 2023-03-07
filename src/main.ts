import { createApp } from 'vue';
import { globalRegister } from '@/global/index';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/assets/style/index.less';

const app = createApp(App);
const pinia = createPinia();
globalRegister(app);

app.use(router);
app.use(pinia);

app.mount('#app');

console.log('https://github.com/LoveLiveMusicPlayer/LLMP_ShareH5');
