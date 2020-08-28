
<template>
  
  <div>
    <!-- 模糊搜索 -->
    <div class="item-margin">
      <el-form class="item-form" size="small" :inline="true" :model="filtersData">
        <!-- 模糊查询 -->
        <el-form-item label="模糊查询：">
          <el-input
            v-model="filtersData.filter"
            @keyup.enter.native="handleSearch"
            style="width:310px;"
            placeholder="付款方名称/收款单号/财务确认人"
          ></el-input>
        </el-form-item>
        <el-form-item label="收款类型：">
          <el-select v-model="filtersData.receiptTypeName" clearable filterable>
            <el-option
              v-for="(item, index) in receiveFormList"
              :label="item"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 新增 -->
        <el-form-item label="付款方式：">
          <el-select v-model="filtersData.paymentMethod" clearable filterable>
            <el-option
              v-for="(item, index) in PaymentWayCode"
              :label="item"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 新增 -->
        <el-form-item label="收款时间：" prop="startTime">
          <el-date-picker
            value-format="yyyy-MM-dd 00:00:00"
            v-model="filtersData.startTime"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker
            value-format="yyyy-MM-dd 23:59:59"
            v-model="filtersData.endTime"
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
        <el-table-column align="left" :show-overflow-tooltip="true" label="收款时间" min-width="120">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="收款类型" min-width="130">
          <template slot-scope="scope">{{ scope.row.receiptTypeName || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="收款金额" min-width="60">
          <template slot-scope="scope">{{ scope.row.collectionAmountCopy }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="收款方式" min-width="60">
          <template slot-scope="scope">{{ scope.row.paymentMethod || '--' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="付款方" min-width="90">
          <template slot-scope="scope">{{ scope.row.payer || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="收款单号" min-width="60">
          <template slot-scope="scope">{{ scope.row.receiptNumber || '--' }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="财务确认人" min-width="60">
          <template slot-scope="scope">{{ scope.row.financialConfirmer || '--' }}</template>
        </el-table-column>
      </el-table>
      <div
        class="pagination mt-10"
        :class="{ 'justify-content': getList_data.dataList && getList_data.dataList.datalength > 0 }"
      >
        <div v-if="getList_data.dataList && getList_data.dataList.datalength > 0">
          累计收款金额：
          <span>{{ getList_data.info }}</span>
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
      // 收款类型
      receiveFormList:{
        0:'门店结算收款',
        1:'押金充值',
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
      storeRetailOrder_pcListStatistics_data: {},
      // 选中的表格数据
      checkedTableData: [],
      // 获取门店信列表
      getStoreList_data: [],
      formInline: {
        user: "",
        region: ""
      },
      filtersData: {
        filter: "",
        returnGoodsAllOrPart: null,
        receiptTypeName: null,
        paymentMethod: null,
        storeId: "",
        startTime: "",
        endTime: "",
        pageIndex: 1,
        pageSize: 10,
        type: 0
      }
    };
  },
  created() {
    const that = this;

    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /**
     * 导出销售订单
     */
    exportExcelOrder() {
      this.exportExcel({
        title: "资金收入明细",
        checkedTableData:
          this.checkedTableData.length > 0
            ? this.checkedTableData
            : this.getList_data.dataList.data,
        tHeader: [
          "收款时间",
          "收款类型",
          "收款金额",
          "收款方式",

          "付款方",
          "收款单号",
          "财务确认人"
        ],
        filterVal: [
          "createTime",
          "receiptTypeName",
          "collectionAmountCopy",
          "paymentMethod",

          "payer",
          "receiptNumber",
          "financialConfirmer"
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
     * 查询table列表
     */
    getList() {
      const that = this;
      this.request(that.api.financial.capitalIncomeRecord_list, this.filtersData).then(
        res => {
          that.getList_data = res;
          res.dataList.data.forEach((item, index) => {
            item.createTime = this.$options.filters.timestampToTime(item.createTime);
            item.updateTime = this.$options.filters.timestampToTime(item.updateTime);
          });
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
        filter: "",
        returnGoodsAllOrPart: null,
        receiptTypeName: "",
        paymentMethod: "",
        storeId: "",
        startTime: "",
        endTime: "",
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
