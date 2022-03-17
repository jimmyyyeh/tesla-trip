import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import AlertModal from '@/components/AlertModal.vue';
import NavTab from '@/components/NavTab.vue';
import OffCanvas from '@/components/OffCanvas.vue';
import router from './router';
import App from './App.vue';
import '@/assets/css/app.scss';

const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.component('NavTab', NavTab);
app.component('OffCanvas', OffCanvas);
app.component('AlertModal', AlertModal);
app.mount('#app');
