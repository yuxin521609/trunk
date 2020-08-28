<style lang="less" scoped>
  .page-table{
    .pagination{padding-top: 15px;padding-right: 20px;background: #fff;padding-bottom: 15px;}
  }

</style>
<template>
  <div class="page-table">
    <div>
      <slot></slot>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount" :page-size="tableData.pageSize" :current-page="tableData.pageIndex">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      formData:{
        type: Object
      },
      getData: {
        type: Function,
        // required: true,
      },
      tableData: {
        type: Object,
        // required: true,
        default(){
          return {}
        }
      }
    },
    // 数据
    data() {
      return {}
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {

      })
    },
    // 方法
    methods: {
      // 表格更改条数
      handleSizeChange(val){
        this.formData.pageIndex = 1;
        this.formData.pageSize=val;
        this.getData();
      },
      // 表格更改页数
      handleCurrentChange(val){
        this.formData.pageIndex=val;
        this.getData();
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
