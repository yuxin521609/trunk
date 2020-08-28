<style lang="less" scoped>
  .release-public{
    .form-data{
      .release-title{
        input{width: 100%;height: 36px;border: none;border-bottom: 1px solid #eee;}
      }
      .el-input__inner{width: 500px;}
      .el-tag{margin-right: 10px;}
      .input-required /deep/ .el-form-item__label:before{content: '*';color: #f56c6c;margin-right: 4px;}
      .release-public-main{padding-bottom: 20px;}
    }
    .commodity-link{display: flex;
      .link{width: 80px;text-align: right;padding-right: 10px;line-height: 36px;}
      .commodity-list{flex:1;
        li{margin-bottom: 10px;
          img{height: 36px;}
          span{margin: 0 20px;}
        }
      }
    }
  }
</style>
<template>
  <div class="release-public">
    <el-form ref="form" :model="formData" label-width="80px" class="form-data">
      <div class="release-title">
        <input type="text" placeholder="请输入标题" v-model="formData.title">
      </div>
      <div class="release-public-main">
        <slot></slot>
      </div>
      <el-form-item label="副标题">
        <el-input v-model="formData.smallTitle" placeholder="请输入副标题"></el-input>
      </el-form-item>
      <el-form-item label="封面" class="input-required">
        <div><el-radio v-model="radio" label="1">单封面</el-radio></div>
        <radio-list :radioList="imgList" :radio-check="formData.coverList" :is-default-check="true">
          <upload-img :is-radio="false" :imgList="imgList"></upload-img>
        </radio-list>
      </el-form-item>
      <el-form-item label="分类" class="input-required">
        <el-cascader :options="categoryTreeList" v-model="formData.contentCategory" :props="categoryTreeListProps" :show-all-levels="false">
        </el-cascader>
      </el-form-item>
      <el-form-item label="标签" class="input-required">
        <el-input v-model="tagsVal" @keyup.13.native="tagsKeyUp"></el-input>
        <el-tag v-for="(item, index) in formData.tagList" closable @close="tagClose(index)" :key="index">{{ item.name }}</el-tag>
        <p>您可添加标签，标签最多八个字符，按回车键确认。描述越准确，越利于触达兴趣人群。</p>
      </el-form-item>
      <el-form-item label="地域">
        <el-select v-model="formData.regions" placeholder="请选择" multiple>
          <el-option :label="item.province" :value="item.provinceCode" v-for="item in provinceList" :key="item.province"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联商品">
        <ul class="commodity-list">
          <li> <el-button type="primary" size="small" @click="linkDialog = true">添加</el-button></li>
          <li v-for="(item, index) in formData.relationInfoList">
            <el-tag type="info" :key="item.id" closable @close="handleClose(index)">id：{{ item.id }}</el-tag>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <!--添加链接-->
    <el-dialog title="关联商品" :visible.sync="linkDialog" width="60%" :close-on-click-modal="false">
      <link-dialog :checkLinkList="formData.relationInfoList" :linkDialog.sync="linkDialog" v-if="linkDialog"></link-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import UploadImg from '@/components/editor/UploadImg'
  import RadioList from '@/views/content/create/components/RadioList'
  import LinkDialog from '@/views/content/create/components/LinkDialog'
  export default {
    props: {
      formData: {
        type: Object,
        default: true
      }
    },
    // 数据
    data() {
      return {
        radio: '1',
        // 标签
        tagsVal: '',
        // 省数据
        provinceList: [],
        // 分类数据
        categoryTreeList: [],
        // 分类映射
        categoryTreeListProps:{
          value: '_flag',
          label: 'name',
          children: 'children',
          expandTrigger: 'hover'
        },
        // 上传的图片
        imgList: [],
        // 关联商品弹窗
        linkDialog: false
      }
    },
    // 组件
    components: {
      UploadImg,
      LinkDialog,
      RadioList
    },
    created(){
      if(this.formData.id){
        this.imgList = JSON.parse(JSON.stringify(this.formData.coverList))
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.getProvinceList()
        this.getCategoryTreeList()
      })
    },
    // 方法
    methods: {
      // 初始化
      init(){
        this.imgList = []
        this.tagsVal = ''
      },
      // 获取分类tree
      getCategoryTreeList(){
        this.request(this.api.contentCore.category_tree_list, {contentType: this.formData.contentType}).then(data => {
          if(data && data.length){
            this.categoryTreeListInit(data)
            this.categoryTreeList = data
          }
        });
      },
      // 初始分类数据
      categoryTreeListInit(data){
        if(data && data.length){
          data.forEach((item)=>{
            item._flag = item.id  +'&'+ item.identifier +'&'+ item.name
            if(item.children){
              if(item.children.length === 0){
                delete item.children
              }else {
                this.categoryTreeListInit(item.children)
              }
            }
          })
        }
      },
      // 获取省级list province_list
      getProvinceList(){
        this.request(this.api.contentCore.province_list, {contentType: this.formData.type}).then(data => {
          if(data && data.length){
            this.provinceList = data
          }
        });
      },
      // 标签
      tagsKeyUp(){
        if(!this.tagsVal) return
        if(this.tagsVal.length > 8){
          this.tagsVal = this.tagsVal.substr(0, 8)
        }
        this.formData.tagList.push({
          name: this.tagsVal
        })
        this.tagsVal = ''
      },
      // 删除标签
      tagClose(index){
        this.formData.tagList.splice(index, 1);
      },

      // 删除链接
      handleClose(index){
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          this.formData.relationInfoList.splice(index, 1)
        }).catch(() => {
        });
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
