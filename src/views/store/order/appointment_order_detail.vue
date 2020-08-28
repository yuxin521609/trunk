<!-- 详情 -->
<template>
  <div>
    <div class="item-margin">
      <div class="booking_top">
        <!-- 工单基本信息 -->
        <div class="work-order-info booking_info">
          <h4>
            预约单号：{{ consumerReservationOrder_getObj.orderSn || '--' }}
            <!-- <el-button type="primary" size="mini" class="ml-20" disabled>已搭配</el-button> -->
          </h4>
        </div>
        <div class="user">
          <div class="userInfo">
            <span class="userInfo-img">
              <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560636369707&di=660b9e0aa82cbb69272a92683fc8f6ce&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png" alt="">
            </span>
            <!-- <span class="userInfo-name">客服ID 女</span> -->
          </div>
          <ul class="info-list">
            <li>客户姓名：{{ consumerReservationOrder_getObj.userName || '--' }}</li>
            <li>客户电话：{{ consumerReservationOrder_getObj.a || '--' }}</li>
            <li>预约电话：{{ consumerReservationOrder_getObj.mobile || '--' }}</li>
            <li>预约途径：微信小程序</li>
            <li>预约门店：{{ consumerReservationOrder_getObj.storeName || '--' }}</li>
            <li>服务人员：{{ consumerReservationOrder_getObj.operatorName || '--' }}</li>
            <li>预约试穿时间：{{ consumerReservationOrder_getObj.a || '--' }}</li>
            <li>创建时间：{{ consumerReservationOrder_getObj.createTime | timestampToTime}}</li>
            <li>关联内容：{{ consumerReservationOrder_getObj.fit || '--' }}</li>
            <li>所属机构：{{ consumerReservationOrder_getObj.organization || '--' }}</li>
            <li>备注：{{ consumerReservationOrder_getObj.remarks || '--' }}</li>
          </ul>
        </div>
      </div>
      <div class="item-margin"></div>
    </div>
    <div class="item-margin">
      <div class="item-form">
        <!-- 订单跟进记录 -->
        <div class="work-order-info mt-40" v-if="consumerReservationOrder_getObj.orderLogsVOList && consumerReservationOrder_getObj.orderLogsVOList.length > 0">
          <span class="order-course">预约服务进程：</span>
        </div>
        <!-- 时间线 -->
        <div class="block mt-20 order-record" v-if="consumerReservationOrder_getObj.orderLogsVOList && consumerReservationOrder_getObj.orderLogsVOList.length > 0">
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
<!-- 详情 -->
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
      this.consumerReservationOrder_get(this.$route.query.orderSn);
    },
    methods: {
      /**
       * 获取量体订单详情基本信息
       */
      consumerReservationOrder_get(orderSn) {
        const that = this;

        this.request(
          that.api.order.consumerReservationOrder_get,
          {
            orderSn
          }
        ).then(res => {
          that.consumerReservationOrder_getObj = res;
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
</style>
