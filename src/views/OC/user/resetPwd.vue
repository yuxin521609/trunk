<template>
  <el-dialog
    :title="itemParam.title"
    :visible.sync="classDialogVisible"
    :close-on-click-modal="false"
    class="alarmPopup"
    width="500px"
  >
    <el-form
      :model="filtersData"
      :rules="rules"
      label-width="150px"
      size="small"
      ref="filtersForm"
      inline
    >
      <img src="@/assets/img/repwd.png" width="36" height="36">您将对该账户登录密码进行重置，重置后需要使用新密码重新登录。
      <el-form-item prop="password" label="重置密码：">
        <el-input placeholder="请输入内容" class="input-w" v-model="filtersData.password"></el-input>
      </el-form-item>
    </el-form>
    <div class="item-right">
      <el-button size="small" @click="closeDialog('filtersForm')">取消</el-button>
      <el-button size="small" @click="submitForm('filtersForm')" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validatePass } from "@/utils/validate";
export default {
  name: "reset_password",
  props: {
    itemParam: {
      type: Object
    }
  },
  data() {
    return {
      classDialogVisible: false,
      filtersData: {
        id: String,
        password: String
      },
      //验证
      rules: {
        password: [
          { required: true, message: "密码必录", trigger: "blur" },
          { validator: validatePass, trigger: "blur", skipAdmin: true }
        ]
      }
    };
  },
  methods: {
    //初始化
    setPwdPopupInit() {
      (this.filtersData = {
        id: this.itemParam.id,
        password: ""
      }),
        (this.classDialogVisible = true);
    },
    //关闭
    closeDialog(formName) {
      this.classDialogVisible = false;
      this.$refs[formName].resetFields(); //重置选项
    },
    //保存表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.request(this.api.user.userCompany_resetPwd, {
            id: this.filtersData.id,
            password: this.filtersData.password
          }).then(data => {
            this.closeDialog(formName);
            this.$emit("refreshItem", "刷新");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改表单
    editForm(formName) {
      this.submitForm(formName);
    }
  }
};
</script>
