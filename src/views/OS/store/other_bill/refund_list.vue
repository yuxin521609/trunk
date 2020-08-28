<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="fuzzyQuery">
          <el-input class="first-input" v-model="signData.fuzzyQuery" placeholder="退款单号/源订单号"></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="refundMoneyOrderStatus">
          <el-select v-model="signData.refundMoneyOrderStatus" placeholder="请选择">
            <el-option label="退款中" value="0"></el-option>
            <el-option label="已退款" value="1"></el-option>
            <el-option label="退款异常" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店：" prop="storeId" label-width="140px">
          <el-select v-model="signData.storeId" placeholder="请选择">
            <el-option
              v-for="item in storeListData"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成时间：" prop="startTime">
          <el-date-picker
            v-model="startTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="退款时间：" prop="endTime">
          <el-date-picker
            v-model="refundStarTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
        <el-table-column label="退款单号" width="210" align="center">
          <template slot-scope="scope">{{ scope.row.refundMoneyOrderNum }}</template>
        </el-table-column>
        <el-table-column prop="refundMoneyOrderStatus" label="单据状态" width="120" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.refundMoneyOrderStatus | filterRefundMoneyOrderStatus }}</template>
        </el-table-column>
        <el-table-column prop="refundMoneyWayCode" label="退款方式" align="center">
          <template slot-scope="scope">{{ scope.row.refundMoneyWayCode | filterRefundMoneyWayCode }}</template>
        </el-table-column>
        <el-table-column prop="refundMoney" label="退款金额" width="120" align="center"></el-table-column>
        <el-table-column prop="reason" label="退款原因" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.reason?scope.row.reason:"--" }}</template>
        </el-table-column>
        <el-table-column prop="refundMoneyTime" label="退款时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.refundMoneyTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="生成时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column label="源订单号" width="210" align="center">
          <template slot-scope="scope">{{ scope.row.sourceOrderNum }}</template>
        </el-table-column>
        <el-table-column prop="refundMoneySource" label="退款来源" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.refundMoneySource | filterRefundMoneySource}}</template>
        </el-table-column>
        <el-table-column prop="paymentNum" label="支付订单号" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.paymentNum?scope.row.paymentNum:'--'}}</template>
        </el-table-column>
        <el-table-column prop="storeName" label="所属门店" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.storeName }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="checkBtnClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button
              v-show="(scope.row.refundMoneyOrderStatus==2&&scope.row.refundMoneyWayCode==2)||(scope.row.refundMoneyOrderStatus==0&&scope.row.refundMoneyWayCode==3)"
              @click="refundBtnClick(scope.row)"
              type="text"
              size="small"
            >退款</el-button>
            <el-button
              v-show="scope.row.refundMoneyOrderStatus==0&&scope.row.refundMoneyWayCode==3"
              @click="addRemarkBtnClick(scope.row)"
              type="text"
              size="small"
            >添加备注</el-button>
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
      <el-dialog
        title="提示"
        :visible.sync="showRefundDialog"
        @close="hideRefundDialogEvent"
        width="600px"
        height="600px"
      >
        <el-form :model="accountVO" ref="refundForm" :rules="accountVORules">
          <el-form-item label="退款金额：" label-width="100px">
            <span>￥{{refundMoney}}</span>
          </el-form-item>
          <el-form-item label="退款账户：" label-width="100px" prop="refundMoneyAccountNum">
            <el-input
              v-model="accountVO.refundMoneyAccountNum"
              :maxlength="23"
              style="width:260px;"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showRefundDialog=false">取 消</el-button>
          <el-button type="primary" @click="sureRefundDailogBtnClick('refundForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="添加备注"
        :visible.sync="showRemarkDialog"
        @close="hideRemarksDialogEvent"
        width="600px"
        height="600px"
      >
        <el-form :model="accountVO" ref="remarkForm" :rules="remarkFormRules">
          <el-form-item label="添加备注：" label-width="100px" prop="remark">
            <el-input
              v-model="accountVO.remark"
              style="width:300px;"
              class="remark"
              type="textarea"
              resize="none"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showRemarkDialog=false">取 消</el-button>
          <el-button type="primary" @click="sureRemarkDailogBtnClick('remarkForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {isBankAccount} from '@/utils/validate'
import { mapGetters } from "vuex";
import * as userTypes from "@/types/userConfig";
let bankaccount=(rule, value,callback)=>{
  if(!value){
    callback(new Error('请输入银行账号'));
  }else if (!isBankAccount(value) && value){
    callback(new Error('请输入正确的银行账号'));
  }else {
    callback();
  }
};
export default {
  data() {
    return {
      signData: {
        // orderType:'0202',
        fuzzyQuery: "",
        //标记单据状态
        refundMoneyOrderStatus: "",
        //标记门店状态
        storeId: "",
        //标记生成时间
        startDate: "",
        endDate: "",
        //标记退款时间
        refundStartDate: "",
        refundEndDate: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //退款金额
      refundMoney: null,
      //退款Dialog的数据源
      accountVO: {
        id: "",
        //银行账号
        refundMoneyAccountNum: "",
        //备注
        remark: ""
      },
      accountVORules: {
        refundMoneyAccountNum: [
          { required: true, trigger: "blur", validator: bankaccount}
        ]
      },
      //标识是否显示退款dialog
      showRefundDialog: false,
      //添加备注Dialog的数据源
      remarkFormData: {
        id: ""
      },
      //确认收款校验规则
      remarkFormRules: {
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      },
      //标识是否显示添加备注的dialog
      showRemarkDialog: false,
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      //表格数据
      tableData: [],
      //总条数
      totalCount: 1,
      //存储门店数据
      storeListData: [],
      //生成时间
      startTime: "",
      //退款时间
      refundStarTime: ""
    };
  },
  computed: {
    ...mapGetters({
      userInfo: userTypes.GETTER_USERINFO
    })
  },
  //过滤器
  filters: {
    //过滤单据状态
    filterRefundMoneyOrderStatus(val) {
      switch (val) {
        case 0:
          return "退款中";
          break;
        case 1:
          return "已退款";
          break;
        case 2:
          return "退款异常";
          break;
      }
    },
    //过滤退款方式
    filterRefundMoneyWayCode(val) {
      switch (val) {
        case 1:
          return "现金";
          break;
        case 2:
          return "微信付款";
          break;
        case 3:
          return "刷卡";
          break;
        case 4:
          return "余额支付";
          break;
        case 5:
          return "支付宝付款";
          break;
      }
    },
    //过滤退款来源
    filterRefundMoneySource(val) {
      switch (val) {
        case 0:
          return "门店";
          break;
        default:
          return "--";
          break;
      }
    }
  },
  mounted() {
    //得到组织机构数据
    this.getWarehouseListData();
    //得到列表数据
    this.getChannelReturnListData();
  },
  watch: {
    "accountVO.refundMoneyAccountNum": function(val) {
      this.$nextTick(() => {
        this.accountVO.refundMoneyAccountNum = val.replace(/\D/g, "").replace(/....(?!$)/g, "$& ");
      });
    }
  },
  methods: {
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到部门Id
      // this.signData.relationDepId = info.departId;
      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        //得到门店列表数据
        this.getStoreBasicListData(data.id);
      });
    },
    //得到门店列表数据
    getStoreBasicListData(organizationId) {
      this.request(this.api.store.storeBasic_list, {}).then(res => {
        console.log(res);
        this.storeListData = res.data;
      });
    },
    //得到列表数据
    getChannelReturnListData() {
      if (this.startTime) {
        this.signData.startDate = this.startTime[0];
        this.signData.endDate = this.startTime[1];
      }
      if (this.refundStarTime) {
        this.signData.refundStartDate = this.refundStarTime[0];
        this.signData.refundEndDate = this.refundStarTime[1];
      }
      this.request(
        this.api.retailStore.storeConsumerRefundMoney_list,
        this.signData
      ).then(data => {
        this.totalCount = data.totalCount;
        this.tableData = data.data;
        console.log(data);
      });
    },
    //查询表单数据
    searchFormData(ref) {
      this.$refs[ref].validate(valid => {
        console.log(valid);
        if (valid) {
          this.getChannelReturnListData();
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
      this.signData.startDate = "";
      this.signData.endDate = "";
      this.signData.refundStartDate = "";
      this.signData.refundEndDate = "";

      this.startTime = "";
      this.refundStarTime = "";
    },
    //导出
    exportExcel() {
      console.log("导出Excel表格...+++++++++++++++++++");
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "退款单号",
          "单据状态",
          "退款方式",
          "退款金额",
          "退款原因",
          "退款时间",
          "生成时间",
          "源订单号",
          "退款来源",
          "支付订单号",
          "所属门店"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "refundMoneyOrderNum",
          "refundMoneyOrderStatusName",
          "refundMoneyWayCodeName",
          "refundMoney",
          "reason",
          "refundMoneyTimeFilter",
          "createTimeFilter",
          "sourceOrderNum",
          "refundMoneySourceName",
          "paymentNum",
          "storeName"
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
        item.refundMoneyOrderStatusName = this.$options.filters.filterRefundMoneyOrderStatus(
          item.refundMoneyOrderStatus
        );
        item.refundMoneyWayCodeName = this.$options.filters.filterRefundMoneyWayCode(
          item.refundMoneyWayCode
        );
        item.refundMoneySourceName = this.$options.filters.filterRefundMoneySource(
          item.refundMoneySource
        );
        item.refundMoneyTimeFilter = this.$options.filters.timestampToTime(
          item.refundMoneyTime
        );
        item.createTimeFilter = this.$options.filters.timestampToTime(
          item.createTime
        );
      });
      console.log(val);
      this.multipleSelectionData = val;
    },
    //查看Btn的事件
    checkBtnClick(row) {
      console.log(row);
      this.$router.push({
        path: "/OS/store/other_bill/refund_check",
        query: {
          refundId: row.id
        }
      });
    },
    //退款Btn的事件
    refundBtnClick(row) {
      console.log(row);

      // updateName: row.goodsOwner
      switch (row.refundMoneyWayCode) {
        case 2:
          //微信支付
          this.wxPay(row);
          break;
        case 3:
          this.refundMoney = row.refundMoney;
          this.accountVO.id = row.id;
          //银行卡支付
          this.showRefundDialog = true;
          break;
      }
    },
    //添加备注Btn的事件
    addRemarkBtnClick(row) {
      this.showRemarkDialog = true;
      this.accountVO.id = row.id;
    },
    //退款-微信支付
    wxPay(row) {
      this.$confirm("确认再次发起退款？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.request(
            this.api.retailStore.storeConsumerRefundMoney_againRefundMoney,
            {
              id: row.id,
              updateName: this.userInfo.name
            }
          ).then(data => {
            console.log(data);
            //刷新数据
            this.getChannelReturnListData();
          });
        })
        .catch(action => {});
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getChannelReturnListData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getChannelReturnListData();
    },
    //退款dialog中确认btn的点击事件
    sureRefundDailogBtnClick(ref) {
      console.log("sureRefundDailogBtnClick--------");
      this.$refs[ref].validate(valid => {
        console.log(valid);
        if (valid) {
          this.request(
            this.api.retailStore
              .storeConsumerRefundMoney_updateStoreConsumerRefundMoney,
            this.accountVO
          ).then(res => {
            this.hideRefundDialogEvent();
            this.getChannelReturnListData();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //退款Dialog的隐藏事件
    hideRefundDialogEvent() {
      this.$refs.refundForm.resetFields();
      this.showRefundDialog = false;
      console.log("hideRefundDialogEvent-------");
    },
    //添加备注Dialog中确认btn的点击事件
    sureRemarkDailogBtnClick(ref) {
      this.$refs[ref].validate(valid => {
        console.log(valid);
        if (valid) {
          this.request(
            this.api.retailStore
              .storeConsumerRefundMoney_updateStoreConsumerRefundMoney,
            this.accountVO
          ).then(res => {
            this.hideRemarksDialogEvent();
            this.getChannelReturnListData();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加备注Dialog的隐藏事件
    hideRemarksDialogEvent() {
      this.showRemarkDialog = false;
      this.$refs.remarkForm.resetFields();
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
.remark /deep/ .el-textarea__inner {
  height: 100px;
}
.table_div {
  margin: 10px;
  background-color: #fff;
  padding-top: 20px;
  padding-left: 10px;
}
</style>



