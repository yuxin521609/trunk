<template>
  <div class="changePassword">
    <div class="changeFrame">
      <div class="changeBox">找回密码</div>
      <el-form
        style="width:330px;margin-top:20px;"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="手机号:" prop="phoneNum">
          <el-input
            size="mini"
            maxlength="11"
            @blur="verifyCell"
            placeholder="请输入常用手机号"
            v-model="ruleForm.phoneNum"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="checkCode">
          <el-input
            size="mini"
            maxlength="6"
            style="width:110px;"
            placeholder="请输入验证码"
            v-model="ruleForm.checkCode"
          ></el-input>
          <el-button
            type="primary"
            @click="verifyCode"
            style="padding: 5px 9px; margin-left:5px;"
            :disabled="forbidSend"
          >发送验证码</el-button>
        </el-form-item>
        <el-form-item label="新密码:" prop="password">
          <el-input size="mini" placeholder="请设置不少于8位数登录密码" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="验证新密码:" prop="checkPass">
          <el-input size="mini" placeholder="请再次输入登陆密码" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-button
          type="primary"
          @click="changePassword('ruleForm')"
          style="padding: 5px 85px; margin-left:115px;"
        >保存</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        phoneNum: "",
        checkCode: "",
        password: "",
        checkPass: "",
      },
      rules: {
        phoneNum: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^1\d{10}$/,
            message: " 手机号不合法",
            trigger: ["blur", "change"],
          },
        ],
        checkCode: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["blur"],
          },
          {
            pattern: /^\d{6}$/,
            message: " 请输入正确验证码",
            trigger: ["blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请设置密码",
            trigger: ["blur"],
          },
          {
            pattern: /^\w{8,18}$/,
            message: " 请设置不少于8位数登录密码",
            trigger: ["blur"],
          },
        ],
        checkPass: [
          {
            required: true,
            message: "请设置密码",
            trigger: ["blur"],
          },
          {
            pattern: /^\w{8,18}$/,
            message: " 请设置不少于8位数登录密码",
            trigger: ["blur"],
          },
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.ruleForm.password !== this.ruleForm.checkPass) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: ["blur"],
          },
        ],
      },
      forbidSend: true,
      type3: 3,
    };
  },
  methods: {
    // 点击修改密码
    changePassword(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          // 验证通过 发送注册
          this.request(this.api.user.get_updatePwdAfterCheckCode, this.ruleForm)
            .then((data) => {
              setTimeout(() => {
                this.$alert("密码修改成功", "提示", {
                  confirmButtonText: "确定",
                })
                  .then(() => {
                    this.$router.push({ path: "/login/login_new" });
                  })
                  .catch(() => {});
              }, 400);
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 验证手机号是否正确--是否显示(发送验证码)
    verifyCell() {
      if (this.ruleForm.phoneNum.length == 11) {
        this.forbidSend = false;
      } else {
        this.forbidSend = true;
      }
    },
    // 发送验证码
    verifyCode() {
      let phoneNum = this.ruleForm.phoneNum;
      let type = this.type3;
      this.request(this.api.user.get_sendPersonCode, { phoneNum, type }).then(
        (res) => {
          this.$message.error("验证正确");
        }
      );
    },
  },
};
</script>

<style lang="less">
.changePassword {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/bg.png");
  position: relative;

  .changeFrame {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 380px;
    height: 450px;
    background-color: #ffffff;
    border-radius: 3%;
    .changeBox {
      font-size: 18px;
      font-weight: 600;
      text-indent: 155px;
      margin-top: 10px;
      .el-button {
        padding: 10px;
      }
    }
  }
}
</style>