<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :rules="rules"
      :model="filtersData"
      label-width="130px"
      size="small"
      ref="filtersForm"
      inline
    >
      <el-row>
        <div class="col-company">
          <el-col :span="24">
           <h5 class="titleH">成员信息</h5>
          </el-col>
         
          <el-col :span="12">
            <el-form-item prop="name" label="账号姓名：">
              <el-input
                class="input-w"
                placeholder="请输入内容"
                :disabled="showDisabled"
                v-model="filtersData.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phoneNum" label="手机号：">
              <el-input
                class="input-w"
                id="phoneId"
                placeholder="请输入内容"
                :disabled="showDisabled"
                v-model="filtersData.phoneNum"
                oninput = "value=value.replace(/[^\d]/g,'')" maxlength="11"
                @blur="phone11()"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <div class="flex-cen-start">
            <el-form-item prop="gender" label="性别：">
              <code-set v-model="filtersData.gender" :disabled="showDisabled" code="COM004"/>
            </el-form-item>
          </div> -->
          <el-col :span="24">
           <h5 class="titleH">岗位信息</h5>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="departId" label="所属部门：">
              <tree-dept
                v-model="filtersData.departId"
                val-type="id"
                :sel-type="1"
                :default-expand-all="true"
                :disabled="showDisabled"
              ></tree-dept>
            </el-form-item>
          </el-col>
           <div class="flex-cen-start">
            <el-form-item prop="leader" align="center" width="120px" label="是否部门负责人：">
              <el-radio v-model="filtersData.leader" :disabled="showDisabled" :label="false">否</el-radio>
              <el-radio v-model="filtersData.leader" :disabled="showDisabled" :label="true">是</el-radio>
            </el-form-item>
          </div>
          <el-col :span="12">
            <el-form-item prop="positionId" label="职位：">
              <el-select
                placeholder="请选择"
                class="input-w"
                :disabled="showDisabled"
                v-model="filtersData.positionId"
              >
                <el-option
                  v-for="item in positionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="jobNum" label="工号：">
              <el-input
                class="input-w"
                placeholder="请输入内容"
                :disabled="showDisabled"
                v-model="filtersData.jobNum"
              ></el-input>
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item prop="loginName" label="账号：">
              <el-input
                class="input-w"
                placeholder="请输入内容"
                :disabled="showDisabled"
                v-model="filtersData.loginName"
                onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="email" label="邮箱：">
              <el-input
                class="input-w"
                placeholder="请输入内容"
                :disabled="showDisabled"
                v-model="filtersData.email"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <div class="flex-cen-start">
            <el-form-item prop="used" align="center" label="启停状态：" width="80">
              <el-switch
                v-model="filtersData.used"
                active-color="#13ce66"
                :disabled="showDisabled"
                inactive-color="#9d9d9d"
              ></el-switch>
            </el-form-item>
          </div> -->
          <!-- <div class="flex-cen-start">
            <el-form-item align="center" label="图片上传：" width="80">
          <el-upload
            class="avatar-uploader"
            :action="action()"
            :headers="tokenHeaders"
            :disabled="showDisabled"
            :data="uploadData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="imgUploadError"
          >
            <img v-if="filtersData.avatar" :src="filtersData.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          </el-form-item>
          </div> -->

        <!-- </div> -->

        <!-- <div class="col-company"> -->
          <!-- <el-col :span="12" v-if="this._type == 'add'">
            <el-form-item prop="password" label="账号密码：">
              <el-input
                autocomplete="new-password"
                class="input-w"
                placeholder="请输入内容"
                :disabled="showDisabled"
                v-model="filtersData.password"
                :type="!visible?'text':'password'"
              >
                <i
                  slot="suffix"
                  @click="visible=!visible"
                  style="cursor:pointer;"
                  class="el-input__icon"
                  :class="visible?'el-icon-view':'el-icon-more-outline'"
                ></i>
              </el-input>
            </el-form-item>
          </el-col> -->



        </div>
      </el-row>
    </el-form>

    <div class="item-footer">
      <el-button
        v-if="this._type == 'add' || this._type == 'edit'"
        size="small"
        @click="submitForm('filtersForm')"
        type="primary"
      >确定</el-button>
      <el-button @click="routerback('filtersForm')" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
import treeDept from "@/components/treeDept";
import codeSet from "@/components/codeSet";
import { getToken } from "@/utils/auth";
import { validatePass, validateUserName, validateNumber } from "@/utils/validate";
var token = getToken();

/**
 * 规格详情页面 新增 修改 查看 同一页面
 */
export default {
  // 注册组件
  components: {
    treeDept,
    codeSet
  },
  data() {
    return {
      visible: true,
      filtersData: {
        type: 0,
        name: "",
        phoneNum:"",
        departId:'',
        positionId: "",
        jobNum: "",
        loginName: null,
        email:"",
        // code: "",
        // avatar: "",
        // used: false,
        // password: "admin"
        leader: false,
      },
      positionOptions: [],
          // { required: true, message: "员工账号必录", trigger: "blur" }

      rules: {
        name: [{ required: true, message: "姓名必录", trigger: "blur" }],
        phoneNum: [{ required: true, message: "手机号必录", trigger: "blur"}],
        departId:[{ required: true, message: "所属部门必录", trigger: "blur" }]
        // loginName: [
        //    { required: true, message: "请输入账号", trigger: "blur" },
        //     { validator: validateUserName, trigger: "blur" }
        // ],
        // password: [
        //   { required: true, message: "密码必录", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" }
        // ],
        // gender: [{ required: true, message: "性别必录", trigger: "blur" }],
        // jobNum: [
        //   { required: true,validator: validateNumber, trigger: "blur"  }
        // ],
        // used: [{ required: true, message: "启停状态", trigger: "blur" }]
       
      },
      editDisabled: false,
      showDisabled: false,
      _type: "",
      _id: "",
      tokenHeaders: { accessToken: token },
      uploadData: { catalog: "content" },



    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
    this.getPositionList();
  },
  methods: {
      /*
    *  手机号检验信息
    * */
        phone11() {
          let phone = document.getElementById('phoneId').value;
            if(!(/^1[3456789]\d{9}$/.test(phone))){
                // alert("手机号码有误，请重填");
                this.$alert('手机号码格式有误，请确认后重新填写', {
                    confirmButtonText: '确定',
                  })
                return false;
            }
        },
    action() {
      return this.api.FN_ALLPATH(this.api.content.picture_upload);
    },
    beforeAvatarUpload(file) {
      //文件上传之前调用做一些拦截限制
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handleAvatarSuccess(res, file) {
      //图片上传成功
      this.filtersData.avatar = res.data.imageUrl;
    },
    imgUploadError(err, file, fileList) {
      //图片上传失败调用
      this.$message.error("上传图片失败!");
    },
    //获取上页面参数
    getQueryparams() {
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
    async getData() {
      let filtersData = await this.request(this.api.user.userCompany_get, { id: this._id });
      let positionOptions = await this.request(this.api.user.position_list, {used: true});
      let position = positionOptions.data.find(item => item.id == filtersData.positionId);
      if(!position){
        filtersData.positionId = '';
      }
      this.filtersData = filtersData;

    },
    //获取职位
    getPositionList() {
      this.request(this.api.user.position_list, {used: true}).then(data => {
        this.positionOptions = data.data;
      });
    },
    //新增
    submitForm(formName) {
      console.log(JSON.stringify(this.filtersData));
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.filtersData.id == null) {
            this.request(
              this.api.user.userCompany_create,
              this.filtersData
            ).then(data => {
              this.routerback();
            });
          } else {
            this.request(
              this.api.user.userCompany_update,
              this.filtersData
            ).then(data => {
              this.routerback();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //后退
    routerback() {
      this.$router.go(-1);
    },
    addContent() {
      this.filtersData.userCompanyProfiles.push({
        code: "",
        name: ""
      });
    },
    //删除新增内容
    removeDomain(item) {
      let index = this.filtersData.userCompanyProfiles.indexOf(item);
      if (index !== -1) {
        this.filtersData.userCompanyProfiles.splice(index, 1);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.titleH {
  color: #222;
  margin: 10px 0 10px 30px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #f2f2f2;

}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-row{
  display: flex;
}
.col-company{
      display: flex;
      flex-wrap: wrap;
    // flex-direction: column;
    // width: 45%;
}
</style>
