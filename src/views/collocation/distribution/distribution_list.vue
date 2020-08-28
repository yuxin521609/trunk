<style lang="less" scoped></style>
<template>
  <div class="distribution">
    <div class="item-margin">
      <el-form class="item-form" :model="formData" label-width="90px" size="small" ref="formData" inline>
        <el-form-item label="综合搜索：" prop="searchWords">
          <el-input class="input-w-2" placeholder="配货单号/收货人/收货地址/配货人" v-model="formData.searchWords"></el-input>
        </el-form-item>
        <el-form-item label="单据状态：" prop="allotStatus">
          <el-select placeholder="请选择" class="input-w" v-model="formData.allotStatus" clearable>
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
        <!--<el-form-item label="所在地区：" prop="addressCode">
          <division v-model="formData.addressCode" :level="2" :is-search="true" width-class="input-w"></division>
        </el-form-item>-->
        <el-form-item label="配货机构：" prop="organizationId">
          <organization-select v-model="formData.organizationId"></organization-select>
        </el-form-item>
        <time-interval-check :form-data="formData"></time-interval-check>
        <el-form-item>
          <el-button @click="searchTableData" type="primary" plain>搜索</el-button>
          <el-button @click="initFormData" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="item-margin item-cont">
      <div>
        <el-button size="small" type="primary" @click="addItem" v-if="flagType">新增</el-button>
        <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      </div>
      <page-table :form-data="formData" :get-data="getTableData" :table-data="tableData">
        <el-table :data="tableData.data" style="width: 100%" row-key="id" @selection-change="tableCheckChange" id="table-data">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="allotNum" label="配货单号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_allotStatus" label="单据状态"></el-table-column>
          <el-table-column prop="storeName" label="门店名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_storeType" label="门店类型" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="receiveMan" label="收货人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="phone" label="收货人电话" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_addressInfo" label="收货地址" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_totalPrice" label="配货总金额"></el-table-column>
          <el-table-column prop="warehouseName" label="出库仓库" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allotMan" label="配货人" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="_createTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="organizationName" label="配货机构" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeAndEditItem(scope.row, 'see')">查看</el-button>
<!--              <el-button type="text" size="small" @click="seeAndEditItem(scope.row, 'edit')" v-if="scope.row.allotStatus === 0">编辑</el-button>-->
              <el-button type="text" size="small" @click="delItem(scope.row)" v-if="scope.row.allotStatus === 0 && flagType">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </div>
</template>
<script>
  import division from "@/components/division";
  import PageTable from "@/views/collocation/components/PageTable";
  import OrganizationSelect from "@/views/collocation/components/OrganizationSelect";
  import StoreSelect from "@/views/collocation/components/StoreSelect";
  import TimeIntervalCheck from "@/components/TimeIntervalCheck";
  import { mapActions } from 'vuex'
  import keepAliveMixin from "@/mixins/keepAliveMixin";
  export default {
    name: 'distribution_list',
    mixins: [keepAliveMixin],
    // 组件
    components: {
      division,
      PageTable,
      OrganizationSelect,
      StoreSelect,
      TimeIntervalCheck
    },
    // 数据
    data() {
      return {
        flagType: true,
        // 查询参数
        formData: {
          // 页面模块ID
          menuId: '',
          // 区分调用地方  0 门店  1 订单中心和智能搭配
          requestLocation: 1,
          // 单据状态
          allotStatus: '',
          // 门店
          storeId: '',
          // 仓库
          organizationId: '',
          // 地区
          addressCode: '',
          // 时间
          createTimeBegin: '',
          createTimeEnd: '',
          // 关键字
          searchWords: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 单据状态
        billType: this.$common.getBillType('allot'),
        // 表格数据
        tableData: {},
        // 选中的表格数据
        checkedTableData: []
      }
    },
    created(){
      // 删除子页面的门店缓存
      sessionStorage.removeItem('DISTRIBUTION_INFO');
      // 获取模块id
      this.formData.menuId = this.$route.meta.currentid;
      // 控制台的零售门店进来的时候
      if(this.$route.path === '/store/distribution/distribution_list'){
        this.formData.requestLocation = 0;
        this.flagType = false
      }
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
      ...mapActions({
        cachedViewAdd: 'cachedViews/cachedViewAdd'
      }),
      //导出
      exportExcel() {
        if(this.checkedTableData.length === 0){
          this.$notify.error({ title: '错误',message: '请选择数据'});
          return
        }
        require.ensure([], () => {
          let { export_json_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "配货单号",
            "单据状态",
            "门店名称",
            "门店类型",
            "收货人",
            "收货人电话",
            "收货地址",
            "配货总金额",
            "出库仓库",
            "配货人",
            "创建时间",
            "配货机构"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "allotNum",
            "_allotStatus",
            "storeName",
            "_storeType",
            "receiveMan",
            "phone",
            "_addressInfo",
            "totalPrice",
            "warehouseName",
            "allotMan",
            "_createTime",
            "organizationName",
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.checkedTableData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "配货单");
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
        this.request(this.api.order.allotGoods_list, this.formData).then(data => {
          this.initTableData(data.data);
          this.tableData = data
        });
      },
      // 初始化数据 导出使用
      initTableData(data){
        if(data && data.length){
          data.forEach(item => {
            item._allotStatus = this.statusToName(item.allotStatus);
            item._storeType = this.$options.filters.codeToName("STO001", item.storeType);
            item._addressInfo = item.provinceName + item.cityName + item.areaName + item.addressInfo;
            item._totalPrice = '￥' + item.totalPrice;
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
      // 查看 编辑
      seeAndEditItem(row, type){
        let module = '/' + this.$route.path.split('/')[1];
        // 跳转详情
        this.$router.push({
          path: module + '/distribution/distribution_details',
          query: {
            id: row.id,
            allotNum: row.allotNum,
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
          this.request(this.api.order.allotGoods_cancel, {id: row.id}).then(data => {
            this.$notify.success({ title: '成功',message: '作废成功'});
            this.getTableData();
          });
        }).catch(() => {
        });
      },
      // 新增
      addItem(){
        let module = '/' + this.$route.path.split('/')[1];
        this.$router.push({
          path: module + '/distribution/distribution_add'
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
