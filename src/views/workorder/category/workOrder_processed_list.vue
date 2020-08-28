<!-- 已处理列表 -->
<template>
   <div>
      <!-- 查看配置预警类型 -->
      <el-dialog title="查看配置预警类型" :visible.sync="dialogTableVisible">
        <el-table :data="usersGetList" width="330" height="500">
           <el-table-column  label="单选" align="center"  min-width="50">
             <template  slot-scope="scope">
                 <el-radio-group v-model="ls">
                     <el-radio :label="scope.row">&nbsp;</el-radio>
                  </el-radio-group>
             </template>
          </el-table-column>
          <el-table-column  label="姓名" align="center">
             <template  slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column  label="性别" align="center">
            <template  slot-scope="scope">{{ scope.row.gender == '0' ? '男' : '女'  }}</template>
          </el-table-column>
          <el-table-column  label="今日未处理" align="center">
             <template  slot-scope="scope">{{ scope.row.not_processed }}</template>
          </el-table-column>
          <el-table-column  label="今日已处理" align="center">
             <template  slot-scope="scope">{{ scope.row.processed }}</template>
          </el-table-column>
        </el-table>
         <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="fnDialogTableVisible">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 模糊搜索 -->
      <div class="item-margin">
         <el-form
            class="item-form"
            size="small"
            :inline="true"
            :model="filtersData">
            <!-- 模糊查询 -->
            <el-form-item label="模糊查询：">
                  <el-input v-model="filtersData.fileteSingle"  @keyup.enter.native="handleSearch" placeholder="工单名称/接单人"></el-input>
            </el-form-item>
            <!-- 业务类型 -->
            <el-form-item label="业务类型：">
                  <code-set v-model="filtersData.businessType" code="CEN012" :multiple="false"/>
            </el-form-item>
            <!-- 接收部门/组 -->
            <el-form-item label="接收部门/组：">
                  <tree-dept
                     v-model="filtersData.receiveDept"
                     val-type="id"
                     :sel-type="1"
                     :default-expand-all="true"
                  ></tree-dept>
            </el-form-item>
            <br/>
            <!-- 创建时间 -->
            <el-form-item label="创建时间：" prop="startDate">
                  <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.createStartTime" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
                  <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.createEndTime" type="date" placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- 搜索，重置 -->
            <el-form-item>
                  <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
                  <el-button size="small" @click="handleResetFilters">重置</el-button>
            </el-form-item>
         </el-form>
      </div>
      <!-- 模糊搜索 -->
      <!-- 工单列表 -->
      <div class="item-margin">
         <div class="item-table">
            <el-table
               :data="job_list_obj.data"
               stripe
               empty-text="暂无数据"
               header-align="center"
               header-row-class-name="item-table-header"
               :highlight-current-row="true">
               <!-- 工单号 -->
               <el-table-column prop="number" align="center" label="工单号" min-width="130"></el-table-column>
               <!-- 工单名称 -->
               <el-table-column align="center" label="工单名称" min-width="80">
                   <template  slot-scope="scope">{{ scope.row.name || '--' }}<span class="warningType" :style="{color:scope.row.alarmColor}" v-if="scope.row.alarmStatus">{{ scope.row.alarmStatus  }}</span></template>
               </el-table-column>
               <!-- 优先级 -->
               <el-table-column align="center" label="优先级" min-width="80">
                   <template  slot-scope="scope">{{ priority[scope.row.priority] || '--' }}</template>
               </el-table-column>
               <!-- 业务类型 -->
               <el-table-column prop="businessType" align="center" label="业务类型" min-width="90">
                   <template  slot-scope="scope">{{ "CEN012"| codeToName(scope.row.businessType) }}</template>
               </el-table-column>
               <!-- 服务类型 -->
               <el-table-column prop="serviceType" align="center" label="服务类型" min-width="90">
                   <template  slot-scope="scope">{{ "CEN013"| codeToName(scope.row.serviceType) }}</template>
               </el-table-column>
               <!-- 接收部门/服务组 -->
               <el-table-column prop="receiveDept" align="center" label="接收部门/服务组" min-width="90">
                   <template  slot-scope="scope">{{ "CEN002"| codeToName(scope.row.deptName) }}</template>
               </el-table-column>
               <!-- 接单人 -->
               <el-table-column prop="" align="center" label="接单人" min-width="70">
                   <template  slot-scope="scope">{{ scope.row.assignee ? scope.row.assignee : '--' }}</template>
               </el-table-column>
               <!-- 备注 -->
               <el-table-column prop="" align="center" label="备注" min-width="70">
                   <template  slot-scope="scope">{{ scope.row.remarks ? scope.row.remarks : '--'  }}</template>
               </el-table-column>
               <!-- 创建时间 -->
               <el-table-column align="center" label="创建时间" min-width="130">
                   <template  slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template>
               </el-table-column>
               <!-- 完成时间 -->
               <el-table-column align="center" label="完成时间" min-width="130">
                   <template  slot-scope="scope">{{ scope.row.updateTime | timestampToTime }}</template>
               </el-table-column>
               <!-- 操作 -->
               <el-table-column
                  fixed="right"
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                     <el-button type="text" @click="dispose(scope.row, true)" size="small">查看</el-button>
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
import { mapGetters } from 'vuex';
import { get } from 'http';
import * as userTypes from "@/types/userConfig";

let token=getToken()

export default {
   name:'workOrder_processed_list',
   data() {
      return{
         ls:{},
         usersGetList:[],
         _jobOrderTime_Obj:{},
         job_list_obj:{},
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
         filtersData:{
            pageIndex: 1, //当前页码
            pageSize: 10, //每页数量
            "orderBy":"createTime",
            used: null, //有效状态
            filter: "", //搜索关键字
            name:"",
            isStart:"",
            fileteSingle:"",
            createStartTime: "",
            createEndTime: "",
            businessType:"",//
            receiveDept:"",// 接受部门
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
      this.getHistoryWorkOrder_list();

   },
   activated() {
      this.getHistoryWorkOrder_list();
   },
   methods: {
      /**
       *
       */
      fnDialogTableVisible() {
         this.workOrderPoolAssign(this.ls);
         this.dialogTableVisible = false;
      },
       /**
       * 获取工单池指派人员列表
       */
      usersGet(obj) {
         this._jobOrderTime_Obj = obj;
         console.log(obj);
         this.request(
            this.api.job_order.usersGet,
            {
               deptId:obj.receiveDept
            }
         ).then(res => {
            this.usersGetList = res;
            this.dialogTableVisible = true;
         });
      },
      /**
       * 工单池指派
       */
      workOrderPoolAssign(obj) {
         console.log(this._jobOrderTime_Obj)

         Object.assign(this._jobOrderTime_Obj, {
            assignee:obj.name,
            assigneeId:obj.userId
         });
         this.request(
            this.api.job_order.workOrderPoolAssign,
            this._jobOrderTime_Obj
         ).then(res => {
            this.$message({
               type: 'success',
               message: '指派成功！'
            });
         });
      },
      /**
       * 领取工单
       */
      workOrderPoolReceive(data) {
         Object.assign(data, {
            assignee:this.userInfo.loginName,
            assigneeId:this.userInfo.userId
         });
         console.log(data)
         this.request(
            this.api.job_order.workOrderPoolReceive,
            data
         ).then(res => {
         });
      },
      /**
       * 查看
       */
      dispose(obj, isRead) {
         this.href('workorder/category/workOrder_detail_dispose',{
            isRead,
            number:obj.number,
            sourceChileType:obj.sourceChileType,
            id:obj.id,
            sourceId:obj.sourceId,
            procInstId:obj.procInstId,
            orderSn:obj.orderSn,
            isAddCourse:true,
         })
      },
      // 点击页数
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.getHistoryWorkOrder_list();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getHistoryWorkOrder_list();
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
      getHistoryWorkOrder_list(pageIndex, pageSize) {
         const that = this;

         this.request(
         that.api.job_order.getHistoryWorkOrder_list,
         this.filtersData
         ).then(res => {
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
            that.getJobOrderTime_List();
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
         this.getHistoryWorkOrder_list();
      },
      /**
       * 搜索重置
       */
      handleResetFilters() {
         Object.assign(this.filtersData, {
            pageIndex: 1, //当前页码
            pageSize: 10, //每页数量
            "orderBy":"createTime",
            used: null, //有效状态
            filter: "", //搜索关键字
            name:"",
            isStart:"",
            fileteSingle:"",
            createStartTime: "",
            createEndTime: "",
            businessType:"",//
            receiveDept:"",// 接受部门
         });
      },
   },
   computed: {
      ...mapGetters({
         userInfo: userTypes.GETTER_USERINFO
      })
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
</style>
