<template>
  <div>
    <div class="middle">
      <h3>到货单号: {{person.orderSn}}</h3>
      <!-- <span>待审核</span> -->
    </div>

    <div class="middle-msg">
      <el-row :gutter="20">
        <el-col :span="6">
          <span>供应商：{{person.supplier}}</span>
          <br />
          <span style="display:inline-block; margin:15px 0;">应到总数：{{person.quantity}}</span>
          <br />
          <span>预计到货时间：{{person.expectTime | timestampToTime}}</span>
        </el-col>
        <el-col :span="5">
          <span>关联采购订单：{{person.orderSn}}</span>
          <br />
          <span style="display:inline-block; margin:15px 0;">实收总数：{{person.actualQuantity}}</span>
          <br />
          <span>入库时间：{{person.expectTime | timestampToTime}}</span>
        </el-col>
        <el-col :span="5">
          <span>收货仓库：{{person.warehouse}}</span>
          <br />
          <span style="display:inline-block; margin:15px 0;">创建人：{{person.createBy}}</span>
          <br />
          <!-- <span>入库人：{{orderShopData.operator?orderShopData.operator:"--"}}</span> -->
        </el-col>
        <el-col :span="5">
          <span>备注：{{person.remarks?person.remarks:'--'}}</span>
          <br />
          <span style="display:inline-block; margin:15px 0;">创建时间：{{person.createTime | timestampToTime}}</span>
          <br />
        </el-col>
      </el-row>
    </div>
    <div class="shopView">
      <span>到货商品列表</span>
      <el-table
        :data="orderShopData"
        stripe
        style="width: 100%"
        header-row-class-name="item-table-header"
      >
        <el-table-column prop="productCode" label="商品款号" width></el-table-column>
        <el-table-column prop="code" label="商品货号" width align="center"></el-table-column>
        <el-table-column label="商品图片" width align="center">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="width:32px;height:32px;" />
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width align="center"></el-table-column>
        <el-table-column prop="expectQuantity" label="应到数量" width align="center"></el-table-column>
        <el-table-column prop="actualQuantity" label="实收数量" width align="center"></el-table-column>
        <el-table-column prop="qualifiedQuantity" label="合格数量" width align="center">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedQuantity?scope.row.qualifiedQuantity:'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unqualifiedQuantity" label="不合格数量" width align="center">
          <template slot-scope="scope">
            <span>{{scope.row.unqualifiedQuantity?scope.row.unqualifiedQuantity:'--'}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="shopData.pageIndex"
          :page-sizes="[10,20,30,40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //标记是否显示商品列表
      showShopView: false,
      person:{},
      // 商品数据
      orderShopData: [],
     //记录总的商品数
      totalPage:0,
      shopData:{
        arrivalSn:'',
        pageIndex:1,
        pageSize:10
      }
    };
  },
  created(){
   if(this.$route.query.arrivalSn){
     this.shopData.arrivalSn=this.$route.query.arrivalSn
     //得到数据列表
     this.getDetailData()
   }
  },
  methods: {
    //得到数据
    getDetailData() {
      this.request(this.api.order.channelPurchaseArrivalOrder_get, this.shopData).then(res => {
        console.log(res);
        this.person=res
        this.orderShopData=res.channelPurchaseArrivalOrderGoodsVOList.data
        this.totalPage=res.channelPurchaseArrivalOrderGoodsVOList.totalCount
      });
    },
    //顶部小箭头，点击返回ditch路由页面
    backToPreRoute() {
      this.$router.go(-1)
    },
    //点击产看更多商品
    showOrderShopView() {
      console.log("showOrderShopView");
    },
    //每页条数改变时
    handleSizeChange(page) {
      console.log(page);
      this.shopData.pageSize=page
      //刷新数据
      this.getDetailData()
    },
    // 当前页改变时
    handleCurrentChange(page) {
      console.log(page);
      this.shopData.pageIndex = page;
      //刷新数据
      this.getDetailData()
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  background-color: #fff;
  padding: 15px 0 15px 30px;
}
.title > span {
  display: inline-block;
  background-color: #fff;
  margin-left: 3px;
}
.middle {
  background-color: #fff;
  margin: 10px 10px 0;
  padding: 10px;
  position: relative;
  border-bottom: 1px solid #ccc;
}
.middle > span {
  position: absolute;
  top: 17px;
  left: 415px;
  background-color: pink;
  padding: 0 5px;
  border-radius: 3px;
  color: #fff;
}
.middle-msg {
  background-color: #fff;
  margin: 0 10px;
  padding: 10px;
  position: relative;
  border-bottom: 1px solid #ccc;
}
.btnLabel {
  color: plum;
  position: absolute;
  right: 20px;
  bottom: 10px;
}
.transition-box {
  margin-bottom: 10px;
  width: 100%;
  background-color: #fff;
  color: #222;
  box-sizing: border-box;
  margin-right: 20px;
  padding: 10px;
  font-weight: 700;
}
.shopView {
  padding: 20px 10px;
  background-color: #fff;
  margin: 10px;
  span {
    font-weight: bold;
    color: #222;
    display: inline-block;
    margin-bottom: 20px;
  }
}
/* .el-table /deep/ .shopTable{
      color:#222;
      font-weight: bold;
  } */
.logistics {
  background-color: #fff;
  margin: 10px;
  height: 100%;
  margin-bottom: 0;
  padding-top: 20px;
  padding-left: 30px;
}
.logistics > div::-webkit-scrollbar {
  display: none;
}
.logistics > div {
  height: 200px;
  background-color: #fff;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>



