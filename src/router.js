/**
 * @file 路由控制模块
 * @author Leuis Ken <leuisken@gmail.com>
 */
const Router = [];

window.addEventListener('hashchange', function () {
    let hash = window.location.hash;
    for (let i = 0; i < Router.length; i++) {
        if (Router[i].checker.test(hash)) {
            Router[i].callback(hash);
        }
    }
});

export default Router;
