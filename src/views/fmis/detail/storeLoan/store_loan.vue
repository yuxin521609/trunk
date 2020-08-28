<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey" label-width="120px">
          <el-input
            style="width:300px;"
            v-model="signData.searchKey"
            placeholder="配返货单号/交易操作人/对账人"
          ></el-input>
        </el-form-item>
        <el-form-item label="配返货类型：" prop="tradeType">
          <el-select v-model="signData.tradeType" placeholder="请选择">
            <el-option
              v-for="item in tradeTypeData"
              :label="item.description"
              :key="item.code"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="零售门店：" prop="mchIds" label-width="140px">
          <el-select v-model="signData.mchIds" placeholder="请选择" multiple>
            <el-option
              v-for="item in storeListData"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隶属机构：" prop="organizationCodes">
          <el-select v-model="signData.organizationCodes" placeholder="请选择" multiple>
            <el-option
              v-for="item in organizationListData"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间：" prop="tradeTimeStart">
          <el-date-picker
            v-model="signData.tradeTimeStart"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="tradeTimeEnd">
            <el-date-picker v-model="signData.tradeTimeEnd" type="date" placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormData('formData')" size="small">查询</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-button
        :disabled="multipleSelectionData.length==0"
        plain
        @click="exportExcel"
        size="small"
        v-auth="codeData"
        data-code="16030201"
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
        <el-table-column label="配返货单号" width="200">
          <template slot-scope="scope">{{ scope.row.orderSn ?scope.row.orderSn:'--' }}</template>
        </el-table-column>
        <el-table-column prop="tradeType" label="配返货类型">
          <template slot-scope="scope">{{ scope.row.tradeType | filterTradeType}}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="零售门店">
          <template slot-scope="scope">{{scope.row.merchant?scope.row.merchant:'--'}}</template>
        </el-table-column>
        <el-table-column prop="amount" label="配/返货总金额">
          <template slot-scope="scope">{{scope.row.amount?scope.row.amount:'--'}}</template>        
        </el-table-column>
        <el-table-column prop="totalPieces" label="配/返货件数">
          <template slot-scope="scope">{{ scope.row.totalPieces?scope.row.totalPieces:"--" }}</template>
        </el-table-column>
        <el-table-column prop="receivedPieces" label="实收/返件数">
          <template slot-scope="scope">{{ scope.row.receivedPieces ?scope.row.receivedPieces:'--' }}</template>
        </el-table-column>
        <el-table-column prop="organization" label="隶属机构">
          <template slot-scope="scope">{{ scope.row.organization?scope.row.organization:'--'}}</template>
        </el-table-column>
        <el-table-column label="交易操作人">
          <template slot-scope="scope">{{ scope.row.operator?scope.row.operator:'--'}} </template>
        </el-table-column>
        <el-table-column prop="tradeTime" label="配/返货时间" width="160">
          <template slot-scope="scope">{{ scope.row.tradeTime | timestampToTime}}</template>
        </el-table-column>
      </el-table>
      <div class='page_div' v-show='this.tableData.length>0'>
        <div style="color:#222;flex:auto;font-weight:700;text-align:right;padding-right:30px;">
          <span>累计配返货金额：￥{{transactionLedger}}</span>
        </div>
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
import { mapGetters } from "vuex";
import * as userTypes from "@/types/userConfig";
export default {
  data() {
    return {
      signData: {
        //交易编码来源
        sourceType:'03005',
        //搜索字段
        searchKey:'',
        //标记所属门店
        mchIds: [],
        //配返货类型
        tradeType:"",
        //标记隶属机构
        organizationCodes:[],
        //机构Id的集合
        organizationIds: [],
        //交易开始时间
        tradeTimeStart:'',
        //交易结束时间
        tradeTimeEnd:'',
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //得到权限Code
      codeData: [],
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      //表格数据
      tableData: [{"refundMoneyOrderStatus":'1'}],
      //累计配返货金额
      transactionLedger:null,
      //总条数
      totalCount: 1,
      //存储门店数据
      storeListData: [],
      //交易类型数据
      tradeTypeData:[],
      //隶属机构数据
      organizationListData:[],
    };
  },
  computed: {
    ...mapGetters({
        userInfo: userTypes.GETTER_USERINFO
    })
  },
  //过滤器
  filters: {
    //过滤交易类型
    filterTradeType(val) {
      switch (val) {
        case "02001":
          return "销售";
          break;
        case "02002":
          return "退款";
          break;
        case "02003":
          return "配货";
          break;
        case "02004":
          return "返货";
          break;
      }
    }
  },
  mounted() {
    //得到组织机构数据
    this.getWarehouseListData();
    //得到门店列表数据
    this.getStoreBasicListData();
    //得到交易类型数据
    this.getTradeTypeListData();
  },
  methods: {
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到关联机构（type-0 机构 type-1 部门）
      this.request(this.api.user.userCompany_getUserAllDepartByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        //得到组织机构数据
        this.organizationListData=data;
        console.log(data);
        this.signData.organizationIds=[]
        data.forEach(item => {
          this.signData.organizationIds.push(item.id);
        });
        //得到列表数据
        this.getBillWaitListData();
      });
    },
    // 得到code码，用来限制是否显示按钮
    getCodeLimitToBtnStatus(codeId) {
      this.request(this.api.user.crm_userCompany_authList, {
        menuId: codeId
      }).then(res => {
        console.log(res);
        this.codeData = res;
      });
    },
    //得到门店列表数据
    getStoreBasicListData() {
      this.request(this.api.store.storeBasic_list, {}).then(res => {
        console.log(res);
        this.storeListData = res.data;
      });
    },
    //得到交易类型数据
    getTradeTypeListData(){
      this.request(this.api.financial.financialBase_transactionTypeList,{}).then(res => {
       console.log(res);
      //  this.tradeTypeData=res;
       this.tradeTypeData.push(res[2])
       this.tradeTypeData.push(res[3])
      })
    },
    //得到列表数据
    getBillWaitListData() {
      let filter = this.$common.deepCopy(this.signData);
      if (filter.tradeTimeEnd != null) {
        let date = new Date(filter.tradeTimeEnd);
        let t = (date.getTime() / 1000 + 86399) * 1000;
        filter.tradeTimeEnd = new Date(t);
      }
      this.request(
        this.api.financial.financialData_tdInventoryDetail_list,
        filter
      ).then(data => {
        this.totalCount = data.tdInventoryDetailList.totalCount;
        this.tableData = data.tdInventoryDetailList.data;
        this.transactionLedger=data.generalLedger
        console.log(data);
      });
      //得到按钮操作权限数据
      this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
    },
    //查询表单数据
    searchFormData(ref) {
      this.signData.pageIndex=1
      if(this.signData.organizationCodes.length==0){
        this.getWarehouseListData()
      }else{
        this.signData.organizationIds=this.signData.organizationCodes
        this.getBillWaitListData();
      } 
    },
    //重置表单数据
    resetFormData(formData) {
      this.$refs[formData].resetFields(); 
    },
    //导出
    exportExcel() {
      console.log("导出Excel表格...+++++++++++++++++++");
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "配返货单号",
          "配返货类型",
          "零售门店",
          "配/返货总金额",
          "配/返货件数",
          "实收/返件数",
          "隶属机构",
          "交易操作人",
          "配/返货时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "tradeTypeName",
          "merchant",
          "amount",
          "totalPieces",
          "receivedPieces",
          "organization",
          "operator",
          "tradeTimeName"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "门店货款明细表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.tradeTypeName=this.$options.filters.filterTradeType(item.tradeType)
        item.tradeTimeName=this.$options.filters.timestampToTime(item.tradeTime)
      });
      console.log(val);
      this.multipleSelectionData = val;
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
.page_div{
  margin-top:20px;
  padding-bottom:10px;
  margin-right:20px;
  display:flex;
  align-items:center;
}
</style>



