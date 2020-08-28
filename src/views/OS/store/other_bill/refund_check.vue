<template>
    <div class="detail_div">
    <label>退款信息</label>
    <div class="middle-msg">
      <el-row :gutter="20">
        <el-col :span="6">
          <span>退款单号：{{person.refundMoneyOrderNum?person.refundMoneyOrderNum:'--'}}</span>
          <br />
          <span>支付订单号：{{person.paymentNum?person.paymentNum:'--'}}</span>
          <br />
          <span>单据状态：{{person.refundMoneyOrderStatus | filterRefundMoneyOrderStatus}}</span>
        </el-col>
        <el-col :span="5">
          <span>生成时间：{{person.createTime | timestampToTime}}</span>
          <br />
          <span>退款原因：{{person.reason?person.reason:"--"}}</span>
          <br />
          <span>源订单号：{{person.sourceOrderNum?person.sourceOrderNum:'--'}}</span>
        </el-col>
        <el-col :span="5">
          <span>退款总金额：{{person.refundMoney?person.refundMoney:'--'}}</span>
          <br />
          <span>退款方式：{{person.refundMoneyWayCode | filterRefundMoneyWayCode}}</span>
          <br />
         <span>关联退货单号：{{person.refundOrderNum?person.refundOrderNum:'--'}}</span>
        </el-col>
      </el-row>
    </div>
    <label>返款日志</label>
    <div class="block mt-20 order-record"  v-if="person.storeConsumerRefundMoneyLogList && person.storeConsumerRefundMoneyLogList.length > 0">
      <el-timeline>
        <el-timeline-item
        :hide-timestamp="true"
        v-for="(activity, index) in person.storeConsumerRefundMoneyLogList"
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
</template>

<script>
export default {
    data () {
       return {
           person:{}
       }
    },
    //过滤器
    filters: {
        //过滤单据状态
        filterRefundMoneyOrderStatus(val) {
            switch (val) {
                case 0:
                return "退款中";
                break;
                case 1:
                return "已退款";
                break;
                case 2:
                return "退款异常";
                break;
            }
        },
        //过滤退款方式
        filterRefundMoneyWayCode(val){
            switch(val){
                case 1:
                return '现金付款';
                break;
                case 2:
                return '微信付款';
                break;
                case 3:
                return '银行卡';
                break;
            }
        }
    },
  mounted () {
    //通过id得到退款单的详情
    this.getRefundDetailById(this.$route.query.refundId)
    //得到退款单日志详情
    // this.getRefundLogByRefundMoneyOrderId(this.$route.query.refundMoneyOrderId)
  },
  methods: {
    //通过id得到退款单的详情
    getRefundDetailById(refundId){
      this.request(this.api.retailStore.storeConsumerRefundMoney_get,{
        id:refundId
      }).then(res=>{
        console.log(res)
        this.person=res
      })
    },
    //得到退款单日志详情
    getRefundLogByRefundMoneyOrderId(refundMoneyOrderId){
      this.request(this.api.retailStore.storeConsumerRefundMoneyLog_listByRefundMoneyOrderId,{
        refundMoneyOrderId:refundMoneyOrderId
      }).then(res=>{
        console.log(res)
        this.person=res
      })
    }
  }
}
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
