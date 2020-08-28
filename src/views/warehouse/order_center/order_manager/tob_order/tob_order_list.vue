<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey">
          <el-input
            v-model="signData.searchKey"
            placeholder="订单编号/收货人/收货地址/配货人"
            style="width:330px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态：" prop="businessStatus">
          <el-select v-model="signData.businessStatus" placeholder="请选择">
            <el-option
              v-for="item in orderStateData"
              :key="item.id"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="发货仓库：" prop="warehouseCode" label-width="100px">
          <el-select
            v-model="signData.warehouseCode"
            placeholder="请选择"
            >
              <el-option
                v-for="item in warehouseData"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.warehouseCode"
              ></el-option>
            </el-select>
        </el-form-item>-->
        <el-form-item label="单据来源：" prop="sourceCode">
          <el-select v-model="signData.sourceCode" placeholder="请选择">
            <el-option
              v-for="item in sourceData"
              :key="item.id"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <time-interval-check
          :form-data="signData"
          :props-options="{timeBegin:'startTime',timeEnd:'endTime'}"
        ></time-interval-check>
        <el-form-item style="margin-left:25px;">
          <el-button type="primary" @click="searchFormData" size="small">搜索</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <!-- <el-button plain @click="exportExcel" size="small">导出</el-button> -->
      <el-table
        ref="multipleTable"
        :data="tableListData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="item-table-header"
        empty-text="暂无数据"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <i
              @click="childrenIsShow(scope.row)"
              :data-id="scope.row.id"
              v-if="scope.row.isShow"
              :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" width="180">
          <template slot-scope="scope">{{ scope.row.orderSn ? scope.row.orderSn : '--'}}</template>
        </el-table-column>
        <el-table-column prop="businessStatus" label="状态">
          <template slot-scope="scope">{{ scope.row.businessStatus | filterBusinessStatus }}</template>
        </el-table-column>
        <el-table-column prop="consignee" label="收货人">
          <template slot-scope="scope">{{scope.row.consignee}}</template>
        </el-table-column>
        <el-table-column prop="consigneeAddress" label="收货地址" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.consigneeAddress}}</template>
        </el-table-column>
        <el-table-column prop="deliveryQuantity" label="发货件数">
          <template slot-scope="scope">{{ scope.row.deliveryQuantity }}</template>
        </el-table-column>
        <el-table-column prop="skuQuantity" label="sku种类">
          <template slot-scope="scope">{{ scope.row.skuQuantity }}</template>
        </el-table-column>
        <el-table-column prop="warehouse" label="发货仓库">
          <template slot-scope="scope">{{ scope.row.warehouse ?scope.row.warehouse:'--' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
        </el-table-column>
        <el-table-column label="单据来源">
          <template slot-scope="scope">{{ scope.row.orderSource | filtersSourceCode }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="checkBtnClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button
              @click="obsoleteBtnClick(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.businessStatus!='01002'"
            >强制终止</el-button>
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
        //模糊搜索
        searchKey: "",
        //订单状态
        businessStatus: "",
        //发货仓库编码
        warehouseCode: "",
        //单据来源编码
        sourceCode: "",
        //搜索起始时间
        startTime: "",
        //搜索终止时间
        endTime: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //订单状态
      orderStateData: [],
      //仓库状态
      warehouseData: [],
      //单据来源
      sourceData: [],
      //表格数据源
      tableListData: [],
      //总条数
      totalCount: 1
    };
  },
  filters: {
    //过滤订单状态
    filterBusinessStatus(val) {
      switch (val) {
        case "01001":
          return "待发货";
          break;
        case "01002":
          return "部分已发货";
          break;
        case "01003":
          return "异常完成";
          break;
        case "01004":
          return "已完成";
          break;
        case "01005":
          return "已作废";
          break;
      }
    },
    //过滤单据来源
    filtersSourceCode(val) {
      switch (val) {
        case "02001":
          return "SCB平台";
          break;
        case "02002":
          return "部分已发货";
          break;
        case "02003":
          return "异常完成";
          break;
        case "02004":
          return "已完成";
          break;
        case "02005":
          return "已作废";
          break;
      }
    }
  },
  mounted() {
    //得到订单状态和单据来源
    this.getOrderStateByCode();
    //得到仓库数据
    this.geSendWarehouseData();
    //得到列表数据
    this.getOrderListTableData();
  },
  methods: {
    //得到订单状态和单据来源
    getOrderStateByCode() {
      //得到订单状态数据 code==01 订单状态
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE01" }
      ).then(res => {
        this.orderStateData = res;
      });
      //得到单据来源数据 code==02 订单状态
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE02" }
      ).then(res => {
        this.sourceData = res;
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
    //得到订单列表数据
    getOrderListTableData() {
      // let filter = this.$common.deepCopy(this.signData);
      // if (filter.endTime != null) {
      //   let date = new Date(filter.endTime);
      //   let t = (date.getTime() / 1000 + 86399) * 1000;
      //   filter.endTime = new Date(t);
      // }
      //标识TOB
      this.signData.orderType = "03002";
      this.request(this.api.warehouse.warehouseBase_list, this.signData).then(
        res => {
          res.data.forEach(item => {
            item.isType = 1;
            item.isShow = true;
            item.businessStatusName = this.$options.filters.filterBusinessStatus(
              item.businessStatus
            );
            item.createTimeName = this.$options.filters.timestampToTime(
              item.createTime
            );
          });
          this.tableListData = res.data;
          this.totalCount = res.totalCount;
        }
      );
    },
    //查询
    searchFormData() {
      this.signData.pageIndex = 1;
      this.getOrderListTableData();
      console.log("searchFormData---");
    },
    //重置
    resetFormData(formData) {
      this.$refs[formData].resetFields();
    },
    //导出
    exportExcel() {
      this.exportExcelSelectData();
    },
    //导出选中的数据
    exportExcelSelectData() {
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "订单编号",
          "状态",
          "收货人",
          "收货地址",
          "发货件数",
          "sku种类",
          "发货仓库",
          "创建时间",
          "单据来源"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "businessStatusName",
          "consignee",
          "address",
          "deliveryQuantity",
          "skuQuantity",
          "warehouse",
          "createTimeName",
          "sourceCode"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.tableListData; //需要导出的表格数据
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "TOB订单表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //点击获取子元素插入数组
    childrenIsShow(row) {
      let _id = row.id; //当前数据ID
      let _type = row.isType; //状态 1 关闭 0 打开
      if (_type == "1") {
        //当前为关闭状态 需请求接口获取子元素
        row.isType = 0;
        this.getChildData(row, _id);
      } else {
        //当前为打开状态 需删除子元素
        row.isType = 1;
        this.removeChildData(row);
      }
    },
    //获取子集
    getChildData(row, _id) {
      let _index = this.tableListData.findIndex(item => item.id == _id);
      if (!row._chilren) {
        this.request(this.api.warehouse.warehouseBase_getByParentOrderSn, {
          parentOrderSn: row.orderSn
        }).then(res => {
          let _data = res;
          let _dataLen = _data.length;
          for (let i = 0; i < _dataLen; i++) {
            _data[i].subCode = _data[i].code;
            _data[i].code = null;
          }
          row._chilren = _data;
          //根据下标插入进去 获取ID 在数组中的下标
          this.tableListData.splice(_index + 1, 0, ..._data);
          //获取子集id存入 元素属性
          let arr = [];
          for (let { id } of _data) {
            arr.push(id);
          }
          row._cid = arr.join();
        });
      } else {
        this.tableListData.splice(_index + 1, 0, ...row._chilren);
      }
    },
    //删除子集
    removeChildData(row) {
      let cid = row._cid;
      let cidArr = cid.split(",");
      let _table = this.tableListData,
        tableLen = _table.length;
      for (let i = 0; i < cidArr.length; i++) {
        for (let j = 0; j < this.tableListData.length; j++) {
          if (cidArr[i] == this.tableListData[j].id) {
            this.tableListData.splice(j, 1);
          }
        }
      }
    },
    //查看Btn的点击事件
    checkBtnClick(row) {
      if (row.orderType == "03002") {
        //跳转查看主单详情
        this.$router.push({
          path:
            "/warehouse/order_center/order_manager/tob_order/tob_order_main_check",
          query: {
            orderSn: row.orderSn
          }
        });
      } else {
        //跳转查看子单详情
        this.$router.push({
          path:
            "/warehouse/order_center/order_manager/tob_order/tob_order_submenu_check",
          query: {
            orderSn: row.orderSn
          }
        });
      }
    },
    //作废Btn的点击事件
    obsoleteBtnClick() {
      console.log("obsoleteBtnClick---");
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getOrderListTableData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getOrderListTableData();
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