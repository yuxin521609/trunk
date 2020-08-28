<template>
  <div class="detail_div">
    <div class="middle-msg">
      <label>基础信息</label>
      <el-row :gutter="20">
        <el-col :span="6">
          <span>收货单号：{{person.orderSn?person.orderSn:'--'}}</span>
          <br />
          <span>预计到货日期：{{person.expectedTime | timestampToTime}}</span>
          <br />
          <span>承运商：{{person.logistics?person.logistics:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>原始订单号：{{person.associationSn?person.associationSn:'--'}}</span>
          <br />
          <span>供应商名称：{{person.supply?person.supply:'--'}}</span>
          <br />
          <span>承运商单号：{{person.logisticsSn?person.logisticsSn:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>仓库：{{person.warehouse?person.warehouse:"--"}}</span>
          <br />
          <span>联系人：{{person.contact?person.contact:'--'}}</span>
          <br />
          <span>司机：{{person.driver?person.driver:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>货主：{{person.goodsOwner?person.goodsOwner:'--'}}</span>
          <br />
          <span>联系方式：{{person.telephone?person.telephone:'--'}}</span>
          <br />
          <span>手机号：{{person.driverMobile?person.driverMobile:'--'}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="table_div">
      <label>商品详情</label>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%;padding-left:15px;"
        header-row-class-name="item-table-header"
        max-height='400'
      >
        <el-table-column prop="goodsCode" label="商品货号" width="180"></el-table-column>
        <el-table-column prop="productCode" label="商品款号" width="180"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="color" label="颜色"></el-table-column>
        <el-table-column prop="size" label="尺码" width="180"></el-table-column>
        <el-table-column prop="brand" label="品牌" width="180"></el-table-column>
        <el-table-column prop="orderQuantity" label="预计到货数量"></el-table-column>
        <el-table-column prop="pickingQuantity" label="实际到货数量" width="180"></el-table-column>
        <el-table-column prop="warehousingQuantity" label="实际收货数量" width="180"></el-table-column>
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
   this.orderData.orderSn=this.$route.query.orderSn;
   //根据单号得到收货单详情数据
   this.getSendDataDetailByOrderSnData()
  },
  methods: {
    //每页条数改变时
    handleSizeChange(page){
      this.orderData.pageSize=page
      //刷新数据
      this.getSendDataDetailByOrderSnData()
    },
    //当前页改变时
    handleCurrentChange(page){
      this.orderData.pageIndex=page
      //刷新数据
      this.getSendDataDetailByOrderSnData()
    },
    //根据单号得到收货单详情数据
    getSendDataDetailByOrderSnData(){
      this.request(this.api.warehouse.warehouseBase_receiveOrder_getByOrderSn,this.orderData).then(data=>{
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
    background-color: #fff;
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

