<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    class="alarmPopup"
    width="900px"
  >
    <div>
      <h5 class="box-top" style="font-size:18px;">关联角色</h5>
      <div class="flex-w item-table mr-10">
        <div class="item-margin">
          <div class="item-table">
            <el-table
              :data="tableListData"
              stripe
              empty-text="暂无数据"
              header-align="left"
              header-row-class-name="item-table-header"
              :highlight-current-row="true"
            >
              <el-table-column prop="type" align="left" label="角色类型" width="200">
                <template slot-scope="scope">{{"CEN003"|codeToName(scope.row.type)}}</template>
              </el-table-column>
              <el-table-column prop="name" align="left" label="角色名称" min-width="100"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "user_role_list",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      userId: String,
      classDialogVisible: false,
      tableListData: [
        {
          code: String
        }
      ],
      serviceParam: null //向子组件传参 需设置类型
    };
  },
  created() {},

  methods: {
    //关闭
    closeDialog() {
      this.classDialogVisible = false;
    },
    userRoleListPopupInit() {
      this.classDialogVisible = true;
      this.userId = this.itemParam.id;
      this.getTableList();
    },
    //获取列表
    getTableList() {
      const filtersData = new Object();
      filtersData.userId = this.userId;
      this.request(this.api.user.userCompany_getRoleList, filtersData).then(
        data => {
          this.tableListData = data;
        }
      );
    },
    //子组件传参刷新 父组件
    refreshList() {
      this.handleResetFilters("filtersForm");
      this.handleSearch();
    }
  }
};
</script>
<style lang="less" scoped>
h5 {
  color: #222;
  //  margin-left: -15px;
}
</style>
