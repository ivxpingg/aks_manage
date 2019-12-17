import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
import routes from './routers';
import store from '../store/store';
import singleSign from '../lib/package/singleSign';
Vue.use(Router);

const whiteList = ['/login'];
const router = new Router({
    base: '/',
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();

    singleSign(to, from, next);
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
    }
    // 判断是否已经获取用户信息
    else if (store.getters.userName === '') {
        store.dispatch('getUserInfo').then(() => {
            next();
        }).catch(() => {
            next({
                name: 'login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        })
    }
    else {
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;