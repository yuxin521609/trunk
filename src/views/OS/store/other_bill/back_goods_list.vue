<style lang="less" scoped></style>
<template>
  <div class="distribution">
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="综合搜索：" prop="searchWords">
          <el-input class="input-w-2" placeholder="返货单号/返货人" v-model="formData.searchWords"></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="backStatus">
          <el-select placeholder="请选择" class="input-w" v-model="formData.backStatus" clearable>
            <el-option
                v-for="item in billType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：" prop="storeId">
          <store-select v-model="formData.storeId"></store-select>
        </el-form-item>
        <el-form-item label="门店类型：" prop="storeType">
          <code-set code="STO001" v-model="formData.storeType"></code-set>
        </el-form-item>
        <time-interval-check :form-data="formData" label="创建时间"></time-interval-check>
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
          <el-table-column prop="backNum" label="返货单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_backStatus" label="单据状态"></el-table-column>
          <el-table-column prop="storeName" label="返货门店" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_storeType" label="门店类型" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="backMan" label="返货人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="organizationName" label="返货机构" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_createTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeAndEditItem(scope.row)">查看</el-button>
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
    name: 'distribution',
    // 数据
    data() {
      return {
        // 查询参数
        formData: {
          // 关键字
          searchWords: '',
          // 单据状态
          backStatus: '',
          // 门店名称
          storeId: '',
          // 门店类型
          storeType: '',
          // 时间
          createTimeBegin: '',
          createTimeEnd: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: this.$common.getBillType('storeBack'),
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
      // 删除子页面的门店缓存
      sessionStorage.removeItem('BACK_GOODS_INFO')
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
          this.$notify.error({ title: '错误',message: '请选择数据'});
          return
        }
        require.ensure([], () => {
          let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "返货单号",
            "单据状态",
            "返货门店",
            "门店类型",
            "返货人",
            "返货机构",
            "创建时间"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "backNum",
            "_backStatus",
            "storeName",
            "_storeType",
            "backMan",
            "organizationName",
            "_createTime"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.checkedTableData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "返货单");
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
        this.request(this.api.retailStore.backGoods_list, this.formData).then(data => {
          this.initTableData(data.data);
          this.tableData = data
        });
      },
      // 初始化数据 导出使用
      initTableData(data){
        if(data && data.length){
          data.forEach(item => {
            item._backStatus = this.statusToName(item.backStatus);
            item._storeType = this.$options.filters.codeToName("STO001", item.storeType);
            item._createTime = this.$options.filters.timestampToTime(item.createTime);
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
      seeAndEditItem(row){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/other_bill/back_goods_details',
          query: {
            id: row.id,
            backNum: row.backNum
          }
        });
      },
      // 状态转name
      statusToName(val){
        if(!val && val !== 0) return;
        let item = this.billType.find(item => {
          return item.id === val
        });
        return item.name;
      },

    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
