<style lang="less" scoped>
  .store-info{
    ul{
      li{margin-bottom: 5px;position: relative;padding-left: 70px;
        img{width: 80px;height: 80px;margin-right: 10px;margin-bottom: 10px;}
        span{width: 70px;text-align: right;display: block;position: absolute;left: 0;top: 0;}
      }
    }
  }
</style>
<template>
  <div class="store-info">
    <ul v-if="storeInfo">
      <li><span>门店名称：</span>{{ storeInfo.name }}</li>
      <li><span>所在地区：</span>{{ storeInfo.provinceName }} {{ storeInfo.cityName }} {{ storeInfo.areaName }}</li>
      <li><span>门店类型：</span>{{ "STO001" | codeToName(storeInfo.type) }}</li>
      <li v-if="storeInfo.infosMap && storeInfo.infosMap[0].length">
        <span>经营类型：</span>
        <i v-for="info in storeInfo.infosMap[0]">{{ info.dataName }}</i></li>
      <li v-if="storeInfo.storeArea"><span>店铺面积：</span>{{ storeInfo.storeArea }}m²</li>
      <li v-if="storeInfo.images && storeInfo.images.length"><span>门店图片：</span>
        <img :src="image.url" alt="图片" v-for="image in storeInfo.images">
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'store-info',
    // 组件
    components: {},
    props: {
      storeInfo: {
        type: Object,
        default: null
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
