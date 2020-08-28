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
            <el-form-item label="折扣类型：">
               <el-select v-model="filtersData.type" clearable placeholder="请选择">
                  <el-option v-for="(item, index) in discountType" :key="index" :label="item" :value="index"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="适用门店：" prop="storeId">
               <el-select 
               clearable 
               filterable 
               v-model="filtersData.storeName" 
               class="el-input-short">
               <el-option v-for="(item, index) in storeList.data" :key="index" :label="item.name" :value="item.name"></el-option>
               </el-select>
            </el-form-item>
            <!-- 搜索，重置 -->
            <el-form-item>
               <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
               <el-button size="small" @click="handleResetFilters">重置</el-button>
            </el-form-item>
         </el-form>
      </div>
      <!-- 模糊搜索 -->
      <!-- 列表 -->
      <div class="box">
         <el-button size="small" type="primary" class="ml-20 mt-24" @click="href('market/discount/discount_order_add')">创建折扣</el-button>
         <el-table
               class="mt-20"
            :data="discountData.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            :highlight-current-row="true">
            <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="折扣类型" min-width="100">
               <template  slot-scope="scope">{{ discountType[scope.row.type] }}</template>
            </el-table-column>
               <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="折扣力度" min-width="100">
               <template  slot-scope="scope">{{ scope.row.discountValueStr }}</template>
            </el-table-column>
               <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="适用门店" min-width="100">
               <template  slot-scope="scope">{{ scope.row.storeName  }}</template>
            </el-table-column>
               <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="适用范围" min-width="100">
               <template  slot-scope="scope">{{ scope.row.scope  }}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
               fixed="right"
               label-class-name="text-center"
               class-name="text-center"
               align="center"
               label="操作"
               width="180">
               <template slot-scope="scope">
                  <el-button type="text" size="small" @click="fastCreate(scope.row)">快速创建</el-button>
                  <el-button type="text" size="small" @click="timeRedact(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="removeDiscount(scope.row)">删除</el-button>
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
               :total="discountData.totalCount"
            ></el-pagination>
         </div>
      </div>
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
   name:'discount_manage_list',
   data() {
      return{
         // 折扣列表
         discountData:[],
         data_obj:{},
         // 折扣类型
         discountType:[
            '预约折扣',
            '阶梯折扣',
            '单品折扣'
         ],
         // 门店列表
         storeList:{},
         // 检索
         filtersData:{
            pageIndex: 1,// 当前页码
            pageSize: 10,// 每页数量
            type:'',// 门店类型
            storeName:'' // 门店名称
         }
      }
   },
   created() {
      const that = this;
      this.getStoreList();
      this.marketingMiddleground_discountList();// 获取折扣列表
   },
   activated() {
      this.marketingMiddleground_discountList();
   },
   methods: {
      /**
       * 删除折扣
       */
      removeDiscount(item) {
         this.$confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(() => {
            switch(item.type) {
               case 0:
                  this.request(
                     this.api.market.marketingMiddleground_deleteDiscountSetting,
                     {
                        id:item.discountId
                     }     
                  ).then(res => {
                     this.marketingMiddleground_discountList();
                     this.warn('删除成功!');
                  });
                  break;
               case 1:
                  this.request(
                     this.api.market.marketingMiddleground_deleteDiscountParameterS,
                     {
                        id:item.discountId
                     }     
                  ).then(res => {
                     this.marketingMiddleground_discountList();
                     this.warn('删除成功!');
                  });
                  break;
               case 2:
                  this.request(
                     this.api.market.marketingMiddleground_deleteSingleProductDiscount,
                     {
                        id:item.discountId
                     }     
                  ).then(res => {
                     this.marketingMiddleground_discountList();
                     this.warn('删除成功!');
                  });
                  break;
            }
         }).catch(() => {
            this.warn('取消删除!','info');
         });
      },
      /**
       * 查询门店列表
       */
      getStoreList() {
         const that = this;

         this.request(
         that.api.store.storeBasic_list,
         {
            pricingPower:0
         },
         true
         ).then(res => {
            that.storeList = res;
         });
      },
      /**
       * 提示
       * @param { String } message 提示文案
       * @param { String } type 提示类型
       */
      warn(message, type) {
         this.$message({
         message: message,
         type: type || 'success'
         });
      },
      /**  
       * 编辑
       * @param { Object } item 当前对象
       * @param { Boolean } isRead 是否可对写
       * @property { Boolean }isEcho 是否是编辑
       * @return { Object } Obj 返回对象
       */
      timeRedact(item) {
         var Obj = {};
         this.href('market/discount/discount_order_edit',{
            isEdit:true,
            discountId:item.discountId,
            type:item.type
         })
      },
       /**  
       * 快速创建
       * @param { Object } item 当前对象
       * @param { Boolean } isRead 是否可对写
       * @property { Boolean }isEcho 是否是编辑
       * @return { Object } Obj 返回对象
       */
      fastCreate(item) {
         var Obj = {};
         this.href('market/discount/discount_order_add',{
            isFastCreate:true,
            discountId:item.discountId,
            type:item.type
         })
      },
      /**
       * 获取折扣列表
       */
      marketingMiddleground_discountList() {
         this.request(
            this.api.market.marketingMiddleground_discountList,
            this.filtersData     
         ).then(res => {
            this.discountData = res;
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
         this.filtersData.storeName = this.filtersData.storeName.replace(/(^\s)|(\s$)/g, '');
         this.marketingMiddleground_discountList();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
         Object.assign(this.filtersData,{
            pageIndex: 1,// 当前页码
            pageSize: 10,// 每页数量
            type:'',// 门店类型
            storeName:'' // 门店名称
         });
      },
      /**
       * 点击页数
       * @param { Number } pageIndex 当前页
       */
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.marketingMiddleground_discountList();
      },
      /**
       *  选择每页多少条数
       *  @param { Number } pageSize 每页条数
       */
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;  
         this.marketingMiddleground_discountList();
      },
   },
   components:{
      codeSet,
      treeDept
   },
}
</script>
<style  lang="less" scoped>
   .previewVisible-list{
      display: flex;
      flex-wrap: wrap;
      .item{
         width: 50%;
         margin-right: 0;
         text-align: right;
      }
   }
   .blueness{  
      color: #1E90FF;
   }
   h5 {
     color: #222;
     margin-left: -15px;
   }
   .test {
     color: #9d9d9d;
   }
   .box{
    padding: 20px 20px 20px 20px;
    margin: 8px 8px 20px 8px;
    background: #fff;
  }
</style>
