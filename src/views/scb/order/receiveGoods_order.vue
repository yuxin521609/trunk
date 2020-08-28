<style lang="less" scoped></style>
<template>
  <div class="transfer_slip_list">
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="formData"
        label-width="90px"
        size="small"
        ref="formData"
        inline="">
        <!-- 模糊查询 -->
        <el-form-item label="模糊查询：">
          <el-input
            v-model="formData.filter"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="收货单号/关联单号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="orderStatus">
          <el-select
            placeholder="请选择"
            class="input-w"
            v-model="formData.receiveStatus"
            filterable
            clearable>
            <el-option
              v-for="(item, index) in orderStarusType"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货类型：" prop="outStoreId">
          <el-select
            v-model="formData.sourceType"
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
        <el-form-item label="生成时间：" prop="startDate">
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
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table
          :data="tableData.data"
          style="width: 100%"
          row-key="id"
          @selection-change="tableCheckChange"
          id="table-data">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="receiveNum" label="收货单号" width="200"></el-table-column>
          <el-table-column prop="_receiveStatus" label="状态"></el-table-column>
          <el-table-column prop="planNum" label="应收数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="goodsQuantity" label="sku种类数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="realityNum" label="实收数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="amount" label="实收商品货值" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="sourceName" label="收货类型" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allotNum" label="关联单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="calloutName" label="出货方名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createTime" label="生成时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeItem(scope.row)">查看</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.receiveStatus == 3 || scope.row.receiveStatus == 14"
                @click="purchaseOrder_checkToPass(scope.row)">强制完成</el-button>
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
export default {
  name: 'receiveGoods_order',
  // 数据
  data() {
    return {
      // 调出方列表
      tuneOut_data: [],
      // 调入方列表
      tuneIn_data: [],
      // 选中调出方信息
      checkTuneOutUser: {},
      // 选中调入方信息
      checkTuneInUser: {},
      orderStarusType: {
        2: "待收货",
        3: "已完成"
      },
      tradeWayCodeType: {
        9: "采购入库",
        8: "调拨入库"
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
      dialogTableVisible: false,
      // 选择调出类型
      allocatingType: true,
      // 标识是否是零售门店进入
      enterTypeFlag: false,
      // 查询参数
      formData: {
        // 模糊搜索
        filter: null,
        // 单据状态
        receiveStatus: null,
        // 结算类型
        sourceType: null,
        // 开始时间
        startTime: null,
        // 结束时间
        endTime: null,
        pageIndex: 1,
        pageSize: 10
      },
      // 查询参数
      formDataStore: {
        // 模糊搜索
        searchWords: null,
        // 订单状态
        purchaseOrderStatus: null,
        // 结算类型
        tradeWayCode: null,
        // 门店名称（采购商名称）
        purchaseAgentName: null,
        // 开始时间
        startDate: null,
        // 结束时间
        endDate: null,
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
      billType: this.$common.getBillType("allot"),
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
      currentUserName:null,// 操作人
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
    this.getTableData();
    this.info();
  },
  // 初始化数据
  mounted() {
  },
  // 方法
  methods: {
    async info() {
      // 获取userId
      let info = await this.request(this.api.user.get_userinfo, {}, true);
      // 保存用户名称
      this.currentUserName = info.name;
    },
    /**
     * 审核通过
     */
    purchaseOrder_checkToPass(row) {
      this.$confirm("强制完成结束流程，确认强制完成吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {                         
          this.request(this.api.scb.receiveGoods_forcedCompletion, {
            id:row.id,
            currentUserName:this.currentUserName
          }).then(data => {
            this.getTableData();
            this.warn("强制完成！");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消强制完成"
          });
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
        this.checkedTableData = this.tableData.data;
      }
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "收货单号",
          "状态",
          "应收数量",
          "sku种类数",

          "实收数量",
          "实收商品货值",
          "收货类型",
          "关联单号",

          "出货方名称",
          "生成时间",
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "receiveNum",
          "receiveStatus",
          "planNum",
          "goodsQuantity",

          "realityNum",
          "amount",
          "sourceName",
          "allotNum",

          "calloutName",
          "createTime",
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.checkedTableData; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "收货单");
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
      this.tuneIn_fn();
    },
    initFormData() {
      Object.assign(this.formData,{
        // 模糊搜索
        filter: null,
        // 单据状态
        receiveStatus: null,
        // 结算类型
        sourceType: null,
        // 开始时间
        startTime: null,
        // 结束时间
        endTime: null,
        pageIndex: 1,
        pageSize: 10
      });
    },
    // 获取列表数据
    getTableData() {
      this.request(this.api.scb.receiveGoods_list, this.formData).then(
        data => {
          this.tableData = data;
          data.data.forEach((item, idnex) => {
            Object.assign(item, item.purchaseOrderDTO);
            item._purchaseOrderStatus = this.orderStarusType[
              item.purchaseOrderStatus
            ];
            item.amount = item.amount == null ? '--' : item.amount;
            item._receiveStatus = this.statusToName(item.receiveStatus);
            item.createTime = this.$options.filters.timestampToTime(item.createTime);
            item._tradeWayCode = this.tradeWayCodeType[item.tradeWayCode];
          });
        }
      );
    },
    // 获取表格选中的
    tableCheckChange(val) {
      this.checkedTableData = val;
    },
    // 查看
    seeItem(row) {
      let module = "/" + this.$route.path.split("/")[1];
      this.$router.push({
        path: module + "/order/receiveGoods_order_detail",
        query: {
          receiveNum: row.receiveNum
        }
      });
    },
    // 作废
    delItem(row) {
      this.$confirm("确认作废吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.request(this.api.scb.purchaseOrder_cancle, {
            orderId: row.id
          }).then(data => {
            this.getTableData();
            this.warn("作废成功！");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 强制完成
    finishItem(row) {
      this.$confirm("确认要强制完成吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.request(this.api.scb.purchaseOrder_forceTermination, {
            orderId: row.id
          }).then(data => {
            this.getTableData();
            this.warn("强制成功！");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
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
  },
  filters: {},
  // 计算属性
  computed: {},
  // 监听数据变化
  watch: {}
};
</script>
