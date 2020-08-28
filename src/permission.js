import Vue from 'vue'
import router from './router'
import store from './store'
import * as auth from '@/utils/auth'

// 登录白名单
const loginWhiteList = ['/', '/login/login_new', '/login/find','/login/register'];
// 页面白名单
const pageWhiteList = ['/allManagement', '/applicationVersion/version/version_list', '/applicationVersion/version/upgrade_list', '/applicationVersion/version/add_version', '/applicationVersion/version/edit_version', '/applicationVersion/version/add_upgrade', '/applicationVersion/version/edit_upgrade', '/router/config','/share/product_list' ];
// 全部白名单
const whiteList = [...loginWhiteList, ...pageWhiteList];

// 路由拦截器
router.beforeEach(async (to, from, next) => {
  // 是否有token
  let checkToken = auth.checkToken();
  if(!checkToken){
    // 判断是否白名单
    let whiteFlag = whiteList.includes(to.path);
    if(whiteFlag) {
      next();
    }else {
      let redirect = to.fullPath;
      router.replace({path: '/login/login_new',query: { redirect: redirect }});
    }
  } else {
    // 判断是否登录白名单
    let loginWhiteFlag = loginWhiteList.includes(to.path);
    // 判断是否页面白名单
    let pageWhiteFlag = pageWhiteList.includes(to.path);
    if(loginWhiteFlag) {
      next({ path: "/home" });
    }else if(to.path === "/home" || pageWhiteFlag) {
      next();
    }else {
      // 判断是否有路由权限
      const permissionRoutes = store.getters.permissionRoutes;
      const moduleMenu = store.getters.permissionMenus;
      if(permissionRoutes && permissionRoutes.length > 0){
        // 判断是否缓存页面
        let keepAlive = to.meta.keepAlive;
        if(keepAlive){
          store.dispatch('cachedViews/cachedViewAdd', to.name);
        }
        // 设置header选中的menuId 和 设置左侧菜单
        let menuId = to.meta.parentId, subMenu = [];
        for(let menuItem of moduleMenu){
          if(menuItem.id === menuId){
            subMenu = menuItem.sublist;
            break;
          }
        }
        store.dispatch('permission/setSubMenuInfo', {menuId, subMenu});
        Vue.prototype.$nextTick(() => {
          next();
        })
      }else {
        // 获取模块信息
        let toPathSplit = to.path.split('/');
        // 获取有权限的中台
        let allModules = await Vue.prototype.request(Vue.prototype.api.system.APPLICATION_GETLISTBYAUTH, {});
        // 模块信息
        let moduleInfo = {};
        let modulePath = `/${toPathSplit[1]}`;
        for (let moduleItem of allModules) {
          if (moduleItem.routePath === modulePath) {
            moduleInfo = moduleItem;
            break
          }
        }
        // 获取路由
        const moduleRoutes = await store.dispatch('permission/getModuleRoutes', moduleInfo);
        router.addRoutes(moduleRoutes);
        router.replace({path:to.path, query: to.query});
      }
    }

  }
})

