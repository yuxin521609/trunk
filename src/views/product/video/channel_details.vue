<!--
 * @Description:频道详情
 * @Author: elephant
 * @Date: 2019-08-13 18:05:11
 * @LastEditTime: 2019-08-16 14:55:39
 * @LastEditors:1、2期商品新增功能
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
          <el-form-item prop="name" label="频道名称：">
            <el-input
              class="input-w-2"
              placeholder="请输入内容"
              :disabled="editDisabled"
              v-model="filtersData.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="logo" label="频道图标：">
            <el-upload-img
            :disabled="showDisabled"
              v-model="filtersData.logo"
              :EchoDisplayImages="productImages"
              CatalogName="product"
            ></el-upload-img>
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
        <h5 class="item-title">关联标签</h5>
        <el-col :span="24">
          <tag-matching v-model="videoChannelTags" ref="tagRef"></tag-matching>
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
  </div>
</template>
<script>
import ElUploadImg from "@/components/uploadImg/el_upload_img";
//匹配标签
import TagMatching from "../components/tagMatching.vue";
/**
 * 规格详情页面 新增 修改 查看 同一页面
 */
export default {
  data() {
    return {
      filtersData: {
        logo: "",
        name: "",
        description: "",
        videoChannelTags: []
      },
      productImages: [],
      cateArr: [],
      rules: {
        name: [
          { required: true, message: "请输入频道名称", trigger: "blur" },
          { max: 12, message: "不超过12个字符", trigger: "blur" }
        ]
      },
      editDisabled: false,
      showDisabled: false,
      _type: "",
      _id: "",
      videoChannelTags: [] //标签子组件返回的数据
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
    //尺码属性
  },
  methods: {
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
    //获取数据
    getData() {
      this.request(this.api.product.videoChannel_get, {
        id: this._id
      }).then(res => {
        let _data = res;
        console.log(_data);
        
        this.filtersData = _data;
        //处理Tags 抽出tagId传入子组件
        let tags = _data.videoChannelTags;
        let allIds = [];
        for (let i = 0; i < tags.length; i++) {
          allIds.push({ tagId: tags[i].tagId });
        }
        this.$refs.tagRef.propInit(this.$common.deepCopy(allIds));
        if (!!_data.logo) {
          this.productImages = [{ url: _data.logo }];
        }
      });
    },
    //新增
    submitForm(formName) {
      console.log(this.filtersData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this._type == "edit") {
            this.editHandleTags();
          } else if (this._type == "add") {
            let tags = this.$common.deepCopy(this.videoChannelTags);
            this.addHandleTags(tags);
          }
          this.request(
            this.api.product.videoChannel_save,
            this.filtersData
          ).then(data => {
            this.$message.success("保存成功");
            setTimeout(() => {
              this.routerback();
            }, 500);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改时处理
    editHandleTags() {
      let videoChannelTags =
        this.$common.deepCopy(this.filtersData.videoChannelTags) || [];
      let tags = this.$common.deepCopy(this.videoChannelTags);
      let deleteTags = [];
      for (let i = 0; i < videoChannelTags.length; i++) {
        let flag = false;
        for (let k = 0; k < tags.length; k++) {
          if (videoChannelTags[i].tagId == tags[k].tagId) {
            flag = true;
            tags[k] = videoChannelTags[i];
            break;
          }
        }
        if (!flag) {
          videoChannelTags[i].status = 9;
          deleteTags.push(videoChannelTags[i]);
        }
      }
      let DoneVideoChannelTags = [...deleteTags, ...tags];
      this.addHandleTags(DoneVideoChannelTags);
    },
    //新增时处理tag标签
    addHandleTags(tags = []) {
      let _name = this.filtersData.name;
      for (let i = 0; i < tags.length; i++) {
        tags[i].channelName = _name;
      }
      this.filtersData.videoChannelTags = tags;
    },
    //后退
    routerback() {
      this.$router.go(-1);
    }
  },
  components: {
    ElUploadImg,
    TagMatching
  }
};
</script>
<style lang="less" scoped>
.item-title {
}
</style>
