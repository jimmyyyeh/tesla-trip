import { createApp } from 'vue';
import {
  Dialog,
  Tab,
  Tabs,
} from 'vant';
import axios from 'axios';
import VueAxios from 'vue-axios';
import NavTab from '@/components/NavTab.vue';
import AlertModal from '@/components/AlertModal.vue';
import router from './router';
import App from './App.vue';
import '@/assets/css/app.scss';
import 'vant/lib/index.css';

const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.use(Dialog);
app.use(Tab);
app.use(Tabs);
app.component('NavTab', NavTab);
app.component('AlertModal', AlertModal);
app.mount('#app');
