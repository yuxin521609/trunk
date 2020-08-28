<style lang="less" scoped>
  @import "../../style/contentPublic.less";
  .table-img{height: 30px;}
  .form-data{position: absolute;right: 20px;top: 4px;}
</style>
<template>
  <!--添加链接-->
  <el-dialog title="选择链接" :visible.sync="linkDialog" width="60%" :close-on-click-modal="false">
    <div class="page-public"  v-loading="tableLoading">
      <el-tabs v-model="activeName" class="tabs" type="card" @tab-click="handleClick">
        <el-tab-pane label="内容" name="content" type="1">
          <el-menu :default-active="contentFormData.contentType" class="el-menu-demo" mode="horizontal" @select="contentActiveSelect">
            <el-menu-item :index="item.type" v-for="item in contentTypeList" :key="item.type">{{ item.name }}</el-menu-item>
            <div class="form-data">
              <el-form :inline="true" :model="contentFormData" class="demo-form-inline" size="small" ref="form">
                <el-form-item label="">
                  <el-input v-model="contentFormData.title" placeholder="内容标题" suffix-icon="el-icon-search" @keyup.13.native="getContentTableData"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="getContentTableData" size="small" plain>搜索</el-button>
                  <el-button @click="contentFormData.title = ''" size="small" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-menu>
        </el-tab-pane>
        <el-tab-pane label="商品" name="commodity" type="2">
          <el-menu :default-active="commodityActiveIndex" class="el-menu-demo" mode="horizontal" @select="commodityHandleSelect">
            <el-menu-item :index="item.type" v-for="item in commodityTypeList" :key="item.type">{{ item.name }}</el-menu-item>
            <div class="form-data">
              <el-form :inline="true" :model="commodityFormData" class="demo-form-inline" size="small" ref="form">
                <el-form-item label="">
                  <el-input v-model="commodityFormData.searchWords" placeholder="商品名称" suffix-icon="el-icon-search" @keyup.13.native="getCommodityTableData"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="getCommodityTableData" size="small" plain>搜索</el-button>
                  <el-button @click="commodityFormData.searchWords = ''" size="small" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-menu>
        </el-tab-pane>
      </el-tabs>
      <!--内容表格-->
      <page-table :get-data="getContentTableData" :table-data="tableData" :form-data="contentFormData" v-if="activeName === 'content'">
        <el-table :data="tableData.data" style="width: 100%" height="334">
          <el-table-column prop="title" label="内容标题"></el-table-column>
          <el-table-column label="封面">
            <template slot-scope="scope">
              <img :src="scope.row.coverList[0].url" alt="" class="table-img" v-if="scope.row.coverList">
            </template>
          </el-table-column>
          <el-table-column prop="retailPrice" label="发布时间">
            <template slot-scope="scope">
              {{ scope.row.createTime | timestampToTime}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="contentCheckItem(scope.row)" :disabled="scope.row._flag">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
      <!--商品表格-->
      <page-table :get-data="getCommodityTableData" :table-data="tableData" :form-data="commodityFormData" v-if="activeName === 'commodity'">
        <el-table :data="tableData.data" style="width: 100%" height="334">
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.image" alt="" class="table-img">
            </template>
          </el-table-column>
          <el-table-column prop="retailPrice" label="销售价格">
            <template slot-scope="scope">
              ￥{{ scope.row.retailPrice ||  scope.row.minPrice}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="commodityCheckItem(scope.row)" :disabled="scope.row._flag">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-table>
    </div>
  </el-dialog>

</template>
<script>
  import PageTable from '@/views/content/components/PageTable'
  import { timestampToTime } from '@/utils/util'
  export default {
    props:{
      // 选中回调
      callback: {
        type: Function
      },
      // 选中的
      checkLinkList: {
        type: Array
      }
    },
    // 数据
    data() {
      return {
        // 父级需要的参数
        formData: {
          title: '',
          url: '',
          linkType: '',
          linkTypeName: '',
          detailsType: '',
          detailsTypeName: ''
        },
        // 显示隐藏
        linkDialog: false,
        // 商品链接 menu选中的
        commodityActiveIndex: '',
        // tabs默认选中的
        activeName: '',
        // 表格数据
        tableData: {},
        // 内容列表参数
        contentFormData:{
          title: '',
          contentType: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 商品列表参数
        commodityFormData:{
          valid: true,
          searchWords: '',
          pageIndex: 1,
          pageSize: 10
        },
        // 链接类型
        linkTypeList: [
          {name: '内容', type: '1', value: 'content'},
          {name: '商品', type: '2', value: 'commodity'}
        ],
        // 内容类型
        contentTypeList: [
          {name: '文章', type: '4'},
          {name: '图集', type: '3'},
          {name: '小视频', type: '2'},
          {name: '视频', type: '1'}
        ],
        // 商品类型
        commodityTypeList: [
          {name: '定制单品', type: '5'},
          {name: '定制套装', type: '6'},
          {name: '标准商品', type: '7'}
        ],
        tableLoading: false
      }
    },
    // 组件
    components: {
      PageTable
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        // 获取商品数据

      })
    },
    // 方法
    methods: {
      init(){
        this.activeName = this.linkTypeList[0].value
        this.formData =  {
          url: '',
          linkType: this.linkTypeList[0].type,
          linkTypeName: this.linkTypeList[0].name,
          detailsType: this.contentTypeList[0].type,
          detailsTypeName: this.contentTypeList[0].name
        }
        this.contentFormData = {
          title: '',
          contentType: this.contentTypeList[0].type,
          pageIndex: 1,
          pageSize: 10
        },
        this.getContentTableData()
      },
      // 获取内容数据
      getContentTableData(){
        this.tableLoading = true
        this.$nextTick(() => {
          this.request(this.api.contentCore.content_pass_list, this.contentFormData).then(data => {
            this.tableDataInit(data.data)
            this.tableData = data
            this.tableLoading = false
          });
        })
      },
      // 获取商品链接表格数据
      getCommodityTableData(){
        this.tableLoading = true
        this.$nextTick(() => {
          // 定制单品
          if(this.commodityActiveIndex == '5'){
            this.request(this.api.product.customizedProduct_list, this.commodityFormData).then(data => {
              this.tableDataInit(data.data)
              this.tableData = data
              this.tableLoading = false
            });
          }
          // 定制套装
          if(this.commodityActiveIndex == '6'){
            this.request(this.api.product.customizedSet_list, this.commodityFormData).then(data => {
              this.tableDataInit(data.data)
              this.tableData = data
              this.tableLoading = false
            });
          }
          // 标准商品
          if(this.commodityActiveIndex == '7'){
            this.request(this.api.product.product_listProduct, this.commodityFormData).then(data => {
              this.tableDataInit(data.data)
              this.tableData = data
              this.tableLoading = false
            });
          }
        })

      },
      // 初始化
      tableDataInit(data){
        if(this.checkLinkList && this.checkLinkList.length){
          for(let i = 0; i < this.checkLinkList.length; i++){
            for(let n = 0; n < data.length; n++){
              if(data[n].id === this.checkLinkList[i].url || data[n].contentId === this.checkLinkList[i].url){
                data[n]._flag = true
              }
            }
          }
        }
      },
      // 内容选中
      contentCheckItem(row){
        this.formData.url = row.contentId
        this.formData.title = row.title
        this.$set(this.checkLinkList, 0, JSON.parse(JSON.stringify(this.formData)))
        this.linkDialog = false
    },
      // 商品选中
      commodityCheckItem(row){
        this.formData.url = row.id
        this.formData.title = row.name
        this.$set(this.checkLinkList, 0, JSON.parse(JSON.stringify(this.formData)))
        this.linkDialog = false
      },
      // 一级切换
      handleClick(tab, event){
        const type = tab.$attrs.type
        const name = tab.label
        if(type === '1'){
          this.contentFormData.contentType = this.contentTypeList[0].type
          this.contentFormData.pageIndex = 1
          this.getContentTableData()
          this.contentFormData.title = ''
          this.formData.detailsType = this.contentTypeList[0].type
          this.formData.detailsTypeName = this.contentTypeList[0].name
        }
        if(type === '2'){
          this.commodityActiveIndex = this.commodityTypeList[0].type
          this.commodityFormData.pageIndex = 1
          this.getCommodityTableData()
          this.commodityFormData.searchWords = ''
          this.formData.detailsType = this.commodityTypeList[0].type
          this.formData.detailsTypeName = this.commodityTypeList[0].name
        }
        this.formData.linkType = type
        this.formData.linkTypeName = name
      },
      // 内容类型切换
      contentActiveSelect(index,indexPath,event){
        const name = event.$el.innerText
        this.contentFormData.pageIndex = 1
        this.contentFormData.title = ''
        this.contentFormData.contentType = index
        this.formData.detailsType = index
        this.formData.detailsTypeName = name
        this.getContentTableData()
      },
      // 商品类型切换
      commodityHandleSelect(index,indexPath,event){
        const name = event.$el.innerText
        this.commodityFormData.pageIndex = 1
        this.commodityFormData.searchWords = ''
        this.commodityActiveIndex = index
        this.formData.detailsType = index
        this.formData.detailsTypeName = name
        this.getCommodityTableData()
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
