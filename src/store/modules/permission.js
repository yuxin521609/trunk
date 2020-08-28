
import Vue from 'vue'
// 子路由列表
let authModuleRoutes = [];
// 菜单的按钮权限 Object  key值为该页面对应的Id
let authPageBtns = {

};
/**
 * 初始化路由
 * @param data 数据 tree
 */
// 模块转路由
function authModuleToRoutes(data, menuId){
  if(data && data.length){
    data.forEach(item =>{
      if(item.sublist && item.sublist.length){
        authModuleToRoutes(item.sublist, menuId)
      }else {
        if(item.modulePath && item.routePath){
          // 添加菜单路由
          addItemRoute(item, menuId, false);
          // 添加按钮路由及权限数据
          authPageBtns[item.id] = [];
          if(item.authlist && item.authlist.length) {
            item.authlist.forEach(authListItem => {
              // 添加按钮权限code
              if(!authPageBtns[item.id].includes(authListItem.code)) {
                authPageBtns[item.id].push(authListItem.code);
              }
              if(authListItem.modulePath && authListItem.routePath){
                addItemRoute(authListItem, menuId, true, item.id);
              }
            })
          }
        }
      }
    })
  }
}
function addItemRoute(data, menuId, backBtnFlag) {
  // 判断按钮路由是否是对应多个
  if(data.modulePath.indexOf('&') > -1){
    let modulePaths = data.modulePath.split('&');
    let routePaths = data.routePath.split('&');
    let metas = [];
    if(data.meta) {
      metas = data.meta.split('&');
    }
    modulePaths.forEach((modulePathItem, modulePathIndex) => {
      let routeItem = JSON.parse(JSON.stringify(data));
      routeItem.modulePath = modulePathItem;
      routeItem.routePath = routePaths[modulePathIndex] || routePaths[0];
      routeItem.meta = metas[modulePathIndex] || metas[0] || {};
      addItemRoute(routeItem, menuId, backBtnFlag);
    })
  }else {
    // 提取模块name及meta信息
    let routeName = data.routePath.split('/').pop(), meta = {};
    if(data.meta){
      meta = JSON.parse(data.meta);
    }
    // 判断是否添加过
    let flag = authModuleRoutes.every(routeItem => {
      return routeItem.name !== routeName;
    });
    if(flag){
      authModuleRoutes.push({
        path: data.routePath,
        name: routeName,
        component: resolve => require([`@/views${data.modulePath}.vue`], resolve),
        meta: {
          keepAlive: meta.keepAlive,
          topBar: meta.topBar === undefined ? true : meta.topBar,
          backBtn: backBtnFlag,
          icon: meta.icon,
          title: data.name,
          currentid: data.id,
          appId: data.appId,
          parentId: menuId
        }
      });
    }
  }
}
/**
 * 获取模块下的所有路由
 * @param moduleInfo 模块信息
 */
function getAuthModuleMenus(moduleInfo){
  
  return new Promise(async (resolve) => {
    let moduleMenus = await Vue.prototype.request(Vue.prototype.api.system.menu_getRouteByUser, {
      appId: moduleInfo.id,
      platformType: moduleInfo.platformType
    });
    if(moduleMenus && moduleMenus.length){
      authModuleRoutes = [];
      moduleMenus.forEach(item => {
        // 获取左侧模块需要路由上绑定最顶级menu的id
        authModuleToRoutes(item.sublist, item.id);
      })

      let moduleRoutes = [
        {
          path: moduleInfo.routePath,
          name: 'index',
          component: resolve => require(["@/views/index"], resolve),
          children: authModuleRoutes
        }
      ];
      state.authPageBtns = authPageBtns;
      resolve({moduleRoutes, moduleMenus});
    }
  })

}


const state = {
  // 路由
  routes: [],
  // 模块
  menus: [],
  // header选中的
  menuId: '',
  // 左侧菜单
  subMenu: [],
  // 菜单的按钮权限 Object  key值为该页面对应的Id
  authPageBtns: {}
};

const mutations = {
  // 新增模块路由
  SET_ROUTES: (state, {moduleRoutes, moduleMenus}) => {
    state.routes = moduleRoutes;
    state.menus = moduleMenus;
  },
  // 设置顶部模块id及左侧菜单
  SET_SUB_MENU_INFO: (state, {menuId, subMenu}) => {
    state.menuId = menuId;
    state.subMenu = subMenu;
  },
  // 设置菜单的按钮权限
  SET_AUTH_PAGE_BTNS: (state, authPageBtns) => {
    state.authPageBtns = authPageBtns;
  },
};

const actions = {
  // 获取模块路由
  getModuleRoutes({ commit }, moduleInfo) {
    return new Promise(async (resolve) => {
      getAuthModuleMenus(moduleInfo).then(({moduleRoutes, moduleMenus}) => {
        commit('SET_ROUTES', {moduleRoutes, moduleMenus});
        resolve(moduleRoutes)
      });
    })
  },
  // 清除所有的路由及模块
  clearModuleRoutes({ commit }){
    let moduleRoutes = [], moduleMenus = [];
    commit('SET_ROUTES', {moduleRoutes, moduleMenus})
  },
  // 设置顶部模块id及左侧菜单
  setSubMenuInfo: ({ commit }, {menuId, subMenu}) => {
    commit('SET_SUB_MENU_INFO', {menuId, subMenu})
  },
  // 设置菜单的按钮权限
  setAuthPageBtns: ({ commit }, authPageBtns) => {
    commit('SET_AUTH_PAGE_BTNS', authPageBtns)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
