import axios from 'axios'
import Router from '@/router/index'
import { Message, MessageBox, Loading, Notification } from 'element-ui'
import store from '../store'
import * as userTypes from '@/types/userConfig'
import { getToken, TokenKey ,removeToken} from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_ROOT,
  timeout: 15000, // 请求超时时间
})

// request拦截器  请求前  添加请求头在此添加
service.interceptors.request.use(config => {
  let auth = config.auth;
  if (auth || auth == undefined) {
    config.headers[TokenKey] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Scope-Of-Use'] = 'platform/1.0 (Windows NT 10.0; Win64; x64)'; 
  }
  if(!config.noLoading){
    config.loadingIns = Loading.service({
      lock: true,
      text: '数据加载中...',
      target: '.index-main',
      spinner: 'lss-icon-doing'
    });
  }
  if (config.form) {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    if (config.data) {
      config.transformRequest = data => {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        ret = ret.substr(0, ret.length - 1);
        return ret;
      }
    }
  }
  return config
}, error => {
  Promise.reject(error)
})
//声明变量 处理多次拦截到登录过期
let toKenStatus=true;
// respone拦截器 请求后 拦截返回的数据 统一处理
service.interceptors.response.use(
  response => {
    var config = response.config;
    if (config.loadingIns) { config.loadingIns.close(); }
    const res = response.data
    if (config.tip && res.code == 200) {
      Notification({
        title: res.message,
        type: 'success',
        duration: 1500,
      });
    }
    if (res.code !== 200) {
      if (res.code == 401 || res.code == 403 || res.code == 10002 || res.code == 402) {
        if(toKenStatus){
          toKenStatus = false;
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeToken();
            Router.replace({
              path:'/login/login_new',
              name:'login_new'
            })
            store.dispatch(userTypes.FN_LOGOUT);
            return false
          })
        }
      } else {
        Notification({
          title: '失败',
          message: res.message,
          type: 'error',
          duration: 3 * 1000
        });
      }
      return Promise.reject(res.message);
    } else {
     // console.log( response.data);
      return response.data
    }
  },
  (error) => {
    var config = error.config;
    if (config && config.loadingIns) { config.loadingIns.close(); }
    Notification({
      title: '失败',
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    });
    return Promise.reject(error)
  }
)
function auto(obj, params = {}, noLoading) {
  let rst = { url: "", method: "POST", form: false, auth: true, tip: false }
  Object.assign(rst, obj, { noLoading });
  rst.method = rst.method.toUpperCase();
  return new Promise((resolve, reject) => {
    switch (rst.method) {
      case "POST": service.post(rst.url, params, { ...rst }).then(resp => resolve(resp.data), err => reject(err)).catch(err => reject(err)); break;
      case "PUT": service.put(rst.url, params, { ...rst }).then(resp => resolve(resp.data), err => reject(err)).catch(err => reject(err)); break;
      case "DELETE": service.delete(rst.url, { params, ...rst }).then(resp => resolve(resp.data), err => reject(err)).catch(err => reject(err)); break;
      case "GET":
      default: service.get(rst.url, { params: params, ...rst }).then(resp => resolve(resp.data)).catch(err => reject(err)); break;
    }
  });
}

export default {
  install: function (Vue) {
    Vue.prototype.request = (_path, params, noLoading = false) => auto(_path, params, noLoading)
  }
}