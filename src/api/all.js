const _api_root = process.env.VUE_APP_API_ROOT
let apiObj = {};
const apiContext = require.context('./', false, /\.js$/);
apiContext.keys().forEach((item) => {
    if (item === './all.js')return
    let regex = /\.\/(.+?)\./g;
    let apiName = regex.exec(item)[1];
    apiObj[apiName] = apiContext(item);
})
export default {
    API_ROOT: _api_root,
    FN_ALLPATH: (path) => _api_root + (typeof (path) == 'string' ? path : path.url),
    ...apiObj
}
