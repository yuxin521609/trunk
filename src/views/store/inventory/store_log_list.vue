<template>
   <div>
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <el-form-item label="商品编码：">
               <el-input v-model="filtersData.filter" @keyup.enter.native="handleSearch" clearable placeholder="请输入商品款号/货号"></el-input>
            </el-form-item>
            <el-form-item label="门店名称：">
              <el-select v-model="filtersData.storeId" clearable filterable>
                 <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="隶属机构：">
               <tree-dept
                  type="0"
                  v-model="filtersData.relationDepId"
                  val-type="id"
                  :default-expand-all="true"
                  ref="organizationName"
                ></tree-dept>
            </el-form-item>
            <el-form-item label="出入库类型：">
               <el-select v-model="filtersData.stockType" clearable>
                  <el-option v-for="(item, index) in stock_type_list" :label="item" :key="index" :value="index"></el-option>
               </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="出入库时间：" prop="createTimeBegin">
            <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.startTime" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="createTimeEnd">
               <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.endTime" type="date" placeholder="结束日期"></el-date-picker>
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
            :data="getList_data.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            @selection-change="tableCheckChange"
            :highlight-current-row="true">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品款号" min-width="70">
               <template  slot-scope="scope">{{ scope.row.productCode || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品货号" min-width="70">
               <template  slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品图片" min-width="60">
               <template  slot-scope="scope"><img class="tabImg" :src="scope.row.image" alt=""></template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="数量" min-width="50">
               <template  slot-scope="scope">{{ scope.row.quantity }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="出入库类型" min-width="70">
               <template  slot-scope="scope">{{ scope.row.stockTypeName }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="门店名称" min-width="60">
               <template  slot-scope="scope">{{ scope.row.storeName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="隶属机构" min-width="60">
               <template  slot-scope="scope">{{ scope.row.relationDepNmae || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="操作人" min-width="60">
               <template  slot-scope="scope">{{ scope.row.updateName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="出入库时间" min-width="70">
               <template  slot-scope="scope">{{ scope.row.createTime }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="源单据号" min-width="90">
               <template  slot-scope="scope">{{ scope.row.sourceNumber }}</template>
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
   name:'store_log_list',
   data() {
      return{
         // 选中的表格数据
         checkedTableData: [],
         // 出库类型
         stock_type_list:{
            0:'配货入库',
            1:'返货出库',
            2:'盘盈入库',
            3:'盘亏出库',
            4:'销售出库',
            6:'退货入库',
            7:'调拨出库',
            8:'调拨入库',
            9:'采购入库'
         },
         // data数据
         getList_data:{},
         // 获取门店信列表
         getStoreList_data:[],
         formInline:{
            user: '',
            region: ''
         },
         filtersData: {
            "filter": "",
            "storeId": "",
            "stockType":"",
            "relationDepId":"",
            "startTime":"",
            "endTime":"",
            "pageIndex": 1,
            "pageSize": 10,
            direction:'DESC',
            orderBy:'createTime'
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
      exportExcel() {
        if(this.checkedTableData.length === 0){
          this.$notify.error({ title: '错误',message: '请选择数据'});
          return
        }
        require.ensure([], () => {
          let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "商品款号",
            "商品货号",
            "商品图片",
            "数量",
            "出入库类型",
            "门店名称",
            "隶属机构",
            "操作人",
            "出入库时间",
            "源单据号"
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "productCode",
            "goodsCode",
            "image",
            "quantity",
            "stockTypeName",
            "storeName",
            "relationDepNmae",
            "updateName",
            "createTime",
            "sourceNumber",
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.checkedTableData; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "商品出入库日志列表");
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
      timeRedact(id) {
         this.href('store/inventory/sendBck_order_detail',{
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
         that.api.store.storeStockRecords_list,
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
            "storeId": "",
            "stockType":"",
            "relationDepId":"",
            "startTime":"",
            "endTime":"",
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
   .tabImg{
      width: 50px;
      height: 50px;
   }
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
