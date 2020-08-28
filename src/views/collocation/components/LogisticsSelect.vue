<style lang="less" scoped></style>
<template>
  <el-select :class="[widthClass]" v-model="logisticsCode" placeholder="请选择" class="input-w-2" filterable clearable ref="logistics" @change="logisticsChange">
    <el-option v-for="item in logisticsList" :key="item.id" :label="item.company" :value="item.code"></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'logisticsList-select',
    props: {
      value: {

      },
      // 输入框宽度
      widthClass: {
        default: ''
      },
    },
    // 数据
    data() {
      return {
        logisticsCode: '',
        logisticsList: []
      }
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.logisticsCode = this.value;
        this.getLogisticsList()
      })
    },
    // 方法
    methods: {
      //获取物流数据
      getLogisticsList() {
        this.request(this.api.order.expressCompany_list, {}).then(data => {
          this.logisticsList = data.data;
        });
      },
      logisticsChange(val){
        this.$emit('input', val);
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      value(val) {
        this.logisticsCode = val;
      }
    }
  }
</script>
