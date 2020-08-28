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
               <el-input v-model="filtersData.filter" @keyup.enter.native="handleSearch" style="width:310px;" placeholder="商品款号/商品货号/商品名称/订单号"></el-input>
            </el-form-item>
            <el-form-item label="品牌：">
               <el-select class="input-w" filterable clearable placeholder="请选择" v-model="filtersData.brandName">
                  <el-option
                     v-for="item in brandOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.name"
                  ></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="渠道客户名称：">
              <el-select v-model="filtersData.storeName" clearable filterable>
                 <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="渠道客户名称：">
              <el-select v-model="filtersData.storeName" clearable filterable>
                 <el-option v-for="(item, index) in storeList" :label="item" :key="index" :value="item"></el-option>
              </el-select>
            </el-form-item> -->
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
            :data="getList_data.dataList.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            @selection-change="tableCheckChange"
            :highlight-current-row="true">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品款号" min-width="60">
               <template  slot-scope="scope">{{ scope.row.productCode }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="货号" min-width="60">
               <template  slot-scope="scope">{{ scope.row.goodsCode }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="left" label="名称" min-width="60">
               <template  slot-scope="scope">{{ scope.row.goodsName }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品图片" min-width="60">
               <template  slot-scope="scope">
                  <img class="tableImage" :src="scope.row.image" alt="">
               </template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="颜色" min-width="60">
               <template  slot-scope="scope">{{ scope.row.color }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="规格" min-width="60">
               <template  slot-scope="scope">{{ scope.row.size }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="品牌" min-width="60">
               <template  slot-scope="scope">{{ scope.row.brandName }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="吊牌价" min-width="60">
               <template  slot-scope="scope">{{ scope.row.priceTagCopy }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="结算平均单价" min-width="60">
               <template  slot-scope="scope">{{ scope.row.priceCopy }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="未结算数量" min-width="60">
               <template  slot-scope="scope">{{ scope.row.quantity }}</template>
            </el-table-column>
            <!-- 新增 -->
            <el-table-column align="left" :show-overflow-tooltip="true" label="未结算货值" min-width="60">
               <template  slot-scope="scope">{{ scope.row.amountCopy }}</template>
            </el-table-column>
            <!-- 新增 -->
            <el-table-column align="left" :show-overflow-tooltip="true" label="渠道客户名称" min-width="60">
               <template  slot-scope="scope">{{ scope.row.storeName }}</template>
            </el-table-column>
         </el-table>
         <div class="pagination" :class="{ 'justify-content': getList_data.dataList.data && getList_data.dataList.data.length > 0 }">
            <div v-if="getList_data.dataList.data && getList_data.dataList.data.length > 0">
               累计未结算数：<span>{{ getList_data.info.totalStatistics }}</span>
               累计未结算货值：<span>{{ getList_data.info.valueStatistics }}</span>
            </div>
            <!-- 分页 -->
            <el-pagination
               class=""
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="filtersData.pageIndex"
               :page-sizes="[10,20,30,40,50]"
               :page-size="filtersData.pageSize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="getList_data.dataList.totalCount"
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
   name:'storeSell_order_list',
   data() {
      return{
         storeList:{
            0:'零时尚'
         },
         // 全部品牌
         brandOptions:[],
         // 订单状态
         orderStatus:{
            101:'未付款',
            102:'已付款',
            103:'已关闭'
         },
         // 订单商品类型
         OrderProductType:{
            0:'服装商品',
            1:'虚拟商品'
         },
         returnGoodsAllOrPartList:{
            0:'未退货',
            1:'部分退货',
            2:'全部退货'
         },
         // 支付方式
         PaymentWayCode:{
            1:'现金',
            2:'微信付款',
            3:'刷卡',
            4:'余额支付',
            5:'支付宝'
         },
         // 支付状态
         PaymentStatus:{
            201:'未支付',
            202:'已支付'
         },
         // data数据
         getList_data:{},
         // 订单数据统计
         storeRetailOrder_pcListStatistics_data:{},
         // 选中的表格数据
         checkedTableData: [],
         // 获取门店信列表
         getStoreList_data:[],
         formInline:{
            user: '',
            region: ''
         },
        filtersData: {
            "filter": "",
            "brandName": "",
            "storeName": "",
            "pageIndex":1,
            "pageSize":10,
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
      this.getBrandOptions(); // 获取品牌
      this.getList();
      this.getStoreList();

   },
   activated() {
      this.getList();
   },
   methods: {
      /**
       * 获取品牌
       */
      getBrandOptions() {
      this.request(
         this.api.product.productBrand_list,
         {},
         true
         ).then(data => {
            let _data = data.data;
            this.brandOptions = _data;
      });
      },
      // 导出
      exportExcel() {
         if (this.checkedTableData.length === 0) {
            this.checkedTableData = this.getList_data.dataList.data;
         }
         require.ensure([], () => {
         let { export_json_to_excel } = require("@/vendor/Export2Excel");
         let tHeader = [
            "商品款号",
            "货号",
            "名称",
            "商品图片",

            "颜色",
            "规格",
            "品牌",
            "吊牌价",

            "结算平均单价",
            "未结算数量",
            "未结算货值",
            "渠道客户名称"
         ];
         // 上面设置Excel的表格第一行的标题
         let filterVal = [
            "productCode",
            "goodsCode",
            "goodsName",
            "image",

            "color",
            "size",
            "brandName",
            "priceTagCopy",

            "priceCopy",
            "quantity",
            "amountCopy",
            "storeName"
         ];
         // 上面的index、nickName、name是tableData里对象的属性
         let list = this.checkedTableData; //把data里的tableData存到list
         let data = this.formatJson(filterVal, list);
         export_json_to_excel(tHeader, data, "未结算货品记录");
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
      timeRedact(id, storeId) {
         this.href('/order/storeSell_order_detail',{
            id,
            storeId
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
         that.api.scb.movingAveragePrice_datalist,
         this.filtersData
         ).then(res => {
            that.getList_data = res;
         });
      },
       /**
       * 查询门店销售订单列表
       */
      storeRetailOrder_pcListStatistics() {
         const that = this;

         this.request(
         that.api.store.storeRetailOrder_pcListStatistics,
         this.filtersData
         ).then(res => {
            that.storeRetailOrder_pcListStatistics_data = res;
         });
      },
      /**
       * 查询列表
       */
      getStoreList() {
         const that = this;

         this.request(
         that.api.store.storeBasic_listStoreBasic,
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
            "filter": "",
            "brandName": "",
            "storeName": "",
            "pageIndex":1,
            "pageSize":10,
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
   .tableImage{
      width: 45px;
      height: 45px;
   }
   .justify-content{
      justify-content: space-between;
      display: flex;
      align-items: center;
      margin-top: 20px;
      span{
         margin-right: 15px;
      }
   }
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
