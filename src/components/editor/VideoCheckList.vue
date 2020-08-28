<style lang="less" scoped>
  .check-list /deep/ .el-checkbox__inner{position: absolute;left: 0px;top: -96px;}
  .check-list /deep/ .check-position .el-checkbox__inner{top: -76px;}
  .check-list /deep/ .el-checkbox__label{padding-left: 0;margin-bottom: 20px;}
  .check-img {width: 80px;height: 80px;display: block;}
  .el-checkbox{float: left;}
</style>
<template>
  <div class="check-list clearfix">
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in videoList" :label="item" :key="item.url" :class="{'check-position': item.url && !item.videoCoverUrl}">
        <img :src="item.videoCoverUrl" alt="" class="check-img" v-if="item.videoCoverUrl">
        <video width="80" height="80" v-if="item.url && !item.videoCoverUrl">
          <source :src="item.url" type="video/mp4">
        </video>
      </el-checkbox>
      <slot></slot>
    </el-checkbox-group>
  </div>
</template>
<script>
  export default {
    props: {
      videoList: {
        type: Array,
        default: true
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
      init(){

      },
      getCheckList(){
        let checkListAllInfo = []
        if(this.checkList.length){
          this.checkList.forEach(item => {
            checkListAllInfo.push({
              url: item.url,
              fileId: item.fileId
            })
          })


        }
        return checkListAllInfo
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      /*'imgList':{
        handler: function (val, oldVal) {


        },
        deep: true
      },*/
    }
  }
</script>
