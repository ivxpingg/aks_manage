const PROJECT_NAME = '/aks_manage';

const ORIGIN = window.location.origin;
const ENV = process.env.NODE_ENV;
export default {
    env: ENV,
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    passwordKey: '9nQIpFft2tjudUXIaw23msqyFRI3gtbM',
    cookieExpires: 7,
    tokenKey: 'ikey_aks_admin',
    origin: ORIGIN,
    ajaxUrl: PROJECT_NAME,
    filePath: window.location.origin + PROJECT_NAME,
}