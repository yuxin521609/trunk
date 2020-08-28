<style lang="less" scoped>
  @import "../style/contentPublic.less";
  .examine{
    .page-main-inner{
      .table-img{width: 60px;height: 60px;}
      .create-time{
        .table-tab{margin-left: 10px;}
      }
      .table-tab{margin-right: 10px;}
      .table-reason{color: #e6a23c;}
    }
  }
</style>
<template>
  <div class="examine page-public">
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
            <el-menu-item index="1">待审核</el-menu-item>
            <el-menu-item index="5">审核中</el-menu-item>
            <el-menu-item index="2">已通过</el-menu-item>
            <el-menu-item index="3">已驳回</el-menu-item>
            <el-menu-item index="4">全部</el-menu-item>
          </el-menu>
        </div>
        <page-table :form-data="formData" :get-data="getData" :table-data="tableData">
          <el-table :data="tableData.data" style="width: 100%" :show-header="false">
            <el-table-column label=""  width="90">
              <template slot-scope="scope">
                <img :src="scope.row.baseContent.coverList[0].url" alt="" class="table-img" v-if="scope.row.baseContent && scope.row.baseContent.coverList.length">
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <h6>{{scope.row.baseContent.title}}</h6>
                <p class="create-time">{{ scope.row.baseContent.createTime | timestampToTime}}
                  <el-tag size="mini" type="info" class="table-tab" v-if="scope.row.baseContent._categoryName">
                    {{ scope.row.baseContent._categoryName  }}
                  </el-tag>
                </p>
                <el-tag size="mini" type="info" v-for="item in scope.row.baseContent.tagList" :key="item" class="table-tab">{{ item.name }}</el-tag>
                <p v-if="scope.row.timingStatus === 3 && scope.row.baseContent.reason" class="table-reason">驳回理由：<span>{{ scope.row.baseContent.reason }}</span></p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="auditPass(scope.row)" v-show="scope.row.timingStatus === 1">审核通过</el-button>
                <el-button type="text" size="small" @click="auditReject(scope.row)" v-show="scope.row.timingStatus === 1">驳回</el-button>
                <el-button type="text" size="small" @click="auditOffline(scope.row)" v-show="scope.row.timingStatus === 2">强制下线</el-button>
              </template>
            </el-table-column>
          </el-table>
        </page-table>
      </div>
    </div>
    <!--驳回信息-->
    <el-dialog title="驳回" :visible.sync="auditRejectDialog" width="40%" :close-on-click-modal="false">
      <el-form :model="auditRejectFormData" :rules="rules" ref="auditRejectForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="请确认驳回原因" prop="reason">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="auditRejectFormData.reason">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditRejectDialog = false" size="small">取 消</el-button>
        <el-button @click="auditRejectSub" type="primary" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import PageTable from '@/views/content/components/PageTable.vue'
  import { timestampToTime } from '@/utils/util'
  export default {
    name: 'examine',
    // 数据
    data() {
      return {
        // 类型默认选中
        typeActiveIndex:'4',
        // 状态默认选中
        stateActiveIndex: '1',
        // 表格数据
        tableData: {},
        formData: {
          pageIndex: 1,
          pageSize: 10,
          type: 4,
          timingStatus: 1
        },
        // 驳回
        auditRejectDialog: false,
        auditRejectRow: null,
        rules: {
          reason: [
            {type: 'string',required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },
        auditRejectFormData: {
          reason: '',
          id: null
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
      // 获取数据
      getData(){
        this.request(this.api.contentCore.audit_list, this.formData).then(data => {
          if(data.data && data.data.length){
            data.data.forEach(item => {
              // 初始显示分类
              if(item.baseContent && item.baseContent.showIdentifier){
                let showIdentifier = item.baseContent.showIdentifier
                if(showIdentifier.indexOf('$') > -1){
                  // 获取最后一个分类
                  let items = showIdentifier.split('$')[showIdentifier.split('$').length - 1]
                  if(items.split('&').length > 2){
                    item.baseContent._categoryName = items.split('&')[items.split('&').length - 1]
                  }else{
                    item.baseContent._categoryName = null
                  }

                }else {
                  if(showIdentifier.split('&').length > 2){
                    item.baseContent._categoryName = showIdentifier.split('&')[showIdentifier.split('&').length - 1]
                  }else{
                    item.baseContent._categoryName = null
                  }
                }
              }
              // 初始显示标签
              /*if(item.baseContent && item.baseContent.tagList && item.baseContent.tagList.length){
                item.baseContent.tags = item.baseContent.tagList
              }else if(item.baseContent && item.baseContent.tags && item.baseContent.tags.length){
                let tags = item.baseContent.tags
                if(tags.indexOf('$') > -1){
                  item.baseContent.tags = tags.split('$').map(item => {
                    return {
                      name: item
                    }
                  })
                }else {
                  item.baseContent.tags = [{
                    name: tags
                  }]
                }
              }else {
                item.baseContent.tags = []
              }*/
            })
          }
          this.tableData = data
        });
      },
      // 审核通过
      auditPass(row){
        this.$confirm('确认审核通过吗？', '审核', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.request(this.api.contentCore.audit_pass, {id: row.id}).then(data => {
            this.$notify.success({ title: '成功',message: '审核成功'})
            this.getData()
          });
        }).catch(() => {
        });

      },
      // 驳回
      auditReject(row){
        this.auditRejectFormData.reason = ''
        this.auditRejectDialog = true
        this.auditRejectRow = row
      },
      // 驳回确认
      auditRejectSub(){
        this.$refs.auditRejectForm.validate((valid) => {
          if (valid) {
            this.auditRejectFormData.id = this.auditRejectRow.id
            this.request(this.api.contentCore.audit_reject, this.auditRejectFormData).then(data => {
              this.$notify.success({ title: '成功',message: '驳回成功'})
              this.auditRejectDialog = false
              this.auditRejectRow = null
              this.getData()
            });
          } else {
            return false;
          }
        });

      },
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
      // 类型切换
      typeActiveSelect(index,indexPath,event) {
        this.formData.pageIndex = 1
        this.formData.type = index
        this.getData()
      },
      // 状态切换
      stateActiveSelect(index,indexPath,event){
        this.formData.pageIndex = 1
        // 等于4时   为全部
        if(index === '4'){
          this.formData.timingStatus = ''
        }else{
          this.formData.timingStatus = index
        }
        this.getData()
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
