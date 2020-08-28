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
            <el-form-item label="门店故事：" prop="storeId">
               <el-select 
               clearable
               filterable
               v-model="filtersData.storeStory"
               class="el-input-short">
               <el-option v-for="(item, index) in storyStatus" :key="index" :label="item.name" :value="item.id"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="客户故事：" prop="storeId">
               <el-select 
               clearable
               filterable
               v-model="filtersData.customerStory"
               class="el-input-short">
               <el-option v-for="(item, index) in storyStatus" :key="index" :label="item.name" :value="item.id"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="适用门店：" prop="storeId">
               <el-select 
               clearable
               filterable
               v-model="filtersData.id"
               class="el-input-short">
               <el-option v-for="(item, index) in storeList.data" :key="index" :label="item.name" :value="item.id"></el-option>
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
         <el-table
            class="mt-20"
            :data="discountData.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            :highlight-current-row="true">
            <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="门店名称" min-width="100">
               <template  slot-scope="scope">{{ scope.row.name  }}</template>
            </el-table-column>
            <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="门店故事" min-width="100">
               <template  slot-scope="scope">{{ scope.row.storeStory  }}</template>
            </el-table-column>
             <el-table-column prop="" align="center" :show-overflow-tooltip="true" label="客户故事" min-width="100">
               <template  slot-scope="scope">{{ scope.row.customerStory }}</template>
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
                  <el-button type="text" size="small" @click="timeRedact(scope.row)">修改</el-button>
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
               :total="discountData.totalCount"
               layout="total, sizes, prev, pager, next, jumper"
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
   name:'store_decorate_list',
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
         // 装修状态
         storyStatus:[{
            id:1,
            name:'未装修'
         },{
            id:2,
            name:'已装修'
         }],
         // 检索
         filtersData:{
            pageIndex: 1,// 当前页码
            pageSize: 10,// 每页数量
            "customerStory": null,
            "storeStory": null,
            "id": null
         }
      }
   },
   created() {
      const that = this;
      this.getStoreList();
      this.storeFitment_listBasicState();// 获取折扣列表
   },
   activated() {
      this.storeFitment_listBasicState();
   },
   methods: {
      /**
       * 查询门店列表
       */
      getStoreList() {
         const that = this;

         this.request(
         that.api.market.storeBasic_list4Feign,
         {},
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
         this.href('market/decorate/store_decorate_edit',{
            storeId:item.id,
            name:item.name,     
         })
      },
      /**
       * 获取门店故事列表
       */
      storeFitment_listBasicState() {
         this.request(
            this.api.market.storeFitment_listBasicState,
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
         this.storeFitment_listBasicState();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
         Object.assign(this.filtersData,{
            pageIndex: 1,// 当前页码
            pageSize: 10,// 每页数量
            "customerStory": null,
            "storeStory": null,
            "id": null
         });
      },
      /**
       * 点击页数
       * @param { Number } pageIndex 当前页
       */
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.storeFitment_listBasicState();
      },
      /**
       *  选择每页多少条数
       *  @param { Number } pageSize 每页条数
       */
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.storeFitment_listBasicState();
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
