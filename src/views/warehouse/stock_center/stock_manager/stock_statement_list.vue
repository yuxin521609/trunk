<template>
  <div>
    <div class="table_div">
      <el-table
        ref="multipleTable"
        :data="tableListData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="item-table-header"
      >
        <el-table-column label="仓库名称">
          <template slot-scope="scope">{{ scope.row.statementSn ? scope.row.statementSn : '--'}}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="库存总量">
          <template slot-scope="scope">{{ scope.row.merchant?scope.row.merchant:'--' }}</template>
        </el-table-column>
        <el-table-column prop="statementCycleType" label="最近一次同步更新时间">
          <template slot-scope="scope">{{scope.row.statementCycleType}}</template>
        </el-table-column>
        <el-table-column prop="generalLedger" label="更新人">
          <template slot-scope="scope">{{scope.row.generalLedger}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="syncBtnClick(scope.row)" type="text" size="small">同步库存</el-button>
            <el-button @click="checkSyncBtnClick(scope.row)" type="text" size="small">查看同步记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="同步记录" :visible.sync="dialogTableVisible" @close="hideSyncDialog">
      <div class="dialog-div">
        <el-form ref="formData" :model="signData" :inline="true">
          <el-form-item label="仓库名称：" prop="businessStatusList">
            <el-select v-model="signData.businessStatusList" placeholder="请选择" style="width:150px;">
              <el-option label="待处理" value="13"></el-option>
              <el-option label="已处理" value="14"></el-option>
              <el-option label="已作废" value="15"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" prop="startTime">
            <el-date-picker v-model="signData.startTime" type="date" placeholder="开始日期" style="width:150px;"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime">
            <el-date-picker v-model="signData.endTime" type="date" placeholder="结束日期" style="width:150px;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchFormData" type="primary" plain size="small">搜索</el-button>
            <el-button @click="resetFormData" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="gridData"
          style="margin-bottom:15px;"
          header-row-class-name="item-table-header"
          max-height="400"
          @selection-change="selectionChange"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column property="date" label="仓库名称"></el-table-column>
          <!-- <el-table-column property="name" label="同步前存数量"></el-table-column>
          <el-table-column property="address" label="同步后存数量"></el-table-column>
          <el-table-column property="address" label="差异量"></el-table-column> -->
          <el-table-column property="address" label="同步时间"></el-table-column>
          <el-table-column property="address" label="更新人"></el-table-column>
          <!-- <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="exportBtnClick(scope.row)" type="text" size="small">导出差异产品</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="signData.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="signData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //标识dialog是否显示
      dialogTableVisible: false,
      //标识dialog下的表格数据
      gridData:[],

      signData: {
        startTime: "",
        endTime: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      tableListData: [{ statementSn: "sadhkj" }],
      //总条数
      totalCount: 1
    };
  },
  methods: {
    //同步库存Btn的点击事件
    syncBtnClick(row) {
      console.log("syncBtnClick-----");
    },
    //查看同步记录Btn的点击事件
    checkSyncBtnClick(row) {
      console.log("checkSyncBtnClick-----");
      this.dialogTableVisible=true;
    },
    //当前行的选中事件
    selectionChange(val) {
      console.log("selectionChange----");
    },
    //同步记录-dialog的隐藏事件
    hideSyncDialog() {
      console.log("hideSyncDialog--");
      this.$refs["formData"].resetFields();
    },
    //搜索
    searchFormData() {
      console.log("searchFormData---");
    },
    //重置
    resetFormData() {
      console.log("resetFormData---");
      this.hideSyncDialog()
    },
    //导出差异Btn的点击事件
    exportBtnClick() {
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "仓库名称",
          "同步前存数量",
          "同步后存数量",
          "差异量",
          "同步时间",
          "更新人"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "statementSn",
          "merchant",
          "statementCycleTypeName",
          "generalLedger",
          "weChatPayLedger",
          "person"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.tableListData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "同步记录差异表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //每页条数改变时-dialogTable
    handleSizeChange(page) {
      this.signData.pageSize = page;
      //   this.getBillWaitListData();
    },
    //当前页改变时-dialogTable
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      //   this.getBillWaitListData();
    }
  }
};
</script>

<style lang="less" scoped>
.table_div {
  background-color: #fff;
  padding-left: 10px;
}
.dialog-div{
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 10px;
  padding-left: 20px;
  height: 53px;
}
</style>>