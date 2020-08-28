<style lang="less" scoped>
  .radio-list .radio-img{width: 80px;height: 80px;}
  .radio-list /deep/ .el-radio__input{position: absolute;left: 0px;top: 0;}
  .radio-list /deep/ .el-radio__label{padding-left: 0;margin-bottom: 20px;}
  .radio-list /deep/ .el-radio{margin-bottom: 20px; float: left;}
</style>
<template>
  <div class="radio-list clearfix">
    <el-radio v-model="radio" :label="item.url" v-for="item in radioList" :type="item.type" @change="radioChange" :key="item.url">
      <img :src="item.url" alt="" class="radio-img">
    </el-radio>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      //  1 封面  2 内容
      type: {
        type: Number,
        default: 1
      },
      // 选中的
      radioCheck: {

      },
      // 数据
      radioList: {
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
        radio:''
      }
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        // 初始默认选中
        if(this.radioCheck.length ===1 && this.radioCheck[0].id){
          this.radio = this.radioCheck[0].url
        }
      })
    },
    // 方法
    methods: {
      radioChange(val, event) {
        let item
        for(let i = 0; i < this.radioList.length; i++){
            if(this.radioList[i].url === val){
              item = this.radioList[i]
              break
            }
        }
        this.radioCheck[0] = {
          url: item.url,
          id: item.id,
          sort: 1,  //  sort排序  默认暂定 单选
          type: this.type
        }
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      'radioList':{
        handler: function (val, oldVal) {
          if(this.isDefaultCheck){
            if(this.radioList && this.radioList.length > 0){
              this.radio = this.radioList[this.radioList.length - 1].url
              this.radioCheck[0] = {
                url: this.radio,
                id: '',
                sort: 1,  //  sort排序  默认暂定 单选
                type: this.type
              }
            }

          }
        },
        deep: true
      }
    }
  }
</script>
