<template>
  <div class="loginPage">
    <div class="loginBox">
      <div class="selectLogin">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormBox"
          label-width="0px"
          class="demo-ruleForm"
        >
          <el-tabs v-model="activeName" @tab-click="handleClick('ruleFormBox')" style="width:167px">
            <!-- 密码登录 -->
            <el-tab-pane label="密码登录" name="first">
              <el-form-item prop="phone1">
                <el-input v-model="ruleForm.phone1" maxlength="11" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item prop="pwd">
                <el-input v-model="ruleForm.pwd" placeholder="请输入密码"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="text" @click="forgetPassword">忘记密码?</el-button>
                <el-button type="primary" @click="clickLogin('ruleForm')">点击登录</el-button>
              </el-form-item>
            </el-tab-pane>
            <!-- 验证码登录 -->
            <el-tab-pane label="验证码登录" name="second">
              <el-form-item prop="phone1">
                <el-input
                  v-model="ruleForm.phone1"
                  maxlength="11"
                  placeholder="请输入手机号"
                  @blur="verifyCell"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="ruleForm.code"
                  maxlength="6"
                  placeholder="请输入验证码"
                  style="width:100px"
                ></el-input>
                <el-button
                  type="text"
                  @click="getCode('ruleFormBox')"
                  style=" margin-top:0px;"
                  :disabled="forbidSend"
                >获取验证码</el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  style=" margin: 11px 0 0 10px;"
                  @click="codeClickLogin('ruleForm')"
                >点击登录</el-button>
              </el-form-item>
            </el-tab-pane>
            <!-- 注册 -->
            <el-button type="text">还没有账号?</el-button>
            <el-button plain @click="registerLogin" type="primary">立即注册</el-button>
          </el-tabs>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { setToken } from "../../utils/auth";
import * as userTypes from "@/types/userConfig";
import * as codeTypes from "@/types/codeset";
import { mapMutations, mapActions } from "vuex";
import { isvalidPhone } from "@/utils/validate";
import SelectOrganization from "@/components/Modal/SelectOrganization.vue";
export default {
  data() {
    return {
      ruleForm: {
        phone1: "",
        pwd: "",
        code: "",
      },
      type2: 2,
      tenantId: "",
      activeName: "first",
      forbidSend: true,
      rules: {
        phone1: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur"],
          },
          // {
          //   pattern: /^1\d{10}$/,
          //   message: " 手机号不合法",
          //   trigger: ["blur", "change"],
          // },
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^\d{6}$/,
            message: " 请输入正确验证码",
            trigger: ["blur", "change"],
          },
        ],
        pwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^\w{6,18}$/,
            message: " 请输入不少于6位数登录密码",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  // 重置清空校验Input
  watch: {
    activeName(value) {
      this.$refs.ruleFormBox.resetFields();
    },
  },
  methods: {
    // 立即注册
    registerLogin() {
      this.$router.push({ path: "/login/register" });
    },
    // 忘记密码
    forgetPassword() {
      this.$router.push({ path: "/login/find" });
    },
    // 验证手机号是否正确--是否显示(发送验证码按钮)
    verifyCell() {
      if (this.ruleForm.phone1.length == 11) {
        this.forbidSend = false;
      } else {
        this.forbidSend = true;
      }
    },
    // 获取验证码
    // getCode(ruleForm) {
    //   this.request(this.api.user.login_sendCode, {
    //     phone1: this.ruleForm.phone1,
    //     type: this.type2,
    //   });
    // },
    // 获取验证码
    getCode(ruleFormBox) {
      console.log(ruleFormBox);
      
      this.$refs[ruleFormBox].validateField("phone1", (valid) => {
        console.log(ruleFormBox);
        console.log(this.ruleForm);
        console.log(valid);
        if (valid) {
          alert("submit!");
          this.request(this.api.user.login_sendCode, {
            phone1: this.ruleForm.phone1,
            type: this.type2,
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 储存Token
    ...mapMutations({
      FN_SET_TOKEN: userTypes.FN_SET_TOKEN,
    }),
    ...mapActions({
      FN_CODESET_LOAD: codeTypes.FN_LOAD_DATA,
    }),
    // 清空校验过的input框
    handleClick(ruleForm) {
      // this.$refs[ruleForm].resetFields();
    },
    // 获取手机号ID
    verification() {
      this.request(this.api.user.userCompany_loginCheckTenantData, {
        phone1: this.ruleForm.phone1,
      }).then((s) => {
        this.tenantId = s[0].id;
        console.log(this.tenantId);
      });
    },
    // 验证码点击登录
    codeClickLogin(ruleForm) {
      this.$refs.ruleFormBox.validate((valid) => {
        if (valid) {
          alert("submit!");
          // 验证手机号，获取ID
          this.request(this.api.user.userCompany_loginCheckTenantData, {
            phone1: this.ruleForm.phone1,
          }).then((s) => {
            this.tenantId = s[0].id;
            console.log(this.tenantId);
            // 发送登录数据
            this.request(this.api.user.login_loginByPhoneAndCode, {
              phone1: this.ruleForm.phone1,
              code: this.ruleForm.code,
              tenantId: this.tenantId,
            }).then((res) => {
              // 存储登陆人名称
              localStorage.setItem("userName", res.userInfo.userName);
              localStorage.setItem("tenantId", res.userInfo.tenantId);
              //存储登录Token
              this.FN_SET_TOKEN(res.token);
              //得到codeData数据
              this.FN_CODESET_LOAD();
              this.$router.push({ path: "/home" });
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 密码点击登录
    clickLogin() {
      // console.log(this.ruleForm);
      // this.$refs[ruleForm].validate((valid) => {
        // console.log(this.ruleForm);
        // console.log(valid);
        // if (valid) {
          // alert("submit!");
          // 验证手机号，获取ID
          this.request(this.api.user.userCompany_loginCheckTenantData, {
            phone1: this.ruleForm.phone1,
          }).then((s) => {
            this.tenantId = s[0].id;
            console.log(this.tenantId);
            // 发送登录数据
            this.request(this.api.user.login_loginByPwd, {
              phone1: this.ruleForm.phone1,
              pwd: this.ruleForm.pwd,
              tenantId: this.tenantId,
            }).then((res) => {
              // 存储登陆人名称
              localStorage.setItem("userName", res.userInfo.userName);
              localStorage.setItem("tenantId", res.userInfo.tenantId);
              //存储登录Token
              this.FN_SET_TOKEN(res.token);
              //得到codeData数据
              this.FN_CODESET_LOAD();
              this.$router.push({ path: "/home" });
            });
          // });
        // } else {
        //   console.log("error submit!!");
        //   return false;
        // }
      });
    },
  },
};
</script>

<style lang="less">
.loginPage {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/bg.png");
  // display: flex;
  // justify-content: center;
  // align-items: center;
  position: relative;
  .loginBox {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    // display: table;
    // margin: 0 auto;
    width: 205px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 3%;
    .selectLogin {
      margin: 15px;
      // font-weight: 600;
      .el-form-item__content {
        line-height: 30px;
      }
      .el-input__inner {
        height: 25px;
        padding: 0px 6px;
        // margin: 5px 0px;
      }
      .el-button--primary {
        // margin-top: -25px;
        padding: 5px 45px;
      }
      .el-button--text {
        float: right;
        font-size: 10px;
        margin-top: -20px;
      }
    }
  }
}
</style>>

