<!-- 工单池 -->
<template>
  <div>
    <div class="item-margin">
      <div class="item-form">
        <!-- 工单基本信息 -->
        <div class="work-order-info">
          <span>
            工单基本信息：
            <el-button type="primary" size="mini" disabled>{{ jobOrderStatus[historyWorkOrderGetByNumObj.jobOrderStatus] }}</el-button>
          </span>
          <span>累计耗时：{{ historyWorkOrderGetByNumObj._createTime }}</span>
        </div>
        <ul class="info-list">
          <li>工单名称：{{ historyWorkOrderGetByNumObj.name }}</li>
          <li>业务类型：{{ "CEN012"| codeToName(historyWorkOrderGetByNumObj.businessType) }}</li>
          <li>服务类型：{{ "CEN013"| codeToName(historyWorkOrderGetByNumObj.serviceType) }}</li>
          <li>优先级：{{ priority[historyWorkOrderGetByNumObj.priority] }}</li>
          <li>创建时间：{{ historyWorkOrderGetByNumObj.createTime | timestampToTime  }}</li>
          <li v-if="historyWorkOrderGetByNumObj.assignee">接单人：{{ historyWorkOrderGetByNumObj.assignee }}</li>
          <br/>
        </ul>
          <p class="correlationData-p" v-if="historyWorkOrderGetByNumObj.sourceChileType == 'measuringWorkOrder'">
            关联数据：
            <el-button size="small" type="primary" @click="isCorrelationDataShow = !isCorrelationDataShow">
              查看量体工单
              <i class="el-icon-arrow-down el-icon--right" :class="{'el-icon-arrow-up':false}"></i>
            </el-button>
          </p>
          <p class="correlationData-p" v-if="historyWorkOrderGetByNumObj.sourceChileType == 'consumerCustomizedOrder'">
            关联订单：
            <el-button size="small" type="primary" @click="isConsumer = !isConsumer">
              查看定制订单
              <i class="el-icon-arrow-down el-icon--right" :class="{'el-icon-arrow-up':false}"></i>
            </el-button>
          </p>
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
              <li v-for="(item, index) in consumerCustomizedOrder_obj.consumerCustomizedGoodsVOList" :key="index">
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
                          <span>{{ items.unitPrice || '--' }}</span>
                          <span>{{ items.remarks || '--' }}</span>
                          <span>{{ items.usageAmount || '--' }}</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div>
                      <span style="background:#fff;" class="text-left text-indent45">工艺 </span>
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
                          <span>{{ items.unitPrice || '--' }}</span>
                          <span>{{ items.remarks || '--' }}</span>
                          <span>{{ items.usageAmount || '--' }}</span>
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
        <div class="correlationData mt-20" v-if="isCorrelationDataShow">
          <section>
            <h6 class="mt-10">量体信息</h6>
            <ul>
              <li v-for="item in getDataByReservationObj.measureData" :key="item">{{ item.name }}：{{ item.value }} CM</li>
            </ul>
          </section>
          <section>
            <h6 class="mt-10">体型特征</h6>
            <ul>
              <li v-for="item in getDataByReservationObj.bodyFeature" :key="item">{{ item.name }}：{{ item.value }}</li>
            </ul>
          </section>
          <section>
            <h6 class="mt-10">体型实拍</h6>
            <ul>
              <li v-for="item in getDataByReservationObj.bodyPicture" :key="item">
                <img :src="item.value" alt="">
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </section>
        </div>
        <p class="correlationData-p" v-if="isCorrelationDataShow">
        </p>
        <div class="work-order-info mt-25">
          <span>工单处理结果：</span>
        </div>
        <el-form class="item-form" size="small" :inline="true">
          <template>
            <div v-for="(item, index) in listByWorkOrderCode" :key="index">
              <span class="s">{{ item.tableCn }}</span>
              <br/>
              <!-- 一对一 -->
              <section :class="['the-results',{'the-results-three-rows':historyWorkOrderGetByNumObj.layout == '01'}]">
                <span class="the-results-span" v-if="item.linkType == 1" v-for="(items, indexs) in item.sublist" :key="indexs">
                  <!-- 时间字段 -->
                  <template v-if="items.jdbcType == 'timestamp' || items.jdbcType == 'date'">
                    <el-form-item
                      :label="items.itemName">
                      <el-date-picker style="width:190px;" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" disabled v-model="item.tableData[items.itemCode]" placeholder="请选择"></el-date-picker>
                    </el-form-item>
                  </template>
                  <!-- 普通字段 -->
                  <template v-else>
                    <el-form-item
                      v-if="items.visible"
                      :label="items.itemName">
                      <el-input style="width:190px;" v-if="items.jdbcType != 'image'" disabled v-model="item.tableData[items.itemCode]" placeholder="--"></el-input>
                      <img v-else :src="item.tableData[items.itemCode]" alt="" class="jdbcType-image">
                    </el-form-item>
                  </template>
                </span>
              </section>
              <!-- 一对多 -->
              <el-table
                :data="item.tableDataList"
                v-if="item.linkType == 2"
                border
                stripe
                style="width:1500px;"
                empty-text="暂无数据"
                header-align="center"
                header-row-class-name="item-table-header"
                :highlight-current-row="true" >
                <el-table-column v-if="items.visible" max-width="370" :label="items.itemName" :key="names" v-for="(items, names) in item.sublist">
                  <template slot-scope="scope">
                    <!-- 时间字段 -->
                    <template v-if="items.jdbcType == 'timestamp' || items.jdbcType == 'date'">
                      <el-date-picker type="datetime"  disabled v-model="scope.row[items.itemCode]" placeholder="开始日期"></el-date-picker>
                    </template>
                    <!-- 图片 -->
                    <template v-else-if="items.jdbcType == 'image'">
                      <!-- <el-date-picker type="datetime"  :disabled="!items.isRead" v-model="scope.row[names]" placeholder="开始日期"></el-date-picker> -->
                      <img :src="scope.row[items.itemCode]" alt="" class="subImg">
                    </template>
                    <!-- 普通字段 -->
                    <template v-else>
                      <el-input disabled v-model="scope.row[items.itemCode]" placeholder="--"></el-input>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-form>
      </div>
      <div class="item-margin"></div>
    </div>
    <div class="item-margin">
      <div class="item-form">
        <el-steps :active="active" finish-status="success">
          <el-step title="新工单"></el-step>
          <el-step title="处理中"></el-step>
          <el-step title="已处理"></el-step>
        </el-steps>
        <!-- 工单跟进记录 -->
        <div class="work-order-info mt-30">
          <span>工单跟进记录：</span>
          <el-button size="small" plain mini @click="open" v-if="isAddCourse">添加跟进记录</el-button>
        </div>
        <!-- 时间线 -->
        <div class="block mt-30">
          <el-timeline>
            <el-timeline-item
            :hide-timestamp="true"
            v-for="(activity, index) in workOrderLog_list"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.updateTime"
            >{{ activity.updateTime || '--' | timestampToTime }}&nbsp;&nbsp;{{activity.log}}</el-timeline-item>
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
        // 量体信息
        getDataByReservationObj:{},
        isCorrelationDataShow:false,
        historyWorkOrderGetByNumObj:{},
        workOrderLog_list:{},
        tableItemGetListMapObj:{},
        consumerCustomizedOrder_obj:{},
        // 处理结果字段list
        listByWorkOrderCode:[],
        // 处理结果字段对应名称
        tableData_backups:{},
        // 一对多字段集合
        subObj:{},
        // 物流列表
        express_list:[],
        // 供应商编码
        tableListData:[],
        // 添加进程是否显示
        isAddCourse:this.$route.query.isAddCourse,
        isConsumer:false,
        jobOrderStatus:{
          "0":"未处理",
          "1":"处理中",
          "2":"已处理"
        },
        priority:{
          "01":"高",
          "02":"中",
          "03":"低",
        },
        storageValArr: [],
        formInline: {},
        active: 1,
        reverse: true
      };
    },
    created() {
      this.getHistoryWorkOrderGetByNum(this.$route.query.number);
      this.getWorkOrderLog_list(this.$route.query.number);
      this.tableItemListByWorkOrderCode(this.$route.query.sourceChileType,this.$route.query.sourceId);


    },
    methods: {
      consumerCustomizedOrder_get(orderId) {
        this.request(
          this.api.order.consumerCustomizedOrder_get,
          {
            // orderId: "83e785b5-89fd-49eb-a6a5-5e3e76c9bf3f"
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
          this.consumerCustomizedOrder_obj = res;
        });
      },
      /**
       * 获取量体信息
       */
      reservationOrderMeasurement_getDataByReservationOrderId(reservationOrderId) {
        this.request(
          this.api.order.reservationOrderMeasurement_getDataByReservationOrderId,
          {
            // reservationOrderId:"5f174e93-10af-4578-917d-5bc854e85949"
            reservationOrderId
          }
        ).then(res => {
          this.getDataByReservationObj = res;
        });
      },
      /**
       * 跳转工单详情
       */
      href(routeName, param) {
         this.$router.push({
            path: '/' + routeName,
            query: param
         })
      },
      /**
       * 根据源单获取所有子表数据项
       */
      tableItemListByWorkOrderCode(sourceChileType, sourceId) {
        const that = this;

        this.request(
          that.api.job_order.tableItemListByWorkOrderCode,
          {
            code:sourceChileType,
            sourceId
          }
        ).then(res => {
          that.listByWorkOrderCode = res;
          // 整理一对多字段集合
          res.forEach((item, index) => {
            if(item.linkType == 2) {
              item.sublist.forEach((items, indexs) => {
                if(!items.visible) return;
                that.subObj[items.itemCode] = {
                  name:items.itemName,
                  isRead: items.isRead,
                  jdbcType:items.jdbcType,
                  visible:items.visible
                  };
              });
            }
          });
          console.log(that.subObj)
        });
      },
      /**
       * 获取工单池详情基本信息
       */
      getHistoryWorkOrderGetByNum(number) {
        const that = this;

        this.request(
          that.api.job_order.getHistoryWorkOrderGetByNum,
          {
            number
          }
        ).then(res => {
          const createTime = new Date('2019-06-04T09:54:58.000+0000').getTime();
          const _createTime = new Date().getTime();
          console.log(createTime)
          console.log(this.formatDuring(_createTime-createTime))
          that.historyWorkOrderGetByNumObj = res;
          that.active = res.jobOrderStatus + 1;
          that.historyWorkOrderGetByNumObj._createTime = this.formatDuring(_createTime-createTime);

          if(that.historyWorkOrderGetByNumObj.sourceChileType == 'measuringWorkOrder') {
            this.reservationOrderMeasurement_getDataByReservationOrderId(this.$route.query.sourceId);// 获取量体信息
          }
          if(that.historyWorkOrderGetByNumObj.sourceChileType == 'consumerCustomizedOrder'){
            this.consumerCustomizedOrder_get(this.$route.query.sourceId);// 获取定制信息
          }

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
       * 获取工单跟进记录列表
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
        console.log(this.historyWorkOrderGetByNumObj)
        this.request(
          that.api.job_order.addHistoryWorkOrderFollowUp,
          Object.assign(this.historyWorkOrderGetByNumObj, {
            updateName: this.userInfo.loginName
          })
        ).then(res => {
          this.warn('添加成功！','success');
          this.getWorkOrderLog_list(this.$route.query.number);
        });
      },
      open() {
        this.$prompt("添加一条跟进记录", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(({ value }) => {
          if(!value) return;
          this.historyWorkOrderGetByNumObj.remarks = value;
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
  .jdbcType-image{
    width: 35px;
    height: 35px;
  }
  .the-results{
    // width: 1500px;
    display: flex;
    text-align: right;
    flex-wrap: wrap;
    .the-results-span{
      width: 370px;
    }
  }
  .the-results-three-rows{
    // width: 1150px;
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
    color: #66b1ff;
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
