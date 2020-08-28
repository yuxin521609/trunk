<style lang="less" scoped>
  @import "../style/contentPublic.less";
  .release{
    .tabs{background: #fff;
      width: 100%;
    }
    .footer-btns{background: #fff;padding: 10px 20px;
      div{float: right;}
    }
  }
</style>
<template>
  <div class="release page-public">
    <div class="page-main item-margin">
      <div class="page-main-inner">
        <el-tabs v-model="activeName" class="tabs" :before-leave="handleBeforeClick" type="card">
          <el-tab-pane label="发布文章" name="myArticle" contentType="4">
            <my-article :form-data="formData" ref="myArticle" v-if="activeName == 'myArticle'"></my-article>
          </el-tab-pane>
          <el-tab-pane label="发布图集" name="myAtlas" contentType="3">
            <my-atlas :form-data="formData" ref="myAtlas" v-if="activeName == 'myAtlas'"></my-atlas>
          </el-tab-pane>
          <el-tab-pane label="发布小视频" name="videoSmall" contentType="2">
            <my-video  :form-data="formData" ref="videoSmall"  v-if="activeName == 'videoSmall'"></my-video>
<!--            <my-small-video :formData="formData" ref="videoSmall" v-if="activeName == 'videoSmall'"></my-small-video>-->
          </el-tab-pane>
          <el-tab-pane label="发布视频" name="video" contentType="1" ref="video">
            <my-video  :form-data="formData" ref="video"  v-if="activeName == 'video'"></my-video>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="footer-btns clearfix item-margin">
      <div>
        <el-button type="primary" size="small" @click="contentSave(true)">发布</el-button>
        <el-button size="small" @click="contentSave(false)">存草稿</el-button>
        <el-button size="small" @click="timeDialog = true">定时发布</el-button>
        <el-button size="small">预览</el-button>
      </div>
    </div>
    <!--定时弹窗-->
    <el-dialog title="添加定时" :visible.sync="timeDialog" width="40%" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="pubDateForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="选择发布时间" prop="pubDate">
          <el-date-picker v-model="formData.pubDate" type="datetime" placeholder="选择日期时间" size="small"></el-date-picker>
        </el-form-item>
      </el-form>
      <p v-show="formData.pubDate">本内容将于{{ formData.pubDate | timestampToTime }} 发表</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeDialog = false" size="small">取 消</el-button>
        <el-button @click="timeDialogSub" type="primary" size="small">确定并发布</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Article from '@/views/content/create/components/Article'
  import Atlas from '@/views/content/create/components/Atlas'
  import Video from '@/views/content/create/components/Video'
  export default {
    name: 'release',
    // 组件
    components: {
      'my-article': Article,
      'my-atlas': Atlas,
      'my-video': Video
    },
    // 数据
    data() {
      return {
        tabs: [
          {type: '4', name: 'myArticle'},
          {type: '3', name: 'myAtlas'},
          {type: '2', name: 'videoSmall'},
          {type: '1', name: 'video'}
        ],
        // 提交表单
        formData: {
          // 类型
          contentType: '',     // 4 文章发布  3 图集发布   2 小视频发布  1 视频发布
          // 标题
          title: '',
          //副标题
          smallTitle: '',
          // 封面
          coverList: [],
          // 分类
          contentCategory:[],
          // 标签
          tagList: [],
          // 地狱
          region: '',
          regions: [],
          // 商品链接
          relationInfoList:[],
          relationInfo: '',
          // 是否草稿
          contentStatus: '',
          // 是否定时
          isTime: 0,
          // 定时时间
          pubDate: '',

          // 文章
          // 富文本信息
          article: {
            content:''
          },

          // 图集
          atlasList: [],

          // 视频
          // 是否素材
          libraryId: '',
          videoInfoParams:{
            info: null
          },
          mediaUrl: '',
          fileId: ''
        },
        timeDialog: false,
        rules: {
          pubDate: [
            {required: true, message: '请选择发布时间', trigger: 'blur'}
          ]
        },

        // 默认显示的tabs
        activeName: '',
        editId: null
      }
    },
    created(){
      this.editId =  this.$route.query.id
      if(this.editId){
        this.getDetails()
      }else{
        this.activeName = 'myArticle'
        this.formData.contentType = '4'
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {

      })
    },
    // keepAlive 页面显示时
    activated() {
      this.getTableList();
    },
    // 方法
    methods: {
      init(){
        this.formDataInit()
       /* this.$nextTick(()=>{

        })*/
       setTimeout(()=>{
         if(this.$refs[this.activeName]){
           this.$refs[this.activeName].init()
         }
       },0)
      },
      formDataInit(){
        // 初始化数据
        this.formData = {
          // 类型
          contentType: this.formData.contentType,     // 4 文章发布  3 图集发布   2 小视频发布  1 视频发布
          // 标题
          title: '',
          //副标题
          smallTitle: '',
          // 封面
          coverList: [],
          // 分类
          contentCategory:[],
          // 标签
          tagList: [],
          // 地狱
          region: '',
          regions: [],
          // 商品链接
          relationInfoList:[],
          relationInfo: '',
          // 是否草稿
          contentStatus: '',
          // 是否定时
          isTime: 0,
          // 定时时间
          pubDate: '',
          // 文章
          // 富文本信息
          article: {
            content:''
          },
          // 图集
          atlasList: [],
          // 视频
          // 是否素材
          libraryId: '',
          videoInfoParams:{
            info: null
          },
          mediaUrl: '',
          fileId: ''
        }
      },
      async handleBeforeClick(activeName, oldActiveName){
        if(!oldActiveName || oldActiveName == '0'){
          return true
        }else{
          let activeItem = this.tabs.find(item => {
            return activeName == item.name
          })
          if(this.editId){
            const flag = await this.$confirm('点击确认视为放弃本次编辑，开始其他类型的发布', '切换', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              showClose:false
            });
            if(flag){
              this.formData.id = null
              this.editId = null
              this.formData.contentType = activeItem.type
              this.$route.query.id = null
              this.init()
              return true
            }else{
              return false
            }
          }else{
            this.formData.contentType = activeItem.type
            this.init()
            return true
          }
        }
      },
      // 确认定时
      timeDialogSub(){
        this.$refs.pubDateForm.validate((valid) => {
          if (valid) {
            this.formData.isTime = 1
            this.contentSave(true);
          } else {
            return false;
          }
        });
      },
      // 发布
      contentSave(state){
        if(!this.formData.title){
          this.$notify.error({ title: '错误',message: '请输入标题'})
          return
        }
        if(this.formData.title.length > 15){
          this.$notify.error({ title: '错误',message: '标题过长，最大15位'})
          return
        }
        if(this.formData.smallTitle.length && this.formData.smallTitle.length > 20){
          this.$notify.error({ title: '错误',message: '副标题过长，最大20位'})
          return
        }
        if(!this.formData.coverList.length){
          this.$notify.error({ title: '错误',message: '请选择封面'})
          return
        }
        if(!this.formData.contentCategory.length){
          this.$notify.error({ title: '错误',message: '请选择分类'})
          return
        }
        if(!this.formData.tagList.length){
          this.$notify.error({ title: '错误',message: '请添加标签'})
          return
        }
        switch(this.formData.contentType) {
          // 发布文章
          case '4':
            let html = this.$refs.myArticle.$refs.editor.getEditorHtml()
            if(html == '<p><br></p>'){
              this.$notify.error({ title: '错误',message: '请输入文章内容'})
              return;
            }
            this.formData.article.content = html
            break;
          // 发布图集
          case '3':
            // 加 sort 后端排序
            if(this.formData.atlasList && this.formData.atlasList.length){
              this.formData.atlasList.forEach((item, index) => {
                item.sort = ++index
              })
            }else {
              this.$notify.error({ title: '错误',message: '请选择图片'})
              return;
            }
            break;
          // 获取视频信息
          case '2':
            let infoVideo = this.formData.videoInfoParams.info
            if(!infoVideo.mediaUrl){
              this.$notify.error({ title: '错误',message: '请选择视频'})
              return;
            }
            this.formData.mediaUrl = infoVideo.mediaUrl
            if(infoVideo.fileId){
              this.formData.fileId = infoVideo.fileId
              this.formData.libraryId = ''
              // 如果本地后端存一次
              this.request(this.api.contentCore.video_save, [infoVideo]).then(data => {

              }).catch(err => {
              });
            }else {
              this.formData.libraryId = infoVideo.libraryId
            }
            break;
          case '1':
            let info = this.formData.videoInfoParams.info
            if(!info.mediaUrl){
              this.$notify.error({ title: '错误',message: '请选择视频'})
              return;
            }
            this.formData.mediaUrl = info.mediaUrl
            if(info.fileId){
              this.formData.fileId = info.fileId
              this.formData.libraryId = ''
              // 如果本地后端存一次
              this.request(this.api.contentCore.video_save, [info]).then(data => {

              }).catch(err => {

              });
            }else {
              this.formData.libraryId = info.libraryId
            }
            break;
        }
        // 公共的处理参数
        // 是否存草稿
        if(!state){
          this.formData.contentStatus = '0'
        }else{
          this.formData.contentStatus = 1
        }
        // 分类转格式
        const categoryAry = this.formData.contentCategory[this.formData.contentCategory.length-1].split('&')
        this.formData.contentCategoryId = categoryAry[0]
        this.formData.cIdentifier = categoryAry[1]
        this.formData.showIdentifier = this.formData.contentCategory.join('$')
        // 地域格式转换
        this.formData.region = this.formData.regions.join('$')
        // 关联商品转换
        if(this.formData.relationInfoList && this.formData.relationInfoList.length){
          this.formData.relationInfo = JSON.stringify(this.formData.relationInfoList)
        }
        // 请求
        let url = this.api.contentCore.content_save
        if(this.formData.id){
          url = this.api.contentCore.content_edit
        }
        this.request(url, this.formData).then(data => {
          if(this.editId){
            this.$notify.success({ title: '成功',message: '修改成功'})
          }else{
            if(this.timeDialog){
              this.$notify.success({ title: '成功',message: '发布成功'})
              this.timeDialog = false
            }else if(this.formData.contentStatus === '0'){
              this.$notify.success({ title: '成功',message: '草稿保存成功'})
            }else{
              this.$notify.success({ title: '成功',message: '发布成功'})
            }
          }
          this.init()
          this.$router.push({
            path:'/content/manage/content_manage'
          });
        });
      },
      // 获取详情
      getDetails(){
        this.request(this.api.contentCore.content_get, {id: this.editId}).then(data => {
          let activeItem = this.tabs.find(item => {
            return data.contentType == item.type
          })
          this.activeName = activeItem.name
          let contentCategory,regions,relationInfoList
          // 初始分类
          if(data.showIdentifier.indexOf('$') > -1){
            contentCategory = data.showIdentifier.split('$')
          }else {
            contentCategory = [data.showIdentifier]
          }
          // 初始区域
          if(data.region.indexOf('$') > -1){
            regions = data.region.split('$')
          }else if(regions){
            regions = [data.region]
          }else {
            regions = []
          }
          // 初始关联列表
          if(data.relationInfo.length){
            relationInfoList = JSON.parse(data.relationInfo)
          }else {
            relationInfoList = []
          }
          this.formData = {
            id: this.editId,
            contentType: data.contentType.toString(),     // 4 文章发布  3 图集发布   2 小视频发布  1 视频发布
            // 标题
            title: data.title,
            //副标题
            smallTitle: data.smallTitle,
            // 封面
            coverList: data.coverList,
            // 分类
            contentCategory: contentCategory,
            // 标签
            tagList: data.tagList,
            // 地域
            region: '',
            regions: regions,
            relationInfoList:relationInfoList,
            relationInfo: '',
            // 是否草稿
            contentStatus: '',
            // 是否定时
            isTime: 0,
            // 定时时间
            pubDate: '',
            // 文章
            // 富文本信息
            article: {
              content: ''
            },
            // 图集
            atlasList: [],
            // 视频
            // 是否素材
            libraryId: data.libraryId,
            videoInfoParams: {},
            mediaUrl: '',
            fileId: ''
          }
          // 标签表结构修改 新加字段判断 新字段 tagList(Array)    旧字段  tags(String)
          /*if(data.tagList && data.tagList.length){
            this.formData.tagList = data.tagList
          }else{
            if(data.tags){
              if(data.tags.indexOf('$') > -1){
                this.formData.tagList = data.tags.split('$').map(item => {
                  return {
                    name: item
                  }
                })
              }else{
                this.formData.tagList = [{
                  name: data.tags
                }]
              }
            }else {
              this.formData.tagList = []
            }
          }*/
          switch(data.contentType) {
            // 发布文章
            case 4:
              let html = data.articleDomain.content
              setTimeout(()=>{
                this.$refs.myArticle.$refs.editor.setEditorHtml(html)
              },0)
              this.formData.article.sourceId = data.articleDomain.sourceId
              this.formData.article.id = data.articleDomain.id
              break;
            // 发布图集
            case 3:
              this.formData.atlasList = data.atlasList
              break;
            // 获取视频信息
            case 2:
              this.formData.videoInfoParams.info = {
                mediaUrl: data.mediaUrl,
                libraryId: data.libraryId
              }
              break;
            case 1:
              this.formData.videoInfoParams.info = {
                mediaUrl: data.mediaUrl,
                libraryId: data.libraryId
              }
              break;
          }
        })
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {
      '$route':{
        handler: function (val, oldVal) {
          if(val.path === oldVal.path){
            this.init()
            this.editId = null
            this.activeName = 'myArticle'
            this.formData.contentType = '4'
          }
        },
        deep: true
      }
    }
  }
</script>
