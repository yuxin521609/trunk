<template>
  <div>
    <div class='tab_div_name'>
        <label>{{storeName}}</label>
    </div>
    <div class='tab_div' style='font-weight:bold;padding-left:18px;'>
        <el-menu :default-active="typeActiveIndex" text-color="#222" active-text-color="#2290e8" 
            mode="horizontal" @select="typeActiveSelect" style='border-bottom:none;'>
            <el-menu-item index="1" style='border-bottom:none;'>全部</el-menu-item>
            <el-menu-item index="2" style='border-bottom:none;'>微信消费</el-menu-item>
            <el-menu-item index="3" style='border-bottom:none;'>支付宝消费</el-menu-item>
            <el-menu-item index="4" style='border-bottom:none;'>刷卡消费</el-menu-item>
            <el-menu-item index="5" style='border-bottom:none;'>储值消费</el-menu-item>
            <el-menu-item index="6" style='border-bottom:none;'>现金</el-menu-item>
        </el-menu>
    </div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey" label-width="120px">
          <el-input
            style="width:300px;"
            v-model="signData.searchKey"
            placeholder="交易单号/收款流水号/收款商户号"
          ></el-input>
        </el-form-item>
        <el-form-item label="交易类型：" prop="tradeType">
          <el-select v-model="signData.tradeType" placeholder="请选择">
            <el-option
              v-for="item in tradeTypeData"
              :label="item.description"
              :key="item.code"
              :value="item.code"
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
        <el-table-column label="交易单号" align="center" width="170">
          <template slot-scope="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column prop="valid" label="是否对账" align="center">
          <template slot-scope="scope">{{ scope.row.valid | filterValid}}</template>
        </el-table-column>
        <el-table-column prop="tradeType" label="交易类型" align="center">
          <template slot-scope="scope">{{scope.row.tradeType | filterTradeType}}</template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额" align="center">
          <template slot-scope="scope">{{ scope.row.amount ?scope.row.amount:'--' }}</template>
        </el-table-column>
        <el-table-column prop="paymentCode" label="交易方式" align="center">
          <template slot-scope="scope">{{ scope.row.paymentCode | filerPaymentCode}}</template>
        </el-table-column>
        <el-table-column prop="serialNumber" label="收付款流水号" align="center">
          <template slot-scope="scope">{{ scope.row.serialNumber ?scope.row.serialNumber:'--' }}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="收付款商户号" align="center">
          <template slot-scope="scope">{{ scope.row.merchant ?scope.row.merchant:'--' }}</template>
        </el-table-column>
        <el-table-column label="交易操作人" align="center">
          <template slot-scope="scope">{{ scope.row.operator ?scope.row.operator:'--' }}</template>         
        </el-table-column>
        <el-table-column prop="tradeTime" label="交易时间" align="center">
          <template slot-scope="scope">{{ scope.row.tradeTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="refundMoneySource" label="附件" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="hover" v-if="scope.row.attachment">
              <img :src='scope.row.attachment' style="width:380px;"/>
              <img :src='scope.row.attachment' slot="reference" style="width:32px;height:32px;"/>
            </el-popover>
              <!-- <img :src='scope.row.attachment' style="width:32px;height:32px;" v-else/> -->
              <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="checker" label="对账人" align="center">
          <template slot-scope="scope">{{ scope.row.checker ?scope.row.checker:'--' }}</template>          
        </el-table-column>
      </el-table>
      <div class='page_div' v-show='this.tableData.length>0'>
        <div style="color:#222;flex:auto;font-weight:700;text-align:right;padding-right:30px;">
          <span>累计交易金额：￥{{transactionLedger}}</span>
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
        paymentCode:'',
        //搜索字段
        searchKey:'',
        //传过来的对账Id
        associationId:'',
        //交易类型
        tradeType:'',
        //开始时间
        tradeTimeStart:'',
        //结束时间
        tradeTimeEnd:'',
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10,
        valid:true,
      },
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      //表格数据
      tableData: [],
      //总条数
      totalCount: 1,
      //隶属机构数据
      organizationListData:[],
      //二级tab切换栏
      typeActiveIndex:'1',
      //交易类型数据
      tradeTypeData:[],
      //累计交易总金额
      transactionLedger:'',
      //标记门店名称
      storeName:''
    };
  },
  computed: {
    ...mapGetters({
        userInfo: userTypes.GETTER_USERINFO
    })
  },
  //过滤器
  filters: {
    //过滤是否对账
    filterValid(val) {
      switch (val) {
        case false:
          return "否";
          break;
        case true:
          return "是";
          break;
        default:
          return "--";
          break; 
      }
    },
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
    },
    //过滤支付方式
    filerPaymentCode(val) {
      switch (val) {
         case "08001":
          return "刷卡支付";
          break;
        case "08002":
          return "微信支付";
          break;
        case "08003":
          return "支付宝支付";
          break;
        case "08004":
          return "余额支付";
          break;
        case "08005":
          return "现金";
          break;
        default:
          return '--'
          break;
      }
    }
  },
  mounted() {
    this.signData.associationId=this.$route.query.associationId
    this.storeName=this.$route.query.storeName
    //得到交易类型数据
    this.getTradeTypeListData();
    //得到列表数据
    this.getStatementListData();
  },
  methods: {
    //得到交易类型数据
    getTradeTypeListData(){
      this.request(this.api.financial.financialBase_transactionTypeList,{}).then(res => {
       console.log(res);
      //  this.tradeTypeData=res;
       this.tradeTypeData.push(res[0])
       this.tradeTypeData.push(res[1])
      })
    },
    //得到列表数据
    getStatementListData() {
      let filter = this.$common.deepCopy(this.signData);
      if (filter.tradeTimeEnd != null) {
        let date = new Date(filter.tradeTimeEnd);
        let t = (date.getTime() / 1000 + 86399) * 1000;
        filter.tradeTimeEnd = new Date(t);
      }
      this.request(this.api.financial.financialData_transactionListByStatementId,filter).then(res => {
        console.log(res);
        this.tableData = res.TransactionDetailList.data;
        this.totalCount=res.TransactionDetailList.totalCount;
        console.log(res.TransactionLedger)
        this.transactionLedger=res.TransactionLedger
      })
    },
    //二级切换兰
    typeActiveSelect(index){
     this.typeActiveIndex=index
     console.log(index)
      switch(index){
        case "1":
          this.signData.paymentCode="";
          break;
        case "2":
          this.signData.paymentCode="08002";
          break;
        case "3":
          this.signData.paymentCode="08003";
          break;
        case "4":
          this.signData.paymentCode="08001";
          break;
        case "5":
          this.signData.paymentCode="08004";
          break;
        case "6":
          this.signData.paymentCode="08005";
          break;
      }
      //刷新列表
      this.getStatementListData();
    },
    //查询表单数据
    searchFormData(ref) {
      this.$refs[ref].validate(valid => {
        console.log(valid);
        if (valid) {
          this.signData.pageIndex=1
          this.getStatementListData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
          "交易单号",
          "是否对账",
          "交易类型",
          "交易金额",
          "交易方式",
          "收付款流水号",
          "收付款商户号",
          "交易操作人",
          "交易时间",
          "附件"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "validStatus",
          "tradeTypeStatus",
          "amount",
          "paymentCodeStatus",
          "serialNumber",
          "merchant",
          "operator",
          "tradeTimeName",
          "attachment"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "渠道退款表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.validStatus=this.$options.filters.filterValid(item.valid)
        item.tradeTypeStatus=this.$options.filters.filterTradeType(item.tradeType)
        item.paymentCodeStatus=this.$options.filters.filerPaymentCode(item.paymentCode)
        item.tradeTimeName=this.$options.filters.timestampToTime(item.tradeTime)
      });
      console.log(val);
      this.multipleSelectionData = val;
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getStatementListData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getStatementListData();
    }
  }
};
</script>

<style lang="less" scoped>
.tab_div_name{
    margin: 0 10px;
    padding:15px 32px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    font-weight: bold;
}
.tab_div{
    margin: 0 10px;
    padding:0 32px;
    background-color: #fff;
}
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



