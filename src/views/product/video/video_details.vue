<!--
 * @Description: 视频详情
 * @Author:elephant
 * @Date: 2019-08-13 18:04:27
 * @LastEditTime: 2019-08-22 16:34:32
 * @LastEditors: Please set LastEditors
 -->

<template>
  <div class="bg-fff item-margin">
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
        <h5 class="item-title">基本信息</h5>
        <el-col :span="24">
          <el-form-item prop="name" label="视频名称：">
            <el-input
              class="input-w-2"
              placeholder="请输入内容"
              :disabled="showDisabled"
              v-model="filtersData.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="url" label="视频内容：">
            <upload-video @setVideoParams="getVideoParams" ref="videoRef"></upload-video>
            <p class="video-txt">只能上传单个视频，主图视频建议3：4，全屏视频建议为9：16，每个大小不超过20M。</p>
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
                    v-if="!showDisabled"
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
        <el-col :span="24">
          <el-form-item prop="valid" label="使用状态：">
            <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="true">使用中</el-radio>
            <el-radio v-model="filtersData.valid" :disabled="showDisabled" :label="false">未使用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="description" label="备注：">
            <el-input
              type="textarea"
              class="input-w-2"
              :rows="2"
              :disabled="showDisabled"
              placeholder="请输入内容"
              v-model="filtersData.description"
            ></el-input>
          </el-form-item>
        </el-col>
        <h5 class="item-title">相关频道</h5>
        <el-col :span="24">
          <el-form-item label="频道名称：">
            <el-select
              multiple
              v-model="setVideoChannelData"
              @change="setChannelGet"
              @remove-tag="removeChannel"
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
      </el-row>
    </el-form>
    <div class="item-footer">
      <el-button
        v-if="this._type == 'add'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="this._type == 'edit'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >修改</el-button>
      <el-button size="small" @click="routerback('filtersForm')">取消</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import UploadVideo from "../components/upload_video.vue";
//引入图片组件
import DialogUpImg from "../components/dialog_video_upImg.vue";
export default {
  data() {
    return {
      filtersData: {
        name: "",
        description: "",
        valid: true,
        url: "",
        fileId: "",
        cover: null, //封面
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 12, message: "不超过12个字符", trigger: "blur" }
        ],
        url: [{ required: true, message: "请上传视频", trigger: "blur" }],
        cover: [{ required: true, message: "请上传封面", trigger: "blur" }]
      },
      editDisabled: false,
      showDisabled: false,
      imgStatus: true,
      dialogVisible:false,
      dialogImageUrl:'',
      _type: "",
      _id: "",
      videoChannelOptions: [],
      setVideoChannelData: []
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
    //获取视频频道列表
    this.getVideoChannel();
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
    heandleImg(params) {
      console.log( params.imageUrl);
      this.filtersData.cover = params.imageUrl;
    },
    getVideoChannel() {
      this.request(this.api.product.videoChannel_list, {}).then(res => {
        this.videoChannelOptions = res.data;
      });
    },
    handlePictureCardPreview(){
      this.dialogImageUrl =this.filtersData.cover;
      this.dialogVisible = true;
    },
    //获取上页面参数
    getQueryparams() {
      //console.log(this.$route.query.id);
      this._type = this.$route.query.type;
      this._id = this.$route.query.id;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          break;
        case "edit": //修改
          this.editDisabled = true;
          this.showDisabled = false;
          this.getData();
          break;
        case "show": //查看
          this.editDisabled = true;
          this.showDisabled = true;
          this.getData();
          break;
      }
    },
    //获取视频
    getVideoParams(data) {
      this.filtersData.fileId = data.fileId;
      this.filtersData.url = data.url;
    },
    //获取数据
    getData() {
      this.request(this.api.product.video_get, {
        id: this._id
      }).then(res => {
        this.filtersData = res;
        //传入视频
        this.$refs.videoRef.propInit(res);
        //处理相关频道
        let itemList = res.videoChannelAssociates || [];
        let list = [];
        for (let i = 0; i < itemList.length; i++) {
          list.push(itemList[i].channelId);
        }
        this.setVideoChannelData = list;
      });
    },
    //新增
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let videoChannels = this.filtersData.videoChannelAssociates || [];
          for (let i = 0; i < videoChannels.length; i++) {
            videoChannels[i].videoName = this.filtersData.name;
          }
          this.request(this.api.product.video_save, this.filtersData).then(
            data => {
              this.$message.success("保存成功");
              setTimeout(() => {
                this.routerback();
              }, 500);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    removeChannel(item) {
      if (this._type == "edit") {
        let exclusions = this.filtersData.videoChannelAssociates;
        if (exclusions.length > 0) {
          let flag = false;
          for (let i = 0; i < exclusions.length; i++) {
            if (exclusions[i].channelId == item && exclusions[i].id != null) {
              flag = true;
              exclusions[i].status = 9;
            }
          }
          if (!flag) {
            let index = exclusions.findIndex(elem => elem.channelId == item);
            if (index != -1) {
              this.filtersData.videoChannelAssociates.splice(index, 1);
            }
          }
        }
      }
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
      if (this._type == "edit") {
        let exclusions = this.filtersData.videoChannelAssociates;
        let list = [];
        for (let i = 0; i < categories.length; i++) {
          let flag = false;
          for (let k = 0; k < exclusions.length; k++) {
            if (exclusions[k].channelId == categories[i].channelId) {
              flag = true;
            }
            if (
              exclusions[k].channelId == categories[i].channelId &&
              exclusions[k].id != null
            ) {
              exclusions[k].status = 1;
            }
          }
          if (!flag) {
            list.push(categories[i]);
          } else {
          }
        }
        this.filtersData.videoChannelAssociates = [...list, ...exclusions];
      } else {
        this.filtersData.videoChannelAssociates = categories;
      }
    },
    //后退
    routerback() {
      this.$router.go(-1);
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
