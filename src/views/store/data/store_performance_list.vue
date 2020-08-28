<template>
   <div>
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <el-form-item label="门店名称：">
              <el-select v-model="filtersData.id" clearable filterable>
                 <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="隶属机构：">
               <tree-dept
                  type="0"
                  v-model="filtersData.organizationId"
                  val-type="id"
                  :default-expand-all="true"
                  ref="organizationName"
                ></tree-dept>
            </el-form-item>
            <el-form-item label="查询时间：" prop="createTimeBegin">
            <el-date-picker v-model="filtersData.queryBegin"  type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="createTimeEnd">
               <el-date-picker v-model="filtersData.queryEnd"  type="date" placeholder="结束日期"></el-date-picker>
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
            @selection-change="tableCheckChange"
            header-row-class-name="item-table-header"
            :highlight-current-row="true">
            <el-table-column
               type="selection"
               width="55">
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="所在门店" min-width="70">
               <template  slot-scope="scope">{{ scope.row.storeName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="隶属机构" min-width="60">
               <template  slot-scope="scope">{{ scope.row.organizationName }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="员工数量" min-width="60">
               <template  slot-scope="scope">{{ scope.row.personNum }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="销售订单总单量" min-width="70">
               <template  slot-scope="scope">{{ scope.row.salesOrderTotalNum }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="销售订单总金额" min-width="60">
               <template  slot-scope="scope">{{ scope.row.salesOrderSumMoney }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="预约单总单量" min-width="60">
               <template  slot-scope="scope">{{ scope.row.reservationOrderTotalNum }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="预约单成交总单量" min-width="60">
               <template  slot-scope="scope">{{ scope.row.reservationOrderCompleteTotalNum }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="预约单成交比" min-width="60">
               <template  slot-scope="scope">{{ scope.row.reservationScale }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="销售退货总单量" min-width="60">
               <template  slot-scope="scope">{{ scope.row.salesReturnTotalNum }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="销售退货单总金额" min-width="70">
               <template  slot-scope="scope">{{ scope.row.salesReturnSumMoney }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="查询时间" min-width="130">
               <template  slot-scope="scope">{{ scope.row.queryTime }}</template>
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
   name:'store_performance_list',
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
         // data数据
         getList_data:{},
         // 选中的表格数据
         checkedTableData: [],
         // 获取门店信列表
         getStoreList_data:[],
         // 预警提醒列表
         "alarmSets":[
            {
               "startTime":null,
               "endTime":null,
               "warnType":null,
               "localRemind":null,
               "emailRemind":null,
               "smsRemind":null,
               "signerReceive":null,
               "adminReceive":null
            }
         ],
         priority:{
            "01":"高",
            "02":"中",
            "03":"低",
         },
         formInline:{
            user: '',
            region: ''
         },
        filtersData: {
            "id": "",
            "organizationId":"",
            "queryBegin":"",
            "queryEnd":"",
            "orderBy": "",
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
      timeRedact(id) {
         this.href('sendBck_order_detail',{
            id
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
       * 查询订单列表
       */
      getList() {
         const that = this;

         this.request(
         that.api.store.storePerformance_list,
         this.filtersData
         ).then(res => {
            that.getList_data = res;
            // 处理数据，导出数据用
            res.data.forEach((item, index) => {
               // 成交比
               item.reservationScale = item.reservationOrderTotalNum && item.reservationOrderCompleteTotalNum ? (item.reservationOrderCompleteTotalNum/item.reservationOrderTotalNum).toFixed(2)*100 + '%' : 0 ;
               // 查询时间
               item.queryTime = this.$options.filters.timestampToTime(item.queryBegin).match(/\d+-\d+-\d+/) + ' ' +this.$options.filters.timestampToTime(item.queryEnd).match(/\d+-\d+-\d+/);
            });
         });
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
            "所在门店",
            "隶属机构",
            "员工数量",
            "销售订单总单量",
            "销售订单总金额",
            "预约单总单量",
            "预约单成交总单量",
            "预约单成交比",
            "销售退货总单量",
            "销售退货单总金额",
            "查询时间",
            ];
            // 上面设置Excel的表格第一行的标题
            let filterVal = [
            "storeName",
            "organizationName",
            "personNum",
            "salesOrderTotalNum",
            "salesOrderSumMoney",
            "reservationOrderTotalNum",
            "reservationOrderCompleteTotalNum",
            "reservationScale",
            "salesReturnTotalNum",
            "salesReturnSumMoney",
            "queryTime"
            ];
            // 上面的index、nickName、name是tableData里对象的属性
            let list = this.checkedTableData; //把data里的tableData存到list
            let data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "门店业绩综合查询");
         });
      },
      formatJson(filterVal, jsonData) {
         return jsonData.map(v => filterVal.map(j => v[j]));
      },
      tableCheckChange(val){
         this.checkedTableData = val;
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
         this.$router.push({
            path: '/' + routeName,
            name: routeName,
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
            "id": "",
            "organizationId":"",
            "queryBegin":"",
            "queryEnd":"",
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
      padding: 20px;
      margin: 8px;
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
