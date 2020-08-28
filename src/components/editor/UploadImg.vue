<style lang="less" scoped>
  .upload-img{margin-right: 20px;width: 80px;height: 80px;display: inline-block;overflow: hidden;}
  .upload-img .avatar-uploader .el-upload { border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer; position: relative; overflow: hidden;width: 80px;height: 80px;text-align: center;line-height: 80px;}
  .upload-img .avatar-uploader .el-upload:hover { border-color: #409EFF;}
  .upload-img img {width: 100%;height: 100%;}
  .upload-img span {font-size: 14px;}
</style>
<template>
  <div class="upload-img" v-loading="isLoading">
    <el-upload
        class="avatar-uploader"
        :action="action"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :data="params"
        :multiple="isMultiple"
    >
      <span v-show="value.length === 0">{{ contentTxt }}</span>
      <img :src="value" alt="" v-show="value.length > 0">
    </el-upload>
  </div>
</template>
<script>
  export default {
    props: {
      contentTxt:{
        type: String,
        default: "上传封面"
      },
      callBack: {
        type: Function
      },
      value: {
        default: ""
      },
      isRadio: {
        type: Boolean,
        default: true
      },
      imgList: {
        type: Array
      },
      actionUrl: {
        type: String
      },
      // 是否多选
      isMultiple: {
        type: Boolean,
        default: false
      },
      // 图片id
      baseId: {
        default: ""
      }
    },
    // 数据
    data() {
      return {
        // 除素材外的上传图片
        action: this.api.contentCore.picture_content_upload.url,
        // 默认参数
        params: {
          catalog: 'content'
        },
        // 加载中
        isLoading: false
      }
    },
    // 组件
    components: {},
    // 初始化数据
    mounted() {
      this.$nextTick(() => {
        if(this.actionUrl){
          this.action = this.actionUrl
        }
      })
    },
    // 方法
    methods: {
      handleAvatarSuccess(res, file) {
        if(file.status === "success"){
          const res = file.response;
          if(res.bSuccess){
            this.isLoading = false
            const url = res.data.imageUrl
            const id = res.data.id
            if(this.isRadio){
              this.$emit('input', url)
              this.$emit("update:baseId",id);
              if(this.callBack){
                this.callBack(url)
              }
            }else {
              this.imgList.push({
                url: url,
                baseId: id
              })
            }
          }
        }
        if(file.status == "fail"){
          this.$message.error('上传失败');
        }
      },
      beforeAvatarUpload(file) {
        const str = file.type.split('/')[1].toLowerCase()
        if (!str.match(/png|jpg|gif|webp|jpeg/)) {
          this.$message.error('上传头像图片只能是 jpeg | jpg | png格式!');
          return false
        }
        this.isLoading = true
        return true;
      }
    },
    // 计算属性
    computed: {},
    // 监听数据变化
    watch: {}
  }
</script>
