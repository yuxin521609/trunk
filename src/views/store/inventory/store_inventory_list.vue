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
               <el-input v-model="filtersData.filter"  @keyup.enter.native="handleSearch" clearable placeholder="请输入商品款号/货号"></el-input>
            </el-form-item>
            <el-form-item label="商品品牌：">
              <el-select v-model="filtersData.brandName" clearable filterable>
               <el-option
                  v-for="item in brandOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
               ></el-option>
              </el-select>
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
            <br/>
            <!-- 商品品类 -->
            <el-form-item prop="cateIdentifier" clearable label="商品品类：">
               <el-cascader
                  class="input-w"
                  :options="classData"
                  v-model="cateArr"
                  :value="cateArr"
                  @change="cascaderGet"
                  :show-all-levels="false"
                  :props="props"
                  change-on-select
               ></el-cascader>
            </el-form-item>
            <!-- 商品颜色 -->
            <el-form-item prop="colorCode" label="商品颜色：">
               <el-cascader
                  class="input-w"
                  :options="colorOptions"
                  @change="colorCodeGet"
                  :show-all-levels="false"
                  :props="colorProps"
                  change-on-select
                  ref="goodsColor"
               ></el-cascader>
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
            :data="getList_data.dataList.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            :highlight-current-row="true">
            <el-table-column width="45">
               <template slot-scope="scope">
                  <i
                     @click="childrenIsShow(scope.row, scope.$index )"
                     v-if="scope.row.isShow"
                     :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"
                  ></i>
               </template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品款号" min-width="70">
               <template  slot-scope="scope">{{ scope.row.productCode || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品货号" min-width="70">
               <template  slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="库存数量" min-width="70">
               <template  slot-scope="scope">{{ scope.row.quantity }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="商品图片" min-width="70">
               <template  slot-scope="scope"><img :src="scope.row.image" class="imageSize" alt=""></template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="品牌" min-width="60">
               <template  slot-scope="scope">{{ scope.row.brandName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="品类" min-width="60">
               <template  slot-scope="scope">{{ scope.row.productType || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="颜色" min-width="50">
               <template  slot-scope="scope">{{ scope.row.color || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="尺码" min-width="50">
               <template  slot-scope="scope">{{ scope.row.size }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="吊牌价" min-width="50">
               <template  slot-scope="scope">{{ scope.row.retailPrice || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="所属门店" min-width="100">
               <template  slot-scope="scope">{{ scope.row.storeName || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="隶属机构" min-width="60">
               <template  slot-scope="scope">{{ scope.row.relationDepNmae || '--' }}</template>
            </el-table-column>
         </el-table>
         <div class="disFlex">
            <div class="info">{{ getList_data.info }}</div>
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
                  :total="getList_data.dataList.totalCount"
               ></el-pagination>
            </div>
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
   name:'store_inventory_list',
   data() {
      return{
         // 选中的表格数据
         checkedTableData: [],
         // data数据
         getList_data:{},
         // 去掉重复后的品牌收据
         brandOptions:[],
         // 获取门店信列表
         getStoreList_data:[],
         // 获取品牌列表
         storeStock_listBrand_data:[],
         priority:{
            "01":"高",
            "02":"中",
            "03":"低",
         },
         formInline:{
            user: '',
            region: ''
         },
         // 选择商品品类相关参数
         classData: [],
         classList: [],
         cateArr: [],
         props: {
            value: "id",
            label: "name",
            children: "children"
         },
         // 选择商品颜色相关参数
         colorProps: {
            value: "code",
            label: "name",
            children: "children",
            checkStrictly: true
         },
         colorOptions: [],
         colorList:[],
         // 检索条件
         filtersData: {
            "filter": "",
            "storeId": "",
            "relationDepId":"",
            "brandName":"",
            "startTime":"",
            "endTime":"",
            "pageIndex": 1,
            "pageSize": 10,
            // 商品品类
            productType:null,
            // 商品颜色系列
            colorSeries:null,
            // 商品颜色
            color:null
         },
         // 商品颜色系列（子类）
         _colorSeries:null,
         // 商品颜色（子类）
         _color:null,
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
      this.getBrandOptions();
      this.storeStock_listBrand();
      this.getClassData();
      this.getColorOptions();
   },
   activated() {
      this.getList();
   },
   methods: {
      /**
       * 获取子级
       */
      childrenIsShow(row, index) {
         console.log(row)
         var productId = row.productCode; //当前数据ID
         let _type = row.isType; //状态 1 关闭 0 打开
         if (_type == "1") {
         //当前为关闭状态 需请求接口获取子元素
         row.isType = 0;
         this.getChildData(row, index);
         } else {
         //当前为打开状态 需删除子元素
         row.isType = 1;
         this.removeChildData(row);
         }
      },
      /**
       * 查询库存列表子类
       */
      getChildData(row, index) {
         let that = this;
         let _index = index;
         if (!row._chilren) {
            this.request(
               that.api.store.storeProduct_listByDeptId,
               {
               "filter": "",
               "storeId": row.storeId,
               productCode:row.productCode,
               "brandCode":row.brandCode,
               brandName:row.brandName,
               // 商品品类
               productType:row.productType,
               // 商品颜色系列
               colorSeries:this._colorSeries,
               // 商品颜色
               color:this._color,
               orderBy:'goodsCode'
               }
            ).then(res => {
               let _data = res.data;
               let _dataLen = _data.length;
               for (let i = 0; i < _dataLen; i++) {
                  _data[i].subCode = _data[i].code;
                  _data[i].code = null;
               }
               row._chilren = _data;
               //根据下标插入进去 获取ID 在数组中的下标
               this.getList_data.dataList.data.splice(_index + 1, 0, ..._data);
               //获取子集id存入 元素属性
               let arr = [];
               for (let { id } of _data) {
                  arr.push(id);
               }
               row._cid = arr.join();
            });
         } else {
         this.getList_data.dataList.data.splice(_index + 1, 0, ...row._chilren);
         }
      },
      //删除子集
      removeChildData(row) {
         let cid = row._cid;
         let cidArr = cid.split(",");
         let _table = this.getList_data.dataList.data,
         tableLen = _table.length;
         for (let i = 0; i < cidArr.length; i++) {
         for (let j = 0; j < this.getList_data.dataList.data.length; j++) {
            if (cidArr[i] == this.getList_data.dataList.data[j].id) {
               this.getList_data.dataList.data.splice(j, 1);
            }
         }
         }
      },
      /**
       * 查询库存列表
       */
      getList() {
         const that = this;

         if(this.filtersData.filter) {
            this.filtersData.orderBy = 'quantity';
         }else{
            this.filtersData.orderBy = '';
         };
         this.request(
         that.api.store.storeProduct_listProduct,
         this.filtersData
         ).then(res => {
            res.dataList.data.forEach((item, index) => {
               item.isShow = true;
               item.isType = 1;
               item._cid = "";
            })
            that.getList_data = res;
         });
      },
      /**
       * 选择品类
       */
      cascaderGet(e) {
         let cateId = JSON.parse(JSON.stringify(e)).pop();
         let obj = this.classList.find(item => item.id == cateId);
         this.filtersData.productType = obj.fullCateName;
      },
      /**
       * 获取分类
       */
      getClassData() {
         //分类类型（1：标准分类，2：定制分类，3：原料分类或者称为属性分类）
         this.$common.getClassSelect(this, 1).then(res => {
            this.classData = res.ztree;
            this.classList = res.list;
         });
      },
      /**
       * 选择颜色
       */
      colorCodeGet(e) {
         let color  = JSON.parse(JSON.stringify(e)).pop();
         let obj = this.colorList.find((item)=>(item.code == color));
         if(obj.parentCode ===null){
            this.filtersData.colorSeries = obj.name;
            this.filtersData.color = null;
         }else{
            this.filtersData.colorSeries = null;
            this.filtersData.color =obj.name;
         }
      },
      /**
       * 获取颜色
       */
      getColorOptions() {
      // console.log("从computed中获取颜色");
      let codeSet = this.$store.getters.codeData;
      let treeList = [];
      let codeList = JSON.parse(JSON.stringify(codeSet.PRO004.codeItemList));
      function toTree(data, parentCode) {
         var tree = [];
         var temp;
         for (var i = 0; i < data.length; i++) {
            if (data[i].parentCode == parentCode) {
            var obj = data[i];
            temp = toTree(data, data[i].code);
            if (temp.length > 0) {
               obj.children = temp;
            }
            tree.push(obj);
            }
         }
         return tree;
      }
      treeList = toTree(codeList, null);
      this.colorList = codeList;
      this.colorOptions = treeList;
      },
      /**
       * 获取品牌
       */
      getBrandOptions() {
         let that = this;
         this.request(
         this.api.product.productBrand_list,
         {},
         true
         ).then(res => {
            that.brandOptions = res.data;
         });
      },
      //导出
      exportExcel() {

        require.ensure([], () => {
          let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
          let tHeader = [
            "所属门店",
            "隶属机构",
            "商品款号",
            "商品货号",
            "库存数量",
            "商品图片",
            "品牌",
            "吊牌价",
            "颜色",
            "尺码",
          ];
          // 上面设置Excel的表格第一行的标题
          let filterVal = [
            "storeName",
            "relationDepNmae",
            "productCode",
            "goodsCode",
            "quantity",
            "image",
            "brandName",
            "price",
            "color",
            "size"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          let list = this.getList_data.dataList.data; //把data里的tableData存到list
          let data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "商品库存汇总列表");
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
       * 获取品牌列表
       */
      storeStock_listBrand() {
         const that = this;

         this.request(
         that.api.store.storeStock_listBrand
         ).then(res => {
            that.storeStock_listBrand_data = res;
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
         this._colorSeries = this.filtersData.colorSeries;
         this._color = this.filtersData.color;
         this.getList();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {

         Object.assign(this.filtersData, {
            "filter": "",
            "storeId": "",
            "relationDepId":"",
            "brandName":"",
            "startTime":"",
            "endTime":"",
            "pageIndex": 1,
            "pageSize": 10,
            // 商品品类
            productType:null,
            // 商品颜色系列
            colorSeries:null,
            // 商品颜色
            color:null
         });
         this.cateArr = [];
         // 将商品颜色重置为空
         this.$refs.goodsColor.$el.children[0].children[0].value = null;
         this.$refs.goodsColor.checkedValue = [];
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
  .imageSize{
      width: 50px;
      height: 50px;
   }
   .blueness{
      color: #1E90FF;
   }
  .disFlex{
      display: flex;
      justify-content: space-between;
      .info{
         margin-top: 15px;
      }
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
