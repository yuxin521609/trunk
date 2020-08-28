<template>
  <el-aside class="wrapper_sidebar" width="246px;">
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      router
    >
      <!-- <el-radio-group>
        <div style="height:100%;">
          <div class="sidebar_top">
            <i class=""></i>
          </div>
        </div>
      </el-radio-group> -->
      <el-scrollbar id="scrollbar" class="sidebar-list">
        <el-submenu index="1">
          <template slot="title">

            <span slot="title" class="sidebar_text">商品管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/index">商品列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">

            <span slot="title" class="sidebar_text">库存管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/stock_list">库存管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">

            <span slot="title" class="sidebar_text">规格信息管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/spctification_list">规格管理</el-menu-item>
            <el-menu-item index="/basic_list">基本信息管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">

            <span slot="title" class="sidebar_text">供应商品牌管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/brand_list">品牌管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="/supplier_list">供应商管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">

            <span slot="title" class="sidebar_text">分类管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/class_list">商品分类管理</el-menu-item>
            <el-menu-item index="/class_attribute">属性分类管理</el-menu-item>
            <el-menu-item index="/class_custom">定制分类管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">

            <span slot="title" class="sidebar_text">版式管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="">定制商品管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
         <el-submenu index="7">
        <template slot="title">

          <span slot="title" class="sidebar_text">定制属性管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="">标准属性管理</el-menu-item>
          <el-menu-item index="">供应商属性管理</el-menu-item>
          <el-menu-item index="">供应商支持管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      </el-scrollbar>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  name: "v-sidebar",
  data() {
    return {
      isCollapse: false,
      IsDisplay: false
    };
  },
  created() {
     //console.log(this.$store);
  },
  mounted() {
    //console.log(this.$route.path)
    //this.eventWindowResize(true);
  },
  methods: {
    // changeIsCollapse () {
    //   this.isCollapse = !this.isCollapse;
    //   this.eventWindowResize(true);
    // },
    eventWindowResize(isActive) {
      if (isActive) {
        var currentclientHeight = document.documentElement.clientHeight;
        document.getElementById("scrollbar").style.height =
          currentclientHeight - 170 + "px";
      }
      window.addEventListener("resize", function() {
        var currentclientHeight = document.documentElement.clientHeight;
        document.getElementById("scrollbar").style.height =
          currentclientHeight - 170 + "px";
      });
    }
  },
  computed: {
    defaultActive: function() {
      return this.$route.path;
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 246px;
  min-height: 400px;
}
.el-menu-item:focus,
.el-menu-item:hover {
  outline: 0;
  background-color: none;
}
.el-menu {
  border-right: none;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background: none;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}

.red-title {
  // padding-left: 65px;
  color: #ff0000;
  font-weight: bold;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
}
</style>


