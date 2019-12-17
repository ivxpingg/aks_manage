import axios from '../../lib/axios';
import jsCookie from 'js-cookie';
import Config from '../../config';
export default {
    state: {
        userName: '',
        loginTime: ''
    },
    mutations: {
        setUserName (state, name) {
            state.userName = name;
        },
        setLoginTime (state, time) {
            state.loginTime = time;
        }
    },
    actions: {
        // 登录
        handleLogin ({ commit }, {loginName, password}) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'post',
                    url: '/ajaxLogin',
                    data: {
                        loginName,
                        password
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        jsCookie.set(Config.tokenKey, res.data.token, {expires: Config.cookieExpires || 1});
                    }
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            }))
        },
        // 退出登录
        handleLogOut ({ state, commit }) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/logout'
                }).then(res => {
                    jsCookie.set(Config.tokenKey, null);
                    commit('setUserName', '');
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            }))

        },
        // 获取用户相关信息
        getUserInfo ({ state, commit }) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/user/query'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        commit('setUserName', res.data.name);
                        // commit('loginTime', res.data.lastLoginTime);
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                }).catch(err => {
                    reject(err);
                })
            }))
        }
    }
}
