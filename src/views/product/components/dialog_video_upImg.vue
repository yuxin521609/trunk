<!--
 * @Description: 商品中心上传图片使用
 * @Author: elephant
 * @Date: 2019-08-23 11:35:03
 * @LastEditTime: 2019-10-23 09:47:53
 * @LastEditors: your name
 -->
<template>
  <div class="upload-img" v-loading="isLoading">
    <el-upload
      class="avatar-uploader"
      :action="imgAction()"
      accept="image/png, image/jpg, image/webp, image/jpeg"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :data="uploadData"
      :multiple="isMultiple"
    >
      <nav v-if="upIsShow" class="btn-wrap mt-10">
        <i slot="default" class="el-icon-plus"></i>
      </nav>
    </el-upload>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogImgVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
let token = getToken(); /// localStorage.getItem('token') // 要保证取到
export default {
  props: {
    //根据type 取决于回调方法
    imgType: {
      type: String,
      default: "MASTER_IMAGE"
    },
    upIsShow:{
        type:Boolean,
        default:true
    }
  },
  data() {
    return {
      dialogImgVisible: false,
      dialogImageUrl: "",
      isMultiple: false,
      isLoading:false,
      uploadData: { catalog: "product" }
    };
  },
  methods: {
    init() {},
    imgAction() {
      return this.api.FN_ALLPATH(this.api.content.picture_upload);
    },
    handlePictureCardPreview(file) {
      //预览图片时调用
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    beforeAvatarUpload(file) {
      //文件上传之前调用做一些拦截限制
      const isLtM = file.size / 1024 / 1024 < 5;
      const str = file.type.split("/")[1].toLowerCase();
      if (!isLtM) {
        this.$message.error("上传图片大小不能超过" + 5 + "MB!");
        return false;
      }
      if (!str.match(/png|jpg|gif|webp|jpeg/)) {
        this.$message.error("上传图片只能是 jpeg | jpg | png格式!");
        return false;
      }
       this.isLoading = true
        return true;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
        this.isLoading = false;
        //主图
        if(this.imgType == 'MASTER_IMAGE'){
            this.$emit('setParentMasterImg',res.data);
        }else if(this.imgType == 'DETAIL_IMAGE'){
            //详情
             this.$emit('setParentDetailImg',res.data);
        }else{
          //其他
            this.$emit('setParentImg',res.data);
        }
      // this.$emit('parentRef',res.data.imageUrl);
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleExceed(files, fileList) {
      //图片上传超过数量限制
      this.$message.error("只能上传一张!");
    }
  },
  watch: {
    upIsShow(val){
        this.upIsShow=val;
    }  
  },
  components: {}
};
</script>

<style lang="less" scoped>
.btn-wrap {
  width: 120px;
   height: 150px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  line-height: 150px;
  i {
    font-size: 28px;
    color: #8c939d;
  }
}
</style>