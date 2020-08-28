<!--
 * @Description: 视频列表
 * @Author: elephant
 * @Date: 2019-08-13 18:04:11
 * @LastEditTime: 2019-11-14 15:41:56
 * @LastEditors: your name
 -->
<template>
  <div>
    <div class="item-margin">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="90px"
        size="small"
        ref="filtersForm"
        inline
      >
        <el-form-item prop="channelId" label="关联频道：">
          <el-select class="input-w" placeholder="请选择" v-model="filtersData.channelId">
            <el-option
              v-for="item in videoChannelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="startTime" label="日期选择：">
          <el-date-picker
          :clearable="false"
            v-model="filtersData.startTime"
            type="date"
            placeholder="开始日期"
            :picker-options="pickerOptions0"
            class="input-w"
          ></el-date-picker>-
          <el-date-picker
          :clearable="false"
            v-model="filtersData.endTime"
            type="date"
            placeholder="结束日期"
            :picker-options="pickerOptions1"
            class="input-w"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="searchWords" label="综合搜索：">
          <el-input class="input-w" placeholder="请输入内容" v-model="filtersData.searchWords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="handleSearch" type="primary" plain>搜索</el-button>
          <el-button size="small" @click="handleResetFilters('filtersForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table  -->
    <div class="item-margin">
      <div class="item-cont">
        <el-button size="small" type="primary" @click="openAddDetails">上传视频</el-button>
        <el-button
          v-if="btnStatus"
          size="small"
          type="primary"
          @click="btnStatus=false;viewStatus=true;"
          plain
        >进行选择</el-button>
        <el-button v-if="!btnStatus" size="small" @click="allHandleSelect" type="primary" plain>全选本页</el-button>
        <el-button
          v-if="!btnStatus"
          size="small"
          type="primary"
          @click="offHandleSelected();"
          plain
        >取消选择</el-button>
        <el-button
          v-if="!btnStatus"
          size="small"
          type="primary"
          @click="allHandleChannel"
          plain
        >批量操作</el-button>
      </div>
      <div class="item-table">
        <!-- 视频 -->
        <div class="box-wrap">
          <ul v-for="(item,index) in listData" :key="index" class="view-wrap">
            <li class="view-item">
              <el-image class="view-img" :src="item.cover" fit="contain"></el-image>
              <div v-if="!viewStatus" @click.stop="openPlay(item)" class="view-play-wrap"></div>
              <div v-if="viewStatus" @click.stop="setCheck(item)" class="view-check-wrap">
                <nav :class="{'view-check':true, 'active':item._status}">
                  <i v-show="item._status" class="el-icon-check"></i>
                </nav>
              </div>
            </li>
            <li>{{item.name}}</li>
            <li>关联频道：{{item.channelNames}}</li>
            <li>上传时间：{{item._time}}</li>
            <li>
              <el-button @click="openEditDetails(item.id)" size="small" type="text">编辑</el-button>
              <el-button @click="removeVideo(item)" size="small" type="text">删除</el-button>
            </li>
          </ul>
        </div>
        <!-- 视频END  -->
        <div v-show="btnStatus" class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-size="filtersData.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!--table END  -->
    <!-- dialog  -->
    <el-dialog
      title="批量操作"
      :visible.sync="batchDialogVisible"
      class="alarmPopup"
      width="500px"
      :before-close="closeDialog"
      append-to-body
    >
      <el-form
        class="item-form"
        :model="dialogFormData"
        label-width="100px"
        size="small"
        ref="dialogForm"
      >
        <el-form-item prop="setVideoChannelData" label="关联频道：">
          <el-select
            multiple
            v-model="dialogFormData.setVideoChannelData"
            @change="setChannelGet"
            placeholder="可多选"
            class="input-w-2"
          >
            <el-option
              v-for="item in videoChannelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="item-right">
        <el-button size="small" @click="closeDialog('dialogForm')">取消</el-button>
        <el-button size="small" @click="dialogSubmitForm('dialogForm')" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <!-- 视频组件 -->
    <video-play-view ref="videoRef"></video-play-view>
  </div>
</template>
<script>
import VideoPlayView from "../components/videoPlay.vue";
let selectedVideoList = []; //已选视频数据
let selectedVideoChannelList = []; //已选视频频道列表
export default {
  name:'video_list',
  data() {
    return {
      pickerOptions0: {
        disabledDate: time => {
          if (this.filtersData.endTime != "") {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.filtersData.endTime
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return (
            //time.getTime() <  ( new Date(this.filtersData.startTime).getTime() - 1 * 24 * 60 * 60 * 1000) || time.getTime() < Date.now()
              time.getTime() <  new Date(this.filtersData.startTime).getTime()
          ); //减去一天的时间代表可以选择同一天;
        }
      },
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 12, //每页数量
        searchWords: "",
        subset: true,
        channelId: null,
        endTime: "",
        startTime: ""
      },
      listData: [],
      total: null, //总条目数
      batchDialogVisible: false, //dialog 状态
      btnStatus: true,
      viewStatus: false,
      selectStatus: false,
      dialogFormData: {
        setVideoChannelData: [] //Channelmodel 数据
      },
      videoChannelOptions: [] //opt列表数据
    };
  },
  created() {
    this.getTableList();
    //获取视频频道列表
    this.getVideoChannel();
  },
   activated () {
      this.getTableList();
    },
  methods: {
    //获取视频频道列表
    getVideoChannel() {
      this.request(this.api.product.videoChannel_list, {}).then(res => {
        this.videoChannelOptions = res.data;
      });
    },
    //获取列表
    getTableList() {
      let filter = this.$common.deepCopy(this.filtersData);
      if (filter.endTime != null) {
        let date = new Date(filter.endTime);
        let t = (date.getTime() / 1000 + 86399) * 1000;
        filter.endTime = new Date(t);
      }
      this.request(this.api.product.video_list, filter).then(data => {
        let _data = data.data,
          _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i++) {
          _data[i]._time = this.$options.filters.timestampToTime(
            _data[i].createTime,
            "ymd"
          );
          _data[i]._status = false;
          let _channelNames = _data[i].videoChannelAssociates || [];
          let arr = [];
          for (let k = 0; k < _channelNames.length; k++) {
            arr.push(_channelNames[k].channelName);
          }
          _data[i].channelNames = arr.join("、");
        }
        this.listData = _data;
        this.total = data.totalCount;
      });
      filter = null;
    },

    //打开视频播放
    openPlay(item) {
      this.$refs.videoRef.videoInit(item.url);
    },
    //当前选中
    setCheck(item) {
      item._status = !item._status;
    },
    //全选本页面
    allHandleSelect(type) {
      if (type == "off") {
        for (let i = 0; i < this.listData.length; i++) {
          this.listData[i]._status = false;
        }
      } else {
        this.selectStatus = !this.selectStatus;
        for (let i = 0; i < this.listData.length; i++) {
          this.listData[i]._status = this.selectStatus;
        }
      }
    },
    offHandleSelected() {
      this.btnStatus = true;
      this.viewStatus = false;
      this.selectStatus = false;
      this.allHandleSelect("off");
    },
    //批量操作
    allHandleChannel() {
      let list = [];
      selectedVideoList = [];
      let _data = this.listData;
      for (let i = 0; i < _data.length; i++) {
        if (_data[i]._status == true) {
          list.push(_data[i]);
        }
      }
      if (list.length <= 0) {
        this.$message.error("请选择需要操作的视频");
        return false;
      }
      selectedVideoList = list;
      this.batchDialogVisible = true;
    },
    //dialog提交
    dialogSubmitForm(formName) {
      //已选视频标签列表
      if (selectedVideoChannelList.length <= 0) {
        this.$message.error("请选择关联频道");
        return false;
      }
      //已选视频列表
      let videoList = this.$common.deepCopy(selectedVideoList);
      //循环视频列表
      for (let i = 0; i < videoList.length; i++) {
        let associates = videoList[i].videoChannelAssociates;
        //更换另一种方法
        let videoChannelList = this.$common.deepCopy(selectedVideoChannelList);
        let arr = [...associates, ...videoChannelList];
        var obj = {};
        arr = arr.reduce(function(item, next) {
          obj[next.channelId]
            ? ""
            : (obj[next.channelId] = true && item.push(next));
          return item;
        }, []);
        for (let o = 0; o < arr.length; o++) {
          arr[o].videoName = videoList[i].name;
          arr[o].videoId = videoList[i].id;
        }
        videoList[i].videoChannelAssociates = arr;
      }
      this.request(this.api.product.video_saveBatch, videoList).then(res => {
        this.$message.success("保存成功");
        this.offHandleSelected();
        setTimeout(() => {
          this.closeDialog();
          this.handleSearch();
        }, 1500);
      });
    },
    //关闭
    closeDialog() {
      selectedVideoChannelList = [];
      this.$refs["dialogForm"].resetFields(); //重置选项
      this.batchDialogVisible = false;
    },
    //多选发生改变
    setChannelGet(item) {
      let mutex = this.dialogFormData.setVideoChannelData,
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
      selectedVideoChannelList = categories;
    },
    //removeVideo
    removeVideo(params) {
       this.$confirm('此操作将删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             this.request(this.api.product.video_logicDelete, params).then(res => {
            this.$message.success("删除成功");
            this.handleSearch();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //新增视频  跳转页面
    openAddDetails() {
      this.$router.push({
        path: "/product/video/add_video",
        query: {
          type: "add"
        }
      });
    },
    //查看视频
    openShowDetails(params) {
      this.$router.push({
        path: "/product/video/show_video",
        query: {
          id: params,
          type: "show"
        }
      });
    },
    //修改视频
    openEditDetails(params) {
      this.$router.push({
        path: "/product/video/edit_video",
        query: {
          id: params,
          type: "edit"
        }
      });
    },
    //搜索
    handleSearch() {
      this.filtersData.pageIndex = 1;
      this.getTableList();
    },
    //清空重置
    handleResetFilters(formName) {
      this.filtersData.endTime='';
      this.$refs[formName].resetFields();
    },
    //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersData.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersData.pageSize = val;
      this.getTableList();
    }
  },
  components: {
    VideoPlayView
  }
};
</script>
<style lang="less" scoped>
.box-wrap {
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.view-wrap {
  width: 155px;
  margin: 0 18px 5px 0;
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
  > li:nth-child(3) {
    width: 155px;
    overflow: hidden;
    text-overflow:ellipsis;
white-space: nowrap;
  }
  > li:nth-child(4) {
    color: #999999;
  }
}
.view-check-wrap,
.view-play-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.view-check-wrap {
  cursor: pointer;
}
.view-item {
  position: relative;
  cursor: pointer;
}
.view-check {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 1px solid #999999;
}
.view-check.active {
  background-color: #daa479;
  border: 1px solid #daa479;
  i {
    color: #ffffff;
  }
}
.view-img {
  width: 155px;
  height: 112px;
}
</style>
