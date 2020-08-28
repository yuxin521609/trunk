<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey">
          <el-input
            v-model="signData.searchKey"
            placeholder="单据编号/收货人/收货地址/收货人电话/源单号"
            style="width:330px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="businessStatus">
          <el-select v-model="signData.businessStatus" placeholder="请选择">
            <el-option
              v-for="item in orderStateData"
              :key="item.id"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库仓库：" prop="warehouseCode" label-width="100px">
          <el-select v-model="signData.warehouseCode" style="width:185px;">
            <el-option
              v-for="item in warehouseData"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库类型：" prop="orderType">
          <el-select v-model="signData.orderType" placeholder="请选择">
            <el-option
              v-for="item in orderTypeData"
              :key="item.id"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <time-interval-check :form-data="signData"></time-interval-check>
        <el-form-item>
          <el-button type="primary" @click="searchFormData" size="small">搜索</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-button
        type="primary"
        @click="addBtnClickEvent"
        size="small"
        style="margin-left:10px;"
      >新增收货单</el-button>
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
        empty-text="暂无数据"
        header-row-class-name="item-table-header"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="收货单号">
          <template slot-scope="scope">{{ scope.row.orderSn?scope.row.orderSn:'--'}}</template>
        </el-table-column>
        <el-table-column prop="businessStatus" label="单据状态">
          <template slot-scope="scope">{{ scope.row.businessStatus | filterBusinessStatus}}</template>
        </el-table-column>
        <el-table-column prop="type" label="入库类型">
          <template slot-scope="scope">{{ scope.row.type | filtersType}}</template>
        </el-table-column>
        <el-table-column prop="warehousingQuantity" label="收货件数"></el-table-column>
        <el-table-column prop="expectedTime" label="预计到货时间" width="160px">
          <template slot-scope="scope">{{ scope.row.expectedTime | timestampToTime}}</template>
        </el-table-column>
        <el-table-column prop="logistics" label="承运商">
          <template slot-scope="scope">{{ scope.row.logistics?scope.row.logistics:'--'}}</template>
        </el-table-column>
        <el-table-column prop="logisticsSn" label="运单号"></el-table-column>
        <el-table-column label="入库仓库">
          <template slot-scope="scope">{{ scope.row.warehouseCode }}</template>
        </el-table-column>
        <el-table-column prop="associationSn" label="源单号"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160px">
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="checkBtnClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="obsoleteBtnClick(scope.row)" type="text" size="small" disabled>作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
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
import TimeIntervalCheck from "@/components/TimeIntervalCheck";
export default {
  components: {
    TimeIntervalCheck
  },
  data() {
    return {
      signData: {
        //搜索
        searchKey: "",
        //单据状态
        businessStatus: "",
        //入库仓库
        warehouseCode: "",
        //入库类型
        orderType: "",
        //开始时间
        createTimeBegin: "",
        //结束时间
        createTimeEnd: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //表格数据源
      tableData: [],
      //总条数
      totalCount: 1,
      //单据状态
      orderStateData: [],
      //入库类型数据
      orderTypeData: [],
      //仓库数据
      warehouseData: [],
      //存储需要导出的数据
      multipleSelectionData: []
    };
  },
  filters: {
    //过滤订单状态
    filterBusinessStatus(val) {
      switch (val) {
        case "08001":
          return "待收货";
          break;
        case "08002":
          return "部分已收货";
          break;
        case "08003":
          return "异常完成";
          break;
        case "08004":
          return "已完成";
          break;
        case "08005":
          return "已作废";
          break;
      }
    },
    //过滤入库类型
    filtersType(val) {
      switch (val) {
        case "05001":
          return "采购入库";
          break;
        case "05002":
          return "退货入库";
          break;
        case "05003":
          return "其他入库";
          break;
        case "04004":
          return "已完成";
          break;
        case "04005":
          return "已作废";
          break;
      }
    }
  },
  mounted() {
    //得到单据状态的数据
    this.getOrderStateByCode();
    //得到仓库数据
    this.geSendWarehouseData();
    //得到收货单列表数据
    this.getReceiveOrderTableData();
  },
  methods: {
    //得到单据状态的数据
    getOrderStateByCode() {
      //得到订单状态数据 code==01 订单状态
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE08" }
      ).then(res => {
        this.orderStateData = res;
      });
      //得到入库类型数据 code==05 入库类型
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE05" }
      ).then(res => {
        this.orderTypeData = res;
      });
    },
    //得到入货仓库数据
    geSendWarehouseData() {
      this.request(this.api.warehouse.warehouseBase_warehouse_list, {
        isValid: true
      }).then(res => {
        console.log(res);
        this.warehouseData = res.data;
      });
    },
    //得到收货单列表数据
    getReceiveOrderTableData() {
      // let filter = this.$common.deepCopy(this.signData);
      // if (filter.createTimeEnd != null) {
      //   let date = new Date(filter.createTimeEnd);
      //   let t = (date.getTime() / 1000 + 86399) * 1000;
      //   filter.createTimeEnd = new Date(t);
      // }
      this.request(
        this.api.warehouse.warehouseBase_receiveOrder_list,
        this.signData
      ).then(res => {
        console.log(res);
        this.tableData = res.data;
        this.totalCount = res.totalCount;
      });
    },
    //查询
    searchFormData() {
      this.signData.pageIndex = 1;
      this.getReceiveOrderTableData();
      console.log("searchFormData---");
    },
    //重置
    resetFormData(ruleForm) {
      console.log("resetForm----");
      this.$refs[ruleForm].resetFields();
    },
    //导出
    exportExcel() {
      this.exportExcelSelectData();
      console.log(
        "导出Excel表格...+++++++++++++++++++multipleSelectionData.length"
      );
    },
    //新增发货单Btn的点击事件
    addBtnClickEvent() {
      console.log("addBtnClick---");
      this.$router.push({
        path:
          "/warehouse/warehouse_center/warehouse_manager/receive_order/receive_order_add"
      });
    },
    //导出选中的数据
    exportExcelSelectData() {
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "收货单号",
          "单据状态",
          "入库类型",
          "收货件数",
          "预计到货时间",
          "承运商",
          "运单号",
          "入库仓库",
          "源单号",
          "创建时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "businessStatusName",
          "typeName",
          "warehousingQuantity",
          "expectedTimeName",
          "logistics",
          "logisticsSn",
          "warehouse",
          "associationSn",
          "createTimeName"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "收货管理表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.businessStatusName = this.$options.filters.filterBusinessStatus(
          item.businessStatus
        );
        item.typeName = this.$options.filters.filtersType(item.type);
        item.expectedTimeName = this.$options.filters.timestampToTime(
          item.expectedTime
        );
        item.createTimeName = this.$options.filters.timestampToTime(
          item.createTime
        );
      });
      this.multipleSelectionData = val;
    },
    //查看Btn的点击事件
    checkBtnClick(row) {
      console.log("checkBtnClick---row--");
      this.$router.push({
        path:
          "/warehouse/warehouse_center/warehouse_manager/receive_order/receive_order_detail",
        query: {
          orderSn: row.orderSn
        }
      });
    },
    //作废Btn的点击事件
    obsoleteBtnClick() {
      console.log("obsoleteBtnClick---");
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getReceiveOrderTableData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getReceiveOrderTableData();
    }
  }
};
</script>

<style>
.search_div {
  background-color: #fff;
  padding-top: 20px;
  margin: 0 10px;
}
.table_div {
  background-color: #fff;
  padding: 10px;
  margin: 10px;
}
.pagination {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
  text-align: right;
}
</style>