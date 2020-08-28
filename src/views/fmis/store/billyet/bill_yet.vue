<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="所属门店：" prop="merchantIds" label-width="140px">
          <el-select v-model="signData.merchantIds" placeholder="请选择" multiple>
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
        <el-form-item label="对账方式：" prop="statementCycleTypes">
          <el-select v-model="signData.statementCycleTypes" placeholder="请选择" multiple>
            <el-option
              v-for="item in typeListData"
              :label="item.description"
              :key="item.code"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormData('formData')" size="small">查询</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-button
        v-auth="codeData"
        data-code="16010104"
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
        <el-table-column label="对账单号" width="180">
          <template slot-scope="scope">{{ scope.row.statementSn?scope.row.statementSn:'--' }}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="零售门店" align="center">
          <template slot-scope="scope">{{ scope.row.merchant?scope.row.merchant:'--' }}</template>
        </el-table-column>
        <el-table-column prop="statementCycleType" label="对账方式" align="center">
          <template slot-scope="scope">{{scope.row.statementCycleType | filterStatementCycleType}}</template>
        </el-table-column>
        <el-table-column prop="generalLedger" label="累计交易金额" align="center" width="120">
          <template slot-scope="scope">{{scope.row.generalLedger}}</template>
        </el-table-column>
        <el-table-column prop="weChatPayLedger" label="微信消费" align="center">
          <template slot-scope="scope">{{ scope.row.weChatPayLedger }}</template>
        </el-table-column>
        <el-table-column prop="aliPayLedger" label="支付宝消费" align="center">
          <template slot-scope="scope">{{ scope.row.aliPayLedger }}</template>
        </el-table-column>
        <el-table-column prop="cardPayLedger" label="刷卡消费" align="center">
          <template slot-scope="scope">{{ scope.row.cardPayLedger }}</template>
        </el-table-column>
        <el-table-column prop="storageCardPayLedger" label="储值消费" align="center">
          <template slot-scope="scope">{{ scope.row.storageCardPayLedger  }}</template>
        </el-table-column>
        <el-table-column prop="cashPayLedger" label="现金" align="center">
          <template slot-scope="scope">{{ scope.row.cashPayLedger }}</template>
        </el-table-column>
        <el-table-column label="隶属机构" align="center">
          <template slot-scope="scope">{{ scope.row.organization?scope.row.organization:'--' }}</template>
        </el-table-column>
        <el-table-column prop="statementStartTime" label="对账时间范围" align="center" width="380">
          <template slot-scope="scope">{{ scope.row.statementStartTime | timestampToTime }}~{{scope.row.statementEndTime | timestampToTime}}</template>
        </el-table-column>
        <el-table-column prop="updater" label="对账人" align="center">
          <template slot-scope="scope">{{ scope.row.updater?scope.row.updater:'--' }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="checkBtnClick(scope.row)" type="text" size="small">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='page_div' v-show='this.tableData.length>0'>
        <div style="color:#222;flex:auto;font-weight:700;">
          <span>累计交易金额：￥{{generalLedger}}</span>
          <span style='margin-left:10px;margin-right:10px;'>微信消费：￥{{weChatPayLedger}}</span>
          <span style='margin-left:10px;margin-right:10px;'>支付宝消费：￥{{aliPayLedger}}</span>
          <span>刷卡消费：￥{{cardPayLedger}}</span>
          <span  style='margin-left:10px;margin-right:10px;'>储值消费：￥{{storageCardPayLedger}}</span>
          <span  style='margin-left:10px;margin-right:10px;'>现金：￥{{cashPayLedger}}</span>
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
        //对账类型（门店对账）
        statementType:'01001',
        //标识已对账
        valid:1,
        //所属门店
        merchantIds: [],
        //标记隶属机构
        organizationCodes:[],
        //机构集合Ids
        organizationIds:[],
        //对账方式
        statementCycleTypes:[],
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10,
      },
      //得到权限Code
      codeData: [],
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      //表格数据
      tableData: [],
      //总条数
      totalCount: 1,
      //存储门店数据
      storeListData: [],
      //隶属机构数据
      organizationListData:[],
      //对账方式
      typeListData:[],
      //交易总金额
      generalLedger:'',
      //微信消费
      weChatPayLedger:'',
      //支付宝消费
      aliPayLedger:'',
      //刷卡消费
      cardPayLedger:'',
      //储值消费
      storageCardPayLedger:'',
      //现金
      cashPayLedger:""
    };
  },
  computed: {
    ...mapGetters({
        userInfo: userTypes.GETTER_USERINFO
    })
  },
  //过滤器
  filters: {
    //过滤对账方式
    filterStatementCycleType(val){
      switch (val) {
        case '05001':
          return '日结';
          break;
        case '05002':
          return '周结';
          break;
        case '05004':
          return '月结';
          break;
        case '05010':
          return '自定义';
          break;
        default:
          return '--';
          break;
      }
    },
  },
  mounted() {
    //得到组织机构数据
    this.getWarehouseListData();
    //得到门店列表数据
    this.getStoreBasicListData();
    //得到对账方式数据
    this.getStatementCycleTypeListData();
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
    //得到对账方式数据
    getStatementCycleTypeListData(){
      this.request(this.api.financial.financialBase_statementCycleTypeList,{}).then(res=>{
        console.log(res);
        this.typeListData = res
      })  
    },
    //得到列表数据
    getBillWaitListData() {
      this.request(
        this.api.financial.financialData_tdStatement_list,
        this.signData
      ).then(data => {
        this.totalCount = data.tdStatementList.totalCount;
        this.tableData = data.tdStatementList.data;
        this.generalLedger=data.generalLedger;
        this.cardPayLedger=data.cardPayLedger;
        this.weChatPayLedger=data.weChatPayLedger;
        this.aliPayLedger=data.aliPayLedger;
        this.storageCardPayLedger=data.storageCardPayLedger;
        this.cashPayLedger=data.cashPayLedger;
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
          "对账单号",
          "零售门店",
          "对账方式",
          "累计交易金额",
          "微信消费",
          "支付宝消费",
          "刷卡消费",
          "储值消费",
          "现金",
          "隶属机构",
          "对账时间范围",
          "对账人"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "statementSn",
          "merchant",
          "statementCycleTypeName",
          "generalLedger",
          "weChatPayLedger",
          "aliPayLedger",
          "cardPayLedger",
          "storageCardPayLedger",
          "cashPayLedger",
          "organization",
          "statementStartTimeName",
          "updater"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "门店已对账表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.statementCycleTypeName=this.$options.filters.filterStatementCycleType(item.statementCycleType)
        item.statementStartTimeName=this.$options.filters.timestampToTime(item.statementStartTime)
      });
      console.log(val);
      this.multipleSelectionData = val;
    },
    //查看Btn的事件
    checkBtnClick(row) {
      console.log('receiptBtnClick....');
      this.$router.push({
        path: "/fmis/store/billyet/bill_yet_check",
        query:{
          associationId:row.id,
          storeName:row.merchant
        }
      });
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



