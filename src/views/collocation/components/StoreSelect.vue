<style lang="less" scoped></style>
<template>
  <el-select :class="[widthClass]" v-model="storeId" placeholder="请选择" filterable clearable ref="store"  @change="storeChange">
    <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'store-select',
    props: {
      value: {

      },
      // 输入框宽度
      widthClass: {
        default: ''
      },
      // 回调
      callBack: {
        type: Function
      }
    },
    // 数据
    data() {
      return {
        storeId: '',
        storeList: []
      }
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.storeId = this.value;
        this.getStoreList();
      })
    },
    // 方法
    methods: {
      //获取门店数据
      getStoreList() {
        this.request(this.api.store.storeBasic_list, {}).then(data => {
          this.storeList = data.data;
        });
      },
      storeChange(val){
        this.$emit('input', val);
        if(this.callBack && val){
          let store = this.storeList.find(item => {
            return item.id === val;
          });
          this.callBack(store)
        }
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      value(val) {
        this.storeId = val;
      }
    }
  }
</script>
