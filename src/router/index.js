import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/*
 * @Description: App升级版本管理
 * @Author: elephant
 * @Date: 2019-09-02 20:17:47
 * @LastEditTime : 2020-01-09 16:34:53
 * @LastEditors  : Please set LastEditors
 */
//升级详情
const upgradeDetails = resolve => require(['@/views/product/version/upgrade_details.vue'], resolve);
//版本详情
const versionDetails = resolve => require(['@/views/product/version/version_details.vue'], resolve);
import warehouse from '@/router/warehouse/index'
export default new Router({
  mode: 'history',
  routes: [
    warehouse,
    {
      path: '/',
      name: '',
      component: resolve => require(["@/views/login/login_new"], resolve),
      hidden: true,
      meta: {}
    },{
      path: '/login/login_new',
      name: 'login_new',
      component: resolve => require(["@/views/login/login_new"], resolve),
      hidden: true,
      meta: {}
    },
    {
      path: '/login/find',
      name: 'login/find',
      component: (resolve) => require(['@/views/login/find'], resolve),
      hidden: true,
      meta: {
        backBtn: false
      }
    },
    {
      path: '/login/register',
      name: 'login/register',
      component: (resolve) => require(['@/views/login/register'], resolve),
      hidden: true,
      meta: {
        backBtn: false
      }
    },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(["@/views/home/home.vue"], resolve),
      meta: {
        title: '工作台',
        topBar:false,
        topShow:true
      }
    },
    {
      path:'/allManagement',
      name:'allManagement',
      component: resolve => require(['@/views/product/commodity/management.vue'],resolve),
      meta:{
        title:'管理',
        topBar:true
      }
    },
    {
      path: '/applicationVersion/version/version_list',
      name: 'version_list',
      component: resolve => require(['@/views/product/version/version_list.vue'], resolve),
      meta: {
        title: '版本管理',
        topBar: true
      }
    },
    {
      path: '/applicationVersion/version/upgrade_list',
      name: 'upgrade_list',
      component: resolve => require(['@/views/product/version/upgrade_list.vue'], resolve),
      meta: {
        title: '升级管理',
        topBar: true
      }
    },
    {
      path: '/applicationVersion/version/add_version',
      name: 'add_version',
      component:versionDetails,
      meta: {
        title: '新建版本',
        topBar: true
      }
    },
    {
      path: '/applicationVersion/version/edit_version',
      name: 'edit_version',
      component:versionDetails,
      meta: {
        title: '修改版本',
        topBar: true
      }
    },
    {
      path: '/applicationVersion/version/add_upgrade',
      name: 'add_upgrade',
      component:upgradeDetails,
      meta: {
        title: '新建升级方案',
        topBar: true
      }
    },
    {
      path: '/applicationVersion/version/edit_upgrade',
      name: 'edit_upgrade',
      component:upgradeDetails,
      meta: {
        title: '修改升级方案',
        topBar: true
      }
    },
    {
      path: '/share/product_list',
      name: 'productShareShow',
      component: resolve => require(['@/views/product/share/product_list.vue'], resolve),
      meta: {
        title: '商品档案分享查看',
        topBar: true
      }
    },

    // 路由配置
    {
      path: '/router/config',
      name: 'config',
      component: resolve => require(['@/views/router/config'], resolve),
      meta: {
        title: '路由配置',
        topBar: true
      }
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
