<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey" label-width="120px">
          <el-input style="width:300px;" clearable v-model="signData.filter" placeholder="收款单号"></el-input>
        </el-form-item>
        <el-form-item label="收款状态：" prop="paymentStatusList">
          <el-select v-model="signData.receiptStatus" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in receiveFormList"
              :label="item"
              :key="index"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormData('formData')" size="small">查询</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box">
      <el-button
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
        @selection-change="selectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="收款单" align="center" width="170">
          <template slot-scope="scope">{{ scope.row.receiptNum ? scope.row.receiptNum:"--" }}</template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="状态" align="center">
          <template slot-scope="scope">{{ scope.row._receiptStatus  }}</template>
        </el-table-column>
        <el-table-column prop="accountReceivable" label="收款类型" align="center">
          <template slot-scope="scope">{{ scope.row.receiptTypeName }}</template>
        </el-table-column>
        <el-table-column prop="accountsReceived" label="付款方名称" align="center">
          <template slot-scope="scope">{{scope.row.channelName}}</template>
        </el-table-column>
        <el-table-column prop="merchant" label="付款账户" align="center">
          <template slot-scope="scope">{{ scope.row.paymentAccount }}</template>
        </el-table-column>
        <el-table-column prop="tradeType" label="应收金额" align="center">
          <template slot-scope="scope">{{ scope.row.amountReceivable  }}</template>
        </el-table-column>
        <el-table-column prop="tradeType" label="实收金额" align="center">
          <template slot-scope="scope">{{ scope.row.paidAmount  }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="收款确认时间" align="center" width="160">
          <template slot-scope="scope">{{ scope.row.updateTime  }}</template>
        </el-table-column>
        <el-table-column prop="creator" label="收款确认人" align="center">
          <template slot-scope="scope">{{ scope.row.updateByName }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="sureReceiptBtnClickEvent(scope.row)"
              type="text"
              :disabled="scope.row.receiptStatus == 2"
              v-auth="codeData"
              data-code="16020102"
            >确认收款</el-button>
            <el-button @click="addRemarkBtnClickEvent(scope.row)" type="text" v-auth="codeData"
              data-code="16020104">备注</el-button>
            <el-button @click="addFilesBtnClickEvent(scope.row)" type="text" v-auth="codeData"
              data-code="16020103">上传附件</el-button>
              <el-button @click="handleCommand('isReceipt',scope.row)" type="text" v-auth="codeData"
              data-code="16020105">收款记录</el-button>
              <el-button @click="handleCommand('isRemark',scope.row)" type="text" v-auth="codeData"
              data-code="16020106">备注记录</el-button>
              <el-button @click="handleCommand('isFile',scope.row)" type="text" v-auth="codeData"
              data-code="16020107">查看附件</el-button>
          </template>
        </el-table-column>
      </el-table>
       <div class="pagination mt-10 justify-content">
        <div>
          累计应收金额：
          <span>{{ tableData_statistics.amountReceivableSum }}</span>累计实收金额：
          <span>{{ tableData_statistics.paidAmountSum }}</span>
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
    <!-- 确认收付款 -->
    <el-dialog title="确认收付款" :visible.sync="showDialog" width="600px" @closed='hideReceiveDialog'>
      <el-form :model="receiveFormData" ref="receivingForm" :rules="receiveFormRules">
        <el-form-item prop='paymentMethod' label="付款方式" label-width="120px">
          <el-select v-model="receiveFormData.paymentMethod">
            <el-option v-for="(item, index) in payList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop='paidAmountCopy' label="收付款金额" label-width="120px">
          <el-input v-model="receiveFormData.paidAmountCopy" placeholder="请输入金额" style="width:300px;" v-financial-coin></el-input>
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
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="收款人员">
          <template slot-scope="scope">{{ scope.row.financialConfirmer}}</template>
        </el-table-column>
        <el-table-column prop="paymentCode" label="收款方式">
          <template slot-scope="scope">{{ scope.row.paymentMethod }}</template>
        </el-table-column>
        <el-table-column prop="collectionAmount" label="收款金额"></el-table-column>
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
      <el-table :data="recordData" max-height="250" border style="width: 100%" header-row-class-name="item-table-header">
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
      @closed="hideFileRecordDialogEvent">
      <div style='height:300px;overflow:auto;'>
        <div  v-for='item in fileData' :key="item.id">
          <div style="display:flex;border-bottom:1px solid #ccc;padding-right:10px;">
            <span style="flex:auto;">{{item.createTime}}</span>
            <span>上传人员：{{item.creator?item.creator:'--'}}</span>
          </div>
          <div style="display:flex;margin:10px 0;">
            <el-popover placement="right" width="400" trigger="hover" v-for='imgItem in item.associationList' :key="imgItem.id">
                <img :src='imgItem.attachment' style="width:380px;"/>
                <img :src='imgItem.attachment' slot="reference" style="width:84px;height:71px;margin-right:10px;"/>
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
import codeSet from '@/components/codeSet'
export default {
  data() {
    return {
      // 支付方式
      payList:[],
      tableData_statistics:{},
      signData: {
        filter:null,
        receiptStatus:null,
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
      // 收款类型
      receiveFormList:{
        0:'待收款',
        1:'部分收款',
        2:'已收款',
      },
      //收付款表单数据
      receiveFormData: {
        //标记当前行确认收款的Id
        id:'',
        channelId:null,
        receiptTypeName:null,
        receiptTypeStatus:null,
        paidAmountCopy:null,
        paymentMethod:null,
        receiptNum:null,
        updateByName:null,
        channelName:null
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
        paidAmountCopy: [{ required: true, message: "收款金额不能为空", trigger: "blur" }],
        receiptTypeStatus: [{ required: true, message: "收款方式不能为空", trigger: "blur" }]
      },
      //得到权限Code
      codeData: [],
      //上传附件列表
      multipartFileList: [],
      //标记上传附件的当前行Id
      associationId: "",
      //标记上传附件的当前行的确认人
      creator:'',
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
      uploadData: { catalog: "financial", file: "", creator:'张三'},
      //收/付款方式数据
      paymentCodesData:[],
      //备注记录数据源
      recordData:[],
      //查看附件数据
      fileData:[],
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
          return "储值卡支付";
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
    this.getBillWaitListData();
    //得到组织机构数据
    this.getWarehouseListData();
    //得到状态数据
    this.getPaymentStatusListData();
    //得到收付款方式数据
    this.getPaymentCodesListData();
    // 获取字典项
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
    //得到组织机构数据
    async getWarehouseListData() {
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      this.receiveFormData.updateByName = info.name;
      //保存当前登陆人的名称
      this.creator=info.name;
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
        this.api.financial.receiptManage_list,
        filter
      ).then(data => {
        this.totalCount = data.dataList.totalCount;
        this.tableData = data.dataList.data;
        this.tableData_statistics = data.info;
        this.tableData.forEach((item, index) => {
          item.updateTime = item.receiptStatus == 0 ? '--' : this.$options.filters.timestampToTime(item.updateTime);
          item.paymentAccount = item.paymentAccount == null ? '--' : item.paymentAccount;
          item.updateByName = item.updateByName == null ? '--' : item.updateByName;
          item._receiptStatus = this.receiveFormList[item.receiptStatus];
        });
        console.log(data);
      });
      //得到按钮操作权限数据
      // this.getCodeLimitToBtnStatus(this.$route.meta.currentid);
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
      this.getBillWaitListData();
    },
    //重置表单数据
    resetFormData() {
      this.signData = {
        filter:null,
        receiptStatus:null,
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      };
    },
    //导出
    exportExcel() {
      if (this.multipleSelectionData.length === 0) {
        this.multipleSelectionData = this.tableData;
      }
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "收款单",
          "状态",
          "收款类型",
          "付款方名称",

          "付款账户",
          "应收金额",
          "实收金额",
          "收款确认时间",
          "收款确认人"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "receiptNum",
          "receiptStatus",
          "receiptTypeName",
          "channelName",

          "paymentAccount",
          "amountReceivable",
          "paidAmount",
          "updateTime",
          "updateByName"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "收款管理");
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
      Object.assign(this.receiveFormData, {
        id:row.id,
        receiptTypeName:row.receiptTypeName,
        paymentMethod:null,
        receiptNum:row.receiptNum,
        channelId:row.channelId,
        channelName:row.channelName
      })
      this.showDialog = true;
    },
    //添加附件Btn的事件
    addFilesBtnClickEvent(row) {
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
    handleCommand(isRemark, row) {
      switch (isRemark) {
        case "isReceipt":
          this.capitalIncomeRecord_list_fn(row,'TRANSACTION_LIST')
          this.showCollectionRecordDialog = true;
          break;
        case "isRemark":
          this.getHandleCommandBySelectTag(row.id,'MEMO_LIST')
          this.showRemarksRecordDialog=true;
          break;
        case "isFile":
          this.tdTransactionAttachment_list_fn(row.id,'ATTACHMENT_LIST')
          this.showFileRecordDialog=true;
          break;
      }
    },
    // 查看备注
    getHandleCommandBySelectTag(associationId,selectTag){
      this.request(this.api.financial.tdStatementMemo_list,{associationId:associationId,selectTag:selectTag}).then(res =>{
        console.log(res)
        this.recordData=res.data
      })
    },
    // 查看附件
    tdTransactionAttachment_list_fn(associationId,selectTag){
      this.request(this.api.financial.tdTransactionAttachment_list,{associationId:associationId,selectTag:selectTag}).then(res =>{
        var fileMsgData=[]
        console.log(res) 
        Object.keys( res ).forEach((key) =>{
          var index=key.indexOf('.')
          var createTime=key.substring(0,index)
          var creator=key.substring(index+3)
          console.log(createTime)
          console.log(creator)
          console.log(res[key])
          fileMsgData.push({createTime:createTime,creator:creator,associationList:res[key]})
        })
        console.log(fileMsgData)
        this.fileData=fileMsgData
      })
    },
    // 收入明细
    capitalIncomeRecord_list_fn(row,selectTag){
      this.request(this.api.financial.capitalIncomeRecord_list,{receiptNumber:row.receiptNum, selectTag:selectTag}).then(res =>{
        this.handleRecordData=res.dataList.data;
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
          this.request(
            this.api.financial.receiptManage_confirmPayment,
            this.receiveFormData
          ).then(rfe => {
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
      console.log(this.creator)
      this.request(this.api.financial.tdTransactionAttachment_saveBatch, {
        multipartFileList: filterImgUrl,
        associationId: this.associationId,
        creator:this.creator
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
          this.request(this.api.financial.tdStatementMemo_additionMemo, {
            remarks: this.remarksFormData.remarks,
            creator:this.creator,
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
  },
  components: {
    codeSet
  }
};
</script>

<style lang="less" scoped>
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



