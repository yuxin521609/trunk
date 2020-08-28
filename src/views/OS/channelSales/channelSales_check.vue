<template>
  <div>
    <div class="middle">
       <h3>渠道销售订单号: {{person.orderSn}}</h3>
       <span>{{person.reviewed | filterReviewed}}</span>
    </div>

    <div class="middle-msg">
      <el-row :gutter="20">
        <el-col :span="6">
                <span>购买商户：{{person.storeName?person.storeName:'--'}}</span><br>
                <span style="display:inline-block; margin:15px 0;">订单金额：{{person.amount | filterPrice}}</span><br>
                <span>物流公司：{{person.logisticsCompany?person.logisticsCompany:'--'}}</span>
        </el-col>
        <el-col :span="5">
                <span>收货人：{{person.receiverName?person.receiverName:'--'}}</span> <br>
                <span style="display:inline-block; margin:15px 0;">实付金额：{{person.validAmount | filterPrice}}</span> <br>
                <span>物流单号：{{person.logisticsOrderSn?person.logisticsOrderSn:'--'}}</span>  
        </el-col>
        <el-col :span="5">
                <!-- <span>订单来源：{{person.channelCode | filterChannelCode}}</span> <br> -->
                <span>联系电话：{{person.receiverMobile?person.receiverMobile:'--'}}</span> <br>
                <span style="display:inline-block; margin:15px 0;">支付时间：{{person.paymentTime | timestampToTime}}</span> <br>
                <span>创建时间：{{person.createTime | timestampToTime}}</span> <br /> 
        </el-col>
        <el-col :span="8">
                <span>收货地址：{{person.addressInfo}}</span><br>
                <span style="display:inline-block; margin:15px 0;">备注：{{person.remarks?person.remarks:'--'}}</span> <br>
                <span>所属机构：{{person.organization?person.organization:'--'}}</span>
        </el-col>
      </el-row>
      <label class="btnLabel" @click="showShopView=!showShopView">查看订单商品</label>
    </div>
     <div class="shopView">
        <transition name="el-zoom-in-top">
          <div v-show="showShopView" class="transition-box">
            <span style="font-weight:700">订单商品列表</span>
            <el-table :data="orderShopData" stripe style="width: 100%" header-row-class-name='item-table-header'>
                
                <el-table-column prop="productCode" label="商品款号" align="center" width="200">
                </el-table-column>

                <el-table-column prop="code" label="商品货号" align="center" width="200">
                </el-table-column>

                <el-table-column label="商品图片" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.image" style="width:32px;height:32px">
                  </template>
                </el-table-column>

                <el-table-column prop="brandName" label="品牌" align="center">
                  <template slot-scope="scope">
                     <span> {{scope.row.brandName ? scope.row.brandName:'--'}} </span>                      
                  </template>
                </el-table-column>

                <el-table-column prop="num" label="数量" width="120" align="center">
                </el-table-column>

                <el-table-column prop="retailPrice" label="吊牌价" width="200" align="center">
                  <template slot-scope="scope">
                     <span> {{scope.row.retailPrice | filterPrice}} </span>                      
                  </template>
                </el-table-column>

                <el-table-column prop="sellPrice" label="销售单价" width="200" align="center">
                  <template slot-scope="scope">
                     <span> {{scope.row.sellPrice | filterPrice}} </span>                      
                  </template>
                </el-table-column>

                <el-table-column prop="" label="销售总金额" width="200" align="center">
                  <template slot-scope="scope">
                     <span> {{scope.row.amount | filterPrice}} </span>                      
                  </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top:20px;padding-bottom:10px;margin-right:20px;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="shopData.pageIndex"
                :page-sizes="[10,20,30,40]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totlePage"
              ></el-pagination>
            </div>
          </div>
        </transition>
     </div>
      <!-- 工单跟进记录 -->
      <div class="item-margin" v-if="person.orderLogsVOS && person.orderLogsVOS.length > 0">
        <div class="work-order-info mt-20">
          <span class="order-course">订单进程：</span>
        </div>
        <!-- 时间线 -->
        <div class="block mt-20 order-record"  v-if="person.orderLogsVOS && person.orderLogsVOS.length > 0">
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
        person:{},
        //标记是否显示商品列表
        showShopView:false,
        // 商品数据
        orderShopData:[],
        //记录总的商品数
        totlePage:0,
        shopData:{
          orderSn:'',
          pageIndex:1,
          pageSize:10
        }
    };
  },
  filters:{
    filterChannelCode(val){
         switch(val){
            case '01':
               return '淘宝'
            break;
            case '02':
               return '京东'
            break;
            case '03':
               return '天猫'
            break;
            case '04':
               return '手工录入'
            break;
         }
      },
      filterPrice(val) {
          if (val && val != null) {
             val = String(val);
             let left = val.split('.')[0], right = val.split('.')[1];
             right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
             let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
             return '￥' + (Number(val) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
          } 
          else if (val === 0) { // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
              return '￥' + '0.00';
          } 
          else {
              return '--';
          }
      },
      filterReviewed(val) {
        switch(val) {
          case 0:
            return '待审核'
          break;
          case 1:
            return '已审核'
          break;
          case 2:
            return '已驳回'
          break;
        }
      }
  },
  mounted(){
    console.log(this.$route.query.orderSn)
    this.shopData.orderSn=this.$route.query.orderSn
    //得到详情数据
    this.getChannelDetailListData()
  },
  methods: {
    //顶部小箭头，点击返回ditch路由页面
    backToPreRoute() {
      this.$router.push({
        path: "/OS/channelSales/channelSales"
      });
    },
    //得到详情数据
    getChannelDetailListData(){
      this.request(this.api.order.channelSaleOrder_get,this.shopData).then(res=>{
        console.log(res)
        this.person=res
        this.orderShopData=res.channelSaleOrderGoodsVOList.data;
        this.totlePage=res.channelSaleOrderGoodsVOList.totalCount;
      })
    },
    //点击产看更多商品
    showOrderShopView(){
     console.log("showOrderShopView");
    },
    //每页条数改变时
    handleSizeChange(page){
      this.shopData.pageSize=page
      //条数发生改变刷新数据
      this.getChannelDetailListData()
    },
    // 当前页改变时
    handleCurrentChange(page){
      console.log(page)
      this.shopData.pageIndex=page
      //条数发生改变刷新数据
      this.getChannelDetailListData()
    }
  }
};
</script>

<style scoped>
.item-margin{
  margin: 8px;
  padding: 20px;
  background: #fff;
}
.order-course{
  font-size: 16px;
}
.order-record{
  height: 500px;
  overflow-y: scroll;
}
.title {
  background-color: #fff;
  padding: 15px 0 15px 30px;
}
.title > span {
  display: inline-block;
  background-color: #fff;
  margin-left: 3px;
}
.middle{
    background-color: #fff;
    margin: 8px 8px 0;
    padding: 10px;
    position: relative;
    border-bottom: 1px solid #ccc;
}
.middle>span{
    position: absolute;
    top: 17px;
    left: 520px;;
    background-color: pink;
    padding: 0 5px;
    border-radius: 3px;
    color: #fff;
}
.middle-msg{
    background-color: #fff;
    margin: 0 10px ;
    padding: 10px;
    position: relative;
    border-bottom: 1px solid #ccc;
}
.btnLabel{
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
    font-weight: 500;  
  }
  .shopView{
    margin: 0 10px ;
  }
  .logistics{
      background-color: #fff;
      margin:10px;
      height: 100%;
      margin-bottom: 0;
      padding-top: 20px;
      padding-left: 30px;
  }
  .logistics>div::-webkit-scrollbar {
        display: none;
    }
  .logistics>div{
     height: 200px;
     background-color: #fff;
     overflow: hidden;
     overflow-x: hidden;
     overflow-y: scroll;
  }
</style>
