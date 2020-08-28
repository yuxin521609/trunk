<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey">
          <el-input class="first-input" v-model="signData.searchKey" placeholder="采购退货单号/采购订单号/创建人"></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="businessStatusList">
          <el-select v-model="signData.businessStatusList" placeholder="请选择" multiple>
            <el-option label="待处理" value="13"></el-option>
            <el-option label="已处理" value="14"></el-option>
            <el-option label="已作废" value="15"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商：" prop="supplierCodes" label-width="140px">
          <el-select class="input-w" placeholder="请选择" v-model="signData.supplierCodes" multiple>
            <el-option
                v-for="item in optionData"
                :key="item.id"
                :label="item.name"
                :value="item.code"
            ></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="出库状态：" prop="warehouseStatusList" label-width="140px">
          <el-select v-model="signData.warehouseStatusList" placeholder="请选择" multiple>
            <el-option label="未到货" value="1001"></el-option>
            <el-option label="部分到货" value="1002"></el-option>
            <el-option label="全部到货" value="1003"></el-option>
            <el-option label="超收到货" value="1004"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="startTime">
          <el-date-picker v-model="signData.startTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="signData.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormData('formData')" size="small">查询</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-button type="primary" @click="addBtnClickEvent" size="small">新增</el-button>
      <el-button
        :disabled="multipleSelectionData.length==0"
        plain
        @click="exportExcel"
        size="small"
      >导出</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="item-table-header"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="210" label="采购退货单号">
          <template slot-scope="scope">{{ scope.row.returnSn }}</template>
        </el-table-column>
        <el-table-column prop="businessStatus" label="单据状态">
          <template slot-scope="scope">{{ scope.row.businessStatus | filterBusinessStatus }}</template>
        </el-table-column>
        <el-table-column prop="supplier" label="供应商"></el-table-column>
        <el-table-column prop="creator" label="创建人">
          <template slot-scope="scope">{{ scope.row.creator ? scope.row.creator : '--'}}</template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="采退总金额">
          <template slot-scope="scope">{{ scope.row.amount ? scope.row.amount : '--'}}</template>
        </el-table-column>
        <el-table-column prop="warehouseStatus" label="仓库出库状态">
          <template slot-scope="scope">{{ scope.row.warehouseStatus | filterWarehouseStatus }}</template>
        </el-table-column>
        <el-table-column prop="financialWriteOff" label="财务是否核销" align="center">
          <template slot-scope="scope">{{ scope.row.financialWriteOff | filterFinancialWriteOff }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="checkBtnClick(scope.row)" type="text" size="small">查看</el-button>
            <!-- <el-button
              :disabled="scope.row.orderStatus!=0"
              @click="editorBtnClick(scope.row)"
              type="text"
              size="small"
            >修改</el-button> -->
            <el-button
              :disabled="scope.row.businessStatus!='13'"
              @click="obsoleteBtnClick(scope.row)"
              type="text"
              size="small"
            >作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;padding-bottom:10px;margin-right:20px;">
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
  </div>
</template>

<script>
import { constants } from "crypto";
export default {
  data() {
    return {
      signData: {
        //订单类型
        orderType:'0302',
        searchKey: "",
        //供应商值
        supplierCodes:[],
        //标记订单状态
        businessStatusList: [],
        //标记仓库收货状态
        warehouseStatusList: [],
        //标记是否核销
        financialWriteOff: "",
        startTime: "",
        endTime: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //记录总的条数
      totalCount:1,
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      tableData: [],
      //供应商数据
      optionData:[]
    };
  },
  //过滤器
  filters: {
    //过滤订单状态
    filterBusinessStatus(val) {
      switch (val) {
        case "13":
          return "待处理";
          break;
        case "14":
          return "已处理";
          break;
        case "15":
          return "已作废";
          break;
        default:
          return "--";
          break;
      }
    },
    //过滤仓库收货状态
    filterWarehouseStatus(val) {
      switch (val) {
        case "1001":
          return "未到货";
          break;
        case "1002":
          return "部分到货";
          break;
        case "1003":
          return "全部到货";
          break;
        case "1004":
          return "超收到货";
          break;
        default:
          return "--";
          break;
      }
    },
    //过滤是否核销
    filterFinancialWriteOff(val) {
      switch (val) {
        case false:
          return "否";
          break;
        case true:
          return "是";
          break;
      }
    }
  },
  mounted() {
    this.getChannelReturnListData()
    this.getWarehouseListData()
  },
  methods: {
    //得到列表数据
    getChannelReturnListData(){
      this.request(this.api.order.channelRetundOrder_list,this.signData).then(data=>{
        this.totalCount=data.totalCount
        this.tableData=data.data
        console.log(data)
      })
    },
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      this.signData.relationDepId = info.departId;

      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        //得到供货商Id
        this.getSupplierListData(data.id)
      });
    },
    //得到供货商数据
    getSupplierListData(organizationId) {
      console.log(246);
      this.request(this.api.product.supplier_list, {organizationId:organizationId,cooperation:true}).then(data => {
        console.log(data);
        this.optionData = data.data;
      });
    },
    //查询表单数据
    searchFormData(ref) {
      this.$refs[ref].validate(valid => {
        console.log(valid);
        if (valid) {
          this.getChannelReturnListData()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置表单数据
    resetFormData(formData) {
      console.log(this.$refs[formData]);
      this.$refs[formData].resetFields();
    },
    //新增
    addBtnClickEvent() {
      console.log("addBtnClickEvent");
      this.$router.push({
        path:'/OS/business/purchaseReturn/purchaseReturn_add'
      })
      localStorage.setItem("type", "add");
    },
    //导出
    exportExcel() {
      console.log("导出Excel表格...+++++++++++++++++++");
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "采购退货单号",
          "单据状态",
          "供应商",
          "创建人",
          "创建时间",
          "采退总金额",
          "仓库出库状态",
          "财务是否核销"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "returnSn",
          "businessStatusName",
          "supplier",
          "creator",
          "createTimeName",
          "amount",
          "warehouseStatusName",
          "financialWriteOffName"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "采购退货表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.businessStatusName=this.$options.filters.filterBusinessStatus(item.businessStatus)
        item.createTimeName=this.$options.filters.timestampToTime(item.createTime)
        item.warehouseStatusName=this.$options.filters.filterWarehouseStatus(item.warehouseStatus)
        item.financialWriteOffName=this.$options.filters.filterFinancialWriteOff(item.financialWriteOff)
      })
      this.multipleSelectionData = val;
    },
    //查看Btn的事件
    checkBtnClick(row) {
      console.log("checkBtnClick....");
      this.$router.push({
        path:"/OS/business/purchaseReturn/purchaseReturn_check",
        query:{
          returnSn:row.returnSn
        }
      })
    },
    //修改Btn的事件
    editorBtnClick(row) {
      console.log("editorBtnClick....");
    },
    //作废Btn的事件
    obsoleteBtnClick(row) {
      console.log(row)
      this.request(this.api.order.channelReturnOrder_obsoleteByReturnSn,{
        returnSn:row.returnSn,
        goodsOwner:row.goodsOwner,
        warehouseCode:row.warehouseCode
      }).then(data=>{
        console.log(data)
        //刷新数据
        this.getChannelReturnListData();
      })
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getChannelReturnListData()
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getChannelReturnListData()
    }
  }
};
</script>

<style lang="less" scoped>
.search_div {
  margin: 0 10px;
  padding-top: 20px;
  background-color: #fff;
  .first-input {
    width: 300px;
  }
}
.table_div {
  margin: 10px;
  background-color: #fff;
  padding-top: 20px;
  padding-left: 10px;
}
</style>



