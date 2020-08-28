<template>
  <div class="detail_div">
    <div class="middle-msg">
        <div class="title-label">
            <label>子订单编号：9878632011892301</label>
            <label>已完成</label>
        </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <span>收货人：{{orderData.consignee?orderData.consignee:'--'}}</span>
          <br />
          <span>实发数量：{{orderData.warehousingQuantity?orderData.warehousingQuantity:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>手机号：{{orderData.telephone?orderData.telephone:'--'}}</span>
          <br />
          <span>收货地址：{{orderData.address?orderData.address:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>订单商品数量：{{orderData.orderQuantity?orderData.orderQuantity:"--"}}</span>
          <br />
          <span>备注：{{orderData.remarks?orderData.remarks:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>创建时间：{{orderData.createTime | timestampToTime}}</span>
        </el-col>
      </el-row>
      <span style="margin-right:224px;">源主订单号：
        <span class="associationSn-span" @click="checkMainOrderDetail(orderData.associationSn)">{{orderData.associationSn?orderData.associationSn:'--'}}</span>
      </span>
      <span>源主订单其他关联单：
        <div v-for="(item,index) in orderData.subOrderSnList" :key="item.id" class="orderSn-div">
          <span @click="checkSubmenuOrderDetail(item.orderSn)" style="color:#2290E8;font-weight:700;cursor: pointer;">{{item.orderSn}}</span>
          <span style="color:#222;font-weight:700;">({{item.businessStatus | filterBusinessStatus}})</span>
          <span v-if="index!=orderData.subOrderSnList.length-1">、</span>
        </div>
      </span>
    </div>
    <div class="table_div">
      <label>子订单商品列表</label>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%;padding-left:15px;"
        header-row-class-name="item-table-header"
        max-height='400'
      >
        <el-table-column prop="productCode" label="商品款号"></el-table-column>
        <el-table-column prop="goodsCode" label="商品货号"></el-table-column>
        <el-table-column prop="image" label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="width:32px;height:32px;"/>
          </template>
        </el-table-column>
        <el-table-column prop="color" label="颜色"></el-table-column>
        <el-table-column prop="size" label="规格" width="180"></el-table-column>
        <el-table-column prop="brand" label="品牌" width="180"></el-table-column>
        <el-table-column prop="orderQuantity" label="数量"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="signData.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderData: {},
      tableData: [],
      //记录总的商品数
      totalCount:0,
      signData:{
        orderSn:'',
        pageIndex:1,
        pageSize:10
      }
    };
  },
   //过滤器
  filters: {
    //过滤订单状态
    filterBusinessStatus(val) {
      switch (val) {
        case "13":
          return "待处理";
          break;
        case "14":
          return "已处理";
          break;
        case "15":
          return "已作废";
          break;
      }
    }
  },
  mounted() {
   this.signData.orderSn=this.$route.query.orderSn
   //得到退货单号
   this.getSubmenuOrderDataByOrderSn()
  },
  methods: {
    //得到TOC子订单详情数据
    getSubmenuOrderDataByOrderSn(){
      this.request(this.api.warehouse.warehouseBase_deliveryOrder_getByOrderSn,this.signData).then(data=>{
        console.log(data)
        this.orderData=data
        this.tableData=data.businessOrderItemVO.list
        this.totalCount=data.businessOrderItemVO.totalCount
      })
    },
    //点击查看主单详情
    checkMainOrderDetail(orderSn){
      this.$router.push({
        path:
         "/warehouse/order_center/order_manager/toc_order/toc_order_main_check",
          query:{
            orderSn:orderSn
          }
      })
    },
    //点击查看其他子单详情
    checkSubmenuOrderDetail(orderSn){
      console.log(orderSn)
      this.signData.orderSn=orderSn 
      //刷新数据
      this.getSubmenuOrderDataByOrderSn()
    },
    //每页条数改变时
    handleSizeChange(page){
      this.signData.pageSize=page
      //刷新数据
      this.getSubmenuOrderDataByOrderSn()
    },
    //当前页改变时
    handleCurrentChange(page){
      this.signData.pageIndex=page
      //刷新数据
      this.getSubmenuOrderDataByOrderSn()
    }
  }
};
</script>

<style lang="less" scoped>
.orderSn-div{
  display: inline;
  font-size:16px;
}
.detail_div {
  margin: 10px;
  .middle-msg {
    background-color: #fff;
    margin: 10px 0;
    padding: 10px 20px;
    font-size: 13px;
    .title-label {
        color: #222;
        font-weight: 700;
        border-bottom:1px solid #ccc;
        padding-bottom:10px;
        width:100%;
        font-size:20px;
        margin-bottom:10px;
        display:flex;
        align-items: center;
        label{
            &:nth-child(2){
                color:#2290E8;
                border:1px solid #2290E8;
                margin-left: 20px;
                font-size: 13px;
                font-weight:400;
                padding:3px 15px;
                border-radius:5px;
            }
        }
    }
    .associationSn-span{
      color:#2290E8;
      font-weight:700;
      cursor: pointer;
      padding-left:0;
      font-size:16px;
    }
    span {
        display: inline-block;
        margin-bottom: 15px;
        color: #2C3E50;
        // padding-left: 20px;
    }
  }
  .table_div {
    padding: 0 15px;
    margin: 10px 0;
    background-color: #fff;
    label {
        color: #222;
        font-size: 15px;
        font-weight: bold;
        display: inline-block;
        border-bottom:1px solid #ccc;
        padding-bottom:10px;
        padding-top:20px;
        width:100%;
    }
  }
}
.pagination{
  text-align: right;
  background-color: #fff;
  padding:15px 0;
}
</style>

