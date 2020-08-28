<template>
  <div class="changePassword">
    <div class="changeFrame">
      <div class="changeBox">
        注册账号
        <div style="font-size: 10px;float: right;">
          已有账号
          <el-button @click="goLogin" style="padding: 3px 2px;">登录</el-button>
        </div>
      </div>
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
            placeholder="请输入常用手机号"
            maxlength="11"
            v-model="ruleForm.phoneNum"
            @blur="verifyCell"
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
          <!-- 发送验证码 -->
          <el-button
            @click="verifyCode"
            type="primary"
            :disabled="forbidSend"
            style="padding: 5px 9px; margin-left:5px;"
          >发送验证码</el-button>
        </el-form-item>
        <el-form-item label="设置密码:" prop="password">
          <el-input size="mini" placeholder="请设置不少于8位数登录密码" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="验证密码:" prop="checkPass">
          <el-input size="mini" placeholder="请再次输入登陆密码" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <!-- 用户信息 -->
        <el-form-item label="用户信息">
          <div style="width:215px; height:1px;background:red; margin-top: 19px; "></div>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input size="mini" placeholder="请输入您的姓名" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-button
          @click="clickRegister('ruleForm')"
          type="primary"
          style="padding: 7px 90px; margin-left:115px;"
        >注册</el-button>
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
        nema: "",
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
        name: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入姓名"));
              } else if (/(^\s)|(\s$)/.test(value)) {
                callback(new Error("姓名前后不能含有空格"));
              } else if (
                !/^[a-zA-Z\u4e00-\u9fa5]+(\s+[a-zA-Z\u4e00-\u9fa5]+)*$/g.test(
                  value
                )
              ) {
                callback(new Error("姓名只能输入英文字母或者汉字"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      forbidSend: true,
      type1: 1,
    };
  },
  methods: {
    //  点击注册
    clickRegister(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          // 验证通过 发送注册
          this.request(this.api.user.get_register, this.ruleForm)
            .then((data) => {
              setTimeout(() => {
                this.$alert("您已注册成功", "提示", {
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
    // 验证手机号 是否注册
    verifyCode() {
      let phoneNum = this.ruleForm.phoneNum;
      this.request(this.api.user.get_loginPhonecheck, { phoneNum })
        .then((res) => {
          // this.$message.error("验证正确");
          this.sendVerificationCode();
        })
        .catch((res) => {
          this.$message.error("手机号已经注册");
        });
    },
    // 验证手机号是否正确--是否显示(发送验证码按钮)
    verifyCell() {
      if (this.ruleForm.phoneNum.length == 11) {
        this.forbidSend = false;
      } else {
        this.forbidSend = true;
      }
    },
    // 发送验证码
    sendVerificationCode() {
      let phoneNum = this.ruleForm.phoneNum;
      let type = this.type1;
      this.request(this.api.user.get_sendPersonCode, { phoneNum, type }).then(
        (res) => {
          this.$message.error("验证正确");
        }
      );
    },
    // 返回登录页
    goLogin() {
      this.$router.push({ path: "/login/login_new" });
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
    height: 480px;
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