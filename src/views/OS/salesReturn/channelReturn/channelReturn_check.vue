<template>
  <div class="detail_div">
    <label>退货单信息</label>
    <div class="middle-msg">
      <el-row :gutter="20">
        <el-col :span="6">
          <span>退货单号：{{person.refundSn?person.refundSn:'--'}}</span>
          <br />
          <span>退货总金额：{{person.amount?person.amount:'--'}}</span>
          <br />
          <span>物流公司：{{person.logisticsCompany?person.logisticsCompany:'--'}}</span>
          <br />
          <span>退货件数：{{person.refundCount?person.refundCount:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>退货状态：{{person.businessStatus | filterBusinessStatus}}</span>
          <br />
          <span>退款商户：{{person.storeName?person.storeName:'--'}}</span>
          <br />
          <span>物流单号：{{person.logisticsOrderSn?person.logisticsOrderSn:'--'}}</span>
          <br />
          <span>组织机构：{{person.organization?person.organization:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>订单号：{{person.orderSn?person.orderSn:"--"}}</span>
          <br />
          <span>联系电话：{{person.mobile?person.mobile:'--'}}</span>
          <br />
          <span>收获仓库：{{person.warehouse?person.warehouse:'--'}}</span>
          <br />
          <span>创建人：{{person.createBy?person.createBy:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>订单来源：{{person.channelCode?person.channelCode:'手工订单'}}</span>
          <br />
          <span>退货日期：{{person.refundTime | timestampToTimeNoDate}}</span>
          <br />
          <span>收货时间：--</span>
          <br />
          <span>创建时间：{{person.createTime | timestampToTime}}</span>
        </el-col>
      </el-row>
    </div>
    <label>退货商品信息</label>
    <div class="table_div">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        header-row-class-name="item-table-header"
        max-height='400'
      >
        <el-table-column prop="productCode" label="商品款号" width="180"></el-table-column>
        <el-table-column prop="code" label="商品货号" width="180"></el-table-column>
        <el-table-column prop="image" label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="width:64px;height:64px;" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="180"></el-table-column>
        <el-table-column prop="purchasePrice" label="销售单价"></el-table-column>
        <el-table-column prop="returnQuantity" label="退货数量" width="180"></el-table-column>
        <el-table-column prop="refundAmount" label="退货单价" width="180"></el-table-column>
        <el-table-column prop="amount" label="退货金额"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="shopData.pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      person: {},
      tableData: [],
      //记录总的商品数
      totalPage:0,
      shopData:{
        refundSn:'',
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
   this.shopData.refundSn=this.$route.query.refundSn
   //得到退货单号
   this.getReturnSnData()
  },
  methods: {
    //每页条数改变时
    handleSizeChange(page){
      this.shopData.pageSize=page
      //刷新数据
      this.getReturnSnData()
    },
    //当前页改变时
    handleCurrentChange(page){
      this.shopData.pageIndex=page
      //刷新数据
      this.getReturnSnData()
    },
    //得到退货单号的数据
    getReturnSnData(){
      this.request(this.api.order.channelRefundOrder_getRefundByRefundSn,this.shopData).then(data=>{
        console.log(data)
        this.person=data
        this.tableData=data.channelOrderGoodsVOList.data
        this.totalPage=data.channelOrderGoodsVOList.totalCount
      })
    }
  }
};
</script>

<style lang="less" scoped>
.detail_div {
  margin: 10px;
  padding: 20px 15px;
  background-color: #fff;
  label {
    color: #222;
    font-weight: 700;
  }
  .middle-msg {
    background-color: #fff;
    margin: 20px 0;
    margin-bottom: 0;
    padding: 10px;
    span {
      display: inline-block;
      margin-bottom: 15px;
    }
  }
  .table_div {
    padding: 0 15px;
    margin: 20px 0;
  }
}
</style>

