<!-- 工单池 -->
<template>
  <div>
    <div class="item-margin">
      <div class="booking_top">
        <!-- 工单基本信息 -->
        <div class="work-order-info booking_info">
          <h4>
            定制单号：{{ consumerReservationOrder_getObj.reservationOrderSn || '--' }}
            <!-- <el-button type="primary" size="mini" class="ml-20" disabled>量体中</el-button> -->
          </h4>
          <div class="booking_info_r">
            <span>量体</span>
          </div>
        </div>
        <div class="user">
          <div class="userInfo">
            <span class="userInfo-img">
              <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560636369707&di=660b9e0aa82cbb69272a92683fc8f6ce&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png" alt="">
            </span>
            <!-- <span class="userInfo-name">客服ID </span> -->
          </div>
          <ul class="info-list">
            <li>订单号：{{ consumerReservationOrder_getObj.reservationOrderSn || '--' }}</li>
            <!-- <li>状态：{{ consumerReservationOrder_getObj.status || '--' }}</li> -->
            <li>客户姓名：{{ consumerReservationOrder_getObj.receiverName || '--' }}</li>
            <li>客户电话：{{ consumerReservationOrder_getObj.mobile || '--' }}</li>
            <li>订单地址：{{ consumerReservationOrder_getObj.provinceName }}{{ consumerReservationOrder_getObj.cityName }}{{ consumerReservationOrder_getObj.areaName }}{{ consumerReservationOrder_getObj.addressInfo }}</li>
            <li>关联预约单号：{{ consumerReservationOrder_getObj.reservationOrderSn || '--' }}</li>
            <li>订单金额：{{ consumerReservationOrder_getObj.amount || '--' }}</li>
            <li>实付金额：{{ consumerReservationOrder_getObj.actualAmount || '--' }}</li>
            <li>支付方式：{{ consumerReservationOrder_getObj.paymentCode || '--' }}</li>
            <li>创建时间：{{ consumerReservationOrder_getObj.createTime | timestampToTime}}</li>
            <li>所属机构：{{ consumerReservationOrder_getObj.organization || '--' }}</li>
          </ul>
          <div class="right">
            <el-button type="primary" @click="isConsumer = !isConsumer">查看定制信息&nbsp;<i :class="['el-icon-arrow-down',{'el-icon-arrow-up':isConsumer}]"></i></el-button>
          </div>
        </div>
      </div>
      <div class="item-margin"></div>
    </div>
    <div class="item-margin">
      <div class="item-form">
        <!-- <el-steps :active="active" finish-status="success">
          <el-step title="测试数据"></el-step>
          <el-step title="确认预约"></el-step>
          <el-step title="上门量体"></el-step>
          <el-step title="客户评价/回访"></el-step>
          <el-step title="已完成"></el-step>
        </el-steps> -->
        <!-- 定制 -->
          <!-- <section> -->
          <section v-if="isConsumer">
            <ul  class="spu">
              <li>
                <div class="spu-border">
                  <span>定制清单</span>
                  <span>图片</span>
                  <span>数量</span>
                  <span>销售单价</span>
                  <span>备注</span>
                  <span>累计金额</span>
                </div>
              </li>
            </ul>
            <ul class="spu">
              <!-- 一级spu -->
              <li v-for="(item, index) in consumerReservationOrder_getObj.consumerCustomizedGoodsVOList" :key="index">
                <div>
                  <!-- spu名称 -->
                  <span class="text-left text-indent15" @click="item.isChecked = !item.isChecked">
                    <i :class="['el-icon-arrow-down',{'el-icon-arrow-up':item.isChecked}]"></i>&nbsp;{{ item.customizedProductName }}
                  </span>
                  <!-- spu图片 -->
                  <span>
                    <img :src="item.image" alt>
                  </span>
                  <!-- 数量 -->
                  <span>{{ item.quantity || '--' }}</span>
                  <!-- 销售单价 -->
                  <span>{{ item.price }}</span>
                  <!-- 备注 -->
                  <span>{{ item.remarks || '--' }}</span>
                  <!-- 累计金额 -->
                  <span>--</span>
                </div>
                <!-- 二级sku -->
                <ul class="spu" v-if="item.isChecked">
                  <li>
                    <div>
                      <span  class="text-left text-indent45">原料</span>
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                    </div>
                    <!-- 三级原料 -->
                    <ul class="spu">
                      <li  v-for="(items, indexs) in item.material" :key="indexs">
                        <div>
                          <span  class="text-left text-indent75">{{ items.name }}</span>
                          <span><img :src="items.image" alt></span>
                          <span>{{ items.quantity || '--' }}</span>
                          <span>￥{{ items.unitPrice || '--' }}</span>
                          <span>{{ items.remarks || '--' }}</span>
                          <span>{{ items.usageAmount || '--' }}</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div>
                      <span  class="text-left text-indent45">工艺 </span>
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                    </div>
                    <!-- 三级原料 -->
                    <ul class="spu">
                      <li  v-for="(items, indexs) in item.craft" :key="indexs">
                        <div>
                          <span class="text-left text-indent75">{{ items.name }}</span>
                          <span><img :src="items.image" alt></span>
                          <span>{{ items.quantity || '--' }}</span>
                          <span>￥{{ items.unitPrice || '--' }}</span>
                          <span>{{ items.remarks || '--' }}</span>
                          <span>￥{{ items.usageAmount || '--' }}</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
                <!-- 二级sku -->
              </li>
              <!-- 一级spu -->
          </ul>
          </section>
        <!-- 定制 -->
        <!-- 工单跟进记录 -->
        <div class="work-order-info mt-40"  v-if="consumerReservationOrder_getObj.orderLogsVOList && consumerReservationOrder_getObj.orderLogsVOList.length > 0">
          <span class="order-course">订单进程：</span>
        </div>
        <!-- 时间线 -->
        <div class="block mt-20 order-record"  v-if="consumerReservationOrder_getObj.orderLogsVOList && consumerReservationOrder_getObj.orderLogsVOList.length > 0">
          <el-timeline>
            <el-timeline-item
            :hide-timestamp="true"
            v-for="(activity, index) in consumerReservationOrder_getObj.orderLogsVOList"
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
        isConsumer:true,
        consumerReservationOrder_getObj:{},
        orderStatus:{
            100:'量体待确认',
            101:'量体安排中',
            102:'等待量体中',
            103:'量体中',
            104:'已量体',
            105:'量体订单待回访'
         },
         orderType:{
            20001:'量体预约单',
            20002:'定制订单',
         },
        consumerReservationOrder_getObj:{},
        workOrderLog_list:{},
        tableItemGetListMapObj:{},
        active: 3
      };
    },
    created() {
      this.consumerReservationOrder_get(this.$route.query.orderId);
      // this.getWorkOrderLog_list(this.$route.query.number);
    },
    methods: {
      /**
       * 获取定制订单详情基本信息
       */
      consumerReservationOrder_get(orderId) {
        const that = this;

        this.request(
          that.api.order.consumerCustomizedOrder_get,
          {
            orderId
          }
        ).then(res => {
          res.consumerCustomizedGoodsVOList.forEach((item, index) => {
            item.isChecked = false;
            item.craft = [];// 工艺
            item.material = [];// 原料
            item.productGoodsMaterials.forEach((items, indexs) => {
              if(items.type == 1) {
                item.craft.push(items);
              }else{
                item.material.push(items);
              }
            });
          });
          this.consumerReservationOrder_getObj = res;
        });
      },
      /**
       *
       */
      formatDuring(mss) {
          var days = parseInt(mss / (1000 * 60 * 60 * 24));
          var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = (mss % (1000 * 60)) / 1000;
          return `${days}天${hours}时${minutes}分`;
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
      /**
       * 添加一条跟进记录
       */
      addHistoryWorkOrderFollowUp() {
        const that = this;
        console.log(this.consumerReservationOrder_getObj)
        this.request(
          that.api.job_order.addHistoryWorkOrderFollowUp,
          Object.assign(this.consumerReservationOrder_getObj, {
            updateName: this.userInfo.loginName
          })
        ).then(res => {
          this.warn('添加成功！','success');
          this.getWorkOrderLog_list();
        });
      },
      open() {
        this.$prompt("添加一条跟进记录", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(({ value }) => {
          if(!value) return;
          this.consumerReservationOrder_getObj.remarks = value;
          this.addHistoryWorkOrderFollowUp();
        })
      }

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
