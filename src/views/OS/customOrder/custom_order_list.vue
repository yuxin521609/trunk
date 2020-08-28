<!-- 工单池 -->
<template>
   <div>
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <!-- 模糊查询 -->
            <el-form-item label="模糊查询：">
               <el-input v-model="filtersData.searchKey" @keyup.enter.native="handleSearch" style="width:310px;" placeholder="订单号/客户姓名/客户电话/订单地址"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="订单状态：">
              <el-select v-model="filtersData.businessStatusList" :multiple="true" clearable>
                 <el-option v-for="(item, index) in orderStatus" :label="item" :key="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
            <!-- 搜索，重置 -->
            <el-form-item>
               <el-button @click="handleSearch" type="primary" plain size="small">搜索</el-button>
               <el-button @click="handleResetFilters" size="small">重置</el-button>
            </el-form-item>
         </el-form>
      </div>
      <!-- 模糊搜索 -->
      <!-- 工单列表 -->
      <div class="item-margin">
         <div class="item-table">
            <el-table
               :data="consumerReservationOrder_listObj.data"
               stripe
               empty-text="暂无数据"
               header-align="center"
               header-row-class-name="item-table-header"
               :highlight-current-row="true">
               <!-- 工单名称 -->
              <!-- 工单名称 -->
               <el-table-column align="left" label="订单号" min-width="200">
                   <template  slot-scope="scope">{{ scope.row.orderSn || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="状态" min-width="110">
                   <template  slot-scope="scope">{{ orderStatus[scope.row.businessStatus] }}<span class="warningType" v-if="false"  :style="{color:scope.row.alarmColor}">新</span></template>
               </el-table-column>
               <el-table-column align="left" label="客户姓名" min-width="90">
                   <template  slot-scope="scope">{{ scope.row.customerName || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="客户电话" min-width="120">
                   <template  slot-scope="scope">{{ scope.row.mobile || '--' }}</template>
               </el-table-column>
               <el-table-column :show-overflow-tooltip="true" align="left" label="订单地址" min-width="250">
                   <template  slot-scope="scope">{{ scope.row.address || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="关联预约单号" min-width="200">
                   <template  slot-scope="scope">{{ scope.row.reservationOrderSn || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="订单金额" min-min-width="70">
                   <template  slot-scope="scope">{{ scope.row.amount || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="实付金额" min-width="70">
                   <template  slot-scope="scope">{{ scope.row.actualAmount || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="量体师" min-width="70">
                   <template  slot-scope="scope">{{ scope.row.actualAmount || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="支付方式" min-width="70">
                   <template  slot-scope="scope">{{ scope.row.paymentCode || '--' }}</template>
               </el-table-column>
               <el-table-column align="left" label="创建时间" min-width="160">
                   <template  slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
               </el-table-column>
               <el-table-column align="left" label="所属机构" min-width="70">
                   <template  slot-scope="scope">{{ scope.row.organization || '--' }}</template>
               </el-table-column>
               <!-- 操作 -->
               <el-table-column
                  fixed="right"
                  label-class-name="text-left"
                  class-name="text-left"
                  align="left"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                     <el-button type="text" @click="timeRedact(scope.row.orderId)" size="small">查看</el-button>
                     <el-button type="text" size="small" @click="open(scope.row.orderId)">取消</el-button>
                  </template>
               </el-table-column>
            </el-table>
            <div class="pagination mt-10 mb-20">
         <!-- 分页 -->
         <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10,20,30,40,50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="consumerReservationOrder_listObj.totalCount"
         ></el-pagination>
        </div>
         </div>
      </div>
      <!-- 工单列表 -->
   </div>
</template>
<!-- 工单池 -->
<script>
import axios from 'axios'
import {getToken} from '@/utils/auth'
import codeSet from '@/components/codeSet'
import treeDept from '@/components/treeDept'
import { filter } from 'minimatch';
import { get } from 'http';

let token=getToken()

export default {
   name:'custom_order_list',
   data() {
      return{
          orderStatus:{
            200:'待付款',
            201:'待确定',
            202:'加宽量中',
            203:'工厂下单中',
            204:'工厂生产中',
            205:'工厂送货中',
            206:'部分到达中',
            207:'增值服务确认中',
            208:'等待配送中',
            209:'配送中',
            210:'已完成',
            211:'已关闭'
         },
         orderType:{
            20001:'量体预约单',
            20002:'定制订单',
         },
         ls:{},
         consumerReservationOrder_listObj:{},
         // 预警提醒列表
         "alarmSets":[
            {
               "startTime":null,
               "endTime":null,
               "warnType":null,
               "localRemind":null,
               "emailRemind":null,
               "smsRemind":null,
               "signerReceive":null,
               "adminReceive":null
            }
         ],
         priority:{
            "01":"高",
            "02":"中",
            "03":"低",
         },
         formInline:{
            user: '',
            region: ''
         },
         searchKey:"",
         orderStatusList:[],
         filtersData:{
            pageIndex: 1, //当前页码
            pageSize: 10, //每页数量
            orderType:20002,
            searchKey:'',
            businessStatusList:[]
         },
         value: '',
         storageValArr:[],
         // 指派单选框
         radio: '1',
         // 指派
         gridData: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
   },
   created() {
      const that = this;
      this.consumerCustomizedOrder_list();

   },
   activated() {
      this.consumerCustomizedOrder_list();
   },
   methods: {
      /**
       *
       */
      fnDialogTableVisible() {
         console.log(this.ls)
         this.workOrderPoolAssign();
         this.dialogTableVisible = false;
      },
      /**
       * 工单池指派
       */
      workOrderPoolAssign(data) {
         this.request(
            this.api.job_order.workOrderPoolAssign,
            this.ls
         ).then(res => {
            this.$message({
               type: 'succeed',
               message: '指派成功！'
            });
         });
      },
      /**
       * 领取工单
       */
      workOrderPoolReceive(orderId) {
         this.request(
            this.api.order.logicDelete,
            orderId
         ).then(res => {
            this.$message({
               type: 'succeed',
               message: ''
            });
         });
      },
      /**
       * 编辑
       */
      timeRedact(orderId) {
         this.href('OS/customOrder/custom_order_detail',{
            orderId:orderId
         })
      },
      // 点击页数
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.consumerCustomizedOrder_list();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.consumerCustomizedOrder_list();
      },
      /**
       * 查看预警
       */
      examineWarning(scope) {
         if(!scope) return;
         this.alarmSets = JSON.parse(JSON.stringify(scope));
         if(!this.alarmSets.length > 0) return;
         this.alarmSets.forEach((item, index) => {
            item.endTime = this.formattingTime(item.endTime);
         });
         this.dialogTableVisible = true;
      },
      /**
       * 查询工单列表
       */
      consumerCustomizedOrder_list(pageIndex, pageSize) {
         const that = this;

         this.request(
         that.api.order.consumerCustomizedOrder_list,
         this.filtersData
         ).then(res => {
            that.consumerReservationOrder_listObj = res;
         });
      },
      /**
       * 格式化工单时间段
       * @param { String } str 需要转换的字符串 如：'1-0-1-0'
       * @return { String } str 如：'01-00-01-00'
       */
      formattingTime(str) {
         let arr = str.split('-');
         return `${this.replenishZero(arr[0])}天${this.replenishZero(arr[1])}时${this.replenishZero(arr[2])}分${this.replenishZero(arr[3])}秒`;
      },
      /**
       * 补零函数
       * @param { Nunber | String } item 数字或数字字符串 如： 1，'1'
       * @return { String } 如：'01'
       */
      replenishZero(item) {
         item = parseInt(item);

         return item < 10 ? `0${item}` : item;
      },

      /**
       * 新增工单
       */
      workOrder_add() {
        this.$router.push({
            path: '/workOrder_add',
            name: 'workOrder_add'
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
       * 删除工单
       */
      open(orderId) {
         const that = this;
        this.$confirm('确定要取消吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.request(
             that.api.order.consumerCustomizedOrder_logicDelete,
             {
               orderId
             }
          ).then(res => {
             this.$message({
               type: 'succeed',
               message: '取消成功！'
            });
            that.consumerCustomizedOrder_list();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消！'
          });
        });
      },
      /**
       * 领取工单
       */
      open2() {
         this.$message({
            message: '工单领取成功！',
            type: 'success'
         });
      },
      /**
       * 模糊搜索
       */
      handleSearch() {
         this.filtersData.pageIndex = 1;
         this.consumerCustomizedOrder_list();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
         // Object.assign(this.filtersData, {
         //    name:"",
         //    isStart:"",
         //    startDate: "",
         //    endDate: ""
         // });
         this.searchKey = '';
         this.orderStatusList = [];
      },
   },
   filters: {
      filters_orderStatus(orderStatus, businessStatus) {
         if(orderStatus == 0 && businessStatus == 201) {
            return '待付款';
         }else if(orderStatus == 3 && businessStatus == 201) {
            return '待确定';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 202) {
            return '加宽量中';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 203) {
            return '工厂下单中';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 204) {
            return '工厂生产中';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 205) {
            return '工厂送货中';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 206) {
            return '部分到达中';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 207) {
            return '增值服务确认中';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 208) {
            return '等待配送中';
         }else if((orderStatus == 4 || orderStatus == 5) && businessStatus == 209) {
            return '配送中';
         }else if((orderStatus == 8 || orderStatus == 9) && businessStatus == 210) {
            return '已完成';
         }else if(orderStatus == 6 && businessStatus == 201) {
            return '已关闭';
         };
   　　}
　　},
   components:{
      codeSet,
      treeDept
   },
}
</script>
<style  lang="less" scoped>
   .blueness{
      color: #1E90FF;
   }
   .warningType{
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    background: red;
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
    margin-left: 10px;
    text-align: center;
   }
   .color{
      background: #FF6347;
   }
   h5 {
     color: #222;
     margin-left: -15px;
   }
   .test {
     color: #9d9d9d;
   }
</style>
