<!-- 工单池 -->
<template>
  <div>
    <div class="item-margin">
      <div class="booking_top">
        <!-- 工单基本信息 -->
        <div class="work-order-info booking_info">
          <h4>
            订单号：{{ getOrderDetailObj.storeRetailOrderVO.orderNum }}
            <el-button size="mini" disabled type="primary" class="ml-10">{{ orderStatus[getOrderDetailObj.storeRetailOrderVO.orderStatus] }}</el-button>
          </h4>
        </div>
        <div class="user">
          <div class="userInfo">
            <span class="userInfo-img">
              <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560636369707&di=660b9e0aa82cbb69272a92683fc8f6ce&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png" alt="">
            </span>
          </div>
          <ul class="info-list">
            <li>客户姓名：{{ getOrderDetailObj.storeRetailOrderVO.userName || '--' }}</li>
            <li>客户电话：{{ getOrderDetailObj.storeRetailOrderVO.mobile || '--' }}</li>
            <li>关联预约单号：{{ getOrderDetailObj.storeRetailOrderVO.reservationOrderNum || '--' }}</li>
            <li>所属机构：{{ getOrderDetailObj.storeRetailOrderVO.organization || '--' }}</li>
            <li>零售门店：{{ getOrderDetailObj.storeRetailOrderVO.storeName || '--' }}</li>
            <li>开单人：{{ getOrderDetailObj.storeRetailOrderVO.imageHousekeeperName || '--' }}</li>
            <!-- <li>搭配师：{{ getOrderDetailObj.storeRetailOrderVO.stylistName || '--' }}</li> -->
            <li>销售件数：{{ getOrderDetailObj.sumQuantity || '--' }}</li>
            <li>创建时间：{{ getOrderDetailObj.storeRetailOrderVO.createTime | timestampToTime}}</li>
            <li>订单金额：￥{{ getOrderDetailObj.storeRetailOrderPaymentVO.orderAmount || '--' }}</li>
            <li>支付金额：￥{{ getOrderDetailObj.storeRetailOrderPaymentVO.acturalPaidAmount || '--' }}</li>
            <li>支付方式：{{ PaymentWayCode[getOrderDetailObj.storeRetailOrderPaymentVO.paymentCode] || '--' }}</li>
            <li>支付时间：{{ getOrderDetailObj.storeRetailOrderPaymentVO.paymentTime | timestampToTime }}</li>
            <li>备注：{{ getOrderDetailObj.storeRetailOrderVO.remark || '--' }}</li>
          </ul>
          <div class="right">
            <el-button type="primary" @click="isConsumer = !isConsumer">{{ isConsumer ? '收起订单商品' : '查看订单商品' }}&nbsp;<i :class="[isConsumer ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i></el-button>
          </div>
        </div>
      </div>
      <div class="item-margin"></div>
    </div>
    <div class="goodsLit" v-if="isConsumer">
      <el-table
         :data="getOrderDetailObj.storeRetailOrderProductInfoVOS"
         stripe
         max-height="350"
         empty-text="暂无数据"
         header-align="center"
         header-row-class-name="item-table-header"
         :highlight-current-row="true">
         <el-table-column align="left" label="商品款号" min-width="130">
            <template  slot-scope="scope">{{ scope.row.productCode || '--' }}</template>
         </el-table-column>
         <el-table-column align="left" label="商品货号" min-width="130">
            <template  slot-scope="scope">{{ scope.row.goodsCode || '--' }}</template>
         </el-table-column>
         <el-table-column align="left" label="商品图片" min-width="130">
            <template  slot-scope="scope">
               <img :src="scope.row.image" alt="" class="tabImg">
            </template>
         </el-table-column>
         <el-table-column align="left" label="品牌" min-width="130">
            <template  slot-scope="scope">{{ scope.row.brandName || '--' }}</template>
         </el-table-column>
         <el-table-column align="left" label="数量" min-width="50">
            <template  slot-scope="scope">{{ scope.row.quantity || '--' }}</template>
         </el-table-column>
         <el-table-column align="left" label="" min-width="80">
            <template  slot-scope="scope" v-if="scope.row.refundQuantity"><el-button size="mini" type="warning" plain disabled>退{{ scope.row.refundQuantity }}</el-button></template>
         </el-table-column>
         <el-table-column align="left" label="吊牌价" min-width="130">
            <template  slot-scope="scope">{{ scope.row.price || '--' }}</template>
         </el-table-column>
         <el-table-column align="left" label="销售单价" min-width="130">
            <template  slot-scope="scope">￥{{ scope.row.retailPrice || '--' }}</template>
         </el-table-column>
         <el-table-column align="left" label="销售金额" min-width="130">
            <template  slot-scope="scope">￥{{ scope.row.salesAmount || '--' }}</template>
         </el-table-column>
      </el-table>
      <!-- 商品金额 -->
      <div class="good-price">
        <el-form label-width="200px">
          <el-form-item label="商品总价:" v-if="getOrderDetailObj.storeRetailOrderPaymentVO.productSumAmount">
            <div>￥{{ getOrderDetailObj.storeRetailOrderPaymentVO.productSumAmount }}</div>
          </el-form-item>
          <el-form-item 
            v-if="otherDiscountValue || singleProductDiscountValue || couponDiscountValue || reservationDiscountValue"
            label="订单优惠:">
            <!-- 阶梯价格 -->
            <div class="font-size18" v-if="otherDiscountValue">-￥{{ otherDiscountValue }}</div>
            <!-- 阶梯文案 -->
            <div class="mb-20 line-height20" v-if="otherDiscount">（{{ otherDiscount }}）</div>
            <!-- 单品价格 -->
            <div class="font-size18" v-if="singleProductDiscountValue">-￥{{ singleProductDiscountValue }}</div>
            <!-- 单品文案 -->
            <div class="mb-20 line-height20" v-if="singleProductDiscountValue">（单品折扣优惠￥{{ singleProductDiscountValue }}）</div>
            <!-- 优惠券价格 -->
            <div class="font-size18" v-if="couponDiscountValue">-￥{{ couponDiscountValue }}</div>
            <!-- 优惠券文案 -->
            <div class="mb-20 line-height20" v-if="couponDiscountValue">（优惠券优惠￥{{ couponDiscountValue }}）</div>
            <!-- 预约价格 -->
            <div class="font-size18" v-if="reservationDiscountValue">-￥{{ reservationDiscountValue }}</div>
            <!-- 预约文案 -->
            <div class="mb-20 line-height20" v-if="reservationDiscount">（{{ reservationDiscount }}）</div>
            <!-- 改价优惠 -->
            <div class="font-size18" v-if="changePriceBalance">￥{{ changePriceBalance }}</div>
            <!-- 改价文案 -->
            <div class="mb-20 line-height20" v-if="changePriceBalance">（改价优惠{{ changePriceBalance }}）</div>
          </el-form-item>
          <el-form-item class="el-form-size" label="应付金额:">
            <div>￥{{ getOrderDetailObj.storeRetailOrderPaymentVO.orderAmount }}</div>
          </el-form-item>
          <el-form-item label="支付方式:" v-if="getOrderDetailObj.storeRetailOrderPaymentVO.paymentCode !== null">
            <div>{{ PaymentWayCode[getOrderDetailObj.storeRetailOrderPaymentVO.paymentCode] }}</div>
          </el-form-item>
          <el-form-item label="支付流水号:" v-if="getOrderDetailObj.storeRetailOrderPaymentVO.paymentNum">
            <div>{{ getOrderDetailObj.storeRetailOrderPaymentVO.paymentNum }}</div>
          </el-form-item>
          <el-form-item class="el-form-size" label="实付金额:">
            <div>￥{{ getOrderDetailObj.storeRetailOrderPaymentVO.orderAmount }}</div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 商品金额 -->
      <!-- 工单跟进记录 -->
      <div class="work-order-info mt-40"  v-if="getOrderDetailObj.orderLogsVOList && getOrderDetailObj.orderLogsVOList.length > 0">
         <span class="order-course">订单进程：</span>
      </div>
      <!-- 时间线 -->
      <div class="block mt-20 order-record"  v-if="getOrderDetailObj.orderLogsVOList && getOrderDetailObj.orderLogsVOList.length > 0">
         <el-timeline>
         <el-timeline-item
         :hide-timestamp="true"
         v-for="(activity, index) in getOrderDetailObj.orderLogsVOList"
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
<!-- 工单池 -->
<script>
  import axios from "axios";
  import { getToken } from "@/utils/auth";
  import codeSet from "@/components/codeSet";
  import treeDept from "@/components/treeDept";
  import { filter } from "minimatch";
  import { get } from "http";
  import * as userTypes from "@/types/userConfig";
  let token = getToken();

  export default {
    data() {
      return {
         // 商品信息是否显示
        isConsumer:true,
        // 数据对象
        getOrderDetailObj:{},
         // 订单状态
         orderStatus:{
            101:'未完成',
            102:'已完成',
            103:'已关闭'
         },
         // 订单商品类型
         OrderProductType:{
            0:'服装商品',
            1:'虚拟商品'
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
        workOrderLog_list:{},
        tableItemGetListMapObj:{},
        active: 3
      };
    },
    created() {
      this.getOrderDetail(this.$route.query.id, this.$route.query.storeId);
      // this.getWorkOrderLog_list(this.$route.query.number);
    },
    computed: {
      // 阶梯价格
      otherDiscountValue() {
        return this.getOrderDetailObj.storeRetailOrderPaymentVO.otherDiscountValue;
      },
      // 阶梯文案
      otherDiscount() {
        return this.getOrderDetailObj.storeRetailOrderPaymentVO.otherDiscount;
      },
      // 单品价格
      singleProductDiscountValue() {
        return this.getOrderDetailObj.storeRetailOrderPaymentVO.singleProductDiscountValue;
      },
      // 优惠券价格
      couponDiscountValue() {
        return this.getOrderDetailObj.storeRetailOrderPaymentVO.couponDiscountValue;
      },
      // 预约价格
      reservationDiscountValue() {
        return this.getOrderDetailObj.storeRetailOrderPaymentVO.reservationDiscountValue;
      },
      // 预约文案
      reservationDiscount() {
        return this.getOrderDetailObj.storeRetailOrderPaymentVO.reservationDiscount;
      },
      // 改价优惠
      changePriceBalance() {
        return this.getOrderDetailObj.storeRetailOrderPaymentVO.changePriceBalance;
      },
    },
    methods: {
      /**
       * 获取门店销售订单详情
       */
      getOrderDetail(id, storeId) {
        const that = this;

        this.request(
          that.api.store.storeRetailOrder_getByStoreIdAndOrderNumGroup,
          {
            "fuzzyQuery": "",
            "storeId": storeId,
            "orderNum":id,
         }
        ).then(res => {
          this.getOrderDetailObj = res;
        });
      },
      /**
      * 提示
      */
      warn(message, type) {
        this.$message({
          message: message,
          type: type || 'warning'
        });
      },
      /**
       * 获取定制订单跟进记录列表
       */
      getWorkOrderLog_list(number) {
        const that = this;

        this.request(
          that.api.job_order.getWorkOrderLog_list,
          {
            number
          }
        ).then(res => {
          that.workOrderLog_list = res.data.reverse();
        });
      },
    },
    components: {
      codeSet,
      treeDept
    }
  }
</script>
<style  lang="less" scoped>
.font-size18{
  font-size: 18px;
}
.line-height20{
  line-height: 20px;
}
.mb-20{
  margin-bottom:20px;
}
.good-price{
  display: flex;
  justify-content: flex-end;
  div{
    text-align: right;
  }
}
.el-form-item{
  margin: 0;
}
.el-form-item /deep/.el-form-item__label{
  padding-right: 40px;
}
.el-form-size /deep/ .el-form-item__label,.el-form-size div {
  font-size: 18px;
  font-weight: 600;
}
.goodsLit{
   margin: 8px;
   padding: 20px;
   background: #fff;
}
.tabImg{
   width: 50px;
   height: 50px;
}
.right{
    align-self:flex-end; // 垂直居下样式设置
    margin: 0 30px 20px 0;
  }
  .order-record{
    height: 700px;
    overflow-y: scroll;
  }
  h5 {
    color: #222;
    margin-left: -15px;
  }
  .order-course{
    font-size: 16px;
  }
  .test {
    color: #9d9d9d;
  }
  .work-order-info {
    display: flex;
    justify-content: space-between;
  }
  .booking_top{
    background: #fff;
  }
  .booking_info{
    h4{
      padding: 10px 0 10px 30px;
    }
    border-bottom: 1px solid #f5f5f5;
    .booking_info_r{
      width: 0px;
      height: 0px;
      border-color: transparent #a0cfff;
      border-width: 0px 100px 50px 0px;
      border-style: solid;
      position: relative;
      span{
        width: 50px;
        position: absolute;
        top: 5px;
        left: 60px;
        color: #fff;
      }
    }
  }
  .user{
    display: flex;
    // align-items:center;
  }
  .userInfo{
    padding: 20px 30px 30px 30px;
    .userInfo-img{
      display: block;
      width: 50px;
      height: 50px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50px;
      }
    }
  }
  .examine{
    align-self:flex-end;
    margin: 0 30px 20px 0;
  }
  .info-list {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    li {
      width: 25%;
      padding-bottom: 15px;
    }
  }
  .jdbcType-image{
    width: 35px;
    height: 35px;
  }
  .the-results{
    width: 1400px;
    display: flex;
    text-align: right;
    flex-wrap: wrap;
    .the-results-span{
      width: 350px;
    }
  }
  .the-results-three-rows{
    width: 1050px;
  }
  .text-indent15{
    text-indent: 15px;
  }
  .text-indent45{
    text-indent: 45px;
  }
    .text-indent75{
    text-indent: 75px;
  }
  .color243{
    color:rgb(243, 131, 3);
  }
.spu {
  li {
    div{
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      span {
        height: 50px;
        flex: 1;
        line-height: 50px;
        position: relative;
        text-align: center;
      }
      .text-left{
        text-align: left;
      }
      img {
        width: 40px;
        height: 40px;
      }
    }
    .spu-border {
      border-bottom: 1px solid rgb(243, 131, 3);
    }
  }
}
  .display-flex{
    display: flex;
  }
  .subImg{
    width: 35px;
    height: 35px;
  }
  .correlationData-p{
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  h5 {
    color: #222;
    margin-left: -30px;
  }
  .s{
    margin-top:10px;
    display:block;
    font-size:15px;
  }
  .test {
    color: #9d9d9d;
  }
  .work-order-info {
    display: flex;
    justify-content: space-between;
  }
  .info-list {
    display: flex;
    width: 80%;
    flex-wrap: wrap;
    padding: 15px 10px 0 10px;
    li {
      padding-bottom: 10px;
      margin-right: 30px;
    }
  }
  .correlationData{
    height: 300px;
    overflow-y:scroll;
    padding:0 15px 15px 15px;
      h3{
        font-size: 16px;
        padding: 15px 0;
      }
      ul{
        display: flex;
        flex-wrap:wrap;
        li{
          width: 20%;
          text-indent: 20px;
          padding: 5px 0;
        }
        img{
          width: 120px;
          height: 150px;
        }
        span{
          display: block;
          margin-top: 10px;
        }
      }
  }
</style>
