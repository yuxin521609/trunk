<template>
  <div>
    <div class="middle">
      <h3>采购订单号:{{person.orderSn}}</h3>
      <span style='margin-left:30px;'>{{person.businessStatus | filterBusinessStatus}}</span>
    </div>

    <div class="middle-msg">
      <el-row :gutter="20">
        <el-col :span="6">
          <span>采购合同号：{{person.contractSn?person.contractSn:"--"}}</span>
          <br />
          <span style="display:inline-block; margin:15px 0;">采购商品金额：￥{{person.amount?person.amount:"--"}}</span>
          <br />
          <span>采购人：{{person.purchaser?person.purchaser:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>上游供货商：{{person.supplier?person.supplier:'--'}}</span>
          <br />
          <span style="display:inline-block; margin:15px 0;">其他扣减金额项：￥{{person.preferentialAmount?person.preferentialAmount:'0.00'}}</span>
          <br />
          <span>所属机构：{{person.organization?person.organization:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>订单来源：{{person.channelCode?person.channelCode:"--"}}</span>
          <br />
          <span style="display:inline-block; margin:15px 0;">扣减原因：{{person.preferentialRemarks?person.preferentialRemarks:'--'}}</span>
          <br />
          <span>创建时间：{{person.createTime | timestampToTime}}</span>
        </el-col>
        <el-col :span="5">
          <span>采购应付金额：{{person.actualAmount?person.actualAmount:'--'}}</span>
          <br />
          <span>备注：{{person.remarks?person.remarks:'--'}}</span>
        </el-col>
      </el-row>
      <label class="btnLabel" @click="showShopView=!showShopView">查看订单商品</label>
    </div>
    <div class="shopView">
      <transition name="el-zoom-in-top">
        <div v-show="showShopView" class="transition-box">
          <span>订单商品列表</span>
          <el-table
            :data="orderShopData"
            stripe
            style="width: 100%"
            header-row-class-name="item-table-header"
          >
            <el-table-column prop="productCode" label="商品款号" width="160"></el-table-column>
            <el-table-column prop="code" label="商品货号" width="150" align="center"></el-table-column>
            <el-table-column label="商品图片" width="260" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.image" style="width:32px;height:32px;" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="260" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" width="160" align="center"></el-table-column>
            <el-table-column prop="category" label="商品品类" width="260" align="center">
              <template slot-scope="scope">
               {{scope.row.category?scope.row.category:'--'}}
              </template>
            </el-table-column>
            <el-table-column prop="originalCode" label="原始款号" width="160" align="center">
              <template slot-scope="scope">
               {{scope.row.originalCode?scope.row.originalCode:'--'}}
              </template>
            </el-table-column>
            <el-table-column prop="num" label="采购总量" width="260" align="center"></el-table-column>
            <el-table-column prop="tax" label="税点" width="160" align="center">
              <template slot-scope="scope">
               {{scope.row.tax?scope.row.tax:'--'}}
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" label="采购单价" align="center" width="150">
              <template slot-scope="scope">
               {{scope.row.purchasePrice?scope.row.purchasePrice:'--'}}
              </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="采购单价(含税)" width="260" align="center">
              <template slot-scope="scope">
               {{scope.row.actualAmount?scope.row.actualAmount:'--'}}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="采购总金额" width="160" align="center"></el-table-column>
          </el-table>

          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="shopData.pageIndex"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalPage"
            ></el-pagination>
          </div>
        </div>
      </transition>
    </div>
    <div class="logistics">
      <span>订单进程：</span>

      <!-- 时间线 -->
      <div
        class="block mt-20 order-record"
        v-if="person.orderLogsVOS && person.orderLogsVOS.length > 0"
      >
        <el-timeline>
          <el-timeline-item
            :hide-timestamp="true"
            v-for="(activity, index) in person.orderLogsVOS"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.updateTime"
          >{{ activity.createTime | timestampToTime }}&nbsp;&nbsp;{{activity.logContent}}</el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      person: {},
      //标记是否显示商品列表
      showShopView: false,
      // 商品数据
      orderShopData: [],
      
      //记录总的商品数
      totalPage:0,
      shopData:{
        orderSn:'',
        pageIndex:1,
        pageSize:10
      }
    };
  },
  filters:{
    //过滤当前状态
    filterBusinessStatus(val) {
     switch (val) {
        case "06":
          return "未完成";
          break;
        case "08":
          return "已完成";
          break;
        default:
          return '--'
        break;    
      }
    },
  },
  mounted() {
    this.shopData.orderSn=this.$route.query.orderSn
    this.getPurchasDetailListMsg();
  },
  methods: {
    //顶部小箭头，点击返回ditch路由页面
    backToPreRoute() {
      this.$router.push({
        path: "/OS/channelSales/channelSales"
      });
      // this.$route.go(-1)
    },
    //得到表格数据
    getPurchasDetailListMsg() {
      this.request(this.api.order.channelPurchaseOrder_getByOrderSn, this.shopData).then(data => {
        console.log(data);
        console.log("145=============");
        this.person = data;
        if(data.channelOrderGoodsVOList.data){
          data.channelOrderGoodsVOList.data.forEach(item => {
            if(data.tax && data.tax!='0'){
              item.tax=data.tax
              item.amount=item.num * item.actualAmount
            }else{
              item.amount=item.num * item.purchasePrice
            }
          });
        }
        this.orderShopData = data.channelOrderGoodsVOList.data;
        this.totalPage=data.channelOrderGoodsVOList.totalCount;
      });
    },
    //点击查看更多商品
    showOrderShopView() {
      console.log("showOrderShopView");
    },
    //每页条数改变时
    handleSizeChange(page) {
      console.log(page);
    },
    // 当前页改变时
    handleCurrentChange(page) {
      console.log(page);
    }
  }
};
</script>

<style scoped>
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
  margin: 8px 8px 0;
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
  /* background-color: #fff; */
  margin: 0 10px;
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


