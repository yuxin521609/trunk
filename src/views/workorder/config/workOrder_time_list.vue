<!-- 工单池 -->
<template>
   <div>
      <!-- 指派 -->
      <el-dialog title="查看配置预警类型" :visible.sync="dialogTableVisible">
        <el-table :data="alarmSets" width="330">
          <el-table-column  label="预警类型" align="center">
            <template  slot-scope="scope">
               <div class="warnType" :style="{background:item.color}" v-if="scope.row.warnType === item.id" v-for="(item,index) in warningTypeList" :key="index">{{ item.tag}}</div>
            </template>
          </el-table-column>
          <el-table-column property="endTime" label="预警时间段" align="center"></el-table-column>
          <el-table-column  label="提醒方式" align="center">
            <template  slot-scope="scope">{{ scope.row.localRemind ? '站内提醒' : ''  }}</template>
          </el-table-column>
          <el-table-column  label="接收人" align="center">
             <template  slot-scope="scope">{{ scope.row.signerReceive && scope.row.signerReceive != 'false' ? '签收人、' : ''  }}{{ scope.row.adminReceive ? '管理者' : ''  }}</template>
          </el-table-column>
        </el-table>
         <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="dialogTableVisible = false" size="small" >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 指派 -->
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <!-- 模糊查询 -->
            <el-form-item label="模糊查询：">
               <el-input v-model="filtersData.name" @keyup.enter.native="handleSearch" placeholder="时限管理名称"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态：">
              <el-select v-model="filtersData.isStart">
                 <el-option v-for="item in this.$common.usedOptions()" :label="item.name" :key="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <br/>
            <!-- 选择时间 -->
            <el-form-item label="创建时间：" prop="startDate">
               <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.startDate" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
               <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.endDate" type="date" placeholder="结束日期"></el-date-picker>
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
            <el-button type="primary" size="small" class="ml-20 mt-24" @click="href('workorder/config/workOrder_time_add')">新增</el-button>
            <el-table
                class="mt-20"
               :data="job_list_obj.data"
               stripe
               empty-text="暂无数据"
               header-align="center"
               header-row-class-name="item-table-header"
               :highlight-current-row="true">
               <!-- 时限管理名称 -->
               <el-table-column prop="" align="center" label="时限管理名称" min-width="100">
                  <template slot-scope="scope">
                     {{ scope.row.name }}
                  </template>
               </el-table-column>
               <!-- 适用工单 -->
               <el-table-column prop="" :show-overflow-tooltip="true" align="center" label="适用工单" min-width="100">
                  <template slot-scope="scope">
                     <span  class="blueness">{{ scope.row._applyWorkOrders ? scope.row._applyWorkOrders : '--' }}</span>
                  </template>
               </el-table-column>
               <!-- 处理时间时长 -->
               <el-table-column prop="" align="center" label="处理时间时长" min-width="100">
                  <template slot-scope="scope">
                     <span  class="blueness">{{ scope.row._handleTime ? scope.row._handleTime : '--' }}</span>
                  </template>
               </el-table-column>
               <!-- 配置预警 -->
               <el-table-column align="center" label="配置预警" min-width="100">
                  <template slot-scope="scope">
                  <span @click="examineWarning(scope.row.alarmSets)" class="blueness">查看</span>
                  </template>
               </el-table-column>
               <!-- 更新时间 -->
               <el-table-column prop="" align="center" label="更新时间" min-width="100">
                  <template slot-scope="scope">
                        {{ scope.row.updateTime | timestampToTime }}
                     </template>
               </el-table-column>
               <!-- 启停状态 -->
               <el-table-column align="center" label="启停状态" min-width="100">
                  <template slot-scope="scope">
                     <el-switch
                        v-model="scope.row.isStart"
                        active-color="#13ce66"
                        @change="saveTimeUpdate(scope.row.isStart, scope.$index, scope.row)"
                        inactive-color="#9d9d9d"
                     ></el-switch>
                  </template>
               </el-table-column>
               <!-- 操作 -->
               <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="timeRedact(scope.row.id)">编辑</el-button>
                     <el-button type="text" @click="open(scope.row)" size="small">删除</el-button>
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
            :total="job_list_obj.totalCount"
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
   name:'workOrder_time_list',
   data() {
      return{
         job_list_obj:{},
         jobOrderTime_List_backup:{},
         warningTypeList:[],
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
         formInline:{
            user: '',
            region: ''
         },
         filtersData:{
            pageIndex: 1, //当前页码
            pageSize: 10, //每页数量
            "orderBy":"createTime",
            used: null, //有效状态
            filter: "", //搜索关键字
            name:"",
            isStart:"",
            startDate: "",
            endDate: ""
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
      this.getJobOrderTime_List();
      this.getWarningTypeList();
   },
   activated() {
      this.getJobOrderTime_List();
   },
   methods: {
        /**
     * 获取预警类型
     */
    getWarningTypeList() {
      const that = this;

      this.request(
        that.api.job_order.getWarningType_List,
      ).then(res => {
        that.warningTypeList = res.data;
      });
    },
      /**
       * 编辑
       */
      timeRedact(id) {
         this.href('workorder/config/workOrder_time_redact',{
            id:id
         })
      },
      // 点击页数
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.getJobOrderTime_List();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getJobOrderTime_List();
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
      saveTimeUpdate(isStart,index) {
         const that = this,
               data = that.jobOrderTime_List_backup.data[index];

         data.isStart = isStart ? 1 : 0;
         this.request(
            that.api.job_order.jobOrderTimeUpdate,
            data
         ).then(res => {
            that.warn('启停状态更改成功！','success');
            that.getJobOrderTime_List();
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
       * 查询工单列表
       */
      getJobOrderTime_List(pageIndex, pageSize) {
         const that = this;

         this.request(
         that.api.job_order.getJobOrderTime_List,
         this.filtersData
         ).then(res => {
            this.jobOrderTime_List_backup = JSON.parse(JSON.stringify(res));
            res.data.forEach((item, index) => {
               // 适用工单字段拼接处理
               item._applyWorkOrders = '';
               if(!item.applyWorkOrders.length > 0) return;
               item.applyWorkOrders.forEach((items, indexs) => {
                  if(items.workOrderName) item._applyWorkOrders += `${items.workOrderName}、`;
               });
               item._applyWorkOrders = item._applyWorkOrders.replace(/、$/g,'');
               // 处理时长字段拼接处理
               item._handleTime = item.handleTime ? that.formattingTime(item.handleTime) : '';
               // 启停状态字段处理
               item.isStart = item.isStart ? true : false;
            });
            that.job_list_obj = res;
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
      open(scope) {
         const that = this;
         console.log(scope)
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.request(
             that.api.job_order.jobOrderTimeDelete,
             {
                id:scope.id
             }
          ).then(res => {
             this.$message({
               type: 'succeed',
               message: '删除成功！'
            });
            // 如果数据大于一条，则直接请求列表
            if(that.job_list_obj.data.length > 1) {
               that.getJobOrderTime_List();
            }else{
               // 如果是第一页直接请求列表，负责页数减一再请求
               if(that.filtersData.pageIndex == 1) {
                  that.getJobOrderTime_List();
               }else{
                  that.filtersData.pageIndex --;
                  that.getJobOrderTime_List();
               }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
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
         this.getJobOrderTime_List();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
         Object.assign(this.filtersData, {
            name:"",
            isStart:"",
            startDate: "",
            endDate: ""
         });
      },
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
   h5 {
     color: #222;
     margin-left: -15px;
   }
   .test {
     color: #9d9d9d;
   }
   .warnType{
      color: #fff;
      border-radius: 5px;
   }
</style>
