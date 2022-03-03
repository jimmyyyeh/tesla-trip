import { createApp } from 'vue';
import {
  Button,
  Cell,
  CellGroup,
  DatetimePicker,
  Dialog,
  Field,
  Form,
  Picker,
  Popup,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from 'vant';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';
import NavTab from './components/NavTab.vue';
import '@/assets/css/app.scss';
import 'vant/lib/index.css';

const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.use(Button);
app.use(Cell);
app.use(CellGroup);
app.use(DatetimePicker);
app.use(Dialog);
app.use(Field);
app.use(Form);
app.use(Picker);
app.use(Popup);
app.use(Radio);
app.use(RadioGroup);
app.use(Tab);
app.use(Tabs);
app.component('NavTab', NavTab);
app.mount('#app');
