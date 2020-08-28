<style lang="less" scoped>
  .editor{
    .editor-info{position: relative;
      span{font-size: 20px;z-index: 101;cursor: pointer;position: absolute;top: 7px;color: #999;}
      span:hover{color: #666;}
      .el-icon-picture{left: 487px;}
      .el-icon-video-camera-solid{left: 517px;}
    }
    .upload-list{height: 230px;
      .auto-list{height: 200px;overflow: auto;}
    }
  }
</style>
<template>
  <div class="editor">
    <div class="editor-info">
      <div id="editor"></div>
      <span class="icon el-icon-picture" @click="uploadImg"></span>
      <span class="icon el-icon-video-camera-solid" @click="uploadVideo"></span>
    </div>
    <!--上传图片-->
    <el-dialog title="选择图片" :visible.sync="uploadDialog" width="45%" :close-on-click-modal="false">
      <div class="upload-list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="本地上传" name="local">
            <div class="auto-list">
              <check-list :img-list="localImgList" ref="localCheckListDom" v-if="uploadDialog" :is-default-check="true">
                <upload-img :is-radio="false" :img-list="localImgList" content-txt="上传图片"></upload-img>
              </check-list>
            </div>
          </el-tab-pane>
          <el-tab-pane label="素材库" name="material">
            <div class="auto-list">
              <check-list :img-list="materialImgList" v-if="uploadDialog" ref="materialCheckListDom"></check-list>
              <el-button type="primary" @click="getMaterialImgData(true)" size="small">加载更多</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialog = false" size="small">取 消</el-button>
          <el-button type="primary" @click="uploadDialogSub" size="small">确 定</el-button>
        </span>
    </el-dialog>
    <!--上传视频-->
    <el-dialog title="选择视频" :visible.sync="uploadVideoDialog" width="45%" :close-on-click-modal="false">
      <div class="upload-list">
        <el-tabs v-model="activeVideoName" @tab-click="handleVideoClick">
          <el-tab-pane label="本地上传" name="localVideo">
            <div class="auto-list">
              <video-check-list :video-list="localVideoList" v-if="uploadVideoDialog" ref="localVideoCheckListDom">
                <upload-video ref="uploadVideo" v-if="uploadVideoDialog" :is-radio="false" :video-list="localVideoList"></upload-video>
              </video-check-list>
            </div>
          </el-tab-pane>
          <el-tab-pane label="素材库" name="materialVideo">
            <div class="auto-list">
              <video-check-list :video-list="materialVideoList" v-if="uploadVideoDialog" ref="materialVideoCheckListDom">
              </video-check-list>
              <el-button type="primary" @click="getMaterialVideoData(true)" size="small">加载更多</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="uploadVideoDialog = false" size="small">取 消</el-button>
          <el-button type="primary" @click="uploadVideoDialogSub" size="small">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import UploadImg from '@/components/editor/UploadImg'
  import UploadVideo from '@/components/editor/UploadVideo'
  import CheckList from '@/components/editor/CheckList'
  import VideoCheckList from '@/components/editor/VideoCheckList'

  import WangEditor  from 'wangeditor'
  export default {
    name: 'editor',
    props: {

    },
    // 数据
    data() {
      return {
        // 富文本
        editor:null,
        // 图片
        // 上传弹窗
        uploadDialog: false,
        //默认本地
        activeName: 'local',
        // 本地上传列表
        localImgList:[],
        // 本地上传列表 选中的
        localCheckList: [],
        // 素材列表
        materialImgFrom:{
          pageIndex: 1,
          pageSize: 12,
          type: 2  // 1 -- 视频  2 -- 图片
        },
        materialImgList:[],
        // 素材列表 选中的
        materialCheckList:[],

        // 视频
        // 上传弹窗
        uploadVideoDialog: false,
        //默认本地
        activeVideoName: 'localVideo',
        // 本地上传列表
        localVideoList:[],
        // 本地上传列表 选中的
        localVideoCheckList: [],
        // 素材列表
        materialVideoFrom:{
          pageIndex: 1,
          pageSize: 12,
          type: 1  // 1 -- 视频  2 -- 图片
        },
        materialVideoList:[],
        // 素材列表 选中的
        materialVideoCheckList:[],


      }
    },
    // 组件
    components: {
      UploadImg,
      UploadVideo,
      CheckList,
      VideoCheckList
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        this.createEditor()
      })
    },
    // 方法
    methods: {
      // 富文本
      // 光标插入
      insertEditor(str){
        this.editor.cmd.do('insertHtml', str)
      },
      // 创建编辑器
      createEditor(){
        this.editor = new WangEditor(document.getElementById('editor'))
        // 初始化编辑器配置，在create之前
        this.initEditorConfig()
        // 生成编辑器
        this.editor.create()
      },
      // 初始化编辑器配置
      initEditorConfig() {
        // 自定义菜单配置
        this.editor.customConfig.zIndex = 100
        this.editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          // 'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          // 'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'table',  // 表格
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ]
        // 关闭粘贴样式的过滤
        this.editor.customConfig.pasteFilterStyle = false
        // 忽略粘贴内容中的图片
        this.editor.customConfig.pasteIgnoreImg = true
        // 自定义处理粘贴的文本内容
        this.editor.customConfig.pasteTextHandle = function (content) {
          // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
          if (content == '' && !content) return ''
          let str = content
          str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '')
          str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
          str = str.replace(/<\/?[^>]*>/g, '')
          str = str.replace(/[ | ]*\n/g, '\n')
          str = str.replace(/&nbsp;/ig, '')
          return str
        }
      },
      // 获取数据
      getEditorHtml(){
        return this.editor.txt.html()
      },
      // 设置数据
      getEditorText(){
        return this.editor.txt.text()
      },
      // 初始数据
      setEditorHtml(str){
        this.editor.txt.html(str)
      },

      // 上传图片
      uploadImg(){
        // 初始数据
        this.materialImgFrom.pageIndex = 1
        this.activeName = 'local'
        this.localImgList = []
        this.localCheckList = []
        this.materialImgList = []
        this.materialCheckList = []
        this.uploadDialog = true
      },
      // 图片转dom
      checkImgInit(ary){
        let str =  ``
        if(ary && ary.length){
          ary.forEach((item)=> {
            str += `<img src="${item}" alt="" style="width: 400px;"><br/>`
          })
        }
        return str
      },
      //图片 素材 本地 切换
      handleClick(node){
        if(node.name === 'material'){
          this.getMaterialImgData()
        }
      },
      // 获取素材库图片
      getMaterialImgData(flag){
        if(flag){
          this.materialImgFrom.pageIndex++
        }
        this.request(this.api.contentCore.library_list, this.materialImgFrom).then(data => {
          if(flag){
            this.materialImgList = this.materialImgList.concat(data.data)
          }else {
            this.materialImgList =  data.data
          }
        });
      },
      // 确认选中图片
      uploadDialogSub(){
        if(this.activeName === 'local'){
          const urlList = this.$refs.localCheckListDom.getCheckList()
          this.localCheckList = urlList
          const dom = this.checkImgInit(urlList)
          this.insertEditor(dom)
          this.uploadDialog = false
        }
        if(this.activeName === 'material'){
          const urlList = this.$refs.materialCheckListDom.getCheckList()
          this.materialCheckList = urlList
          const dom = this.checkImgInit(urlList)
          this.insertEditor(dom)
          this.uploadDialog = false
        }
      },

      // 上传视频
      uploadVideo(){
        // 初始数据
        this.materialVideoFrom.pageIndex = 1
        this.localVideoList = []
        this.localVideoCheckList = []
        this.materialVideoList = []
        this.materialVideoCheckList = []
        this.activeVideoName = 'localVideo'
        this.uploadVideoDialog = true
      },
      //视频 素材 本地 切换
      handleVideoClick(node){
        if(node.name === 'materialVideo'){
          this.getMaterialVideoData()
        }
      },
      // 获取素材库视频
      getMaterialVideoData(flag){
        if(flag){
          this.materialVideoFrom.pageIndex++
        }
        this.request(this.api.contentCore.library_list, this.materialVideoFrom).then(data => {
          if(flag){
            this.materialVideoList = this.materialVideoList.concat(data.data)
          }else {
            this.materialVideoList =  data.data
          }
        });
      },
      // 确认选中视频
      uploadVideoDialogSub(){
        if(this.activeVideoName === 'localVideo'){
          const urlList = this.$refs.localVideoCheckListDom.getCheckList()
          this.localVideoCheckList = urlList
          const dom = this.checkVideoInit(urlList)
          this.insertEditor(dom)
          this.uploadVideoDialog = false
        }
        if(this.activeVideoName === 'materialVideo'){
          const urlList = this.$refs.materialVideoCheckListDom.getCheckList()
          this.materialVideoCheckList = urlList
          const dom = this.checkVideoInit(urlList)
          this.insertEditor(dom)
          this.uploadVideoDialog = false
        }
      },
      // 视频转dom
      checkVideoInit(ary){
        if (!ary.length) return
        let str =  ``
        if(ary && ary.length){
          ary.forEach((item)=> {
            str += `<video controls="controls" src="${item.url}" width="400px"></video><br/>`
          })
        }
        return str
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
