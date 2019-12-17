import jsCoolie from 'js-cookie';
import Config from '../../config';
export default function (to, from, next) {
    const href = to.fullPath;
    const signInfo = href.split('?singleSign=')[1];

    if (href.indexOf('?redirect=') > 0) {
        next();
        return;
    }
    if (typeof signInfo === 'string') {
        jsCoolie.set(Config.tokenKey, decodeURIComponent(signInfo.split('--')[0]) , new Date(new Date().getTime() + 7 * 24 * 60 * 1000));
        next({
            name: signInfo.split('--')[3]
        });

        return null;
    }


}