<template>
  <el-menu-item-group>
    <template v-for="chmenu in menu">
      <template v-if="chmenu.type == 1">
        <el-menu-item-group :key="chmenu.id"  style="margin-top:10px">
           <template slot="title">
             <img v-if="!!chmenu.icon" class="icon-img" :src="chmenu.icon" >
             <i v-else  class="icon-station"></i>
             <span class="chmenu-name">{{chmenu.name}}</span>
           </template>
          <template v-if="chmenu.sublist && chmenu.sublist.length>0">
            <template v-for="item in chmenu.sublist" >
              <template v-if="item.sublist && item.sublist.length > 0">
                <el-menu-item-group :key="item.id" :title="item.name" v-if="item.type == 1">
                  <lss-sub-menu v-if="item.sublist && item.sublist.length > 0" :key="item.id" :menu="item.id"/>
                </el-menu-item-group>
                <lss-sub-menu :key="item.id" :menu="item.sublist" v-else/>
              </template>
              <template v-else>
                <el-menu-item-group v-if="item.type==1" :key="item.id" :title="item.name"></el-menu-item-group>
                <el-menu-item :key="item.id" :index="item.routePath" @click="selMenu(item)" class="el-itemname"  v-else>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}
                </el-menu-item>
              </template>
            </template>
          </template>
        </el-menu-item-group>
      </template>
      <template v-else>
        <el-submenu v-if="chmenu.sublist && chmenu.sublist.length > 0" :key="chmenu.id" :index="chmenu.id"  class="submenuname">
          <template slot="title">
             <img v-if="!!chmenu.icon" class="iconimg" :src="chmenu.icon" alt>
              {{chmenu.name}}
          </template>
          <lss-sub-menu :menu="chmenu.sublist"></lss-sub-menu>
        </el-submenu>
        <el-menu-item v-else :index="chmenu.routePath" :key="chmenu.id"   class="chmenufour" @click="selMenu(chmenu)">
        <img v-if="!!chmenu.icon" class="iconimg" :src="chmenu.icon" alt>
         {{chmenu.name}}
        </el-menu-item>
      </template>
    </template>
  </el-menu-item-group>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: "lss-sub-menu",
  props: ["menu"],
  methods: {
    ...mapActions({
      cachedViewDelAll: 'cachedViews/cachedViewDelAll',
      cachedViewAdd: 'cachedViews/cachedViewAdd'
    }),
    selMenu(curMenu) {
      if(!curMenu.routePath) return;
      // 清除所有缓存的页面
      this.cachedViewDelAll();
      this.$nextTick(() => {
        // 判断是否缓存页面
        let routeName = curMenu.routePath.split('/').pop();
        let keepAlive = JSON.parse(curMenu.meta).keepAlive || false;
        if(keepAlive){
          this.cachedViewAdd(routeName);
        }
      })
    },
  }
};
</script>
<style scoped>
.iconimg{
  width: 16px;
  height: 16px;
  margin-right: 5px;
  vertical-align: -3px;
}
.icon-station{
  display: inline-block;
    width: 16px;
  height: 16px;
  margin-right: 5px;
}

.chmenufour{
  /* background: #4f525b !important; */
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  margin: 10px 0;
}
/* .el-menu-item-group__title .chmenu-name{
  margin-bottom: 10px;
  display: inline-block;
} */
.el-submenu .el-menu-item{

}
.el-itemname{
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  margin: 10px 0;
}
</style>
