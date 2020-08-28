<template>
  <div class="detail_div">
    <label>退货单信息</label>
    <div class="middle-msg">
      <el-row :gutter="20">
        <el-col :span="6">
          <span>供应名称：{{person.supplier?person.supplier:'--'}}</span>
          <br />
          <span>采退金额：￥{{person.returnAmount?person.returnAmount:'0.00'}}</span>
          <br />
          <span>创建人：{{person.creator?person.creator:'--'}}</span>
          <br />
          <span>退货地址：{{person.addressInfo?person.addressInfo:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>单据状态：{{person.businessStatus | filterBusinessStatus}}</span>
          <br />
          <span>出库仓库：{{person.warehouse? person.warehouse:'--'}}</span>
          <br />
          <span>创建时间：{{person.createTime | timestampToTime}}</span>
        </el-col>
        <el-col :span="5">
          <span>组织机构：{{person.organization?person.organization:'--'}}</span>
          <br />
          <span>退货件数：{{person.returnCount?person.returnCount:'--'}}</span>
          <br />
          <span>物流公司：{{person.logisticsCompany?person.logisticsCompany:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>退货日期：{{person.refundTime | timestampToTime}}</span>
          <br />
          <span>财务是否核销：{{person.financialWriteOff | filterFinancialWriteOff}}</span>
          <br />
          <span>物流单号：{{person.logisticsOrderSn?person.logisticsOrderSn:'--'}}</span>
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
        max-height="400"
      >
        <el-table-column prop="productCode" label="商品款号"></el-table-column>
        <el-table-column prop="code" label="商品货号"></el-table-column>
        <el-table-column prop="image" label="商品图片">
          <template slot-scope="scope">
            <img :src='scope.row.image' style="width:32px;height:32px;"><img>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="returnQuantity" label="采退数量"></el-table-column>
        <el-table-column prop="refundAmount" label="采购退货单价"></el-table-column>
        <el-table-column prop="amount" label="退货金额"></el-table-column>
        <!-- <el-table-column prop="amount" label="退货金额" width="180"></el-table-column> -->
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
        returnSn:'',
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
    },
    //过滤仓库收货状态
    filterWarehouseStatus(val) {
      switch (val) {
        case "1001":
          return "未到货";
          break;
        case "1002":
          return "部分到货";
          break;
        case "1003":
          return "全部到货";
          break;
        case "1004":
          return "超收到货";
          break;
      }
    },
    //过滤是否核销
    filterFinancialWriteOff(val) {
      switch (val) {
        case false:
          return "否";
          break;
        case true:
          return "是";
          break;
      }
    }
  },
  mounted() {
    this.shopData.returnSn=this.$route.query.returnSn
    //得到详情数据
    this.getPurchaseReturnCheckData()
  },
  methods: {
    //得到详情数据
    getPurchaseReturnCheckData(){
      this.request(this.api.order.channelRetundOrder_getByReturnSn,this.shopData).then(data=>{
        console.log(data)
        this.person=data
        this.tableData=data.channelOrderGoodsVOList.data
        this.tableData.forEach(item=>{
          item.amount=(item.refundAmount*item.returnQuantity).toFixed(2)
        })
        this.totalPage=data.channelOrderGoodsVOList.totalCount
      })
    },
    //每页条数改变时
    handleSizeChange(page){
      this.shopData.pageSize=page
      //刷新数据
      this.getPurchaseReturnCheckData()
    },
    //当前页改变时
    handleCurrentChange(page){
      this.shopData.pageIndex=page
      //刷新数据
      this.getPurchaseReturnCheckData()
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

