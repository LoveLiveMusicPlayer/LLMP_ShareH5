import { createApp } from 'vue';
import { globalRegister } from '@/global';
import store from '@/store';
import App from './App.vue';
import router from './router';
import '@/assets/style/index.less';
import '@/global/global.css';

const app = createApp(App);
globalRegister(app);

app.use(router);
app.use(store);

app.mount('#app');
