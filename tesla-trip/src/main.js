import { createApp } from 'vue';
import { Tab, Tabs } from 'vant';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';
import NavTab from './components/NavTab.vue';
import 'vant/lib/index.css';

const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.use(Tab);
app.use(Tabs);
app.component('NavTab', NavTab);
app.mount('#app');
