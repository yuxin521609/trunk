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
            <el-form-item label="门店名称：">
              <el-select v-model="filtersData.name" clearable filterable>
                 <el-option v-for="(item, index) in getStoreList_data.data" :label="item.name" :key="index" :value="item.name"></el-option>
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
            <el-form-item label="营业状态：">
               <el-select v-model="filtersData.businessStatus" clearable>
                  <el-option v-for="(item, index) in businessStatus_list" :key="index" :label="item.name" :value="item.id"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="门店类型：">
              <el-select v-model="filtersData.type" placeholder="请选择门店类型">
                <el-option :label="item.name" :value="item.code" :key="index" v-for="(item, index) in store_list"></el-option>
              </el-select>
            </el-form-item>
            <br/>
            <!-- 选择时间 -->
            <el-form-item label="创建时间：" prop="startDate">
               <el-date-picker  v-model="filtersData.createBegin" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
               <el-date-picker  v-model="filtersData.createEnd" type="date" placeholder="结束日期"></el-date-picker>
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
      <div class="item-margin">
         <div class="item-table">
            <el-button size="small" type="primary" class="ml-20 mt-24" @click="href('store/store/store_info_detail')">创建新门店</el-button>
            <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
            <el-table
                class="mt-20"
               :data="data_obj.data"
               stripe
               empty-text="暂无数据"
               header-align="center"
               header-row-class-name="item-table-header"
               @selection-change="tableCheckChange"
               :highlight-current-row="true">
               <el-table-column type="selection" width="45"></el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="门店名称" min-width="100">
                  <template  slot-scope="scope">{{ scope.row.name || '--' }}</template>
               </el-table-column>
              <el-table-column prop="" :show-overflow-tooltip="true" label="隶属机构" min-width="100">
                  <template  slot-scope="scope">{{ scope.row.organizationName || '--' }}</template>
               </el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="门店地址" min-width="130">
                  <template  slot-scope="scope">{{ scope.row._addressInfo || '' }}</template>
               </el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="门店营业状态" min-width="100">
                  <template  slot-scope="scope">{{ scope.row.businessStatus  }}</template>
               </el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="门店类型" min-width="90">
                  <template  slot-scope="scope">{{ scope.row.type }}</template>
               </el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="门店负责人" min-width="90">
                  <template  slot-scope="scope">{{ scope.row.principalName }}</template>
               </el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="门店人员数量" min-width="90">
                  <template  slot-scope="scope">{{ scope.row.personNum }}</template>
               </el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="创建人" min-width="90">
                  <template  slot-scope="scope">{{ scope.row.createName || '--' }}</template>
               </el-table-column>
               <el-table-column prop="" :show-overflow-tooltip="true" label="创建时间" min-width="100">
                  <template slot-scope="scope">
                     {{ scope.row.createTime }}
                  </template>
               </el-table-column>
               <!-- 操作 -->
               <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="130">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="hrefStoreShow(scope.row, true)">查看</el-button>
                     <el-button type="text" size="small" @click="hrefStoreEdit(scope.row)">修改</el-button>
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
                  :total="data_obj.totalCount"
               ></el-pagination>
            </div>
         </div>
      </div>
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
   name:'store_info_list',
   data() {
      return{
         data_obj:{},
         getStoreList_data:{},
         // 选中的表格数据
         checkedTableData: [],
         // 营业状态
         businessStatus_list:[{
            id:1,
            name:'营业中'
            },{
            id:0,
            name:'休息中'
         }],
         // 门店类型
         store_list:[],
         // 检索
         filtersData:{
            pageIndex: 1,// 当前页码
            pageSize: 10,// 每页数量
            name:'',// 门店名称
            organizationId:'',// 隶属机构
            businessStatus:'',// 营业状态
            type:'',// 门店类型
            createBegin:'',// 创建时间开始
            createEnd:''// 创建时间结束
         }
      }
   },
   created() {

      const that = this;
      this.getList();
      this.getStoreList();
      this.getAllCode();
   },
   mounted(){

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
            "门店名称",
            "隶属机构",
            "门店地址",
            "门店营业状态",
            "门店类型",
            "门店负责人",
            "门店人员数量",
            "创建人",
            "创建时间",
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "name",
            "organizationName",
            "_addressInfo",
            "businessStatus",
            "type",
            "principalName",
            "personNum",
            "createName",
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
       * 获取字典项
       */
      getAllCode() {
         this.request(
         this.api.system.ALL_CODESET_POST
         ).then(res => {
         res.forEach((item, index) => {
            switch(item.name) {
               case 'STO001':
               // 门店类型列表
               item.codeItemList.forEach((itemk, indexk) => {
                  itemk.checked = false;
               });
               this.store_list = item.codeItemList;
               break;
            }
         });
         // 获取门店信息
         if(this.isEcho) {
            this.getStoreInfo(this.$route.query.id);
         };
         });
      },
      /**
       * 编辑
       * @param { Object } item 当前对象
       * @param { Boolean } isRead 是否可对写
       * @property { Boolean }isEcho 是否是编辑
       * @return { Object } Obj 返回对象
       */
      hrefStoreEdit(item, isRead) {
         var Obj = {};
         this.href('store/store/store_info_edit',{
            isEcho:true,
            id:item.id,
            isRead
         })
         return Obj;
      },
      /**
       * 查看
       */
      hrefStoreShow(item, isRead) {
         var Obj = {};
         this.href('store/store/store_info_show',{
            isEcho:true,
            id:item.id,
            isRead
         })
         return Obj;
      },
      /**
       * 查询列表
       */
      getList() {
         const that = this;

         this.request(
         that.api.store.storeBasic_list,
         this.filtersData
         ).then(res => {
            console.log(res)
            that.data_obj = res;
            // 处理数据，导出数据用
            res.data.forEach((item, index) => {
               // 门店地址
               item._addressInfo = item.provinceName + item.cityName + item.areaName + item.addressInfo;
               // 营业状态
               item.businessStatus = item.businessStatus ? '营业中' : '休息中';
               // 门店类型
               item.type = this.$options.filters.codeToName("STO001", item.type);
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
         that.api.store.storeBasic_list
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
         this.filtersData.name = this.filtersData.name.replace(/(^\s)|(\s$)/g, '');
         this.getList();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
         Object.assign(this.filtersData,{
            pageIndex: 1,// 当前页码
            pageSize: 10,// 每页数量
            name:'',// 门店名称
            organizationId:'',// 隶属机构
            businessStatus:'',// 营业状态
            type:'',// 门店类型
            createBegin:'',// 创建时间开始
            createEnd:''// 创建时间结束
         });
      },
      /**
       * 点击页数
       * @param { Number } pageIndex 当前页
       */
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.getList();
      },
      /**
       *  选择每页多少条数
       *  @param { Number } pageSize 每页条数
       */
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getList();
      },
   },
   components:{
      codeSet,
      treeDept
   },
}
</script>
<style  lang="less" scoped>
   #container{
      width: 500px;
      height: 500px;
      border: 1px solid #000;
   }
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
</style>
