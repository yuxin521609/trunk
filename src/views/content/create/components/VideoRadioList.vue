<style lang="less" scoped>
  .radio-list .radio-img{width: 80px;height: 80px;display: block;}
  .radio-list /deep/ .el-radio__input{position: absolute;left: 0px;top: 0;}
  .radio-list /deep/ .el-radio__label{padding-left: 0;margin-bottom: 20px;}
  .radio-list /deep/ .el-radio{margin-bottom: 20px; float: left;}
</style>
<template>
  <div class="radio-list clearfix">
    <el-radio v-model="radio" :label="item" v-for="item in radioList" :type="item.type" @change="radioChange" :key="item.url">
      <img :src="item.videoCoverUrl" alt="" class="radio-img">
    </el-radio>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      // 选中的
      radioCheck: {

      },
      // 数据
      radioList: {
        type: Array,
        default: true
      }
    },
    // 数据
    data() {
      return {
        radio:''
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
      radioChange(val, event) {
        this.radioCheck[0] = {
          mediaUrl: val.url,
          libraryId: val.id,
          videoCoverUrl: val.videoCoverUrl
        }
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
