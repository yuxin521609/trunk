<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-20 08:58:18
 * @LastEditTime: 2019-08-20 14:29:26
 * @LastEditors: Please set LastEditors
 -->
<style lang="less" scoped>
  @import "../style/contentPublic.less";
  .material_manage{
    .form-data{padding: 20px;position: relative;
      .total{margin-right: 20px;}
      .form{position: absolute;right: 20px;top: 15px;}
    }
    .item-list{
      .item{width: 20%;float: left;padding: 0 1%;position: relative;margin-bottom: 20px;text-align: left;
        .item-inner{border: 1px solid #e6e8ed;padding: 8px;
          .img{width: 100%;height: 150px;}
          img,video{ width: 100%;height: 150px;}
          .info{padding-left: 10px;
            h3{padding-top: 10px;font-size:18px;}
            p{font-size: 14px;line-height: 32px;}
          }
        }
        .item-checkbox{position: absolute;right: -9px;bottom: 14px;}
      }
    }
    .no-content{height: 60px;line-height: 60px;border-bottom: 1px solid #e6e6e6;border-top: 1px solid #e6e6e6;text-align: center;color: #909399;}
    .add-edit  /deep/ .el-input__inner{width: 200px;}
    .edit-img,.edit-video{width: 80px;height: 80px;}
  }

</style>
<template>
  <div class="material_manage page-public">
    <div class="page-main">
      <div class="page-main-inner item-margin">
        <el-menu :default-active="typeActiveIndex" class="el-menu-demo page-menu-border" mode="horizontal" @select="typeActiveSelect">
          <el-menu-item index="2">图片</el-menu-item>
          <el-menu-item index="1">视频</el-menu-item>
        </el-menu>
        <div class="form-data">
          <span class="total" v-show="typeActiveIndex == 2">共{{ tableData.totalCount }}张图片</span>
          <span class="total" v-show="typeActiveIndex == 1">共{{ tableData.totalCount }}个视频</span>
          <el-button size="small" @click="itemDel(false)">批量删除</el-button>
          <el-button type="primary" @click="dialogVisibleShow(true)" size="small">上传</el-button>
          <div class="form">
            <el-form :inline="true" :model="formData" class="demo-form-inline" size="small" ref="form">
              <el-form-item label="">
                <el-input v-model="formData.title" placeholder="请输入关键字搜索内容" suffix-icon="el-icon-search" @keyup.13.native="searchTableData"></el-input>
              </el-form-item>
              <el-form-item label="素材分类：">
                <el-cascader :options="categoryTreeList" v-model="formData.category" :props="categoryTreeListProps" :show-all-levels="false" clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="searchTableData" size="small">搜索</el-button>
                <el-button plain @click="initFormData" size="small">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <page-table :form-data="formData" :get-data="getData" :table-data="tableData">
          <div v-show="!tableData.data || (tableData.data && tableData.data.length === 0)" class="no-content">暂无数据</div>
          <div class="item-list clearfix">
            <el-checkbox-group v-model="checkList">
              <div class="item" v-for="item in tableData.data">
                <el-checkbox :label="item" class="item-checkbox" :key="item.id"><div></div></el-checkbox>
                <div class="item-inner">
                  <div class="img">
                    <el-image style="width: 100%; height: 100%" :src="item.url" fit="contain" v-if="formData.type == '2'"></el-image>
                    <el-image style="width: 100%; height: 100%" :src="item.videoCoverUrl" fit="contain" v-if="formData.type == '1'"></el-image>
                  </div>
                  <div class="info">
                    <h4 :title="item.title">{{ item.title | titleCut }}</h4>
                    <p v-if="item._categoryName">分类：{{ item._categoryName }}</p>
                    <div class="btns">
                      <el-button type="text" size="small" @click="dialogVisibleShow(false, item )">编辑</el-button>
                      <el-button type="text" size="small" @click="itemDel(true,item)">删除</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </page-table>
        <!--新增和编辑-->
        <el-dialog :title="addAndEditFlag ? '新增' : '编辑'" :visible.sync="dialogVisible" width="30%" class="add-edit">
          <el-form ref="form" :model="addAndEditFormData" label-width="80px" :rules="rules" v-if="typeActiveIndex === '2'" :key="typeActiveIndex">
            <el-form-item label="图片" prop="url">
              <upload-img v-model="addAndEditFormData.url" v-if="addAndEditFlag" :action-url="pictureUploadUrl" :content-txt="'上传图片'" :baseId.sync="addAndEditFormData.baseId"></upload-img>
              <img :src="addAndEditFormData.url" alt="" class="edit-img"  v-if="!addAndEditFlag">
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="addAndEditFormData.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category">
              <el-cascader :options="categoryTreeList" v-model="addAndEditFormData.category" :props="categoryTreeListProps">
              </el-cascader>
            </el-form-item>
          </el-form>
          <el-form ref="videoForm" :model="addAndEditVideoFormData" label-width="80px" :rules="videoRules" v-if="typeActiveIndex === '1'" :key="typeActiveIndex">
            <el-form-item label="视频" prop="url">
              <upload-video v-model="addAndEditVideoFormData.url" v-if="dialogVisible && addAndEditFlag" ref="addAndEditVideo"></upload-video>
              <img :src="addAndEditVideoFormData.videoCoverUrl" alt="" class="edit-img"  v-if="!addAndEditFlag">
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="addAndEditVideoFormData.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category">
              <el-cascader :options="categoryTreeList" v-model="addAndEditVideoFormData.category" :props="categoryTreeListProps">
              </el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAndEditSub">确 定</el-button>
        </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import PageTable from '@/views/content/components/PageTable.vue'
  import UploadImg from '@/components/editor/UploadImg.vue'
  import UploadVideo from '@/components/editor/UploadVideo.vue'
  export default {
    name: 'material_manage',
    // 数据
    data() {
      return {
        // 素材图片上传地址
        pictureUploadUrl: this.api.contentCore.picture_upload.url,
        // 类型默认选中
        typeActiveIndex: '2',  // 2 图片   1 视频
        tableData: {},
        // 批量删除选中的
        checkList: [],
        // 参数
        formData: {
          pageIndex: 1,
          pageSize: 10,
          type: 2,
          title: '',
          category: [],
          categoryId: ''
        },
        // 分类映射
        categoryTreeList: [],
        categoryTreeListProps:{
          value: '_flag',
          label: 'name',
          children: 'children',
          expandTrigger: 'hover'
        },

        // 新增和编辑
        dialogVisible: false,
        addAndEditFlag: true,
        // 分类数据
        addAndEditCategoryTreeList: [],
        // 新增图片
        addAndEditFormData: {
          type: 2,
          title: '',
          url:'',
          category: [],
          baseId: '',
          categoryId:  '',
          showIdentifier: ''
        },
        rules: {
          url: [
            { type: 'string',required: true, message: '请选择图片', trigger: 'change' }
          ],
          title:[
            { type: 'string',required: true, message: '请输入标题', trigger: 'change' },
            { max: 15, message: '长度不大于15', trigger: 'change' }
          ],
          category: [
            { type: 'array',required: true, message: '请选择分类', trigger: 'change' },

          ]
        },
        // 新增视频
        infoVideo: {},
        addAndEditVideoFormData: {
          type: 1,
          title: '',
          url:'',
          category: [],
          categoryId:  '',
          showIdentifier: '',
          videoCoverUrl: ''
        },
        videoRules: {
          url: [
            { type: 'string',required: true, message: '请选择视频', trigger: 'change' }
          ],
          title:[
            { type: 'string',required: true, message: '请输入标题', trigger: 'change' },
            { max: 15, message: '长度不大于15', trigger: 'change' }
          ],
          category: [
            { type: 'array',required: true, message: '请选择分类', trigger: 'change' },
          ]
        },
      }
    },
    // 组件
    components: {
      PageTable,
      UploadImg,
      UploadVideo
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        // sourceType 1 视频  2 图片
        this.getCategoryTreeList(2)
        this.getData()
      })
    },
    // keepAlive 页面显示时
    activated() {
      this.getData();
    },
    // 方法
    methods: {
      // 点击搜索
      searchTableData(){
        this.formData.pageIndex = 1;
        this.getData();
      },
      // 获取数据
      getData(){
        let check = this.formData.category
        if(check && check.length){
          this.formData.categoryId = check[check.length-1].split('&')[0]
        }else {
          this.formData.categoryId = ''
        }
        this.request(this.api.contentCore.library_list, this.formData).then(data => {
          this.tableDataInit(data)
          this.tableData = data
        })
      },
      // 初始化数据
      tableDataInit(data){
        if(data.data && data.data.length){
          const num = new Date().getTime()
          data.data.forEach(item => {
            // 初始url
            if(item.videoCoverUrl){
              item.videoCoverUrl = item.videoCoverUrl + '?time=' + num
            }
            if(item.url){
              item.url = item.url + '?time=' + num
            }
            // 初始化分类
            if(item.showIdentifier){
              if(item.showIdentifier.indexOf('$') > -1){
                let ary = item.showIdentifier.split('$')
                item._categoryName = ary[ary.length-1].split('&')[1]
              }else {
                item._categoryName = item.showIdentifier.split('&')[1]
              }
            }
          })
        }
      },
      // 重置
      initFormData(){
        this.formData.title = ''
        this.formData.category = []
      },
      // 新增和编辑显示
      dialogVisibleShow(flag, row){
        // 重置图片上传信息
        if(this.typeActiveIndex === '2'){
          setTimeout(() => {
            this.$refs.form.resetFields()
          },0)
        }
        // 重置视频上传信息
        if(this.typeActiveIndex === '1'){
          setTimeout(() => {
            this.$refs.videoForm.resetFields()
          },0)
        }
        if(flag){
          this.addAndEditFlag = true
          this.addAndEditVideoFormData.url = ''
          this.addAndEditVideoFormData.id = ''
        }else{
          this.addAndEditFlag = false
          this.request(this.api.contentCore.library_get, {id: row.id }).then(data => {
            if(data.type == 2){
              this.addAndEditFormData ={
                id: data.id,
                type: data.type,
                title: data.title,
                url: data.url,
                baseId: data.baseId,
                category: [],
                categoryId: data.categoryId,
                showIdentifier: data.showIdentifier
              }
              if(data.showIdentifier){
                if(data.showIdentifier.indexOf('$') > -1){
                  let ary = data.showIdentifier.split('$')
                  this.addAndEditFormData.category = ary
                }else {
                  this.addAndEditFormData.category = [data.showIdentifier]
                }
              }
            }
            if(data.type == 1){
              this.addAndEditVideoFormData ={
                id: data.id,
                type: data.type,
                title: data.title,
                url: data.url,
                category: [],
                categoryId: data.categoryId,
                showIdentifier: data.showIdentifier,
                videoCoverUrl: data.videoCoverUrl
              }
              if(data.showIdentifier){
                if(data.showIdentifier.indexOf('$') > -1){
                  let ary = data.showIdentifier.split('$')
                  this.addAndEditVideoFormData.category = ary
                }else {
                  this.addAndEditVideoFormData.category = [data.showIdentifier]
                }
              }
            }
          });
        }
        this.dialogVisible = true

      },
      addAndEditSub(){
        let url = this.api.contentCore.library_save
        if(!this.addAndEditFlag){
          url = this.api.contentCore.library_edit
        }
        // 2  图片
        if(this.typeActiveIndex === '2'){
          this.$refs.form.validate((valid) => {
            if (valid) {
              let data = this.addAndEditFormData.category
              this.addAndEditFormData.categoryId = data[data.length-1].split('&')[0]
              this.addAndEditFormData.showIdentifier = data.join('$')
              let params
              if(this.addAndEditFlag){
                params = {
                  sourceLibrary: this.addAndEditFormData
                }
              }else {
                params = this.addAndEditFormData
              }

              this.request(url, params).then(data => {
                if(this.addAndEditFormData.id){
                  this.$notify.success({ title: '成功',message: '编辑成功'})
                }else {
                  this.$notify.success({ title: '成功',message: '新增成功'})
                }
                this.getData()
                this.dialogVisible = false
              })
            } else {
              return false;
            }
          });
        }
        // 1  视频
        if(this.typeActiveIndex === '1'){
          this.$refs.videoForm.validate((valid) => {
            if (valid) {
              let data = this.addAndEditVideoFormData.category
              this.addAndEditVideoFormData.categoryId = data[data.length-1].split('&')[0]
              this.addAndEditVideoFormData.showIdentifier = data.join('$')
              let params
              if(this.addAndEditFlag){
                this.infoVideo = this.$refs.addAndEditVideo.getUploadVideoInfo()
                params = {
                  sourceLibrary: this.addAndEditVideoFormData,
                  baseVideo: this.infoVideo
                }
              }else {
                params = this.addAndEditVideoFormData
              }
              this.request(url, params).then(data => {
                if(this.addAndEditVideoFormData.id){
                  this.$notify.success({ title: '成功',message: '编辑成功'})
                }else {
                  this.$notify.success({ title: '成功',message: '新增成功'})
                }
                this.getData()
                this.dialogVisible = false
              })
            } else {
              return false;
            }
          });
        }
      },
      // 删除
      itemDel(flag,row){
        if(!flag && !this.checkList.length){
          this.$notify.error({ title: '成功',message: '未选择数据'})
          return
        }
        this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose:false
        }).then(() => {
          let params = []
          if(flag){
            params.push({
              id: row.id,
              baseId: row.baseId,
              type: row.type,
              categoryId: row.categoryId
            })
          }
          if(!flag){
            this.checkList.forEach(item => {
              params.push({
                id: item.id,
                baseId: item.baseId,
                type: item.type,
                categoryId: item.categoryId
              })
            })
          }
          this.request(this.api.contentCore.delete_batch, params).then(data => {
            this.$notify.success({ title: '成功',message: '删除成功'})
            this.checkList = []
            this.getData()
          });
        }).catch(() => {

        });
      },
      // 类型切换
      typeActiveSelect(index,indexPath,event) {
        this.formData.pageIndex = 1
        this.formData.type = index
        this.typeActiveIndex = index
        this.getCategoryTreeList(index)
        this.getData()
      },
      // 获取分类tree
      // sourceType 1 视频  2 图片
      getCategoryTreeList(type){
        this.request(this.api.contentCore.source_tree_list, {sourceType: type}).then(data => {
          if(data && data.length){
            // 初始化数据
            this.categoryTreeListInit(data)
            this.categoryTreeList = data
          }
        });
      },
      // 初始数据
      categoryTreeListInit(data){
        if(data && data.length){
          data.forEach((item)=>{
            item._flag = item.id +'&'+ item.name
            if(item.children){
              if(item.children.length === 0){
                delete item.children
              }else {
                this.categoryTreeListInit(item.children)
              }
            }
          })
        }
      }
    },
    // 过滤器
    filters: {
      titleCut: function (value) {
        if(!value) return
        if(value.length > 8){
          return value.substr(0, 8) + '...'
        }else {
          return value
        }

      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
