<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey" label-width="120px">
          <el-input
            style="width:320px;"
            v-model="signData.searchKey"
            placeholder="交易单号/收/付款流水号/收/付款商户号/关联订单号"
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
        <el-form-item label="所属门店：" prop="mchIds" label-width="140px">
          <el-select v-model="signData.mchIds" placeholder="请选择" multiple>
            <el-option
              v-for="item in storeListData"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- organizationCodes -->
        <el-form-item label="隶属机构：" prop="organizations">
          <el-select v-model="signData.organizations" placeholder="请选择" multiple>
            <el-option
              v-for="item in organizationListData"
              :label="item.name"
              :key="item.id"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收/付款方式：" prop="paymentCodes" label-width='120px'>
          <el-select v-model="signData.paymentCodes" placeholder="请选择" multiple>
            <el-option
              v-for="item in paymentCodesData"
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
        v-auth="codeData"
        data-code="16030101"
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
        <el-table-column label="交易单号" width="200">
          <template slot-scope="scope">{{ scope.row.orderSn?scope.row.orderSn:'--' }}</template>
        </el-table-column>
        <el-table-column prop="valid" label="是否对账">
          <template slot-scope="scope">{{ scope.row.valid | filterValid}}</template>
        </el-table-column>
        <el-table-column prop="tradeType" label="交易类型">
          <template slot-scope="scope">{{scope.row.tradeType | filterTradeType}}</template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额">
          <template slot-scope="scope">{{ scope.row.amount?scope.row.amount:'--' }}</template>
        </el-table-column>
        <el-table-column prop="paymentCode" label="收/付款方式">
          <template slot-scope="scope">{{ scope.row.paymentCode | filerPaymentCode }}</template>
        </el-table-column>
        <el-table-column prop="serialNumber" label="收/付款流水号">
          <template slot-scope="scope">{{ scope.row.serialNumber?scope.row.serialNumber:'--' }}</template>
        </el-table-column>
        <el-table-column prop="tradeMchId" label="收/付款商户号">
          <template slot-scope="scope">{{ scope.row.tradeMchId ?scope.row.tradeMchId:'--' }}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="零售店铺" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.merchant?scope.row.merchant:'--' }}</template>
        </el-table-column>
        <el-table-column prop="organization" label="隶属机构">
          <template slot-scope="scope">{{ scope.row.organization?scope.row.organization:'--' }}</template>
        </el-table-column>
        <el-table-column label="交易操作人">
          <template slot-scope="scope">{{ scope.row.operator?scope.row.operator:'--' }}</template>
        </el-table-column>
        <el-table-column prop="tradeTime" label="交易时间" width="160">
          <template slot-scope="scope">{{ scope.row.tradeTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="refundMoneySource" label="附件">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="hover" v-if="scope.row.attachment">
              <img :src='scope.row.attachment' style="width:380px;"/>
              <img :src='scope.row.attachment' slot="reference" style="width:32px;height:32px;"/>
            </el-popover>
              <!-- <img :src='scope.row.attachment' style="width:32px;height:32px;" v-else/> -->
              <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="checker" label="对账人">
          <template slot-scope="scope">{{ scope.row.checker?scope.row.checker:'--' }}</template>
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
        //交易编码来源
        sourceType:'03002',
        //搜索关键字
        searchKey:"",
        //交易类型
        tradeType:"",
        //所属门店
        mchIds:[],
        //标记隶属机构
        // organizationCodes:[],
        //机构Id的集合
        // organizationIds: [],
        //机构名称
        organizations:[],
        //收/付款方式
        paymentCodes:[],
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
      tableData: [],
      //累计交易总额
      transactionLedger:null,
      //总条数
      totalCount: 1,
      //存储门店数据
      storeListData: [],
      //隶属机构数据
      organizationListData:[],
      //交易类型数据
      tradeTypeData:[],
      //收/付款方式数据
      paymentCodesData:[],
      //对账方式
      typeListData:[
        {
          name:'日结',
          id:'1'
        },
        {
          name:'周结',
          id:'2'
        },
        {
          name:'月结',
          id:'3'
        },
        {
          name:'自定义',
          id:'4'
        }
      ],
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
          return "现金支付";
          break;
        default:
          return '--'
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
    //得到收付款方式数据
    this.getPaymentCodesListData();
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
        // this.signData.organizationIds=[]
        // data.forEach(item => {
        //   this.signData.organizationIds.push(item.id);
        // });
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
       this.tradeTypeData.push(res[0])
       this.tradeTypeData.push(res[1])
      })
    },
    //得到收付款方式数据
    getPaymentCodesListData(){
      this.request(this.api.financial.financialBase_paymentTypeList,{}).then(res => {
       console.log(res);
      //  this.paymentCodesData=res;
       res.forEach((item,index)=>{
         if(index<5){
          this.paymentCodesData.push(item)
         }
       })
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
        this.api.financial.financialData_tdTransactionDetail_list,
        filter
      ).then(data => {
        console.log(data)
        this.totalCount = data.TransactionDetailList.totalCount;
        this.tableData = data.TransactionDetailList.data;
        this.transactionLedger=data.TransactionLedger
        console.log(data);
      });
      //得到按钮操作权限数据
      this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
    },
    //查询表单数据
    searchFormData(ref) {
      this.signData.pageIndex=1
    //  if(this.signData.organizationCodes.length==0){
    //     this.getWarehouseListData()
    //     console.log('asdhl')
    //   }else{
        // this.signData.organizationIds=this.signData.organizationCodes
        this.getBillWaitListData();
      // } 
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
          "收/付款方式",
          "收/付款流水号",
          "收/付款商户号",
          "零售店铺",
          "隶属机构",
          "交易操作人",
          "交易时间",
          "附件",
          "对账人"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "validStatusName",
          "tradeTypeStatusName",
          "amount",
          "paymentCodeStatusName",
          "serialNumber",
          "tradeMchId",
          "merchant",
          "organization",
          "operator",
          "tradeTimeStatusName",
          "",
          "checker"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "门店交易明细表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.validStatusName=this.$options.filters.filterValid(item.valid)
        item.tradeTypeStatusName=this.$options.filters.filterTradeType(item.tradeType)
        item.paymentCodeStatusName=this.$options.filters.filerPaymentCode(item.paymentCode)
        item.tradeTimeStatusName=this.$options.filters.timestampToTime(item.tradeTime)
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



