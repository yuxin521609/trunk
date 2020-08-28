<!--
 * @Description:公共页面
 * @Author: your name
 * @Date: 2019-07-01 15:20:22
 * @LastEditTime: 2019-08-20 17:20:41
 * @LastEditors: Please set LastEditors
 -->
<style scoped>
  .index-con {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .aside {
    width: 64px !important;
    height: 100%;
    background-color: #5c5e67;
    margin: 0px;
  }
  .aside-show {
    width: 200px !important;
    min-height: calc(100% - 70px);
    background-color: #5c5e67;
    margin: -1px;
  }
  .el-aside {
    position: relative;
    z-index: 105;
  }

  .v-topBar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    background-color: #ffffff;
    margin-bottom: 8px;
  }
  .topbar-wrap i {
    margin-right: 10px;
    cursor: pointer;
    font-size: 18px;
    vertical-align: -2px;
  }
</style>
<template>
  <el-container class="index-con">
    <el-header class="index-header" height="60px;">
      <nav-con @change-menu="getSubMenu" :all-menu="moduleMenu" :menu-id="menuId"></nav-con>
    </el-header>
    <el-container class="main-con">
      <el-aside class="aside-show">
        <left-nav :module-menu="subMenu"></left-nav>
      </el-aside>
      <el-main class="index-main">
        <el-scrollbar>
          <div class="v-topBar">
            <nav class="topbar-wrap">
              <i class="el-icon-back" v-if="backBtn" @click="routerBack"></i>
              <i class="fa fa-home fa-lg" v-else></i>
              <span>{{ topTitle }}</span>
            </nav>
          </div>
          <keep-alive :include="cachedViews">
            <router-view class="base-c" :key="key" />
          </keep-alive>
<!--          <keep-alive>-->
<!--            <router-view v-if="$route.meta.keepAlive"></router-view>-->
<!--          </keep-alive>-->
<!--          <router-view v-if="!$route.meta.keepAlive"></router-view>-->
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入组件
import NavCon from "../components/navcon.vue";
import LeftNav from "../components/leftnav.vue";
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: "index",
  // 注册组件
  components: {
    NavCon,
    LeftNav
  },
  data() {
    return {
      // 页面显示名称
      topTitle: "",
      // 是否显示topBar
      topBar: null,
      // 是否显示返回
      backBtn: null
    }
  },

  created() {
    this.topTitle = this.$route.meta.title;
    this.topBar = this.$route.meta.topBar === undefined ? true : this.$route.meta.topBar;
    this.backBtn = this.$route.meta.backBtn === undefined ? true : this.$route.meta.backBtn;
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })

  },
  methods: {
    ...mapActions({
      setSubMenuInfo: 'permission/setSubMenuInfo'
    }),
    routerBack() {
      this.$router.go(-1);
    },
    init(){
      let meta = this.$route.meta;
      this.topTitle = meta.title;
      let menuId = meta.parentId;
      if(menuId){
        this.getSubMenu(menuId);
      }else {
        this.setSubMenuInfo({
          menuId: this.moduleMenu[0].id,
          subMenu: this.moduleMenu[0].sublist
        });
      }
    },
    getSubMenu(menuId) {
      for(let menuItem of this.moduleMenu){
        if(menuItem.id === menuId){
          this.setSubMenuInfo({
            menuId,
            subMenu: menuItem.sublist
          });
          break;
        }
      }
    }
  },
  computed: {
    // 获取模块菜单和缓存页面
    ...mapGetters({
      moduleMenu : 'permissionMenus',
      menuId : 'permissionMenuId',
      subMenu : 'permissionSubMenu',
      cachedViews : 'cachedViews'
    }),
    // 标识
    key() {
      return this.$route.path
    }
  },
  watch: {
    $route: {
      handler:function(val,oldval){
        setTimeout(()=> {
          this.topTitle = this.$route.meta.title;
          this.topBar = this.$route.meta.topBar === undefined ? true : this.$route.meta.topBar;
          this.backBtn = this.$route.meta.backBtn === undefined ? true : this.$route.meta.backBtn;
        },0);
      },
      deep:true
    },
    cachedViews: {
      handler:function(val,oldval){

      },
      deep:true
    }
  }
};
</script>

