<template>
  <el-menu
    collapse-transition
    router
    :default-active="routePath"
    unique-opened
    class="el-menu-vertical-demo"
    background-color="#5c5e67"
    text-color="#abadb6"
    active-text-color="#fff"
  >
    <lss-sub-menu :menu="moduleMenu"></lss-sub-menu>
  </el-menu>
</template>

<script>
  import lssSubMenu from "@/components/submenu";
  export default {
    name: "left_nav",
    props: {
      activeId: {
        type: [String, Number],
        default: ""
      },
      moduleMenu: {
        default: () => [],
        type: Array
      }
    },
    data() {
      return {
        // 左菜单选中项
        routePath: ''
      };
    },
    components: {
      lssSubMenu
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        this.routePath = this.$route.path;
      });
    },
    computed:{
      sortMenu() {
        return this.moduleMenu.sort((a,b) => {
          return a["sort"] < b["sort"]?-1:1
        });
      }
    },
    methods: {
    },
    watch: {
      moduleMenu:{
        handler:function(val,oldval){
          setTimeout(()=> {
            this.routePath = this.$route.path;
          },0);
        },
        deep:true
      },
      $route: {
        handler:function(val,oldval){
          setTimeout(()=> {
            this.routePath = this.$route.path;
          },0);
        },
        deep:true
      }
    }
  };
</script>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 600px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    border: none;
    text-align: left;
  }
  .el-menu-item-group__title {
    padding: 0px;
  }
  .el-menu-bg {
    background-color: #1f2d3d !important;
  }
  .el-menu {
    border: none;
  }
  .logobox {
    height: 40px;
    line-height: 40px;
    color: #9d9d9d;
    font-size: 20px;
    text-align: center;
    padding: 20px 0px;
  }

  .el-menu-item-group .el-submenu__title:hover,.el-menu-item-group .el-menu-item:hover{
    background-color: #6e717b !important;
    color: #fff !important;
  }
  .el-menu-item-group .chmenu-name{
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 16px;
    margin-top: 20px;
    display: inline-block;
  }
  .el-menu-item, .el-submenu__title{
    height: 56px;
    line-height: 56px;
  }
  .el-tree-node__content{
    height: 40px;
    font-size: 12px;
  }
  .el-menu-vertical-demo  .el-menu-item.is-active {
    background-color: #409EFF !important;
  }
  .submenuname .el-submenu__title{
    color: #fff !important;
    font-weight: 600;
    /* font-size: 15px !important; */
  }
  .submenuname .el-menu--inline{
    background: #4f525b !important;
  }
  .submenuname .el-menu--inline .el-menu-item-group>ul li{
    background: #4f525b !important;
  }
  .submenuname .el-menu--inline .el-menu-item-group>ul li.is-active{
    background: #409EFF !important;
  }
</style>
