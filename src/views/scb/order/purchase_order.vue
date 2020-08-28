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
               <el-input v-model="filtersData.purchaseSearchWords" @keyup.enter.native="handleSearch" style="width:310px;" placeholder="采购订单号/供货商"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="filtersData.purchaseOrderStatus" clearable filterable>
                 <el-option v-for="(item, index) in orderStatus" :label="item" :key="index" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单来源：">
              <el-select v-model="filtersData.purchaseOrderType" clearable filterable>
                 <el-option v-for="(item, index) in purchaseType" :label="item" :key="index" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="供货商：">
              <el-select v-model="filtersData.merchantName" clearable filterable>
                 <el-option v-for="(item, index) in returnGoodsAllOrPartList" :label="item" :key="index" :value="index"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- 新增 -->
            <el-form-item label="创建时间：" prop="startDate">
               <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.startDate" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
               <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.endDate" type="date" placeholder="结束日期"></el-date-picker>
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
         <el-table
            :data="getList_data.data"
            stripe
            empty-text="暂无数据"
            header-align="center"
            header-row-class-name="item-table-header"
            @selection-change="tableCheckChange"
            :highlight-current-row="true">
            <el-table-column align="left" :show-overflow-tooltip="true" label="采购订单号" min-width="130">
               <template  slot-scope="scope">{{ scope.row.purchaseOrderNum || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="状态" min-width="70">
               <template  slot-scope="scope">{{ orderStatus[scope.row.purchaseOrderStatus] || '--' }}</template>
            </el-table-column>
            <!-- <el-table-column align="left" :show-overflow-tooltip="true" label="采购合同号" min-width="90">
               <template  slot-scope="scope">{{ scope.row.orderProductType  }}</template>
            </el-table-column> -->
            <el-table-column align="left" :show-overflow-tooltip="true" label="供货商名称" min-width="60">
               <template  slot-scope="scope">{{ scope.row.merchantName || '--' }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="left" label="采购金额" min-width="90">
               <template  slot-scope="scope">{{ scope.row.purchaseSumAmount || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="实付金额" min-width="60">
               <template  slot-scope="scope">{{ scope.row.purchaseSumAmount || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="结算类型" min-width="60">
               <template  slot-scope="scope">{{ tradeWayCodeType[scope.row.tradeWayCode] || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="到货状态" min-width="60">
               <template  slot-scope="scope">{{ receiveGoodsStatus[scope.row.receiveGoodsStatus] || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="采购总数" min-width="60">
               <template  slot-scope="scope">{{ scope.row.productQty || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="实收总数" min-width="60">
               <template  slot-scope="scope">{{ scope.row.receiveGoodsSumQty || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="发货次数" min-width="140">
               <template  slot-scope="scope">{{ scope.row.sendGoodsCount || '--' }}</template>
            </el-table-column>
            <el-table-column align="left" :show-overflow-tooltip="true" label="创建时间" min-width="120">
               <template  slot-scope="scope">{{ scope.row._createTime }}</template>
            </el-table-column>
            <!-- 新增 -->
            <el-table-column align="left" :show-overflow-tooltip="true" label="采购人" min-width="60">
               <template  slot-scope="scope">{{ scope.row.purchaserName }}</template>
            </el-table-column>
            <!-- 新增 -->
            <el-table-column align="left" :show-overflow-tooltip="true" label="订单来源" min-width="60">
               <template  slot-scope="scope">{{ purchaseType[scope.row.purchaseOrderType] || '--' }}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
               fixed="right"
               label-class-name="text-left"
               class-name="text-left"
               align="left"
               label="操作"
               width="80">
               <template slot-scope="scope">
                  <el-button type="text" @click="timeRedact(scope.row.id)" size="small">查看</el-button>
               </template>
            </el-table-column>
         </el-table>
         <div class="pagination mt-10">
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
   name:'purchase_order',
   data() {
      return{
         orderStatus:{
            100:'待编辑',
            101:'待审核',
            102:'待发货',
            103:'部分已发货',
            104:'异常完成',
            105:'已完成',
            106:'已作废'
         },
         tradeWayCodeType: {
            1: "现金",
            2: "代销"
         },
         purchaseType:{
            'MERCHANT':'商户配货',
            'PURCHASER':'采购商城'
         },
         // 订单商品类型
         OrderProductType:{
            0:'服装商品',
            1:'虚拟商品'
         },
         receiveGoodsStatus:{
            0:'未到货',
            1:'部分到货',
            2:'全部到货',
            3:'到货超收'
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
            "purchaseSearchWords": null, // 模糊搜索
            purchaseOrderStatus:null,// 订单状态
            purchaseOrderType:null,// 订单来源
            "startDate":"",
            "endDate":"",
            "pageIndex":1,
            "pageSize":10
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
   },
   activated() {
      this.getList();
   },
   methods: {
      /**
       * 导出销售订单
       */
      exportExcelOrder() {
         this.exportExcel({
            title:'零售门店信息列表',
            checkedTableData:this.checkedTableData.length > 0 ? this.checkedTableData : this.getList_data.data,
            tHeader:[
               "订单号",
               "状态",
               // "支付状态", 
               // "订单商品类型",
               "客户姓名",
               "客服电话",
               "销售件数",
               "吊牌总额",
               "订单金额",
               "实付金额",
               "支付方式",
               "关联预约单号",
               "创建时间",
               "是否退货",
               "开单人",
               "所属门店",
               "所属机构"
            ],
            filterVal:[
               "orderNum",
               "orderStatus",
               // "paymentStatus",
               // "orderProductType",
               "userName",
               "mobile",
               "sumQuantity",
               "sumPrice",
               "orderAmount",
               "acturalPaidAmount",
               "paymentCode",
               "reservationOrderNum",
               "createTime",
               "returnGoodsAllOrPart",
               "imageHousekeeperName",
               "storeName",
               "organization"
            ]
         });
      },
      /**
       * 导出销售订单
       */
      exportExcelGoodList() {
         let checkedTableData = [];
         if(this.checkedTableData && this.checkedTableData.length > 0) {
            this.checkedTableData.forEach((item, index) => {
               checkedTableData = [...checkedTableData, ...item.storeRetailOrderProductInfoVOS];
            });
         }else{
            this.getList_data.data.forEach((item, index) => {
               checkedTableData = [...checkedTableData, ...item.storeRetailOrderProductInfoVOS];
            });
         };
         this.exportExcel({
            title:'订单商品表明细',
            checkedTableData,
            tHeader:[
               "商品款号",
               "商品货号",
               "商品图片",
               "品牌",
               "销售数量",

               "吊牌价",
               "吊牌金额",
               "销售单价",
               "销售金额",
               "关联订单号",

               "退货数量",
               "零售店铺"
            ],
            filterVal:[
               "productCode", // 商品款号
               "goodsCode", // 商品货号
               "image", // 商品图片
               "brandName", // 品牌
               "quantity", // 销售数量

               "price", // 吊牌价
               "sumRetailPriceByGoodsCode", // 吊牌金额
               "retailPrice", // 销售单价
               "salesAmount", // 销售金额

               "orderNum", // 关联订单号 
               "refundQuantity", // 退货数量 
               "storeName" // 零售门店
            ]
         });
      },
      //导出
      exportExcel(obj) {
         require.ensure([], () => {
            let { export_json_to_excel, export_table_to_excel } = require("@/vendor/Export2Excel");
            let tHeader = obj.tHeader;
            // 上面设置Excel的表格第一行的标题
            let filterVal = obj.filterVal;
            // 上面的index、nickName、name是tableData里对象的属性
            let list = obj.checkedTableData; //把data里的tableData存到list
            let data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, obj.title);
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
         this.href('/order/purchase_order_detail',{
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
       * 
       */
      getList() {
         const that = this;

         this.request(
         that.api.scb.purchaseOrder_purchaseList,
         this.filtersData
         ).then(res => {
            that.getList_data = res;
            res.data.forEach((item, index) => {
               item._createTime = this.$options.filters.timestampToTime(item.createTime);
            })
         });
      },
       /**
       * 
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
         Object.assign(this.filtersData,{
            "purchaseSearchWords": null, // 模糊搜索
            purchaseOrderStatus:null,// 订单状态
            purchaseOrderType:null,// 订单来源
            merchantName:null,// 供应商
            "startDate":"",
            "endDate":"",
            "pageIndex":1,
            "pageSize":10
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
