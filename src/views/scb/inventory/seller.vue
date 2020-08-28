<template>
  <div>
    <!-- 模糊搜索 -->
    <div class="item-margin">
      <el-form class="item-form" size="small" :inline="true" :model="filtersData">
        <!-- 模糊查询 -->
        <el-form-item label="模糊查询：">
          <el-input
            v-model="filtersData.searchWords"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="商品款号/商品货号/商品名称/关联单据号"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌：">
          <el-select
            class="input-w"
            filterable
            clearable
            placeholder="请选择"
            v-model="filtersData.brandName"
          >
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出入库类型：">
          <el-select v-model="filtersData.stockTypeCode" clearable filterable>
            <el-option
              v-for="(item, index) in brandOptions"
              :label="item"
              :key="index"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出入仓库：">
          <el-select v-model="filtersData.fuzzyQuery" clearable filterable>
            <el-option
              v-for="(item, index) in orderStatus"
              :label="item"
              :key="index"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间：" prop="startDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filtersData.start"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filtersData.end"
            type="date"
            placeholder="结束日期"
          ></el-date-picker>
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
      <el-button size="small" type="primary" @click="exportExcelOrder">导出</el-button>
      <el-table
        :data="getList_data.data"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        @selection-change="tableCheckChange"
        :highlight-current-row="true"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="时间" min-width="130">
          <template slot-scope="scope">{{ scope.row.createTime || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="商品款号" min-width="60">
          <template slot-scope="scope">{{ scope.row.productCode }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="货号" min-width="60">
          <template slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="名称" min-width="90">
          <template slot-scope="scope">{{ scope.row.mobile || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="商品图片" min-width="60">
          <template slot-scope="scope">{{ scope.row.sumQuantity || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="颜色" min-width="60">
          <template slot-scope="scope">{{ scope.row.storeRetailOrderPaymentVO.sumPrice || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="规格" min-width="60">
          <template slot-scope="scope">{{ scope.row.orderAmount || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="品牌" min-width="60">
          <template slot-scope="scope">{{ scope.row.acturalPaidAmount || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="吊牌价" min-width="60">
          <template slot-scope="scope">{{ scope.row.paymentCode || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="出入库类型" min-width="120">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="出入仓库" min-width="60">
          <template slot-scope="scope">{{ scope.row.returnGoodsAllOrPart }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="出入库数量" min-width="60">
          <template slot-scope="scope">{{ scope.row.imageHousekeeperName || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="关联单据号" min-width="60">
          <template slot-scope="scope">{{ scope.row.storeName || '--' }}</template>
        </el-table-column>
      </el-table>
      <div
        class="pagination mt-10"
        :class="{ 'justify-content': getList_data.data && getList_data.data.length > 0 }"
      >
        <div v-if="getList_data.data && getList_data.data.length > 0">
          累计出库数：
          <span>{{ stockRecords_findStatisticsByMerchantId_data.totalCount }}</span>
          累计入库数：
          <span>{{ stockRecords_findStatisticsByMerchantId_data.saleSumProQty }}</span>
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
          :total="getList_data.totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 列表 -->
  </div>
</template>
<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { filter } from "minimatch";
import { get } from "http";

let token = getToken();

export default {
  name: "storeSell_order_list",
  data() {
    return {
      info: null,
      // 全部品牌
      brandOptions: [],
      // 订单状态
      orderStatus: {
        101: "未付款",
        102: "已付款",
        103: "已关闭"
      },
      // 订单商品类型
      OrderProductType: {
        0: "服装商品",
        1: "虚拟商品"
      },
      returnGoodsAllOrPartList: {
        0: "未退货",
        1: "部分退货",
        2: "全部退货"
      },
      // 支付方式
      PaymentWayCode: {
        1: "现金",
        2: "微信付款",
        3: "刷卡",
        4: "余额支付",
        5: "支付宝"
      },
      // 支付状态
      PaymentStatus: {
        201: "未支付",
        202: "已支付"
      },
      // data数据
      getList_data: {},
      // 订单数据统计
      stockRecords_findStatisticsByMerchantId_data: {},
      // 选中的表格数据
      checkedTableData: [],
      // 获取门店信列表
      getStoreList_data: [],
      formInline: {
        user: "",
        region: ""
      },
      filtersData: {
        merchantId: "",// 商户ID
        searchWords: "",// 关键字
        brandName:'',// 品牌名称
        stockTypeCode:'',// 出入库类型编码
        start:'',// 开始日期
        end:'',// 结束日期
        pageIndex: 1,
        pageSize: 10
      },
      // 门店列表请求参数
      filtersDataStore: {
        pageIndex: "", // 当前页码
        pageSize: "", // 每页数量
        name: "", // 门店名称
        organizationId: "", // 隶属机构
        businessStatus: "", // 营业状态
        type: "", // 门店类型
        createBegin: "", // 创建时间开始
        createEnd: "" // 创建时间结束
      },
      value: "",
      storageValArr: [],
      // 指派单选框
      radio: "1",
      // 指派
      gridData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    const that = this;

    this.getList();
    this.stockRecords_findStatisticsByMerchantId();
    this.getStoreList();
    this.userinfo();
    this.getBrandOptions(); // 获取品牌
  },
  activated() {
    this.getList();
  },
  methods: {
    /**
     * 获取品牌
     */
    getBrandOptions() {
      this.request(this.api.product.productBrand_list, {}, true).then(data => {
        let _data = data.data;
        this.brandOptions = _data;
      });
    },
    async userinfo() {
      this.info = await this.request(this.api.user.get_userinfo, {}, true); // 获取用户信息
    },
    /**
     * 导出销售订单
     */
    exportExcelOrder() {
      this.exportExcel({
        title: "零售门店信息列表",
        checkedTableData:
          this.checkedTableData.length > 0
            ? this.checkedTableData
            : this.getList_data.data,
        tHeader: [
          "订单号",
          "状态",
          // "支付状态",
          // "订单商品类型",
          "客户姓名",
          "客服电话",
          "销售件数",
          "吊牌总额",
          "订单金额",
          "实付金额",
          "支付方式",
          "关联预约单号",
          "创建时间",
          "是否退货",
          "开单人",
          "所属门店",
          "所属机构"
        ],
        filterVal: [
          "orderNum",
          "orderStatus",
          // "paymentStatus",
          // "orderProductType",
          "userName",
          "mobile",
          "sumQuantity",
          "sumPrice",
          "orderAmount",
          "acturalPaidAmount",
          "paymentCode",
          "reservationOrderNum",
          "createTime",
          "returnGoodsAllOrPart",
          "imageHousekeeperName",
          "storeName",
          "organization"
        ]
      });
    },
    /**
     * 导出销售订单
     */
    exportExcelGoodList() {
      let checkedTableData = [];
      if (this.checkedTableData && this.checkedTableData.length > 0) {
        this.checkedTableData.forEach((item, index) => {
          checkedTableData = [
            ...checkedTableData,
            ...item.storeRetailOrderProductInfoVOS
          ];
        });
      } else {
        this.getList_data.data.forEach((item, index) => {
          checkedTableData = [
            ...checkedTableData,
            ...item.storeRetailOrderProductInfoVOS
          ];
        });
      }
      this.exportExcel({
        title: "订单商品表明细",
        checkedTableData,
        tHeader: [
          "商品款号",
          "商品货号",
          "商品图片",
          "品牌",
          "销售数量",

          "吊牌价",
          "吊牌金额",
          "销售单价",
          "销售金额",
          "关联订单号",

          "退货数量",
          "零售店铺"
        ],
        filterVal: [
          "productCode", // 商品款号
          "goodsCode", // 商品货号
          "image", // 商品图片
          "brandName", // 品牌
          "quantity", // 销售数量

          "price", // 吊牌价
          "sumRetailPriceByGoodsCode", // 吊牌金额
          "retailPrice", // 销售单价
          "salesAmount", // 销售金额

          "orderNum", // 关联订单号
          "refundQuantity", // 退货数量
          "storeName" // 零售门店
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
    /**
     * 查看
     */
    timeRedact(id, storeId) {
      this.href("/order/storeSell_order_detail", {
        id,
        storeId
      });
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
     * 查询table列表数据
     */
    getList() {
      const that = this;

      this.request(
        that.api.scb.stockRecords_list,
        this.filtersData
      ).then(res => {
        that.getList_data = res;
      });
    },
    /**
     * 查询table列表统计数据
     */
    stockRecords_findStatisticsByMerchantId() {
      const that = this;

      this.request(
        that.api.scb.stockRecords_findStatisticsByMerchantId,
        this.filtersData
      ).then(res => {
        that.stockRecords_findStatisticsByMerchantId_data = res;
      });
    },
    /**
     * 查询列表
     */
    getStoreList() {
      const that = this;

      this.request(that.api.store.storeBasic_list, this.filtersDataStore).then(
        res => {
          that.getStoreList_data = res;
        }
      );
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
     * 模糊搜索
     */
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getList();
      this.stockRecords_findStatisticsByMerchantId();
    },
    /**
     * 搜索重置
     */
    handleResetFilters() {
      Object.assign(this.filtersData, {
        fuzzyQuery: "",
        returnGoodsAllOrPart: null,
        orderStatus: "",
        payType: "",
        storeId: "",
        startDate: "",
        endDate: "",
        pageIndex: 1,
        pageSize: 10,
        type: 0
      });
    }
  },
  components: {
    codeSet,
    treeDept
  }
};
</script>
<style  lang="less" scoped>
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
