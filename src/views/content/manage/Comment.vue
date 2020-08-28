<style lang="less" scoped>
  @import "../style/contentPublic.less";
  .comment{
    h4{padding-left: 10px;line-height: 60px;}
  }
</style>
<template>
  <div class="comment page-public">
    <div class="page-main">
      <div class="page-main-inner">
        <h4>{{ title }}</h4>
        <page-table :form-data="formData" :get-data="getData" :table-data="tableData">
          <el-table :data="tableData.data" style="width: 100%" >
            <el-table-column label="用户名" prop="createBy" width="120"></el-table-column>
            <el-table-column label="评论内容" prop="content"></el-table-column>
            <el-table-column label=""  width="150">
              <template slot-scope="scope">
                {{scope.row.createTime | timestampToTime}}
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
  export default {
    name: 'content_comment',
    // 数据
    data() {
      return {
        // 标题
        title:'',
        // 请求参数
        formData: {
          contentId: null,
          pageIndex: 1,
          pageSize: 10,
        },
        // 表格数据
        tableData: {}
      }
    },
    // 组件
    components: {
      PageTable
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.formData.contentId =  this.$route.query.id
        this.title =  this.$route.query.title
        this.getData()
      })
    },
    // 方法
    methods: {
      getData(){
        this.request(this.api.contentCore.comment_list,this.formData).then(data => {
          this.tableData = data
        })
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
