<style lang="less" scoped>
  .upload-video{;width: 80px;height: 80px;display: inline-block;overflow: hidden;
    .content{
          .content-item{height: 80px;width: 80px;border-radius: 5px;border: 1px dashed #d9d9d9;cursor: pointer;float: left;margin-right: 20px;
            img{width: 80px;height: 80px;}
            video{width: 80px;height: 80px;}
            span{display: block;line-height: 80px;color: #333;text-align: center;font-size: 14px;}
          }
      .content-item:hover{border: 1px dashed #409EFF;}
    }
  }
</style>
<template>
  <div class="upload-video">
    <form ref="upLoadForm">
      <input type="file" style="display: none;" ref="videoInput" @change="setVideoInfo()"/>
    </form>
    <div class="content clearfix">
      <div class="content-item"  @click.stop="addVideo" v-loading="loading">
        <video :src="videoUrl" v-show="videoUrl"></video>
        <span v-show="!videoUrl">上传视频</span>
      </div>
    </div>
  </div>
</template>
<script>
  import TcVod from 'vod-js-sdk-v6/lib/tc_vod'
  export default {
    name: 'upload-video',
    props:{
      // 是否单选
      isRadio: {
        type: Boolean,
        default: true
      },
      callBack: {
        type: Function
      },
      value: {
        default: ""
      },
      // 上传的视频list
      videoList: {
        type: Array
      },
      // 单个视频的信息
      videoInfoParams: {
        type: Object
      }
    },
    // 数据
    data() {
      return {
        // 上传实例
        tcVod: '',
        videoInfoOld: null,
        videoInfo: null,
        // 最终后台参数
        videoParams: null,
        // 页面回显路径
        videoUrl: '',
        // 签名
        signature: null,
        loading: false
      }
    },
    // 组件
    components: {

    },
    created(){
      this.init()
      // 编辑
      if(this.videoInfoParams && this.videoInfoParams.info){
        this.videoParams = this.videoInfoParams.info
        this.videoUrl = this.videoInfoParams.info.mediaUrl
      }
      this.videoUrl = this.value
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
        this.videoInfoOld = null
        this.videoInfo = null
        this.videoParams = {}
        this.videoUrl = ''
        this.tcVod = new TcVod({
          getSignature: this.getSignature
        })
      },
      // 获取签名
      getSignature(){
        if(this.signature){
          return this.signature
        }else {
          this.request(this.api.contentCore.picture_get, {}).then(data => {
            this.signature = data.signature
            return data.signature
          });
        }
      },
      // 添加视频
      addVideo() {
        if(this.loading) return
        this.$refs.videoInput.click()
      },
      // 判断上传文件是否是视频
      checkVideoType(type){
        if(!type){
          this.$message.error('视频类型必须是,mp4中的一种');
          this.loading = false
          return false
        }
        const str = type.split('/')[1].toLowerCase()
        if (!str.match(/mp4/)) {
          this.loading = false
          this.$message.error('视频类型必须是,mp4中的一种');
          return false;
        }else {
          return true
        }
      },
      // 上传的视频信息
      setVideoInfo() {
        this.loading = true
        this.videoInfo = this.$refs.videoInput.files[0];
        // 解决 chrome input 上传取消bug
        if(!this.videoInfo){
          this.videoInfo =  this.videoInfoOld.get("imgInfo")
        }else{
          this.videoInfoOld = new FormData()
          this.videoInfoOld.set("imgInfo", this.videoInfo);
        }
        const flag = this.checkVideoType(this.videoInfo.type)
        if(flag){
          this.addUpload()
        }
      },
      // 上传过程
      addUpload() {
        let self = this;
        let uploader = this.tcVod.upload({
          mediaFile: this.videoInfo
        })
        // 视频上传进度
        uploader.on('media_progress', function(info) {

        })
        // 视频上传完成时
        uploader.on('media_upload', function(info) {

        })
        // 完成回调
        uploader.done().then(function (doneResult) {
          self.videoSave(doneResult)

        }).then(function (videoUrl) {

        })
      },


      // 保存视频
      videoSave(params){
        setTimeout(()=>{
          this.loading = false
          this.videoParams = {
            fileId: params.fileId,
            mediaUrl: params.video.url
          }
          if(!this.isRadio){
            this.videoList.push({
              fileId: params.fileId,
              url: params.video.url
            })
            this.init()
            this.videoUrl = ''
            this.$refs.upLoadForm.reset()
          }else{
            this.videoUrl = this.videoParams.mediaUrl
            this.$emit('input', this.videoParams.mediaUrl )
            if(this.callBack){
              this.callBack(this.videoParams)
            }
            if(this.videoInfoParams){
              this.videoInfoParams.info = this.videoParams
            }
          }
        },5000)
      },
      getUploadVideoInfo(){
        return  this.videoParams
      }

    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {

    }
  }
</script>
