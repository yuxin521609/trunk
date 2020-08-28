<style lang="less" scoped>
  .statistics{
    position: absolute;
    bottom: 45px;
  }
  .statistics2{
    position: absolute;
    bottom: 18px;
    left: 20px;
  }
  .item-margin{
    position: relative;
  }
  .dialogJs-div{
    font-size: 16px;
    margin: 10px 0 0 30px;
  }
</style>
<template>
  <div class="transfer_slip_list">
    <el-dialog width="550px" title="结算" :visible.sync="dialogJs">
      <div class="dialogJs-div">上次结算时间：{{ check_item.updateTime }}</div>
      <!-- <div class="dialogJs-div">累计核销货值：￥{{ check_item.writeOffValueCopyTotal }}</div> -->
      <div class="dialogJs-div">本期结算款：￥{{ check_item.writeOffValueCopy }}</div>
      <div class="dialogJs-div">确定结算后，财务将收到收款确认单！（收款）</div>
      <span slot="footer">
        <el-button @click="dialogJs = false">取 消</el-button>
        <el-button type="primary" @click="qrJs">确定</el-button>
      </span>
    </el-dialog>
    <!-- 选择调出入方信息 -->
    <el-dialog width="1200px" @closed="closeDialog" title="查看供货商品" :visible.sync="dialogTableVisible">
      <el-form
        :model="formDataStore"
        label-width="90px"
        size="small"
        ref="formDataStore"
        inline
      >
        <el-form-item label="模糊搜索" prop="inStoreId">
         <el-input v-model="formDataStore.filter" placeholder="款号/货号/商品名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌：" prop="outStoreId">
          <el-select class="input-w" filterable clearable placeholder="请选择" v-model="formDataStore.brandName">
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchTableDataIn" type="primary" plain>搜索</el-button>
          <el-button @click="initFormDataIn" plain>重置</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-button class="ml-20" size="small" type="primary" @click="">导出</el-button> -->
      <div class="item-margin">
        <page-table :form-data="formDataStore" :get-data="movingAveragePrice_writeOffDetailsList" :table-data="movingAveragePrice_writeOffDetailsList_list.dataList">
          <el-table :data="movingAveragePrice_writeOffDetailsList_list.dataList.data" max-height="350" class="mt-10">
            <el-table-column :show-overflow-tooltip="true" label="款号" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.productCode }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="货号" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.goodsCode }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="商品名称" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.goodsName }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="颜色" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.color }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="尺码" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.size }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="品牌" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.brandName }}</template>
            </el-table-column>
             <el-table-column :show-overflow-tooltip="true" label="吊牌价" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.priceTag }}</template>
            </el-table-column>
             <el-table-column :show-overflow-tooltip="true" label="未核销数量" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.quantity }}</template>
            </el-table-column>
             <el-table-column :show-overflow-tooltip="true" label="本期核销数量" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.writeOffQuantity }}</template>
            </el-table-column>
          </el-table>
          <div class="statistics2">
            未核销数： <span class="mr-20">{{ movingAveragePrice_writeOffDetailsList_list.info.unAppliedQuantity }}</span>
            本期核销数： <span>{{ movingAveragePrice_writeOffDetailsList_list.info.writeOffQuantity }}</span>
            </div>
        </page-table>
      </div>
    </el-dialog>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="formData"
        label-width="120px"
        size="small"
        ref="formData"
        inline>
        <el-form-item label="结算客户名称：" prop="inStoreId">
          <el-select
            v-model="formData.channelCustomerName"
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
        <el-form-item label="结算类型：" prop="outStoreId">
          <el-select
            v-model="formData.settleTypeName"
            placeholder="请选择"
            class="input-w"
            filterable
            clearable
          >
            <el-option
              v-for="(item, index) in tradeWayCodeType"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="自定义筛选：">
            <el-select
            placeholder="请选择"
            class="input-w"
            v-model="formData.purchaseOrderStatuss"
            filterable
            clearable>
          <el-option
              v-for="(item, index) in valueType"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
          <el-select
            placeholder="请选择"
            class="input-w"
            v-model="formData.purchaseOrderStatus"
            filterable
            clearable
          >
            <el-option
              v-for="(item, index) in symbolType"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
          <el-input
            v-model="formData.searchWords"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="请输入金额"
            clearable
          ></el-input>
        </el-form-item> -->
        <el-form-item label="上次结算时间：" prop="startDate">
          <el-date-picker value-format="yyyy-MM-dd 00:00:00" v-model="formData.startTime" type="date" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker value-format="yyyy-MM-dd 23:59:59" v-model="formData.endTime" type="date" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
          <el-button @click="initFormData" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <div v-if="!enterTypeFlag">
        <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      </div>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData.dataList">
        <el-table
          :data="tableData.dataList.data"
          style="width: 100%"
          row-key="id"
          @selection-change="tableCheckChange"
          id="table-data">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="channelCustomerName" label="结算客户名称" width="200"></el-table-column>
          <el-table-column prop="settleTypeName" label="结算类型" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="initialVolume" label="期初货量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="initialValueCopy" label="期初货值" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allotTotal" label="配货总件数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="returnTotal" label="退返总件数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="writeOffTotal" label="核销件数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="writeOffValueCopy" label="核销货值" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="finalPeriodVolume" label="期末货量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="finalPeriodValueCopy" label="期末货值" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="updateTime" label="上次结算时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editItem(scope.row)"
                v-if="1"
              >核销</el-button>
              <el-button
                type="text"
                size="small"
                @click="channelWriteOffSettle_settlement(scope.row)"
                v-if="1"
              >结算</el-button>
              <el-button
                type="text"
                size="small"
                @click="delItem(scope.row)"
                v-if="1"
              >查看供货明细</el-button>
              <el-button
                type="text"
                size="small"
                @click="finishItem(scope.row)"
                v-if="1"
              >撤销核销</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="statistics">累计未结算款：{{ tableData.info.writeOffValueStatistic }}&nbsp;&nbsp;&nbsp;&nbsp;累计销货数：{{ tableData.info.writeOffTotalStatistic }}</div>
      </page-table>
    </div>
  </div>
</template>
<script>
import PageTable from "@/views/collocation/components/PageTable";
import TimeIntervalCheck from "@/components/TimeIntervalCheck";
import keepAliveMixin from "@/mixins/keepAliveMixin";
export default {
  name: "channel_list",
  mixins: [keepAliveMixin],
  // 数据
  data() {
    return {
      // 供货明细列表
      movingAveragePrice_writeOffDetailsList_list:{
        dataList:{
          data:[]
        },
        info:{}
      },
      check_item:{},
      // 调出方列表
      tuneOut_data: [],
      // 调入方列表
      tuneIn_data: [],
      // 选中调出方信息
      checkTuneOutUser: {},
      // 选中调入方信息
      checkTuneInUser: {},
      orderStarusType: {
        100: "主单待编辑",
        101: "主单待审核",
        102: "主单待发货",
        103: "主单部分已发货",
        104: "主单异常完成",
        105: "主单已完成",
        106: "主单已作废"
      },
      tradeWayCodeType: {
        1: "现金",
        2: "代销"
      },
      valueType: {
        0: "期初货量",
        1: "期初货值",
        2: "配货总件数",
        3: "退返总件数",
        4: "核销件数",
        5: "核销货值",
        6: "核销货值",
        7: "期末货量",
        8: "期末货值",
      },
      symbolType: {
        0: "小于",
        1: "小于等于",
        2: "等于",
        3: "大于",
        4: "大于等于"
      },
      // 参数
      addFormData: {
        // 发货人
        allotMan: "",
        // 发货人直属机构
        organizationId: "",
        organizationName: "",
        // 订单类型
        // orderType: '0203',
        // 发货门店
        outStoreId: "",
        outStoreName: "",
        // 收货门店
        inStoreId: "",
        inStoreName: "",
        // 收货人
        receiveMan: "",
        // 电话
        phone: "",
        // 省市区信息
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        areaName: "",
        areaCode: "",
        divisionId: "",
        // 地址
        addressInfo: ""
      },
      // 选择调出弹框
      dialogTableVisible:false,
      // 结算弹框
      dialogJs:false,
      // 选择调出类型
      allocatingType: true,
      // 标识是否是零售门店进入
      enterTypeFlag: false,
      // 查询参数
      formData: {
        // 结算客户名称
        channelCustomerName: null,
        // 结算类型
        settleTypeName: null,
        // 开始时间
        startTime: null,
        // 结束时间
        endTime: null,
        pageIndex: 1,
        pageSize: 10
      },
      // 查询参数
      formDataIn: {
        // 模糊搜索
        searchWords: null,
        // 订单状态
        purchaseOrderStatus: null,
        pageIndex: 1,
        pageSize: 10
      },
      // 查询参数
      formDataStore: {
        // 模糊搜索
        filter: null,
        // 门店id
        storeId: null,
        // 品牌名称
        brandName: null,
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
      tableData: {
        dataList:{
          data:[]
        },
        info:{}
      },
      // 选中的表格数据
      checkedTableData: [],
      // 全部品牌
      brandOptions:[],
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
    this.getBrandOptions(); // 获取品牌
  },
  // 初始化数据
  mounted() {
    this.$nextTick(() => {
      this.getInStoreList();
      // this.getOutStoreList();
      this.getTableData();
      // 调入、调出门店接口列表，调出传入调入ID（SCB)
    });
  },
  // 方法
  methods: {
    /**
     * 关闭弹框
     */
    closeDialog() {
      Object.assign(this.formDataStore,{
        // 模糊搜索
        filter: null,
        // 门店id
        storeId: null,
        // 品牌名称
        brandName: null,
        pageIndex: 1,
        pageSize: 10
      });
    },
    /**
     * 获取品牌
     */
    getBrandOptions() {
      this.request(
        this.api.product.productBrand_list,
        {},
        true
        ).then(data => {
          let _data = data.data;
          this.brandOptions = _data;
      });
    },
    /**
     * 结算
     */
    channelWriteOffSettle_settlement(row) {
      if(parseInt(row.writeOffValueCopy) == 0) {
        this.warn('核销货值必须大于零时，可进行结算!','warning');
        return;
      }
      this.dialogJs = true;
      this.check_item = row;
      // this.request(this.api.scb.channelWriteOffSettle_get, 
      // {
      //   id:row.id
      // }).then(data => {
     
      //   this.check_item.writeOffValueCopyTotal = data.writeOffValueCopy;
      // });
    },
    qrJs() {
      this.request(this.api.scb.channelWriteOffSettle_settlement, 
      {
        writeOffTotal:this.check_item.writeOffTotal,
        writeOffValue:this.check_item.writeOffValue,
        channelCustomerId:this.check_item.channelCustomerId,
        operator:this.addFormData.allotMan
      }).then(data => {
        this.dialogJs = false;
        this.getTableData();
        this.warn("审核通过！");
      });
    },
    /**
     * 审核通过
     */
    purchaseOrder_checkToPass(row) {
      this.$confirm("审核通过后，库房将接收订单发货通知！", "订单审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.request(this.api.scb.purchaseOrder_checkToPass, {
          orderId: row.id
        }).then(data => {
          this.getTableData();
          this.warn("审核通过！");
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    async info() {
      // 获取userId
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      // 保存用户名称
      this.addFormData.allotMan = info.name;
      // 获取直属机构
      let organization = await this.request(
        this.api.user.userCompany_getUserOrgByUserId,
        { userId: info.userId },
        true
      );
      this.addFormData.organizationId = organization.id;
      this.addFormData.organizationName = organization.name;
    },
    /**
     * 获取客户列表
     * @param { String } id 调出方id
     */
    tuneIn_fn() {
      this.request(this.api.store.storeBasic_listStoreBasic,this.formDataIn).then(res => {
        this.tuneIn_data = res;
        res.data.forEach((item, index) => {
          item._createTime = this.$options.filters.timestampToTime(
            item.createTime
          );
        });
      });
    },
    /**
     * 调入下一步
     */
    drNext() {
      if (JSON.stringify(this.checkTuneInUser) == "{}") return;

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
      sessionStorage.setItem(
        "TRANSFER_SLIP_APP_INFO",
        JSON.stringify(this.addFormData)
      );
      // return;
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/sell_order_edit"
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
        type: type || "success"
      });
    },
    // keepAlive 返回初始化
    activatedInit() {
      this.getTableData();
    },
    // 导出
    exportExcel() {
      if (this.checkedTableData.length === 0) {
        this.checkedTableData = this.tableData.dataList.data;
      }
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "结算客户名称",
          "结算类型",
          "期初货量",
          "期初货值",

          "配货总件数",
          "退返总件数",
          "核销件数",
          "核销货值",

          "期末货量",
          "期末货值",
          "上次结算时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "channelCustomerName",
          "settleTypeName",
          "initialVolume",
          "initialValueCopy",

          "allotTotal",
          "returnTotal",
          "writeOffTotal",
          "writeOffValueCopy",

          "finalPeriodVolume",
          "finalPeriodValueCopy",
          "updateTime"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.checkedTableData; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "渠道结算订单列表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 行商品详情导出
    downloadItem(row) {
      this.request(this.api.order.storeAllotOrderProductInfo_list, {
        orderSn: row.orderSn
      }).then(data => {
        this.downloadDataInit(data.data);
        let downloadData = data.data;
        require.ensure([], () => {
          let { export_json_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "商品款号",
            "商品货号",
            "名称",
            "品牌",
            "吊牌价",
            "调拨单价",
            "调拨数量",
            "调拨金额",
            "门店实发数量",
            "门店实收数量"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "productCode",
            "goodsCode",
            "goodsName",
            "brandName",
            "_retailPrice",
            "_allotPrice",
            "quantity",
            "_amount",
            "shipmentsQty",
            "receiveQty"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = downloadData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "调拨商品信息");
        });
      });
    },
    downloadDataInit(data) {
      if (data && data.length) {
        data.forEach(item => {
          item._retailPrice = "￥" + item.retailPrice.toFixed(2);
          item._allotPrice = "￥" + item.allotPrice.toFixed(2);
          item._amount = "￥" + (item.quantity * item.allotPrice).toFixed(2);
        });
      }
    },
    // 点击搜索
    searchTableData() {
      this.formData.pageIndex = 1;
      this.getTableData();
    },
    searchTableDataIn() {
      this.movingAveragePrice_writeOffDetailsList();
    },
    initFormDataIn() {
      this.formDataStore = {
        // 模糊搜索
        filter: null,
        // 门店id
        storeId: null,
        // 品牌名称
        brandName: null,
        pageIndex: 1,
        pageSize: 10
      };
    },
    // 获取列表数据
    getTableData() {
      this.request(this.api.scb.channelWriteOffSettle_list, this.formData).then(
        data => {
          this.initTableData(data.data);
          this.tableData = data;
          data.dataList.data.forEach((item, idnex) => {
            item.updateTime = this.$options.filters.timestampToTime(item.updateTime);
          });
        }
      );
    },
    // 初始化数据 导出使用
    initTableData(data) {
      if (data && data.length) {
        data.forEach(item => {
          item._createTime = this.$options.filters.timestampToTime(
            item.createTime
          );
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
        // 结算客户名称
        channelCustomerName: null,
        // 结算类型
        settleTypeName: null,
        // 开始时间
        startTime: null,
        // 结束时间
        endTime: null,
        pageIndex: 1,
        pageSize: 10
      });
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
      this.$router.push({
        path: module + "/channel/channel_edit",
        query: {
          id: row.id,
          outStoreId: row.channelCustomerId,
          orderNum: row.purchaseOrderNum
        }
      });
    },
    // 查看明细
    delItem(row) {
      this.dialogTableVisible = true;
      this.movingAveragePrice_writeOffDetailsList_obj = row;
      this.movingAveragePrice_writeOffDetailsList();
    },
    // 获取供货明细列表
    movingAveragePrice_writeOffDetailsList() {
      Object.assign(this.formDataStore, {
        storeId:this.movingAveragePrice_writeOffDetailsList_obj.channelCustomerId
      })
      this.request(this.api.scb.movingAveragePrice_writeOffDetailsList, 
        this.formDataStore
      ).then(data => {
        this.movingAveragePrice_writeOffDetailsList_list = data;
      });
    },
    // 强制完成
    finishItem(row) {
      if(!row.writeOffTotal) {
        this.warn('暂无撤销核销商品！','warning');
        return;
      };
      this.$confirm("执行撤销后，本期全部已核销商品将回退到未核销商品中，确认撤销吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.request(this.api.scb.channelWriteOffSettle_revoke, {
          id: row.id
        }).then(data => {
          this.getTableData();
          this.warn("撤销成功！");
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
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
