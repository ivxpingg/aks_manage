import Vue from 'vue'
import App from './App.vue'
import iView from 'iview';
import router from './router';
import store from './store/store';
import Ajax from './lib/axios';
import moment from 'moment';
import './styles/app.scss';
import 'iview/dist/styles/iview.css';

import vIvxFilterBox from './components/ivxFilterBox/ivxFilterBox';

Vue.config.productionTip = false;
Vue.use(iView, {
    transfer: true
});
Vue.prototype.$http = Ajax;
Vue.prototype.$moment = moment;

Vue.component('vIvxFilterBox', vIvxFilterBox);

new Vue({
    router,
    store,
    render: h => h(App),
    mounted() {}
}).$mount('#app')
