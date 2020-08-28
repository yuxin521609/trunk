<style lang="less" scoped></style>
<template>
  <div class="distribution">
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="100px" size="small" ref="formData" inline>
        <el-form-item label="模糊查询：" prop="searchWords">
          <el-input class="input-w-2" placeholder="调出单号/调拨单号/物流单号/物流公司" v-model="formData.filter"></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="backStatus">
          <el-select placeholder="请选择" class="input-w" v-model="formData.orderStatus" clearable>
            <el-option
                v-for="item in billType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调出方名称：">
          <el-select v-model="formData.outStoreId" clearable filterable>
              <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货时间：" prop="startDate">
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
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table :data="tableData.data" style="width: 100%" row-key="id" @selection-change="tableCheckChange">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="orderSn" label="调出单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_orderStatus" label="单据状态"></el-table-column>
          <el-table-column prop="outStoreName" label="调出方名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="goodsQuantity" label="SKU种类数" :show-overflow-tooltip="true"></el-table-column>

          <el-table-column prop="quantity" label="应发总件数" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="shipmentsQty" label="实发数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="amountCopy" label="实发货值" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="logisticsCompany" label="物流公司" :show-overflow-tooltip="true"></el-table-column>

          <el-table-column prop="logisticsOrderSn" label="物流单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="shipmentsTime" label="发货时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_createTime" label="生成时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="associationOrderSn" label="调拨单号" :show-overflow-tooltip="true"></el-table-column>

          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeAndEditItem(scope.row, 'see')">查看</el-button>
              <!--导出商品明细  -->
              <el-button type="text" size="small" @click="seeAndEditItem(scope.row, 'see')">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </div>
</template>
<script>
  import codeSet from "@/components/codeSet";
  import PageTable from "@/views/collocation/components/PageTable";
  import OrganizationSelect from "@/views/collocation/components/OrganizationSelect";
  import StoreSelect from "@/views/collocation/components/StoreSelect";
  import TimeIntervalCheck from "@/components/TimeIntervalCheck";
  export default {
    name: 'allotOut_order',
    // 数据
    data() {
      return {
        getStoreList_data:[],
        // 查询参数
        formData: {
          // 关键字
          filter: '',
          // 单据状态
          orderStatus: '',
          // 门店名称
          outStoreId: '',
          // 时间
          startTime: '',
          endTime: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: [
          {name: '待发货', id: 0},
          {name: '待收货', id: 2},
          {name: '已完成', id: 3},
          {name: '已作废', id: 4}
        ],
        // 仓库收货状态
        receiveStatus: [
          {name: '未到货', id: 7},
          {name: '部分到货', id: 8},
          {name: '全部到货', id: 9},
          {name: '超收', id: 10}
        ],
        // 表格数据
        tableData: {},
        // 选中的表格数据
        checkedTableData: []
      }
    },
    // 组件
    components: {
      codeSet,
      PageTable,
      OrganizationSelect,
      StoreSelect,
      TimeIntervalCheck
    },
    created(){
      this.getStoreList();
      // 删除子页面的门店缓存
      sessionStorage.removeItem('BACK_GOODS_INFO');
      // 获取模块id
      // this.formData.menuId = this.$route.meta.currentid;
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getTableData();
      })
    },
    // 方法
    methods: {
      //导出
      exportExcel() {
        if(this.checkedTableData.length === 0){
         this.checkedTableData = this.tableData.data;
        }
        require.ensure([], () => {
          let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "调出单号",
            "单据状态",
            "调出方名称",
            "SKU种类数",

            "应发总件数",
            "实发数量",
            "实发货值",
            "物流公司",

            "物流单号",
            "发货时间",
            "生成时间",
            "调拨单号"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "orderSn",
            "_orderStatus",
            "outStoreName",
            "goodsQuantity",

            "quantity",
            "shipmentsQty",
            "amountCopy",
            "logisticsCompany",

            "logisticsOrderSn",
            "shipmentsTime",
            "_createTime",
            "orderSn"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.checkedTableData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "调出单列表");
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      /**
       * 查询门店列表
       */
      getStoreList() {
        const that = this;

        this.request(
        that.api.store.storeBasic_list
        ).then(res => {
          that.getStoreList_data = res;
        });
      },
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getTableData();
      },
      // 获取列表数据
      getTableData(){
        this.request(this.api.scb.allocateOutOrder_list, this.formData).then(data => {
          this.initTableData(data.data);
          this.tableData = data
        });
      },
      // 初始化数据 导出使用
      initTableData(data){
        if(data && data.length){
          data.forEach(item => {
            item._orderStatus = this.statusToName(item.orderStatus);
            item._storeType = this.$options.filters.codeToName("STO001", item.storeType);
            item._totalPrice = '￥' + item.totalPrice;
            item._receiveStatus = this.receiveStatusToName(item.receiveStatus);
            item.shipmentsTime = this.$options.filters.timestampToTime(item.shipmentsTime);
            item._createTime = this.$options.filters.timestampToTime(item.createTime);
            item.amonut = item.amonut == null ? '--' : item.amonut;
            // item.amonut = item.amonut.toFixed(2);
          })
        }
      },
      // 获取表格选中的
      tableCheckChange(val){
        this.checkedTableData = val;
      },
      // 初始查询条件
      initFormData(){
       Object.assign(this.formData, {
          // 关键字
          filter: '',
          // 单据状态
          orderStatus: '',
          // 门店名称
          outStoreId: '',
          // 时间
          startTime: '',
          endTime: '',
          pageIndex: 1,
          pageSize: 10
        })
      },
      // 查看 编辑
      seeAndEditItem(row, type){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/order/allotOut_order_detail',
          query: {
            id: row.id,
            orderSn: row.orderSn,
            type: type
          }
        });
      },
      // 作废
      delItem(row){
        this.$confirm('作废后该单据将失效，是否要将该单据作废？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.order.returnGoods_cancel, {id: row.id}).then(data => {
            this.$notify.success({ title: '成功',message: '作废成功'});
            this.getTableData();
          });
        }).catch(() => {
        });
      },
      // 新增
      addItem(){
        
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
      },
      //
      receiveStatusToName(val){
        if(!val && val !== 0) return;
        let item = this.receiveStatus.find(item => {
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
