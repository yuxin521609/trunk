
<template>
  <div>
    <!-- 新增押金账户 -->
    <el-dialog width="750px" title="新增押金账户" :visible.sync="dialogTableVisible">
      <p>&nbsp;&nbsp;&nbsp;&nbsp;请选择开通渠道商户：</p>
      <el-table :data="channelList_data.data" max-height="350" class="mt-10">
        <el-table-column label="单选" align="center" min-width="30">
          <template slot-scope="scope">
            <el-radio-group v-model="checkCashPledgeUser">
              <el-radio :disabled="scope.row.status == 9" :label="scope.row">&nbsp;</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="渠道名称" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="渠道类型" align="center" min-width="90">
          <template slot-scope="scope">零售商</template>
        </el-table-column>
        <el-table-column label="所在省/直辖市" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.provinceName }}</template>
        </el-table-column>
        <el-table-column label="市/区" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.cityName }}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogMap">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 充值弹框 -->
    <el-dialog title="充值" width="600px" :visible.sync="dialogForm" v-if="dialogForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px">
        <el-form-item label="充值账户：" prop="accountName">{{ ruleForm.accountName }}</el-form-item>
        <el-form-item label="充值金额：" prop="notAccountEntryCopy">
          <el-input v-model="ruleForm.notAccountEntryCopy"></el-input>
        </el-form-item>
        <el-form-item label="付款方式：" prop="paymentMethod">
          <el-select v-model="ruleForm.paymentMethod">
            <el-option v-for="(item, index) in payList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款账户：" prop="paymentAccount">
          <el-input v-model="ruleForm.paymentAccount"></el-input>
        </el-form-item>
        <el-form-item label="上传付款凭证：" prop="storeImgs_list" res="uploadElement">
          <el-upload-img
            v-model="ruleForm.storeImgs_list"
            :EchoDisplayImages="ruleForm.storeImgs_list"
            CatalogName="store"
            :imgApi="imgApi"
            :describe="storeImgs_describe"
            :LssUpimgLimit="LssUpimgLimit"
          ></el-upload-img>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 模糊搜索 -->
    <div class="item-margin">
      <el-form class="item-form" size="small" :inline="true" :model="filtersData">
        <!-- 模糊查询 -->
        <el-form-item label="模糊查询：">
          <el-input
            v-model="filtersData.filter"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="账户名称/开户人"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="渠道类型：">
          <el-select v-model="filtersData.channelTypeStatus" clearable filterable>
            <el-option
              v-for="(item, index) in channelTypeStatusList"
              :label="item"
              :key="index"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 新增 -->
        <el-form-item label="账户状态：">
          <el-select v-model="filtersData.accountStatus" clearable filterable>
            <el-option
              v-for="(item, index) in accountStatusList"
              :label="item"
              :key="index"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 搜索，重置 -->
        <el-form-item>
          <el-button @click="handleSearch" type="primary" plain size="small">搜索</el-button>
          <el-button @click="handleResetFilters" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 模糊搜索 -->
    <!-- 列表 -->
    <div class="box">
      <el-button size="small" type="primary" @click="dialogTableVisible = true">新增押金账户</el-button>
      <el-button size="small" @click="exportExcelOrder">导出</el-button>
      <el-table
        :data="getList_data.dataList.data"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        @selection-change="tableCheckChange"
        :highlight-current-row="true"
        class="mt-10">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="账户名称" min-width="130">
          <template slot-scope="scope">{{ scope.row.accountName || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="渠道类型" min-width="60">
          <template slot-scope="scope">{{ scope.row.channelTypeStatus  }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="押金货款" min-width="60">
          <template slot-scope="scope">{{ scope.row.depositCopy  }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="充值未入账金额" min-width="90">
          <template slot-scope="scope">{{ scope.row.notAccountEntryCopy }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="可用货款" min-width="60">
          <template slot-scope="scope">{{ scope.row.availablePaymentCopy }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="冻结货款" min-width="60">
          <template slot-scope="scope">{{ scope.row.freezePaymentCopy }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="开户人" min-width="60">
          <template slot-scope="scope">{{ scope.row.createByName || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="开户时间" min-width="120">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <!-- 新增 -->
        <el-table-column align="left" :show-overflow-tooltip="true" label="账户状态" min-width="60">
          <template slot-scope="scope">{{ scope.row._accountStatus }}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          fixed="right"
          label-class-name="text-left"
          class-name="text-left"
          align="left"
          label="操作"
          width="110"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="recharge(scope.row)"
              size="small"
            >充值</el-button>
            <el-button
              type="text"
              @click="open(scope.row)"
              size="small"
            >{{ scope.row.accountStatus ? '停用' : '启用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="pagination mt-10"
        :class="{ 'justify-content': getList_data.dataList.data && getList_data.dataList.data.length > 0 }">
        <div v-if="getList_data.dataList.data && getList_data.dataList.data.length > 0">
          累计渠道数：
          <span>{{ getList_data.info.channelCount }}</span>累计押金金额：
          <span>￥{{ getList_data.info.depositSum }}</span>累计冻结货款：
          <span>￥{{ getList_data.info.freezePaymentSum }}</span>
        </div>
        <!-- 分页 -->
        <el-pagination
          class="mr-20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filtersData.pageIndex"
          :page-sizes="[10,20,30,40,50]"
          :page-size="filtersData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="getList_data.dataList.totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 列表 -->
  </div>
</template>
<script>
import axios from "axios";
import ElUploadImg from "@/components/uploadImg/el_upload_img_multi";
import codeSet from '@/components/codeSet'

export default {
  data() {
    return {
      // 支付方式
      payList:[],
      // 上传图片路径
      imgApi:this.api.content.aLiYun_upload,
      LssUpimgLimit:1,
      // 上传图片描述
      storeImgs_describe:'',
      // 新增押金账号弹框
      dialogTableVisible: false,
      // 新增的押金账户
      checkCashPledgeUser: {},
      // 充值弹框
      dialogForm: false,
      // 充值对象
      recharge_obj:{},
      // 账户状态
      accountStatusList: {
        0: "已停用",
        1: "已启用"
      },
      // 渠道类型状态
      channelTypeStatusList: {
        1: "零售商",
        2: "经销商"
      },
      // data数据
      getList_data: {},
      // 渠道商列表
      channelList_data: {},
      // 订单数据统计
      storeRetailOrder_pcListStatistics_data: {},
      // 选中的表格数据
      checkedTableData: [],
      // 获取门店信列表
      getStoreList_data: [],
      formInline: {
        user: "",
        region: ""
      },
      // 充值
      ruleForm: {
        id:'',
        "accountStatus": 1, // 账户状态
        "channelTypeName":'零售商', // 渠道类型名称
        "channelTypeStatus": 1, // 渠道类型状态
        receiptTypeName:'押金充值',
        receiptTypeStatus:'01',
        channelId:'',// 渠道id
        accountName:'',// 充值账户
        notAccountEntryCopy: '',// 充值金额
        paymentMethod:'',// 付款方式
        paymentAccount:'',// 付款账户
        annex:'',// 上传付款凭证
        storeImgs_list:[]// 上传附件地址
      },
      rules: {
        notAccountEntryCopy: [{ required: true,validator: (rule, value, callback) => {
          if(!value) {
            callback(new Error('请输入付款金额！'));
          }else{    
            const reg = /^\d+(\.\d{1,2})?$/g;
            if(reg.test(value)) {
             callback();
            }else{
              callback(new Error('请输入正确的金额！'));
            }
          }
        }, trigger: 'change' }],
        paymentMethod: [{ required: true, message: '请选择付款方式！', trigger: 'change' }],
        paymentAccount: [{ required: true, message: '请输入付款账户！', trigger: 'change' }],
        storeImgs_list: [{type:'array', required: true, message: '请上传付款凭证！', trigger: 'change' }],
      },
      filtersData: {
        "filter": null, // 模糊搜索
       	"accountStatus": null, // 账户状态
	      "channelTypeName": null, // 渠道类型名称
        "channelTypeStatus": null, // 渠道类型状态
	      "orderBy": "", // 排序
        pageIndex: 1,
        pageSize: 10,
        "pageStart": 0
      },
      info:null
    };
  },
  computed:{
    storeImgs_list() {
      return this.ruleForm.storeImgs_list;
    }
  },
  watch:{
    /**
     * 监听上传附件图片
     */
    storeImgs_list(value) {
      if(value && value.length > 0) {
        this.$refs.ruleForm.clearValidate('storeImgs_list');
      }else{
        this.$refs.ruleForm.validateField('storeImgs_list');
      }
    }
  },
  created() {
    const that = this;

    this.getList();
    this.getChannelList_data();
    this.userinfo();
    // 获取所有字典内容
    this.getAllCode();
  },
  methods: {
     /**
     * 获取字典项
     */
    getAllCode() {
      this.request(
        this.api.system.ALL_CODESET_POST,
        {},
        true
      ).then(res => {
        res.forEach((item, index) => {
          switch(item.name) {
            case 'COM003':
              // 门店类型列表
              item.codeItemList.forEach((itemk, indexk) => {
                itemk.checked = false;
              });
              this.payList = item.codeItemList;
              break;
          }
        });
      });
    },
    async userinfo() {
      this.info = await this.request(this.api.user.get_userinfo, {}, true); // 获取用户信息
    },
    /**
     * 新增押金账户
     */
    handleDialogMap() {
      if(JSON.stringify(this.checkCashPledgeUser) != '{}') {
        this.request(
          this.api.financial.channelDepositAccount_save,
        {
          "accountName": this.checkCashPledgeUser.name, // 渠道账户名称 
          "accountStatus": 1, // 账户状态
          "channelId": this.checkCashPledgeUser.id, // 渠道ID
          "channelTypeName":'零售商', // 渠道类型名称
          "channelTypeStatus": 1, // 渠道类型状态
          "createByName": this.info.name, // 开户人名称
        }
      ).then(
        res => {
          this.checkCashPledgeUser = {};
          this.dialogTableVisible = false;
          this.warn('新增押金账号成功！');
          this.getList();
          this.getChannelList_data();
        }
      );
     
      }else{
        this.warn('请选择添加的账户！');
      };
    },
    /** 
     * 充值弹框
     */
    recharge(obj) {
      this.dialogForm = true;
      this.ruleForm.accountName = obj.accountName;
      this.ruleForm.channelId = obj.channelId;
      this.ruleForm.id = obj.id;
    },
    // 充值
    submitForm(formName) {
      let data = JSON.parse(JSON.stringify(this.ruleForm)); 
      data.annex = data.storeImgs_list[0] && data.storeImgs_list[0].url;
      delete data.storeImgs_list;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.request(
            this.api.financial.channelDepositAccount_recharge,
            data
          ).then(res => {
            this.checkCashPledgeUser = {};
            this.dialogForm = false;
            this.warn('充值成功！');
            this.getList();
            Object.assign(this.ruleForm, {
              id:'',
              "accountStatus": 1, // 账户状态
              "channelTypeName":'零售商', // 渠道类型名称
              "channelTypeStatus": 1, // 渠道类型状态
              receiptTypeName:'押金充值',
              receiptTypeStatus:'01',
              channelId:'',// 渠道id
              accountName:'',// 充值账户
              notAccountEntryCopy: '',// 充值金额
              paymentMethod:'',// 付款方式
              paymentAccount:'',// 付款账户
              annex:'',// 上传付款凭证
              storeImgs_list:[]// 上传附件地址
            });
          });
        }
      });
    },
    // 取消充值
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    open(row) {
      const text = row.accountStatus ? '停用押款账户后，渠道商将不可订货，确定停用吗？' : '确定启用吗？';

      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.financial.channelDepositAccount_save,
        {
          "id": row.id, // 渠道账户名称 
          "accountStatus": row.accountStatus ? 0 : 1, // 账户状态
        }
      ).then(
        res => {
          this.getList();
          this.$message({
            type: 'success',
            message: row.accountStatus ? '停用成功!' : '启用成功!'
          });
        }
      );
     
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        });          
      });
    },
    /**
     * 导出销售订单
     */
    exportExcelOrder() {
      this.exportExcel({
        title: "押金账号列表",
        checkedTableData:
          this.checkedTableData.length > 0
            ? this.checkedTableData
            : this.getList_data.dataList.data,
        tHeader: [
          "账号名称",
          "渠道类型",
          "押金贷款",
          "充值未入账金额",
          "可用贷款",
          "冻结货款",
          "开户人",
          "开户时间",
          "账户状态"
        ],
        filterVal: [
          "accountName",
          "channelTypeStatus",
          "depositCopy",
          "notAccountEntryCopy",
          "availablePaymentCopy",
          "freezePaymentCopy",
          "createByName",
          "createTime",
          "_accountStatus"
        ]
      });
    },
    //导出
    exportExcel(obj) {
      require.ensure([], () => {
        let {
          export_json_to_excel,
          export_table_to_excel
        } = require("@/vendor/Export2Excel");
        let tHeader = obj.tHeader;
        // 上面设置Excel的表格第一行的标题
        let filterVal = obj.filterVal;
        // 上面的index、nickName、name是tableData里对象的属性
        let list = obj.checkedTableData; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, obj.title);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    tableCheckChange(val) {
      this.checkedTableData = val;
    },
    /**
     *
     */
    fnDialogTableVisible() {
      console.log(this.ls);
      this.workOrderPoolAssign();
      this.dialogTableVisible = false;
    },
    // 点击页数
    handleCurrentChange(pageIndex) {
      this.filtersData.pageIndex = pageIndex;
      this.getList();
    },
    // 点击每页多少条数
    handleSizeChange(pageSize) {
      this.filtersData.pageSize = pageSize;
      this.getList();
    },
    /**
     * 获取table列表
     */
    getList() {
      const that = this;

      this.request(
        that.api.financial.channelDepositAccount_list,
        this.filtersData
      ).then(res => {
          that.getList_data = res;
          res.dataList.data.forEach(item => {
            item.channelTypeStatus = this.channelTypeStatusList[item.channelTypeStatus];
            item.createTime = this.$options.filters.timestampToTime(item.createTime);
            item._accountStatus = this.accountStatusList[item.accountStatus];
          });
        }
      );
    },
    /**
     * 获取渠道押金账户管理列表
     */
    getChannelList_data() {
      const that = this;

      this.request(
        that.api.financial.channelDepositAccount_channelList,
        {
          "pageIndex": null,
	        "pageSize": null,
        }
      ).then(
        res => {
          that.channelList_data = res;
        }
      );
    },
    /**
     * 查询门店销售订单列表
     */
    storeRetailOrder_pcListStatistics() {
      const that = this;

      this.request(
        that.api.store.storeRetailOrder_pcListStatistics,
        this.filtersData
      ).then(res => {
        that.storeRetailOrder_pcListStatistics_data = res;
      });
    },
    /**
     * 跳转工单详情
     */
    href(routeName, param) {
      let module = this.$route.path.split("/")[1];

      this.$router.push({
        path: "/" + module + routeName,
        query: param
      });
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || 'success'
      });
    },
    /**
     * 模糊搜索
     */
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getList();
    },
    /**
     * 搜索重置
     */
    handleResetFilters() {
      Object.assign(this.filtersData, {
        "filter": null, // 模糊搜索
       	"accountStatus": null, // 账户状态
	      "channelTypeName": null, // 渠道类型名称
        "channelTypeStatus": null, // 渠道类型状态
	      "orderBy": "", // 排序
        pageIndex: 1,
        pageSize: 10,
        "pageStart": 0
      });
    }
  },
  components: {
    ElUploadImg,
    codeSet
  }
};
</script>
<style  lang="less" scoped>
.el-dialog__body .el-input /deep/ .el-input__inner{
  width: 198px;
}
.demo-ruleForm{
  width: 750px;
}
.justify-content {
  justify-content: space-between;
  display: flex;
  align-items: center;
  margin-top: 20px;
  span {
    margin-right: 15px;
  }
}
.box {
  padding: 20px;
  margin: 8px;
  background: #fff;
}
.blueness {
  color: #1e90ff;
}
.warningType {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  background: red;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  margin-left: 10px;
  text-align: center;
}
.color {
  background: #ff6347;
}
h5 {
  color: #222;
  margin-left: -15px;
}
.test {
  color: #9d9d9d;
}
</style>
