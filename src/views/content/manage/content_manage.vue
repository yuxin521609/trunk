<style lang="less" scoped>
  @import "../style/contentPublic.less";
  .content-manage{
    .page-main-inner{
      .menu-small{position: relative;}
      .form-data{position: absolute;right: 20px;top: 4px;}
      .table-img{width: 100px;height: 100px;}
      .info-list{
        li{float: left;margin-right: 20px;}
      }
      .state-flag{
        .el-tag.el-tag--mini{float: right;}
      }
      .table-reason{color: #e6a23c;}
    }
  }
</style>
<template>
  <div class="content-manage page-public">
    <div class="page-main">
      <div class="page-main-inner item-margin">
        <el-menu :default-active="typeActiveIndex" class="el-menu-demo page-menu-border" mode="horizontal" @select="typeActiveSelect">
          <el-menu-item index="4">文章</el-menu-item>
          <el-menu-item index="3">图集</el-menu-item>
          <el-menu-item index="2">小视频</el-menu-item>
          <el-menu-item index="1">视频</el-menu-item>
        </el-menu>
        <div class="menu-small">
          <el-menu :default-active="stateActiveIndex" class="el-menu-demo" mode="horizontal" @select="stateActiveSelect">
            <el-menu-item index="8">全部</el-menu-item>
            <el-menu-item index="2">已发布</el-menu-item>
            <el-menu-item index="1">待发布</el-menu-item>
            <el-menu-item index="3">未通过</el-menu-item>
            <el-menu-item index="4">已下线</el-menu-item>
            <el-menu-item index="0">草稿箱</el-menu-item>
            <div class="form-data">
              <el-form :inline="true" :model="formData" class="demo-form-inline" size="small" ref="form">
                <el-form-item label="">
                  <el-input v-model="formData.title" placeholder="请输入关键字搜索内容" suffix-icon="el-icon-search" @keyup.13.native="searchTableData"></el-input>
                </el-form-item>
                <el-form-item label="内容分类：">
                  <el-cascader :options="categoryTreeList" v-model="formData.contentCategory" :props="categoryTreeListProps" :show-all-levels="false" clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchTableData" size="small" plain>搜索</el-button>
                  <el-button @click="initFormData" size="small" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-menu>
        </div>
        <page-table :form-data="formData" :get-data="getData" :table-data="tableData">
          <el-table :data="tableData.data" style="width: 100%" :show-header="false">
            <el-table-column label=""  width="120">
              <template slot-scope="scope">
                <img :src="scope.row.coverList[0].url" alt="" class="table-img" v-if="scope.row.coverList.length">
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <!--@click="itemEdit(scope.row)"-->
                <h6 >{{scope.row.title}}
                  <el-tag size="mini" type="danger" v-if="scope.row.top === 1">置顶</el-tag>
                </h6>
                <p>{{ scope.row.createTime | timestampToTime }} <span v-show="scope.row._categoryName">分类：{{ scope.row._categoryName }}</span></p>
                <p v-if="scope.row.contentStatus === 3 && scope.row.reason" class="table-reason">驳回理由：<span>{{ scope.row.reason }}</span></p>
                <ul class="info-list" v-if="scope.row.count">
                  <li>阅读：{{ scope.row.count.readCount }}</li>
                  <li>评论：{{ scope.row.count.commentCount }}</li>
                  <li>点赞：{{ scope.row.count.praiseCount }}</li>
                  <li>收藏：{{ scope.row.count.collectCount }}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <div class="state-flag clearfix">
                  <el-tag size="mini" :type="timingStatus[scope.row.contentStatus].type" v-if="scope.row.contentStatus.toString()">{{ timingStatus[scope.row.contentStatus].name }}</el-tag>
                </div>
                <el-button type="text" size="small" @click="itemEdit(scope.row)" v-if="scope.row.contentStatus === 4 || scope.row.contentStatus === 0 || scope.row.contentStatus === 3  ||  (scope.row.contentStatus === 2 && scope.row.isTime)">编辑</el-button>
                <el-button type="text" size="small" @click="itemDel(scope.row)" v-if="scope.row.contentStatus === 4 || scope.row.contentStatus === 0 || scope.row.contentStatus === 3  ||  (scope.row.contentStatus === 2 && scope.row.isTime)">删除</el-button>
                <el-button type="text" size="small" @click="seeComment(scope.row)" v-if="scope.row.contentStatus === 2 || scope.row.contentStatus === 4">查看评论</el-button>
                <!--<el-button type="text" size="small" @click="seeAnalysis(scope.row)" v-if="scope.row.contentStatus === 2 || scope.row.contentStatus === 4">数据分析</el-button>-->
                <el-button type="text" size="small" @click="itemOffline(scope.row)" v-if="scope.row.contentStatus === 2">下线</el-button>
                <el-button type="text" size="small" @click="itemTop(scope.row)" v-if="scope.row.contentStatus === 2 && !scope.row.top ">置顶</el-button>
                <el-button type="text" size="small" @click="itemTopOut(scope.row)" v-if="scope.row.contentStatus === 2 && scope.row.top === 1">取消置顶</el-button>
              </template>
            </el-table-column>
          </el-table>
        </page-table>
      </div>

    </div>
  </div>
</template>
<script>
  import PageTable from '@/views/content/components/PageTable.vue'
  import { timestampToTime } from '@/utils/util'
  export default {
    name: 'content_manage',
    // 数据
    data() {
      return {
        // 状态
        timingStatus: {
          8: {name:'全部', type: 'success'},
          2: {name: '已发布', type: ''},
          1: {name:'待发布', type: ''},
          5: {name:'发布中', type: ''},
          3: {name:'未通过', type: 'warning'},
          4: {name:'已下线', type: 'info'},
          0: {name:'草稿箱', type: 'info'}
        },
        // 类型默认选中
        typeActiveIndex:'4',
        // 状态默认选中
        stateActiveIndex: '8',
        // 分类数据
        categoryTreeList: [],
        // 分类映射
        categoryTreeListProps:{
          value: 'id',
          label: 'name',
          children: 'children',
          expandTrigger: 'hover'
        },
        // 表格数据
        tableData: {},
        formData: {
          pageIndex: 1,
          pageSize: 10,
          contentType: 4,
          contentStatus: '',
          title: '',
          contentCategory: [],
          contentCategoryId: ''
        }
      }
    },
    // 组件
    components: {
      PageTable
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getCategoryTreeList()
        this.getData()
      })
    },
    // keepAlive 页面显示时
    activated() {
      this.getData();
    },
    // 方法
    methods: {
      init(){

      },
      initFormData(){
        this.formData.title = ''
        this.formData.contentCategory = []
      },
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getData();
      },
      // 获取数据
      getData(){
        this.formData.contentCategoryId = this.formData.contentCategory[this.formData.contentCategory.length - 1]
        // 待发布多种状态 单独接口
        if(this.formData.contentStatus === '1'){
          this.request(this.api.contentCore.not_active_list, this.formData).then(data => {
            if(data.data && data.data.length){
              this.tableDataInit(data)
              this.tableData = data
            }else {
              this.tableData = {}
            }
          })
          return
        }
        this.request(this.api.contentCore.content_list, this.formData).then(data => {
          if(data.data && data.data.length){
            this.tableDataInit(data)
            this.tableData = data
          }else {
            this.tableData = {}
          }
        })
      },
      // table数据格式化
      tableDataInit(data){
        data.data.forEach(item => {
          if(item.showIdentifier){
            let showIdentifier = item.showIdentifier
            if(showIdentifier.indexOf('$') > -1){
              // 获取最后一个分类
              let items = showIdentifier.split('$')[showIdentifier.split('$').length - 1]
              if(items.split('&').length > 2){
                item._categoryName = items.split('&')[items.split('&').length - 1]
              }else{
                item._categoryName = null
              }
            }else {
              if(showIdentifier.split('&').length > 2){
                item._categoryName = showIdentifier.split('&')[showIdentifier.split('&').length - 1]
              }else{
                item._categoryName = null
              }
            }
          }else {
            item._categoryName = null
          }

        })
      },
      // 编辑
      itemEdit(row){
        this.$router.push({
          path:'/content/create/release',
          query: {
            id: row.id
          }
        });
      },
      // 删除
      itemDel(row){
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.contentCore.content_delete, row).then(data => {
            this.$notify.success({ title: '成功',message: '删除成功'})
            this.getData()
          });
        }).catch(() => {
        });
      },
      // 查看评论
      seeComment(row){
        this.$router.push({
          path:'/content/manage/Comment',
          query: {
            id: row.id,
            title: row.title
          }
        });
      },
      // 查看分析
      seeAnalysis(row){

      },
      // 强制下线
      itemOffline(row){
        this.$confirm('确认下线吗？', '下线', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          row.contentStatus = 4
          this.request(this.api.contentCore.content_offline, row).then(data => {
            this.$notify.success({ title: '成功',message: '下线成功'})
            this.getData()
          });
        }).catch(() => {
        });
      },
      // 置顶
      itemTop(row){
        this.$confirm('确认置顶吗？', '置顶', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          row.top = 1
          this.request(this.api.contentCore.content_top, row).then(data => {
            this.$notify.success({ title: '成功',message: '置顶成功'})
            this.getData()
          });
        }).catch(() => {
        });
      },
      // 取消置顶
      itemTopOut(row){
        this.$confirm('取消置顶吗？', '置顶', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          row.top = 0
          this.request(this.api.contentCore.content_top, row).then(data => {
            this.$notify.success({ title: '成功',message: '取消置顶成功'})
            this.getData()
          });
        }).catch(() => {
        });
      },
      // 类型切换
      typeActiveSelect(index,indexPath,event) {
        this.formData.pageIndex = 1
        this.formData.contentType = index
        this.getData()
      },
      // 状态切换
      stateActiveSelect(index,indexPath,event){
        this.formData.pageIndex = 1
        // 等于4时   为全部
        if(index === '8'){
          this.formData.contentStatus = ''
        }else{
          this.formData.contentStatus = index
        }
        this.getData()
      },
      // 获取分类tree
      getCategoryTreeList(){
        this.request(this.api.contentCore.category_tree_list, {contentType: this.formData.contentType}).then(data => {
          if(data && data.length){
            this.categoryTreeListInit(data)
            this.categoryTreeList = data
          }
        });
      },
      // 初始分类数据
      categoryTreeListInit(data){
        if(data && data.length){
          data.forEach((item)=>{
            if(item.children){
              if(item.children.length === 0){
                delete item.children
              }else {
                this.categoryTreeListInit(item.children)
              }
            }
          })
        }
      },



      //
      // 强制下线
      auditOffline(row){
        this.$confirm('确认强制下线吗？', '强制下线', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.contentCore.audit_offline, {id: row.id}).then(data => {
            this.$notify.success({ title: '成功',message: '强制下线成功'})
            this.getData()
          });
        }).catch(() => {
        });

      },

    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
