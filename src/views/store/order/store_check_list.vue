<template>
   <div>
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <el-form-item label="模糊查询：">
               <el-input v-model="filtersData.fuzzyQuery" @keyup.enter.native="handleSearch" style="width:310px;" placeholder="盘点单号"></el-input>
            </el-form-item>
            <el-form-item label="是否确认：">
              <el-select v-model="filtersData.checkOrderStatus" clearable>
                 <el-option v-for="(item, index) in notarize_list" :label="item.name" :key="index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属门店：">
              <el-select v-model="filtersData.storeId" clearable filterable>
                 <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="隶属机构：">
               <tree-dept
                  type="0"
                  v-model="filtersData.organization"
                  val-type="id"
                  :default-expand-all="true"
                  ref="organizationName"
                ></tree-dept>
            </el-form-item>
            <br/>
            <el-form-item label="盘点时间：" prop="createTimeBegin">
            <el-date-picker v-model="filtersData.startDate" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="createTimeEnd">
               <el-date-picker v-model="filtersData.endDate" type="date" placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- 搜索，重置 -->
            <el-form-item>
               <el-button @click="handleSearch" type="primary" plain size="small">搜索</el-button>
               <el-button @click="handleResetFilters" size="small">重置</el-button>
            </el-form-item>
         </el-form>
      </div>
      <!-- 模糊搜索 -->
      <!-- 工单列表 -->
      <div class="box">
         <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
         <el-table
            :data="getList_data.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            @selection-change="tableCheckChange"
            :highlight-current-row="true">
            <el-table-column
               type="selection"
               width="55">
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="盘点单号" min-width="80">
               <template  slot-scope="scope">{{ scope.row.checkOrderNum || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="是否确认" min-width="60">
               <template  slot-scope="scope">{{ scope.row.checkOrderStatus ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="门店名称" min-width="80">
               <template  slot-scope="scope">{{ scope.row.storeName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="隶属机构" min-width="60">
               <template  slot-scope="scope">{{ scope.row.organization || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="确认人" min-width="60">
               <template  slot-scope="scope">{{ scope.row.confirmPerson || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="盘点时间" min-width="100">
               <template  slot-scope="scope">{{ scope.row.startTime }}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
               fixed="right"
               label-class-name="text-left"
               class-name="text-left"
               align="left"
               label="操作"
               width="180">
               <template slot-scope="scope">
                  <el-button type="text" @click="timeRedact(scope.row)" size="small">查看</el-button>
                  <el-button type="text" @click="exportExcel(scope.row)" size="small">导出盘点报告</el-button>
               </template>
            </el-table-column>
         </el-table>
         <div class="pagination mt-10 mb-20">
            <!-- 分页 -->
            <el-pagination
               class="mr-20"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="filtersData.pageIndex"
               :page-sizes="[10,20,30,40,50]"
               :page-size="filtersData.pageSize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="getList_data.totalCount"
            ></el-pagination>
         </div>
      </div>
      <!-- 工单列表 -->
   </div>
</template>
<!-- 工单池 -->
<script>
import axios from 'axios'
import {getToken} from '@/utils/auth'
import codeSet from '@/components/codeSet'
import treeDept from '@/components/treeDept'
import { filter } from 'minimatch';
import { get } from 'http';

let token=getToken()

export default {
   name:'store_check_list',
   data() {
      return{
         // 订单状态
         orderStatus:{
            101:'未完成',
            102:'已完成',
            103:'已关闭'
         },
         // 订单商品类型
         OrderProductType:{
            0:'服装商品',
            1:'虚拟商品'
         },
         // 订单商品类型
         PaymentWayCode:{
            1:'线下付款',
            2:'微信付款',
            3:'信用卡'
         },
         // 支付状态
         PaymentStatus:{
            201:'未支付',
            202:'已支付'
         },
         notarize_list:[{
            id:0,
            name:'否'
         },{
            id:1,
            name:'是'
         }],
         // data数据
         getList_data:{},
         // 选中的表格数据
         checkedTableData: [],
         // 获取门店信列表
         getStoreList_data:[],
         formInline:{
            user: '',
            region: ''
         },
        filtersData: {
            "fuzzyQuery": "",
            "storeId": "",
            "organization":"",
            "checkOrderStatus":"",
            "startDate":"",
            "endDate":"",
            "orderBy": "endTime",
            "pageIndex": 1,
            "pageSize": 10
         },
         // 门店列表请求参数
         filtersDataStore:{
            pageIndex: '',// 当前页码
            pageSize: '',// 每页数量
            name:'',// 门店名称
            organizationId:'',// 隶属机构
            businessStatus:'',// 营业状态
            type:'',// 门店类型
            createBegin:'',// 创建时间开始
            createEnd:''// 创建时间结束
         },
         value: '',
         storageValArr:[],
         // 指派单选框
         radio: '1',
         // 指派
         gridData: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
   },
   created() {
      const that = this;

      this.getList();
      this.getStoreList();

   },
   activated() {
      this.getList();
   },
   methods: {
      //导出
      exportExcel(item) {
         if(this.checkedTableData.length === 0){
            this.$notify.error({ title: '错误',message: '请选择数据'});
            return
         }
         require.ensure([], () => {
            let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
            let tHeader = [
            "盘点单号",
            "是否确认",
            "门店名称",
            "隶属机构",
            "确认人",
            "盘点时间"
            ];
            // 上面设置Excel的表格第一行的标题
            let filterVal = [
            "checkOrderNum",
            "checkOrderStatus",
            "storeName",
            "organization",
            "confirmpersonId",
            "startTime"
            ];
            // 上面的index、nickName、name是tableData里对象的属性
            let list = this.checkedTableData; //把data里的tableData存到list
            let data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "盘点单列表");
         });
      },
      formatJson(filterVal, jsonData) {
         return jsonData.map(v => filterVal.map(j => v[j]));
      },
      tableCheckChange(val){
         this.checkedTableData = val;
      },
      /**
       *
       */
      fnDialogTableVisible() {
         console.log(this.ls)
         this.workOrderPoolAssign();
         this.dialogTableVisible = false;
      },
      /**
       * 查看
       */
      timeRedact(item) {
         this.href('/order/store_check_detail',{
            id:item.id
         })
      },
      // 点击页数
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.getList();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getList();
      },
      /**
       * 查询门店销售订单列表
       */
      getList() {
         const that = this;

         this.request(
         that.api.store.checkStockOrder_getListForOrderCenter,
         this.filtersData
         ).then(res => {
            that.getList_data = res;
            // 处理数据，导出数据用
            res.data.forEach((item, index) => {
               // 创建时间
               item.startTime = this.$options.filters.timestampToTime(item.startTime);
            });
         });
      },
      /**
       * 查询门店列表
       */
      getStoreList() {
         const that = this;

         this.request(
         that.api.store.storeBasic_list,
         this.filtersDataStore
         ).then(res => {
            that.getStoreList_data = res;
         });
      },
      /**
       * 跳转工单详情
       */
      href(routeName, param) {
         let module = this.$route.path.split('/')[1];

         this.$router.push({
            path: '/' + module + routeName,
            query: param
         })
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
            "fuzzyQuery": "",
            "storeId": "",
            "organization":"",
            "checkOrderStatus":"",
            "startDate":"",
            "endDate":"",
            "orderBy": "",
            "pageIndex": 1,
            "pageSize": 10
         });
      },
   },
   components:{
      codeSet,
      treeDept
   }
}
</script>
<style  lang="less" scoped>
   .box{
      margin: 8px;
      padding: 20px;
      background: #fff;
   }
   .blueness{
      color: #1E90FF;
   }
   .warningType{
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
   .color{
      background: #FF6347;
   }
   h5 {
     color: #222;
     margin-left: -15px;
   }
   .test {
     color: #9d9d9d;
   }
</style>
