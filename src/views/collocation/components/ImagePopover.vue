<style lang="less" scoped>
  .table-img{height: 40px; max-width: 90px;}
  .poporer-img{height: 320px;width: auto;}
</style>
<template>
  <el-popover placement="left" trigger="hover" v-if="imgSrc">
    <img class="poporer-img" :src="imgSrc" alt="商品图片" />
    <img slot="reference" :src="imgSrc" class="table-img" alt="商品图片" />
  </el-popover>
</template>
<script>
  export default {
    name: 'img-poporer',
    props: {
      imgSrc: {
        type: String,
        default: ''
      }
    },
    // 数据
    data() {
      return {}
    },
    // 初始化数据
    mounted() {
    },
    // 方法
    methods: {},
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
