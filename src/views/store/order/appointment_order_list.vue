<template>
   <div>
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <!-- 模糊查询 -->
            <el-form-item label="模糊查询：">
               <el-input v-model="filtersData.searchKey" @keyup.enter.native="handleSearch" clearable style="width:310px;" placeholder="预约单号/客户姓名/客户电话/预约电话/服务人员"></el-input>
            </el-form-item>
            <el-form-item label="所属门店：">
              <el-select v-model="filtersData.storeId" clearable filterable>
                 <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：" prop="startDate">
               <el-date-picker  v-model="filtersData.startTime" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
               <el-date-picker  v-model="filtersData.endTime" type="date" placeholder="结束日期"></el-date-picker>
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
            :data="consumerReservationOrder_listObj.data"
            stripe
            empty-text="暂无数据"
            @selection-change="tableCheckChange"
            header-align="center"
            header-row-class-name="item-table-header"
            :highlight-current-row="true">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="预约单号" min-width="200">
               <template  slot-scope="scope">{{ scope.row.orderSn || '--' }}<span class="warningType" v-if="false"  :style="{color:scope.row.alarmColor}">新</span></template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="状态" min-width="90">
               <template  slot-scope="scope">{{ scope.row.businessStatus }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="是否搭配" min-width="90">
               <template  slot-scope="scope">{{ scope.row.valid }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="客户姓名" min-width="90">
               <template  slot-scope="scope">{{ scope.row.userName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="客户电话" min-width="90">
               <template  slot-scope="scope">{{ scope.row.a || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="预约电话" min-width="120">
               <template  slot-scope="scope">{{ scope.row.mobile || '--' }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="left" label="预约门店" min-width="200">
               <template  slot-scope="scope">{{ scope.row.storeName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="关联内容" min-width="70">
               <template  slot-scope="scope">{{ scope.row.fit || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="服务人员" min-width="77">
               <template  slot-scope="scope">{{ scope.row.operatorName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="关联订单" min-width="80">
               <template  slot-scope="scope">{{ scope.row.associationOrderSn || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="所属机构" min-width="80">
               <template  slot-scope="scope">{{ scope.row.organization || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="创建时间" min-width="160">
               <template  slot-scope="scope">{{ scope.row.createTime  }}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
               fixed="right"
               label-class-name="text-left"
               class-name="text-left"
               align="left"
               label="操作"
               width="150">
               <template slot-scope="scope">
                  <el-button type="text" @click="timeRedact(scope.row.orderSn)" size="small">查看</el-button>
                  <el-button type="text" v-if="!(scope.row.businessStatus == '已取消' || scope.row.businessStatus == '已完成')" size="small" @click="open(scope.row.orderSn)">取消</el-button>
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
               :total="consumerReservationOrder_listObj.totalCount"
            ></el-pagination>
         </div>
      </div>
      <!-- 列表 -->
   </div>
</template>
<script>
import axios from 'axios'
import {getToken} from '@/utils/auth'
import codeSet from '@/components/codeSet'
import treeDept from '@/components/treeDept'
import { filter } from 'minimatch';
import { get } from 'http';

let token=getToken()

export default {
   name:'appointment_order_list',
   data() {
      return{
         inputValue:'',
         orderStatus:{
            '0901':'待试穿',
            '0902':'已完成',
            '0903':'待试穿',
            '15':'已取消'
         },
         orderType:{
            20001:'量体预约单',
            20002:'定制订单',
         },
         consumerReservationOrder_listObj:{},
         getStoreList_data:{},
         // 选中的表格数据
         checkedTableData: [],
         formInline:{
            user: '',
            region: ''
         },
         filtersData:{
            startTime:'',
            endTime:'',
            pageIndex: 1, //当前页码
            pageSize: 10, //每页数量
            orderType:'09',
            storeId:'',
            searchKey:"",// 关键词
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

      this.consumerReservationOrder_list();
      this.getStoreList();

   },
   activated() {
      this.consumerReservationOrder_list();
   },
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
            "预约单号",
            "状态",
            "是否搭配",
            "客户姓名",
            "客户电话",
            "预约电话",
            "预约门店",
            "关联内容",
            "服务人员",
            "关联订单",
            "所属机构",
            "创建时间"
            ];
            // 上面设置Excel的表格第一行的标题
            let filterVal = [
            "orderSn",
            "businessStatus",
            "valid",
            "userName",
            "a",
            "mobile",
            "storeName",
            "fit",
            "operatorName",
            "associationOrderSn",
            "organization",
            "createTime",
            ];
            // 上面的index、nickName、name是tableData里对象的属性
            let list = this.checkedTableData; //把data里的tableData存到list
            let data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "零售门店信息列表");
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
       *
       */
      fnDialogTableVisible() {
         console.log(this.ls)
         this.workOrderPoolAssign();
         this.dialogTableVisible = false;
      },
      /**
       *
       */
      timeRedact(orderSn) {
         this.href('/order/appointment_order_detail',{
            orderSn:orderSn
         })
      },
      // 点击页数
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.consumerReservationOrder_list();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.consumerReservationOrder_list();
      },
      /**
       * 查询列表
       */
      consumerReservationOrder_list(pageIndex, pageSize) {
         const that = this;

         this.request(
            that.api.order.consumerReservationOrder_list,
            this.filtersData
         ).then(res => {
            that.consumerReservationOrder_listObj = res;
            // 处理数据，导出数据用
            res.data.forEach((item, index) => {
               // 是否搭配
               item.valid = item.valid ? '已搭配' : '搭配中';
               // 状态
               item.businessStatus = this.orderStatus[item.businessStatus];
               // 创建时间
               item.createTime = this.$options.filters.timestampToTime(item.createTime);
            });
         });
      },
      /**
       * 格式化工单时间段
       * @param { String } str 需要转换的字符串 如：'1-0-1-0'
       * @return { String } str 如：'01-00-01-00'
       */
      formattingTime(str) {
         let arr = str.split('-');
         return `${this.replenishZero(arr[0])}天${this.replenishZero(arr[1])}时${this.replenishZero(arr[2])}分${this.replenishZero(arr[3])}秒`;
      },
      /**
       * 补零函数
       * @param { Nunber | String } item 数字或数字字符串 如： 1，'1'
       * @return { String } 如：'01'
       */
      replenishZero(item) {
         item = parseInt(item);

         return item < 10 ? `0${item}` : item;
      },
      /**
       * 跳转预约单详情
       */
      href(routeName, param) {
         let module = this.$route.path.split('/')[1];

         this.$router.push({
            path: '/' + module + routeName,
            query: param
         })
      },
      /**
       * 删除工单
       */
      open(orderSn) {
         const that = this;
        this.$confirm('确定要取消吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.request(
             that.api.order.obsoleteReservationOrderBy_logicDelete,
             {
               orderSn
             }
          ).then(res => {
             this.$message({
               type: 'succeed',
               message: '取消成功！'
            });
            that.consumerReservationOrder_list();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消！'
          });
        });
      },
      /**
       * 模糊搜索
       */
      handleSearch() {
         this.filtersData.pageIndex = 1;
         this.consumerReservationOrder_list();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
         Object.assign(this.filtersData,{
            startTime:'',
            endTime:'',
            pageIndex: 1, //当前页码
            pageSize: 10, //每页数量
            orderType:'09',
            storeId:'',
            searchKey:"",// 关键词
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
