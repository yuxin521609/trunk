<template>
  <div>
    <div class="middle">
      <h3>出库单号: {{orderShopData.warehouseSn}}</h3>
      <!-- <span>待审核</span> -->
    </div>

    <div class="middle-msg">
      <span>出库仓：{{orderShopData.warehouse?orderShopData.warehouse:"--"}}</span>
      <span>仓库类型：{{warehouseTypeName?warehouseTypeName:"--"}}</span>
      <span>出库类型：{{orderShopData.warehouseType | filterWarehouseType}}</span>
      <span>出库人：{{orderShopData.operator?orderShopData.operator:'--'}}</span>
      <span>出库时间：{{orderShopData.warehouseTime | timestampToTime}}</span>
      <span>源单号：{{orderShopData.orderSn?orderShopData.orderSn:'--'}}</span>
      <span>货主：{{orderShopData.goodsOwner?orderShopData.goodsOwner:'--'}}</span>
    </div>
    <div class="shopView">
      <span>出库商品</span>
      <el-table
        :data="orderShopData.warehouseOrderGoodsVOList"
        stripe
        style="width: 100%"
        header-row-class-name="item-table-header"
      >
        <el-table-column prop="productCode" label="商品款号" width></el-table-column>
        <el-table-column prop="productGoodsCode" label="商品货号" width align="center"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width align="center"></el-table-column>
        <el-table-column prop="goodsImage" label="商品图片" width align="center">
          <template slot-scope="scope">
            <img :src="scope.row.goodsImage" style="width:32px;height:32px;" />
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" width align="center">
            <template slot-scope="scope">{{scope.row.brand?scope.row.brand:'--'}}</template>
        </el-table-column>
        <el-table-column prop="warehousingQuantity" label="出库数量" width align="center">
          <template slot-scope="scope">
            <span
              v-popover:popover
              class="blueSpan"
              @click="warehousingQuantityClickEvent(scope.row)"
            >{{scope.row.warehousingQuantity}}</span>
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
      <div>
        <el-popover ref="popover" v-model="showPopover" placement="right" width="400" trigger="click">
          <span>查看商品流水号：</span>
          <el-table :data="serialNumberData" max-height="300" header-row-class-name="item-table-header">
            <el-table-column label="商品流水号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row}}</span>
              </template>
            </el-table-column>
          </el-table>
          <span class="closeSpan" @click="showPopover=false">关闭</span>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //标记商品流水号table框
      showPopover:false,
      // 商品数据
      orderShopData: {},

      //记录总的商品数
      totalPage:0,
      shopData:{
        warehouseSn:'',
        pageIndex:1,
        pageSize:10
      },
      //仓库类型名称
      warehouseTypeName:'',
      //商品流水号数据
      serialNumberData:[]
    };
  },
  //过滤器
  filters: {
    //过滤仓库
    filterWarehouseCode(val) {
      switch (val) {
        case "01":
          return "正常仓库";
          break;
        case "02":
          return "网销渠道仓";
          break;
        default:
          return "--"
          break;
      }
    },
    //过滤仓库类型
    filterWarehouseType(val){
     switch(val){
      case "030201":
        return '采购订单'
        break;
      case "010101":
        return '网销订单'
        break;
      case "020101":
        return '渠道订单'
        break;
      case '020301':
        return '门店订单'
        break;
      default:
        return "--"
        break;
     }
    }
  },
  created() {
    console.log(this.$route.query.warehouseSn);
    if (this.$route.query.warehouseSn) {
      this.shopData.warehouseSn=this.$route.query.warehouseSn
      //得到详情数据
      this.getDetailData();
    }
  },
  methods: {
    //得到详情数据
    getDetailData() {
      this.request(this.api.order.warehouseOutOrder_getByWarehouseSn, this.shopData).then(res => {
        console.log(res);
        this.orderShopData = res;
        this.totalPage=res.totalCount
        this.getWarehouseTypeByCode(this.orderShopData.warehouseCode)
      });
    },
    //根据仓库编码得到仓库类型
    getWarehouseTypeByCode(code){
      this.request(this.api.system.warehouse_getByCode,{code:code}).then(data=>{
        console.log(data)
        // this.warehouseTypeName=data.
      })
    },
    //顶部小箭头，点击返回ditch路由页面
    backToPreRoute() {
      this.$router.push({
        path: "/OS/channelSales/channelSales"
      });
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
    },
    //出库数量的点击事件
    warehousingQuantityClickEvent(row) {
      console.log(row);
      this.request(
        this.api.order.warehouseOutOrder_serialNumberListByWarehouseSnAndProductGoodsCode,
        { warehouseSn:this.orderShopData.warehouseSn,productGoodsCode:row.productGoodsCode}
      ).then(data=>{
        console.log(data)
        this.serialNumberData=data
        this.showPopover=true
      })
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  background-color: #fff;
  padding: 15px 0 15px 30px;
}
.closeSpan{
  display: inline-block;
  margin-top: 10px;
  margin-left: 45%;
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
  padding: 25px 20px;
  position: relative;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  .blueSpan {
    color: #409eff;
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
