<template>
     <div>
     <div class="item-margin">
      <el-form class="item-form" :model="filtersData" label-width="90px" size="small" ref="filtersForm" inline @keyup.13.native="getTableList">
        <el-form-item prop="time" label="注册时间：">
             <el-date-picker
             class="input-w mr-10"
            v-model="filtersData.startDate"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
            <el-date-picker
            class="input-w"
            v-model="filtersData.endDate"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="关联店铺：">
          <el-select  class="input-w" placeholder="请选择">
            <el-option
              v-for="item in this.$common.cooperationOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item> -->
         <el-form-item  prop="filter" label="综合搜索：">
          <el-input class="input-w" placeholder="客户编码、姓名或电话" v-model="filtersData.filter"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  @click="handleSearch" type="primary" plain size="small">搜索</el-button>
          <el-button  @click="handleResetFilters('filtersForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      </div>
      <!--table  -->
      <div class="item-margin">
    <div class="item-table">
      <el-table
        :data="tableListData"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true"
      >
        <el-table-column prop="code" align="center" label="客户编码" min-width="50"></el-table-column>
        <el-table-column prop="name" align="center" label="姓名" min-width="100">
        </el-table-column>
         <el-table-column  prop="phone" align="center" label="电话" min-width="100">
         </el-table-column>
        <el-table-column prop="createTime" align="center" label="注册时间" min-width="120">
            <template slot-scope="scope">
            <p>{{scope.row.createTime | timestampToTime}}</p>
        </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label-class-name="text-center"
            class-name="text-center"
            align="center"
            label="操作"
            width="150"
          >
          <template slot-scope="scope">
            <el-button  @click="openShowDetails(scope.row)"  type="text" size="small">查看</el-button>
            <el-button  @click="openEditDetails(scope.row)"  type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination mt-10 mb-20">
        <el-pagination
          class="mr-20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filtersData.pageIndex"
          :page-sizes="[10, 20, 30,40,50]"
          :page-size="filtersData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    </div>

      <!--table END  -->
    </div>
</template>
<script>
/**
 * 客户列表
 */
export default {
    name:'customer_list',
    data(){
        return{
          filtersData:{
            pageIndex:1,//当前页码
            pageSize:10,//每页数量
            filter:'', //搜索关键字
            startDate:'',
            endDate:'',
        },
        tableListData:[{
            id:'555'
        }],
        total:null,
        cateOptions:[],
      }
    },
    created(){
      this.getTableList();
    },
    activated () {
      this.getTableList();
    },
    methods:{
      //获取列表
        getTableList(){
            this.request(this.api.user.crm_userCustomer_list, this.filtersData).then(data => {
            let _data=data.data,_dataLen=_data.length;
            this.tableListData=_data;
            this.total=data.totalCount;
          });
        },
        //查看基本信息
        openShowDetails(row){
          this.$router.push({
            path: '/crm/customer/show_customer', 
            name : 'show_customer',
            query: {
              _uid:row.userId,
              id:row.id,
              type:'show'
            }
          })
        },
        //修改基本信息
        openEditDetails(row){
          this.$router.push({
             path: '/crm/customer/edit_customer', 
            name : 'edit_customer',
            query: {
              _uid:row.userId,
              id:row.id,
              type:'edit'
            }
          })
        },
        //搜索
        handleSearch(){
           this.filtersData.pageIndex=1;
           this.getTableList();
        },
        //清空重置
        handleResetFilters(formName){
            this.filtersData.startDate='';
            this.filtersData.endDate='';
            this.$refs[formName].resetFields();
        },
         //当前页数修改时发生改变
        handleCurrentChange(val) {
          this.filtersData.pageIndex = val;
          this.getTableList();
        },
        // 每页显示多少条时发生改变
        handleSizeChange(val) {
          this.filtersData.pageSize = val;
          this.getTableList();
        },
    }
}
</script>
<style lang="less" scoped>

</style>
