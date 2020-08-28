<!--
 * @Description: 商品中心上传视频
 * @Author: elephant
 * @Date: 2019-08-20 14:03:36
 * @LastEditTime: 2019-08-20 17:32:44
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="upload-video">
    <form ref="upLoadForm">
      <input
        type="file"
        style="display: none;"
        accept="video/mp4"
        ref="videoInput"
        @change="setVideoInfo()"
      />
    </form>
    <div v-if="isVideo" class="video-wrap">
      <img v-if="isImg" :src="imgUrl" />
      <video v-else :src="videoUrl"></video>
      <div class="abs-cont">
        <i v-if="!isEdit" @click.stop="iconRemove()" class="remove el-icon-delete"></i>
        <i @click.stop="iconPlay()" class="play el-icon-video-play"></i>
      </div>
    </div>
    <div v-else class="btn-wrap" @click.stop="addVideo" v-loading="loading">
      <i class="el-icon-plus"></i>
    </div>
    <!-- 视频组件 -->
    <video-play-view ref="videoRef"></video-play-view>
  </div>
</template>
<script>
import TcVod from "vod-js-sdk-v6/lib/tc_vod";
import VideoPlayView from "./videoPlay.vue";
export default {
  name: "upload-video",
  // 数据
  data() {
    return {
      isVideo: false,
      isImg: false,
      // 上传实例
      tcVod: "",
      videoInfoOld: null,
      videoInfo: null,
      // 最终后台参数
      videoParams: null,
      // 页面回显路径
      videoUrl: "",
      //图片回显路径
      imgUrl: "",
      // 签名
      signature: null,
      loading: false,
      isEdit: false
    };
  },
  created() {
    this.init();
  },
  // 初始化数据
  mounted() {
    this.$nextTick(() => {});
  },
  // 方法
  methods: {
    // 初始化
    init() {
      this.isEdit = false;
      this.videoInfoOld = null;
      this.videoInfo = null;
      this.videoParams = {};
      this.videoUrl = "";
      this.tcVod = new TcVod({
        getSignature: this.getSignature
      });
    },
    //修改返回初始化
    propInit(params) {
      this.videoUrl = params.url;
      //图片回显路径
      this.imgUrl = params.cover;
      this.isVideo = true;
      this.isImg = true;
      this.isEdit = true;
    },
    // 获取签名
    getSignature() {
      if (this.signature) {
        return this.signature;
      } else {
        this.request(this.api.contentCore.picture_get, {}).then(data => {
          this.signature = data.signature;
          return data.signature;
        });
      }
    },
    // 添加视频
    addVideo() {
      if (this.loading) return;
      this.$refs.videoInput.click();
    },
    // 判断上传文件是否是视频
    checkVideoType(type) {
      if (!type) {
        this.$message.error("视频类型必须是,mp4中的一种");
        this.loading = false;
        return false;
      }
      const str = type.split("/")[1].toLowerCase();
      if (!str.match(/mp4/)) {
        this.loading = false;
        this.$message.error("视频类型必须是,mp4中的一种");
        return false;
      } else {
        return true;
      }
    },
    // 上传的视频信息
    setVideoInfo() {
      let _file = this.$refs.videoInput.files[0];
      const isLtM = _file.size / 1024 / 1024 < 20;
      if (!isLtM) {
        this.$message.error("上传视频大小不能超过" + 20 + "MB!");
        return false;
      }
      this.loading = true;
      this.videoInfo = _file;
      // 解决 chrome input 上传取消bug
      if (!this.videoInfo) {
        this.videoInfo = this.videoInfoOld.get("imgInfo");
      } else {
        this.videoInfoOld = new FormData();
        this.videoInfoOld.set("imgInfo", this.videoInfo);
      }
      const flag = this.checkVideoType(this.videoInfo.type);
      if (flag) {
        this.addUpload();
      }
    },
    // 上传过程
    addUpload() {
      let self = this;
      let uploader = this.tcVod.upload({
        mediaFile: this.videoInfo
      });
      // 视频上传进度
      uploader.on("media_progress", function(info) {});
      // 视频上传完成时
      uploader.on("media_upload", function(info) {});
      // 完成回调
      uploader
        .done()
        .then(function(doneResult) {
          self.videoSave(doneResult);
        })
        .catch(function(err) {
          this.loading = false;
        });
    },
    // 保存视频
    videoSave(params) {
      setTimeout(() => {
        this.loading = false;
        this.videoParams = {
          fileId: params.fileId,
          url: params.video.url
        };
        this.videoUrl = params.video.url;
        this.isVideo = true;
        this.isImg = false;
        this.$emit("setVideoParams", this.videoParams);
      }, 500);
    },
    //删除当前视频
    iconRemove() {
      if (!this.isEdit) {
        this.request(this.api.product.video_deleteMedia, {
          fileId: this.videoParams.fileId
        }).then(res => {
          console.log(res);
          this.$message.success("删除视频成功");
          this.videoParams = {
            fileId: "",
            url: ""
          };
          this.videoUrl = "";
          this.isVideo = false;
          this.isImg = true;
        });
      } else {
        this.videoParams = {
          fileId: "",
          url: ""
        };
        this.videoUrl = "";
        this.isVideo = false;
        this.isImg = true;
      }
    },
    //播放当前视频
    iconPlay() {
      this.$refs.videoRef.videoInit(this.videoUrl);
    },
    getUploadVideoInfo() {
      return this.videoParams;
    }
  },
  components: {
    VideoPlayView
  }
};
</script>
 <style lang="less" scoped>
.upload-video {
  width: 120px;
  height: 150px;
  .btn-wrap {
    width: 120px;
    height: 150px;
    line-height: 150px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    i {
      font-size: 28px;
      color: #8c939d;
    }
  }
  .video-wrap {
    position: relative;
    width: 120px;
    height: 150px;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    text-align: center;

    cursor: pointer;
    img,
    video {
      width: 120px;
      height: 150px;
    }
    .abs-cont {
      width: 120px;
      height: 150px;
      position: absolute;
      left: 0;
      top: -1px;
      font-size: 12px;
      color: #ffffff;
      padding: 4px 2px 4px 4px;
      border-radius: 6px;
      background-color: #000000;
      opacity: 0.5;
      display: none;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      .remove {
        position: absolute;
        right: 10px;
        bottom: 10px;
        cursor: pointer;
        font-size: 18px;
      }
      .play {
        position: absolute;
        left: 35%;
        top: 35%;
        cursor: pointer;
        font-size: 40px;
      }
    }
  }
  .video-wrap:hover .abs-cont {
    display: block;
  }
}
.btn-wrap /deep/ .el-loading-spinner {
  top: 0;
  margin: 0;
}
</style>
