<style lang="less" scoped></style>
<template>
  <el-select :class="[widthClass]" v-model="warehouseCode" placeholder="请选择" filterable clearable ref="warehouse" @change="warehouseChange" >
    <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.code"></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'warehouse-select',
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
        warehouseCode: '',
        warehouseList: []
      }
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.warehouseCode = this.value;
        this.getWarehouseList();
      })
    },
    // 方法
    methods: {
      //获取仓库数据
      getWarehouseList() {
        this.request(this.api.system.warehouse_list, {used: true}).then(data => {
          this.warehouseList = data.data;
        });
      },
      warehouseChange(val){
        this.$emit('input', val);
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      value(val) {
        this.warehouseCode = val;
      }
    }
  }
</script>
