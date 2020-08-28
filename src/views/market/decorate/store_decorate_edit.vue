<template>
  <div class="store-decorate">
   <div class="box">
      <!-- 新增门店装修 -->
      <el-form
         :model="store_decorate_obj"
         label-width="120px"
         class="form-label"
         :rules="rules"
         ref="formName">
         <div>当前门店：{{ store_decorate_obj.name }}</div>
         <el-tabs class="el-tabs" v-model="activeName" type="card">
            <!-- 1.门店故事 -->
            <el-tab-pane label="门店故事" name="first">
              <div v-if="activeName == 'first'">
                <el-form-item label="标题：" prop="storeStoryTitle">
                  <el-input maxlength="22" v-model="store_decorate_obj.storeStoryTitle" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="封面图：" prop="storeStoryCover">
                  <el-upload-img
                    :imgApi="imgApi"
                    v-model="store_decorate_obj.storeStoryCover"
                    :EchoDisplayImages="store_decorate_obj.storeStoryCover"
                    CatalogName="fitment"
                    describe="图片大小不超过1M"
                    :LssUpimgLimit="1"
                  ></el-upload-img>
                </el-form-item>
                <el-form-item label="门店故事：" prop="storeStoryContent">
                  <el-upload-img
                    :imgApi="imgApi"
                    v-model="store_decorate_obj.storeStoryContent"
                    :EchoDisplayImages="store_decorate_obj.storeStoryContent"
                    CatalogName="fitment"
                    describe="最多允许上传20张图片，单张图片大小不超过1M"
                    :LssUpimgLimit="20"
                  ></el-upload-img>
                </el-form-item>
              </div>
            </el-tab-pane>
            <!-- 1.客户故事 -->
            <el-tab-pane label="客户故事" name="second">
              <div v-if="activeName == 'second'">
                <el-form-item label="标题：" prop="customerStoryTitle">
                  <el-input maxlength="22" v-model="store_decorate_obj.customerStoryTitle" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="封面图：" prop="customerStoryCover">
                  <el-upload-img
                    :imgApi="imgApi"
                    v-model="store_decorate_obj.customerStoryCover"
                    :EchoDisplayImages="store_decorate_obj.customerStoryCover"
                    CatalogName="fitment"
                    describe="图片大小不超过1M"
                    :LssUpimgLimit="1"
                  ></el-upload-img>
                </el-form-item>
                <el-form-item label="客户故事：" prop="customerStoryContent">
                  <el-upload-img
                    :imgApi="imgApi"
                    v-model="store_decorate_obj.customerStoryContent"
                    :EchoDisplayImages="store_decorate_obj.customerStoryContent"
                    CatalogName="fitment"
                    describe="最多允许上传20张图片，单张图片大小不超过1M"
                    :LssUpimgLimit="20"
                  ></el-upload-img>
                </el-form-item>
              </div>
            </el-tab-pane>
         </el-tabs>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
      <!-- 门店装修预览 -->
      <div class="exhibition" v-show="activeName == 'first'">
        <div v-for="(item, index) in store_decorate_obj.storeStoryContent" :key="index"><img :src="item.url" alt=""></div>
      </div>
      <div class="exhibition" v-show="activeName == 'second'">
        <div v-for="(item, index) in store_decorate_obj.customerStoryContent" :key="index"><img :src="item.url" alt=""></div>
      </div>
   </div>
  </div>
</template>
<script>

import ElUploadImg from "@/components/uploadImg/el_upload_img_multi";
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      // 门店装修id
      id:null,
      id2:null,
      // 当前栏目所在位置
      activeName:'first',
      // 上传图片路径
      imgApi:this.api.market.picture_upload,
      // 门店装修提交数据
      store_decorate_obj: {
        // 门店id
        storeId:this.$route.query.storeId,
        // 门店code
        storeCode:this.$route.query.storeCode,
        // 门店名称
        name:this.$route.query.name,
        // 门店故事标题
        storeStoryTitle:'',
        // 门店故事封面
        storeStoryCover:[], 
        // 门店故事上传图片列表
        storeStoryContent:[],
        // 客户故事标题
        customerStoryTitle:'',
        // 客户故事封面
        customerStoryCover:[], 
        // 客户故事上传图片列表
        customerStoryContent:[]
      },
      // 门店故事描述
      rules:{
        // 门店故事标题校验
        storeStoryTitle: [{ required: true, message: '请输入门店故事标题！', trigger: 'blur' }],
        // 门店故事封面校验
        storeStoryCover: [{ type: 'array', required: true, message: '至少上传一张门店故事封面图片！', trigger: 'blur' }],
        // 门店故事上传图片列表校验
        storeStoryContent: [{ type: 'array', required: true, message: '至少上传一张门店故事内容图片！', trigger: 'blur' }],
        // 客户故事标题校验
        customerStoryTitle: [{ required: true, message: '请输入客户故事标题！', trigger: 'blur' }],
        // 客户故事封面校验
        customerStoryCover: [{ type: 'array', required: true, message: '至少上传一张客户故事封面图片！', trigger: 'blur' }],
        // 客户故事上传图片列表校验
        customerStoryContent: [{ type: 'array', required: true, message: '至少上传一张客户故事内容图片！', trigger: 'blur' }],
      }
    };
  },
  created() {
  },
  mounted() {
    // 获取门店故事
    this.storeFitment_getByStoreIdAndType(0);
    // 获取客户故事
    this.storeFitment_getByStoreIdAndType(1);
  },
  computed: {
    // 门店故事封面
    storeStoryCover() {
      return this.store_decorate_obj.storeStoryCover;
    },
    // 门店故事上传图片列表
    storeStoryContent() {
      return this.store_decorate_obj.storeStoryContent;
    },
    // 客户故事封面
    customerStoryCover() {
      return this.store_decorate_obj.customerStoryCover;
    },
    // 客户故事上传图片列表
    customerStoryContent() {
      return this.store_decorate_obj.customerStoryContent;
    },
  },
  watch: {
    /**
     * 监听门店故事封面
     */
    storeStoryCover(value) {
      if(value && value.length > 0) {
        this.$refs.formName.clearValidate('storeStoryCover');
      }else{
        this.$refs.formName.validateField('storeStoryCover');
      }
    },
    /**
     * 监听门店故事上传图片列表
     */
    storeStoryContent(value) {
      if(value && value.length > 0) {
        this.$refs.formName.clearValidate('storeStoryContent');
      }else{
        this.$refs.formName.validateField('storeStoryContent');
      }
    },
    /**
     * 监听客户故事封面
     */
    customerStoryCover(value) {
      if(value && value.length > 0) {
        this.$refs.formName.clearValidate('customerStoryCover');
      }else{
        this.$refs.formName.validateField('customerStoryCover');
      }
    },
    /**
     * 监听客户故事上传图片列表
     */
    customerStoryContent(value) {
      if(value && value.length > 0) {
        this.$refs.formName.clearValidate('customerStoryContent');
      }else{
        this.$refs.formName.validateField('customerStoryContent');
      }
    },
  },
  methods: {
    /**
     * 获取门店信息
     */
    storeFitment_getByStoreIdAndType(type) {
      this.request(
          this.api.market.storeFitment_getByStoreIdAndType,
          {
            storeId:this.store_decorate_obj.storeId,
            type
          }     
        ).then(res => {
          if(res.storeFitment) {
            if(type == 0) {
              this.id = res.storeFitment.id;
              this.store_decorate_obj.storeStoryTitle = res.storeFitment.title;
              this.store_decorate_obj.storeStoryCover.push({url:res.storeFitment.cover});
              res.storeFitmentPictureList.forEach((item, index) => {
                this.store_decorate_obj.storeStoryContent.push({ url:item.picture });
              });
            }else{
              this.id2 = res.storeFitment.id;
              this.store_decorate_obj.customerStoryTitle = res.storeFitment.title;
              this.store_decorate_obj.customerStoryCover.push({url:res.storeFitment.cover});
              res.storeFitmentPictureList.forEach((item, index) => {
                this.store_decorate_obj.customerStoryContent.push({ url:item.picture });
              });
            }
          }
        });
    },
     /**
     * 新建门店装修
     */
    save() {
      let that = this;
    
      this.$refs.formName.validate((valid) => {
        if(valid) {
          let data = {
            storeFitment: {},
            storeFitmentPictureList: []
          };
          let type = this.activeName == 'first' ? 0 : 1;

          if(type == 0) {
            data.storeFitment.id = this.id; 
            data.storeFitment.cover = this.store_decorate_obj.storeStoryCover[0].url; 
            data.storeFitment.storeId = this.store_decorate_obj.storeId;
            data.storeFitment.title = this.store_decorate_obj.storeStoryTitle;
            data.storeFitment.type = type;
            this.store_decorate_obj.storeStoryContent.forEach((item, index) => {
              data.storeFitmentPictureList.push({
                "picture":item.url,
                "sort":index,
                "storeId":this.store_decorate_obj.storeId,
                "type":type
              })
            });
          }else{
            data.storeFitment.id = this.id2; 
            data.storeFitment.cover = this.store_decorate_obj.customerStoryCover[0].url; 
            data.storeFitment.storeId = this.store_decorate_obj.storeId;
            data.storeFitment.title = this.store_decorate_obj.customerStoryTitle;
            data.storeFitment.type = type;
            this.store_decorate_obj.customerStoryContent.forEach((item, index) => {
              data.storeFitmentPictureList.push({
                "picture":item.url,
                "sort":index,
                "storeId":this.store_decorate_obj.storeId,
                "type":type
              })
            });
          };
          // console.log(data)
          // return;
          this.request(
            this.api.market.storeFitment_save,
            data    
          ).then(res => {
            this.warn('保存成功!');
            this.href('market/decorate/store_decorate_list');
          });
        }else{
           this.warn('门店装修信息未填写完整，请填写完整后重试！','warning');
          return;
        };
      });
    },
    /**
     * 提示
     * @param { String } message 提示文案
     * @param { String } type 提示类型
     */
    warn(message, type) {
      this.$message({
        message: message,
        type: type || "success"
      });
    },
    /**
     * 跳转
     * @param { String } routeName 路由跳转名字
     */
    href(routeName) {
      this.$router.push({
        path: `/${routeName}`
      });
    },
    /**
     * 点击页数
     * @param { Number } pageIndex 当前页
     */
    handleCurrentChange(pageIndex) {
      this.filtersData.pageIndex = pageIndex;
      this.user_list();
    },
    /**
     * 改变每页展示条目
     * @param { Number } pageSize 每页展示条目
     */
    handleSizeChange(pageSize) {
      this.filtersData.pageSize = pageSize;
      this.user_list();
    }
  },
  components: {
    ElUploadImg,
    draggable
  }
};
</script>
<style  lang="less" scoped>
  .store-decorate{
     background: #fff;
     padding:  0 20px 20px 20px;
     margin: 8px;
  }
  .form-label{
     width: 50%;
  }
  .el-tabs{
     margin-top: 20px;
  }
  .exhibition{
     width: 450px;
     height: 700px;
     background: #f5f5f5;
     margin-right: 15%;
     box-shadow: #aaa 2px 10px 10px;
     overflow-y: scroll;
  }
  .exhibition img{
    width: 100%;
  }
  .box{
     display: flex;
     justify-content:space-between;
  }
  .form-label {
    margin-top: 20px;
    .el-input,
    .el-select {
      width: 370px;
    }
    .el-checkbox-group {
      width: 650px;
    }
    .el-checkbox-group /deep/ .el-checkbox{
      width: 100px;
    }
    .el-input-short {
      width: 180px;
    }
    .video-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      span {
        font-size: 35px;
        color: #d9d9d9;
      }
    }
    .video-upload-p {
      color: #666;
      font-size: 12px;
    }
    .video-upload:hover {
      border: 1px dashed #409eff;
    }
  }
</style>

