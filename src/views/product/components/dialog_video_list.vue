<!--
 * @Description: 弹出视频列表组件 
 * @Author: elephant
 * @Date: 2019-08-22 14:12:17
 * @LastEditTime: 2019-11-15 17:13:29
 * @LastEditors: your name
 -->
<template>
  <!-- dialog  -->
  <el-dialog
    title="视频列表"
    :visible.sync="videoListDialogVisible"
    class="alarmPopup"
    width="1080px"
    :before-close="closeDialog"
  >
    <ul class="form-wrap">
      <li>
        <el-button size="small"  type="primary" @click="openUploadVideo()">本地上传</el-button>
      </li>
      <li>
        <el-form
          :model="videoFormData"
          label-width="100px"
          size="small"
          ref="dialogForm"
          inline
        >
          <el-form-item prop="setVideoChannelData" label="关联频道：">
            <el-input class="input-w" placeholder="请输入内容" v-model="videoFormData.serchwords"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="handleSearch"  type="primary" plain>搜索</el-button>
            <el-button size="small" @click="handleResetFilters('dialogForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </li>
    </ul>
    <!-- 视频列表 -->
    <div class="box-wrap">
      <ul v-for="(item,index) in listData" :key="index" class="view-wrap">
        <li class="view-item">
          <el-image class="view-img" :src="item.cover" fit="contain"></el-image>
          <div class="view-play-wrap">
            <i @click.stop="openPlay(item)" class="play el-icon-video-play"></i>
          </div>
        </li>
        <li>{{item.name}}</li>
        <li>
          <el-button @click="selectVideo(item)" size="small" type="text">选择</el-button>
        </li>
      </ul>
    </div>
    <!-- 视频列表END -->
    <!-- 分页 -->
    <div class="pagination mt-10 mb-20">
      <el-pagination
        class="mr-20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="videoFormData.pageIndex"
        :page-size="videoFormData.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 分页END -->

    <div class="item-right">
      <el-button size="small" @click="closeDialog()">取消</el-button>
    </div>
    <!-- 视频弹窗 -->
    <dialog-video-up @refreshVideoList="handleSearch" ref="dialogVideoUpRef"></dialog-video-up>
    <!-- end -->
  </el-dialog>
</template>
<script>
import DialogVideoUp from "./dialog_video_up.vue";
export default {
  data() {
    return {
      //综合搜索
      videoFormData: {
        serchwords: "",
        pageIndex: 1, //当前页码
        pageSize: 12, //每页数量
        searchWords: "",
        subset: true
      },
      //模态开关
      videoListDialogVisible: false,
      //视频列表数据
      listData: [],
      total: null, //总条目数
      //判断主图或者全屏
      isMain:false,
      fullScreenList:[],
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.fullScreenList=[];
    },
    propInit(params,list) {
      this.init();
      this.handleSearch();
      this.videoListDialogVisible = true;
      //主图
      if(params == 'main'){
        this.isMain=true;
      }else{
        this.fullScreenList=list;
        this.isMain=false;
      }
    },
    //选择视频判断是什么类型调用 然后发送到不同的数据
    selectVideo(params){
      if(this.isMain){
        //主图
        this.$emit('parentMainHandle',params);
        this.closeDialog();
      }else{
        //全屏
       // console.log(this.fullScreenList);
        let list= this.fullScreenList;
        for (let i = 0; i < list.length; i++) {
          if(list[i].videoId == params.id ){
            this.$message.error('已有当前视频！')
            return false
          }
        }
        this.$emit('parentFullScreenHandle',params);
        this.closeDialog();
       }
    },
    //获取列表
    getTableList() {
      this.request(this.api.product.video_list, this.videoFormData).then(
        data => {
          let _data = data.data;
          console.log(_data);
          this.listData = _data;
          this.total = data.totalCount;
        }
      );
    },
    //打开本地上传视频模态框
    openUploadVideo() {
      this.$refs.dialogVideoUpRef.propInit();
    },
    //打开视频播放
    openPlay(item) {
      this.$emit('parentVideoPlay',item.url)
    },
    //搜索
    handleSearch() {
      this.videoFormData.pageIndex = 1;
      this.getTableList();
    },
    //清空重置
    handleResetFilters(formName) {
      this.$refs[formName].resetFields();
    },
    //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.videoFormData.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.videoFormData.pageSize = val;
      this.getTableList();
    },
    //关闭
    closeDialog() {
     // this.$refs["dialogForm"].resetFields(); //重置选项
      this.videoListDialogVisible = false;
    }
  },
  components: {
    DialogVideoUp
  }
};
</script>
<style lang="less" scoped>
.alarmPopup /deep/ .el-dialog__body{
  padding: 0 20px 30px;
}
.form-wrap {
  display: flex;
  justify-content: space-between;
}
//视频列表
.box-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.view-wrap {
  width: 155px;
  height: 200px;
  margin: 0 18px 0 0;
  > li {
    font-size: 14px;
  }
  > li:nth-child(1) {
    width: 155px;
    height: 112px;
    border: 1px solid #dddddd;
    border-radius: 3px;
    margin-bottom: 5px;
  }
}

.view-play-wrap {
  width: 155px;
  height: 112px;
  position: absolute;
  left: 0;
  top: -1px;
  font-size: 12px;
  color: #ffffff;
  padding: 4px 2px 4px 4px;
  background-color:rgba(0,0,0,0.4);
 
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
    color: #ffffff;
  }
}
.view-item {
  position: relative;
}
.view-item:hover{
  .view-play-wrap {
    display: block;
  }
}
.view-img {
  width: 155px;
  height: 112px;
}
</style>