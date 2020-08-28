<template>
  <div>
    <el-upload
      :class="{hide:hideUpload,imgdisabled:disabled}"
      :action="imgAction()"
      :list-type="lssListType"
      accept="image/*"
      :limit="LssUpimgLimit"
      :headers="tokenHeaders"
      :file-list="productImgs"
      :multiple="isMultiple"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :on-change="handleChange"
      :data="uploadData"
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :on-error="imgUploadError"
    >
      <el-button v-if="lssListType == 'picture'" :disabled="disabled" size="small" type="primary">上传图片</el-button>
      <i  v-else class="el-icon-plus"></i>
    </el-upload>
     <p class="img-tips">{{imgTxt}}</p>
    <el-dialog :visible.sync="dialogImgVisible"  append-to-body>
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
/**
 * 因时间问题
 * 部分功能未从父级传入
 * 如有调用 请 梳理并增加默认参数
 *
 */
import { getToken } from "@/utils/auth";
let token = getToken(); /// localStorage.getItem('token') // 要保证取到
export default {
  name: "el-upload-img",
  model:{
      prop:"productImg",
      event:'parentRef'
  },
  props: {
    productImg:[Array,String],
    disabled:{ //禁用
      default: false,
      type:Boolean
    },
    LssUpimgLimit:{ //图片上传限制  已做 超出隐藏
      default: 1,
      type:[Number,String]
    },
    CatalogName:{  //catalog名称
      default: 'product',
      type: String
    },
    //上传显示样式
    lssListType:{
      default:'picture-card',
      type:String
    },
    // 回显 图片
    EchoDisplayImages:{
      type: Array,
       default() {
      return []
    }
    },
    //图片大小
    ImgSize:{
      default:2,
      type:[Number,String]
    },
    ImgTips:{
      default:'',
      type:String
    }
  },
  data() {
    return {
      hideUpload: false,
      elImgSize:null,
      //单图上传
      dialogImageUrl: "",
      dialogImgVisible: false,
      productImgs: [],
      isMultiple: false,
      imgLimit: 6,
      tokenHeaders:{accessToken: token},
      uploadData:{},
      imgTxt: '',
      //多图上传
      arrMultiple: true //是否支持多选文件
    };
  },
  created() {
  this.init();
   this.productImgs=this.EchoDisplayImages;
   this.hideUpload = this.EchoDisplayImages.length >= this.LssUpimgLimit || this.disabled;
   this.imgTxt = !!this.ImgTips ? this.ImgTips : `只能上传单张图片，大小不超过${this.ImgSize}M`;

  },
  watch: {
    EchoDisplayImages(){
      this.productImgs = this.EchoDisplayImages;
      this.hideUpload = this.EchoDisplayImages.length >= this.LssUpimgLimit || this.disabled;
    }
  },
  methods: {
    init(){
      this.uploadData = { catalog: this.CatalogName};
      this.elImgSize=Number(this.ImgSize)
    },
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
      this.uploadData = { catalog: "content", name: "photo" };
      let isJPG = true;
      let isLtM = true;
      if(this.elImgSize < 1){
        isLtM = file.size / 1024 < Number(this.elImgSize) * 1000;
      }else{
        isLtM = file.size / 1024 / 1024 < Number(this.elImgSize);
      }
      if (!isLtM) {
        if(this.elImgSize < 1){
          let _size= Number(this.elImgSize) * 1000;
          this.$message.error('上传图片大小不能超过'+_size+'KB!');
        }else{
          this.$message.error('上传图片大小不能超过'+this.elImgSize+'MB!');
        }
      }
      return isJPG && isLtM;
    },
    handleAvatarSuccess(res, file) {
      //图片上传成功
      //console.log(res.data.imageUrl);
      this.$emit('parentRef',res.data.imageUrl);
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleExceed(files, fileList) {
      //图片上传超过数量限制
      this.$message.error("只能上传一张!");
    },
    imgUploadError(err, file, fileList) {
      //图片上传失败调用
      this.$message.error("上传图片失败!");
    },
    /**
     * @Date: 2019-10-24 14:39:10
     * @description: 删除图片  TODO 不能通过服务器删除 因为卡券使用的了默认图片 删除后影响数据
     * @author: elephant
     * @param {file,fileList} 
     * @return: 
     */
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.LssUpimgLimit;
      //移除图片
      // let fileImgUrl = null;
      // if (file.response) {
      //   fileImgUrl = file.response.data.imageUrl;
      // } else {
      //   fileImgUrl = file.url;
      // }
      // let imgArr = this.productImgs;
      // let index = imgArr.findIndex(item => item.path == fileImgUrl);
      // if(imgArr[index].id != undefined){
      //     this.request(this.api.product.enterpriseArchivalInformation_logicDelete,{id:imgArr[index].id});
      // }
      // imgArr.splice(index, 1);
    },
    handleChange(files, fileList){
      this.hideUpload = fileList.length >= this.LssUpimgLimit;
    }
  }
};
</script>
<style lang="less" scoped>
.hide /deep/ .el-upload--picture-card {
    display: none;
}
.imgdisabled /deep/ .el-upload-list__item-delete {
    display: none !important;
}
</style>

