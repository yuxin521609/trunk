<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey">
          <el-input
            v-model="signData.searchKey"
            placeholder="订单编号/收货人/收货地址/配货人"
            style="width:330px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态：" prop="businessStatusList">
          <el-select v-model="signData.businessStatusList" placeholder="请选择">
            <el-option label="待处理" value="13"></el-option>
            <el-option label="已处理" value="14"></el-option>
            <el-option label="已作废" value="15"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货仓库：" prop="warehouseStatusList" label-width="100px">
          <el-select v-model="signData.warehouseStatusList" placeholder="请选择">
            <el-option label="未到货" value="1001"></el-option>
            <el-option label="部分到货" value="1002"></el-option>
            <el-option label="全部到货" value="1003"></el-option>
            <el-option label="超收到货" value="1004"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据来源：" prop="financialWriteOff">
          <el-select v-model="signData.financialWriteOff" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="startTime">
          <el-date-picker v-model="signData.startTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="signData.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormData" size="small">搜索</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-button plain @click="addBtnClick" size="small">新增</el-button>
      <el-table
        ref="multipleTable"
        :data="tableListData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="item-table-header"
      >
        <el-table-column label="策略名称">
          <template slot-scope="scope">{{ scope.row.statementSn ? scope.row.statementSn : '--'}}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="订单类型">
          <template slot-scope="scope">{{ scope.row.merchant?scope.row.merchant:'--' }}</template>
        </el-table-column>
        <el-table-column prop="statementCycleType" label="拆单规则">
          <template slot-scope="scope">{{scope.row.statementCycleType}}</template>
        </el-table-column>
        <el-table-column prop="generalLedger" label="更新时间">
          <template slot-scope="scope">{{scope.row.generalLedger}}</template>
        </el-table-column>
        <el-table-column prop="weChatPayLedger" label="更新人">
          <template slot-scope="scope">{{ scope.row.weChatPayLedger }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="checkBtnClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="editorBtnClick(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
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
    </div>
    <el-dialog
      :title="title"
      :visible.sync="showAddDialog"
      width="500px"
      @close="hideAddDialogEvent"
    >
      <el-form :model="cycleFromData" ref="cycleFromData" :rules="rules">
        <el-form-item label="策略名称：" label-width="120px" prop="name">
          <el-input v-model="cycleFromData.name" style="width:200px;" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="订单类型：" label-width="120px" prop="taskCode">
          <el-select v-model="cycleFromData.taskCode" placeholder="请选择">
            <el-option label="未到货" value="1001"></el-option>
            <el-option label="部分到货" value="1002"></el-option>
            <el-option label="全部到货" value="1003"></el-option>
            <el-option label="超收到货" value="1004"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单来源：" label-width="120px" prop="merchantType">
          <el-select v-model="cycleFromData.merchantType" placeholder="请选择">
            <el-option label="未到货" value="1001"></el-option>
            <el-option label="部分到货" value="1002"></el-option>
            <el-option label="全部到货" value="1003"></el-option>
            <el-option label="超收到货" value="1004"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拆单规则：" label-width="120px" prop="merchantId">
          <el-radio v-model="radio" label="1" class="radio-label">按仓库维度,条件：</el-radio>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="订单商品在同一个仓库全部满足，单仓发货;" style="display:block;"></el-checkbox>
            <el-checkbox label="订单商品在多个仓库满足，按仓库拆单，多仓发货;" style="display:block;"></el-checkbox>
            <el-checkbox label="库存不满足，默认最大库存仓库，单仓发货;" style="display:block;"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClickEvent('cycleFromData')">取 消</el-button>
        <el-button type="primary" @click="sureAddFromOfCycle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //标识是否显示新增框-dialog
      showAddDialog: false,
      title: "新增拆单策略",
      cycleFromData: {},
      radio: "1",
      checkList:[],

      rules: {
        name: [
          { required: true, message: "策略名称不能为空", trigger: "blur" }
        ],
        taskCode: [
          { required: true, message: "订单类型不能为空", trigger: "change" }
        ],
        merchantType: [
          { required: true, message: "订单来源不能为空", trigger: "change" }
        ]
      },
      signData: {
        searchKey: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //表格数据源
      tableListData: [{ refundSn: "010101" }],
      //总条数
      totalCount: 1,
      //存储需要导出的数据
      multipleSelectionData: []
    };
  },
  methods: {
    //查询
    searchFormData() {
      console.log("searchFormData---");
    },
    //重置
    resetFormData(ruleForm) {
      console.log("resetForm----");
      this.$refs[ruleForm].resetFields();
    },
    //新增Btn按钮的点击事件
    addBtnClick() {
      console.log("addBtnClick---");
      this.showAddDialog = true;
    },
    //查看Btn的点击事件
    checkBtnClick(row) {
      console.log("checkBtnClick---row--");
    },
    //修改Btn的点击事件
    editorBtnClick() {
      console.log("editorBtnClick---");
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getBillWaitListData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getBillWaitListData();
    },
    //dialog-关闭事件
    hideAddDialogEvent() {
      console.log("hideAddDialogEvent---");
      this.$refs.cycleFromData.resetFields();
      this.checkList=[]
    },
    //取消-dialog
    cancelClickEvent() {
      this.hideDialog();
    },
    //确定-dialog
    sureAddFromOfCycle() {
      console.log("sureAddFromOfCy---");
    }
  }
};
</script>

<style lang="less" scoped>
.search_div {
  background-color: #fff;
  padding-top: 20px;
  margin: 0 10px;
}
.table_div {
  background-color: #fff;
  padding: 10px;
  margin: 10px;
}
.radio-label /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #222;
}
.pagination {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
  text-align: right;
}
</style>