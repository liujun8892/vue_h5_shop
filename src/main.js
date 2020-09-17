import "babel-polyfill";//es6转es5
import "url-search-params-polyfill";//让ie兼容new URLSearchParams()
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import config from "./assets/js/config/config";
import store from "./store";
import util from './assets/js/utils'
import {Switch,Toast,Popup,Area,Dialog,ActionSheet} from 'vant';

Vue.config.productionTip = false;
Vue.prototype.$config = config
Vue.prototype.$util = util
Vue.use(Switch);
Vue.use(Toast);
Vue.use(Popup);
Vue.use(Area);
Vue.use(Dialog);
Vue.use(ActionSheet);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
