<style lang="less" scoped>
  .my-video{
    .upload-list{height: 230px;
      .auto-list{height: 200px;overflow: auto;}
    }
    .video-upload{height: 80px;width: 80px;border-radius: 5px;border: 1px dashed #d9d9d9;cursor: pointer;text-align: center;float: left;line-height: 80px;margin: 10px;
      img,video {width: 80px;height: 80px;cursor: pointer;}
    }
    .video-upload:hover{border: 1px dashed #409EFF;}
  }
</style>
<template>
  <div class="my-video">
    <release-public :form-data="formData" ref="releasePublic">
      <!--视频-->
      <div class="clearfix">
        <div class="video-upload" @click="videoRadioDialogShow">
          <span  v-if="!formData.videoInfoParams.info">选择视频</span>
          <video :src="formData.videoInfoParams.info.mediaUrl" v-if="formData.videoInfoParams.info && formData.videoInfoParams.info.mediaUrl && !formData.videoInfoParams.info.videoCoverUrl" title="点击重新选择"></video>
          <img :src="formData.videoInfoParams.info.videoCoverUrl" alt=""  v-if="formData.videoInfoParams.info && formData.videoInfoParams.info.videoCoverUrl" title="点击重新选择">
        </div>
      </div>
    </release-public>
    <el-dialog title="选择视频" :visible.sync="videoCheckDialog" width="45%" :close-on-click-modal="false">
      <div class="upload-list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="本地上传" name="local">
            <upload-video ref="uploadVideo" :call-back="uploadVideoCallBack" v-if="videoCheckDialog"></upload-video>
          </el-tab-pane>
          <el-tab-pane label="素材库" name="material">
            <div class="auto-list">
              <video-radio-list :radio-list="materialVideoList" :radio-check="materialRadioCheck"></video-radio-list>
              <el-button type="primary" @click="getMaterialVideoData(true)" size="small">加载更多</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer" v-if="activeName === 'material'">
        <el-button @click="videoCheckDialog = false" size="small">取 消</el-button>
          <el-button type="primary" @click="videoRadioDialogSub" size="small">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import ReleasePublic from '@/views/content/create/components/ReleasePublic'
  import VideoRadioList from '@/views/content/create/components/VideoRadioList'
  import UploadVideo from '@/components/editor/UploadVideo'
  export default {
    props:{
      formData:{
        type: Object
      }
    },
    // 数据
    data() {
      return {
        // 选择图片弹窗
        videoCheckDialog: false,
        // tabs 默认选中的
        activeName: 'local',
        // 素材列表
        materialRadioCheck: [],
        materialVideoList: [],
        materialVideoFrom: {
          pageIndex: 1,
          pageSize: 12,
          type: 1  // 1 -- 视频  2 -- 图片
        }
      }
    },
    // 组件
    components: {
      ReleasePublic,
      UploadVideo,
      VideoRadioList
    },
    created(){
      // 编辑
      if(this.formData.videoInfoParams.info){
        this.videoInfoParams = JSON.parse(JSON.stringify(this.formData.videoInfoParams))
      }
    },
    // 初始化数据
    mounted() {
      this.$nextTick(() => {

      })
    },
    // 方法
    methods: {
      // 初始化
      init(){
        // 初始化公共的
        this.$refs.releasePublic.init();
      },
      // 显示弹窗
      videoRadioDialogShow(){
        this.videoCheckDialog = true
        this.materialVideoFrom.pageIndex = 1
        this.activeName = 'local'
      },
      // 本地上传回调
      uploadVideoCallBack(info){
        this.formData.videoInfoParams.info = info
        this.videoCheckDialog = false
      },
      //图片 素材 本地 切换
      handleClick(node){
        if(node.name === 'material'){
          this.getMaterialVideoData(false)
        }
      },
      // 获取素材信息
      getMaterialVideoData(flag){
        if(flag){
          this.materialVideoFrom.pageIndex++
        }
        this.request(this.api.contentCore.library_list, this.materialVideoFrom).then(data => {
          if(data.count === 0){
            this.$message.error('已加载全部数据')
            return
          }
          if(flag){
            this.materialVideoList = this.materialVideoList.concat(data.data)
          }else {
            this.materialVideoList =  data.data
          }
        });
      },
      // 选中素材
      videoRadioDialogSub(){
        if(this.materialRadioCheck.length){
          this.formData.videoInfoParams.info = this.materialRadioCheck[0]
          this.videoCheckDialog = false
        }else{
          this.$message.error('请选择视频')
        }
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
