<style lang="less" scoped>
  @import "../../style/contentPublic.less";
  .table-img{height: 30px;}
</style>
<template>
  <div class="page-public" v-loading="loading">
    <el-tabs v-model="activeName" class="tabs"  type="card">
      <el-tab-pane label="商品" name="commodity">
        <el-menu :default-active="commodityActiveIndex" class="el-menu-demo" mode="horizontal" @select="commodityHandleSelect">
          <!--SPU-->
<!--          <el-menu-item index="1">标准商品</el-menu-item>-->
          <!--定制单品-->
          <el-menu-item index="2">定制单品</el-menu-item>
          <!--定制套装-->
          <el-menu-item index="3">定制套装</el-menu-item>
        </el-menu>
      </el-tab-pane>
    </el-tabs>
    <page-table :get-data="getCommodityTableData" :table-data="tableData" :form-data="formData">
      <el-table :data="tableData.data" style="width: 100%" height="334">
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column label="封面">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="" class="table-img">
          </template>
        </el-table-column>
        <el-table-column prop="retailPrice" label="商品价格">
          <template slot-scope="scope">
            ￥{{ scope.row.retailPrice ||  scope.row.minPrice}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="contentCheckItem(scope.row)" :disabled="scope.row._flag">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-table>
  </div>
</template>
<script>
  import PageTable from '@/views/content/components/PageTable'
  import { timestampToTime } from '@/utils/util'
  export default {
    props:{
      // 多选中的
      checkLinkList: {
        type: Array
      },
      // 隐藏弹窗
      linkDialog: {
        type: Boolean
      }
    },
    // 数据
    data() {
      return {
        // 商品链接 menu选中的
        commodityActiveIndex: '2',
        // tabs默认选中的
        activeName: 'commodity',
        // 表格数据
        tableData: {},
        // 表格参数
        formData: {
          valid: true,
          pageIndex: 1,
          pageSize: 10
        },
        loading: false
      }
    },
    // 组件
    components: {
      PageTable
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getCommodityTableData()
      })
    },
    // 方法
    methods: {
      // 获取商品链接表格数据
      getCommodityTableData(){
        this.loading = true
        this.$nextTick(() => {
          if(this.commodityActiveIndex == '1'){
            this.request(this.api.product.product_listProduct, this.formData).then(data => {
              this.tableDataInit(data.data)
              this.tableData = data
              this.loading = false
            });
          }
          if(this.commodityActiveIndex == '2'){
            this.request(this.api.product.customizedProduct_list, this.formData).then(data => {
              this.tableDataInit(data.data)
              this.tableData = data
              this.loading = false
            });
          }
          if(this.commodityActiveIndex == '3'){
            this.request(this.api.product.customizedSet_list, this.formData).then(data => {
              this.tableDataInit(data.data)
              this.tableData = data
              this.loading = false
            });
          }
        })

      },
      // 初始化
      tableDataInit(data){
        if(this.checkLinkList && this.checkLinkList.length){
          for(let i = 0; i < this.checkLinkList.length; i++){
              for(let n = 0; n < data.length; n++){
                  if(data[n].id === this.checkLinkList[i].id){
                    data[n]._flag = true
                  }
              }
          }
        }
      },
      // 选中
      contentCheckItem(row){
        const obj = {
          id: row.id
        }
        this.checkLinkList.push(obj)
        this.$emit('update:linkDialog', false)
      },
      // 商品类型切换
      commodityHandleSelect(index,indexPath,event){
        this.formData.pageIndex = 1
        this.commodityActiveIndex = index
        this.getCommodityTableData()
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
