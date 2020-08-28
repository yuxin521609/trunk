<style lang="less" scoped></style>
<template>
  <div class="receive-goods-list">
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="模糊查询：" prop="searchWords">
          <el-input class="input-w-2" placeholder="收货单号/收货人/收货地址/配货人" v-model="formData.searchWords"></el-input>
        </el-form-item>
        <el-form-item label="收货门店：" prop="storeId">
          <store-select v-model="formData.storeId"></store-select>
        </el-form-item>
        <el-form-item label="收货状态：" prop="receiveStatus">
          <el-select placeholder="请选择" class="input-w" v-model="formData.receiveStatus" clearable>
            <el-option
                v-for="item in billType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据来源：" prop="sourceType">
          <el-select placeholder="请选择" class="input-w" v-model="formData.sourceType" clearable>
            <el-option
                v-for="item in sourceTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="createTimeBegin">
          <el-date-picker v-model="formData.createTimeBegin" type="date" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="createTimeEnd">
          <el-date-picker v-model="formData.createTimeEnd" type="date" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="收货时间：" prop="receiveTimeBegin">
          <el-date-picker v-model="formData.receiveTimeBegin" type="date" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="receiveTimeEnd">
          <el-date-picker v-model="formData.receiveTimeEnd" type="date" placeholder="结束日期"></el-date-picker>
        </el-form-item>
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
        <el-table :data="tableData.data" style="width: 100%" row-key="id" @selection-change="tableCheckChange">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="receiveNum" label="收货单号" width="170"></el-table-column>
          <el-table-column prop="_receiveStatusName" label="收货状态"></el-table-column>
          <el-table-column prop="storeName" label="收货门店" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_addressInfo" label="收货地址" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="planNum" label="应收件数" width="80"></el-table-column>
          <el-table-column prop="realityNum" label="实收件数" width="80"></el-table-column>
          <el-table-column prop="receiveMan" label="收货人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_receiveTime" label="收货时间" width="170" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allotNum" label="配货单号" width="200"></el-table-column>
          <el-table-column prop="allotMan" label="配货人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_allotTime" label="配货时间" width="170"></el-table-column>
          <el-table-column prop="_sourceType" label="单据来源" width="170"></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeItem(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </div>
</template>
<script>
  import PageTable from "@/views/collocation/components/PageTable";
  import StoreSelect from "@/views/collocation/components/StoreSelect";
  import keepAliveMixin from "@/mixins/keepAliveMixin";
  export default {
    name: 'receive_goods_list',
    mixins: [keepAliveMixin],
    // 数据
    data() {
      return {
        // 查询参数
        formData: {
          // 单据状态
          receiveStatus: '',
          // 单据来源
          sourceType: '',
          // 门店
          storeId: '',
          // 时间
          createTimeBegin: '',
          createTimeEnd: '',
          // 门店收货开始时间
          receiveTimeBegin:'',
          // 门店收货结束时间
          receiveTimeEnd:'',
          // 关键字
          searchWords: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: this.$common.getBillType('receive'),
        // 表格数据
        tableData: {},
        // 选中的表格数据
        checkedTableData: [],
        sourceTypeList: [
          {name: '配货到货', id: 0},
          {name: '采购到货', id: 1},
          {name: '调拨到货', id: 2}
        ]
      }
    },
    // 组件
    components: {
      PageTable,
      StoreSelect
    },
    created(){

    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getTableData();
      })
    },
    // 方法
    methods: {
      // keepAlive 返回初始化
      activatedInit(){
        this.getTableData();
      },
      //导出
      exportExcel() {
        if(this.checkedTableData.length === 0){
          this.$notify.error({ title: '错误',message: '请选择数据'});
          return
        }
        require.ensure([], () => {
          let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "收货单号",
            "收货状态",
            "收货门店",
            "收货地址",
            "应收件数",
            "实收件数",
            "收货时间",
            "配货单号",
            "配货人",
            "配货时间",
            "单据来源"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "receiveNum",
            "_receiveStatusName",
            "storeName",
            "_addressInfo",
            "planNum",
            "realityNum",
            "_receiveTime",
            "allotNum",
            "allotMan",
            "_allotTime",
            "_sourceType",
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
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getTableData();
      },
      // 获取列表数据
      getTableData(){
        this.request(this.api.retailStore.receiveGoods_list, this.formData).then(data => {
          // 初始化数据
          this.initTableData(data.data);
          console.log(data);
          this.tableData = data
        });
      },
      // 初始化数据 导出使用
      initTableData(data){
        if(data && data.length){
          data.forEach(item => {
            item._receiveStatusName = this.statusToName(item.receiveStatus);
            item._sourceType = this.sourceTypeToName(item.sourceType);
            if(item.provinceName && item.cityName && item.areaName && item.addressInfo){
              item._addressInfo = item.provinceName + item.cityName + item.areaName + item.addressInfo;
            }else {
              item._addressInfo = ''
            }
            item._receiveTime = this.$options.filters.timestampToTime(item.receiveTime);
            item._allotTime = this.$options.filters.timestampToTime(item.allotTime);
          })
        }
      },
      tableCheckChange(val){
        this.checkedTableData = val;
      },
      // 初始查询条件
      initFormData(){
        this.$refs.formData.resetFields();
      },
      // 查看 编辑
      seeItem(row){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/receive_goods/receive_goods_details',
          query: {
            id: row.id,
            receiveNum: row.receiveNum
          }
        });
      },
      // 订单状态转name
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
      // 单据来源状态转name
      sourceTypeToName(val){
        if(!val && val !== 0) return;
        let item = this.sourceTypeList.find(item => {
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
