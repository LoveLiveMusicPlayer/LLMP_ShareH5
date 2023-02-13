import { createApp } from 'vue';
import { globalRegister } from '@/global/index';
import App from './App.vue';
import store from './store';
import '@/assets/style/index.less';

const app = createApp(App);
globalRegister(app);

app.use(store);

app.mount('#app');

console.log('https://github.com/LoveLiveMusicPlayer/LLMP_ShareH5');
