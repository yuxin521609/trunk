<!--
 * @Author: elephant
 * @Date: 2020-02-12 10:01:50
 * @LastEditTime : 2020-02-14 09:45:42
 * @LastEditors  : Please set LastEditors
 * @Description: 批量修改图片
 * @custom_string_obkoro: 看看写点什么
 -->
<template>
  <div>
    <el-dialog title="批量更新图片：" :visible.sync="dialogVisible" class="alarmPopup" width="600px">
      <div>
        <div class="color-wrap">
          <h5>选择颜色：</h5>
          <ul class="color">
            <li
              v-for="(item,index) in colorList"
              :key="index"
              @click="colorClick(item,index)"
              :class="{'active':item.isSelected}"
            >{{item.color}}</li>
          </ul>
        </div>
        <div class="update-wrap">
          <h5>更新图片：</h5>
          <div class="update">
          <el-upload
            :class="{hide:hideUpload}"
            :action="action()"
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            :headers="tokenHeaders"
            :file-list="productImgs"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :data="uploadData"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :on-error="imgUploadError"
          >
            <i class="el-icon-plus" ></i>
          </el-upload>
          </div>
        </div>
      </div>
      <div class="item-right mt-10">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" @click="submit()" type="primary">确认</el-button>
      </div>
    </el-dialog>
     <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
let token = getToken(); 
export default {
  data() {
    return {
      hideUpload: false,
      filtersForm:{
        colorCode:'',
        color: "",
        imgUrl:'',
      },
      dialogVisible: false,
      colorList: [],
      // 图片
      imgDialogVisible:false,
      dialogImageUrl: "",
      productImgs: [],
      isMultiple: false,
      tokenHeaders: { accessToken: token },
      uploadData: { catalog: "product" },
    };
  },
  created() {},
  methods: {
    propInit(arr) {
      for (let k = 0; k < arr.length; k++) {
        arr[k].isSelected = false;
      }
      this.colorList = arr;
      this.dialogVisible = true;
    },
    colorClick(item, index) {
      item.isSelected = !item.isSelected;
      this.filtersForm.color = item.isSelected ? item.color : "";
      this.filtersForm.colorCode = item.isSelected ? item.colorCode : "";
      this.noColorClick(item);
    },
    // 置灰其他未选
    noColorClick(item) {
      for (let i = 0; i < this.colorList.length; i++) {
        if (item.colorCode != this.colorList[i].colorCode) {
          this.colorList[i].isSelected = false;
        }
      }
    },
    action() {
      return this.api.FN_ALLPATH(this.api.content.picture_upload);
    },
    handleRemove(file, fileList) {
      //移除图片
      console.log(file, fileList);
      this.hideUpload=false;
      //  this.request(
      //     this.api.product.enterpriseArchivalInformation_logicDelete,
      //     { id: file.uid },true
      //   );
    },
    handlePictureCardPreview(file) {
      //预览图片时调用
      console.log(file);
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    beforeAvatarUpload(file) {
      //文件上传之前调用做一些拦截限制
      const isJPG = true;
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      }
      this.hideUpload=true;
      return isJPG && isLt1M;
    },
    handleAvatarSuccess(res, file) {
      //图片上传成功
     // console.log(res.data.imageUrl);
      this.filtersForm.imgUrl = res.data.imageUrl;
      
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleExceed(files, fileList) {
      //图片上传超过数量限制
      this.$message.error("logo只能上传一张!");
    },
    imgUploadError(err, file, fileList) {
      //图片上传失败调用
      this.$message.error("上传图片失败!");
      this.hideUpload=true;
    },
    submit() {
      if (!this.filtersForm.color) {
        this.$message.error("请选择颜色！");
        return false;
      }
      if (!this.filtersForm.imgUrl) {
        this.$message.error("请上传图片！");
        return false;
      }
      this.$emit('imgChange',this.filtersForm);
      this.closeDialog();
    },
    closeDialog() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.color-wrap {
  display: flex;
  align-items: flex-start;
  > h5 {
    width: 75px;
    font-weight: 100;
    min-width: 75px;
  }
  .color {
    > li {
      display: inline-block;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      padding: 2px 12px;
      cursor: pointer;
      margin: 0 10px 10px 0;
    }
    > li.active {
      border-radius: 4px;
      background-color: #2290e8;
    }
    > li.disabled {
      cursor: not-allowed;
      color: #e8e8e8;
    }
  }
}
.update-wrap{
  display: flex;
  align-items: flex-start;
  > h5 {
    width: 75px;
    font-weight: 100;
    min-width: 75px;
  }
}
.hide /deep/ .el-upload--picture-card {
    display: none;
}
</style>
