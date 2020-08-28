<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    class="alarmPopup"
    width="900px"
  >
    <div>
      <h5 class="box-top" style="font-size:18px;">关联机构</h5>
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
              <el-table-column prop="code" align="left" label="部门编码" width="200"></el-table-column>
              <el-table-column prop="name" align="left" label="授权机构/部门" min-width="100"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { formatTimestamp } from "@/utils/date";

export default {
  name: "user2depart",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      userId: String,
      classDialogVisible: false,
      itemStautsParam: {
        type: "add",
        title: "新增职位",
        id: ""
      },
      currentPage: 1, // 当前页数
      total: null, //总条目数
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
    user2DepartPopupInit() {
      this.classDialogVisible = true;
      this.userId = this.itemParam.id;
      this.getTableList();
    },
    //获取列表
    getTableList() {
      const filtersData = new Object();
      filtersData.userId = this.userId;
      filtersData.used = true;
      this.request(this.api.user.depart_getUserDepList, filtersData).then(
        data => {
          let _data = data;
          let _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].isShow = true;
            _data[i].isType = 1;
            _data[i].createTime = formatTimestamp(
              _data[i].createTime,
              "yyyy-MM-dd hh:mm:ss"
            );
          }
          this.tableListData = _data;
          this.total = data.totalCount;
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
