<!--
 * @Description: 商品详情 =>商品描述
 * @Author: elephant
 * @Date: 2019-08-12 17:11:01
 * @LastEditTime: 2019-08-23 20:43:26
 * @LastEditors: 
 -->
<template>
  <div>
    <!-- 商品主图 -->
    <div class="desc-wrap">
      <h5>商品主图：</h5>
      <dl class="full-video-wrap">
        <dt class="paroduct-img-wrap">
          <draggable
            class="paroduct-img-group"
            tag="ul"
            v-model="masterImgList"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            @change="masterImgChange"
          >
            <transition-group type="transition">
              <li
                class="img-group-item main-img-wh"
                v-for="element in masterImgList"
                :key="element.url"
              >
                <el-image class="view-img" :src="element.url" fit="contain"></el-image>
                <div class="hide-box">
                  <i @click="handlePictureCardPreview(element.url)" class="show el-icon-zoom-in"></i>
                  <i v-if="!isShow" @click="masterImgRemove(element)" class="delete el-icon-delete"></i>
                </div>
              </li>
            </transition-group>
          </draggable>
          <dialog-up-img
            v-if="!isShow"
            class="main-up-wrap"
            @setParentMasterImg="heandleMasterImg"
            :upIsShow="masterImgStatus"
            imgType="MASTER_IMAGE"
            ref="dialogUpImgRef"
          ></dialog-up-img>
        </dt>
        <dd v-show="!isShow" class="mt-10">最多上传5张主图，比列为3:4，每张大小不超过5M；拖动图片可移动图片位置</dd>
      </dl>
    </div>
    <!-- 商品主图END -->
    <!-- 主图视频 -->
    <div class="desc-wrap mt-10">
      <h5>主图视频：</h5>
      <dl>
        <dt class="upload-video">
          <div v-if="Object.keys(mainVideoForm).length !== 0" class="video-wrap main-video-wh">
            <el-image class="view-img" :src="mainVideoForm.cover" fit="contain"></el-image>
            <div class="abs-cont">
              <i
                v-if="!isShow"
                @click.stop="mainVideoRemove(mainVideoForm)"
                class="remove el-icon-delete"
              ></i>
              <i @click.stop="videoPlay(mainVideoForm.url)" class="play el-icon-video-play"></i>
            </div>
          </div>
          <nav v-show="!isShow" v-else @click="addMainPictureVideo" class="btn-wrap main-img-wh">
            <i class="el-icon-plus"></i>
          </nav>
        </dt>
        <dd v-show="!isShow" class="mt-10">只能上传单个视频，建议比例为3：4，大小不超过20M</dd>
      </dl>
    </div>
    <!-- 主图视频END -->
    <!-- 全屏视频 -->
    <div class="desc-wrap mt-10">
      <h5>全屏视频：</h5>
      <dl class="full-video-wrap">
        <dt class="upload-video">
          <div v-if="fullScreenVideoList.length > 0" class="full-video">
            <div
              class="video-wrap full-video-wh mr-20"
              v-for="(item,index) in fullScreenVideoList"
              :key="index"
            >
              <el-image class="view-img" :src="item.cover" fit="contain"></el-image>
              <div class="abs-cont">
                <i
                  v-if="!isShow"
                  @click.stop="fullScreenRemove(item)"
                  class="remove el-icon-delete"
                ></i>
                <i @click.stop="videoPlay(item.url)" class="play el-icon-video-play"></i>
              </div>
            </div>
          </div>
          <nav
            v-if="fullScreenVideoList.length < 5"
            v-show="!isShow"
            @click="addFullScreenVideo"
            class="btn-wrap detail-video-wh"
          >
            <i class="el-icon-plus"></i>
          </nav>
        </dt>
        <dd v-show="!isShow" class="mt-10">可以上传5个视频，建议比例为9：16，每个大小不超过20M</dd>
      </dl>
    </div>
    <!-- 全屏视频END -->
    <!-- 商品详情 -->
    <div class="desc-wrap">
      <h5>商品详情：</h5>
      <dl class="full-video-wrap">
        <dt class="paroduct-img-wrap">
          <draggable
            class="paroduct-img-group"
            tag="ul"
            v-model="detailImgList"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            @change="detailImgChange"
          >
            <transition-group type="transition">
              <li
                class="img-group-item detail-img-wh"
                v-for="element in detailImgList"
                :key="element.url"
              >
                <el-image class="view-img" :src="element.url" fit="contain"></el-image>
                <div class="hide-box">
                  <i @click="handlePictureCardPreview(element.url)" class="show el-icon-zoom-in"></i>
                  <i v-if="!isShow" @click="detailImgRemove(element)" class="delete el-icon-delete"></i>
                </div>
              </li>
            </transition-group>
          </draggable>
          <dialog-up-img
            v-if="!isShow"
            class="details-up-wrap"
            @setParentDetailImg="heandledetailImg"
            :upIsShow="detailImgStatus"
            imgType="DETAIL_IMAGE"
            ref="dialogUpImgRef"
          ></dialog-up-img>
        </dt>
        <dd v-show="!isShow" class="mt-10">单张大小不超过5M，最多不超过15张，拖动可更改排序，点击可查看完整图片</dd>
      </dl>
    </div>
    <!-- 商品详情END -->
    <!-- 视频组件 -->
    <video-play-view ref="videoRef"></video-play-view>
    <!-- 视频列表组件 -->
    <dialog-video
      @parentMainHandle="mainHandle"
      @parentFullScreenHandle="fullScreenHandle"
      @parentVideoPlay="videoPlay"
      ref="dialogVideoRef"
    ></dialog-video>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogImgVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
//引入拖动模块功能
import draggable from "vuedraggable";
//引入图片组件
import DialogUpImg from "./dialog_video_upImg.vue";
//视频播放组件
import VideoPlayView from "./videoPlay.vue";
//视频库组件
import DialogVideo from "./dialog_video_list.vue";
let productImages = []; //产品图片列表
let removeProductImagesList = []; //删除的产品图片列表
let productVideos = []; //产品视频列表
let removeProductVideoList = []; //删除的产品视频列表
export default {
  name: "commondityDescription",
  display: "Transitions",
  order: 7,
  data() {
    return {
      //主图视频
      isMainVideo: false,
      //主图视频数据
      mainVideoForm: {},
      //全屏视频
      isFullScreenVideo: false,
      //全屏视频列表
      fullScreenVideoList: [],
      //父组件传来的全部数据
      parentForm: {},
      //图片拖动组件
      drag: false,
      masterImgList: [], //主图列表
      masterImgStatus: true,
      //详情图片
      detailImgList: [],
      detailImgStatus: true,
      dialogImgVisible: false,
      dialogImageUrl: "",
      isShow: false
    };
    // 主图：MASTER_IMAGE
    // 详情：DETAIL_IMAGE
    // 主视频：MASTER_VIDEO
    // 全屏视频：FULL_SCREEN_VIDEO
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      productImages = [];
      removeProductImagesList = [];
      productVideos = []; //产品视频列表
      removeProductVideoList = []; //删除的产品视频列表
      this.isShow = false;
    },
    /**
     * @description:  从父级获取数据 如果走了此方法说明是回显
     * @param {obj} 整个数据
     * @return:
     */
    videoImgPropInit(params, isShow = false) {
      this.init();
      this.isShow = isShow;
      let parentForm = params;
      //放入数据
      productImages = parentForm.productImages || []; //产品图片列表
      productVideos = parentForm.productVideos || []; //产品视频列表
      //找出主图
      let masterImg = productImages.filter(item => item.type == "MASTER_IMAGE");
      this.masterImgList = masterImg.sort((a, b) => a.sort - b.sort);
      //找出详情图
      let detailImg = productImages.filter(item => item.type == "DETAIL_IMAGE");
      this.detailImgList = detailImg.sort((a, b) => a.sort - b.sort);
      //找出主图视频
      this.mainVideoForm =
        productVideos.find(item => item.type == "MASTER_VIDEO") || {};
      this.isMainVideo = true;
      //找出全屏视频
      let fullScreenVideo = productVideos.filter(
        item => item.type == "FULL_SCREEN_VIDEO"
      );
      this.fullScreenVideoList = fullScreenVideo.sort(
        (a, b) => a.sort - b.sort
      );
    },
    //主图视频
    addMainPictureVideo() {
      this.$refs.dialogVideoRef.propInit("main");
    },
    //全屏视频
    addFullScreenVideo() {
      let fullScreenVideoList = this.$common.deepCopy(this.fullScreenVideoList);
      this.$refs.dialogVideoRef.propInit("fullScreen", fullScreenVideoList);
      fullScreenVideoList = null;
    },
    //主图调用返回数据
    mainHandle(params) {
      this.isMainVideo = true;
      let _params = this.$common.deepCopy(params);
      this.mainVideoForm = {
        cover: _params.cover,
        videoName: _params.name,
        url: _params.url,
        videoId: _params.id,
        type: "MASTER_VIDEO"
      };
      //数据
      productVideos.push(this.mainVideoForm);
      this.heandleSetParentVideoData();
      _params = null;
    },

    //全屏视频返回的数据
    fullScreenHandle(params) {
      this.isFullScreenVideo = true;
      let _params = this.$common.deepCopy(params);
      let obj = {
        cover: _params.cover,
        videoName: _params.name,
        url: _params.url,
        videoId: _params.id,
        type: "FULL_SCREEN_VIDEO",
        sort: ""
      };
      this.fullScreenVideoList.push(obj);
      for (let i = 0; i < this.fullScreenVideoList.length; i++) {
        this.fullScreenVideoList[i].sort = i + 1;
      }
      //数据
      productVideos.push(obj);
      this.heandleSetParentVideoData();
      _params = null;
    },
    //主图视频删除
    mainVideoRemove(item) {
      //有的话说明是后台返回的单独处理 //只有一个视频
      if (!!item.id) {
        item.status = 9;
        removeProductVideoList.push(item);
        let index = productVideos.findIndex(
          elem => elem.videoId == item.videoId
        );
        productVideos.splice(index, 1);
        this.mainVideoForm = {};
        this.isMainVideo = false;
        this.heandleSetParentVideoData();
      } else {
        //没有ID说明是新增的 删除就行
        let productIndex = productVideos.findIndex(
          elem => elem.videoId == item.videoId
        );
        productVideos.splice(productIndex, 1);
        this.mainVideoForm = {};
        this.isMainVideo = false;
        this.heandleSetParentVideoData();
      }
    },
    //全屏视频删除
    fullScreenRemove(item) {
      //有的话说明是后台返回的单独处理
      if (!!item.id) {
        item.status = 9;
        removeProductVideoList.push(item);
        let index = productVideos.findIndex(
          elem => elem.videoId == item.videoId
        );
        productVideos.splice(index, 1);
        let _index = this.fullScreenVideoList.findIndex(
          elem => elem.videoId == item.videoId
        );
        this.fullScreenVideoList.splice(_index, 1);
        this.heandleSetParentVideoData();
      } else {
        //没有ID说明是新增的 删除就行
        let productIndex = productVideos.findIndex(
          elem => elem.videoId == item.videoId
        );
        productVideos.splice(productIndex, 1);
        let index = this.fullScreenVideoList.findIndex(
          elem => elem.videoId == item.videoId
        );
        this.fullScreenVideoList.splice(index, 1);
        this.heandleSetParentVideoData();
      }
    },
    //处理视频给父组件传参
    heandleSetParentVideoData() {
      let list = this.$common.deepCopy(productVideos);
      let deleteList = this.$common.deepCopy(removeProductVideoList);
      let arr = [...list, ...deleteList];
      this.$emit("setParentVideoList", arr);
      (list = null), (deleteList = null), (arr = null);
    },
    //视频播放
    videoPlay(_url) {
      this.$refs.videoRef.videoInit(_url);
    },
    //下面是图片处理
    //处理从图片传回来的图片
    heandleMasterImg(params) {
      let obj = {
        url: params.imageUrl,
        imageId: params.id,
        imageName: params.name,
        type: "MASTER_IMAGE",
        sort: ""
      };
      this.masterImgList.push(obj);
      for (let i = 0; i < this.masterImgList.length; i++) {
        this.masterImgList[i].sort = i + 1;
      }
      //数据
      productImages.push(obj);
      this.heandleSetParentImgData();
    },
    //处理商品详情 返回的图片
    heandledetailImg(params) {
      let obj = {
        url: params.imageUrl,
        imageId: params.id,
        imageName: params.name,
        type: "DETAIL_IMAGE",
        sort: ""
      };
      this.detailImgList.push(obj);
      for (let i = 0; i < this.detailImgList.length; i++) {
        this.detailImgList[i].sort = i + 1;
      }
      //数据
      productImages.push(obj);
      this.heandleSetParentImgData();
    },

    sort(list) {
      list = list.sort((a, b) => a.sort - b.sort);
    },
    //主图删除了
    masterImgRemove(item) {
      //有的话说明是后台返回的单独处理
      if (!!item.id) {
        item.status = 9;
        removeProductImagesList.push(item);
        let index = this.masterImgList.findIndex(
          elem => elem.imageId == item.imageId
        );
        this.masterImgList.splice(index, 1);
        this.heandleSetParentImgData();
      } else {
        //没有ID说明是新增的 删除就行
        let productIndex = productImages.findIndex(
          elem => elem.imageId == item.imageId
        );
        productImages.splice(productIndex, 1);
        let index = this.masterImgList.findIndex(
          elem => elem.imageId == item.imageId
        );
        this.masterImgList.splice(index, 1);
        this.heandleSetParentImgData();
         this.request(this.api.content.basePicture_deleteOssImage, {imageUrl:item.url});
      }
    },
    //详情图删除了
    detailImgRemove(item) {
      //有的话说明是后台返回的单独处理
      if (!!item.id) {
        item.status = 9;
        removeProductImagesList.push(item);
        let index = this.detailImgList.findIndex(
          elem => elem.imageId == item.imageId
        );
        this.detailImgList.splice(index, 1);
        this.heandleSetParentImgData();
      } else {
        //没有ID说明是新增的 删除就行
        let productIndex = productImages.findIndex(
          elem => elem.imageId == item.imageId
        );
        productImages.splice(productIndex, 1);
        let index = this.detailImgList.findIndex(
          elem => elem.imageId == item.imageId
        );
        this.detailImgList.splice(index, 1);
        this.heandleSetParentImgData();
        this.request(this.api.content.basePicture_deleteOssImage, {imageUrl:item.url});
      }
    },
    //主图被移动了
    masterImgChange() {
      for (let i = 0; i < this.masterImgList.length; i++) {
        this.masterImgList[i].sort = i + 1;
      }
      this.heandleSetParentImgData();
    },
    //详情发生移动了
    detailImgChange() {
      for (let i = 0; i < this.detailImgList.length; i++) {
        this.detailImgList[i].sort = i + 1;
      }
      this.heandleSetParentImgData();
    },
    //处理图片给父组件传参
    heandleSetParentImgData() {
      let list = this.$common.deepCopy(productImages);
      let deleteList = this.$common.deepCopy(removeProductImagesList);
      let arr = [...list, ...deleteList];
      this.$emit("setParentImgList", arr);
      (list = null), (deleteList = null), (arr = null);
    },

    handlePictureCardPreview(url) {
      //预览图片时调用
      this.dialogImageUrl = url;
      this.dialogImgVisible = true;
    }
  },
  watch: {
    masterImgList() {
      if (this.masterImgList.length >= 5) {
        this.masterImgStatus = false;
      } else {
        this.masterImgStatus = true;
      }
    },
    detailImgList() {
      if (this.detailImgList.length >= 15) {
        this.detailImgStatus = false;
      } else {
        this.detailImgStatus = true;
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  components: {
    VideoPlayView,
    DialogVideo,
    DialogUpImg,
    draggable
  }
};
</script>
<style lang="less" scoped>
// 外部
.desc-wrap {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
  > h5 {
    font-size: 14px;
    font-weight: 100;
    width: 80px;
    flex: 0 0 auto;
    margin-top: 20px;
  }
  .full-video-wrap {
    flex-wrap: wrap ;
    min-width: 500px;
    flex: 1;
  }
}
.full-video {
  display: flex;
  justify-content: flex-start;
}

//图片
.paroduct-img-wrap {
  display: flex;
  flex-wrap: wrap ;
  justify-content: flex-start;
  width: 100%;
}
.paroduct-img-group {
  > span {
    display: flex;
    flex-wrap: wrap ;
    justify-content: flex-start;
  }
  .img-group-item {
    position: relative;

    border-radius: 3px;
    border: 1px solid #c0ccda;
    margin: 10px 10px 0 0;
    transition: all 0.5s ease-in-out;
  }

  .img-group-item:hover .hide-box {
    display: flex;
  }
  .hide-box {
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    display: none;
    justify-content: space-around;
    cursor: move;
    align-items: center;
    .show {
      font-size: 26px;
      color: #ffffff;
      cursor: pointer;
    }
    .delete {
      font-size: 26px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}

// 主图视频
.upload-video {
  display: flex;
  justify-content: flex-start;
  .btn-wrap {
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;

    i {
      font-size: 28px;
      color: #8c939d;
    }
  }
  .full-video-wh {
    width: 120px;
    height: 200px;
  }
  .main-video-wh {
    width: 120px;
    height: 150px;
  }
  .video-wrap {
    position: relative;

    border: 1px solid #c0ccda;
    border-radius: 6px;
    text-align: center;

    cursor: pointer;

    img,
    video {
      width: 100%;
      height: 100%;
    }
    .abs-cont {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: -1px;
      font-size: 12px;
      color: #ffffff;
      padding: 4px 2px 4px 4px;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.4);
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
.view-img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.main-up-wrap /deep/ .btn-wrap {
  height: 150px;
  line-height: 150px;
}
.details-up-wrap /deep/ .btn-wrap {
  width: 240px;
  height: 320px;
  line-height: 320px;
}
.main-img-wh {
  width: 120px;
  height: 150px;
  line-height: 150px;
}
.detail-video-wh {
  width: 120px;
  height: 200px;
  line-height: 200px;
}
.detail-img-wh {
  width: 240px;
  height: 320px;
  line-height: 320px;
}
</style>
