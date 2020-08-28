<template>
  <div>
    <el-upload
      ref="dragTable"
      :class="{hide:isHideUpload}"
      :action="imgAction()"
      list-type="picture-card"
      accept="image/*"
      :limit="LssUpimgLimit"
      :headers="tokenHeaders"
      :file-list="imageArr"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :data="uploadData"
      :before-upload="beforeAvatarUpload"
      :on-error="imgUploadError"
      :disabled="disabled"
    >
    <i class="el-icon-plus"></i>
    </el-upload>
    <p class="img-tips" v-if="describe">{{ describe }}</p>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>

import { getToken } from "@/utils/auth";
import draggable from 'vuedraggable';
import Sortable from 'sortablejs';
let token = getToken();

export default {
  props: {
    // 请求参数
    CatalogName:[String],
    // 回显数据
    EchoDisplayImages:[Array,String],
    // 描述
    describe:[String],
    // 上传个数
    LssUpimgLimit:[Number],
    // 是否禁止
    disabled:[Boolean],
    // 上传图片路径
    imgApi:[String, Object]
  },
  model:{
    event:'parentRef'
  },
  data() {
    return {
      // 上传文件列表
      imageArr: [],
      // 头部请求token
      tokenHeaders: {accessToken: token},
      // 预览图片地址
      dialogImageUrl: '',
      // 预览图片是否显示
      dialogVisible: false,
      // 上传的参数
      uploadData:{},
      // 上传图标是否显示
      isHideUpload:false
    };
  },
  components: {
    draggable
  },
  created() {
    this.uploadData = {
      catalog: this.CatalogName
    };  
    this.imageArr = this.EchoDisplayImages;
  },
  mounted(){
  this.$nextTick(() => {
      // 初始行拖拽
      this.rowDrop()
      })
  },
  watch: {
    imageArr(){
      this.isHideUpload = this.imageArr.length >= this.LssUpimgLimit;
    }
  },
  methods: {
    /**
     * 表格行拖拽
     */ 
    rowDrop() {
      const tbody = this.$refs.dragTable.$el.querySelector('.el-upload-list')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          if(newIndex === oldIndex) return
          const currRow = _this.imageArr.splice(oldIndex, 1)[0]
          _this.imageArr.splice(newIndex, 0, currRow)
          let listData = _this.imageArr.map((item,index) => {
            return {
              id: item.id,
              sort: ++index
            }
          })
        }
      })
    },
    /**
     * 获取上传图片请求地址
     * @return { String } 请求路径
     */
    imgAction() {
      return this.api.FN_ALLPATH(this.imgApi);
    },
    /**
     * 文件上传之前调用做一些拦截限制
     * @param { Object } file 上传的文件信息
     */
    beforeAvatarUpload(file) {
      const isJPG = true;
      const isLtM = file.size / 1024 / 1024 < 1;
      if (!isLtM) {
        this.$message.error('上传图片大小不能超过1MB!');
      }
      return isJPG && isLtM;
    },
    /**
     * 预览图片
     * @param { Object } file 预览的文件信息
     */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /**
     * 删除图片时调用
     * @param { Object } file 删除的文件信息
     * @param { Array } fileList 文件列表
     */
    handleRemove(file, fileList) {
      this.imageArr = fileList;
      this.$emit('parentRef',this.imageArr);
    },
    /**
     * 上传图片成功时调用
     * @param { Object } res 上传图片成功消息体
     * @param { Object } file 删除的文件信息
     * @param { Array } fileList 文件列表
     */
    handleAvatarSuccess(res, file, fileList) {
      file.url = res.data.URL || res.data.url;
      this.imageArr = fileList;
      this.$emit('parentRef',this.imageArr);
    },
    /**
     * 上传图片失败时调用
     */
    imgUploadError() {
      this.$message.error("上传图片失败!");
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

