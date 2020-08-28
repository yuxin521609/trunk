<template>
   <div>
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-dialog title="查看授权门店" :visible.sync="dialogTableVisible">
            <el-table :data="retailStoreUser_getStore_list">
               <el-table-column  label="门店人员姓名" align="center">
                  <template  slot-scope="scope">{{ userName }}</template>
               </el-table-column>
               <el-table-column  label="授权门店名称" align="center">
                  <template  slot-scope="scope">{{ scope.row.name }}</template>
               </el-table-column>
               <el-table-column  label="是否为该门店负责人" align="center">
                  <template  slot-scope="scope">{{ role_list[scope.row.role] }}</template>
               </el-table-column>
               <el-table-column  label="门店类型" align="center">
                  <template  slot-scope="scope">{{ scope.row.type }}</template>
               </el-table-column>
               <el-table-column  label="门店隶属机构" align="center">
                  <template  slot-scope="scope">{{ scope.row.organizationName }}</template>
               </el-table-column>
            </el-table>
         </el-dialog>
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <el-form-item label="综合搜索：">
               <el-input v-model="filtersData.filter" clearable style="width:310px;" placeholder="人员姓名/手机号码/商家端账号" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="门店名称：">
              <el-select v-model="filtersData.storeId" clearable filterable>
                 <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="创建时间：" prop="createTimeBegin">
            <el-date-picker  value-format="yyyy-MM-dd" v-model="filtersData.startTime" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="createTimeEnd">
               <el-date-picker value-format="yyyy-MM-dd"  v-model="filtersData.endTime" type="date" placeholder="结束日期"></el-date-picker>
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
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column align="left" label="人员姓名" min-width="100">
               <template  slot-scope="scope">{{ scope.row.name || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" label="商家端账号" min-width="100">
               <template  slot-scope="scope">{{ scope.row.phone || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" label="联系电话" min-width="100">
               <template  slot-scope="scope">{{ scope.row.phone }}</template>
            </el-table-column>
            <el-table-column align="left" label="已授权门店" min-width="100">
               <template  slot-scope="scope"><span @click="retailStoreUser_getStore(scope.row)" class="look">查看</span></template>
            </el-table-column>
            <el-table-column align="left" label="创建时间" min-width="100">
               <template  slot-scope="scope">{{ scope.row.createTime }}</template>
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
   name:'store_People_list',
   data() {
      return{
         // 选中的表格数据
         checkedTableData: [],
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
         role_list:{
            0:'老板',
            1:'店长',
            2:'员工'
         },
         gender_list:[{
            id:'0',
            name:'男'
         },{
            id:'1',
            name:'女'
         }],
         // data数据
         getList_data:{},
         // 获取门店信列表
         getStoreList_data:[],
         // 根据用户Id获取零售门店信息
         retailStoreUser_getStore_list:[],
         // 当前人员姓名、
         userName:'',
         formInline:{
            user: '',
            region: ''
         },
         filtersData: {
            "filter": "",
            "storeId":"",
            "pageIndex": 1,
            "pageSize": 10,
            "startTime":'',
            "endTime":''
         },
         // 检索
         filtersStoreData:{
            pageIndex: 1,// 当前页码
            pageSize: 10,// 每页数量
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
      exportExcel() {
        if(this.checkedTableData.length === 0){
          this.$notify.error({ title: '错误',message: '请选择数据'});
          return
        }
        require.ensure([], () => {
          let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "人员姓名",
            "商家端账号",
            "联系电话",
            "创建时间",
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "name",
            "phone",
            "phone",
            "createTime"
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
       * 获取人员列表
       */
      retailStoreUser_getStore(item) {
         this.dialogTableVisible = true;

         this.request(
            this.api.store.retailStoreUser_getStore,
            {
               userId:item.id
            }
         ).then(res => {
            this.retailStoreUser_getStore_list = res;
            this.userName = item.name
             // 处理数据，导出数据用
            res.forEach((item, index) => {
               // 门店类型
               item.type = this.$options.filters.codeToName("STO001", item.type);
            });
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
       * 查询列表
       */
      getList() {
         const that = this;

         this.request(
         that.api.store.user_listByStoreId,
         this.filtersData
         ).then(res => {
            that.getList_data = res;
            // 处理数据，导出数据用
            res.data.forEach((item, index) => {
               // 创建时间
               item.createTime = this.$options.filters.timestampToTime(item.createTime);
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
         this.$router.push({
            path: '/' + routeName,
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
            "filter": "",
            "storeId":"",
            "pageIndex": 1,
            "pageSize": 10,
            "startTime":'',
            "endTime":''
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
.look{
   color: #1E90FF;
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
