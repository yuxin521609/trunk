<!--
 * @Description:品牌商详情
 * @Author: elephant
 * @Date: 2019-08-13 13:58:02
 * @LastEditTime: 2019-11-08 09:32:15
 * @LastEditors: your name
 -->
<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="120px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-row>
        <el-tabs v-model="activeName" class="basic-wrap">
          <el-tab-pane label="基本信息" name="basic">
            <el-col :span="24">
              <el-form-item prop="name" label="品牌商名称：">
                <el-input
                  class="input-w-2"
                  placeholder="请输入内容"
                  :disabled="editDisabled"
                  v-model="filtersData.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="contact" label="联系人：">
                <el-input
                  class="input-w-2"
                  placeholder="请输入内容"
                  :disabled="showDisabled"
                  v-model="filtersData.contact"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="telephone" label="联系电话：">
                <el-input
                  class="input-w-2"
                  placeholder="请输入内容"
                  :disabled="showDisabled"
                  v-model="filtersData.telephone"
                ></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="24">
                <el-form-item prop="postalCode" label="邮编：">
                  <el-input
                    class="input-w-2"
                    :disabled="showDisabled"
                    placeholder="请输入内容"
                    v-model="filtersData.postalCode"
                  ></el-input>
                </el-form-item>
              </el-col>
            <el-col :span="24">
              <el-form-item prop="address" label="品牌商地址：">
                <el-input
                  class="input-w-2"
                  type="textarea"
                  :disabled="showDisabled"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="filtersData.address"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="logo" label="品牌商图标：">
                <el-upload
                  :disabled="showDisabled"
                  :action="action()"
                  list-type="picture-card"
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
                >
                  <i class="el-icon-plus" :disabled="showDisabled"></i>
                </el-upload>
                <p class="img-tips">图片大小不能超过1M</p>
              </el-form-item>
            </el-col>
            <div class="flex-cen-start">
              <el-form-item prop="valid" label="合作状态：">
                <el-radio
                  v-model="filtersData.cooperation"
                  :disabled="showDisabled"
                  :label="true"
                >合作中</el-radio>
                <el-radio
                  v-model="filtersData.cooperation"
                  :disabled="showDisabled"
                  :label="false"
                >未合作</el-radio>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="品牌商资质" name="brand_qcation">
            <el-col :span="24">
              <el-form-item prop label="资质图片：">
                <el-upload
                  :action="action()"
                  :disabled="showDisabled"
                  list-type="picture-card"
                  accept="image/*"
                  :limit="10"
                  :headers="tokenHeaders"
                  :file-list="brandProductImgs"
                  :multiple="arrMultiple"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="arrHandleRemove"
                  :on-success="arrHandleAvatarSuccess"
                  :data="uploadData"
                  :before-upload="arrBeforeAvatarUpload"
                  :on-exceed="arrHandleExceed"
                  :on-error="arrImgUploadError"
                >
                  <i class="el-icon-plus" :disabled="showDisabled"></i>
                </el-upload>
                <p class="img-tips">上传工商信息、品牌商信息等，单张图片大小不能超过2M</p>
              </el-form-item>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="合作协议" name="cation_agrt">
            <el-col :span="24">
              <el-form-item prop label="合作协议：">
                <el-upload
                  :action="action()"
                  :disabled="showDisabled"
                  list-type="picture-card"
                  accept="image/*"
                  :limit="10"
                  :headers="tokenHeaders"
                  :file-list="cationProductImgs"
                  :multiple="arrMultiple"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="arrHandleRemove"
                  :on-success="arrTwoHandleAvatarSuccess"
                  :data="uploadData"
                  :before-upload="arrBeforeAvatarUpload"
                  :on-exceed="arrHandleExceed"
                  :on-error="arrImgUploadError"
                >
                  <i class="el-icon-plus" :disabled="showDisabled"></i>
                </el-upload>
                <p class="img-tips">上传合作协议、授权信息等，单张图片大小不能超过2M</p>
              </el-form-item>
            </el-col>
          </el-tab-pane>
        </el-tabs>
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
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
/**
 * 规格详情页面 新增 修改 查看 同一页面
 */
import { getToken } from "@/utils/auth";
let token = getToken(); /// localStorage.getItem('token') // 要保证取到
export default {
  data() {
    return {
      filtersData: {
        contact: "",
        name: "",
        logo: "",
        telephone:'',
        postalCode:'',
        address:'',
        cooperation: true,
        valid: true,
        brandOwnerProfiles: [] //图片子集brandOwnerProfiles
      },
      //标签切换默认
      activeName: "basic",
      rules: {
        //规则验证
        name: [
          { required: true, message: "请输入品牌商名称", trigger: "blur" },
          { max: 12, message: "最长12个汉字", trigger: "blur" }
        ],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ]
      },
      editDisabled: false,
      showDisabled: false,
      _type: "",
      _id: "",
      //单图上传
      dialogImageUrl: "",
      dialogVisible: false,
      productImgs: [],
      isMultiple: false,
      imgLimit: 6,
      tokenHeaders: { accessToken: token },
      uploadData: { catalog: "product" },
      //多图上传
      brandProductImgs: [], //多图展示列表 品牌资质
      cationProductImgs: [], //多图展示列表 协议 合同
      arrMultiple: true //是否支持多选文件
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
  },
  methods: {
    action() {
      return this.api.FN_ALLPATH(this.api.content.picture_upload);
    },
    handleRemove(file, fileList) {
      //移除图片
      console.log(file, fileList);
    },

    handlePictureCardPreview(file) {
      //预览图片时调用
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      //文件上传之前调用做一些拦截限制
      const isJPG = true;
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      }
      return isJPG && isLt1M;
    },
    arrBeforeAvatarUpload(file) {
      //多图文件上传之前调用做一些拦截限制
      const isJPG = true;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      //图片上传成功
      console.log(res.data.imageUrl);
      this.filtersData.logo = res.data.imageUrl;
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleExceed(files, fileList) {
      //图片上传超过数量限制
      this.$message.error("logo只能上传一张!");
      console.log(file, fileList);
    },
    imgUploadError(err, file, fileList) {
      //图片上传失败调用
      console.log(err);
      this.$message.error("上传图片失败!");
    },
    //多图删除
    arrHandleRemove(file, fileList) {
      let fileImgUrl = null;
      if (file.response) {
        //还未SAVE的图片
        fileImgUrl = file.response.data.imageUrl;
      } else {
        //从GET获取的已上传的图片
        fileImgUrl = file.url;
      }
      let imgArr = this.filtersData.brandOwnerProfiles;
      let index = imgArr.findIndex(item => item.path == fileImgUrl);
      if (imgArr[index].id != undefined) {
        this.request(
          this.api.product.enterpriseArchivalInformation_logicDelete,
          { id: imgArr[index].id }
        );
      }
      imgArr.splice(index, 1);
    },
    ////图片上传成功 资质brandOwnerProfiles
    arrHandleAvatarSuccess(res, file) {
      //图片上传成功
      //console.log(res.data.imageUrl);
      let obj = new Object();
      obj.enterpriseType = 3; //1品牌 2 供应商 3//品牌商
      obj.type = 1; //资质 1  协议2
      obj.path = res.data.imageUrl;
      obj.enterpriseName = "";
      this.filtersData.brandOwnerProfiles.push(obj);
      // console.log( this.filtersData.brandOwnerProfiles);
    }, //协议
    arrTwoHandleAvatarSuccess(res, file) {
      // console.log(res.data.imageUrl);
      let obj = new Object();
      obj.enterpriseType = 3; //1品牌 2 供应商 3//品牌商
      obj.type = 2; //资质 1  协议2
      obj.path = res.data.imageUrl;
      obj.enterpriseName = "";
      this.filtersData.brandOwnerProfiles.push(obj);
      //console.log( this.filtersData.brandOwnerProfiles);
    },
    arrHandleExceed(files, fileList) {
      //图片上传超过数量限制
      this.$message.error("只能上传10张!");
      console.log(file, fileList);
    },
    arrImgUploadError(err, file, fileList) {
      //图片上传失败调用
      console.log(err);
      this.$message.error("上传图片失败!");
    },
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
      this.request(this.api.product.productBrandOwner_get, { id: this._id }).then(
        data => {
          let _data = data;
          let _Profiles = _data.brandOwnerProfiles;
          this.filtersData = _data; //brandOwnerProfiles
        if(!!_data.logo){
          this.productImgs = [{ url: _data.logo }];
        }
          //type 资质 1  协议2
          for (let i = 0; i < _Profiles.length; i++) {
            let obj = new Object();
            if (_Profiles[i].type == 1) {
              obj.url = _Profiles[i].path;
              this.brandProductImgs.push(obj);
            } else {
              obj.url = _Profiles[i].path;
              this.cationProductImgs.push(obj);
            }
          }
          //资质
          // brandProductImgs:[],//多图展示列表 品牌资质
          //合同协议
          //cationProductImgs:[],//多图展示列表 协议 合同
        }
      );
    },
    //新增
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _data = this.filtersData;
          let _name = _data.name;
          _data.brandOwnerProfiles.forEach((item, index) => {
            item.enterpriseName = _name;
          });
          this.request(
            this.api.product.productBrandOwner_save,
            this.filtersData
          ).then(data => {
            this.$message.success("保存成功");
            setTimeout(() => {
              this.routerback();
            }, 1500);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //后退
    routerback() {
      this.$router.go(-1);
    }
  }
};
</script>