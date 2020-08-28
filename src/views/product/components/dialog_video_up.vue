<!--
 * @Description: 弹出视频列表组件 
 * @Author: elephant
 * @Date: 2019-08-22 14:12:17
 * @LastEditTime: 2019-08-22 18:51:08
 * @LastEditors: Please set LastEditors
 -->
<template>
  <!-- dialog  -->
  <el-dialog
    title="本地上传"
    :visible.sync="videoUpDialogVisible"
    class="alarmPopup"
    width="500px"
    :before-close="closeDialog"
    append-to-body
    id="dialog"
  >
    <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="100px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="name" label="视频名称：">
            <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联频道：">
            <el-select
              multiple
              v-model="setVideoChannelData"
              @change="setChannelGet"
              class="input-w"
              placeholder="可多选"
            >
              <el-option
                v-for="item in videoChannelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="url" label="视频内容：">
            <upload-video v-if="videoUpDialogVisible" @setVideoParams="getVideoParams" ref="videoRef"></upload-video>
           <p class="video-txt">只能上传单个视频，主图视频建议3：4，<br/>全屏视频建议为9：16，每个大小不超过20M。</p>
          </el-form-item>
        </el-col>
          <el-col :span="24">
          <el-form-item prop="cover" label="视频封面：">
            <div class="cover-wrap">
              <div v-if="!!this.filtersData.cover" class="cover-img">
                <el-image class="view-img" :src="filtersData.cover" fit="contain"></el-image>
                <div class="hide-box">
                  <i
                    @click="handlePictureCardPreview(filtersData.cover)"
                    class="show el-icon-zoom-in"
                  ></i>
                  <i
                    @click="imgRemove()"
                    class="delete el-icon-delete"
                  ></i>
                </div>
              </div>
              <dialog-up-img
                v-else
                class="up-wrap"
                @setParentImg="heandleImg"
                :upIsShow="imgStatus"
                imgType="other"
                ref="dialogUpImgRef"
              ></dialog-up-img>
            </div>
            <p class="video-txt">上传图片比例建议为3：4，否则前台展示效果不是最佳</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="item-right">
      <el-button size="small" @click="closeDialog()">取消</el-button>
      <el-button size="small" type="primary" @click="submitForm('filtersForm')">确定</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-dialog>
</template>
<script>
import UploadVideo from "../components/upload_video.vue";
import DialogUpImg from "../components/dialog_video_upImg.vue";
import { Loading } from 'element-ui';
export default {
  data() {
    return {
      //综合搜索
      filtersData: {
        name: "",
        url: "",
        fileId: "",
        cover:"",
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 12, message: "不超过12个字符", trigger: "blur" }
        ],
        url: [{ required: true, message: "请上传视频", trigger: "blur" }],
        cover: [{ required: true, message: "请上传封面", trigger: "blur" }]
      },
      videoChannelOptions: [],
      setVideoChannelData: [],
      //模态开关
      videoUpDialogVisible: false,
       dialogImageUrl:'',
       dialogVisible:false,
      imgStatus: true,
      
    };
  },
  created() {
    this.init();
  },
  methods: {
     //删除
    imgRemove(){
      if(!!this.filtersData.cover){
         this.request(this.api.content.basePicture_deleteOssImage, {imageUrl:this.filtersData.cover})
         .then(res => {
           this.filtersData.cover='';
        });
      }
    },
    //初始化
    init() {
        this.setVideoChannelData=[];
        this.filtersData= {
            name: "",
            url: "",
            fileId: "",
            cover:"",
        };
    },
    propInit() {
      this.init();
      this.getVideoChannel();
      this.videoUpDialogVisible = true;
    },
    //获取视频频道列表
    getVideoChannel() {
      this.request(this.api.product.videoChannel_list, {}).then(res => {
        this.videoChannelOptions = res.data;
      });
    },
    heandleImg(params){
      this.filtersData.cover = params.imageUrl;
    },
    handlePictureCardPreview(){
      this.dialogImageUrl =this.filtersData.cover;
      this.dialogVisible = true;
    },
    //获取视频
    getVideoParams(data) {
      this.filtersData.fileId = data.fileId;
      this.filtersData.url = data.url;
    },
    //新增
    submitForm(formName) {
      console.log(this.filtersData);
      this.$refs[formName].validate(valid => {
        if (valid) {
            let loadingInstance = Loading.service({target:'#dialog'});
          let videoChannels = this.filtersData.videoChannelAssociates || [];
          for (let i = 0; i < videoChannels.length; i++) {
            videoChannels[i].videoName = this.filtersData.name;
          }
          this.request(this.api.product.video_save, this.filtersData).then(
            data => {
         loadingInstance.close();
              this.$message.success("保存成功");
              this.$emit('refreshVideoList','刷新')
             this.closeDialog();
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //多选发生改变
    setChannelGet(item) {
      let mutex = this.setVideoChannelData,
        mutexLen = mutex.length;
      let mutexList = this.videoChannelOptions,
        mutexListLen = mutexList.length;
      let categories = [];
      for (let i = 0; i < mutexLen; i++) {
        for (let k = 0; k < mutexListLen; k++) {
          if (mutex[i] == mutexList[k].id) {
            categories.push({
              channelId: mutexList[k].id,
              channelName: mutexList[k].name
            });
          }
        }
      }

      this.filtersData.videoChannelAssociates = categories;
    },
    //关闭
    closeDialog() {
      this.videoUpDialogVisible = false;
    }
  },
  components: {
    UploadVideo,
    DialogUpImg
  }
};
</script>
<style lang="less" scoped>
.video-txt {
  font-size: 12px;
  color: #999999;
}
.cover-wrap {
  display: flex;
  justify-content: flex-start;
  .cover-img {
    width: 120px;
    height: 150px;
    position: relative;
    border-radius: 3px;
    border: 1px solid #c0ccda;
    margin: 10px 10px 0 0;
    transition: all 0.5s ease-in-out;
  }
  .cover-img:hover .hide-box {
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
.view-img {
  width: 100%;
  height: 100%;
  border-radius: 3px;
}
</style>