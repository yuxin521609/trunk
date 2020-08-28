<template>
  <el-menu
    :default-active="menuId"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#383a41"
    text-color="#abadb6"
    active-text-color="#fff">
    <el-menu-item index="-1"  @click="goToHome()"  class="logonav">
        <img class="logoimg" src="../assets/img/logoimg.png" alt>
        <em  style="right:0; top:12px"></em>
    </el-menu-item>
    <el-menu-item
      class="el-chnageSubMenu"
      v-for="item in sortMenu"
      :key="item.id"
      :index="item.id"
      @click="changeSubMenu(item.id)">{{item.name}}</el-menu-item>


    <el-menu-item index="2" class="iconbell">
       <!-- <b class="yuan">99+</b> -->
       <i class="fa fa-bell "></i>
       <em  style="left:0; top:12px"></em>
    </el-menu-item>
     <el-submenu index="2" class="submenu">
      <template slot="title" ><span>{{userInfo && userInfo.name}}</span></template>
      <el-menu-item index="2-1"><span>设置</span></el-menu-item>
      <el-menu-item @click="goToHome()" index="2-4"><span>工作台</span></el-menu-item>
      <el-menu-item @click="content()" index="2-2"><span>个人中心</span></el-menu-item>
      <el-menu-item @click="exit()" index="2-3"><span>退出</span></el-menu-item>
    </el-submenu>

  </el-menu>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import * as userTypes from "@/types/userConfig";
export default {
  name: "navcon",
  props: ["allMenu", "menuId"],
  data() {
    return {
      imgShow: require("../assets/img/show.png"),
      imgSq: require("../assets/img/sq.png")
    };
  },
  computed: {
    ...mapGetters({
      userInfo: userTypes.GETTER_USERINFO
    }),
    sortMenu() {
      return this.allMenu.sort((a, b) => {
        return a["sort"] < b["sort"] ? -1 : 1;
      });
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.getUserInfo();
  },
  methods: {
    ...mapActions({
      logout: userTypes.FN_LOGOUT,
      getUserInfo: userTypes.FN_GET_USERINFO
    }),
    changeSubMenu(menuId) {
      this.$emit("change-menu", menuId);
    },
    goToHome(){
      this.$router.push({
        path:'/home',
        query: {
          isClearRouter: true
        }
      });
    },
    // 退出登录
    exit() {
      var self = this;
      this.$confirm("退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.logout();
          this.$router.push({ path: "/login/login_new" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.submenu {
  float: right;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active,.iconbell:active {
  border: none;
}
.el-menu--horizontal>.el-menu-item:first-child{
  border-right: #fff;
}
.iconbell{
  float: right;
  position:relative;
}
.iconbell:hover i,.submenu:hover span,.el-menu--horizontal .el-menu-item:hover span{
  color: #fff;
}
.iconbell i,.submenu span,.el-menu--horizontal span{
  color: #9398a8;
}
.el-menu--horizontal .el-menu .el-menu-item{
  height: 54px;
  line-height: 54px
}
.el-menu--horizontal .el-menu .el-menu-item:hover{
   background-color: #4a4c53 !important;
}
.iconbell b{
  background: red;
  position: absolute;
  top: 13px;
  left: 2px;
  display: inline-block;
  font-size: 10px;
  text-align: center;
  padding: 2px;
  line-height: 14px;
  border-radius: 9px;
}
.el-menu--horizontal>.el-menu-item:hover,
.el-menu--horizontal>.el-submenu /deep/.el-submenu__title:hover{
  background-color: #6e717b !important;
  color:#fff !important;
}
.asideshow .el-submenu  /deep/.el-menu-item{
  font-size: 12px !important;
}
.logonav em,.iconbell em{
  width: 1px;
  height: 36px;
  background: #212329;
  display: inline-block;
  color: #212329;
  position: absolute;
}
.el-menu--horizontal>.el-menu-item{
  height: 56px;
  line-height: 56px;
}
.el-menu--horizontal>.el-submenu /deep/.el-submenu__title{
  height: 56px !important;
  line-height: 56px !important;
}
.logoimg {
  height: 20px;
}
.el-menu--horizontal>.el-menu-item.is-active {
  //  background-color: #409EFF !important;
   border-bottom: 0 !important;
}
.el-menu--horizontal>.el-menu-item{
  border-bottom: 0 !important;
}
// .el-menu-demo{
//   background: red !important;
// }
</style>
