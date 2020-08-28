<style lang="less" scoped></style>
<template>
  <div class="out-goods-list">
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="综合搜索：" prop="searchWords">
          <el-input class="input-w-2" placeholder="调出单号/调拨单号" v-model="formData.searchWords"></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="orderStatus">
          <el-select placeholder="请选择" class="input-w" v-model="formData.orderStatus" clearable>
            <el-option
                v-for="item in billType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：" prop="storeId">
          <el-select v-model="formData.storeId" placeholder="请选择" filterable clearable>
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <time-interval-check :form-data="formData" :label="'发货时间：'" :props-options="timePropsOptions"></time-interval-check>
        <el-form-item>
          <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
          <el-button @click="initFormData" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <div>
        <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      </div>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table :data="tableData.data" style="width: 100%" row-key="id" @selection-change="tableCheckChange" id="table-data">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="orderSn" label="调出单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_orderStatus" label="单据状态"></el-table-column>
          <el-table-column prop="outStoreName" label="调出门店" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="quantity" label="应发总件数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="shipmentsQty" label="实发数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_shipmentsTime" label="发货时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="associationOrderSn" label="调拨单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeItem(scope.row, 'see')">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </div>
</template>
<script>
  import PageTable from "@/views/collocation/components/PageTable";
  import TimeIntervalCheck from "@/components/TimeIntervalCheck";
  export default {
    name: 'out_goods_list',
    // 组件
    components: {
      PageTable,
      TimeIntervalCheck
    },
    // 数据
    data() {
      return {
        // 门店列表
        storeList: [],
        // 查询参数
        formData: {
          // 单据状态
          orderStatus: '',
          // 门店
          storeId: '',
          // 时间
          shipmentsTimeBegin: '',
          shipmentsTimeEnd: '',
          // 关键字
          searchWords: '',
          pageIndex: 1,
          pageSize: 10
        },
        timePropsOptions: {
          timeBegin: 'shipmentsTimeBegin',
          timeEnd: 'shipmentsTimeEnd'
        },
        // 单据状态
        billType: this.$common.getBillType('transferSlip'),
        // 表格数据
        tableData: {},
        // 选中的表格数据
        checkedTableData: []
      }
    },
    created(){

    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getTableData();
        this.getStoreList();
      })
    },
    // 方法
    methods: {
      //导出
      exportExcel() {
        if(this.checkedTableData.length === 0){
          this.$notify.error({ title: '错误',message: '请选择数据'});
          return
        }
        require.ensure([], () => {
          let { export_json_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "调出单号",
            "单据状态",
            "调出门店",
            "应发总件数",
            "实发数量",
            "发货时间",
            "调拨单号"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "orderSn",
            "_orderStatus",
            "outStoreName",
            "quantity",
            "shipmentsQty",
            "_shipmentsTime",
            "associationOrderSn"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.checkedTableData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "调出单");
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getTableData();
      },
      // 获取列表数据
      getTableData(){
        this.request(this.api.retailStore.storeAllocateOutOrder_list, this.formData).then(data => {
          this.initTableData(data.data);
          this.tableData = data;
        });
      },
      // 初始化数据 导出使用
      initTableData(data){
        if(data && data.length){
          data.forEach(item => {
            item._orderStatus = this.statusToName(item.orderStatus);
            item._shipmentsTime = this.$options.filters.timestampToTime(item.shipmentsTime);
          })
        }
      },
      // 获取表格选中的
      tableCheckChange(val){
        this.checkedTableData = val;
      },
      // 初始查询条件
      initFormData(){
        this.$refs.formData.resetFields();
      },
      // 查看
      seeItem(row){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/out_goods/out_goods_details',
          query: {
            id: row.id,
            orderSn: row.orderSn
          }
        });
      },
      // 获取门店列表
      getStoreList() {
        this.request(this.api.store.storeBasic_list, {}).then(data => {
          this.storeList = data.data;
        });
      },
      // 状态转name
      statusToName(val){
        if(!val && val !== 0) return;
        let item = this.billType.find(item => {
          return item.id === val
        });
        if(item){
          return item.name;
        }else {
          return val
        }
      }
    },
    filters: {

    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
