<style scoped lang="less">
.rebort_table_title,
.rebort_table_list {
  display: flex;
  border: 1px solid #ccc;
  border-right: none;
  border-top: none;
}

.rebort_table_title li,
.rebort_table_list li {
  width: 25%;
  min-height: 47px;
  /*display: flex;*/
  /*align-items: center;*/
  border-right: 1px solid #ccc;
  box-sizing: border-box;padding: 12px 20px 5px;
  .el-checkbox{margin-bottom: 6px;}
}
.per_wrapper {
  overflow-y: scroll;
  max-height: 500px;
}
.span_menu {
  margin-left: 5px;
}
.el-checkbox{
  margin-right: 20px;
}
.shuang{
  background:#f5f5f5;
  }
.dan{
  background: #fff;
}
</style>

<template>
  <div :class="{'per_wrapper' : curLevel == 1}">
    <div v-for="(item, index) in list" :key="item.id" >
      <ul class="rebort_table_list" :class="{shuang : index%2 === 0, dan : index%2 === 1}">
        <!--功能权限-->
        <li :style="dyStyle(item)">
          <el-checkbox
            v-if="item.type == 'application' || item.type == 'menu'"
            v-model="item.checked"
            @change="leftChange(item)"
          ></el-checkbox>
          <i
            v-if="!subIsAuth(item)"
            :class="[item.sublist.length > 0 ? item.display ? 'el-icon-minus' : 'el-icon-plus' : '']"
            @click="clickUl(item)"
          ></i>
          <span class="span_menu">{{ item.name }}</span>
        </li>
        <!--操作权限-->
        <li>
          <template v-if="subIsAuth(item)">
            <el-checkbox
              v-for="(sub, _index) in item.sublist"
              :key="sub.id"
              v-model="sub.checked"
              @change="authChange(item, $event)"
            >{{ sub.name }}</el-checkbox>
          </template>
        </li>
        <!--字段权限-->
        <li>
          <el-checkbox v-if="0">{{ item.name }}</el-checkbox>
        </li>
        <!--数据权限-->
        <li>
          <template v-if="item._dataAuthList && item._dataAuthList.length">
            <el-radio-group v-model="item._dataAuthChecked">
              <el-radio :label="dataAuth.authType" v-for="dataAuth in item._dataAuthList" :key="dataAuth.id">{{ dataAuth.name }}</el-radio>
            </el-radio-group>
          </template>
        </li>
      </ul>
      <tree-permission
        v-show="item.display"
        :data="item.sublist"
        :parent="item"
        v-if="item.sublist && !subIsAuth(item)"
        :level="curLevel + 1"
        @item-change="itemChange"
      ></tree-permission>
    </div>
  </div>
</template>
<script>
export default {
  name: "tree-permission",
  props: ["data", "level", "parent"],
  data() {
    return {
      list: this.data,
      curLevel: this.level || 1
    };
  },
  mounted(){
    this.$nextTick(()=>{

    })
  },
  watch: {
    data(val) {
      this.list = val;
    }
  },
  computed: {
    notAuth() {
      var list = this.list;
      var isAuth =
        list && list.length > 0 && list.findIndex(f => f.type == "auth") > -1;
      return !isAuth;
    }
  },
  methods: {
    // 功能权限缩进计算
    dyStyle(item) {
      var ty = item.type;
      if (ty == "application" || ty == "menu") {
        var sty = {
          paddingLeft: 23 * this.curLevel + "px"
        };
        return sty;
      }
    },
    // 功能权限选中状态改变
    leftChange(item, originAuth) {
      this.$emit(
        "item-change",
        this.parent != undefined ? this.parent : item.checked
      );
      if (!originAuth) {
        this.rightChange(item);
      }
    },
    // 功能权限展开 收起
    clickUl(item) {
      if (item.display == undefined) {
        this.$set(item, "display", true);
      } else {
        item.display = !item.display;
      }
    },
    // 判断是否是操作权限
    subIsAuth(item) {
      var sublist = item.sublist;
      return (
        sublist.length > 0 && sublist.findIndex(f => f.type == "auth") > -1
      );
    },
    // 操作权限改变时
    authChange(parent) {
      if (parent) {
        var hasChecked = parent.sublist.findIndex(f => f.checked) > -1;
        if (hasChecked) {
          parent.checked = hasChecked;
          this.leftChange(parent, 1);
        }
      }
    },
    // 除操作权限外的权限 全选全不选
    rightChange(item) {
      var self = this;
      if (item.sublist && item.sublist.length > 0) {
        item.sublist.forEach(f => {
          f.checked = item.checked;
          self.rightChange(f);
        });
      }
      // if (!item.checked && item.sublist && item.sublist.length > 0) {
      // }
    },
    //
    itemChange(parent) {
      this.authChange(parent);
    }
  }
};
</script>

