<!-- 工单池 -->
<template>
   <div>
      <!-- 预览 -->
      <el-dialog title="预览" :visible.sync="previewVisible">
         <el-form class="item-form previewVisible-list" size="small" :inline="true" :model="formInline">
         <!-- 模糊查询 -->
         <el-form-item class="item" :label="item.itemName" width="200" :key="item.id" v-for="item in tableItemsArr">
            <el-input disabled value="--"></el-input>
         </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
         <el-button @click="previewVisible = false" size="small">取 消</el-button>
         <el-button type="primary" @click="previewVisible = false" size="small">确 定</el-button>
         </div>
      </el-dialog>
      <!-- 指派 -->
      <el-dialog title="查看配置预警类型" :visible.sync="dialogTableVisible">
        <el-table :data="alarmSets" width="330">
          <el-table-column  label="预警类型" align="center">
             <template  slot-scope="scope">{{ scope.row.warnType ? '严重' : ''  }}</template>
          </el-table-column>
          <el-table-column property="endTime" label="预警时间段" align="center"></el-table-column>
          <el-table-column  label="提醒方式" align="center">
            <template  slot-scope="scope">{{ scope.row.localRemind ? '站内提醒' : ''  }}</template>
          </el-table-column>
          <el-table-column  label="接收人" align="center">
             <template  slot-scope="scope">{{ scope.row.signerReceive && scope.row.signerReceive != 'false' ? '签收人' : ''  }}{{ scope.row.adminReceive ? '管理者' : ''  }}</template>
          </el-table-column>
        </el-table>
         <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="dialogTableVisible = false">确 定</el-button>
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
               <el-input v-model="filtersData.name" placeholder="工单名称"></el-input>
            </el-form-item>
            <el-form-item label="业务类型：">
               <code-set v-model="filtersData.businessType" code="CEN012" :multiple="false"/>
            </el-form-item>
            <el-form-item label="适用部门：">
               <tree-dept
                  v-model="filtersData.receiveDept"
                  val-type="id"
                  :sel-type="1"
                  :default-expand-all="true"
               ></tree-dept>
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
      <!-- 工单列表 -->
      <div class="item-margin">
         <div class="item-table">
            <el-button size="small" type="primary" class="ml-20 mt-24" @click="href('config_add')">新增</el-button>
            <el-table
                class="mt-20"
               :data="jobOrderTime_ListObj.data"
               stripe
               empty-text="暂无数据"
               header-align="center"
               header-row-class-name="item-table-header"
               :highlight-current-row="true">
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
                  label-class-name="text-center"
                  class-name="text-center"
                  align="center"
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="timeRedact(scope.row)">编辑</el-button>
                     <el-button type="text" size="small" @click="fnPreviewVisible(scope.row)">预览表单</el-button>
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

   data() {
      return{
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
         previewVisible:false,
         tableItemsArr:[],
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
      this.getJobOrderExtend_List();
      document.onkeydown = function(e) {
         var key = window.event.keyCode;
         if (key == 13) {
            that.handleSearch();
         }
      };
   },
   methods: {
      /**
       * 预览表单
       * @param { item } Object > 点击的当前项
       */
      fnPreviewVisible(data) {
         const that = this;

         that.tableItemsArr  = [];
         this.request(
            that.api.job_order.tableItemListByOrderExtendId,
            {
               orderExtendId: data.id
            }
            ).then(res => {
            // 处理配置单源数据字段
            res.forEach((item, index) => {
               if(!item.sublist.length) return;
               item.sublist.forEach((items, indexs) => {
                  if(items.visible) {
                     that.tableItemsArr.push(items);
                  };
               })
               that.previewVisible = true;
            });
         });
      },
      /**
       * 编辑
       */
      timeRedact(item) {
         this.href('workOrder_redact',{
            id:item.id
         })
      },
      // 点击页数
      handleCurrentChange(pageIndex){
         this.filtersData.pageIndex = pageIndex;
         this.getJobOrderExtend_List();
      },
      // 点击每页多少条数
      handleSizeChange(pageSize){
         this.filtersData.pageSize = pageSize;
         this.getJobOrderExtend_List();
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
      getJobOrderExtend_List(pageIndex, pageSize) {
         const that = this;

         this.request(
         that.api.job_order.getJobOrderExtend_List,
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
             that.api.job_order.jobOrderExtendDelete,
             {
                id:scope.id
             }
          ).then(res => {
             this.$message({
               type: 'succeed',
               message: '删除成功！'
            });
            that.getJobOrderExtend_List();
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
         this.getJobOrderExtend_List();
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
   .previewVisible-list{
      display: flex;
      flex-wrap: wrap;
      .item{
         width: 50%;
         margin-right: 0;
         text-align: right;
      }
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
