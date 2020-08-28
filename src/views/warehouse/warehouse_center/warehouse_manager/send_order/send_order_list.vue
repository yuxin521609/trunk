<template>
  <div>
     <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey">
          <el-input v-model="signData.searchKey" placeholder="单据编号/收货人/收货地址/收货人电话/源单号" style="width:330px;"></el-input>
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
        <el-form-item label="出库类型：" prop="orderType" label-width="100px">
          <el-select v-model="signData.orderType" placeholder="请选择">
           <el-option
              v-for="item in orderTypeData"
              :key="item.id"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库仓库：" prop="warehouseCode">
           <el-select
            v-model="signData.warehouseCode"
            style="width:185px;"
            >
              <el-option
                v-for="item in warehouseData"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.warehouseCode"
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
      <el-button type="primary" @click="addBtnClickEvent" size="small" style="margin-left:10px;">新增发货单</el-button>
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
        <el-table-column label="发货单号">
          <template slot-scope="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column prop="businessStatus" label="单据状态">
          <template slot-scope="scope">{{ scope.row.businessStatus  | filterBusinessStatus}}</template>
        </el-table-column>
        <el-table-column prop="type" label="出库类型">
          <template slot-scope="scope">{{ scope.row.type | filtersType }}</template>
        </el-table-column>
        <el-table-column prop="consignee" label="收货人"></el-table-column>
        <el-table-column prop="consigneeTelephone" label="收货人电话"></el-table-column>
        <el-table-column prop="consigneeAddress" label="收货地址"></el-table-column>
        <el-table-column prop="deliveryQuantity" label="出库件数"></el-table-column>
        <el-table-column label="出库仓库">
          <template slot-scope="scope">{{ scope.row.warehouseCode }}</template>
        </el-table-column>
        <el-table-column prop="goodsOwner" label="货主"></el-table-column>
        <el-table-column prop="associationSn" label="源单号"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180px">
          <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
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
  data(){
    return{
      signData:{
        //搜索
        searchKey:'',
        //单据状态
        businessStatus:'',
        //出库类型
        orderType:'',
        //仓库编码
        warehouseCode:'',
        //开始时间
        createTimeBegin:'',
        //结束时间
        createTimeEnd:'',
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //表格数据源
      tableData:[],
      //总条数
      totalCount:1,
      //单据状态
      orderStateData: [],
      //出库类型数据
      orderTypeData:[],
      //仓库数据
      warehouseData:[],
      //存储需要导出的数据
      multipleSelectionData:[]
    }
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
    //过滤出库类型
    filtersType(val){
      switch (val) {
        case "04001":
          return "销售出库";
          break;
        case "04002":
          return "采退出库";
          break;
        case "04003":
          return "其他出库";
          break;
        case "04004":
          return "销售出库";
          break;
        case "04005":
          return "已作废";
          break;
      }
    } 
  },
  mounted () {
    //得到单据状态的数据
    this.getOrderStateByCode();
    //得到仓库数据
    this.geSendWarehouseData();
    //得到发货单列表数据
    this.getSendOrderTableData()
  },
  methods:{
    getSendOrderTableData(){
      // let filter = this.$common.deepCopy(this.signData);
      // if (filter.createTimeEnd != null) {
      //   let date = new Date(filter.createTimeEnd);
      //   let t = (date.getTime() / 1000 + 86399) * 1000;
      //   filter.createTimeEnd = new Date(t);
      // }
      this.request(this.api.warehouse.warehouseBase_deliveryOrder_list,this.signData).then(res =>{
        console.log(res)
        this.tableData=res.data
        this.totalCount=res.totalCount
      })
    },
    //得到单据状态的数据
    getOrderStateByCode() {
      //得到订单状态数据 code==01 订单状态
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE01" }
      ).then(res => {
        console.log(res)
        this.orderStateData = res;
      });
      //得到出库类型数据 code==04 出库类型
      this.request(
        this.api.warehouse.warehouseBase_configurationDictionaryByCode,
        { code: "CONFIGURABLE04" }
      ).then(res => {
        console.log(res)
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
    //查询
    searchFormData(){
      this.signData.pageIndex=1;
      this.getSendOrderTableData();
      console.log("searchFormData---")
    },
    //重置
    resetFormData(ruleForm){
      console.log("resetForm----")
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
    addBtnClickEvent(){
     console.log("addBtnClick---")
     this.$router.push({
       path:"/warehouse/warehouse_center/warehouse_manager/send_order/send_order_add"
     })
    },
    //导出选中的数据
    exportExcelSelectData() {
      require.ensure([], () => {
        let { export_json_to_excel } = require("@/vendor/Export2Excel");
        let tHeader = [
          "发货单号",
          "单据状态",
          "出库类型",
          "收货人",
          "收货人电话",
          "收货地址",
          "出库件数",
          "出库仓库",
          "货主",
          "源单号",
          "创建时间"
        ];
        // 上面设置Excel的表格第一行的标题
        let filterVal = [
          "orderSn",
          "businessStatusName",
          "typeName",
          "consignee",
          "consigneeTelephone",
          "consigneeAddress",
          "deliveryQuantity",
          "warehouse",
          "goodsOwner",
          "associationSn",
          "createTimeName"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let list = this.multipleSelectionData; //把data里的multipleSelectionData存到list
        let data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "发货管理表单");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //表格选择项改变时触发
    selectionChange(val) {
      val.forEach(item => {
        item.businessStatusName=this.$options.filters.filterBusinessStatus(item.businessStatus)
        item.typeName=this.$options.filters.filtersType(item.type)
        item.createTimeName=this.$options.filters.timestampToTime(item.createTime)
      });
      this.multipleSelectionData = val;
    },
    //查看Btn的点击事件
    checkBtnClick(row){
      this.$router.push({
          path:'/warehouse/warehouse_center/warehouse_manager/send_order/send_order_detail',
          query:{
            orderSn:row.orderSn
          }
        }
      )
    },
    //作废Btn的点击事件
    obsoleteBtnClick(){
     console.log("obsoleteBtnClick---")
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getSendOrderTableData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getSendOrderTableData();
    }
  }
}
</script>

<style>
.search_div{
  background-color:#fff;
  padding-top: 20px;
  margin:0 10px;
}
.table_div {
  background-color:#fff;
  padding: 10px;
  margin: 10px;
}
.pagination{
  margin-top:20px;
  padding-bottom:10px;
  margin-right:20px;
  text-align: right;
}
</style>