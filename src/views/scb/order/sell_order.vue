<style lang="less" scoped></style>
<template>
  <div class="transfer_slip_list">
    <!-- 选择调出入方信息 -->
    <el-dialog width="1200px" @closed="closeDialog" title="选择渠道客户" :visible.sync="dialogTableVisible">
      <el-form
        class="item-form"
        :model="fromStore"
        label-width="90px"
        size="small"
        ref="formDataStore"
        inline>
        <el-form-item label="客户名称：" prop="inStoreId">
          <el-select
            v-model="fromStore.name"
            placeholder="请选择"
            class="input-w"
            filterable
            clearable>
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道类型：" prop="inStoreId">
            <el-select
              v-model="fromStore.channel"
              placeholder="请选择"
              class="input-w"
              filterable
              clearable>
              <el-option
                v-for="item in channelType"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        <el-form-item>
          <el-button @click="searchTableDataIn" type="primary" plain>搜索</el-button>
          <el-button @click="initFormDataIn" plain>重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tuneIn_data.data" max-height="350" class="mt-10">
        <el-table-column label="单选" align="center" min-width="50">
          <template slot-scope="scope">
            <el-radio-group v-model="checkTuneInUser">
              <el-radio :disabled="scope.row.status == 10" :label="scope.row">&nbsp;</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="渠道客户名称" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="渠道类型" align="center" min-width="90">
          <template slot-scope="scope">零售商</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="所在省/直辖市" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.provinceName }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="市/区" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.cityName }}</template>
        </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="详细地址" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.addressInfo }}</template>
        </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="联系人" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.linkman }}</template>
        </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="联系电话" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="最后一次采配时间" align="center" min-width="90">
          <template slot-scope="scope">{{ scope.row._createTime }}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="drNext">下一步</el-button>
      </span>
    </el-dialog>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="formData"
        label-width="90px"
        size="small"
        ref="formData"
        inline
      >
        <!-- 模糊查询 -->
        <el-form-item label="模糊查询：">
          <el-input
            v-model="formData.searchWords"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="订单编号/收货人/收货地址"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态：" prop="orderStatus">
          <el-select
            placeholder="请选择"
            class="input-w"
            v-model="formData.purchaseOrderStatus"
            filterable
            clearable
          >
            <el-option v-for="(item, index) in orderStarusType" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算类型：" prop="outStoreId">
          <el-select
            v-model="formData.tradeWayCode"
            placeholder="请选择"
            class="input-w"
            filterable
            clearable
          >
            <el-option
              v-for="(item, index) in tradeWayCodeType"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：" prop="inStoreId">
          <el-select
            v-model="formData.purchaseAgentId"
            placeholder="请选择"
            class="input-w"
            filterable
            clearable
          >
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="startDate">
          <el-date-picker v-model="formData.startDate" type="date" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker v-model="formData.endDate" type="date" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
          <el-button @click="initFormData" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <div v-if="!enterTypeFlag">
        <el-button size="small" type="primary" @click="dialogShow">新增</el-button>
        <el-button size="small" type="primary" @click="exportExcelOrder">导出</el-button>
      </div>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table
          :data="tableData.data"
          style="width: 100%"
          row-key="id"
          @selection-change="tableCheckChange"
          id="table-data"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="purchaseOrderNum" label="订单编号" width="200"></el-table-column>
          <el-table-column prop="_purchaseOrderStatus" label="订单状态"></el-table-column>
          <el-table-column prop="_tradeWayCode" label="结算类型" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="receiveMan" label="收货人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="addressInfo" label="收货地址" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="productQty" label="订单商品件数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="goodsCodeQty" label="sku种类数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="priceSumAmount" label="吊牌价总额" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="purchaseAgentName" label="客户名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="purchaseSumAmount" label="结算额" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_createTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button
                  type="text"
                  size="small"
                  @click="purchaseOrder_checkToPass(scope.row)"
                  v-if="scope.row.purchaseOrderStatus == 101"
                >审核</el-button>
              <el-button type="text" size="small" @click="seeItem(scope.row)">查看</el-button>
              <template v-if="!enterTypeFlag">
                <el-button
                  type="text"
                  size="small"
                  @click="editItem(scope.row)"
                  v-if="scope.row.purchaseOrderStatus == 100 || scope.row.purchaseOrderStatus == 101"
                >编辑</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="delItem(scope.row)"
                  v-if="scope.row.purchaseOrderStatus < 103"
                >作废</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="finishItem(scope.row)"
                  v-if="scope.row.purchaseOrderStatus == 103"
                >强制完成</el-button>
              </template>
              <el-button type="text" size="small" @click="exportExcelGoodsOrder(scope.row)">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
    <!--备注-->
    <el-dialog title="备注" :visible.sync="remarksDialog" width="40%" :close-on-click-modal="false">
      <el-form
        :model="remarksFormData"
        :rules="rules"
        ref="remarksForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="备注：" prop="reason">
          <el-input
            type="textarea"
            maxlength="120"
            show-word-limit
            :rows="3"
            placeholder="请输入内容"
            v-model="remarksFormData.operationRemarks"
          ></el-input>
          <p>最大长度为120个字符</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarksDialog = false" size="small">取 消</el-button>
        <el-button @click="remarksSub" type="primary" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import PageTable from "@/views/collocation/components/PageTable";
import TimeIntervalCheck from "@/components/TimeIntervalCheck";
import axios from 'axios'
import {getToken} from '@/utils/auth'
import codeSet from '@/components/codeSet'
import treeDept from '@/components/treeDept'
import { filter } from 'minimatch';
import { get } from 'http';
export default {
  name: "sell_order",
  // 数据
  data() {
    return {
      fromStore:{
        channel:null,
        name:null
      },
      // 调出方列表
      tuneOut_data:[],
      // 调入方列表
      tuneIn_data:[],
      // 选中调出方信息
      checkTuneOutUser:{},
      // 选中调入方信息
      checkTuneInUser:{},
      orderStarusType:{
        100:'待编辑',
        101:'待审核',
        102:'待发货',
        103:'部分已发货',
        104:'异常完成',
        105:'已完成',
        106:'已作废'
      },
      channelType:['零售商'],
      tradeWayCodeType:{
        1:'现金',
        2:'押款代销'
      },
      // 参数
      addFormData: {
        // 发货人
        allotMan: '',
        // 发货人直属机构
        organizationId: '',
        organizationName: '',
        // 订单类型
        // orderType: '0203',
        // 发货门店
        outStoreId: '',
        outStoreName: '',
        // 收货门店
        inStoreId: '',
        inStoreName: '',
        // 收货人
        receiveMan: '',
        // 电话
        phone: '',
        // 省市区信息
        provinceName: '',
        provinceCode: '',
        cityName: '',
        cityCode: '',
        areaName: '',
        areaCode: '',
        divisionId: '',
        // 地址
        addressInfo: ''
      },
      // 选择调出弹框
      dialogTableVisible:false,
      // 选择调出类型
      allocatingType:true,
      // 标识是否是零售门店进入
      enterTypeFlag: false,
      // 查询参数
      formData: {
        // 模糊搜索
        searchWords:null,
        // 订单状态
        purchaseOrderStatus:null,
        // 结算类型
        tradeWayCode:null,
        // 门店名称（采购商名称）
        purchaseAgentId:null,
        // 开始时间
        startDate:null,
        // 结束时间
        endDate:null,
        pageIndex: 1,
        pageSize: 10
      },
      // 查询参数
      formDataStore: {
        // 模糊搜索
        searchWords:null,
        // 订单状态
        purchaseOrderStatus:null,
        // 结算类型
        tradeWayCode:null,
        // 门店名称（采购商名称）
        purchaseAgentName:null,
        // 开始时间
        startDate:null,
        // 结束时间
        endDate:null,
        pageIndex: 1,
        pageSize: 10
      },
      // 收货差异
      differenceList: [{ name: "是", id: 1 }, { name: "否", id: 0 }],
      // 发货门店列表
      outStoreList: [],
      // 收货门店列表
      inStoreList: [],
      // 单据状态
      billType: this.$common.getBillType("transferSlip"),
      // 表格数据
      tableData: {},
      // 选中的表格数据
      checkedTableData: [],

      // 备注弹窗
      remarksDialog: false,
      remarksFormData: {
        id: "",
        operationRemarks: ""
      },
      rules: {
        operationRemarks: [
          {
            type: "string",
            required: true,
            message: "请输入内容",
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 组件
  components: {
    PageTable,
    TimeIntervalCheck
  },
  created() {
    // 删除子页面的门店缓存
    sessionStorage.removeItem("TRANSFER_SLIP_APP_INFO");
    this.info();
  },
  activated() {
    this.getTableData();
  },
  // 初始化数据
  mounted() {
    this.$nextTick(() => {
      this.getInStoreList();
      this.getOutStoreList();
      this.getTableData();
      
    });
  },
  // 方法
  methods: {
    dialogShow() {
      this.dialogTableVisible = true;
      // 调入、调出门店接口列表，调出传入调入ID（SCB)
      this.tuneIn_fn();
    },
    /**
     * 审核通过
     */
    purchaseOrder_checkToPass(row) {
      this.$confirm('审核通过后，库房将接收订单发货通知！', '订单审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.scb.purchaseOrder_checkToPass,
          {
            "orderId": row.id
          }
        ).then(data => {
          this.getTableData();
          this.warn('审核通过！');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
    },
    async info() {
      // 获取userId
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      // 保存用户名称
      this.addFormData.allotMan = info.name;
      // 获取直属机构
      let organization = await this.request(this.api.user.userCompany_getUserOrgByUserId, {userId: info.userId}, true);
      this.addFormData.organizationId =  organization.id;
      this.addFormData.organizationName =  organization.name;
    },
    /**
     * 获取客户列表
     * @param { String } id 调出方id
     */
    tuneIn_fn() {
      this.request(
        this.api.store.storeBasic_listStoreBasic,
        this.fromStore
      ).then(res => {
        this.tuneIn_data = res;
        this.checkTuneInUser = {};
        res.data.forEach((item, index) => {
          item._createTime = this.$options.filters.timestampToTime(item.createTime);
        });
      });
    },
    /**
     * 调入下一步
     */
    drNext() {
      if(JSON.stringify(this.checkTuneInUser) == '{}') {
          this.warn('请选择渠道客户！', 'warning');
          return; 
        };
      Object.assign(this.addFormData, {
        outStoreId: this.checkTuneInUser.id,
        outStoreName: this.checkTuneInUser.name,
        // 收货门店
        inStoreId: this.checkTuneInUser.id,
        inStoreName: this.checkTuneInUser.name,
        // 收货人
        receiveMan: this.checkTuneInUser.linkman,
        // 电话
        phone: this.checkTuneInUser.phone,
        // 省市区信息
        provinceName: this.checkTuneInUser.provinceName,
        provinceCode: this.checkTuneInUser.provinceCode,
        cityName: this.checkTuneInUser.cityName,
        cityCode: this.checkTuneInUser.cityCode,
        areaName: this.checkTuneInUser.areaName,
        areaCode: this.checkTuneInUser.areaCode,
        divisionId: this.checkTuneInUser.divisionId,
        // 地址
        addressInfo: this.checkTuneInUser.addressInfo
      });
      console.log(this.addFormData);
      this.dialogTableVisible = false;
      sessionStorage.setItem('TRANSFER_SLIP_APP_INFO', JSON.stringify(this.addFormData));
      // return;
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/sell_order_edit"
      });
      this.checkTuneInUser = {};
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || "success"
      });
    },
    // keepAlive 返回初始化
    activatedInit() {
      this.getTableData();
    },
    /**
       * 导出销售订单
       */
      exportExcelOrder() {
        this.exportExcel({
            title:'销售订单列表',
            checkedTableData:this.checkedTableData.length > 0 ? this.checkedTableData : this.tableData.data,
            tHeader:[
              "订单编号",
              "订单状态",
              "结算类型",
              "收货人",

              "收货地址",
              "订单商品件数",
              "sku种类数",
              "吊牌价总额",

              "客户名称",
              "结算额",
              "创建时间"
            ],
            filterVal:[
              "purchaseOrderNum",
              "_purchaseOrderStatus",
              "_tradeWayCode",
              "receiveMan",

              "addressInfo",
              "productQty",
              "goodsCodeQty",
              "priceSumAmount",

              "purchaseAgentName",
              "purchaseSumAmount",
              "_createTime"
            ]
        });
      },
      /**
       * 导出销售商品订单
       */
      exportExcelGoodsOrder(row) {
         this.exportExcel({
            title:'销售订单商品列表',
            checkedTableData:row.purchaseOrderProductDTOS,
            tHeader:[
               "商品款号",
               "商品货号",
               "商品图片",
               "颜色",

               "规格",
               "品牌",
               "吊牌单价",
               "结算单价",

               "销售数量",
               "实发数量"
            ],
            filterVal:[
               "productCode",
               "goodsCode",
               "image",
               "color",

               "size",
               "brandName",
               "price",
               "modifyPrice",

               "skuModifyQuantity",
               "actualSendQty"
            ]
         });
      },
      //导出
      exportExcel(obj) {
         require.ensure([], () => {
            let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
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
      tableCheckChange(val){
         this.checkedTableData = val;
      },
    // 点击搜索
    searchTableData() {
      this.formData.pageIndex = 1;
      this.getTableData();
    },
    searchTableDataIn() {
      this.tuneIn_fn();
    },
    initFormDataIn() {
      Object.assign(this.fromStore, {
        name:null,
        channel:null
      });
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      Object.assign(this.fromStore, {
        name:null,
        channel:null
      });
    },
    // 获取列表数据
    getTableData() {
      this.request(
        this.api.scb.purchaseOrder_list,
        this.formData
      ).then(data => {
        this.initTableData(data.data);
        this.tableData = data;
        data.data.forEach((item, idnex) => {
          Object.assign(item, item.purchaseOrderDTO);
          item._createTime = this.$options.filters.timestampToTime(item.createTime);
          item._purchaseOrderStatus = this.orderStarusType[item.purchaseOrderStatus]; 
          item._tradeWayCode = this.tradeWayCodeType[item.tradeWayCode]; 
        });
      });
    },
    // 初始化数据 导出使用
    initTableData(data) {
      if (data && data.length) {
        data.forEach(item => {
          item._amount = "￥" + item.amount;
          item._difference =
            item.difference === null ? "--" : item.difference ? "是" : "否";
          item._differenceQty =
            item.differenceQty === null ? "--" : item.differenceQty;
          item._orderStatus = this.statusToName(item.orderStatus);
        });
      }
    },
    // 获取表格选中的
    tableCheckChange(val) {
      this.checkedTableData = val;
    },
    // 初始查询条件
    initFormData() {
      Object.assign(this.formData, {
        // 模糊搜索
        searchWords:null,
        // 订单状态
        purchaseOrderStatus:null,
        // 结算类型
        tradeWayCode:null,
        // 门店名称（采购商名称）
        purchaseAgentId:null,
        // 开始时间
        startDate:null,
        // 结束时间
        endDate:null,
        pageIndex: 1,
        pageSize: 10
      })
    },
    // 新增
    addItem() {
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/allotGoods_order_edit"
      });
    },
    // 查看
    seeItem(row) {
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/sell_order_detail",
        query: {
          id: row.id
        }
      });
    },
    // 编辑
    editItem(row) {
      let module = "/" + this.$route.path.split("/")[1];
      sessionStorage.removeItem("TRANSFER_SLIP_APP_INFO");
      this.$router.push({
        path: module + "/order/sell_order_edit",
        query: {
          id: row.id,
          outStoreId:row.purchaseAgentId,
          orderNum:row.purchaseOrderNum
        }
      });
    },
    // 作废
    delItem(row) {
      this.$confirm('确认作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.scb.purchaseOrder_cancel,
          {
            orderId: row.id
          }
        ).then(data => {
          this.getTableData();
          this.warn('作废成功！');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 强制完成
    finishItem(row) {
      this.$confirm('确认要强制完成吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(
          this.api.scb.purchaseOrder_forceTermination,
          {
            orderId: row.id
          }
        ).then(data => {
          this.getTableData();
          this.warn('强制成功！');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 备注显示
    remarksItem(row) {
      this.remarksFormData.id = row.id;
      this.remarksFormData.operationRemarks = row.operationRemarks;
      this.remarksDialog = true;
    },
    // 备注提交
    remarksSub() {
      this.$refs.remarksForm.validate(valid => {
        if (valid) {
          this.request(
            this.api.order.storeAllotGoodsOrder_insertRemarks,
            this.remarksFormData
          ).then(data => {
            this.$notify.success({ title: "成功", message: "备注成功" });
            this.remarksDialog = false;
            this.getTableData();
          });
        } else {
          return false;
        }
      });
    },
    // 状态转name
    statusToName(val) {
      if (!val && val !== 0) return;
      let item = this.billType.find(item => {
        return item.id === val;
      });
      if (item) {
        return item.name;
      } else {
        return val;
      }
    },
    // 获取发货门店数据
    async getOutStoreList() {
      // 获取userId
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      // 获取直属机构
      let organization = await this.request(
        this.api.user.userCompany_getUserOrgByUserId,
        { userId: info.userId },
        true
      );
      // enableAllocation: 1  (启用门店调拨 后端需要)
      this.request(this.api.retailStore.storeBasic_listBase, {
        organizationId: organization.id,
        enableAllocation: 1
      }).then(data => {
        this.outStoreList = data.data;
      });
    },
    // 获取收货门店数据
    getInStoreList() {
      this.request(this.api.store.storeBasic_listStoreBasic, {}).then(data => {
        this.inStoreList = data.data;
      });
    }
  },
  filters: {},
  // 计算属性
  computed: {},
  // 监听数据变化
  watch: {}
};
</script>
