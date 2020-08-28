<!-- 工单池 -->
<template>
  <div>
    <div class="item-margin">
      <div class="booking_top">
        <!-- 工单基本信息 -->
        <h4>退货单信息</h4>
        <div class="user">
          <ul class="info-list">
            <li>门店名称：{{ getOrderDetailObj.storeConsumerRefundVO.storeName || '--' }}</li>
            <li>隶属机构：{{ getOrderDetailObj.storeConsumerRefundVO.organization || '--' }}</li>
            <li>单据状态：{{ refundOrderStatus[getOrderDetailObj.storeConsumerRefundVO.refundOrderStatus] || '--' }}</li>
            <li>退货单号：{{ getOrderDetailObj.storeConsumerRefundVO.refundOrderNum || '--' }}</li>
            <li>退货件数：{{ getOrderDetailObj.storeConsumerRefundVO.refundSumQuantity || '--' }}</li>
            <li>退货总金额：￥{{ getOrderDetailObj.storeConsumerRefundVO.refundSumAmount || '--' }}</li>
            <li>客户姓名：{{ getOrderDetailObj.storeConsumerRefundVO.userName || '--' }}</li>
            <li>联系电话：{{ getOrderDetailObj.storeConsumerRefundVO.mobile || '--' }}</li>
          </ul>
        </div>
        <h4 class="mt-10">退货商品信息</h4>
        <el-table
          class="mt-20"
          :data="getOrderDetailObj.storeConsumerRefundProductInfoVOS"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true">
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
          <el-table-column align="left" label="吊牌价" min-width="130">
              <template  slot-scope="scope">{{ scope.row.retailPrice ? `￥${scope.row.retailPrice}` : '--' }}</template>
          </el-table-column>
          <el-table-column align="left" label="销售单价" min-width="130">
              <template  slot-scope="scope">{{ scope.row.salesUnitPrice ? `￥${scope.row.salesUnitPrice}` : '--' }}</template>
          </el-table-column>
          <el-table-column align="left" label="退货数量" min-width="130">
              <template  slot-scope="scope">{{ scope.row.quantity || '--' }}</template>
          </el-table-column>
            <el-table-column align="left" label="优惠均摊后单价" min-width="130">
              <template  slot-scope="scope">{{ scope.row.discountUnitPrice ? `￥${scope.row.discountUnitPrice}` : '--' }}</template>
          </el-table-column>
            <el-table-column align="left" label="退货金额" min-width="130">
              <template  slot-scope="scope">{{ scope.row.refundAmount ? `￥${scope.row.refundAmount}` : '--' }}</template>
          </el-table-column>
        </el-table>
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
  import { mapGetters } from 'vuex';
  import * as userTypes from "@/types/userConfig";
  let token = getToken();

  export default {
    data() {
      return {
         // 商品信息是否显示
        isConsumer:false,
        refundOrderStatus:{
            0:'待审核',
            1:'已审核'
         },
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
         // 订单商品类型
         PaymentWayCode:{
            1:'线下付款',
            2:'微信付款',
            3:'信用卡'
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
      this.getOrderDetail(this.$route.query.id);
      // this.getWorkOrderLog_list(this.$route.query.number);
    },
    methods: {
      /**
       * 获取详情基本信息
       */
      getOrderDetail(id) {
        const that = this;

        this.request(
          that.api.store.storeConsumerRefund_getByRefundOrderNum,
          {
            refundOrderNum:id
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
    computed: {
      ...mapGetters({
        userInfo: userTypes.GETTER_USERINFO
      })
    },
    components: {
      codeSet,
      treeDept
    }
  }
</script>
<style  lang="less" scoped>
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
    padding: 20px;
    .overstrikings{
      font-weight: bold;
      color: #000;
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
  }
  .info-list {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    li {
      width: 24%;
      padding-bottom: 15px;
      text-indent: 30px;
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
