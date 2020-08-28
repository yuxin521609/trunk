<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey" label-width="120px">
          <el-input style="width:300px;" v-model="signData.searchKey" placeholder="收款单号"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="paymentStatusList">
          <el-select v-model="signData.paymentStatusList" placeholder="请选择" multiple>
            <el-option
              v-for="item in paymentStatusData"
              :label="item.description"
              :key="item.code"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道商户：" prop="merchantIds" label-width="140px">
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
        <el-form-item label="创建时间：" prop="startTime">
          <el-date-picker v-model="signData.startTime" type="date" placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="signData.endTime" type="date" placeholder="结束时间"></el-date-picker>
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
        <el-table-column label="收款单号" align="center" width="170">
          <template slot-scope="scope">{{ scope.row.statementSn?scope.row.statementSn:"--" }}</template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="状态" align="center">
          <template slot-scope="scope">{{ scope.row.paymentStatus | filterPaymentStatus }}</template>
        </el-table-column>
        <el-table-column prop="accountReceivable" label="应收/付金额" align="center">
          <template slot-scope="scope">{{scope.row.accountReceivable}}</template>
        </el-table-column>
        <el-table-column prop="accountsReceived" label="实收/付金额" align="center">
          <template slot-scope="scope">{{scope.row.accountsReceived}}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="渠道商户" align="center">
          <template slot-scope="scope">{{ scope.row.merchant?scope.row.merchant:"--" }}</template>
        </el-table-column>
        <el-table-column prop="tradeType" label="交易类型" align="center">
          <template slot-scope="scope">{{ scope.row.tradeType | filterTradeType }}</template>
        </el-table-column>
        <el-table-column prop="organization" label="隶属机构" align="center">
          <template slot-scope="scope">{{ scope.row.organization?scope.row.organization:"--" }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="160">
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" align="center">
          <template slot-scope="scope">{{ scope.row.creator?scope.row.creator:"--" }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="sureReceiptBtnClickEvent(scope.row)"
              type="text"
              :disabled="scope.row.paymentStatus=='09003'"
              v-auth="codeData"
              data-code="16020102"
            >确认收款</el-button>
            <el-button @click="addFilesBtnClickEvent(scope.row)" type="text" v-auth="codeData"
              data-code="16020103">添加附件</el-button>
            <el-button @click="addRemarkBtnClickEvent(scope.row)" type="text" v-auth="codeData"
              data-code="16020104">添加备注</el-button>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="dropdownItemValueChange('isReceipt',scope.row)" v-auth="codeData"
              data-code="16020105">收款记录</el-dropdown-item>
                <el-dropdown-item :command="dropdownItemValueChange('isRemark',scope.row)" v-auth="codeData"
              data-code="16020106">备注记录</el-dropdown-item>
                <el-dropdown-item :command="dropdownItemValueChange('isFile',scope.row)" v-auth="codeData"
              data-code="16020107">查看附件</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_div" v-show='this.tableData.length>0'>
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
    <!-- 确认收付款 -->
    <el-dialog title="确认收付款" :visible.sync="showDialog" width="600px" @closed='hideReceiveDialog'>
      <el-form :model="receiveFormData" ref="receivingForm" :rules="receiveFormRules">
        <el-form-item prop='paymentCode' label="收付款方式" label-width="120px">
          <el-select v-model="receiveFormData.paymentCode" placeholder="请选择收付款方式" style="width:300px;">
            <el-option   
              v-for="item in paymentCodesData"
              :label="item.description"
              :key="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop='account' label="收付款金额" label-width="120px">
          <el-input v-model="receiveFormData.account" placeholder="请输入金额" style="width:300px;" v-financial-coin></el-input>
          <span class="cloin-span">元</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReceivingFormBtnClick('receivingForm')">取 消</el-button>
        <el-button type="primary" @click="sureReceivingFormBtnClick('receivingForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传附件 -->
    <el-dialog :visible.sync="showUploadImg" @closed="hideUploadDialogEvent">
      <p style="position: absolute;top: 21px;">上传附件</p>
      <div class="upload_div">
        <p>附件</p>
        <el-upload
          :class="{imgUploadhide:currentLimit==3}"
          :action="imgAction()"
          accept="image/*"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :limit="3"
          :data="uploadData"
          ref="uploadImg"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <p style="color:#CCCCCC;margin-top:10px;">提示：仅支持png、jpeg格式的图片上传,最多支持上传3图片！</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUploadImage">取 消</el-button>
        <el-button type="primary" @click="sureUploadImage">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加备注 -->
    <el-dialog
      title="添加备注"
      :visible.sync="showRemarksDialog"
      width="600px"
      @closed="hideRemarksDialogEvent"
    >
      <el-form :model="remarksFormData" ref="remarksForm" :rules="remarksRules">
        <el-form-item label="填写备注：" label-width="120px" prop="remarks">
          <el-input
            resize="none"
            v-model="remarksFormData.remarks"
            type="textarea"
            placeholder="请输入内容"
            style="width:300px;"
            rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRemarksBtnClick('remarksForm')">取 消</el-button>
        <el-button type="primary" @click="sureAddRemarksBtnClick('remarksForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 收款记录 -->
    <el-dialog
      title="收款/退款记录"
      :visible.sync="showCollectionRecordDialog"
      width="600px"
      height="600px"
      @closed="hideCollectionRecordDialogEvent"
    >
      <el-table :data="handleRecordData" max-height="250" border style="width: 100%" header-row-class-name="item-table-header">
        <el-table-column prop="tradeTime" label="时间" width="170">
          <template slot-scope="scope">{{ scope.row.tradeTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="收付款人员">
          <template slot-scope="scope">{{ scope.row.operator}}</template>
        </el-table-column>
        <el-table-column prop="paymentCode" label="收付款方式">
          <template slot-scope="scope">{{ scope.row.paymentCode | filerPaymentCode }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="收款金额"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCollectionRecordBtnClick">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 备注记录 -->
    <el-dialog
      title="备注记录"
      :visible.sync="showRemarksRecordDialog"
      width="600px"
      height="600px"
      @closed="hideRemarksRecordDialogEvent"
    >
      <el-table :data="handleRecordData" max-height="250" border style="width: 100%" header-row-class-name="item-table-header">
        <el-table-column prop="createTime" label="时间">
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="creator" label="备注人员"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRemarksRecordBtnClick">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看附件 -->
    <el-dialog
      title="查看附件"
      :visible.sync="showFileRecordDialog"
      width="600px"
      height="600px"
      @closed="hideFileRecordDialogEvent"
    >
      <div style='height:300px;overflow:auto;'>
        <div  v-for='item in handleRecordData' :key="item.id">
          <div style="display:flex;border-bottom:1px solid #ccc;">
            <span style="flex:auto;">{{item.createTime | timestampToTime}}</span>
            <span>上传人员：{{item.creator?item.creator:'--'}}</span>
          </div>
          <div style="display:flex;">
            <el-popover placement="right" width="400" trigger="hover" v-for='imgItem in item.associationList' :key="imgItem.id">
                <img :src='imgItem.attachment' style="width:380px;"/>
                <img :src='imgItem.attachment' slot="reference" style="width:84px;height:71px;margin-right:5px;"/>
            </el-popover>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeFileRecordBtnClick">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as userTypes from "@/types/userConfig";
export default {
  data() {
    return {
      signData: {
        //对账类型（渠道对账）
        statementType: "01002",
        //状态
        paymentStatusList: [],
        //渠道商户
        merchantIds: [],
        //标记隶属机构
        organizationCodes: [],
        //机构集合Ids
        organizationIds: [],
        //开始时间
        startTime: "",
        //结束时间
        endTime: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //存储表格选择项改变时的数据
      multipleSelectionData: [],
      //表格数据
      tableData: [],
      //总条数
      totalCount: 1,
      //存储门店数据
      storeListData: [],
      //隶属机构数据
      organizationListData: [],
      //状态数据
      paymentStatusData: [],
      //收付款表单数据
      receiveFormData: {
        //收款方式
        account:'',
        //交易方式
        paymentCode:'',
        //标记当前行确认收款的Id
        statementId:''
      },
      //标识是否显示首付款
      showDialog: false,
      //标识是否显示收款/退款记录Dialog
      showCollectionRecordDialog: false,
      //标识是否显示下拉框备注记录Dialog
      showRemarksRecordDialog:false,
      //标识是否显示查看附件
      showFileRecordDialog:false,
      //下拉框综合数据源
      handleRecordData:[],
      rules: {
        stype: [
          { required: true, message: "收付款方式不能为空", trigger: "change" }
        ],
        number: [
          { required: true, message: "收付款金额不能为空", trigger: "change" }
        ]
      },
      //添加备注Form
      remarksFormData: {
        remarks: ""
      },
      remarksRules: {
        remarks: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      },
      //确认收款校验规则
      receiveFormRules:{
        account: [{ required: true, message: "收款金额不能为空", trigger: "blur" }],
        paymentCode: [{ required: true, message: "收款方式不能为空", trigger: "blur" }]
      },
      //得到权限Code
      codeData: [],
      //上传附件列表
      multipartFileList: [],
      //标记上传附件的当前行Id
      associationId: "",
      //标记当前备注的当前行Id
      remarksAssociationId: "",
      //标识是否显示上传图片
      showUploadImg: false,
      dialogImageUrl: "",
      //标记当前上传图片的数量
      currentLimit: 0,
      //标识是否显示添加备注
      showRemarksDialog: false,
      //上传图片参数
      uploadData: { catalog: "financial", file: "" },
      //收/付款方式数据
      paymentCodesData:[],
    };
  },
  computed: {
    ...mapGetters({
      userInfo: userTypes.GETTER_USERINFO
    })
  },
  //过滤器
  filters: {
    //过滤状态
    filterPaymentStatus(val) {
      switch (val) {
        case "09001":
          return "待确认";
          break;
        case "09002":
          return "部分已确认";
          break;
        case "09003":
          return "全部已确认";
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
        default:
          return "--";
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
        default:
          return '--'
          break;
      }
    },
    //过滤退款方式
    filterRefundMoneyWayCode(val) {
      switch (val) {
        case "08003":
          return "现金付款";
          break;
        case "08004":
          return "微信付款";
          break;
        case "08005":
          return "信用卡";
          break;
        case "08006":
          return "余额支付";
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
    //得到状态数据
    this.getPaymentStatusListData();
    //得到收付款方式数据
    this.getPaymentCodesListData();
  },
  methods: {
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      console.log(info);
      //得到当前登录人的直属机构id
      this.request(this.api.user.userCompany_getUserOrgByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        console.log(data);
        //得到门店列表数据
        this.getStoreBasicListData(data.id);
      });
      //得到关联机构（type-0 机构 type-1 部门）
      this.request(this.api.user.userCompany_getUserAllDepartByUserId, {
        userId: info.userId,
        type: 0
      }).then(data => {
        //得到组织机构数据
        this.organizationListData = data;
        console.log(data);
        this.signData.organizationIds = [];
        data.forEach(item => {
          this.signData.organizationIds.push(item.id);
        }); 
        //得到列表数据
        this.getBillWaitListData();
      });
    },
    //得到上传附件的url
    imgAction() {
      return this.api.FN_ALLPATH(this.api.content.picture_upload);
    },
    //得到状态数据
    getPaymentStatusListData() {
      this.request(
        this.api.financial.financialBase_paymentStatusTypeList,
        {}
      ).then(res => {
        console.log(res);
        this.paymentStatusData = res;
      });
    },
    //得到收付款方式数据
    getPaymentCodesListData(){
      this.request(this.api.financial.financialBase_paymentTypeList,{}).then(res => {
       console.log(res);
       this.paymentCodesData=res;
      })
    },
    //得到门店列表数据
    getStoreBasicListData(organizationId) {
      this.request(this.api.financial.financialBase_merchantListByType, {organizationId:organizationId,merchantType:"06003"}).then(res => {
        console.log(res);
        res.forEach(item=>{
          if(item.storeName){
            item.name=item.storeName
          }
        })
        this.storeListData = res;
      });
    },
    //得到列表数据
    getBillWaitListData() {
      let filter = this.$common.deepCopy(this.signData);
      if (filter.endTime != null) {
        let date = new Date(filter.endTime);
        let t = (date.getTime() / 1000 + 86399) * 1000;
        filter.endTime = new Date(t);
      }
      this.request(
        this.api.financial.financialData_tdStatement_list,
        filter
      ).then(data => {
        this.totalCount = data.tdStatementList.totalCount;
        this.tableData = data.tdStatementList.data;
        console.log(data);
      });
      //得到按钮操作权限数据
      this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
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
    //查询表单数据
    searchFormData(ref) {
      this.signData.pageIndex=1
      if (this.signData.organizationCodes.length == 0) {
        this.getWarehouseListData();
      } else {
        this.signData.organizationIds = this.signData.organizationCodes;
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
          "收款单号",
          "状态",
          "应收金额",
          "实收金额",
          "渠道商户",
          "交易类型",
          "隶属机构",
          "创建时间",
          "创建人"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "statementSn",
          "paymentStatusName",
          "accountReceivable",
          "accountsReceived",
          "merchant",
          "tradeTypeName",
          "organization",
          "createTimeFilter",
          "creator"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "渠道收款对账表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.paymentStatusName=this.$options.filters.filterPaymentStatus(item.paymentStatus)
        item.tradeTypeName=this.$options.filters.filterTradeType(item.tradeType)
        item.createTimeFilter=this.$options.filters.timestampToTime(item.createTime)
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
    },
    //确认收款Btn的事件
    sureReceiptBtnClickEvent(row) {
      console.log("sureReceiptBtnClickEvent.....");
      this.receiveFormData.statementId=row.id;
      this.showDialog = true;
    },
    //添加附件Btn的事件
    addFilesBtnClickEvent(row) {
      console.log("addFilesBtnClickEvent.....");
      this.associationId = row.id;
      this.multipartFileList = [];
      this.showUploadImg = true;
      this.currentLimit = 0;
    },
    //添加备注Btn的事件
    addRemarkBtnClickEvent(row) {
      this.remarksAssociationId = row.id;
      console.log("addRemarkBtnClickEvent.....");
      this.showRemarksDialog = true;
    },
    //下拉框事件
    handleCommand(row) {
      console.log(row);
      switch (row.tags) {
        case "isReceipt":
          console.log("isReceipt");
          this.getHandleCommandBySelectTag(row.row.id,'TRANSACTION_LIST')
          this.showCollectionRecordDialog = true;
          return;
          break;
        case "isRemark":
          console.log("isRemark");
          this.getHandleCommandBySelectTag(row.row.id,'MEMO_LIST')
          this.showRemarksRecordDialog=true;
          return;
          break;
        case "isFile":
          console.log("isFile");
          this.getHandleCommandBySelectTag(row.row.id,'ATTACHMENT_LIST')
          this.showFileRecordDialog=true;
          return;
          break;
      }
      this.showCollectionRecordDialog = true;
    },
    dropdownItemValueChange(isRemark, row) {
      return {
        tags: isRemark,
        row: row
      };
    },
    //下拉框中的请求接口
    getHandleCommandBySelectTag(associationId,selectTag){
      this.request(this.api.financial.financialData_associationSources,{associationId:associationId,selectTag:selectTag}).then(res =>{
        console.log(res);
        this.handleRecordData=res
      })
    },
    //收付款input的输入事件
    receivingInputEvent(val){
      var account = val.match(/^\d*(\.?\d{0,3})/g);
      this.receiveFormData.account = account[0];
    },
    //取消收付款金额的点击事件
    cancelReceivingFormBtnClick(ref) {
      this.hideReceiveDialog();
    },
    //确认收付款金额的点击事件
    sureReceivingFormBtnClick(ref) {
      console.log("sureReceivingFormBtnClick");
      this.$refs[ref].validate(valid => {
        console.log(valid);
        if (valid) {
          this.receiveFormData.account=Math.abs(this.receiveFormData.account)
          this.request(this.api.financial.financialBase_confirmAccounting,this.receiveFormData).then(rfe => {
            this.getBillWaitListData();
            this.hideReceiveDialog()
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    beforeAvatarUpload(file) {
      //文件上传之前调用做一些拦截限制
      const isLtM = file.size / 1024 / 1024 < 10;
      const str = file.type.split("/")[1].toLowerCase();
      if (!isLtM) {
        this.$message.error("上传图片大小不能超过" + 10 + "MB!");
      }
      if (!str.match(/png|jpeg/)) {
        this.$message.error("上传图片只能是 jpeg | png 格式!");
        return false;
      }
      return true;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.uploadData.file = file;
      this.dialogImageUrl = file.url;
      this.multipartFileList.push(file.response.data);
      this.currentLimit++;
      if (this.currentLimit > 3) {
        this.currentLimit = 3;
      }
    },
    //删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
      if (this.multipartFileList.length > 0) {
        this.multipartFileList = this.multipartFileList.filter(
          item => item.imageUrl != file.response.data.imageUrl
        );
      }
      this.currentLimit--;
      if (this.currentLimit < 0) {
        this.currentLimit = 0;
      }
    },
    //上传图片的Dialog隐藏时的回调
    hideUploadDialogEvent() {
      console.log("hideDialogEvent---------");
      this.showUploadImg = false;
      this.$refs["uploadImg"].clearFiles();
    },
    //取消图片上传
    cancelUploadImage() {
      this.hideUploadDialogEvent();
    },
    //确定上传图片
    sureUploadImage() {
      if (this.multipartFileList.length == 0) {
        this.$message.error("请选择要上传的图片！");
        return;
      }
      var filterImgUrl=[]
      this.multipartFileList.forEach(item => {
        filterImgUrl.push(item.imageUrl)  
      })
      this.request(this.api.financial.financialData_uploadBatchAttachment, {
        multipartFileList: filterImgUrl,
        associationId: this.associationId
      }).then(res => {
        console.log(res);
        this.hideUploadDialogEvent();
      });
    },
    //取消备注Btn的事件
    cancelAddRemarksBtnClick(ref) {
      this.$refs[ref].resetFields();
      console.log("cancelAddRemarks");
      this.hideRemarksDialogEvent();
    },
    //添加备注Btn的事件
    sureAddRemarksBtnClick(ref) {
      console.log("sureAddRemarks");
      this.$refs[ref].validate(valid => {
        console.log(valid);
        if (valid) {
          this.request(this.api.financial.financialData_additionMemo, {
            remarks: this.remarksFormData.remarks,
            associationId: this.remarksAssociationId
          }).then(res => {
            console.log(res);
            this.showRemarksDialog = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //确认收付款的Dialog的隐藏事件
    hideReceiveDialog(){
      this.showDialog=false;
      this.$refs["receivingForm"].resetFields();
    },
    //添加备注的Dialog的隐藏事件
    hideRemarksDialogEvent() {
      this.showRemarksDialog = false;
      this.$refs["remarksForm"].resetFields();
    },
    //收款/退款Dialog的隐藏事件
    hideCollectionRecordDialogEvent() {
      this.showCollectionRecordDialog = false;
      console.log("hideCollectionRecordDialog");
    },
    //收款/退款记录的Dialog的Btn的关闭事件
    closeCollectionRecordBtnClick(){
      this.hideCollectionRecordDialogEvent()
    },
    //备注记录的Dialog的隐藏事件
    hideRemarksRecordDialogEvent(){
      this.showRemarksRecordDialog=false;
    },
    //备注记录的Dialog的Btn的关闭事件
    closeRemarksRecordBtnClick(){
      this.hideRemarksRecordDialogEvent()
    },
    //查看附件的Btn的关闭事件
    closeFileRecordBtnClick(){
      this.hideFileRecordDialogEvent()
    },
    //查看附件的Dialog的Btn的关闭事件
    hideFileRecordDialogEvent(){
      console.log("hideFileRecordDialogEvent")
      this.showFileRecordDialog=false
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
.imgUploadhide /deep/ .el-upload--picture-card {
  display: none;
}
.table_div {
  margin: 10px;
  background-color: #fff;
  padding-top: 20px;
  padding-left: 10px;
}
.cloin-span {
  position: absolute;
  right: 150px;
  top: 0;
}
.upload_div {
  display: flex;
  p {
    margin-right: 10px;
  }
}
.page_div {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
}
</style>



