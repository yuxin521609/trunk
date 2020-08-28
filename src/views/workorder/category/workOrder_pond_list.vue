<template>
   <div>
      <!-- 指派 -->
      <el-dialog title="指派工单处理人员" :visible.sync="dialogTableVisible">
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
               <el-input v-model="filtersData.name" @keyup.enter.native="handleSearch" placeholder="工单号/工单名称"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="业务类型：">
               <code-set v-model="filtersData.businessType" code="CEN012" :multiple="false"/>
            </el-form-item>
            <!-- <el-form-item label="接收部门/组：">
               <tree-dept
                  v-model="filtersData.receiveDept"
                  val-type="id"
                  :sel-type="1"
                  :default-expand-all="true"
               ></tree-dept>
            </el-form-item> -->
            <br/>
            <!-- 选择时间 -->
            <el-form-item label="创建时间：" prop="startDate">
               <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.startTime" type="date" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
               <el-date-picker value-format="yyyy-MM-dd" v-model="filtersData.endTime" type="date" placeholder="结束日期"></el-date-picker>
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
               <el-table-column prop="number" align="center" label="工单号" min-width="110"></el-table-column>
               <!-- 工单名称 -->
               <el-table-column align="center" label="工单名称" min-width="90">
                   <template  slot-scope="scope">{{ scope.row.name || '--' }}</template>
               </el-table-column>
               <!-- 优先级 -->
               <el-table-column align="center" label="优先级" min-width="90">
                   <template  slot-scope="scope">{{ priority[scope.row.priority] || '--' }}</template>
               </el-table-column>
               <!-- 业务类型 -->
               <el-table-column prop="businessType" align="center" label="业务类型" min-width="100">
                   <template  slot-scope="scope">{{ "CEN012"| codeToName(scope.row.businessType) }}</template>
               </el-table-column>
               <!-- 服务类型 -->
               <el-table-column prop="serviceType" align="center" label="服务类型" min-width="100">
                   <template  slot-scope="scope">{{ "CEN013"| codeToName(scope.row.serviceType) }}</template>
               </el-table-column>
               <!-- 接收部门/服务组 -->
               <el-table-column prop="receiveDept" align="center" label="接收部门/服务组" min-width="100">
                   <template  slot-scope="scope">{{ "CEN002"| codeToName(scope.row.deptName) }}</template>
               </el-table-column>
               <!-- 更新时间 -->
               <el-table-column prop="" align="center" label="更新时间" min-width="130">
                   <template  slot-scope="scope">{{ scope.row.updateTime | timestampToTime }}</template>
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
                     <el-button type="text" size="small" @click="workOrderPoolReceive(scope.row)">领取</el-button>
                     <el-button type="text" @click="usersGet(scope.row)" size="small">指派</el-button>
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
<script>
import axios from 'axios'
import {getToken} from '@/utils/auth'
import codeSet from '@/components/codeSet'
import treeDept from '@/components/treeDept'
import { filter } from 'minimatch';
import { mapGetters } from 'vuex';
import { get } from 'http';
import * as userTypes from "@/types/userConfig";
import { setTimeout } from 'timers';

let token=getToken()

export default {
   name:'workOrder_pond_list',
   data() {
      return{
         ls:{},
         usersGetList:[],
         crewList:[{
            name:'占山',
            sex:'男',
            n:17,
            m:18
         },{
            name:'占山2',
            sex:'男',
            n:17,
            m:18
         },{
            name:'占山3',
            sex:'男',
            n:17,
            m:18
         }],
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
            startTime: "",
            endTime: "",
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

   },
   mounted() {
      setTimeout(() => {
         this.getWorkOrderPool_List();
      },300)
   },
   activated() {
      this.getWorkOrderPool_List();
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
         this._jobOrderTime_Obj = Object.assign(obj, {
            updateName: this.userInfo.name
         });
         this.ls = {};
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
         const that = this;

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
            // 如果数据大于一条，则直接请求列表
            if(that.job_list_obj.data.length > 1) {
               that.getWorkOrderPool_List();
            }else{
               // 如果是第一页直接请求列表，负责页数减一再请求
               if(that.filtersData.pageIndex == 1) {
                  that.getWorkOrderPool_List();
               }else{
                  that.filtersData.pageIndex --;
                  that.getWorkOrderPool_List();
               }
            }
         });
      },
      /**
       * 领取工单
       */
      workOrderPoolReceive(data) {
         const that = this;
         Object.assign(data, {
            assignee:this.userInfo.name,
            assigneeId:this.userInfo.userId
         });
         console.log(data)
         this.request(
            this.api.job_order.workOrderPoolReceive,
            data
         ).then(res => {
            this.$message({
               type: 'success',
               message: '领取成功！'
            });
            // 如果数据大于一条，则直接请求列表
            if(that.job_list_obj.data.length > 1) {
               that.getWorkOrderPool_List();
            }else{
               // 如果是第一页直接请求列表，负责页数减一再请求
               if(that.filtersData.pageIndex == 1) {
                  that.getWorkOrderPool_List();
               }else{
                  that.filtersData.pageIndex --;
                  that.getWorkOrderPool_List();
               }
            }
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
         this.getWorkOrderPool_List();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getWorkOrderPool_List();
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
      getWorkOrderPool_List(pageIndex, pageSize) {
         const that = this;
         console.log(this.userInfo)
         Object.assign(this.filtersData, {
            receiveDept:this.userInfo.departId
         });
         this.request(
         that.api.job_order.getWorkOrderPool_List,
         this.filtersData
         ).then(res => {
            that.job_list_obj = res;
         });
      },
      /**
       * 格式化工单时间段
       * @param { String } str 需要转换的字符串 如：'1-0-1-0'
       * @return { String } str 如：'01天-00时-01分-00秒'
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
               type: 'success',
               message: '删除成功！'
            });
            that.getWorkOrderPool_List();
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
         this.getWorkOrderPool_List();
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
            startTime: "",
            endTime: "",
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
