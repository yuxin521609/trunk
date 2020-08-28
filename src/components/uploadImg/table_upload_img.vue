<template>
    <el-dialog
    title="图片"
    :visible.sync="upLoadVisible"
    class="alarmPopup"
    width="500px"
    >
    <div class="img-wh">
       <img width="100%" :src="dialogImageUrl" alt>
    </div>
    <div>
      <el-upload
        :action="action()"
        class="img-upload"
        ref="uploadImg"
        list-type="picture"
        accept="image/*"
        :limit="1"
        :headers="tokenHeaders"
        :file-list="productImgs"
        :multiple="isMultiple"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :data="uploadData"
        :before-upload="beforeAvatarUpload"
        :on-exceed="handleExceed"
        :on-error="imgUploadError"
        :auto-upload="false"
      >
       <el-button size="small" slot="trigger">{{imgTxt}}</el-button>
        <div class="upload-img-footer">
            <el-button  size="small" @click="closeDialog()" >取消修改</el-button>
            <el-button  size="small" @click="submitUpload" type="success" >确定修改</el-button>
        </div>
      </el-upload>
    </div>

  </el-dialog>
</template>
<script>
import { getToken } from "@/utils/auth";
const token = getToken();
export default {
    name:'tp-upload-img',
    data(){
        return{
            upLoadVisible:false,
            editDisabled:true,//可编辑状态  除使用状态其他都不可编辑
            showDisabled:true,//查看时 使用状态不可编辑
            _type:'',
            filtersData:{
            },
            imgTxt:'上传图片',
             //单图上传
            dialogImageUrl: "", //图片存的字符串
            productImgs: [],
            isMultiple: false,
            imgLimit: 6,
            tokenHeaders: { accessToken: token },
            uploadData: { catalog: "product" },
            listData:{}
       }
    },
    created(){
    },
    methods:{
        submitUpload() {
          this.$refs.uploadImg.submit();
        },
        //初始化
        uploadImgPopupInit(row){
          this.productImgs=[];
          this.imgTxt=row.image == ''?'上传图片':'修改图片';
          this.dialogImageUrl=row.image;
          this.listData=row;
          this.upLoadVisible=true;
        },
        //颜色上传
        action() {
          return this.api.FN_ALLPATH(this.api.content.picture_upload);
        },
        handleRemove(file, fileList) {
          //移除图片
          this.dialogImageUrl=this.listData.image;
        },
        handlePictureCardPreview(file) {
          //预览图片时调用
          this.dialogImageUrl = file.url;
        },
        beforeAvatarUpload(file) {
          //文件上传之前调用做一些拦截限制
          this.uploadData = { catalog: "content", name: "photo" };
          const isJPG = true;
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error("上传图片大小不能超过 2MB!");
          }
          return isJPG && isLt2M;
        },
        handleAvatarSuccess(res, file, list) {
          //图片上传成功 需修改 .data.imageUrl
          this.dialogImageUrl = res.data.imageUrl;
          this.listData.image = res.data.imageUrl;
          this.$message.success('修改成功');
          setTimeout(() => {
            this.closeDialog();
          }, 2000);
          //this.imageUrl = URL.createObjectURL(file.raw);
        },
        handleExceed(files, fileList) {
          //图片上传超过数量限制
          this.$message.error("图片只能上传一张!");
        },
        imgUploadError(err, file, fileList) {
          //图片上传失败调用
          this.$message.error("上传图片失败!");
        },
        //关闭
        closeDialog(){
            this.dialogImageUrl='';
            this.productImgs=[];
            this.upLoadVisible=false;
        },
    }
}
</script>
<style lang="less" scoped>
.img-wh{
  margin: 10px 0;
  text-align: center;
  img{
    height: 300px;
    width: auto;
    max-width: 460px;
  }
}
 .upload-img-footer{
 float: right
}
</style>
