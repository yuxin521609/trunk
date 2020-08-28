<style lang="less" scoped>
  .page-title{height: 50px;line-height: 50px;background: #fff;padding-left: 20px;}
</style>
<template>
  <div class="page-title">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    // 数据
    data() {
      return {}
    },
    // 组件
    components: {

    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {

      })
    },
    // 方法
    methods: {},
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
