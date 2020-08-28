<template>
  <div class="detail_div">
    <div class="middle-msg">
      <label>基础信息</label>
      <el-row :gutter="20">
        <el-col :span="6">
          <span>发货任务单号：{{person.orderSn?person.orderSn:'--'}}</span>
          <br />
          <span>收件人：{{person.consignee?person.consignee:'--'}}</span>
          <br />
          <span>承运商名称：{{person.logistics?person.logistics:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>原始订单号：{{person.associationSn?person.associationSn:'--'}}</span>
          <br />
          <span>联系方式：{{person.consigneeTelephone?person.consigneeTelephone:'--'}}</span>
          <br />
          <span>物流单号：{{person.logisticsSn?person.logisticsSn:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>仓库：{{person.warehouseCode?person.warehouseCode:"--"}}</span>
          <br />
          <span>收获地址：{{person.consigneeAddress?person.consigneeAddress:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>货主：{{person.goodsOwner?person.goodsOwner:'--'}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="table_div">
      <label>商品明细</label>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%;padding-left:15px;"
        header-row-class-name="item-table-header"
        max-height='400'
      >
        <el-table-column prop="goodsCode" label="商品编码" width="180"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="color" label="颜色"></el-table-column>
        <el-table-column prop="size" label="尺码" width="180"></el-table-column>
        <el-table-column prop="brand" label="品牌" width="180"></el-table-column>
        <el-table-column prop="purchasePrice" label="品类"></el-table-column>
        <el-table-column prop="orderQuantity" label="订货数量" width="180"></el-table-column>
        <el-table-column prop="pickingQuantity" label="拣货数量" width="180"></el-table-column>
        <el-table-column prop="warehousingQuantity" label="出库数量"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="orderData.pageIndex"
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
      person: {},
      tableData: [],
      //记录总的商品数
      totalCount:0,
      orderData:{
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
   this.orderData.orderSn=this.$route.query.orderSn
   //根据单号得到发货单详情数据
   this.getSendOrderDataByOrderSn()
  },
  methods: {
    //每页条数改变时
    handleSizeChange(page){
      this.orderData.pageSize=page
      //刷新数据
      this.getSendOrderDataByOrderSn()
    },
    actualAmountChange(val){

    },
    //当前页改变时
    handleCurrentChange(page){
      this.orderData.pageIndex=page
      //刷新数据
      this.getSendOrderDataByOrderSn()
    },
    //根据单号得到发货单详情数据
    getSendOrderDataByOrderSn(){
      this.request(this.api.warehouse.warehouseBase_deliveryOrder_getByOrderSn,this.orderData).then(data=>{
        console.log(data)
        this.person=data
        this.tableData=data.businessOrderItemVO.list
        this.totalCount=data.businessOrderItemVO.totalCount
      })
    }
  }
};
</script>

<style lang="less" scoped>
.detail_div {
  margin: 10px;
  .middle-msg {
    background-color: #fff;
    margin: 10px 0;
    padding: 10px 20px;
    font-size: 13px;
    label {
        color: #222;
        display: inline-block;
        border-bottom:1px solid #ccc;
        padding-bottom:10px;
        width:100%;
        margin-bottom:10px;
    }
    span {
        display: inline-block;
        margin-bottom: 15px;
        color: #2C3E50;
        padding-left: 20px;
    }
  }
  .table_div {
    padding: 0 15px;
    margin: 10px 0;
    label {
        color: #222;
        font-size: 13px;
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
}
</style>

