import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import common from './utils/common';
import axiosApi from '@/utils/request'
import Api from '@/api/all'
import Element from 'element-ui' //Element.js
import 'element-ui/lib/theme-chalk/index.css' //Element.css
import '@/style/global.less' //公共css
// 引入icon
import './assets/icon/iconfont.css'
import 'font-awesome/less/font-awesome.less'

// 过滤器
import filters from '@/filters/index'

import * as auth from '@/utils/auth' //token
import * as util from '@/utils/util'

import '@/icons' // icon
import elCascaderMulti from "@/components/el-cascader-multi";
//导出Excel
import Export2Excel from '@/vendor/Export2Excel'

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
})

Object.defineProperty(Vue.prototype, '$common', {
    get() {
        return common
    }
})

Vue.config.productionTip = false
Vue.prototype.api = Api;
Vue.prototype.util = util;

Vue.use(Element);
Vue.use(axiosApi);
Vue.use(elCascaderMulti); // 注册 基于EL 的多链选择器




//自定义事件
Vue.directive('enterNumber', {
    inserted: function (el) {
        el.addEventListener("keypress", function (e) {
            e = e || window.event;
            let charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
            let re = /\d/;
            if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        });
    }
});
//自定义指令(财务系统专属)
Vue.directive('financialCoin', {
    componentUpdated:function(el) {
        let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
        ele.oninput = function() {
        console.log(ele.value)
        let val = ele.value;
        val = val.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
        val = val.replace(/^\./g,""); //验证第一个字符是数字
        val = val.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d\d).*$/,'$1$2.$3'); //只能输入三个小数
        ele.value = val;
        }
    },
});
// 自定义指令（折扣格式，如：3.2折）
Vue.directive('discount',{
    inserted:function(el) {
        el.addEventListener("keypress", function (e) {
            e = e || window.event;
            let val = e.srcElement.value + e.key;
            // 第一位匹配数字，第二位匹配.点，第三位匹配零个或一个数字
            // (\.\d?)? 表示匹配零个或一个这个的（.2）数值
            let re = /^\d(\.\d?)?/g;
            let _value = val.match(re) && val.match(re);
            if(_value != val) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        });
    },
});
//自定义权限事件
Vue.directive('auth', {
    inserted(el, binding, vnode) {
        binding.value.forEach(item => {
            if (item == el.dataset.code) {
                if (el.parentNode) {
                    Vue.prototype.$nextTick(() => {
                        // el.parentNode.removeChild(el)
                        el.style.display ='none'
                    })
                }else{
                    el.style.display ='block'
                }
            }
        })
    },
    componentUpdated(el, binding, vnode) {
        binding.value.forEach(item => {
            if (item == el.dataset.code) {
                if (el.parentNode) {
                    Vue.prototype.$nextTick(() => {
                        el.parentNode.removeChild(el)
                    })
                }
            }
        })
    }
});

Vue.directive('noMoreClick', {
    inserted(el, binding) {
        el.addEventListener('click', e => {
            el.classList.add('is-disabled');
            el.disabled = true;
            setTimeout(() => {
                el.disabled = false;
                el.classList.remove('is-disabled');
            }, 3000)
        })
    }
});
// 路由导航
import  '@/permission'

 new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
