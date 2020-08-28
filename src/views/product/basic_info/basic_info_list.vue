<template>
     <div>
     <div class="item-margin">
      <el-form class="item-form" :model="filtersData" label-width="90px" size="small" ref="filtersForm" inline>
        <el-form-item  prop="cateIdentifier"  label="对应分类：">
            <el-cascader
            class="input-w"
            :options="classData"
             v-model="cateArr"
             :value="cateArr"
             @change="cascaderGet"
             :show-all-levels="false"
             :props="props"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="valid" label="使用状态">
          <el-select  class="input-w" placeholder="请选择" v-model="filtersData.valid">
            <el-option
              v-for="item in this.$common.getValidOptions()"
              :key="item.status_id"
              :label="item.status_name"
              :value="item.status_id"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item  prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.searchWords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small"  @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button size="small"  @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
      </div>
      <!--table  -->
      <div class="item-margin">
    <div class="item-cont">
      <el-button-group>
        <el-button size="small" type="primary" @click="openAddAttrbute">新增基本信息</el-button>
      </el-button-group>
    </div>
    <div class="item-table">
      <el-table
        :data="tableListData"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true"
      >
        <el-table-column  align="center" width="50">
           <template slot-scope="scope">
            <i  @click="childrenIsShow(scope.row)"
              v-if="scope.row.isShow"
              :class="scope.row.isType == 1 ?'el-icon-circle-plus-outline i-cursor' : 'el-icon-remove-outline i-cursor'"></i>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="信息名称"  min-width="100">
        </el-table-column>
         <el-table-column prop="_chilrenName" align="center" label="信息内容"  min-width="100"></el-table-column>
        <el-table-column prop="cateName" align="center" label="对应分类"  min-width="80">
        </el-table-column>
        <el-table-column prop="description" align="center" label="备注" min-width="100"></el-table-column>
        <el-table-column prop="valid" align="center" label="使用状态" width="120">
          <template slot-scope="scope">
             <el-switch
              v-if="scope.row.isShow"
              v-model="scope.row.valid"
              active-color="#13ce66"
              @change="switchValid(scope.row)"
              inactive-color="#9d9d9d">
            </el-switch>
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
            <el-button  @click="openShowDetails(scope.row.id)"  v-if="scope.row.isShow" type="text" size="small">查看</el-button>
            <el-button  @click="openEditDetails(scope.row.id)" v-if="scope.row.isShow" type="text" size="small">修改</el-button>
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
 * 基本管理
 */
export default {
    name:'basic_info_list',
    data(){
        return{
          filtersData:{
            cateIdentifier:'',//产品分类标识码
            pageIndex:1,//当前页码
            pageSize:10,//每页数量
            valid:null,//有效状态
            searchWords:'', //搜索关键字
        },
        cateArr:[],
        props:{
          value: 'id',
          label:'name',
          children: 'children'
        },
        tableListData:[],
        total:null,
         classData:[],
         classList:[]
      }
    },
    created(){
      this.getTableList();
      this.getClassData();
    },
    activated () {
      this.getTableList();
    },
    methods:{
      getClassData(){
         this.$common.getClassSelect(this,1).then(res =>{
           this.classData=res.ztree;
           this.classList=res.list;
        })
      },
       cascaderGet(e){
          let cateId  = JSON.parse(JSON.stringify(e)).pop();
          let obj = this.classList.find((item)=>(item.id == cateId));
          this.filtersData.cateIdentifier = obj.identifier;
        },
      //获取列表
        getTableList(){
            this.request(this.api.product.productInformation_list, this.filtersData).then(data => {
            let _data=data.data,_dataLen=_data.length;
            for(let i=0;i<_dataLen;i++){
              _data[i].isShow=true;
              _data[i].isType=1;
              _data[i]._cid="";
            }
            this.tableListData=_data;
            this.total=data.totalCount;
          });
        },
        //新增基本信息  跳转页面
        openAddAttrbute(){
            this.$router.push({
                path:'/product/basic_info/add_basic',
                name:'add_basic',
                 query: {
                  type:'add'
                }
            })
        },
        //查看基本信息
        openShowDetails(params){
          this.$router.push({
            path:'/product/basic_info/show_basic',
            name:'show_basic',
            query: {
              id:params,
              type:'show'
            }
          })
        },
        //修改基本信息
        openEditDetails(params){
          this.$router.push({
            path:'/product/basic_info/edit_basic',
            name:'edit_basic',
            query: {
              id:params,
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
            this.$refs[formName].resetFields();
              this.cateArr=[];
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
         //滑块开关
        switchValid(params){
            this.request(this.api.product.productInformation_save, params).then(data => {

          })
        },
        //点击获取子元素插入数组
        childrenIsShow(row){
          let listData=this.tableListData;
          let _path=this.api.product.productInformationAttribute_list;
          let _this=this;
          let _key='infoId'
          this.$common.clickGetChildren(_this,row,listData,_path,_key);
        },

    }
}
</script>
<style lang="less" scoped>

</style>
