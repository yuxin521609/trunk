<!-- 工单池 -->
<template>
   <div>
      <!-- 新增工序 -->
      <el-dialog
         title="添加工序"
         :width="dialogStyle.dialogWidth"
         :before-close="handleClose"
         :visible.sync="dialogTableVisible">
         <!-- 新增工序 -->
         <div v-if="isProcess">
            <el-form class="item-form" size="small" :inline="true" :model="process_save_obj">
               <section class="extend-list">
                  <!-- 工序名称 -->
                  <div class="item">
                  <i class="colorRed">*</i>
                  <el-form-item label="工序名称：">
                     <el-input placeholder="请输入内容" v-model="process_save_obj.name" style="width:199px;"></el-input>
                  </el-form-item>
                  </div>
                  <!-- 业务类型 -->
                  <div class="item">
                  <i class="colorRed">*</i>
                  <el-form-item label="业务类型：">
                     <code-set v-model="process_save_obj.busType" code="CEN012" :multiple="false"/>
                  </el-form-item>
                  </div>
                  <!-- 工序标识 -->
                  <div class="item">
                  <i class="colorRed">*</i>
                  <el-form-item label="工序标识：">
                     <el-input placeholder="请输入内容" v-model="process_save_obj.identify" style="width:199px;"></el-input>
                  </el-form-item>
                  </div>
                  <!-- 工序描述 -->
                  <div class="item">
                  <!-- <i class="colorRed">*</i> -->
                  <el-form-item label="工序描述：">
                        <el-input
                           style="width:199px;"
                           type="textarea"
                           placeholder="请输入内容"
                           v-model="process_save_obj.remarks"
                           maxlength="500"
                           show-word-limit
                           >
                        </el-input>
                  </el-form-item>
                  </div>
               </section>
            </el-form>
               <div slot="footer" class="dialog-footer">
               <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
               <el-button size="small" type="primary" @click="fnDialogTableVisible">确 定</el-button>
            </div>
         </div>
         <!-- iframe页 -->
         <div v-else>
            <iframe :src="iframeSrc" id="iframe" frameborder="0" width="100%" height="600px"></iframe>
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
                  <el-input v-model="filtersData.filter" placeholder="工单号/工单名称"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态：">
                  <code-set v-model="filtersData.businessType" code="CEN012" :multiple="false"/>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="业务类型：">
                  <code-set v-model="filtersData.businessType" code="CEN012" :multiple="false"/>
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
                  <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
                  <el-button size="small" @click="handleResetFilters">重置</el-button>
            </el-form-item>
         </el-form>
      </div>
      <!-- 模糊搜索 -->
      <!-- 工序管理列表 -->
      <div class="item-margin">
         <div class="item-table">
            <el-button size="small" type="primary" class="ml-20 mt-24" @click="dialogTableVisible = true">新增工序</el-button>
            <el-table
                class="mt-20"
               :data="jobOrderTime_ListObj.data"
               style="width: 100%"
               stripe
               empty-text="暂无数据"
               header-align="center"
               header-row-class-name="item-table-header"
               :highlight-current-row="true"
               >
               <!-- 工单名称 -->
               <el-table-column prop="" align="center" label="工单名称" min-width="100">
                  <template  slot-scope="scope">{{ scope.row.name || '--' }}</template>
               </el-table-column>
               <!-- 优先级 -->
               <el-table-column prop="" :show-overflow-tooltip="true" align="center" label="业务类型" min-width="100">
                  <template  slot-scope="scope">{{ "CEN012" | codeToName(scope.row.busType) }}</template>
               </el-table-column>
               <!-- 业务类型 -->
               <el-table-column  align="center" label="适用部门" min-width="100">
                  <template  slot-scope="scope">{{ "CEN002" | codeToName(scope.row.deptName) }}</template>
               </el-table-column>
               <!-- 服务类型 -->
               <el-table-column align="center" label="平均处理时间" min-width="100" >
                  <template slot-scope="scope">
                  <span>{{ scope.row.updateTime || '--' | timestampToTime }}</span>
                  </template>
               </el-table-column>
               <!-- 接受部门/服务组 -->
               <!-- 更新时间 -->
               <el-table-column prop="" align="center" label="更新时间" min-width="100">
                  <template slot-scope="scope">
                        {{ scope.row.updateTime || '--' | timestampToTime }}
                     </template>
               </el-table-column>
               <!-- 操作 -->
               <el-table-column
                  fixed="right"

                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                     <el-button type="text" @click="open(scope.row)" size="small">部署</el-button>
                     <el-button type="text" size="small" @click="timeRedact(scope.row)">编辑</el-button>
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
            :total="jobOrderTime_ListObj.totalCount"
         ></el-pagination>
        </div>
         </div>
      </div>
      <!-- 工序管理列表 -->
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
import { clearTimeout } from 'timers';

let token=getToken()

export default {

   data() {
      return{
         jobOrderExtendObj:{},
         // 工序与iframe切换判断
         isProcess:true,
         // 控制dialog宽度
         dialogStyle:{
            dialogWidth:'419px',
         },
         // iframe请求路径
         iframeSrc:'',
         process_save_obj:{
            name:'',
            identify:'',
            // busType:'',
            // remarks:''
         },// 工序提交对象
         dialogTableVisible:false,
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
         jobOrderTime_ListObj:{},
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
            isStart:"",
            assigneeId:"",
            startDate: "",
            endDate: "",
            businessType:"",//
            receiveDept:"",// 接受部门
         },
         value: '',
         storageValArr:[],
         // 指派单选框
         radio: '1',
         // 指派
         gridData: [],
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


      this.getWaitWorkOrder_list();
      document.onkeydown = function(e) {
         var key = window.event.keyCode;
         if (key == 13) {
            that.handleSearch();
         }
      };
   },
   methods: {
      /**
       * 取消添加工序
       */
      handleClose() {
         let time = null;

         this.dialogTableVisible = false;
         clearTimeout(time);
         // 解决取消时，dialog闪烁问题
         time = setTimeout(() => {
            this.isProcess = true;
            this.dialogStyle = {
               dialogWidth:'419px'
            };
         },1000)
      },
      /**
       * 获取iframe页面
       */
      model_create() {

      },
      /**
       *
       */
      fnDialogTableVisible() {
         this.iframeSrc = '';
         this.isProcess = false;
         this.dialogStyle = {
            dialogWidth:'80%'
         };
      },
      /**
       *
       */
      // async fnDialogTableVisible() {
      //    let res = await this.request(
      //          this.api.job_order.model_create,
      //          this.process_save_obj
      //       );
      //       alert(1)
      //    // this.isProcess = false;
      //    // this.dialogStyle = {
      //    //    dialogWidth:'80%'
      //    // };
      // },
       /**
       * 获取工单池指派人员列表
       */
      usersGet(obj) {
         this._jobOrderTime_Obj = Object.assign(obj, {
            updateName: this.userInfo.name
         });
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
      waitWorkOrderAssign(obj) {
         console.log(this._jobOrderTime_Obj)

         Object.assign(this._jobOrderTime_Obj, {
            assignee:obj.name,
            assigneeId:obj.userId
         });
         this.request(
            this.api.job_order.waitWorkOrderAssign,
            this._jobOrderTime_Obj
         ).then(res => {
            this.$message({
               type: 'success',
               message: '指派成功！'
            });
          this.getWaitWorkOrder_list();
         });
      },
      /**
       * 释放工单
       */
      waitWorkOrderRelease(data) {
         Object.assign(data, {
            updateName:this.userInfo.name,
            assigneeId:this.userInfo.userId
         });
         console.log(data)
         this.$confirm('确定要释放吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.request(
            this.api.job_order.waitWorkOrderRelease,
            data
         ).then(res => {
            this.$message({
               type: 'success',
               message: '释放成功！'
            });
            this.getWaitWorkOrder_list();
         });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消！'
          });
        });

      },
      followUp(obj) {
        this.$prompt("添加一条跟进记录", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(({ value }) => {
          if(!value) return;
          obj.remarks = value;
          this.addHistoryWorkOrderFollowUp(obj);
        })
      },
      addHistoryWorkOrderFollowUp(obj) {
        const that = this;

        this.request(
          that.api.job_order.addHistoryWorkOrderFollowUp,
          Object.assign(obj, {
            updateName: this.userInfo.name
          })
        ).then(res => {
          this.warn('添加成功！','success');
          this.getWorkOrderLog_list();
        });
      },
      /**
       * 处理
       */
      dispose(obj) {
         this.href('workOrder_detail_dispose',{
            number:obj.number,
            sourceChileType:obj.sourceChileType,
            id:obj.id,
            sourceId:obj.sourceId,
            procInstId:obj.procInstId,
            orderSn:obj.orderSn
         })
      },
      /**
       * 查看
       */
      timeRedact(obj) {
         this.href('workOrder_detail',{
            number:obj.number,
            sourceChileType:obj.sourceChileType,
            sourceId:obj.sourceId,
            orderSn:obj.orderSn
         })
      },
      // 点击页数
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.getWaitWorkOrder_list();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getWaitWorkOrder_list();
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
       * 查询工单池列表
       */
      getWaitWorkOrder_list(pageIndex, pageSize) {
         const that = this;
         console.log(this.userInfo)
         console.log(this.userInfo.currentUser)
         // Object.assign(this.filtersData, {
         //    assigneeId:this.userInfo.currentUser
         // });
         this.request(
         that.api.job_order.getWaitWorkOrder_list,
         this.filtersData
         ).then(res => {
            that.jobOrderTime_ListObj = res;
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
            name: routeName,
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
         this.getWaitWorkOrder_list();
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
            isStart:"",
            startDate: "",
            endDate: "",
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
   .dialog-footer{
      text-align: right;
   }
   .item{
      text-align: right;
      margin-right: 30px;
   }
   .colorRed{
      color: red;
      line-height:30px;
      margin-right: 4px;
   }
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
