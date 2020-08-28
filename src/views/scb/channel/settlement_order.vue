<template>
  <div>
    <el-dialog width="1200px" title="查看核销商品" @closed="closeDialog" :visible.sync="dialogTableVisible">
      <el-form
        :model="formDataIn"
        label-width="90px"
        size="small"
        ref="formDataIn"
        inline
      >
        <el-form-item label="模糊搜索" prop="inStoreId">
         <el-input v-model="formDataIn.filter" placeholder="款号/货号/商品名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌：">
          <el-select class="input-w" filterable clearable placeholder="请选择" v-model="formDataIn.brandName">
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
      <el-button class="ml-20" size="small" type="primary" @click="exportExcel2">导出</el-button>
      <div class="item-margin">
        <page-table :form-data="formDataIn" :get-data="tuneIn_fn" :table-data="tuneIn_data">
          <el-table :data="tuneIn_data.data" max-height="350" class="mt-10">
            <el-table-column :show-overflow-tooltip="true" label="款号" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.productCode }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="货号" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
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
              <template slot-scope="scope">{{ scope.row.priceTagCopy }}</template>
            </el-table-column>
             <el-table-column :show-overflow-tooltip="true" label="平均结算价" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.priceCopy }}</template>
            </el-table-column>
             <el-table-column :show-overflow-tooltip="true" label="结算核销数量" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.sendReceiveQuantity }}</template>
            </el-table-column>
            <!-- <el-table-column :show-overflow-tooltip="true" label="配货时间" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.createTime }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="关联收货单" align="center" min-width="90">
              <template slot-scope="scope">{{ scope.row.associationOrderSn }}</template>
            </el-table-column> -->
          </el-table>
        </page-table>
      </div>
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
            placeholder="结算人/财务确认人"
          ></el-input>
        </el-form-item>
        <el-form-item label="结算客户：">
          <el-select v-model="filtersData.channelCustomerName" clearable filterable>
            <el-option
              v-for="(item, index) in getStoreList_data.data"
              :label="item.name"
              :key="index"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="财务是否确认收款：">
          <el-select v-model="filtersData.financialConfirm" clearable filterable>
            <el-option
              v-for="(item, index) in financialConfirmType"
              :label="item"
              :key="index"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算时间：" prop="startDate">
          <el-date-picker
            value-format="yyyy-MM-dd 00:00:00"
            v-model="filtersData.startTime"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
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
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
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
        <el-table-column align="left" :show-overflow-tooltip="true" label="结算客户名称" min-width="60">
          <template slot-scope="scope">{{ scope.row.channelCustomerName }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="结算类型" min-width="60">
          <template slot-scope="scope">{{ scope.row.settleTypeName }}</template>
        </el-table-column>
        <!-- <el-table-column align="left" :show-overflow-tooltip="true" label="累计销售货值" min-width="60">
          <template slot-scope="scope">{{ scope.row.cumulativeSalesValueCopy }}</template>
        </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" align="left" label="结算款" min-width="60">
          <template slot-scope="scope">{{ scope.row.settlementCopy }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="结算时间" min-width="60">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="结算人" min-width="60">
          <template slot-scope="scope">{{ scope.row.clearer }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="财务是否确认" min-width="60">
          <template slot-scope="scope">{{ scope.row._financialConfirm }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="财务确认时间" min-width="60">
          <template slot-scope="scope">{{ scope.row.updateTime }}</template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true" label="财务确认人" min-width="60">
          <template slot-scope="scope">{{ scope.row.confirmer }}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          fixed="right"
          label-class-name="text-left"
          class-name="text-left"
          align="left"
          label="操作"
          width="170"
        >
          <template slot-scope="scope">
            <!-- <el-button
              type="text"
              @click="open"
              size="small"
            >撤销结算</el-button> -->
            <el-button
              type="text"
              @click="tuneIn_fn(scope.row)"
              size="small"
            >查看核销商品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div
        class="pagination mt-10"
        :class="{ 'justify-content': getList_data.data && getList_data.data.length > 0 }">
        <div v-if="getList_data.data && getList_data.data.length > 0">
          累计未结算款：
          <span>{{ storeRetailOrder_pcListStatistics_data.totalCount }}</span>
          累计销货数：
          <span>{{ storeRetailOrder_pcListStatistics_data.saleSumProQty }}</span>
        </div> -->
        <!-- 分页 -->
        <el-pagination
          class="mt-20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filtersData.pageIndex"
          :page-sizes="[10,20,30,40,50]"
          :page-size="filtersData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="getList_data.totalCount"
        ></el-pagination>
      <!-- </div> -->
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
import PageTable from "@/views/collocation/components/PageTable";
let token = getToken();

export default {
  name: "storeSell_order_list",
  data() {
    return {
      formDataIn:{
        filter: "",
        brandName:"",
        orderBy: "",
        pageIndex: 1,
        pageSize: 10,

      },
      // 全部品牌
      brandOptions:[],
      tuneIn_data:{},
      // 选择框数据
      selectList: [
        {
          id: 1,
          name: "张三"
        }
      ],
      // 弹框中包裹的对象
      dialogIncludeObj: {
        // 弹出框是否显示
        isDialogTableVisible: false,
        // 调出单检索条件 ---
        formDataOut: {
          orderStatus: null,
          pageIndex: 1,
          pageSize: 10
        },
        // 调出单
        tableOutDate: {
          data: [
            {
              name: "111"
            }
          ],
          totalCount: 15
        },
        // 选中调出单某一项
        checkOutItem: {}
      },
      // 订单状态
      orderStatus: {
        101: "未付款",
      },
      // 订单商品类型
      financialConfirmType: {
        0: "否",
        1: "是"
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
        "channelCustomerName": "",
        "endTime": "",
        "filter": "",
        "financialConfirm": null,
        "orderBy": "",
        "pageIndex": 1,
        "pageSize": 10,
        "pageStart": 0,
        "startTime": ""
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
    this.getStoreList();
    this.getBrandOptions(); // 获取品牌
    // this.tuneIn_fn();
  },
  activated() {
    this.getList();
  },
  methods: {
    /**
     * 关闭弹框
     */
    closeDialog() {
      Object.assign(this.formDataIn,{
        filter: "",
        brandName:"",
        orderBy: "",
        pageIndex: 1,
        pageSize: 10,

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
     * 获取客户列表
     * @param { String } id 调出方id
     */
    tuneIn_fn(row) {
      this.dialogTableVisible = true;
      if(row) {
        Object.assign(this.formDataIn, {
          channelCustomerId:row.channelCustomerId,
          associationOrderSn:row.statementNumber
        });
      };
      this.request(this.api.scb.channelSendReceiveRecord_list,this.formDataIn).then(res => {
        this.tuneIn_data = res;
        res.data.forEach((item, index) => {
          item.createTime = this.$options.filters.timestampToTime(
            item.createTime
          );
        });
      });
    },
    // 查看核销商品
    searchTableDataIn() {
      this.formDataIn.pageIndex = 1;
      this.tuneIn_fn();
    },
    // 重置核销商品检索 
    initFormDataIn() {
      Object.assign(this.formDataIn,{
        filter:null,
        brandName:null
      })
    },
    open() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    open2() {
      this.$prompt("请输入邮箱", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "邮箱格式不正确"
      })
      .then(({ value }) => {
        this.$message({
          type: "success",
          message: "你的邮箱是: " + value
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消输入"
        });
      });
    },
    // 导出
    exportExcel() {
        if (this.getList_data.length === 0) {
          this.checkedTableData = this.getList_data.data;
        }
        require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "结算客户名称",
          "结算类型",
          "累计销售货值",
          "结算款",

          "结算时间",
          "结算人",
          "财务是否确认",
          "财务确认时间",

          "财务确认人"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "channelCustomerName",
          "settleTypeName",
          "cumulativeSalesValueCopy",
          "settlementCopy",

          "createTime",
          "clearer",
          "financialConfirm",
          "updateTime",

          "confirmer"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.checkedTableData; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "结算单管理订单列表");
        });
    },
    // 导出
    exportExcel2() {
        require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "款号",
          "货号",
          "商品名称",
          "颜色",

          "尺码",
          "品牌",
          "吊牌价",
          "平均结算价",

          "结算核销数量",
          "配货时间",
          "关联收货单"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "productCode",
          "goodsCode",
          "goodsName",
          "color",

          "size",
          "brandName",
          "priceTagCopy",
          "priceCopy",

          "sendReceiveQuantity",
          "createTime",
          "associationOrderSn"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.tuneIn_data.data; //把data里的tableData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "核销商品列表");
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
     * 结算列表
     */
    getList() {
      const that = this;

      this.request(that.api.scb.channelBill_list, this.filtersData).then(
        res => {
          that.getList_data = res;
          res.data.forEach((item, index) => {
            item.createTime = this.$options.filters.timestampToTime(item.createTime);
            item.updateTime = this.$options.filters.timestampToTime(item.updateTime);
            item.updateTime = item.financialConfirm ? item.updateTime : '--';
            item.confirmer = item.financialConfirm ? item.confirmer : '--';
            item._financialConfirm = this.financialConfirmType[item.financialConfirm];
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
     * 查询列表
     */
    getStoreList() {
      const that = this;

      this.request(that.api.store.storeBasic_listStoreBasic, this.filtersDataStore).then(
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
    },
    /**
     * 搜索重置
     */
    handleResetFilters() {
      Object.assign(this.filtersData, {
        "channelCustomerName": "",
        "endTime": "",
        "filter": "",
        "financialConfirm": null,
        "orderBy": "",
        "pageIndex": 1,
        "pageSize": 10,
        "pageStart": 0,
        "startTime": ""
      });
    }
  },
  components: {
    codeSet,
    treeDept,
    PageTable
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
