<style lang="less" scoped>
  .check-img {width: 80px;height: 80px;}
  .check-list /deep/ .el-checkbox__inner{position: absolute;left: 0;top: -40px;}
  .check-list /deep/ .el-checkbox__label{padding-left: 0;margin-bottom: 20px;}
  .el-checkbox{float: left;}
</style>
<template>
  <div class="check-list clearfix">
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in imgList" :label="item.url" :key="item.id || item.url">
        <img :src="item.url" alt="" class="check-img">
      </el-checkbox>
      <slot></slot>
    </el-checkbox-group>
  </div>
</template>
<script>
  export default {
    props: {
      imgList: {
        type: Array,
        default: true
      },
      isDefaultCheck: {
        type: Boolean,
        default: false
      }
    },
    // 数据
    data() {
      return {
        checkList:[]
      }
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
      getCheckList(){
        return this.checkList
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      'imgList':{
        handler: function (val, oldVal) {
          if(this.isDefaultCheck){
            this.checkList.push(this.imgList[this.imgList.length - 1].url)
          }
        },
        deep: true
      }
    }
  }
</script>
